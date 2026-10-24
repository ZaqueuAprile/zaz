import { motion } from 'motion/react'
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 p-6 text-center">
      <motion.h1
        className="text-4xl font-bold tracking-tight sm:text-5xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        Zaz
      </motion.h1>

      <motion.p
        className="max-w-md text-neutral-600 dark:text-neutral-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Vite + React + Tailwind + Motion. Edite <code className="font-mono">src/App.tsx</code> para começar.
      </motion.p>

      <motion.button
        type="button"
        className="rounded-full bg-neutral-900 px-6 py-3 font-medium text-white dark:bg-white dark:text-neutral-900"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCount((c) => c + 1)}
      >
        Cliques: {count}
      </motion.button>
    </main>
  )
}

export default App
