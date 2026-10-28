import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { INSTAGRAM, SECOES } from '../dados'
import { Emblema } from './Logo'

// Menu em tela cheia, no azul da logo. Usa <dialog>, que já prende o foco
// e fecha com Esc.
export function Menu({ claro }: { claro: boolean }) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const botao = useRef<HTMLButtonElement>(null)
  const [aberto, setAberto] = useState(false)

  const abrir = () => {
    dialogo.current?.showModal()
    setAberto(true)
    document.body.style.overflow = 'hidden'
  }
  const fechar = () => dialogo.current?.close()
  const aoFechar = () => {
    setAberto(false)
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
        onClose={aoFechar}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-mar p-0 text-white backdrop:bg-transparent"
      >
        {aberto && (
          <motion.div
            className="wrap flex min-h-dvh flex-col py-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex h-12 items-center justify-between">
              <button
                type="button"
                onClick={fechar}
                className="-ml-3 min-h-12 cursor-pointer px-3 text-sm tracking-[0.14em] uppercase"
              >
                Fechar
              </button>
              <Emblema variante="traco" className="size-9" />
            </div>

            <nav aria-label="Seções" className="my-auto py-12">
              <ol className="grid gap-x-12 gap-y-5 sm:grid-cols-2">
                {SECOES.map((s, i) => (
                  <motion.li
                    key={s.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.05 }}
                  >
                    <a
                      href={`#${s.id}`}
                      onClick={fechar}
                      className="group flex items-baseline gap-6 py-1 font-display text-[clamp(2.25rem,6vw,4rem)] leading-tight font-light"
                    >
                      <span className="w-8 font-sans text-sm text-white/70 tabular-nums">0{i + 1}</span>
                      <span className="transition-[font-style] group-hover:italic">{s.nome}</span>
                    </a>
                  </motion.li>
                ))}
              </ol>
            </nav>

            <div className="flex flex-wrap justify-between gap-4 border-t border-white/25 pt-5 text-sm text-white/80">
              <p>Vila de Santo André, Santa Cruz Cabrália, Bahia</p>
              <a className="underline-offset-4 hover:underline" href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener">
                @{INSTAGRAM}
              </a>
            </div>
          </motion.div>
        )}
      </dialog>
    </>
  )
}
