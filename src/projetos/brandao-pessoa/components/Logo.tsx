// Monograma BP redesenhado em vetor a partir da logo: um só traço que forma o
// P por dentro e o B por fora, com a curva de baixo aberta. As coordenadas
// seguem o desenho original.

const TRACO = 'M290 703V548H460C515 548 546 501 546 442C546 383 515 336 460 336H188V810H472A122 122 0 0 0 560 604'

export function Monograma({
  circulo = false,
  className,
  titulo,
}: {
  circulo?: boolean
  className?: string
  titulo?: string
}) {
  return (
    <svg
      viewBox="17 212 710 710"
      className={className}
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      focusable="false"
    >
      {circulo && <circle cx="372" cy="567" r="355" fill="#111c32" />}
      <path d={TRACO} fill="none" stroke={circulo ? '#fff' : 'currentColor'} strokeWidth="48" />
    </svg>
  )
}

export function Marca({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3.5 ${className ?? ''}`}>
      <Monograma className="size-9 shrink-0" />
      <span aria-hidden="true" className="h-10 w-px bg-current opacity-40" />
      <span className="flex flex-col leading-none">
        <span className="text-[0.95rem] font-medium tracking-[0.24em] uppercase">Brandão</span>
        <span className="mt-1 text-[0.95rem] font-medium tracking-[0.24em] uppercase">&amp; Pessoa</span>
        <span className="mt-1.5 text-[0.5rem] tracking-[0.5em] uppercase opacity-75">Advocacia</span>
      </span>
    </span>
  )
}
