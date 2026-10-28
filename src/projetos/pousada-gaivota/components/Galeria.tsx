import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react'
import { useCallback, useRef, useState, type ReactNode } from 'react'
import { ContextoGaleria } from './galeria-contexto'

type Item = { src: string; alt: string; largura: number; altura: number }
type Posicao = { x: number; y: number; scale: number }
type Saida = { tipo: 'troca' | 'fechar'; direcao: number; alvo: HTMLElement | null; destino: Posicao | null }

const curva = [0.22, 1, 0.36, 1] as const

// Todas as fotos marcadas com data-galeria, na ordem em que aparecem na página.
const botoesDaPagina = () => [...document.querySelectorAll<HTMLElement>('[data-galeria]')]

const itemDe = (botao: HTMLElement): Item => {
  const img = botao.querySelector('img')
  return {
    src: img?.currentSrc || img?.src || '',
    alt: img?.alt ?? '',
    largura: img?.naturalWidth || 4,
    altura: img?.naturalHeight || 5,
  }
}

// Tamanho da foto ampliada: o maior possível sem sair da tela nem distorcer.
const tamanhoFinal = (item: Item) => {
  const k = Math.min((window.innerWidth * 0.92) / item.largura, (window.innerHeight * 0.8) / item.altura)
  return { largura: item.largura * k, altura: item.altura * k }
}

// Transformação que leva a foto ampliada (centrada na tela) até a miniatura.
const ateMiniatura = (miniatura: HTMLElement, item: Item): Posicao => {
  const r = miniatura.getBoundingClientRect()
  const fim = tamanhoFinal(item)
  return {
    x: r.left + r.width / 2 - window.innerWidth / 2,
    y: r.top + r.height / 2 - window.innerHeight / 2,
    scale: Math.min(r.width / fim.largura, r.height / fim.altura),
  }
}

const naTela = (el: HTMLElement | null) => {
  if (!el) return false
  const r = el.getBoundingClientRect()
  return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth
}

