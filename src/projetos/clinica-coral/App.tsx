import { MotionConfig, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Agendar } from './components/Agendar'
import { AntesDepois } from './components/AntesDepois'
import { curva } from './components/curva'
import { Emblema, Marca, Selo } from './components/Logo'
import { Menu } from './components/Menu'
import { Filete, Revelar } from './components/Revelar'
import {
  DENTISTAS,
  ENDERECO,
  HORARIOS,
  INSTAGRAM,
  SECOES,
  TELEFONE,
  TRATAMENTOS,
  WHATSAPP,
  type Dentista,
  type IdTratamento,
} from './dados'
import alinhador from './img/alinhador.webp'
import draJulia from './img/dra-julia.webp'
import facetasAntes from './img/facetas-antes.webp'
import facetasDepois from './img/facetas-depois.webp'
import facetasPerfil from './img/facetas-perfil.webp'
import facetasRosto from './img/facetas-rosto.webp'
import parcialAntes from './img/protese-parcial-antes.webp'
import parcialDepois from './img/protese-parcial-depois.webp'
import totalAntes from './img/protese-total-antes.webp'
import totalDepois from './img/protese-total-depois.webp'
import restauracaoAntes from './img/restauracao-antes.webp'
import restauracaoDepois from './img/restauracao-depois.webp'

const ANO = new Date().getFullYear()
type Interesse = IdTratamento | 'nao-sei' | ''
type Escolher = (id: IdTratamento) => void

// Fotos das dentistas, pelo `id` de DENTISTAS. Sem foto, o cartão mostra as iniciais.
const FOTOS: Record<string, { src: string; fundo: string; posicao?: string }> = {
  julia: { src: draJulia, fundo: 'bg-faixa', posicao: '50% 10%' },
}

const iniciais = (nome: string) =>
  nome
    .replace(/^Dra?\.\s*/, '')
    .split(/\s+/)
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')

function Seta({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M5 19L19 5M9 5h10v10" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

// Botão principal, sempre levando ao agendamento.
function BotaoAgendar({
  texto = 'Agendar avaliação',
  aoClicar,
  className = '',
}: {
  texto?: string
  aoClicar?: () => void
  className?: string
}) {
  return (
    <a
      href="#agendar"
      onClick={aoClicar}
      className={`group inline-flex min-h-13 items-center justify-center gap-3 rounded-full bg-coral pr-2 pl-6 font-medium text-white transition-colors duration-300 hover:bg-coral-escuro ${className}`}
    >
      {texto}
      <span className="grid size-9 place-items-center rounded-full bg-white/15 transition-transform duration-300 group-hover:rotate-45">
        <Seta />
      </span>
    </a>
  )
}

function Etiqueta({ children, claro = false }: { children: ReactNode; claro?: boolean }) {
  return (
    <p className={`etiqueta inline-flex items-center gap-2.5 ${claro ? 'text-white/80' : 'text-tinta-2'}`}>
      <span className={`size-2 rounded-full ${claro ? 'bg-ouro-claro' : 'bg-coral'}`} aria-hidden="true" />
      {children}
    </p>
  )
}

function Topo() {
  const { scrollY } = useScroll()
  const [rolou, setRolou] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setRolou(y > 24))

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 md:px-6 md:pt-4">
      <div
        className={`mx-auto flex h-16 max-w-[84rem] items-center justify-between gap-6 rounded-full border pr-2 pl-4 transition-[background-color,border-color,box-shadow] duration-500 md:pl-5 ${
          rolou
            ? 'border-linho/80 bg-creme/85 shadow-[0_10px_30px_-18px_rgb(29_25_22/0.35)] backdrop-blur-md'
            : 'border-transparent bg-transparent'
        }`}
      >
        <a href="#inicio" aria-label="Clínica Coral, início">
          <Marca />
        </a>
        <nav aria-label="Seções" className="hidden items-center gap-1 md:flex">
          {SECOES.filter((s) => s.id !== 'agendar').map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full px-4 py-2 text-[0.95rem] text-tinta-2 transition-colors hover:bg-areia hover:text-tinta"
            >
              {s.nome}
            </a>
          ))}
          <a
            href="#agendar"
            className="ml-2 inline-flex min-h-12 items-center rounded-full bg-tinta px-6 text-[0.95rem] font-medium text-white transition-colors hover:bg-coral"
          >
            Agendar avaliação
          </a>
        </nav>
        <div className="pr-3 md:hidden">
          <Menu />
        </div>
      </div>
    </header>
  )
}

