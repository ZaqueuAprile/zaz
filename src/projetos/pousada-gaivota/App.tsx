import {
  MotionConfig,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { useRef, useState, type ReactNode } from 'react'
import { Emblema, Marca } from './components/Logo'
import { Menu } from './components/Menu'
import { Reserva } from './components/Reserva'
import { Foto, LinkSeta, Revelar } from './components/Revelar'
import { ENDERECO, INSTAGRAM, SECOES, WHATSAPP } from './dados'
import barcoPorDoSol from './img/arredores-barco-por-do-sol.webp'
import cantinhoLeitura from './img/arredores-cantinho-leitura.webp'
import orlaBarcos from './img/arredores-orla-barcos.webp'
import peixeEscultura from './img/arredores-peixe-escultura.webp'
import praia from './img/arredores-praia.webp'
import cafeBarco from './img/cafe-barco.webp'
import cafeBule from './img/cafe-bule.webp'
import cafeMesaRio from './img/cafe-mesa-rio.webp'
import cafeSuco from './img/cafe-suco.webp'
import deckRio from './img/local-deck-rio.webp'
import entradaSuite from './img/local-entrada-suite.webp'
import janelaDeck from './img/local-janela-deck.webp'
import patioMesas from './img/local-patio-mesas.webp'
import portaSuite from './img/local-porta-suite.webp'
import portaoPlaca from './img/local-portao-placa.webp'
import suiteMantaAzul from './img/suite-manta-azul.webp'
import suiteMantaTerracota from './img/suite-manta-terracota.webp'
import suitePeixes from './img/suite-peixes.webp'
import suiteVistaRio from './img/suite-vista-rio.webp'
import capa from './video/capa.webp'
import abertura from './video/abertura.mp4'

const ANO = new Date().getFullYear()
const curva = [0.22, 1, 0.36, 1] as const

function Topo() {
  const { scrollY } = useScroll()
  const [sobreAbertura, setSobreAbertura] = useState(true)
  useMotionValueEvent(scrollY, 'change', (y) => setSobreAbertura(y < window.innerHeight - 72))

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,color,box-shadow] duration-500 ${
        sobreAbertura
          ? 'bg-linear-to-b from-black/35 to-transparent text-white'
          : 'bg-areia/90 text-tinta shadow-[0_1px_0_var(--color-areia-2)] backdrop-blur-md'
      }`}
    >
      <div className="wrap grid h-18 grid-cols-[1fr_auto_1fr] items-center">
        <div>
          <Menu claro={sobreAbertura} />
        </div>
        <a href="#inicio" aria-label="Gaivota Pousada, início">
          <Marca variante={sobreAbertura ? 'traco' : 'cor'} />
        </a>
        <a
          href="#reservas"
          className="hidden justify-self-end py-3 text-sm tracking-[0.14em] uppercase underline-offset-[6px] hover:underline sm:block"
        >
          Reservar
        </a>
      </div>
    </header>
  )
}

function Abertura() {
  const video = useRef<HTMLVideoElement>(null)
  const reduzido = useReducedMotion()
  const [tocando, setTocando] = useState(!reduzido)

  const alternar = () => {
    const v = video.current
    if (!v) return
    if (v.paused) {
      void v.play()
      setTocando(true)
    } else {
      v.pause()
      setTocando(false)
    }
  }

  return (
    <section id="inicio" className="relative isolate min-h-dvh overflow-hidden bg-mar text-white">
      {/* No celular o vídeo, que é vertical, ocupa a tela. No computador ele
          fica num arco, como o portão da pousada. */}
      <div className="absolute inset-0 -z-10 md:inset-auto md:top-28 md:right-[7vw] md:bottom-12 md:z-0 md:aspect-[9/16]">
        <motion.div
          className="size-full overflow-hidden md:arco"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: curva }}
        >
          <video
            ref={video}
            className="size-full object-cover"
            src={abertura}
            poster={capa}
            autoPlay={!reduzido}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Vídeo do caminho entre o portão da Gaivota, o rio e a praia de Santo André."
          />
        </motion.div>
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/5 to-black/60 md:hidden" aria-hidden="true" />
        <button
          type="button"
          onClick={alternar}
          className="absolute right-4 bottom-4 z-10 min-h-11 cursor-pointer rounded-md bg-black/30 px-4 text-xs tracking-[0.14em] uppercase backdrop-blur-md md:right-3 md:bottom-3"
        >
          {tocando ? 'Pausar vídeo' : 'Ver vídeo'}
        </button>
      </div>

      <div className="wrap relative flex min-h-dvh flex-col justify-end pt-28 pb-24 text-center md:justify-center md:pb-16 md:text-left">
        <div className="md:max-w-[46vw]">
          <motion.p
            className="mb-6 text-xs tracking-[0.3em] text-white/85 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Santo André · Bahia
          </motion.p>
          <h1 className="text-[clamp(2.9rem,7.6vw,6.6rem)] leading-[0.98]">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, ease: curva, delay: 0.2 }}
            >
              Na beira do rio,
            </motion.span>
            <motion.em
              className="block"
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, ease: curva, delay: 0.35 }}
            >
              a poucos passos do mar.
            </motion.em>
          </h1>
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: curva, delay: 0.7 }}
          >
            <a
              href="#reservas"
              className="inline-flex min-h-14 items-center rounded-md bg-white px-9 text-sm tracking-[0.14em] text-tinta uppercase transition-colors duration-300 hover:bg-ocre hover:text-white"
            >
              Reservar estadia
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const CARTA = [
  'Bem-vindo à Gaivota.',
  'Aqui o dia começa com o rio na janela',
  'e termina com o céu pintado de rosa.',
  'Fique o tempo que precisar.',
]

function Carta() {
  const reduzido = useReducedMotion()
  return (
    <section aria-label="Boas-vindas" className="wrap py-28 md:py-44">
      {/* Cada linha se "escreve" da esquerda para a direita, uma depois da outra. */}
      <motion.div
        className="mx-auto max-w-5xl -rotate-2 text-center font-mao text-[clamp(1.5rem,3.6vw,2.9rem)] leading-[1.6] text-balance"
        initial={reduzido ? false : 'oculta'}
        whileInView="visivel"
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      >
        {CARTA.map((linha, i) => (
          <motion.p
            key={linha}
            variants={{
              oculta: { clipPath: 'inset(-20% 100% -20% 0)' },
              visivel: { clipPath: 'inset(-20% 0% -20% 0)' },
            }}
            transition={{ duration: 1.4, ease: 'easeInOut', delay: i * 0.55 }}
          >
            {linha}
          </motion.p>
        ))}
        <motion.p
          className="mt-14 flex items-center justify-center gap-4 text-[0.7em] text-tinta-2"
          variants={{ oculta: { opacity: 0 }, visivel: { opacity: 1 } }}
          transition={{ duration: 1, delay: CARTA.length * 0.55 + 0.4 }}
        >
          <Emblema className="size-12 rotate-2" />
          Gaivota
        </motion.p>
      </motion.div>
    </section>
  )
}

function Mundo() {
  const secao = useRef<HTMLElement>(null)
  const reduzido = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: secao, offset: ['start end', 'end start'] })
  const lento = useTransform(scrollYProgress, [0, 1], reduzido ? [0, 0] : [60, -60])
  const rapido = useTransform(scrollYProgress, [0, 1], reduzido ? [0, 0] : [180, -180])

  const foto = (src: string, alt: string, extra = '') => (
    <img src={src} alt={alt} loading="lazy" decoding="async" className={`w-full object-cover brightness-[0.78] ${extra}`} />
  )

  return (
    <section ref={secao} aria-labelledby="mundo-titulo" className="relative bg-mar-fundo text-white">
      <div className="pointer-events-none sticky top-0 z-10 grid h-dvh place-items-center px-6">
        <h2
          id="mundo-titulo"
          className="max-w-5xl text-center text-[clamp(2.4rem,5.6vw,5.4rem)] leading-[1.04] [text-shadow:0_2px_30px_rgb(0_0_0/0.35)]"
        >
          Um pedaço de Santo André <br className="hidden md:block" />
          na beira do rio. <em>Feito para ficar.</em>
        </h2>
      </div>
      <div className="relative -mt-[100dvh] grid grid-cols-2 gap-[6vw] pb-[10vh] md:px-[9vw]">
        <motion.div style={{ y: lento }} className="flex flex-col gap-[14vh] pt-[22vh]">
          {foto(portaoPlaca, 'Portão azul da Gaivota com a placa da pousada no muro laranja e o rio ao fundo.', 'aspect-[4/5]')}
          {foto(orlaBarcos, 'Barcos de pesca ancorados no rio, vistos da orla gramada da vila ao entardecer.', 'aspect-[3/4]')}
        </motion.div>
        <motion.div style={{ y: rapido }} className="flex flex-col gap-[14vh] pt-[8vh]">
          {foto(cafeMesaRio, 'Mesa de café da manhã servida de frente para o rio e para o mangue.', 'aspect-[3/4]')}
          {foto(peixeEscultura, 'Escultura de peixe em madeira na beira do rio, com o céu rosado do fim de tarde.', 'aspect-[4/5]')}
        </motion.div>
      </div>
    </section>
  )
}

function Cabecalho({
  id,
  titulo,
  italico,
  children,
  link,
}: {
  id: string
  titulo: string
  italico: string
  children: ReactNode
  link?: { href: string; texto: string }
}) {
  return (
    <div className="grid gap-12 md:grid-cols-12">
      <Revelar className="md:col-span-7">
        <h2 id={id} className="titulo">
          {titulo} <em>{italico}</em>
        </h2>
      </Revelar>
      <Revelar className="space-y-5 text-lg text-tinta-2 md:col-span-5 md:pt-4" atraso={0.1}>
        {children}
        {link && (
          <div className="pt-6 text-tinta">
            <LinkSeta href={link.href}>{link.texto}</LinkSeta>
          </div>
        )}
      </Revelar>
    </div>
  )
}

function Suites() {
  return (
    <section id="suites" aria-labelledby="suites-titulo" className="wrap py-28 md:py-44">
      <Cabecalho
        id="suites-titulo"
        titulo="A arte de chegar"
        italico="e se sentir em casa"
        link={{ href: '#reservas', texto: 'Reservar uma suíte' }}
      >
        <p>
          As suítes têm a calma de uma casa de vila: paredes brancas, madeira, palha e peças feitas à mão. Roupa de cama
          branca, luz baixa à noite e, em algumas, o rio logo depois da porta.
        </p>
      </Cabecalho>

      <div className="mt-20 grid grid-cols-2 gap-3 md:mt-28 md:gap-6">
        <div className="space-y-3 md:space-y-6">
          <Foto src={suiteVistaRio} rotulo="Janela para o rio" alt="Cama arrumada com toalhas enroladas e, pela porta aberta, o deck de palha e o rio." />
          <Foto src={suiteMantaTerracota} rotulo="Terracota" alt="Suíte com manta terracota, mandala de palha na parede e luminária de palha acesa." atraso={0.1} />
        </div>
        <div className="mt-20 space-y-3 md:mt-40 md:space-y-6">
          <Foto src={suiteMantaAzul} rotulo="Azul-marinho" alt="Cama de casal com manta azul-marinho, peixe de madeira na parede e estante de madeira." />
          <Foto src={suitePeixes} rotulo="Cardume" alt="Suíte clara com peixes de madeira na parede, cavalo-marinho vermelho e manta azul." atraso={0.1} />
        </div>
      </div>
    </section>
  )
}

function Cafe() {
  return (
    <section id="cafe" aria-labelledby="cafe-titulo" className="wrap pb-28 md:pb-44">
      <Cabecalho id="cafe-titulo" titulo="Um café" italico="com gosto da nossa terra">
        <p>Na mesa da Gaivota, o café da manhã também é uma forma de conhecer um pouco mais da nossa terra.</p>
        <p>
          Café orgânico, vindo da Chapada Diamantina, e pão artesanal de um produtor local, preparado com fermentação
          lenta, daqueles que pedem tempo, cuidado e uma boa conversa à mesa.
        </p>
      </Cabecalho>

      <div className="mt-20 md:mt-28">
        <Foto
          src={cafeBarco}
          proporcao="aspect-[4/3] md:aspect-[21/9]"
          etiqueta="Café da manhã"
          alt="Hóspedes tomando café da manhã enquanto um barco de pesca azul e laranja passa no rio."
        />
        <div className="mt-3 grid grid-cols-2 gap-3 md:mt-6 md:gap-6">
          <Foto src={cafeBule} proporcao="aspect-[4/3]" alt="Bule de porcelana azul e branca, suco de laranja e xícara azul na mesa de madeira." />
          <Foto
            src={cafeSuco}
            proporcao="aspect-[4/3]"
            className="mt-12 md:mt-24"
            alt="Suco de laranja sendo servido num copo, com bolo de chocolate e pães ao fundo."
            atraso={0.1}
          />
        </div>
      </div>
    </section>
  )
}

const ESPACOS = [
  { src: deckRio, nome: 'Deck no rio', alt: 'Deck coberto de palha sobre o rio, com mesa de madeira, sofá e boias penduradas.' },
  { src: patioMesas, nome: 'Pátio', alt: 'Pátio com mesas de madeira, cadeiras amarelas e azuis e as portas azuis das suítes.' },
  { src: janelaDeck, nome: 'Janelas', alt: 'Vista da janela para o deck, com uma planta e o rio ao fundo.' },
  { src: portaSuite, nome: 'Portas azuis', alt: 'Porta azul da suíte 2 com batente terracota, iluminada pelo sol da tarde.' },
  { src: entradaSuite, nome: 'Varandas', alt: 'Entrada de suíte com banco e mesa de tronco, plantas e flores amarelas no chão.' },
]

function Pousada() {
  const trilho = useRef<HTMLDivElement>(null)
  const mover = (direcao: 1 | -1) => {
    const t = trilho.current
    if (!t) return
    const passo = (t.firstElementChild as HTMLElement | null)?.offsetWidth ?? t.clientWidth
    t.scrollBy({ left: direcao * (passo + 24), behavior: 'smooth' })
  }

  return (
    <section id="pousada" aria-labelledby="pousada-titulo" className="bg-areia-2/60 py-28 md:py-44">
      <div className="wrap">
        <Cabecalho id="pousada-titulo" titulo="Espaços para" italico="não ter pressa">
          <p>
            Um deck coberto de palha em cima do rio, um pátio com mesas ao sol e varandas de sombra entre as plantas. Na
            Gaivota, o tempo é seu.
          </p>
        </Cabecalho>
      </div>

      <div
        ref={trilho}
        role="region"
        aria-label="Fotos dos espaços da pousada"
        tabIndex={0}
        className="mt-20 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[max(1.5rem,calc((100vw-82rem)/2+3.5rem))] pb-4 [scrollbar-width:none] md:mt-28"
      >
        {ESPACOS.map((e, i) => (
          <Foto
            key={e.nome}
            src={e.src}
            alt={e.alt}
            etiqueta={e.nome}
            atraso={i * 0.06}
            className="w-[78vw] shrink-0 snap-start sm:w-[44vw] lg:w-[28vw]"
          />
        ))}
      </div>

      <div className="wrap mt-8 flex gap-3">
        {([
          [-1, 'Fotos anteriores', 'M20 12H5M11 6l-6 6 6 6'],
          [1, 'Próximas fotos', 'M4 12h15M13 6l6 6-6 6'],
        ] as const).map(([d, rotulo, caminho]) => (
          <button
            key={rotulo}
            type="button"
            onClick={() => mover(d)}
            aria-label={rotulo}
            className="grid size-14 cursor-pointer place-items-center rounded-md bg-areia transition-colors hover:bg-terracota hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
              <path d={caminho} fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>
        ))}
      </div>
    </section>
  )
}

function FimDeTarde() {
  const secao = useRef<HTMLElement>(null)
  const reduzido = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: secao, offset: ['start end', 'end start'] })
  const zoom = useTransform(scrollYProgress, [0, 1], reduzido ? [1, 1] : [1.18, 1])

  return (
    <section ref={secao} aria-label="Fim de tarde" className="relative h-[92dvh] overflow-hidden text-white">
      <motion.img
        src={barcoPorDoSol}
        alt="Barco de madeira ancorado no rio ao pôr do sol, com o céu rosado sobre o mangue."
        loading="lazy"
        decoding="async"
        style={{ scale: zoom }}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" aria-hidden="true" />
      <div className="wrap relative flex h-full items-end pb-14 md:pb-20">
        <Revelar>
          <p className="max-w-3xl font-display text-[clamp(2.4rem,6vw,5.2rem)] leading-[1.02] font-light">
            No fim da tarde, o rio <em>fica cor-de-rosa.</em>
          </p>
        </Revelar>
      </div>
    </section>
  )
}

function SantoAndre() {
  return (
    <section id="santo-andre" aria-labelledby="santo-andre-titulo" className="wrap py-28 md:py-44">
      <div className="grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Revelar>
            <h2 id="santo-andre-titulo" className="titulo">
              Santo André, <em>no seu ritmo</em>
            </h2>
          </Revelar>
          <Revelar className="mt-10 space-y-5 text-lg text-tinta-2" atraso={0.1}>
            <p>
              A Gaivota fica na vila de Santo André, em Santa Cruz Cabrália, no sul da Bahia. O rio passa em frente e a
              praia está a poucos metros: dá para ir a pé, de chinelo.
            </p>
            <p>Barcos de pesca, ruas de areia, o cantinho da leitura na beira d’água e o mar logo ali.</p>
          </Revelar>
        </div>
        <div className="grid grid-cols-2 gap-3 md:col-span-7 md:gap-6">
          <Foto src={praia} rotulo="A praia" alt="Praia de areia dourada com ondas baixas e coqueiros ao fundo, no fim da tarde." />
          <Foto
            src={cantinhoLeitura}
            rotulo="Cantinho da leitura"
            className="mt-16 md:mt-32"
            alt="Pequena biblioteca de madeira amarela com a placa Cantinho da Leitura, de frente para o mar ao entardecer."
            atraso={0.1}
          />
        </div>
      </div>
    </section>
  )
}

function Reservas() {
  return (
    <section id="reservas" aria-labelledby="reservas-titulo" className="border-t border-areia-2 py-28 md:py-44">
      <div className="wrap grid gap-16 md:grid-cols-12">
        <Revelar className="md:col-span-5">
          <h2 id="reservas-titulo" className="titulo">
            Reserve <em>a sua estadia</em>
          </h2>
          <p className="mt-10 max-w-md text-lg text-tinta-2">
            Escolha as datas e quantas pessoas vêm. O pedido segue pelo WhatsApp e a pousada responde por lá.
          </p>
        </Revelar>
        <Revelar className="md:col-span-6 md:col-start-7" atraso={0.1}>
          <Reserva />
        </Revelar>
      </div>
    </section>
  )
}

function Rodape() {
  return (
    <footer className="border-t border-areia-2 bg-areia">
      <div className="wrap py-20">
        <p className="text-2xl text-tinta-2/80">Mapa do site</p>
        <ol className="mt-12 grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {SECOES.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="group flex items-baseline gap-6 text-[clamp(1.5rem,3vw,2rem)]">
                <span className="w-8 text-base text-tinta-2/80 tabular-nums">0{i + 1}</span>
                <span className="underline-offset-8 group-hover:underline">{s.nome}</span>
              </a>
            </li>
          ))}
        </ol>

        <div className="mt-20 grid gap-12 border-t border-tinta/25 pt-16 sm:grid-cols-2">
          <div>
            <p className="text-lg text-tinta-2/80">Contato</p>
            <div className="mt-6 space-y-1 text-[clamp(1.25rem,2.4vw,1.6rem)]">
              {WHATSAPP && (
                <p>
                  <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener" className="underline-offset-8 hover:underline">
                    WhatsApp
                  </a>
                </p>
              )}
              {ENDERECO.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
          </div>
          <div>
            <p className="text-lg text-tinta-2/80">Redes</p>
            <p className="mt-6 text-[clamp(1.25rem,2.4vw,1.6rem)]">
              <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener" className="underline-offset-8 hover:underline">
                Instagram
              </a>
            </p>
          </div>
        </div>

        <div className="mt-24 flex flex-col items-center gap-6 text-center">
          <Emblema className="size-20" titulo="Gaivota" />
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-tinta-2">
            <p>© {ANO} Gaivota Pousada</p>
            <a href="../" className="underline underline-offset-4">
              Conceito de portfólio
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-50 -translate-y-24 rounded-md bg-mar px-4 py-2 text-white focus:translate-y-0"
      >
        Ir para o conteúdo
      </a>
      <Topo />
      <main id="conteudo">
        <Abertura />
        <Carta />
        <Mundo />
        <Suites />
        <Cafe />
        <Pousada />
        <FimDeTarde />
        <SantoAndre />
        <Reservas />
      </main>
      <Rodape />
    </MotionConfig>
  )
}
