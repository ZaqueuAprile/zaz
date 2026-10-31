import { useEffect, useRef, useState } from 'react'
import { CARDAPIO, type Prato } from '../dados'
import { Revelar } from './Revelar'

const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })

function Item({ prato }: { prato: Prato }) {
  return (
    <li className="py-5">
      <div className="flex items-baseline gap-3">
        <h4 className="font-display text-xl leading-tight md:text-2xl">{prato.nome}</h4>
        {prato.destaque && (
          <span className="shrink-0 rounded-full bg-mar px-2.5 py-0.5 text-xs font-semibold tracking-wide text-espuma">
            da casa
          </span>
        )}
        <span aria-hidden="true" className="pontilhado" />
        <span className="shrink-0 text-lg font-semibold text-coral tabular-nums">{real.format(prato.preco)}</span>
      </div>
      <p className="mt-1.5 max-w-[60ch] text-tinta-2">
        {prato.descricao}
        {prato.serve && <span className="whitespace-nowrap"> · Serve {prato.serve}</span>}
      </p>
    </li>
  )
}

// Cardápio inteiro na página, com uma barra de categorias que acompanha a
// rolagem e marca a seção em que a pessoa está.
export function Cardapio() {
  const [ativa, setAtiva] = useState(CARDAPIO[0].id)
  const barra = useRef<HTMLDivElement>(null)

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
          <section key={c.id} id={c.id} aria-labelledby={`${c.id}-titulo`} className="grid gap-x-12 py-10 md:grid-cols-12">
            <Revelar className="md:col-span-4">
              <h3 id={`${c.id}-titulo`} className="font-display text-4xl md:text-5xl">
                {c.nome}
              </h3>
              {c.nota && <p className="mt-3 max-w-xs text-tinta-2 italic">{c.nota}</p>}
            </Revelar>
            <Revelar className="md:col-span-8" atraso={0.05}>
              <ul className="mt-4 divide-y divide-linha md:mt-0">
                {c.pratos.map((p) => (
                  <Item key={p.nome} prato={p} />
                ))}
              </ul>
            </Revelar>
          </section>
        ))}
      </div>
    </>
  )
}
