import { motion } from 'motion/react'
import type { ReactNode } from 'react'

// Entrada discreta: o bloco sobe alguns pixels e aparece quando entra na tela.
export function Revelar({ children, className, atraso = 0 }: { children: ReactNode; className?: string; atraso?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: atraso }}
    >
      {children}
    </motion.div>
  )
}
