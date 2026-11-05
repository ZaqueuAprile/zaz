import emblema from '../img/emblema.png'

// O dente com o ramo de coral, recortado da logo da clínica. A imagem é só a
// forma (branca sobre transparente) e entra como máscara: a cor vem do texto,
// então o mesmo emblema serve em qualquer fundo.
export function Emblema({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block bg-current ${className}`}
      style={{
        aspectRatio: '450 / 375',
        maskImage: `url(${emblema})`,
        WebkitMaskImage: `url(${emblema})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  )
}

// Selo redondo, como o avatar do Instagram. Dourado por padrão.
export function Selo({ className = 'size-12', cor = 'bg-ouro text-white' }: { className?: string; cor?: string }) {
  return (
    <span className={`inline-grid shrink-0 place-items-center rounded-full ${cor} ${className}`}>
      <Emblema className="w-[54%]" />
    </span>
  )
}

// "Clínica" em grotesca leve e "CORAL" na serifa de alto contraste da logo.
export function Marca({ claro = false }: { claro?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Selo className="size-9" />
      <span className="flex items-baseline gap-[0.16em] text-[1.3rem] leading-none">
        <span className={`font-light tracking-[-0.03em] ${claro ? 'text-white' : 'text-tinta'}`}>Clínica</span>
        <span className={`font-acento tracking-[0.02em] not-italic ${claro ? 'text-ouro-claro' : 'text-ouro'}`}>CORAL</span>
      </span>
    </span>
  )
}
