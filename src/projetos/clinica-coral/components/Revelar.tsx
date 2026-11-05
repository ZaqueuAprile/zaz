import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { curva } from './curva'

// Bloco que sobe devagar e aparece ao entrar na tela.
export function Revelar({ children, className, atraso = 0 }: { children: ReactNode; className?: string; atraso?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, ease: curva, delay: atraso }}
    >
      {children}
    </motion.div>
  )
}

// Foto que se abre de baixo para cima, com um leve zoom saindo. Quem observa a
// entrada na tela é a moldura, que nunca é recortada (um elemento todo
// recortado por clip-path não conta como visível para o navegador).
export function Foto({
  src,
  alt,
  className = '',
  moldura = '',
  atraso = 0,
  posicao,
}: {
  src: string
  alt: string
  className?: string
  moldura?: string
  atraso?: number
  posicao?: string
}) {
  const reduzido = useReducedMotion()
  return (
    <motion.figure
      className={`relative ${className}`}
      initial={reduzido ? false : 'oculta'}
      whileInView="visivel"
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
    >
      <motion.div
        className={`size-full overflow-hidden ${moldura}`}
        variants={{ oculta: { clipPath: 'inset(100% 0 0 0)' }, visivel: { clipPath: 'inset(0% 0 0 0)' } }}
        transition={{ duration: 1.3, ease: curva, delay: atraso }}
      >
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
          style={posicao ? { objectPosition: posicao } : undefined}
          variants={{ oculta: { scale: 1.1 }, visivel: { scale: 1 } }}
          transition={{ duration: 1.8, ease: curva, delay: atraso }}
        />
      </motion.div>
    </motion.figure>
  )
}

// Linha fina que se desenha ao entrar na tela: o traço dos posts da clínica.
export function Filete({ className = '', vertical = false, atraso = 0 }: { className?: string; vertical?: boolean; atraso?: number }) {
  return (
    <motion.span
      aria-hidden="true"
      className={`block bg-current ${vertical ? 'w-px origin-top' : 'h-px origin-left'} ${className}`}
      initial={{ [vertical ? 'scaleY' : 'scaleX']: 0 }}
      whileInView={{ [vertical ? 'scaleY' : 'scaleX']: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.1, ease: curva, delay: atraso }}
    />
  )
}

// Seta fina dos posts ("A tela →").
export function Seta({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 12" className={className} aria-hidden="true">
      <path d="M0 6h38M32 1l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}
