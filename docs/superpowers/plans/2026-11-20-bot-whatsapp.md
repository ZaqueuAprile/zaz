# Bot de WhatsApp da Aprile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Atendente automático no WhatsApp de cada restaurante, que responde dúvidas a partir dos dados da casa e passa a conversa para a equipe quando precisa.

**Architecture:** A uazapi entrega cada mensagem a uma Supabase Edge Function (`whatsapp-webhook`). A lógica fica em módulos TypeScript puros em `supabase/functions/_shared/bot/`, sem APIs do Deno, testados com Vitest no Node; só o arquivo de entrada usa `Deno.serve`. Dados em Postgres (Supabase), IA pelo SDK oficial da Anthropic.

**Tech Stack:** TypeScript, Supabase (Postgres + Edge Functions/Deno), `@anthropic-ai/sdk`, `@supabase/supabase-js`, Vitest, uazapi (HTTP).

**Spec:** `docs/superpowers/specs/2026-11-20-bot-whatsapp-design.md`

## Global Constraints

- Modelo: `claude-haiku-5-5`, lido de `BOT_MODEL` (padrão `claude-haiku-5-5`); esforço `output_config.effort: "low"`; `max_tokens: 1024`; não enviar `temperature`, `thinking: {type:"disabled"}` nem prefill.
- SDK oficial `@anthropic-ai/sdk` (mesmo pacote no Node e, por `deno.json`, como `npm:@anthropic-ai/sdk` no Deno); nada de `fetch` direto para a Anthropic.
- Antes de escrever a chamada à IA, ler `typescript/claude-api/README.md` e `typescript/claude-api/tool-use.md` (seção de saída estruturada) do skill `claude-api`.
- Segredos só por variável de ambiente: `ANTHROPIC_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `WEBHOOK_SECRET`, `UAZAPI_BASE_URL`. Token de cada instância uazapi fica na tabela `restaurants` (acesso só pela service role).
- Pausa por passagem à equipe: padrão 12 horas (`restaurants.handoff_hours`).
- Histórico enviado à IA: últimas 12 mensagens da conversa.
- Atraso antes de responder: 1,5 a 3 s, com presença "digitando".
- Nunca enviar mensagem a quem não escreveu, exceto o alerta para `restaurants.team_phone`.
- Ignorar: grupos, status/broadcast, mensagens enviadas pela API (eco do próprio bot).
- Idiomas: pt, es, en.
- Textos fixos ao cliente (copiar exatamente):
  - mídia sem texto: pt `"Por aqui eu leio só mensagens de texto. Pode escrever a sua dúvida? Se preferir, chamo alguém da equipe."` · es `"Por aquí solo leo mensajes de texto. ¿Puedes escribir tu pregunta? Si prefieres, llamo a alguien del equipo."` · en `"I can only read text messages here. Could you type your question? If you prefer, I can call someone from the team."`
  - falha da IA: pt `"Já vou chamar alguém da equipe para te responder."` · es `"Ya llamo a alguien del equipo para responderte."` · en `"I'll get someone from the team to answer you."`
  - alerta à equipe: `"[Aprile] Conversa com {telefone} passou para a equipe. Motivo: {motivo}. Última mensagem: \"{texto}\""`

## Review Focus

- Webhook repetido (mesmo `externalId` duas vezes) → uma resposta só. Teste em Task 6.
- Eco da mensagem que o próprio bot enviou (fromMe + enviada pela API) → não pausa a conversa. Teste em Task 6.
- Cliente manda áudio, foto ou figurinha → recebe uma vez o texto fixo de "só leio texto", sem chamar a IA. Teste em Task 6 (decisão minha; o desenho dizia só ignorar, mas ficar mudo com áudio é pior para o cliente).
- A Anthropic falha ou demora → cliente recebe o texto fixo de falha, conversa pausa e a equipe é alertada; o webhook responde 200 mesmo assim. Teste em Task 6.
- Conversa pausada → mensagens do cliente são guardadas sem resposta; ao passar `paused_until`, o bot volta a responder. Teste em Task 2 e Task 6.

---

## File Structure

```
supabase/
  config.toml                         # gerado por `supabase init` (se a CLI estiver disponível) ou mínimo à mão
  deno.json                           # import map: @anthropic-ai/sdk, @supabase/supabase-js → npm:
  migrations/20261120000000_bot.sql   # tabelas do bot
  functions/
    whatsapp-webhook/index.ts         # entrada Deno: lê env, monta deps, chama handleWebhook
    _shared/bot/
      types.ts        # tipos de domínio
      uazapi.ts       # adaptador uazapi: parse do webhook, enviar texto, digitando
      rules.ts        # filtros, pausa, textos fixos, idioma
      knowledge.ts    # formato dos dados do restaurante + montagem do prompt
      brain.ts        # chamada à Claude com saída estruturada
      store.ts        # interface Store, FakeStore (memória) e SupabaseStore
      handler.ts      # orquestração do webhook
      fixtures/uazapi-message.json   # payload real capturado (ver Task 1)
      *.test.ts