function Equipe({ pequena = false }: { pequena?: boolean }) {
  return (
    <div className="flex -space-x-3">
      {DENTISTAS.map((d) => {
        const foto = FOTOS[d.id]
        return foto ? (
          <img
            key={d.id}
            src={foto.src}
            alt=""
            className={`${pequena ? 'size-11' : 'size-14'} rounded-full border-2 border-coral object-cover ${foto.fundo}`}
            style={{ objectPosition: foto.posicao }}
          />
        ) : (
          <span
            key={d.id}
            aria-hidden="true"
            className={`${pequena ? 'size-11 text-sm' : 'size-14 text-base'} grid place-items-center rounded-full border-2 border-coral bg-blush font-acento text-coral-escuro italic`}
          >
            {iniciais(d.nome)}
          </span>
        )
      })}
    </div>
  )
}

// Abertura em grade de blocos: o título, a foto do resultado, o antes e
// depois para arrastar e o bloco coral com a equipe.
function Abertura() {
  const entra = (atraso: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: curva, delay: atraso },
  })

  return (
    <section id="inicio" className="pt-24 pb-4 md:pt-28">
      <div className="wrap grid gap-3 md:grid-cols-12 md:gap-4">
        <motion.div {...entra(0)} className="bloco relative flex flex-col justify-between overflow-hidden bg-areia p-6 sm:p-10 md:col-span-7 md:min-h-[34rem] md:p-12">
          <Emblema className="pointer-events-none absolute -right-24 -bottom-20 w-[26rem] text-ouro/12 md:w-[34rem]" />
          <Etiqueta>Odontologia &amp; Estética</Etiqueta>
          <div className="relative mt-16 md:mt-0">
            <h1 className="text-[clamp(3rem,7.4vw,6.6rem)] leading-[0.92]">
              Seu sorriso,
              <br />
              <span className="acento text-coral">no detalhe.</span>
            </h1>
            <p className="mt-7 max-w-md text-lg text-tinta-2">
              Lentes e facetas, alinhadores invisíveis, próteses e restaurações estéticas, planejados com você em cada
              etapa.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <BotaoAgendar />
              <a
                href="#casos"
                className="inline-flex min-h-13 items-center rounded-full border border-tinta/20 px-6 font-medium transition-colors hover:border-tinta hover:bg-tinta hover:text-white"
              >
                Ver antes e depois
              </a>
            </div>
          </div>
        </motion.div>

        <motion.figure {...entra(0.1)} className="bloco relative min-h-[26rem] overflow-hidden bg-linho md:col-span-5">
          <img
            src={facetasRosto}
            alt="Paciente sorrindo depois do tratamento com lentes e facetas na Clínica Coral."
            className="absolute inset-0 size-full object-cover object-[50%_62%]"
            fetchPriority="high"
          />
          <figcaption className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-full bg-creme/90 py-2 pr-2 pl-5 backdrop-blur-md">
            <span className="text-sm">
              <span className="text-tinta-2">Resultado ·</span> Lentes e facetas
            </span>
            <a href="#casos" aria-label="Ver o caso de lentes e facetas" className="grid size-10 place-items-center rounded-full bg-tinta text-white transition-colors hover:bg-coral">
              <Seta />
            </a>
          </figcaption>
        </motion.figure>

        <motion.div {...entra(0.2)} className="md:col-span-8">
          <AntesDepois
            antes={facetasAntes}
            depois={facetasDepois}
            descricao="sorriso antes e depois das lentes e facetas"
            className="aspect-[16/10] sm:aspect-[1080/440] md:h-full md:aspect-auto md:min-h-[17rem]"
          />
        </motion.div>

        <motion.div {...entra(0.3)} className="bloco flex flex-col justify-between gap-10 bg-coral p-6 text-white sm:p-8 md:col-span-4">
          <div className="flex items-center justify-between">
            <Equipe />
            <Selo className="size-12" cor="bg-white/15 text-white" />
          </div>
          <div>
            <p className="text-[clamp(1.6rem,2.4vw,2.1rem)] leading-[1.05] font-medium tracking-[-0.03em]">
              Duas dentistas, <span className="acento">um mesmo cuidado.</span>
            </p>
            <a href="#equipe" className="mt-4 inline-flex items-center gap-2 text-white/85 underline-offset-4 hover:underline">
              Conheça a equipe <Seta className="size-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Faixa coral que corre com os tratamentos, separados pelo emblema.
function Letreiro() {
  const itens = TRATAMENTOS.map((t) => t.nome)
  const linha = (oculta: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={oculta || undefined}>
      {itens.map((i) => (
        <li key={i} className="flex items-center">
          <span className="px-6 text-[clamp(1.6rem,3.4vw,2.8rem)] font-medium tracking-[-0.03em] whitespace-nowrap md:px-10">{i}</span>
          <Emblema className="w-9 text-ouro-claro md:w-12" />
        </li>
      ))}
    </ul>
  )
  return (
    <div className="my-12 overflow-hidden bg-tinta py-5 text-creme md:my-20 md:py-7">
      <div className="flex w-max animate-letreiro motion-reduce:animate-none">
        {linha(false)}
        {linha(true)}
      </div>
    </div>
  )
}

const CARTOES: Record<IdTratamento, { src: string; alt: string; antes?: string; layout: string; posicao?: string }> = {
  facetas: {
    src: facetasDepois,
    antes: facetasAntes,
    alt: 'Sorriso depois das lentes e facetas.',
    layout: 'md:col-span-7 md:row-span-2 min-h-[24rem] md:min-h-[36rem]',
    posicao: '50% 50%',
  },
  alinhadores: {
    src: alinhador,
    alt: 'Mão segurando um alinhador transparente.',
    layout: 'md:col-span-5 md:row-span-2 min-h-[28rem] md:min-h-[36rem]',
    posicao: '50% 20%',
  },
  proteses: {
    src: totalDepois,
    antes: totalAntes,
    alt: 'Sorriso depois da reabilitação com prótese total.',
    layout: 'md:col-span-5 min-h-[22rem]',
  },
  restauracoes: {
    src: restauracaoDepois,
    antes: restauracaoAntes,
    alt: 'Dente depois da restauração estética em resina.',
    layout: 'md:col-span-7 min-h-[22rem]',
    posicao: '20% 50%',
  },
}

function Tratamentos({ escolher }: { escolher: Escolher }) {
  return (
    <section id="tratamentos" aria-labelledby="tratamentos-titulo" className="py-12 md:py-20">
      <div className="wrap">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <Revelar className="md:col-span-7">
            <Etiqueta>Tratamentos</Etiqueta>
            <h2 id="tratamentos-titulo" className="titulo mt-5">
              Do detalhe <span className="acento text-coral">ao sorriso inteiro.</span>
            </h2>
          </Revelar>
          <Revelar className="md:col-span-4 md:col-start-9" atraso={0.1}>
            <p className="text-lg text-tinta-2">
              Tudo começa com uma avaliação: conversa, exame e fotos. Passe o dedo ou o mouse nos cartões para ver o antes.
            </p>
          </Revelar>
        </div>

        <ul className="mt-10 grid gap-3 md:mt-14 md:grid-cols-12 md:gap-4">
          {TRATAMENTOS.map((t, i) => {
            const c = CARTOES[t.id]
            return (
              <Revelar key={t.id} className={`${c.layout} flex`} atraso={(i % 2) * 0.08}>
                <li className="group bloco relative flex w-full flex-col justify-end overflow-hidden bg-noite text-white">
                  <img
                    src={c.src}
                    alt={c.alt}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                    style={{ objectPosition: c.posicao }}
                  />
                  {c.antes && (
                    <img
                      src={c.antes}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-active:opacity-100"
                      style={{ objectPosition: c.posicao }}
                    />
                  )}
                  {c.antes && (
                    <span className="etiqueta absolute top-4 right-4 rounded-full bg-noite/60 px-3.5 py-1.5 text-[0.68rem] backdrop-blur-md">
                      <span className="group-hover:hidden">Depois</span>
                      <span className="hidden group-hover:inline">Antes</span>
                    </span>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-noite/90 via-noite/45 to-noite/5 md:via-noite/25" aria-hidden="true" />
                  <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-end sm:justify-between md:p-8">
                    <div className="max-w-md">
                      <span className="font-acento text-lg text-ouro-claro italic">0{i + 1}</span>
                      <h3 className="mt-1 text-[clamp(1.9rem,3.2vw,2.8rem)] leading-none">{t.nome}</h3>
                      <p className="mt-3 text-white/80">{t.texto}</p>
                    </div>
                    <a
                      href="#agendar"
                      onClick={() => escolher(t.id)}
                      aria-label={`Agendar avaliação: ${t.nome}`}
                      className="inline-flex min-h-12 shrink-0 items-center gap-2 self-start rounded-full bg-white px-5 text-[0.95rem] font-medium text-tinta transition-colors hover:bg-coral hover:text-white sm:self-auto"
                    >
                      Agendar <Seta className="size-3.5" />
                    </a>
                  </div>
                </li>
              </Revelar>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

const MOTIVOS_ESQUERDA = ['Discretos e removíveis', 'Mais conforto no dia a dia', 'Menos dores']
const MOTIVOS_DIREITA = ['Tratamento mais prático', 'Planejamento exclusivo para o seu sorriso']

// O post dos alinhadores refeito como seção: a mão com a placa no meio e os
// motivos ligados a ela por filetes.
function Alinhadores({ escolher }: { escolher: Escolher }) {
  const motivo = (texto: string, lado: 'esq' | 'dir', i: number) => (
    <li key={texto} className={`flex items-center gap-4 ${lado === 'esq' ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      <span className="size-2 shrink-0 rounded-full bg-coral-vivo md:hidden" aria-hidden="true" />
      <span className={`text-xl leading-snug md:max-w-[16rem] ${lado === 'esq' ? 'md:text-right' : ''}`}>{texto}</span>
      <Filete className={`hidden flex-1 text-coral-vivo md:block ${lado === 'dir' ? 'origin-right!' : ''}`} atraso={0.15 * i} />
    </li>
  )

  return (
    <section aria-labelledby="alinhadores-titulo" className="px-3 md:px-6">
      <div className="bloco mx-auto max-w-[90rem] overflow-hidden bg-noite py-20 text-white md:py-28">
        <div className="wrap">
          <Revelar className="text-center">
            <Etiqueta claro>Motivos para escolher</Etiqueta>
            <h2 id="alinhadores-titulo" className="mt-5 text-[clamp(2.8rem,8vw,7.2rem)] leading-[0.92]">
              alinhadores <span className="acento text-coral-vivo">invisíveis.</span>
            </h2>
          </Revelar>

          <div className="mt-14 grid items-center gap-5 md:mt-20 md:grid-cols-[1fr_minmax(0,22rem)_1fr] md:gap-0">
            <ul className="order-2 grid gap-5 md:order-none md:gap-24">{MOTIVOS_ESQUERDA.map((m, i) => motivo(m, 'esq', i))}</ul>
            <Revelar className="order-1 mx-auto mb-6 w-full max-w-[18rem] md:order-none md:mb-0 md:max-w-none">
              <div className="relative aspect-[545/1075] overflow-hidden rounded-full">
                <img src={alinhador} alt="Mão segurando um alinhador transparente, numa sala com luz de vela." loading="lazy" className="size-full object-cover" />
              </div>
            </Revelar>
            <ul className="order-3 grid gap-5 md:order-none md:gap-32">{MOTIVOS_DIREITA.map((m, i) => motivo(m, 'dir', i))}</ul>
          </div>

          <Revelar className="mt-14 flex justify-center md:mt-20">
            <BotaoAgendar texto="Quero avaliar alinhadores" aoClicar={() => escolher('alinhadores')} />
          </Revelar>
        </div>
      </div>
    </section>
  )
}

const CASOS = [
  {
    id: 'facetas',
    aba: 'Lentes e facetas',
    titulo: 'Cor e forma refeitas',
    texto:
      'Dentes amarelados e com espaço entre os centrais ganharam cor, forma e proporção novas, desenhadas para o rosto do paciente.',
    antes: facetasAntes,
    depois: facetasDepois,
    descricao: 'sorriso antes e depois das lentes e facetas',
    extras: [
      { src: facetasRosto, alt: 'O paciente sorrindo de frente, depois do tratamento.' },
      { src: facetasPerfil, alt: 'O sorriso do paciente visto de lado, depois do tratamento.' },
    ],
    tratamento: 'facetas' as IdTratamento,
  },
  {
    id: 'protese-total',
    aba: 'Prótese total',
    titulo: 'Um sorriso inteiro, de novo',
    texto: 'Dentes desgastados e manchados substituídos por uma reabilitação com prótese total, com mordida e proporção refeitas.',
    antes: totalAntes,
    depois: totalDepois,
    descricao: 'reabilitação com prótese total',
    extras: [],
    tratamento: 'proteses' as IdTratamento,
  },
  {
    id: 'protese-parcial',
    aba: 'Prótese parcial',
    titulo: 'Os espaços preenchidos',
    texto: 'Os espaços entre os dentes inferiores foram preenchidos com uma prótese parcial removível, apoiada nos dentes naturais.',
    antes: parcialAntes,
    depois: parcialDepois,
    descricao: 'reabilitação com prótese parcial removível',
    extras: [],
    tratamento: 'proteses' as IdTratamento,
  },
]

function Casos({ escolher }: { escolher: Escolher }) {
  const [ativo, setAtivo] = useState(0)
  const caso = CASOS[ativo]

  const teclas = (e: KeyboardEvent) => {
    const passo = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!passo) return
    e.preventDefault()
    const novo = (ativo + passo + CASOS.length) % CASOS.length
    setAtivo(novo)
    document.getElementById(`aba-${CASOS[novo].id}`)?.focus()
  }

  return (
    <section id="casos" aria-labelledby="casos-titulo" className="py-20 md:py-32">
      <div className="wrap">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Revelar>
            <Etiqueta>Casos da clínica</Etiqueta>
            <h2 id="casos-titulo" className="titulo mt-5">
              Arraste <span className="acento text-coral">e compare.</span>
            </h2>
          </Revelar>
          <div
            role="tablist"
            aria-label="Casos"
            className="-mx-4 flex gap-1 overflow-x-auto px-4 md:mx-0 md:rounded-full md:bg-areia md:p-1.5"
            onKeyDown={teclas}
          >
            {CASOS.map((c, i) => (
              <button
                key={c.id}
                id={`aba-${c.id}`}
                role="tab"
                type="button"
                aria-selected={i === ativo}
                aria-controls="painel-caso"
                tabIndex={i === ativo ? 0 : -1}
                onClick={() => setAtivo(i)}
                className={`min-h-11 shrink-0 cursor-pointer rounded-full px-5 text-[0.95rem] whitespace-nowrap transition-colors duration-300 ${
                  i === ativo ? 'bg-coral text-white' : 'bg-areia text-tinta-2 hover:text-tinta md:bg-transparent'
                }`}
              >
                {c.aba}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={caso.id}
          id="painel-caso"
          role="tabpanel"
          aria-labelledby={`aba-${caso.id}`}
          className="mt-10 grid gap-3 md:mt-14 md:grid-cols-12 md:gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: curva }}
        >
          <AntesDepois
            antes={caso.antes}
            depois={caso.depois}
            descricao={caso.descricao}
            className="aspect-[16/10] sm:aspect-[1080/440] md:col-span-8 md:aspect-auto md:min-h-[24rem]"
          />
          <div className="bloco flex flex-col bg-blush p-6 sm:p-8 md:col-span-4">
            <h3 className="text-[clamp(1.8rem,2.6vw,2.3rem)] leading-[1.05]">{caso.titulo}</h3>
            <p className="mt-4 text-tinta-2">{caso.texto}</p>
            {caso.extras.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-2">
                {caso.extras.map((x) => (
                  <img key={x.src} src={x.src} alt={x.alt} loading="lazy" className="aspect-square w-full rounded-2xl object-cover object-[50%_40%]" />
                ))}
              </div>
            )}
            <div className="mt-auto pt-8">
              <BotaoAgendar texto="Quero um resultado assim" aoClicar={() => escolher(caso.tratamento)} />
            </div>
          </div>
        </motion.div>

        <p className="mt-6 max-w-2xl text-sm text-tinta-2">
          Casos tratados na Clínica Coral, publicados com autorização dos pacientes. Cada tratamento é planejado de forma
          individual e os resultados variam de pessoa para pessoa.
        </p>
      </div>
    </section>
  )
}

const ETAPAS = [
  { nome: 'Avaliação', texto: 'Conversa sobre o que incomoda e o que você espera, exame clínico e fotos do sorriso.' },
  { nome: 'Planejamento', texto: 'O tratamento explicado etapa por etapa, com prazos, antes de qualquer procedimento.' },
  { nome: 'Tratamento', texto: 'Consultas com hora marcada e acompanhamento até o resultado final.' },
]

function ComoFunciona() {
  return (
    <section aria-labelledby="etapas-titulo" className="bg-areia py-20 md:py-32">
      <div className="wrap">
        <Revelar className="max-w-3xl">
          <Etiqueta>Como funciona</Etiqueta>
          <h2 id="etapas-titulo" className="titulo mt-5">
            Você entende tudo <span className="acento text-coral">antes de começar.</span>
          </h2>
        </Revelar>
        <ol className="mt-12 grid gap-3 md:mt-16 md:grid-cols-3 md:gap-4">
          {ETAPAS.map((e, i) => (
            <Revelar key={e.nome} atraso={i * 0.1} className="flex">
              <li className="bloco flex w-full flex-col bg-creme p-6 sm:p-8">
                <span className="font-acento text-[4.5rem] leading-none text-coral italic">0{i + 1}</span>
                <h3 className="mt-10 text-3xl">{e.nome}</h3>
                <p className="mt-3 text-tinta-2">{e.texto}</p>
              </li>
            </Revelar>
          ))}
        </ol>
      </div>
    </section>
  )
}

function CartaoDentista({ d, i }: { d: Dentista; i: number }) {
  const foto = FOTOS[d.id]
  return (
    <Revelar atraso={i * 0.1} className="flex">
      <article className="bloco flex w-full flex-col overflow-hidden bg-areia">
        <div className={`relative aspect-[5/4] overflow-hidden ${foto ? foto.fundo : 'bg-blush'}`}>
          {foto ? (
            <img src={foto.src} alt={`${d.nome}, dentista da Clínica Coral.`} loading="lazy" className="size-full object-cover" style={{ objectPosition: foto.posicao }} />
          ) : (
            <div className="grid size-full place-items-center">
              <Emblema className="absolute -right-10 -bottom-10 w-72 text-coral/10" />
              <span className="font-acento text-[7rem] leading-none text-coral italic" aria-hidden="true">
                {iniciais(d.nome)}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <h3 className="text-[clamp(1.8rem,2.8vw,2.4rem)] leading-none">{d.nome}</h3>
          <p className="mt-3 text-sm text-tinta-2">
            Cirurgiã-dentista{d.cro && ` · ${d.cro}`}
          </p>
          {d.areas.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {d.areas.map((a) => (
                <li key={a} className="rounded-full bg-creme px-4 py-1.5 text-sm">
                  {a}
                </li>
              ))}
            </ul>
          )}
          {d.sobre && <p className="mt-5 text-tinta-2">{d.sobre}</p>}
        </div>
      </article>
    </Revelar>
  )
}

function EquipeSecao() {
  return (
    <section id="equipe" aria-labelledby="equipe-titulo" className="py-20 md:py-32">
      <div className="wrap grid gap-10 md:grid-cols-12 md:gap-4">
        <Revelar className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <Etiqueta>Equipe</Etiqueta>
            <h2 id="equipe-titulo" className="titulo mt-5">
              Quem cuida <span className="acento text-coral">do seu sorriso.</span>
            </h2>
            <p className="mt-6 max-w-sm text-lg text-tinta-2">
              Duas dentistas que planejam juntas e acompanham cada paciente do primeiro encontro ao resultado.
            </p>
          </div>
        </Revelar>
        <div className="grid gap-3 sm:grid-cols-2 md:col-span-8 md:gap-4">
          {DENTISTAS.map((d, i) => (
            <CartaoDentista key={d.id} d={d} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Contato({ interesse, setInteresse }: { interesse: Interesse; setInteresse: (v: IdTratamento | 'nao-sei') => void }) {
  return (
    <section id="agendar" aria-labelledby="agendar-titulo" className="px-3 pb-3 md:px-6 md:pb-6">
      <div className="bloco relative mx-auto max-w-[90rem] overflow-hidden bg-coral py-16 text-white md:py-24">
        <Emblema className="pointer-events-none absolute -top-24 -left-24 w-[30rem] text-white/[0.07]" />
        <div className="wrap relative grid gap-14 md:grid-cols-12 md:gap-8">
          <Revelar className="md:col-span-5">
            <Etiqueta claro>Agendamento</Etiqueta>
            <h2 id="agendar-titulo" className="titulo mt-5">
              Agende sua <span className="acento">avaliação.</span>
            </h2>
            <p className="mt-6 max-w-sm text-lg text-white/85">
              Conte o que você procura e o melhor período. O pedido segue pelo WhatsApp e a clínica responde por lá.
            </p>
            <dl className="mt-10 grid gap-6 border-t border-white/25 pt-8">
              <div>
                <dt className="etiqueta text-white/70">Atendimento</dt>
                <dd className="mt-1.5 text-lg">{HORARIOS.length ? HORARIOS.map((h) => <p key={h}>{h}</p>) : <p>Com hora marcada</p>}</dd>
              </div>
              {ENDERECO.length > 0 && (
                <div>
                  <dt className="etiqueta text-white/70">Endereço</dt>
                  <dd className="mt-1.5 text-lg">
                    {ENDERECO.map((l) => (
                      <p key={l}>{l}</p>
                    ))}
                  </dd>
                </div>
              )}
              {(TELEFONE || INSTAGRAM) && (
                <div>
                  <dt className="etiqueta text-white/70">Contato</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-x-6 text-lg">
                    {TELEFONE && (
                      <a href={`tel:+55${TELEFONE}`} className="underline underline-offset-4">
                        Ligar
                      </a>
                    )}
                    {INSTAGRAM && (
                      <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener" className="underline underline-offset-4">
                        Instagram
                      </a>
                    )}
                  </dd>
                </div>
              )}
            </dl>
          </Revelar>
          <Revelar className="md:col-span-6 md:col-start-7" atraso={0.1}>
            <Agendar interesse={interesse} setInteresse={setInteresse} />
          </Revelar>
        </div>
      </div>
    </section>
  )
}

function Rodape() {
  return (
    <footer className="bg-noite pb-28 text-white md:pb-0">
      <div className="wrap py-14 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div>
            <Marca claro />
            <p className="mt-5 max-w-xs text-white/60">Odontologia &amp; Estética</p>
          </div>
          <nav aria-label="Mapa do site">
            <ul className="grid grid-cols-2 gap-x-12 gap-y-3 text-white/75">
              {SECOES.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="underline-offset-4 hover:text-white hover:underline">
                    {s.nome}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/15 pt-8 text-sm text-white/60 md:flex-row md:justify-between">
          <p>
            Responsáveis técnicas: {DENTISTAS.map((d) => d.nome + (d.cro ? ` (${d.cro})` : '')).join(' · ')}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <p>© {ANO} Clínica Coral</p>
            <a href="../" className="underline underline-offset-4">
              Conceito de portfólio
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// No celular, uma barra fixa com o agendamento (e o WhatsApp, se houver).
// Aparece depois da abertura e some quando a seção de agendamento está na tela.
function BarraCelular() {
  const { scrollY } = useScroll()
  const [passou, setPassou] = useState(false)
  const [noAgendar, setNoAgendar] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setPassou(y > window.innerHeight * 0.8))

  useEffect(() => {
    const alvo = document.getElementById('agendar')
    if (!alvo) return
    const obs = new IntersectionObserver(([e]) => setNoAgendar(e.isIntersecting), { threshold: 0.05 })
    obs.observe(alvo)
    return () => obs.disconnect()
  }, [])

  const visivel = passou && !noAgendar
  return (
    <div
      className={`fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 flex gap-2 rounded-full bg-tinta/90 p-1.5 backdrop-blur-md transition-transform duration-500 md:hidden ${
        visivel ? 'translate-y-0' : 'translate-y-[calc(100%+2rem)]'
      }`}
      inert={!visivel}
    >
      <BotaoAgendar className="flex-1" />
      {WHATSAPP && (
        <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener" className="inline-flex min-h-13 items-center rounded-full px-5 text-white">
          WhatsApp
        </a>
      )}
    </div>
  )
}

export default function App() {
  const [interesse, setInteresse] = useState<Interesse>('')
  return (
    <MotionConfig reducedMotion="user">
      <a href="#conteudo" className="fixed top-3 left-3 z-50 -translate-y-24 rounded-full bg-tinta px-4 py-2 text-white focus:translate-y-0">
        Ir para o conteúdo
      </a>
      <Topo />
      <main id="conteudo">
        <Abertura />
        <Letreiro />
        <Tratamentos escolher={setInteresse} />
        <Alinhadores escolher={setInteresse} />
        <Casos escolher={setInteresse} />
        <ComoFunciona />
        <EquipeSecao />
        <Contato interesse={interesse} setInteresse={setInteresse} />
      </main>
      <Rodape />
      <BarraCelular />
    </MotionConfig>
  )
}
