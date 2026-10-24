# Zaz

Vite + React + TypeScript, com Tailwind CSS v4 e Motion (antigo Framer Motion).

## Comandos

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção em dist/
npm run lint     # oxlint
```

## Estrutura

- `src/App.tsx` — página inicial (exemplo com Motion)
- `src/lib/utils.ts` — helper `cn()` para combinar classes Tailwind
- `components.json` — configuração shadcn; componentes vão para `src/components/ui`
- Alias `@/` aponta para `src/`

## Ferramentas de IA

- `.claude/skills/` — skills UI/UX Pro Max e 21st.dev
- `.mcp.json` — servidor MCP do 21st.dev; defina `API_KEY_21ST` (chave em https://21st.dev/mcp)
