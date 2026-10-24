# Portfólio

Vite + React + TypeScript, com Tailwind CSS v4 e Motion (antigo Framer Motion).
Cada projeto é uma página própria do mesmo build.

## Projetos

| # | Projeto | Caminho | Código |
|---|---------|---------|--------|
| 01 | Bossa Cucina — restaurante, site conceitual | `/bossa-cucina/` | `src/projetos/bossa-cucina/` |

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
