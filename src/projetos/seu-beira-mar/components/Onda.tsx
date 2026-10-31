// Borda de onda entre duas cores. O desenho se repete duas vezes na largura
// para que a animação possa andar meia volta e recomeçar sem emenda.
const CRISTA = 'M0 40 C 120 10, 240 10, 360 40 S 600 70, 720 40 S 960 10, 1080 40 S 1320 70, 1440 40 V80 H0 Z'

export function Onda({ cor, fundo, animada = false }: { cor: string; fundo?: string; animada?: boolean }) {
  return (
    <div aria-hidden="true" className="relative h-12 overflow-hidden md:h-20" style={{ background: fundo }}>
      {animada && (
        <svg
          className="onda onda-lenta absolute inset-y-0 left-0 h-full w-[200%] opacity-40"
          viewBox="0 0 2880 80"
          preserveAspectRatio="none"
        >
          <path d={CRISTA} fill={cor} transform="translate(0 -12)" />
          <path d={CRISTA} fill={cor} transform="translate(1440 -12)" />
        </svg>
      )}
      <svg
        className={`absolute inset-y-0 left-0 h-full w-[200%] ${animada ? 'onda' : ''}`}
        viewBox="0 0 2880 80"
        preserveAspectRatio="none"
      >
        <path d={CRISTA} fill={cor} />
        <path d={CRISTA} fill={cor} transform="translate(1440 0)" />
      </svg>
    </div>
  )
}
