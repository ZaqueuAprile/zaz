import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { useAmpliar } from './galeria-contexto'

const curva = [0.22, 1, 0.36, 1] as const

// Texto que sobe devagar e aparece ao entrar na tela.
export function Revelar({ children, className, atraso = 0 }: { children: ReactNode; className?: string; atraso?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.1, ease: curva, delay: atraso }}
    >
      {children}
    </motion.div>
  )
}

// Foto que se abre de baixo para cima, com um leve zoom saindo. Tocada, abre a
// visualização ampliada.
export function Foto({
  src,
  alt,
  className,
  proporcao = 'aspect-[4/5]',
  atraso = 0,
}: {
  src: string
  alt: string
  className?: string
  proporcao?: string
  atraso?: number
}) {
  const reduzido = useReducedMotion()
  const ampliar = useAmpliar()
  // Quem observa a entrada na tela é a moldura, que nunca é recortada: um
  // elemento todo recortado por clip-path não conta como visível para o
  // navegador, e a foto ficaria escondida ao pular direto para a seção.
  return (
    <motion.figure
      className={`relative ${proporcao} ${className ?? ''}`}
      initial={reduzido ? false : 'oculta'}
      whileInView="visivel"
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
    >
      <motion.button
        type="button"
        data-galeria
        onClick={(e) => ampliar(e.currentTarget)}
        aria-label={`Ampliar foto: ${alt}`}
        className="group block size-full cursor-zoom-in overflow-hidden"
        variants={{ oculta: { clipPath: 'inset(100% 0 0 0)' }, visivel: { clipPath: 'inset(0% 0 0 0)' } }}
        transition={{ duration: 1.3, ease: curva, delay: atraso }}
      >
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-[filter] duration-500 group-hover:brightness-105"
          variants={{ oculta: { scale: 1.12 }, visivel: { scale: 1 } }}
          transition={{ duration: 1.8, ease: curva, delay: atraso }}
        />
      </motion.button>
    </motion.figure>
  )
}

// Link no estilo da referência: um quadrado com a seta e o texto ao lado.
export function LinkSeta({ href, children, claro = false }: { href: string; children: ReactNode; claro?: boolean }) {
  return (
    <a href={href} className="group inline-flex items-center gap-5">
      <span
        className={`grid size-14 place-items-center rounded-md transition-colors duration-300 ${
          claro ? 'bg-white/15 group-hover:bg-white/25' : 'bg-areia-2 group-hover:bg-terracota group-hover:text-white'
        }`}
      >
        <svg viewBox="0 0 24 24" className="size-6 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
          <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </span>
      <span className="text-lg">{children}</span>
    </a>
  )
}
