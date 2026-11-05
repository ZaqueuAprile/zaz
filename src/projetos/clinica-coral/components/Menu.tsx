import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { SECOES } from '../dados'
import { curva } from './curva'

// Menu do celular: uma folha escura que cobre a tela, com as seções em serifa.
// Vai direto para o body: o desfoque do topo prenderia um fixed dentro dele.
export function Menu() {
  const [aberto, setAberto] = useState(false)
  const botao = useRef<HTMLButtonElement>(null)
  const fechar = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!aberto) return
    const origem = botao.current
    fechar.current?.focus()
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false)
    document.addEventListener('keydown', tecla)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', tecla)
      document.body.style.overflow = ''
      origem?.focus()
    }
  }, [aberto])

  return (
    <>
      <button
        ref={botao}
        type="button"
        onClick={() => setAberto(true)}
        aria-expanded={aberto}
        className="sobrescrito -mr-3 min-h-11 cursor-pointer px-3 text-tinta md:hidden"
      >
        Menu
      </button>
      {createPortal(
      <AnimatePresence>
        {aberto && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-50 flex flex-col bg-noite px-6 pt-5 pb-10 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex justify-end">
              <button ref={fechar} type="button" onClick={() => setAberto(false)} className="sobrescrito -mr-3 min-h-11 cursor-pointer px-3">
                Fechar
              </button>
            </div>
            <nav className="mt-10 flex-1">
              <ol className="border-t border-white/15">
                {SECOES.map((s, i) => (
                  <motion.li
                    key={s.id}
                    className="border-b border-white/15"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: curva, delay: 0.08 + i * 0.05 }}
                  >
                    <a href={`#${s.id}`} onClick={() => setAberto(false)} className="flex items-baseline gap-5 py-5">
                      <span className="w-6 text-sm text-white/50 tabular-nums">0{i + 1}</span>
                      <span className="font-display text-4xl">{s.nome}</span>
                    </a>
                  </motion.li>
                ))}
              </ol>
            </nav>
            <p className="sobrescrito text-white/50">Odontologia &amp; Estética</p>
          </motion.div>
        )}
      </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
