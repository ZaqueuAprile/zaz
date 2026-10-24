import { motion } from 'motion/react'

const PROJETOS = [
  {
    numero: '01',
    nome: 'Bossa Cucina',
    tipo: 'Restaurante · site conceitual',
    href: './bossa-cucina/',
  },
]

function App() {
  return (
    <main className="mx-auto flex min-h-svh max-w-5xl flex-col px-6 py-16 md:px-12 md:py-24">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="text-xs font-medium tracking-[0.16em] text-neutral-500 uppercase">Portfólio</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Sites e interfaces, um projeto de cada vez.
        </h1>
      </motion.header>

      <ol className="mt-20 border-t border-neutral-300 dark:border-neutral-800">
        {PROJETOS.map((p, i) => (
          <motion.li
            key={p.nome}
            className="border-b border-neutral-300 dark:border-neutral-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
          >
            <a
              href={p.href}
              className="group flex flex-wrap items-baseline gap-x-6 gap-y-1 py-6 transition-colors hover:text-neutral-500"
            >
              <span className="w-8 text-sm text-neutral-500 tabular-nums">{p.numero}</span>
              <span className="text-2xl font-medium sm:text-3xl">{p.nome}</span>
              <span className="text-sm text-neutral-500 sm:ml-auto">{p.tipo}</span>
            </a>
          </motion.li>
        ))}
      </ol>
    </main>
  )
}

export default App
