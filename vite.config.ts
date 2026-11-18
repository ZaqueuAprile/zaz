import fs from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Caminhos relativos para o build funcionar em qualquer subpasta (ex.: GitHub Pages).
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    {
      // As páginas da Aprile montam algumas imagens dentro do JavaScript; o Vite
      // não enxerga esses caminhos, então a pasta vai inteira para o build.
      name: 'copiar-imagens-aprile',
      apply: 'build',
      closeBundle() {
        const dest = path.resolve(import.meta.dirname, 'dist/aprile')
        fs.cpSync(path.resolve(import.meta.dirname, 'aprile/img'), path.join(dest, 'img'), { recursive: true })
        for (const f of ['sol.png', 'logo.png', 'favicon.png']) fs.copyFileSync(path.resolve(import.meta.dirname, 'aprile', f), path.join(dest, f))
      },
    },
  ],
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
        'aprile': path.resolve(import.meta.dirname, 'aprile/index.html'),
        'aprile-hub': path.resolve(import.meta.dirname, 'aprile/hub/index.html'),
      },
    },
  },
})
