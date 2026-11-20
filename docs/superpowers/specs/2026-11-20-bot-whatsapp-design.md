# Bot de WhatsApp da Aprile — desenho

Data: 20/11/2026 · Aprovado pelo Zaqueu na conversa de 20/11/2026.

## Para que serve

A Aprile vendeu ao primeiro cliente (dois restaurantes, um CNPJ cada) um atendente
automático no WhatsApp. É a primeira entrega do contrato (semanas 1 e 2) e a primeira
peça de servidor da Aprile: a mesma base de dados vira depois o Hub de verdade.

O cliente do restaurante manda mensagem no número da casa e recebe resposta na hora,
a qualquer hora, em português, espanhol ou inglês: horário, endereço, cardápio, preços,
entrega, restrições alimentares, formas de pagamento. Quando a conversa pede uma pessoa,
o bot avisa a equipe e para de responder.

## Metas

- Responder dúvidas com base só nos dados de cada restaurante (cardápio, horários,
  perguntas frequentes, regras da casa). Cada número fala só do próprio restaurante.
- Responder no idioma do cliente (pt, es, en).
- Passar a conversa para a equipe: quando o cliente pede uma pessoa, quando o bot não
  sabe, em reclamação, e sempre que alguém da equipe responde pelo celular.
- Funcionar para vários restaurantes com o mesmo código (multi-cliente), cada um com a
  própria conexão de WhatsApp.

## Fora desta entrega (vêm depois)

- Fila de espera e pedidos de delivery pelo WhatsApp (semanas 5 e 6, junto com o Hub).
- Envio de campanhas e convites do cartão fidelidade.
- Tela do Hub para editar os dados do bot: nesta fase os dados são carregados pela Aprile.

## O que seria fracasso, mesmo funcionando

- Inventar preço, prato, horário ou promessa que não está nos dados do restaurante.
- Responder por cima da equipe depois que uma pessoa entrou na conversa.
- Mandar mensagem para quem não escreveu (envios em massa): aumenta o risco de bloqueio
  do número na API não oficial.
- Expor dados de um restaurante no número do outro.
- Responder em grupos, a status ou a mensagens do próprio número.

## Restrições

- Conexão do WhatsApp pela **uazapi** (API não oficial, um número por instância, conectado
  por QR Code; o celular da casa continua com o WhatsApp). Risco de bloqueio aceito pelo
  dono e registrado na cláusula 8 do contrato padrão.
- Anti-bloqueio: só responde a quem iniciou a conversa, atraso curto antes de responder
  (com "digitando"), nada de envios em massa.
- Servidor: **Supabase** (Postgres + Edge Functions em Deno/TypeScript). Hoje o repositório
  só tem páginas estáticas no GitHub Pages.
- IA: **Claude Haiku 5.5** (`claude-haiku-5-5`), escolha do dono pelo menor custo
  ($0,10 / $0,50 por milhão de tokens de entrada / saída), via SDK oficial
  `@anthropic-ai/sdk`. Modelo e esforço ficam em configuração para trocar sem mexer no código.
- Segredos (chave da Anthropic, tokens da uazapi, chave de serviço do Supabase) ficam em
  segredos do Supabase, nunca no repositório.

## Abordagens consideradas

1. **Supabase Edge Functions + Postgres (escolhida).** Recebe o webhook, guarda tudo no
   banco que o Hub vai usar, custo zero no começo. Troca: Deno e o limite de tempo das
   funções; a resposta da IA cabe folgado nesse limite.
2. **Servidor Node próprio (VPS) com n8n ou código.** Mais controle, mas é uma máquina para
   manter e pagar, e o Hub precisaria de outro banco.
3. **Plataforma pronta de chatbot.** Mais rápida no primeiro dia, mas cobra por número e
   não vira a base do Hub nem do produto da Aprile.

## Como funciona

```
cliente → WhatsApp → uazapi ──webhook──► Edge Function `whatsapp-webhook`
                                            │ 1. valida segredo do webhook e acha o restaurante pela instância
                                            │ 2. ignora grupo, status, mídia sem texto, mensagem repetida
                                            │ 3. mensagem da equipe pelo celular → pausa o bot na conversa
                                            │ 4. guarda a mensagem; se a conversa está pausada, para aqui
                                            │ 5. monta o contexto: dados do restaurante + últimas mensagens
                                            │ 6. Claude Haiku 5.5 responde (ou pede passagem para a equipe)
                                            │ 7. espera curta + "digitando" e envia pela uazapi
                                            └ 8. guarda a resposta e o uso de tokens
```

### Dados (Postgres)

- `restaurants`: nome, CNPJ, fuso, idioma padrão, ativo, e a instância uazapi
  (identificador e token, o token em segredo/tabela restrita).
- `knowledge`: por restaurante, em texto/JSON: horários, endereço, formas de pagamento,
  entrega, cardápio (categoria, prato, descrição, preço, disponível, restrições), regras da
  casa, perguntas frequentes. Uma versão "publicada" por restaurante.
- `conversations`: restaurante + telefone do cliente, idioma detectado, `paused_until`
  (pausa por passagem à equipe), última mensagem.
- `messages`: conversa, direção (cliente / bot / equipe), texto, id externo da uazapi
  (para não processar duas vezes), data, tokens usados.

### Regras de passagem para a equipe

- Pausa a conversa por um período configurável (padrão 12 horas) quando: alguém responde
  pelo celular da casa; o cliente pede atendente; a IA marca que não sabe ou que é
  reclamação; o assunto é reserva de grupo grande ou evento.
- Ao passar, o bot avisa o cliente ("vou chamar alguém da equipe") e manda um alerta para
  o WhatsApp de contato da equipe configurado no restaurante.
- Volta sozinho depois do período, ou quando a Aprile/equipe reativa.

### IA

- System prompt fixo por restaurante (instruções + dados publicados), com cache de prompt
  para baratear as mensagens seguintes; histórico curto (últimas ~12 mensagens).
- Saída estruturada: texto da resposta + flag de passagem à equipe + motivo + idioma.
- Respostas curtas, tom do restaurante, sem inventar; quando falta a informação, diz que
  vai confirmar com a equipe e passa a conversa.
- Esforço baixo e `max_tokens` pequeno para resposta de chat.

### Custo estimado da IA

Por mensagem respondida: ~5 mil tokens de entrada (grande parte em cache) e ~200 de
saída, cerca de US$ 0,0006. Mil mensagens por mês por restaurante dão menos de US$ 1
(uns R$ 5). A uazapi custa cerca de R$ 29 a 38 por mês para os dois números.

## Decidido pelo dono

- uazapi como conexão; Supabase como servidor; IA da Claude no modelo mais econômico;
  primeira entrega só com dúvidas e passagem para a equipe.

## Deixado para quem constrói

- Formato exato do webhook e dos endpoints da uazapi (a documentação não abriu nesta
  sessão): isolar num adaptador `uazapi.ts` e confirmar com uma mensagem real capturada.
- Testes com o Deno test runner, com a uazapi e a Anthropic falsas nos testes.
- Script para carregar os dados de cada restaurante a partir de um arquivo JSON.
- Um simulador local de conversa para a equipe testar antes de ligar o número.