export function Galeria({ children }: { children: ReactNode }) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const botoes = useRef<HTMLElement[]>([])
  const [itens, setItens] = useState<Item[]>([])
  const [indice, setIndice] = useState<number | null>(null)
  // De onde a primeira foto sai: a posição da miniatura tocada.
  const [origem, setOrigem] = useState<Posicao | null>(null)
  const [saida, setSaida] = useState<Saida>({ tipo: 'troca', direcao: 0, alvo: null, destino: null })
  const reduzido = useReducedMotion()

  const abrir = useCallback((botao: HTMLElement) => {
    botoes.current = botoesDaPagina()
    const lista = botoes.current.map(itemDe)
    const i = Math.max(0, botoes.current.indexOf(botao))
    setItens(lista)
    setIndice(i)
    setOrigem(ateMiniatura(botao, lista[i]))
    setSaida({ tipo: 'troca', direcao: 0, alvo: null, destino: null })
    dialogo.current?.showModal()
    document.body.style.overflow = 'hidden'
  }, [])

  const ir = (passo: number) => {
    if (indice === null || itens.length < 2) return
    setOrigem(null)
    setSaida({ tipo: 'troca', direcao: passo, alvo: null, destino: null })
    setIndice((indice + passo + itens.length) % itens.length)
  }

  const fechar = () => {
    if (indice === null) return
    // Volta para a miniatura da foto que está aberta, se ela estiver na tela.
    const alvo = botoes.current[indice] ?? null
    const visivel = naTela(alvo) ? alvo : null
    setSaida({ tipo: 'fechar', direcao: 0, alvo, destino: visivel ? ateMiniatura(visivel, itens[indice]) : null })
    setIndice(null)
  }

  const aoTerminarDeFechar = () => {
    if (indice !== null) return
    dialogo.current?.close()
    document.body.style.overflow = ''
    saida.alvo?.focus({ preventScroll: true })
  }

  const aoArrastar = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) ir(1)
    else if (info.offset.x > 60 || info.velocity.x > 400) ir(-1)
  }

  const item = indice === null ? null : itens[indice]
  const fim = item ? tamanhoFinal(item) : null

  // A primeira foto sai da miniatura; as seguintes deslizam para o lado.
  const entrada = reduzido
    ? { opacity: 0 }
    : origem
      ? { ...origem, opacity: 1 }
      : { x: saida.direcao * 90, opacity: 0, scale: 1 }

  const variantes = {
    sair: (s: Saida) => {
      if (reduzido) return { opacity: 0, transition: { duration: 0.2 } }
      if (s.tipo === 'fechar') {
        return s.destino
          ? { ...s.destino, transition: { duration: 0.55, ease: curva } }
          : { opacity: 0, scale: 0.92, transition: { duration: 0.35 } }
      }
      return { x: -s.direcao * 90, opacity: 0, transition: { duration: 0.35, ease: curva } }
    },
  }

  return (
    <ContextoGaleria.Provider value={abrir}>
      {children}
      <dialog
        ref={dialogo}
        aria-label="Fotos ampliadas"
        onCancel={(e) => {
          e.preventDefault()
          fechar()
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') ir(1)
          if (e.key === 'ArrowLeft') ir(-1)
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 text-white backdrop:bg-transparent"
      >
        <AnimatePresence custom={saida} onExitComplete={aoTerminarDeFechar}>
          {item && fim && (
            <motion.div
              key="fundo"
              className="fixed inset-0 bg-[#0b0f17]/96"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.45 } }}
              exit={{ opacity: 0, transition: { duration: 0.45, delay: 0.1 } }}
              onClick={fechar}
            />
          )}
          {item && fim && (
            <motion.div
              key="foto"
              className="pointer-events-none fixed inset-0 grid place-items-center"
              exit={{ opacity: 1, transition: { duration: 0.6 } }}
            >
              <AnimatePresence custom={saida} initial={false} mode="popLayout" propagate>
                <motion.img
                  key={item.src}
                  src={item.src}
                  alt={item.alt}
                  custom={saida}
                  variants={variantes}
                  initial={entrada}
                  animate={{ x: 0, y: 0, scale: 1, opacity: 1, transition: { duration: 0.7, ease: curva } }}
                  exit="sair"
                  drag={itens.length > 1 ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.5}
                  onDragEnd={aoArrastar}
                  style={{ width: fim.largura, height: fim.altura }}
                  className="pointer-events-auto cursor-grab rounded-sm object-cover shadow-2xl select-none active:cursor-grabbing"
                  draggable={false}
                />
              </AnimatePresence>
            </motion.div>
          )}
          {item && (
            <motion.div
              key="controles"
              className="pointer-events-none fixed inset-0 flex flex-col justify-between p-4 md:p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.25 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm tracking-[0.14em] text-white/80 tabular-nums" aria-live="polite">
                  {String((indice ?? 0) + 1).padStart(2, '0')} / {String(itens.length).padStart(2, '0')}
                </p>
                <button
                  type="button"
                  onClick={fechar}
                  className="pointer-events-auto min-h-12 cursor-pointer rounded-md bg-white/10 px-5 text-sm tracking-[0.14em] uppercase backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  Fechar
                </button>
              </div>
              {itens.length > 1 && (
                <div className="flex justify-center gap-3">
                  {([
                    [-1, 'Foto anterior', 'M20 12H5M11 6l-6 6 6 6'],
                    [1, 'Próxima foto', 'M4 12h15M13 6l6 6-6 6'],
                  ] as const).map(([d, rotulo, caminho]) => (
                    <button
                      key={rotulo}
                      type="button"
                      onClick={() => ir(d)}
                      aria-label={rotulo}
                      className="pointer-events-auto grid size-14 cursor-pointer place-items-center rounded-md bg-white/10 backdrop-blur-md transition-colors hover:bg-white/20"
                    >
                      <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
                        <path d={caminho} fill="none" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </dialog>
    </ContextoGaleria.Provider>
  )
}
