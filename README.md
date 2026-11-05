# Portfólio

Vite + React + TypeScript, com Tailwind CSS v4 e Motion (antigo Framer Motion).
Cada projeto é uma página própria do mesmo build.

## Projetos

| # | Projeto | Caminho | Código |
|---|---------|---------|--------|
| 01 | Bossa Cucina — restaurante, site conceitual | `/bossa-cucina/` | `src/projetos/bossa-cucina/` |
| 02 | Gaivota — pousada em Santo André | `/pousada-gaivota/` | `src/projetos/pousada-gaivota/` |
| 03 | Seu Beira Mar — cardápio de restaurante | `/seu-beira-mar/` | `src/projetos/seu-beira-mar/` |
| 04 | Clínica Coral — odontologia e estética | `/clinica-coral/` | `src/projetos/clinica-coral/` |

### Clínica Coral

Site da Clínica Coral (Odontologia & Estética), das dentistas Dra. Julia S.
Moreno e Dra. Ana Carolina. Linguagem moderna: blocos arredondados em grade,
Bricolage Grotesque nos títulos e no texto, e o itálico de alto contraste do
"CORAL" (Bodoni Moda) só nas palavras de destaque. O coral, o vermelho quente
que dá nome à clínica, é a cor de ação; o dourado da logo fica no selo. A
abertura já traz o antes e depois arrastável (`components/AntesDepois.tsx`);
depois vêm um letreiro com os tratamentos, cartões de tratamento que mostram o
antes ao passar o dedo ou o mouse, os alinhadores, os casos, as etapas, a
equipe e o agendamento pelo WhatsApp. O emblema foi extraído da logo e entra
como máscara (`components/Logo.tsx`). Sem preços nem promoções, por causa das
regras do CFO; as referências estão em `docs/clinica-coral-referencias.md`.
Dentistas (nome, CRO, áreas, texto), WhatsApp, telefone, endereço, horários e
Instagram ficam em `src/projetos/clinica-coral/dados.ts`; a foto de cada
dentista entra em `FOTOS`, no `App.tsx` (sem foto, o cartão mostra as iniciais).

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
