import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { idDoVideo, type Prato } from '../dados'
import { real } from './formato'
import { Miniatura } from './Miniatura'

export type ItemVideo = { prato: Prato; categoria: string }

const TOCANDO = 1
const PAUSADO = 2

// A dica de deslizar aparece só na primeira vez que o player abre.
let dicaVista = false

function Seta({ direcao }: { direcao: 'esquerda' | 'direita' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.25">
      <path d={direcao === 'esquerda' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Visualizador em tela cheia, como os stories: um prato por vez, e deslizar
// para o lado passa ao prato vizinho. Uma camada transparente por cima do
// vídeo recebe os gestos (o iframe do YouTube engoliria o toque) e conversa
// com o player por postMessage: toque pausa ou continua. O iframe é mais alto
// que o quadro, e as faixas de cima e de baixo, onde o YouTube põe título e
// logo, ficam cortadas.
export function Player({ lista, inicial, onFechar }: { lista: ItemVideo[]; inicial: number; onFechar: (indice: number) => void }) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const quadro = useRef<HTMLIFrameElement>(null)
  const gesto = useRef<{ x: number; t: number } | null>(null)
  const estado = useRef(-1)
  const espera = useRef<number | undefined>(undefined)
  const [indice, setIndice] = useState(inicial)
  const [arrasto, setArrasto] = useState<number | null>(null)
  const [pausado, setPausado] = useState(false)
  const [mudo, setMudo] = useState(false)
  const [dica, setDica] = useState(!dicaVista)
  const semMovimento = useReducedMotion()

  const { prato, categoria } = lista[indice]
  const preco = prato.preco === undefined ? null : real.format(prato.preco)

  useEffect(() => {
    const d = dialogo.current
    if (!d) return
    d.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (!dica) return
    dicaVista = true
    const t = window.setTimeout(() => setDica(false), 3200)
    return () => window.clearTimeout(t)
  }, [dica])

  // Estado do player, que o YouTube manda por postMessage depois do "listening".
  useEffect(() => {
    const ouvir = (e: MessageEvent) => {
      if (e.source !== quadro.current?.contentWindow || typeof e.data !== 'string') return
      let dados: { event?: string; info?: unknown }
      try {
        dados = JSON.parse(e.data)
      } catch {
        return
      }
      const info = dados.info as { playerState?: number; muted?: boolean } | number | undefined
      const novo = dados.event === 'onStateChange' ? info : typeof info === 'object' ? info?.playerState : undefined
      if (typeof novo === 'number') {
        estado.current = novo
        if (novo === TOCANDO) setPausado(false)
        if (novo === PAUSADO) setPausado(true)
      }
      if (typeof info === 'object' && typeof info?.muted === 'boolean') setMudo(info.muted)
    }
    window.addEventListener('message', ouvir)
    return () => window.removeEventListener('message', ouvir)
  }, [])

  useEffect(() => () => window.clearTimeout(espera.current), [indice])

  const comando = (func: string, args: unknown[] = []) =>
    quadro.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args }), '*')

  // Se o navegador não deixar o vídeo começar com som, começa sem som e
  // aparece o botão para ligar o som.
  const aoCarregar = () => {
    quadro.current?.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id: indice, channel: 'widget' }), '*')
    window.clearTimeout(espera.current)
    espera.current = window.setTimeout(() => {
      if (estado.current === TOCANDO) return
      comando('mute')
      comando('playVideo')
      setMudo(true)
    }, 1800)
  }

  const ir = (passo: number) => {
    const proximo = Math.min(lista.length - 1, Math.max(0, indice + passo))
    if (proximo === indice) return
    estado.current = -1
    setIndice(proximo)
    setPausado(false)
    setMudo(false)
    setDica(false)
  }

  const alternar = () => {
    comando(pausado ? 'playVideo' : 'pauseVideo')
    setPausado(!pausado)
  }

  const ligarSom = () => {
    comando('unMute')
    comando('setVolume', [100])
    comando('playVideo')
    setMudo(false)
  }

  const aoTocar = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    gesto.current = { x: e.clientX, t: e.timeStamp }
  }

  const aoMover = (e: PointerEvent<HTMLDivElement>) => {
    const g = gesto.current
    if (!g) return
    let dx = e.clientX - g.x
    // Nas pontas a lista resiste, como um elástico.
    if ((indice === 0 && dx > 0) || (indice === lista.length - 1 && dx < 0)) dx /= 3
    setArrasto(dx)
  }

  const aoSoltar = (e: PointerEvent<HTMLDivElement>) => {
    const g = gesto.current
    if (!g) return
    gesto.current = null
    setArrasto(null)
    const dx = e.clientX - g.x
    const dt = Math.max(1, e.timeStamp - g.t)
    const largura = e.currentTarget.clientWidth
    if (Math.abs(dx) > Math.max(48, largura * 0.18) || (Math.abs(dx) > 24 && Math.abs(dx) / dt > 0.45)) {
      ir(dx < 0 ? 1 : -1)
    } else if (Math.abs(dx) < 8 && dt < 350) {
      alternar()
    }
  }

  const cancelar = () => {
    gesto.current = null
    setArrasto(null)
  }

  return (
    <dialog
      ref={dialogo}
      aria-label="Vídeos dos pratos"
      onClose={() => onFechar(indice)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') ir(1)
        if (e.key === 'ArrowLeft') ir(-1)
      }}
      className="player-dialogo m-0 h-dvh max-h-none w-screen max-w-none bg-noite p-0 text-espuma"
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="relative aspect-[9/16] w-[min(100vw,calc(100dvh*9/16))] overflow-hidden bg-black select-none md:w-[calc(94dvh*9/16)] md:rounded-2xl">
          <div
            className="flex h-full"
            style={{
              transform: `translateX(calc(${-indice * 100}% + ${arrasto ?? 0}px))`,
              transition: arrasto !== null || semMovimento ? 'none' : 'transform 340ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {lista.map((item, i) => {
              const id = idDoVideo(item.prato.video)
              return (
                <div key={item.prato.nome} aria-hidden={i !== indice} className="relative h-full w-full shrink-0 overflow-hidden">
                  {id && Math.abs(i - indice) <= 1 && <Miniatura video={id} vertical={item.prato.vertical} />}
                  {id && i === indice && (
                    <iframe
                      key={id}
                      ref={quadro}
                      onLoad={aoCarregar}
                      tabIndex={-1}
                      className="absolute inset-x-0 -top-[12%] h-[124%] w-full border-0"
                      src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&controls=0&loop=1&playlist=${id}&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&fs=0&enablejsapi=1&origin=${encodeURIComponent(location.origin)}`}
                      title={item.prato.nome}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Camada dos gestos: deslizar troca de prato, tocar pausa. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-10 cursor-grab touch-none active:cursor-grabbing"
            onPointerDown={aoTocar}
            onPointerMove={aoMover}
            onPointerUp={aoSoltar}
            onPointerCancel={cancelar}
          />

          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center gap-2 bg-gradient-to-b from-black/60 to-transparent px-4 pt-3 pb-10">
            <p className="mr-auto text-sm font-semibold tabular-nums">
              {indice + 1} / {lista.length}
              <span className="font-normal text-espuma/75"> · {categoria}</span>
            </p>
            {mudo && (
              <button
                type="button"
                onClick={ligarSom}
                className="pointer-events-auto flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-espuma px-4 text-sm font-semibold text-mar"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="currentColor">
                  <path d="M11 5 6 9H3v6h3l5 4V5Zm4.5 3.5a5 5 0 0 1 0 7l-1.06-1.06a3.5 3.5 0 0 0 0-4.88L15.5 8.5Zm2.5-2.5a8.5 8.5 0 0 1 0 12l-1.06-1.06a7 7 0 0 0 0-9.88L18 6Z" />
                </svg>
                Ligar som
              </button>
            )}
            <button
              type="button"
              autoFocus
              onClick={() => dialogo.current?.close()}
              className="pointer-events-auto flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full bg-black/35 px-4 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-black/55"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.25">
                <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
              </svg>
              Fechar
            </button>
          </div>

          {pausado && (
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
              <span className="grid size-20 place-items-center rounded-full bg-black/45 backdrop-blur-sm">
                <svg viewBox="0 0 24 24" className="ml-1 size-9" fill="currentColor">
                  <path d="M7 4.5v15a1 1 0 0 0 1.52.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 7 4.5Z" />
                </svg>
              </span>
            </span>
          )}

          {indice > 0 && (
            <button
              type="button"
              onClick={() => ir(-1)}
              aria-label="Prato anterior"
              className="absolute top-1/2 left-2 z-20 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-black/30 backdrop-blur-sm transition-colors hover:bg-black/55"
            >
              <Seta direcao="esquerda" />
            </button>
          )}
          {indice < lista.length - 1 && (
            <button
              type="button"
              onClick={() => ir(1)}
              aria-label="Próximo prato"
              className="absolute top-1/2 right-2 z-20 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-black/30 backdrop-blur-sm transition-colors hover:bg-black/55"
            >
              <Seta direcao="direita" />
            </button>
          )}

          {dica && (
            <p className="pointer-events-none absolute inset-x-0 top-[58%] z-20 flex justify-center">
              <span className="flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                <Seta direcao="esquerda" />
                Deslize para ver outros pratos
                <Seta direcao="direita" />
              </span>
            </p>
          )}

          <div
            aria-live="polite"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/75 via-black/40 to-transparent px-5 pt-16 pb-6"
          >
            <h2 className="font-display text-3xl leading-tight">{prato.nome}</h2>
            {(prato.descricao || preco) && (
              <p className="mt-1.5 text-espuma/85">
                {prato.descricao}
                {prato.descricao && preco && ' · '}
                {preco && <span className="font-semibold text-espuma tabular-nums">{preco}</span>}
              </p>
            )}
          </div>
        </div>
      </div>
    </dialog>
  )
}
