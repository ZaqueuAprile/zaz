import { motion } from 'motion/react'
import type { ReactNode } from 'react'

const curva = [0.22, 1, 0.36, 1] as const

// Bloco que sobe devagar e aparece ao entrar na tela.
export function Revelar({
  children,
  className,
  atraso = 0,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  atraso?: number
  as?: 'div' | 'li' | 'article'
}) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, ease: curva, delay: atraso }}
    >
      {children}
    </Tag>
  )
}

// Cabeçalho de seção da referência: rótulo com traço, título em caixa alta com
// a parte final em destaque e o fio que se afina embaixo.
export function Cabecalho({
  rotulo,
  titulo,
  destaque,
  claro = false,
  centro = false,
  className,
}: {
  rotulo: string
  titulo: string
  destaque: string
  claro?: boolean
  centro?: boolean
  className?: string
}) {
  const realce = claro ? 'text-dourado' : 'text-bronze'
  return (
    <Revelar className={`${centro ? 'text-center' : ''} ${className ?? ''}`}>
      <p className={`rotulo ${realce}`}>{rotulo}</p>
      <h2 className={`titulo mt-6 ${claro ? 'text-marfim' : 'text-tinta'}`}>
        {titulo} <span className={realce}>{destaque}</span>
      </h2>
      <motion.span
        aria-hidden="true"
        className={`fio mt-8 origin-left ${realce} ${centro ? 'mx-auto' : ''}`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: curva, delay: 0.3 }}
      />
    </Revelar>
  )
}
