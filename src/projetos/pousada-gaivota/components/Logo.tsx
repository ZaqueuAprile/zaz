// Emblema da Gaivota redesenhado em vetor a partir da logo: a gaivota, o sol,
// as ondas e o peixe. As coordenadas seguem o desenho original.
// "cor" é a versão completa, no círculo azul; "traco" usa só a cor do texto,
// para ficar sobre foto ou vídeo.

const AZUL = '#092b68'
const OCRE = '#c78845'
const TERRACOTA = '#b2603b'

export function Emblema({
  variante = 'cor',
  className,
  titulo,
}: {
  variante?: 'cor' | 'traco'
  className?: string
  titulo?: string
}) {
  const cor = variante === 'cor'
  const ave = cor ? OCRE : 'currentColor'
  const sol = cor ? TERRACOTA : 'currentColor'
  const mar = cor ? '#ffffff' : 'currentColor'

  return (
    <svg
      viewBox="102 32 710 710"
      className={className}
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      focusable="false"
    >
      {cor && <circle cx="457" cy="387" r="355" fill={AZUL} />}
      <g fill={ave}>
        {/* asas */}
        <path d="M288 148 C360 148 405 200 405 280 L405 370 C330 370 288 320 288 250 Z" />
        <path d="M598 148 C530 150 480 200 480 280 L480 370 C550 370 598 330 598 260 Z" />
        {/* cauda e corpo */}
        <path d="M218 320 L218 370 L300 370 Z" />
        <path d="M295 370 L500 370 C532 370 546 398 540 456 L524 437 L355 437 C320 437 298 410 295 370 Z" />
      </g>
      <circle cx="653" cy="388" r="77" fill={sol} />
      <g fill={mar}>
        {/* ondas e peixe */}
        <path d="M188 497 A90 90 0 0 0 368 497 Z" />
        <path d="M368 497 A90 90 0 0 0 548 497 Z" />
        <path d="M548 497 L548 567 L593 532 Z" />
        <path d="M593 532 Q660 470 727 532 Q660 594 593 532 Z" />
      </g>
      {cor && (
        <g fill={AZUL}>
          <circle cx="502" cy="410" r="9" />
          <circle cx="690" cy="523" r="9" />
        </g>
      )}
    </svg>
  )
}

export function Marca({ variante = 'cor', className }: { variante?: 'cor' | 'traco'; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ''}`}>
      <Emblema variante={variante} className="size-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.35rem] tracking-[0.32em] uppercase">Gaivota</span>
        <span className="mt-1 text-[0.6rem] tracking-[0.42em] uppercase opacity-80">Pousada</span>
      </span>
    </span>
  )
}
