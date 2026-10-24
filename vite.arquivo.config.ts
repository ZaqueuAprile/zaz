import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Gera um projeto como um único .html, com código, fontes e imagens embutidos,
// para abrir direto no navegador (inclusive no celular) sem servidor.
// Uso: PROJETO=bossa-cucina npm run build:arquivo
const projeto = process.env.PROJETO ?? 'bossa-cucina'

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile({ removeViteModuleLoader: true })],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    outDir: 'dist-arquivo',
    emptyOutDir: true,
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    rolldownOptions: {
      input: path.resolve(import.meta.dirname, `${projeto}/index.html`),
    },
  },
})
