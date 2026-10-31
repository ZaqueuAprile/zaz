import { useState } from 'react'
import { PLAYLIST_ID } from '../dados'

const LINK_PLAYLIST = `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`

// O player do YouTube só carrega quando a pessoa toca em "Assistir": a página
// abre leve e nenhum cookie do YouTube entra antes disso.
export function Playlist() {
  const [tocando, setTocando] = useState(false)

  return (
    <div>
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-mar shadow-[0_24px_60px_-24px_rgb(11_58_83/0.6)]">
        {tocando ? (
          <iframe
            className="absolute inset-0 h-full w-full border-0"
            src={`https://www.youtube-nocookie.com/embed/videoseries?list=${PLAYLIST_ID}&autoplay=1&rel=0&playsinline=1`}
            title="Vídeos do Seu Beira Mar no YouTube"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setTocando(true)}
            className="group absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-5 text-espuma"
          >
            {/* Capa: sol baixo sobre o mar, desenhado em vez de foto. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_115%,#f3b26b_0,#d9714a_14%,transparent_38%),linear-gradient(to_bottom,#0b3a53,#14597a_70%,#1d6f8f)]"
            />
            <span
              aria-hidden="true"
              className="relative grid size-20 place-items-center rounded-full bg-espuma text-mar transition-transform duration-200 group-hover:scale-105 group-active:scale-95 md:size-24"
            >
              <svg viewBox="0 0 24 24" className="ml-1 size-8 md:size-10" fill="currentColor">
                <path d="M7 4.5v15a1 1 0 0 0 1.52.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 7 4.5Z" />
              </svg>
            </span>
            <span className="relative rotulo">Assistir aos vídeos</span>
          </button>
        )}
      </div>
      <p className="mt-4 text-sm text-tinta-2">
        Os vídeos tocam em sequência. Prefere ver no app?{' '}
        <a href={LINK_PLAYLIST} target="_blank" rel="noopener" className="font-semibold text-mar-2 underline underline-offset-4 hover:no-underline">
          Abrir a playlist no YouTube
        </a>
      </p>
    </div>
  )
}
