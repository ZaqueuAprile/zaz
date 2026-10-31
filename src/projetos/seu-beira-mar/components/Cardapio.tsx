import { useEffect, useRef, useState } from 'react'
import { CARDAPIO, idDoVideo, type Prato } from '../dados'
import { real } from './formato'
import { Player } from './Player'
import { Revelar } from './Revelar'

function Play({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M7 4.5v15a1 1 0 0 0 1.52.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 7 4.5Z" />
    </svg>
  )
}

// Cartão do prato. Com vídeo, a capa é a miniatura do YouTube e o cartão
// inteiro abre o player; sem vídeo, a capa é o mar desenhado e o cartão só informa.
function Cartao({ prato, onAbrir }: { prato: Prato; onAbrir: (p: Prato) => void }) {
  const video = idDoVideo(prato.video)

  const capa = (
    <span className="relative block aspect-[4/3] overflow-hidden bg-mar">
      {video ? (
        <img
          src={`https://i.ytimg.com/vi/${video}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          width={480}
          height={360}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#f3b26b_0,#d9714a_16%,transparent_42%),linear-gradient(to_bottom,#0b3a53,#14597a_70%,#1d6f8f)]"
        />
      )}
      {prato.destaque && (
        <span className="absolute top-3 left-3 rounded-full bg-espuma px-3 py-1 text-xs font-semibold text-mar">da casa</span>
      )}
      {video && (
        <span
          aria-hidden="true"
          className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-mar/85 py-1.5 pr-3.5 pl-3 text-sm font-semibold text-espuma backdrop-blur-sm transition-colors group-hover:bg-coral"
        >
          <Play className="size-3.5" />
          Ver vídeo
        </span>
      )}
    </span>
  )

  const texto = (
    <span className="flex flex-1 flex-col p-4 md:p-5">
      <span className="flex items-baseline justify-between gap-3">
        <span className="font-display text-xl leading-tight">{prato.nome}</span>
        <span className="shrink-0 font-semibold text-coral tabular-nums">{real.format(prato.preco)}</span>
      </span>
      <span className="mt-1.5 text-[0.9375rem] leading-snug text-tinta-2">
        {prato.descricao}
        {prato.serve && <span className="whitespace-nowrap"> · Serve {prato.serve}</span>}
      </span>
    </span>
  )

  const caixa = 'flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white/70 text-left ring-1 ring-linha'

  return (
    <li>
      {video ? (
        <button
          type="button"
          onClick={() => onAbrir(prato)}
          aria-haspopup="dialog"
          aria-label={`${prato.nome}, ${real.format(prato.preco)}. Ver vídeo`}
          className={`group cursor-pointer transition-shadow duration-200 hover:shadow-[0_16px_40px_-20px_rgb(11_58_83/0.55)] hover:ring-mar active:scale-[0.99] ${caixa}`}
        >
          {capa}
          {texto}
        </button>
      ) : (
        <div className={caixa}>
          {capa}
          {texto}
        </div>
      )}
    </li>
  )
}

// Cardápio visual: um cartão por prato, cada um com o seu vídeo, e uma barra
// de categorias que acompanha a rolagem e marca a seção em que a pessoa está.
export function Cardapio() {
  const [ativa, setAtiva] = useState(CARDAPIO[0].id)
  const [aberto, setAberto] = useState<Prato | null>(null)
  const barra = useRef<HTMLDivElement>(null)
  const origem = useRef<HTMLElement | null>(null)

  const abrir = (prato: Prato) => {
    origem.current = document.activeElement as HTMLElement | null
    setAberto(prato)
  }

  const fechar = () => {
    setAberto(null)
    origem.current?.focus({ preventScroll: true })
  }

  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas.find((e) => e.isIntersecting)
        if (visivel) setAtiva(visivel.target.id)
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    CARDAPIO.forEach((c) => {
      const el = document.getElementById(c.id)
      if (el) observador.observe(el)
    })
    return () => observador.disconnect()
  }, [])

  // Mantém o chip ativo visível quando a barra rola de lado no celular.
  useEffect(() => {
    const chip = barra.current?.querySelector<HTMLElement>(`[data-id="${ativa}"]`)
    const caixa = barra.current
    if (!chip || !caixa) return
    caixa.scrollTo({ left: chip.offsetLeft - caixa.clientWidth / 2 + chip.clientWidth / 2, behavior: 'smooth' })
  }, [ativa])

  return (
    <>
      <div className="sticky top-16 z-30 -mx-[max(1.25rem,env(safe-area-inset-left,0px))] border-b border-linha bg-areia/95 backdrop-blur-sm md:-mx-12">
        <nav
          ref={barra}
          aria-label="Categorias do cardápio"
          className="sem-barra flex gap-2 overflow-x-auto px-[max(1.25rem,env(safe-area-inset-left,0px))] py-3 md:px-12"
        >
          {CARDAPIO.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              data-id={c.id}
              aria-current={ativa === c.id ? 'true' : undefined}
              className={`flex min-h-11 shrink-0 items-center rounded-full border px-5 text-sm font-semibold transition-colors duration-200 ${
                ativa === c.id
                  ? 'border-mar bg-mar text-espuma'
                  : 'border-linha text-tinta hover:border-mar hover:text-mar'
              }`}
            >
              {c.nome}
            </a>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {CARDAPIO.map((c) => (
          <section key={c.id} id={c.id} aria-labelledby={`${c.id}-titulo`} className="py-10">
            <Revelar className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <h3 id={`${c.id}-titulo`} className="font-display text-4xl md:text-5xl">
                {c.nome}
              </h3>
              {c.nota && <p className="text-tinta-2 italic">{c.nota}</p>}
            </Revelar>
            <Revelar atraso={0.05}>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {c.pratos.map((p) => (
                  <Cartao key={p.nome} prato={p} onAbrir={abrir} />
                ))}
              </ul>
            </Revelar>
          </section>
        ))}
      </div>

      {aberto && <Player key={aberto.nome} prato={aberto} onFechar={fechar} />}
    </>
  )
}
