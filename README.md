# Portfólio

Vite + React + TypeScript, com Tailwind CSS v4 e Motion (antigo Framer Motion).
Cada projeto é uma página própria do mesmo build.

## Projetos

| # | Projeto | Caminho | Código |
|---|---------|---------|--------|
| 01 | Bossa Cucina — restaurante, site conceitual | `/bossa-cucina/` | `src/projetos/bossa-cucina/` |
| 02 | Gaivota — pousada em Santo André | `/pousada-gaivota/` | `src/projetos/pousada-gaivota/` |
| 03 | Seu Beira Mar — cardápio de restaurante | `/seu-beira-mar/` | `src/projetos/seu-beira-mar/` |
| 04 | Aprile — tecnologia e gestão | `/aprile/` | `aprile/index.html` |
| 05 | Apostila de Cozinha — boas práticas, bases e massas | `/apostila-cozinha/` | `apostila-cozinha/index.html` |

### Aprile

Site da própria empresa (tecnologia e gestão para pousadas e restaurantes da
Costa do Descobrimento), num único arquivo: `aprile/index.html`. Lora nos
títulos, Manrope no texto e as cores do Painel Aprile.

A chave **Pousada / Restaurante** no topo troca a página inteira: título, foto,
números do setor (com fonte), planos, adicionais, a conta de retorno e as
demonstrações. Os planos e preços vêm do Painel Aprile:

- Pousadas: Reputação, Venda Direta e Venda Direta Completo.
- Restaurantes: Reputação, Mesa Cheia e Mesa Cheia + Gestão (dashboard e
  relatório semanais com CMV, DRE e fluxo de caixa, mais engenharia de cardápio).

Demonstrações interativas: atendimento no WhatsApp (pousada e restaurante), site com reserva direta
(espaço para vídeo), guia do quarto por NFC, cardápio em português, espanhol e
inglês, placas de avaliação, cartão fidelidade na carteira do celular (carimbos,
aviso de prêmio e convite para quem some há 30 dias) e o dashboard de gestão (vendas e CMV,
DRE, fluxo de caixa previsto e engenharia de cardápio) com o relatório semanal
imprimível. Há um modo apresentação e endereços diretos como
`#restaurante/gestao` ou `#pousada/guia`.

Cada adicional da tabela abre, pela seta à direita, uma explicação com prazo
e forma de cobrança (textos em `XINFO`, no `<script>`) e o botão **ver
demonstração**, que abre a demonstração numa janela: site em três idiomas, checklist de limpeza, painel de
ocupação e preço, anúncio revisado, Rede Aprile, fila de espera, delivery
próprio e checklist de abertura.

Os itens de cada plano também abrem uma explicação pela seta (textos em
`PINFO`), e todos os itens que não são "Tudo do…" têm demonstração: perfil do
Google, respostas às avaliações, relatório mensal, motor de reservas, links do
Google, ficha do hóspede, reunião mensal, gravação dos vídeos e fichas técnicas. Um **carrinho flutuante** junta plano e adicionais: os botões "Quero o
plano", "Quero esta solução", "Quero este adicional" e "Adicionar ao carrinho"
colocam o item no carrinho (um plano por tipo de negócio), que mostra o total de
implantação e de mensalidade e envia o pedido pelo WhatsApp. Para o texto do
pedido já chegar escrito na conversa, preencha `WHATSAPP_NUMERO` (DDI + DDD +
número, só dígitos); sem ele, o texto é copiado e o link de `WHATSAPP` é aberto.

**Hub do cliente** (`aprile/hub/index.html`, publicado em `/aprile/hub/`):
protótipo clicável do sistema que o dono usa, com dados de exemplo e a chave
Restaurante / Pousada. Módulos: Início (o que precisa de atenção hoje),
Cardápio ou Guia e site (edita nos três idiomas e publica, com prévia no
celular), Gestão (visão geral, fichas técnicas, DRE, fluxo de caixa e
relatórios semanais), Operação ou Quartos (checklists, fila, delivery, status
dos quartos e manutenção), Clientes ou Hóspedes (fidelidade, convites e
pesquisa pós-estadia) e Conta (plano, adicionais e cadastro da equipe).
No restaurante: fichas técnicas com ingredientes editáveis, modelos de checklist
editáveis, pedidos do bot para marcar como lançados no sistema da casa e fila de
espera com cronômetro depois do aviso (alerta em todo o Hub, +5 minutos ou passar
a vez; quem passa 3 vezes sai). Na pousada, cada quarto pode ter o
checklist de limpeza próprio (ou usar o padrão da pousada), com itens de marcar
ou de foto obrigatória e a opção de aplicar o mesmo checklist a outros quartos.
A fila abre numa tela própria para a recepção em
`/aprile/hub/#restaurante/fila-tela` e fica sincronizada entre as abas.
Cartão fidelidade: em Clientes, "Ler cartão" abre a câmera e lê o QR Code do
cartão (BarcodeDetector ou jsQR, que fica em `aprile/hub/vendor/` e só carrega
quando precisa). Também dá para buscar pelo código de 6 dígitos, pelo nome ou
pelo WhatsApp. A ficha do cliente adiciona ponto (por visita ou pelo valor da
conta, com limite de 1 por dia que só a gerência libera), resgata o prêmio e
mostra o histórico, que pode ser desfeito. O cartão como o cliente vê na
carteira fica em `/aprile/hub/#restaurante/cartao`, nos modelos da Apple Wallet
(storeCard: selos na faixa `strip`, regra e termos no verso) e do Google Wallet
(loyalty: selos no `heroImage`, regra nos detalhes), com a opção de mostrar o
nome de cada campo e a prévia do aviso de ponto. A câmera só abre em https.
Avaliações, conversas do WhatsApp e reservas ficam fora, nos sistemas de origem.

