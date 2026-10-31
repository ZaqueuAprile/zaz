import { useEffect, useRef } from 'react'
import { idDoVideo, type Prato } from '../dados'
import { real } from './formato'

// Janela com o vídeo do prato. Abre por cima do cardápio e o vídeo já começa
// a tocar, porque quem abriu tocou no prato.
export function Player({ prato, onFechar }: { prato: Prato; onFechar: () => void }) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const video = idDoVideo(prato.video)
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

  return (
    <dialog
      ref={dialogo}
      aria-labelledby="player-titulo"
      onClose={onFechar}
      onClick={(e) => e.target === dialogo.current && dialogo.current?.close()}
      className={`player-dialogo m-auto max-h-[96dvh] max-w-none overflow-y-auto rounded-2xl bg-espuma p-0 text-tinta ${
        prato.vertical ? 'w-[min(94vw,calc(74dvh*9/16))]' : 'w-[min(94vw,60rem)]'
      }`}
    >
      {/* Fechar vem antes do vídeo e recebe o foco: com o foco dentro do
          player do YouTube, o Esc iria para ele e não fecharia a janela. */}
      <div className="flex items-center gap-1 py-2 pr-2 pl-5 md:pl-6">
        <h2 id="player-titulo" className="mr-auto min-w-0 font-display text-xl leading-tight md:text-2xl">
          {prato.nome}
        </h2>
        {video && (
          <a
            href={`https://www.youtube.com/shorts/${video}`}
            target="_blank"
            rel="noopener"
            className="flex min-h-11 items-center px-2 text-sm font-semibold text-mar-2 underline underline-offset-4 hover:no-underline"
          >
            Abrir no YouTube
          </a>
        )}
        <button
          type="button"
          autoFocus
          onClick={() => dialogo.current?.close()}
          className="min-h-11 cursor-pointer rounded-full px-4 text-sm font-semibold transition-colors hover:bg-areia-2"
        >
          Fechar
        </button>
      </div>
      <div className={`relative w-full bg-mar ${prato.vertical ? 'aspect-[9/16]' : 'aspect-video'}`}>
        {video && (
          <iframe
            className="absolute inset-0 h-full w-full border-0"
            src={`https://www.youtube-nocookie.com/embed/${video}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
            title={`Vídeo: ${prato.nome}`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
      </div>
      {(prato.descricao || preco) && (
        <div className="flex items-start justify-between gap-6 p-4 md:p-5">
          <p className="text-tinta-2">
            {prato.descricao}
            {prato.serve && <span className="whitespace-nowrap"> · Serve {prato.serve}</span>}
          </p>
          {preco && <span className="shrink-0 text-xl font-semibold text-coral tabular-nums">{preco}</span>}
        </div>
      )}
    </dialog>
  )
}
