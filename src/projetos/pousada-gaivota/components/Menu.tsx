import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'
import { INSTAGRAM, SECOES } from '../dados'
import { Emblema } from './Logo'

const curva = [0.76, 0, 0.24, 1] as const
const saida = [0.22, 1, 0.36, 1] as const

// Menu em tela cheia, no azul da logo. Usa <dialog>, que já prende o foco;
// o fechamento (botão, link ou Esc) espera a cortina subir antes de fechar.
export function Menu({ claro }: { claro: boolean }) {
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

  // Chamado quando a cortina termina de subir.
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
        className={`-ml-3 grid size-12 cursor-pointer place-items-center transition-colors ${claro ? 'text-white' : 'text-tinta'}`}
      >
        <svg viewBox="0 0 24 24" className="size-7" aria-hidden="true">
          <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>

      <dialog
        ref={dialogo}
        aria-label="Menu"
        onCancel={(e) => {
          e.preventDefault()
          fechar()
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-white backdrop:bg-transparent"
      >
        <AnimatePresence onExitComplete={aoSair}>
          {aberto && (
            <motion.div
              key="menu"
              className="min-h-dvh bg-mar"
              initial={reduzido ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
              animate={reduzido ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
              exit={
                reduzido
                  ? { opacity: 0, transition: { duration: 0.2 } }
                  : { clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.7, ease: curva, delay: 0.15 } }
              }
              transition={{ duration: 0.9, ease: curva }}
            >
              <div className="wrap flex min-h-dvh flex-col py-5">
                <motion.div
                  className="flex h-12 items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.6, delay: 0.5 } }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                >
                  <button
                    type="button"
                    onClick={fechar}
                    className="-ml-3 min-h-12 cursor-pointer px-3 text-sm tracking-[0.14em] uppercase"
                  >
                    Fechar
                  </button>
                  <motion.span
                    initial={{ rotate: -90, scale: 0.6 }}
                    animate={{ rotate: 0, scale: 1, transition: { duration: 1.1, ease: saida, delay: 0.45 } }}
                  >
                    <Emblema variante="traco" className="size-9" />
                  </motion.span>
                </motion.div>

                <nav aria-label="Seções" className="my-auto py-12">
                  <ol className="grid gap-x-12 gap-y-5 sm:grid-cols-2">
                    {SECOES.map((s, i) => (
                      // Cada item sobe de dentro de uma máscara, como uma linha de texto revelada.
                      <li key={s.id} className="overflow-hidden">
                        <motion.a
                          href={`#${s.id}`}
                          onClick={fechar}
                          className="group flex items-baseline gap-6 py-1 font-display text-[clamp(2.25rem,6vw,4rem)] leading-tight font-light"
                          initial={reduzido ? { opacity: 0 } : { y: '110%' }}
                          animate={
                            reduzido
                              ? { opacity: 1 }
                              : { y: '0%', transition: { duration: 1, ease: saida, delay: 0.4 + i * 0.07 } }
                          }
                          exit={reduzido ? { opacity: 0 } : { y: '-110%', transition: { duration: 0.45, ease: curva, delay: i * 0.03 } }}
                        >
                          <span className="w-8 font-sans text-sm text-white/70 tabular-nums">0{i + 1}</span>
                          <span className="transition-[font-style] group-hover:italic">{s.nome}</span>
                        </motion.a>
                      </li>
                    ))}
                  </ol>
                </nav>

                <div className="relative pt-5 text-sm text-white/80">
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px origin-left bg-white/25"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1, transition: { duration: 1.2, ease: saida, delay: 0.6 } }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  />
                  <motion.div
                    className="flex flex-wrap justify-between gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.8, delay: 0.8 } }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  >
                    <p>Vila de Santo André, Santa Cruz Cabrália, Bahia</p>
                    <a
                      className="underline-offset-4 hover:underline"
                      href={`https://instagram.com/${INSTAGRAM}`}
                      target="_blank"
                      rel="noopener"
                    >
                      @{INSTAGRAM}
                    </a>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </dialog>
    </>
  )
}
