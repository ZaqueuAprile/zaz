import { useId, useRef, useState, type PointerEvent } from 'react'

// Comparador de antes e depois: arrastar (ou usar as setas do teclado) move a
// divisa. O "depois" fica embaixo, inteiro; o "antes" fica por cima, recortado
// até a divisa. O arrasto é tratado no próprio quadro com touch-action pan-y,
// para o dedo ainda conseguir rolar a página na vertical.
export function AntesDepois({
  antes,
  depois,
  descricao,
  className = '',
}: {
  antes: string
  depois: string
  descricao: string
  className?: string
}) {
  const id = useId()
  const quadro = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)
  const [arrastando, setArrastando] = useState(false)

  const mover = (x: number) => {
    const r = quadro.current?.getBoundingClientRect()
    if (!r) return
    setPos(Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100)))
  }

  const inicio = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setArrastando(true)
    mover(e.clientX)
  }

  return (
    <div
      ref={quadro}
      className={`group relative cursor-ew-resize touch-pan-y overflow-hidden rounded-2xl bg-linho select-none ${className}`}
      onPointerDown={inicio}
      onPointerMove={(e) => arrastando && mover(e.clientX)}
      onPointerUp={() => setArrastando(false)}
      onPointerCancel={() => setArrastando(false)}
    >
      <img src={depois} alt={`Depois: ${descricao}`} className="absolute inset-0 size-full object-cover" draggable={false} />
      <img
        src={antes}
        alt={`Antes: ${descricao}`}
        className="absolute inset-0 size-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        draggable={false}
      />

      <span className="sobrescrito pointer-events-none absolute top-3 left-3 rounded-full bg-noite/55 px-3 py-1.5 text-[0.65rem] text-white backdrop-blur-md">
        Antes
      </span>
      <span className="sobrescrito pointer-events-none absolute top-3 right-3 rounded-full bg-creme/85 px-3 py-1.5 text-[0.65rem] text-tinta backdrop-blur-md">
        Depois
      </span>

      {/* Divisa e puxador. */}
      <div className="pointer-events-none absolute inset-y-0 w-px bg-white/90" style={{ left: `${pos}%` }}>
        <span
          className={`absolute top-1/2 left-1/2 grid size-12 -translate-1/2 place-items-center rounded-full border border-white/80 bg-noite/35 text-white backdrop-blur-md transition-transform duration-200 ${
            arrastando ? 'scale-110' : 'group-hover:scale-105'
          }`}
        >
          <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </span>
      </div>

      {/* Controle para o teclado e leitores de tela. */}
      <label htmlFor={id} className="sr-only">
        Comparar antes e depois: {descricao}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-valuetext={`${Math.round(pos)}% antes`}
        className="peer absolute inset-x-0 bottom-0 h-px w-full opacity-0 focus-visible:opacity-0"
      />
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-white/0 ring-inset peer-focus-visible:ring-white" />
    </div>
  )
}
