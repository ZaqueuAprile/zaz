import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'
import { INSTAGRAM, SECOES, linkWhatsApp } from '../dados'
import { Monograma } from './Logo'

const curva = [0.76, 0, 0.24, 1] as const
const saida = [0.22, 1, 0.36, 1] as const

// Menu em tela cheia, no azul da logo. Usa <dialog>, que já prende o foco;
// o fechamento (botão, link ou Esc) espera a cortina subir antes de fechar.
export function Menu() {
  const dialogo = useRef<HTMLDialogElement>(null)
  const botao = useRef<HTMLButtonElement>(null)
  const [aberto, setAberto] = useState(false)
  const reduzido = useReducedMotion()

  const abrir = () => {
    dialogo.current?.showModal()
    setAberto(true)
    document.body.style.overflow = 'hidden'
  }

  const fechar = () => setAberto(false)

  const aoSair = () => {
    dialogo.current?.close()
    document.body.style.overflow = ''
    botao.current?.focus({ preventScroll: true })
  }

  return (
    <>
      <button
        ref={botao}
        type="button"
        onClick={abrir}
        aria-haspopup="dialog"
        aria-label="Abrir o menu"
        className="-mr-3 grid size-12 cursor-pointer place-items-center text-marfim"
      >
        <svg viewBox="0 0 24 24" className="size-8" aria-hidden="true">
          <path d="M3 6.5h18M3 12h18M3 17.5h18" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>

      <dialog
        ref={dialogo}
        aria-label="Menu"
        onCancel={(e) => {
          e.preventDefault()
          fechar()
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-marfim backdrop:bg-transparent"
      >
        <AnimatePresence onExitComplete={aoSair}>
          {aberto && (
            <motion.div
              key="menu"
              className="min-h-dvh bg-noite"
              initial={reduzido ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
              animate={reduzido ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
              exit={
                reduzido
                  ? { opacity: 0, transition: { duration: 0.2 } }
                  : { clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.6, ease: curva, delay: 0.1 } }
              }
              transition={{ duration: 0.8, ease: curva }}
            >
              <div className="wrap flex min-h-dvh flex-col py-5">
                <motion.div
                  className="flex h-12 items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.4 } }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                >
                  <Monograma className="size-9 text-dourado" />
                  <button
                    type="button"
                    onClick={fechar}
                    className="-mr-3 min-h-12 cursor-pointer px-3 text-xs font-bold tracking-[0.24em] uppercase"
                  >
                    Fechar
                  </button>
                </motion.div>

                <nav aria-label="Seções" className="my-auto py-10">
                  <ol className="grid gap-y-3">
                    {SECOES.map((s, i) => (
                      <li key={s.id} className="overflow-hidden">
                        <motion.a
                          href={`#${s.id}`}
                          onClick={fechar}
                          className="group flex items-baseline gap-5 py-1 text-[clamp(1.9rem,5.5vw,3.4rem)] leading-tight font-extrabold tracking-tight uppercase"
                          initial={reduzido ? { opacity: 0 } : { y: '110%' }}
                          animate={
                            reduzido
                              ? { opacity: 1 }
                              : { y: '0%', transition: { duration: 0.9, ease: saida, delay: 0.35 + i * 0.06 } }
                          }
                          exit={reduzido ? { opacity: 0 } : { y: '-110%', transition: { duration: 0.4, ease: curva, delay: i * 0.03 } }}
                        >
                          <span className="w-7 text-xs font-bold tracking-widest text-dourado tabular-nums">0{i + 1}</span>
                          <span className="transition-colors group-hover:text-dourado">{s.nome}</span>
                        </motion.a>
                      </li>
                    ))}
                  </ol>
                </nav>

                <motion.div
                  className="flex flex-wrap items-center justify-between gap-4 border-t border-marfim/15 pt-5 text-sm text-marfim/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.8, delay: 0.7 } }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                >
                  <a
                    className="underline-offset-4 hover:underline"
                    href={`https://instagram.com/${INSTAGRAM}`}
                    target="_blank"
                    rel="noopener"
                  >
                    @{INSTAGRAM}
                  </a>
                  <a href={linkWhatsApp()} onClick={fechar} className="botao bg-dourado text-noite hover:bg-marfim">
                    Falar com um advogado
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </dialog>
    </>
  )
}