Para pôr o vídeo do site, preencha `VIDEO_SITE` no início do `<script>` com um
link do YouTube ou o caminho de um `.mp4`. Planos, adicionais e o link do
WhatsApp ficam nas constantes do mesmo bloco.

### Seu Beira Mar

Cardápio visual de um restaurante de frutos do mar na praia, pensado para abrir
pela etiqueta NFC da mesa. A página desce do mar (azul fundo, no topo) até a
areia, com ondas em SVG entre as seções; Playfair Display + Karla, coral só nos
preços e nos botões. Cada prato é um cartão com a miniatura do seu vídeo; tocar
nele abre um player em tela cheia, como os stories, onde deslizar para o lado
passa de um prato ao outro e tocar pausa. O player esconde os controles e as
faixas de título do YouTube (`components/Player.tsx`). Uma barra de categorias
acompanha a rolagem. Pratos, preços, link do vídeo de cada prato (campo `video`), horários,
endereço e WhatsApp ficam em `src/projetos/seu-beira-mar/dados.ts`.

### Gaivota

Site de uma pousada na beira do rio, a poucos metros da praia, em Santo André
(Santa Cruz Cabrália, BA). Inspirado em hotelaria de luxo silenciosa: fundo de
areia, serifa leve (Newsreader) com uma frase em itálico, fotos grandes e muito
espaço. As cores saem da logo, redesenhada em vetor em `components/Logo.tsx`.
O vídeo da abertura, vertical, ocupa a tela no celular e fica num arco, como o
portão da pousada, no computador. Reservas pelo WhatsApp: preencha `WHATSAPP`
em `src/projetos/pousada-gaivota/dados.ts`.

### Bossa Cucina

Redesenho minimalista do site de uma casa de massas à beira do rio. A parede do
salão tem uma linha preta que desenha o rio; aqui essa linha é o site inteiro:
desce pelas margens, atravessa a página entre as seções e se desenha conforme a
rolagem (`components/Rio.tsx`). Tipografia Instrument Serif + Albert Sans, o
lema em Covered By Your Grace, e verde-oliva só na seção do rio.

Para ativar o envio da reserva pelo WhatsApp, preencha `WHATSAPP` em
`src/projetos/bossa-cucina/dados.ts`.

## Comandos

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção em dist/
npm run lint     # oxlint

# Um projeto como um único .html (código, fontes e fotos embutidos),
# para abrir direto no celular sem servidor. Sai em dist-arquivo/<projeto>/index.html
PROJETO=bossa-cucina npm run build:arquivo
```

## Estrutura

- `src/App.tsx` — índice do portfólio
- `src/projetos/<nome>/` — código de cada projeto; a página de entrada fica em `<nome>/index.html`
- `src/lib/utils.ts` — helper `cn()` para combinar classes Tailwind
- `components.json` — configuração shadcn; componentes vão para `src/components/ui`
- Alias `@/` aponta para `src/`

## Ferramentas de IA

- `.claude/skills/` — skills UI/UX Pro Max e 21st.dev
- `.mcp.json` — servidor MCP do 21st.dev; defina `API_KEY_21ST` (chave em https://21st.dev/mcp)

### Apostila de Cozinha

Link publicado (GitHub Pages): https://zaqueuaprile.github.io/zaz/apostila-cozinha/

Presente de despedida do Zaqueu para a equipe de um restaurante de massas
italianas, num único arquivo: `apostila-cozinha/index.html` (HTML, CSS e JS
juntos, sem build e sem dependências; as fontes Young Serif, Lexend e Caveat
vêm do Google Fonts, com fonte do sistema como reserva). Todo o conteúdo e
todos os números vêm da apostila; o que está vazio nela aparece como
"a completar".

Além da apostila original, a página traz as receitas passadas depois pelo
Zaqueu, todas em gramas: a massa fresca da casa (com ovos e gemas em gramas),
as massas do chifferi e do cavatelli e o pão focaccia da casa (com contador de
dobras). Também tem a seção 4.5 Facas e cortes e a 4.6 Amolar a faca e usar a
chaira, e uma frase sobre gastronomia em cada parte.

A equipe também pode criar os próprios POPs e checklists, com um assistente
que explica cada parte (nome, quando, material, passos, porquê; ou nome,
momento e itens), revisa o texto enquanto a pessoa escreve (verbo no começo,
uma ação por passo, números em vez de palavras vagas, cronômetro quando o
passo tem tempo) e confere tudo no fim. O que é criado fica no aparelho
(`localStorage`) e funciona como os da apostila; o botão Compartilhar gera um
link `#importar-…` que guarda o POP ou a lista no celular de quem abrir.

Ferramentas por parte: progresso de leitura; termômetro interativo e gerador
de etiqueta; POPs passo a passo com cronômetros e calculadora de solução
clorada; checklists salvos no aparelho com "novo turno" e impressão; mapa dos
métodos, diagnóstico "fritando ou cozinhando?", quiz, cortes clássicos em escala e "chaira ou pedra?"; árvore dos molhos e
calculadoras de mirepoix, roux e bechamel, mais "salve o seu molho"; caminho
da massa, calculadora da massa da casa e da panela, guia de formatos e
cronômetro; cardápio com busca e anotação da regulagem da máquina; fichas
técnicas escaláveis com a conta explicada, lista de produção e compras e
modo cozinha (Wake Lock); glossário com busca e flashcards. Os dados ficam no
`<script>` marcado como DADOS e o progresso, no `localStorage` do aparelho.