bot/restaurantes/exemplo.json         # dados de exemplo de um restaurante
scripts/bot/carregar-dados.ts         # sobe um JSON de restaurante para o Supabase
scripts/bot/simular.ts                # conversa no terminal com a IA, sem WhatsApp
vitest.config.ts                      # inclui supabase/functions/**/*.test.ts
```

---

### Task 1: Tipos, dependências e adaptador da uazapi

**Files:**
- Modify: `package.json` (devDependencies: `vitest`, `@anthropic-ai/sdk`, `@supabase/supabase-js`, `tsx`; script `"test:bot": "vitest run supabase/functions"`)
- Create: `vitest.config.ts`, `supabase/deno.json`, `supabase/functions/_shared/bot/types.ts`, `supabase/functions/_shared/bot/uazapi.ts`, `supabase/functions/_shared/bot/fixtures/uazapi-message.json`
- Test: `supabase/functions/_shared/bot/uazapi.test.ts`

**Interfaces:**
- Produces (`types.ts`):
  - `type Lang = "pt" | "es" | "en"`
  - `interface IncomingMessage { instance: string; externalId: string; phone: string; fromMe: boolean; sentByApi: boolean; isGroup: boolean; isStatus: boolean; kind: "text" | "media" | "other"; text: string; senderName?: string; at: Date }`
  - `interface Restaurant { id: string; name: string; instance: string; instanceToken: string; teamPhone: string; defaultLang: Lang; handoffHours: number; active: boolean }`
  - `type Direction = "client" | "bot" | "team"`
  - `interface StoredMessage { direction: Direction; text: string; at: Date }`
  - `interface Conversation { id: string; restaurantId: string; phone: string; lang: Lang | null; pausedUntil: Date | null }`
- Produces (`uazapi.ts`):
  - `parseWebhook(body: unknown): IncomingMessage | null` — `null` para eventos que não são mensagem.
  - `interface UazapiClient { sendText(to: string, text: string): Promise<void>; sendTyping(to: string, ms: number): Promise<void> }`
  - `createUazapiClient(baseUrl: string, instanceToken: string, fetchFn?: typeof fetch): UazapiClient`

- [ ] **Step 1: Capturar um payload real** — a documentação da uazapi não abriu na sessão de desenho. Com a instância de teste conectada, apontar o webhook para um coletor (ex.: webhook.site) e salvar uma mensagem de texto recebida, uma enviada pelo celular e uma de áudio em `fixtures/uazapi-message.json` como `{ "text": {...}, "fromPhone": {...}, "audio": {...} }`. Conferir na doc os endpoints de enviar texto e presença. Se ainda não houver instância, usar o formato da doc em `docs.uazapi.com` e marcar o arquivo com `"_origem": "documentação"`.
- [ ] **Step 2: Escrever os testes que falham** em `uazapi.test.ts`:
  - `parseWebhook(fixture.text)` → `kind "text"`, `text` igual ao do payload, `fromMe false`, `phone` só com dígitos e DDI (ex.: `"5573999990000"`), `externalId` não vazio.
  - `parseWebhook(fixture.fromPhone)` → `fromMe true`, `sentByApi false`.
  - `parseWebhook(fixture.audio)` → `kind "media"`, `text ""`.
  - `parseWebhook({})` e `parseWebhook({ EventType: "connection" })` → `null`.
  - `createUazapiClient("https://x.uazapi.com","tok", fakeFetch).sendText("5573...", "oi")` chama `fakeFetch` uma vez com o caminho de envio de texto da doc, header de token `tok` e corpo com número e texto.
- [ ] **Step 3: Rodar** `npx vitest run supabase/functions/_shared/bot/uazapi.test.ts` — esperado: FAIL (módulo não existe).
- [ ] **Step 4: Implementar** `types.ts` e `uazapi.ts` conforme a interface. Todo conhecimento de nomes de campo da uazapi fica só em `uazapi.ts`. `sendTyping` usa o endpoint de presença com `composing`; se a doc não tiver, vira no-op documentado.
- [ ] **Step 5: Rodar** o mesmo comando — esperado: PASS.
- [ ] **Step 6: Commit** `feat(bot): tipos e adaptador da uazapi`.

### Task 2: Regras (filtros, pausa, idioma, textos fixos)

**Files:**
- Create: `supabase/functions/_shared/bot/rules.ts`
- Test: `supabase/functions/_shared/bot/rules.test.ts`

**Interfaces:**
- Consumes: `IncomingMessage`, `Conversation`, `Lang` (Task 1).
- Produces:
  - `classify(msg: IncomingMessage): "ignore" | "team" | "client"` — ignore: grupo, status, `sentByApi`; team: `fromMe && !sentByApi`; client: o resto.
  - `isPaused(conv: Conversation, now: Date): boolean`
  - `pauseUntil(now: Date, hours: number): Date`
  - `wantsHuman(text: string): boolean` — pedido explícito de atendente/pessoa/humano, em pt/es/en.
  - `FIXED: Record<"media" | "failure", Record<Lang, string>>` — textos da seção Global Constraints.
  - `teamAlert(phone: string, reason: string, lastText: string): string`

- [ ] **Step 1: Testes que falham:**
  - `classify` com grupo → `"ignore"`; `fromMe:true, sentByApi:true` → `"ignore"`; `fromMe:true, sentByApi:false` → `"team"`; texto normal → `"client"`.
  - `isPaused({pausedUntil: null}, now)` → false; `pausedUntil` 1 min no futuro → true; 1 min no passado → false.
  - `pauseUntil(new Date("2026-11-20T12:00:00Z"), 12)` → `2026-11-21T00:00:00.000Z`.
  - `wantsHuman("quero falar com um atendente")`, `("hablar con una persona")`, `("can I talk to a human?")` → true; `("qual o horário?")` → false.
  - `teamAlert("5573999990000","pediu atendente","oi")` → string exata do formato da Global Constraints.
- [ ] **Step 2: Rodar** `npx vitest run supabase/functions/_shared/bot/rules.test.ts` — FAIL.
- [ ] **Step 3: Implementar** `rules.ts` (`wantsHuman` por lista de expressões normalizadas sem acento).
- [ ] **Step 4: Rodar** — PASS.
- [ ] **Step 5: Commit** `feat(bot): regras de filtro, pausa e textos fixos`.

### Task 3: Dados do restaurante e prompt

**Files:**
- Create: `supabase/functions/_shared/bot/knowledge.ts`, `bot/restaurantes/exemplo.json`
- Test: `supabase/functions/_shared/bot/knowledge.test.ts`

**Interfaces:**
- Consumes: `Restaurant`, `Lang`, `StoredMessage`.
- Produces:
  - `interface Dish { category: string; name: string; description?: string; price: number; available: boolean; tags?: string[] }`
  - `interface Knowledge { hours: string; address: string; payment: string; delivery: string; houseRules: string[]; faq: { q: string; a: string }[]; menu: Dish[]; tone?: string }`
  - `validateKnowledge(data: unknown): Knowledge` — lança `Error` com o campo inválido.
  - `buildSystemPrompt(r: Restaurant, k: Knowledge): string` — determinístico (mesma entrada → mesma string, sem data/hora), para o cache de prompt funcionar.
  - `buildMessages(history: StoredMessage[], incoming: string): { role: "user" | "assistant"; content: string }[]` — últimas 12, `client`/`team` → user (team prefixado com `"[equipe] "`), `bot` → assistant; junta mensagens seguidas do mesmo papel; termina com `incoming` como user.

- [ ] **Step 1: Testes que falham:**
  - `validateKnowledge(exemplo.json)` passa; sem `menu` lança erro citando `menu`; prato com `price: "dez"` lança erro citando `price`.
  - `buildSystemPrompt` contém o nome do restaurante, cada prato disponível com preço formatado `R$ 42,00`, NÃO contém prato com `available:false`, contém a instrução de responder só com os dados fornecidos e no idioma do cliente, e é igual em duas chamadas.
  - `buildMessages` com 20 mensagens no histórico devolve no máximo 13 itens, primeiro com `role "user"`, último igual a `incoming`.
- [ ] **Step 2: Rodar** `npx vitest run supabase/functions/_shared/bot/knowledge.test.ts` — FAIL.
- [ ] **Step 3: Implementar** `knowledge.ts` e o `exemplo.json` (um restaurante fictício, 8 pratos, 1 indisponível). O prompt: papel (atendente do restaurante X no WhatsApp), regras (só os dados abaixo; respostas curtas de até 3 frases; sem inventar preço, prato, horário ou promoção; quando faltar a informação, dizer que vai confirmar com a equipe e pedir passagem; reclamação, evento ou grupo grande → passagem; responder no idioma do cliente entre pt/es/en), depois os dados.
- [ ] **Step 4: Rodar** — PASS.
- [ ] **Step 5: Commit** `feat(bot): dados do restaurante e prompt`.

### Task 4: Cérebro (Claude com saída estruturada)

**Files:**
- Create: `supabase/functions/_shared/bot/brain.ts`
- Test: `supabase/functions/_shared/bot/brain.test.ts`

**Interfaces:**
- Consumes: `buildSystemPrompt`, `buildMessages` (Task 3).
- Produces:
  - `interface BrainReply { reply: string; handoff: boolean; reason: string; lang: Lang; usage: { input: number; output: number; cacheRead: number } }`
  - `askBrain(client: Anthropic, opts: { model: string; system: string; messages: Anthropic.MessageParam[] }): Promise<BrainReply>` — lança em erro de API, `stop_reason` `refusal` ou `max_tokens`, ou JSON inválido; quem chama trata.

- [ ] **Step 1: Testes que falham** (cliente falso com `messages.create` que registra os parâmetros e devolve uma `Message` montada):
  - envia `model` recebido, `max_tokens: 1024`, `output_config.effort: "low"`, `system` como bloco de texto com `cache_control: {type:"ephemeral"}`, e `output_config.format` de JSON schema com `reply`, `handoff`, `reason`, `lang` (enum pt/es/en), todos obrigatórios.
  - resposta `{"reply":"Abrimos às 18h","handoff":false,"reason":"","lang":"pt"}` → `BrainReply` igual, com `usage` lido de `response.usage` (`cache_read_input_tokens` → `cacheRead`).
  - `stop_reason: "refusal"` → rejeita.
  - texto que não é JSON → rejeita.
- [ ] **Step 2: Rodar** `npx vitest run supabase/functions/_shared/bot/brain.test.ts` — FAIL.
- [ ] **Step 3: Implementar** `askBrain` com `client.messages.create` (não-streaming), lendo o primeiro bloco `text` e fazendo `JSON.parse`; formato exato do `output_config.format` conforme `typescript/claude-api/tool-use.md` do skill `claude-api`.
- [ ] **Step 4: Rodar** — PASS.
- [ ] **Step 5: Commit** `feat(bot): chamada à Claude com saída estruturada`.

### Task 5: Banco e armazenamento

**Files:**
- Create: `supabase/migrations/20261120000000_bot.sql`, `supabase/functions/_shared/bot/store.ts`
- Test: `supabase/functions/_shared/bot/store.test.ts` (testa o `FakeStore`; o `SupabaseStore` é verificado na Task 7 contra um projeto real)

**Interfaces:**
- Produces:
  - `interface Store { restaurantByInstance(instance: string): Promise<{ restaurant: Restaurant; knowledge: Knowledge } | null>; conversation(restaurantId: string, phone: string): Promise<Conversation>; saveMessage(convId: string, m: StoredMessage & { externalId?: string; tokens?: BrainReply["usage"] }): Promise<"saved" | "duplicate">; history(convId: string, limit: number): Promise<StoredMessage[]>; setPause(convId: string, until: Date | null): Promise<void>; setLang(convId: string, lang: Lang): Promise<void>; }`
  - `class FakeStore implements Store` (memória, com `seed(restaurant, knowledge)` e campos públicos para inspeção nos testes)
  - `createSupabaseStore(url: string, serviceKey: string): Store`
- SQL: `restaurants(id uuid pk, name, cnpj, instance unique, instance_token, team_phone, default_lang, handoff_hours int default 12, active bool default true)`, `knowledge(restaurant_id fk unique, data jsonb, published_at)`, `conversations(id uuid pk, restaurant_id fk, phone, lang, paused_until timestamptz, unique(restaurant_id, phone))`, `messages(id uuid pk, conversation_id fk, direction text check in ('client','bot','team'), text, external_id text unique, input_tokens int, output_tokens int, cache_read_tokens int, created_at timestamptz default now())`; RLS ligado em todas, sem políticas (só a service role acessa).

- [ ] **Step 1: Testes que falham** no `FakeStore`: `conversation()` cria na primeira chamada e devolve a mesma na segunda; `saveMessage` com o mesmo `externalId` duas vezes → `"saved"` depois `"duplicate"`; `history(id, 12)` devolve as últimas 12 em ordem cronológica.
- [ ] **Step 2: Rodar** `npx vitest run supabase/functions/_shared/bot/store.test.ts` — FAIL.
- [ ] **Step 3: Implementar** a migração e `store.ts`. No `SupabaseStore`, `saveMessage` trata a violação de `unique(external_id)` (código Postgres `23505`) como `"duplicate"`.
- [ ] **Step 4: Rodar** — PASS.
- [ ] **Step 5: Commit** `feat(bot): banco e armazenamento`.

### Task 6: Orquestração do webhook

**Files:**
- Create: `supabase/functions/_shared/bot/handler.ts`
- Test: `supabase/functions/_shared/bot/handler.test.ts`

**Interfaces:**
- Consumes: tudo das Tasks 1–5.
- Produces:
  - `interface Deps { store: Store; uazapi: (r: Restaurant) => UazapiClient; brain: (system: string, messages: Anthropic.MessageParam[]) => Promise<BrainReply>; now: () => Date; sleep: (ms: number) => Promise<void>; log: (event: string, data: Record<string, unknown>) => void }`
  - `handleWebhook(deps: Deps, body: unknown): Promise<{ status: 200; outcome: "ignored" | "duplicate" | "team" | "paused" | "media" | "replied" | "handoff" | "failure" | "unknown_instance" }>` — nunca lança; sempre status 200 para a uazapi não reenviar.

Fluxo: parse → `null` ignored → restaurante pela instância (inexistente ou inativo → unknown_instance) → `classify` (ignore → ignored; team → salva como team, pausa por `handoffHours`, outcome team) → conversa → salva como client (duplicate → para) → pausada → paused → mídia → texto fixo `media` no idioma da conversa (ou `defaultLang`) e media → `wantsHuman` → passagem → senão brain; erro → texto fixo `failure`, pausa, alerta, failure; `handoff:true` → envia `reply`, pausa, alerta, handoff; senão espera (1500–3000 ms com `sendTyping`), envia, salva como bot com tokens, `setLang`, replied.

- [ ] **Step 1: Testes que falham** (FakeStore, uazapi falso que registra envios, brain falso, `sleep` instantâneo):
  - texto normal → outcome `replied`, um `sendText` para o cliente com o `reply` do brain, mensagem do bot salva.
  - **mesmo body duas vezes** → segunda chamada `duplicate`, total de 1 `sendText`.
  - **eco do bot** (`fromMe:true, sentByApi:true`) → `ignored`, conversa não pausada.
  - mensagem da equipe pelo celular (`fromMe:true, sentByApi:false`) → `team`; mensagem seguinte do cliente → `paused`, nenhum `sendText`.
  - **pausa vencida**: com `now` 13 h depois → próxima mensagem do cliente → `replied`.
  - **áudio** → `media`, `sendText` com o texto fixo pt, brain não chamado.
  - "quero falar com um atendente" → `handoff`, cliente recebe resposta, `teamPhone` recebe o alerta, conversa pausada.
  - brain com `handoff:true` → idem.
  - **brain lança erro** → `failure`, cliente recebe texto fixo de falha, alerta enviado à equipe, retorno com status 200.
  - grupo → `ignored`; instância desconhecida → `unknown_instance`; nenhum envio nos dois.
- [ ] **Step 2: Rodar** `npx vitest run supabase/functions/_shared/bot/handler.test.ts` — FAIL.
- [ ] **Step 3: Implementar** `handleWebhook` conforme o fluxo, com `try/catch` em volta de tudo (erro inesperado → log e outcome `failure` sem envio, se ainda não houver conversa).
- [ ] **Step 4: Rodar** `npm run test:bot` — todos PASS.
- [ ] **Step 5: Commit** `feat(bot): orquestração do webhook`.

### Task 7: Função no ar, carga de dados e simulador

**Files:**
- Create: `supabase/functions/whatsapp-webhook/index.ts`, `scripts/bot/carregar-dados.ts`, `scripts/bot/simular.ts`, `supabase/config.toml` (se `npx supabase init` não puder rodar, mínimo com `[functions.whatsapp-webhook] verify_jwt = false`)
- Modify: `README.md` (seção "Bot de WhatsApp": variáveis, como carregar dados, como simular, como publicar)

**Interfaces:**
- Consumes: `handleWebhook`, `createSupabaseStore`, `createUazapiClient`, `askBrain`, `validateKnowledge`, `buildSystemPrompt`, `buildMessages`.

- [ ] **Step 1: `index.ts`** — `Deno.serve`: só aceita `POST`; confere `?k=` contra `WEBHOOK_SECRET` (diferente → 401 sem processar); monta `Deps` com env, `new Anthropic()` e `askBrain` com `BOT_MODEL ?? "claude-haiku-5-5"`; responde 200 com o `outcome`.
- [ ] **Step 2: `simular.ts`** — `npx tsx scripts/bot/simular.ts bot/restaurantes/exemplo.json`: lê o JSON, valida, conversa no terminal usando `askBrain` real (precisa de `ANTHROPIC_API_KEY`) e mostra resposta, `handoff`, idioma e tokens a cada turno. Verificar: perguntar horário em pt, um prato em inglês, um prato que não existe (deve dizer que confirma com a equipe e marcar `handoff`).
- [ ] **Step 3: `carregar-dados.ts`** — `npx tsx scripts/bot/carregar-dados.ts <arquivo.json> --instance <id> --token <tok> --team <telefone>`: valida e faz upsert de `restaurants` + `knowledge`. Verificar no painel do Supabase que as linhas apareceram.
- [ ] **Step 4: Publicar e testar ponta a ponta** (com as contas criadas): `npx supabase db push`, `npx supabase secrets set ...`, `npx supabase functions deploy whatsapp-webhook --no-verify-jwt`; configurar o webhook da instância uazapi para `https://<projeto>.functions.supabase.co/whatsapp-webhook?k=<WEBHOOK_SECRET>` só com o evento de mensagens. Mandar mensagem de outro celular: resposta chega em até ~10 s; responder pelo celular da casa e confirmar que o bot para.
- [ ] **Step 5: Commit** `feat(bot): função no ar, carga de dados e simulador`.
