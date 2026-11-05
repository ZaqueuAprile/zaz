import emblema from '../img/emblema.png'

// O dente com o ramo de coral, recortado da logo da clínica. A imagem é só a
// forma (branca sobre transparente) e entra como máscara: a cor vem do texto,
// então o mesmo emblema serve no claro e no escuro.
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

// Selo redondo dourado, como o avatar do Instagram.
export function Selo({ className = 'size-12' }: { className?: string }) {
  return (
    <span className={`inline-grid shrink-0 place-items-center rounded-full bg-ouro text-white ${className}`}>
      <Emblema className="w-[52%]" />
    </span>
  )
}

// "Clínica" em sem serifa fina, "CORAL" em Bodoni e o subtítulo espaçado.
export function Marca({ claro = false, subtitulo = true }: { claro?: boolean; subtitulo?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <Selo className="size-10 sm:size-11" />
      <span className="flex flex-col leading-none">
        <span className="flex items-baseline gap-[0.18em] text-[1.35rem] sm:text-2xl">
          <span className={`font-sans font-light tracking-[-0.02em] ${claro ? 'text-white' : 'text-tinta'}`}>Clínica</span>
          <span className={`font-display tracking-[0.02em] ${claro ? 'text-[#d8c3a2]' : 'text-ouro'}`}>CORAL</span>
        </span>
        {subtitulo && (
          <span className={`mt-1.5 font-display text-[0.5rem] tracking-[0.32em] ${claro ? 'text-white/70' : 'text-tinta-2'}`}>
            ODONTOLOGIA &amp; ESTÉTICA
          </span>
        )}
      </span>
    </span>
  )
}
