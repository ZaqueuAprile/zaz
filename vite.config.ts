import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Caminhos relativos para o build funcionar em qualquer subpasta (ex.: GitHub Pages).
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    // Cada projeto do portfólio é uma página própria.
    rolldownOptions: {
      input: {
        portfolio: path.resolve(import.meta.dirname, 'index.html'),
        'bossa-cucina': path.resolve(import.meta.dirname, 'bossa-cucina/index.html'),
        'pousada-gaivota': path.resolve(import.meta.dirname, 'pousada-gaivota/index.html'),
        'seu-beira-mar': path.resolve(import.meta.dirname, 'seu-beira-mar/index.html'),
      },
    },
  },
})
