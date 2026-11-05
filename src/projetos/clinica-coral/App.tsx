import { MotionConfig, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState, type KeyboardEvent } from 'react'
import { Agendar } from './components/Agendar'
import { AntesDepois } from './components/AntesDepois'
import { Emblema, Marca, Selo } from './components/Logo'
import { Menu } from './components/Menu'
import { curva } from './components/curva'
import { Filete, Foto, Revelar, Seta } from './components/Revelar'
import {
  CRO,
  ENDERECO,
  HORARIOS,
  INSTAGRAM,
  RESPONSAVEL,
  SECOES,
  TELEFONE,
  TRATAMENTOS,
  WHATSAPP,
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

// Botão principal: o mesmo em todo o site, sempre levando ao agendamento.
function BotaoAgendar({ texto = 'Agendar avaliação', aoClicar, className = '' }: { texto?: string; aoClicar?: () => void; className?: string }) {
  return (
    <a
      href="#agendar"
      onClick={aoClicar}
      className={`inline-flex min-h-13 items-center justify-center rounded-full bg-tinta px-8 text-sm tracking-[0.16em] text-creme uppercase transition-colors duration-300 hover:bg-ouro-escuro ${className}`}
    >
      {texto}
    </a>
  )
}

function Topo() {
  const { scrollY } = useScroll()
  const [rolou, setRolou] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setRolou(y > 24))

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-500 ${
        rolou ? 'bg-creme/90 shadow-[0_1px_0_var(--color-linho)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="wrap flex h-18 items-center justify-between gap-6 md:h-20">
        <a href="#inicio" aria-label="Clínica Coral, início">
          <Marca />
        </a>
        <nav aria-label="Seções" className="hidden items-center gap-8 md:flex">
          {SECOES.filter((s) => s.id !== 'agendar').map((s) => (
            <a key={s.id} href={`#${s.id}`} className="text-[0.95rem] text-tinta-2 underline-offset-[6px] transition-colors hover:text-tinta hover:underline">
              {s.nome}
            </a>
          ))}
          <BotaoAgendar className="min-h-11! px-6! text-xs!" />
        </nav>
        <Menu />
      </div>
    </header>
  )
}

function Abertura() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      {/* O ramo de coral da logo, enorme e quase apagado, atrás de tudo. */}
      <Emblema className="pointer-events-none absolute -top-16 -right-48 w-[44rem] text-ouro/[0.07] md:-right-24" />

      <div className="wrap relative grid items-center gap-14 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-6">
          <motion.p
            className="sobrescrito text-ouro-escuro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Odontologia &amp; Estética
          </motion.p>
          <h1 className="titulo mt-6 text-[clamp(2.9rem,7vw,6rem)]">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: curva, delay: 0.1 }}
            >
              O sorriso como
            </motion.span>
            <motion.em
              className="block text-ouro-escuro"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: curva, delay: 0.25 }}
            >
              obra de arte.
            </motion.em>
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: curva, delay: 0.55 }}
          >
            <p className="mt-8 max-w-md text-lg text-tinta-2">
              Lentes e facetas, alinhadores invisíveis, próteses e restaurações estéticas. Cada caso planejado de perto
              pela Dra. Julia S. Moreno, no tempo de cada pessoa.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <BotaoAgendar />
              <a href="#casos" className="group inline-flex min-h-11 items-center gap-3 text-[0.95rem]">
                <span className="underline-offset-[6px] group-hover:underline">Ver casos da clínica</span>
                <Seta className="w-8 text-ouro transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>
        </div>

        <div className="relative md:col-span-5 md:col-start-8">
          <motion.div
            className="relative mx-auto aspect-[4/5] w-full max-w-sm md:max-w-none"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: curva }}
          >
            <div className="coroa size-full overflow-hidden bg-linho">
              <img
                src={facetasRosto}
                alt="Paciente sorrindo depois do tratamento com lentes e facetas na Clínica Coral."
                className="size-full object-cover object-[50%_40%]"
                fetchPriority="high"
              />
            </div>

            {/* Rótulo com filete, como nos posts. */}
            <motion.div
              className="absolute top-[76%] -left-4 flex items-center gap-3 sm:-left-20 md:-left-28"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              <span className="rounded-full bg-creme/90 px-4 py-2 text-sm whitespace-nowrap shadow-sm backdrop-blur">
                Lentes e facetas
              </span>
              <span className="hidden h-px w-16 bg-tinta/40 sm:block" aria-hidden="true" />
            </motion.div>

            <motion.div
              className="absolute -right-2 -bottom-6 flex max-w-[15rem] items-center gap-4 rounded-2xl bg-creme p-4 shadow-[0_12px_40px_-12px_rgb(43_38_32/0.35)] sm:-right-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: curva, delay: 0.9 }}
            >
              <Selo className="size-11" />
              <p className="text-sm leading-snug text-tinta-2">Planejamento exclusivo para o seu sorriso</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const MANIFESTO = [
  {
    rotulo: 'A tela',
    texto: 'Cada dente chega com uma história: uma cárie, uma fratura, uma cor que incomoda.',
  },
  {
    rotulo: 'A artista',
    texto: 'Olhar de perto, fotografar, planejar. Só depois, tocar no dente.',
  },
  {
    rotulo: 'A obra',
    texto: 'Forma, cor e textura devolvidas. O melhor resultado é o que ninguém percebe.',
  },
]

function Manifesto() {
  const fotos = [
    { src: restauracaoAntes, alt: 'Dente com cárie antes da restauração.', fundo: 'bg-linho', posicao: '40% 50%' },
    { src: draJulia, alt: 'Dra. Julia S. Moreno sorrindo, com a câmera fotográfica na mão.', fundo: 'bg-faixa', posicao: '50% 0%' },
    { src: restauracaoDepois, alt: 'O mesmo dente depois da restauração estética em resina.', fundo: 'bg-linho', posicao: '8% 50%' },
  ]
  return (
    <section aria-labelledby="manifesto-titulo" className="bg-areia py-24 md:py-36">
      <div className="wrap">
        <Revelar className="max-w-2xl">
          <p className="sobrescrito text-ouro-escuro">Como trabalhamos</p>
          <h2 id="manifesto-titulo" className="titulo mt-5">
            A tela, a artista <em>e a obra.</em>
          </h2>
        </Revelar>

        <ol className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-8">
          {MANIFESTO.map((m, i) => (
            <li key={m.rotulo} className={i === 1 ? 'md:-mt-12' : i === 2 ? 'md:mt-12' : ''}>
              <Foto
                src={fotos[i].src}
                alt={fotos[i].alt}
                className="aspect-[4/5]"
                moldura={`coroa ${fotos[i].fundo}`}
                posicao={fotos[i].posicao}
                atraso={i * 0.12}
              />
              <Revelar atraso={0.2 + i * 0.12}>
                <p className="mt-7 flex items-center gap-4 font-display text-3xl">
                  {m.rotulo}
                  <Seta className="w-10 text-ouro" />
                </p>
                <p className="mt-3 max-w-xs text-tinta-2">{m.texto}</p>
              </Revelar>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Tratamentos({ escolher }: { escolher: (id: IdTratamento) => void }) {
  return (
    <section id="tratamentos" aria-labelledby="tratamentos-titulo" className="py-24 md:py-36">
      <div className="wrap grid gap-14 md:grid-cols-12 md:gap-8">
        <Revelar className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <p className="sobrescrito text-ouro-escuro">Tratamentos</p>
            <h2 id="tratamentos-titulo" className="titulo mt-5 text-[clamp(2.4rem,4.6vw,4rem)]">
              Do detalhe <em>ao sorriso inteiro.</em>
            </h2>
            <p className="mt-6 max-w-sm text-tinta-2">
              Tudo começa com uma avaliação: conversa, fotos e o planejamento do que faz sentido para você.
            </p>
          </div>
        </Revelar>

        <ol className="border-t border-linho md:col-span-7 md:col-start-6">
          {TRATAMENTOS.map((t, i) => (
            <li key={t.id} className="border-b border-linho">
              <Revelar className="grid gap-x-8 gap-y-4 py-10 sm:grid-cols-[3rem_1fr] md:py-12">
                <span className="font-display text-lg text-ouro tabular-nums">0{i + 1}</span>
                <div>
                  <h3 className="text-[clamp(1.9rem,3.4vw,2.75rem)] leading-tight">{t.nome}</h3>
                  <p className="mt-4 max-w-lg text-tinta-2">{t.texto}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {t.pontos.map((p) => (
                      <li key={p} className="rounded-full border border-linho px-4 py-1.5 text-sm text-tinta-2">
                        {p}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#agendar"
                    onClick={() => escolher(t.id)}
                    className="group mt-8 inline-flex min-h-11 items-center gap-3 text-[0.95rem]"
                  >
                    <span className="underline-offset-[6px] group-hover:underline">Agendar avaliação</span>
                    <Seta className="w-8 text-ouro transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </Revelar>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

const MOTIVOS_ESQUERDA = ['Discretos e removíveis', 'Mais conforto no dia a dia', 'Menos dores']
const MOTIVOS_DIREITA = ['Tratamento mais prático', 'Planejamento exclusivo para o seu sorriso']

// O post dos alinhadores refeito como seção: a mão com a placa no meio e os
// motivos ligados a ela por filetes.
function Alinhadores({ escolher }: { escolher: (id: IdTratamento) => void }) {
  const motivo = (texto: string, lado: 'esq' | 'dir', i: number) => (
    <li key={texto} className={`flex items-center gap-4 ${lado === 'esq' ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      <Filete className="order-first w-8 shrink-0 text-ouro md:order-none md:hidden" atraso={0.1 * i} />
      <span className={`text-lg leading-snug md:max-w-[14rem] ${lado === 'esq' ? 'md:text-right' : ''}`}>{texto}</span>
      <Filete className={`hidden flex-1 text-white/45 md:block ${lado === 'dir' ? 'origin-right!' : ''}`} atraso={0.15 * i} />
    </li>
  )

  return (
    <section aria-labelledby="alinhadores-titulo" className="relative overflow-hidden bg-noite py-24 text-white md:py-36">
      <div className="wrap">
        <Revelar className="text-center">
          <p className="sobrescrito text-[#d8c3a2]">Motivos para escolher</p>
          <h2 id="alinhadores-titulo" className="mt-5 text-[clamp(3rem,8.4vw,7.5rem)] leading-[0.95] italic">
            alinhadores invisíveis.
          </h2>
        </Revelar>

        <div className="mt-16 grid items-center gap-6 md:mt-20 md:grid-cols-[1fr_minmax(0,22rem)_1fr] md:gap-0">
          <ul className="order-2 grid gap-6 md:order-none md:gap-24">
            {MOTIVOS_ESQUERDA.map((m, i) => motivo(m, 'esq', i))}
          </ul>
          <Foto
            src={alinhador}
            alt="Mão segurando um alinhador transparente, numa sala com luz de vela."
            className="order-1 mx-auto mb-6 aspect-[545/1075] w-full max-w-[18rem] md:order-none md:mb-0 md:max-w-none"
            moldura="coroa bg-[#3a3128]"
          />
          <ul className="order-3 grid gap-6 md:order-none md:gap-32">
            {MOTIVOS_DIREITA.map((m, i) => motivo(m, 'dir', i))}
          </ul>
        </div>

        <Revelar className="mt-16 flex justify-center md:mt-20">
          <a
            href="#agendar"
            onClick={() => escolher('alinhadores')}
            className="inline-flex min-h-13 items-center rounded-full bg-[#d8c3a2] px-8 text-sm tracking-[0.16em] text-noite uppercase transition-colors duration-300 hover:bg-white"
          >
            Quero avaliar alinhadores
          </a>
        </Revelar>
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
      'Os dentes amarelados e com espaço entre os centrais ganharam cor, forma e proporção novas, desenhadas para o rosto do paciente.',
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
    texto: 'Os espaços entre os dentes inferiores foram preenchidos com uma prótese parcial removível, que se apoia nos dentes naturais.',
    antes: parcialAntes,
    depois: parcialDepois,
    descricao: 'reabilitação com prótese parcial removível',
    extras: [],
    tratamento: 'proteses' as IdTratamento,
  },
]

function Casos({ escolher }: { escolher: (id: IdTratamento) => void }) {
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
    <section id="casos" aria-labelledby="casos-titulo" className="bg-areia py-24 md:py-36">
      <div className="wrap">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <Revelar>
            <p className="sobrescrito text-ouro-escuro">Casos da clínica</p>
            <h2 id="casos-titulo" className="titulo mt-5">
              Arraste <em>e compare.</em>
            </h2>
          </Revelar>
          <div role="tablist" aria-label="Casos" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0" onKeyDown={teclas}>
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
                className={`min-h-11 shrink-0 cursor-pointer rounded-full border px-5 text-[0.95rem] whitespace-nowrap transition-colors duration-300 ${
                  i === ativo ? 'border-tinta bg-tinta text-creme' : 'border-linho text-tinta-2 hover:border-tinta hover:text-tinta'
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
          className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:gap-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: curva }}
        >
          <AntesDepois
            antes={caso.antes}
            depois={caso.depois}
            descricao={caso.descricao}
            className="aspect-[16/10] sm:aspect-[1080/440] md:col-span-8"
          />
          <div className="flex flex-col md:col-span-4">
            <h3 className="text-[clamp(1.9rem,3vw,2.5rem)] leading-tight">{caso.titulo}</h3>
            <p className="mt-4 text-tinta-2">{caso.texto}</p>
            {caso.extras.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-3">
                {caso.extras.map((x) => (
                  <img key={x.src} src={x.src} alt={x.alt} loading="lazy" className="aspect-[4/5] w-full rounded-xl object-cover object-[50%_45%]" />
                ))}
              </div>
            )}
            <a
              href="#agendar"
              onClick={() => escolher(caso.tratamento)}
              className="group mt-8 inline-flex min-h-11 items-center gap-3 self-start text-[0.95rem]"
            >
              <span className="underline-offset-[6px] group-hover:underline">Quero um resultado assim</span>
              <Seta className="w-8 text-ouro transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>

        <p className="mt-12 max-w-2xl text-sm text-tinta-2">
          Casos tratados na Clínica Coral, publicados com autorização dos pacientes. Cada tratamento é planejado de forma
          individual e os resultados variam de pessoa para pessoa.
        </p>
      </div>
    </section>
  )
}

function Dentista() {
  return (
    <section id="dentista" aria-labelledby="dentista-titulo" className="py-24 md:py-36">
      <div className="wrap grid items-center gap-14 md:grid-cols-12 md:gap-8">
        <Foto
          src={draJulia}
          alt="Dra. Julia S. Moreno, de jaleco, sorrindo com a câmera fotográfica na mão."
          className="aspect-square md:col-span-5"
          moldura="coroa bg-faixa"
          posicao="50% 0%"
        />
        <div className="md:col-span-6 md:col-start-7">
          <Revelar>
            <p className="sobrescrito text-ouro-escuro">A artista</p>
            <h2 id="dentista-titulo" className="titulo mt-5 text-[clamp(2.4rem,5vw,4.5rem)]">
              Dra. Julia <em>S. Moreno</em>
            </h2>
            {CRO && <p className="mt-4 text-sm tracking-[0.12em] text-tinta-2 uppercase">{CRO}</p>}
          </Revelar>
          <Revelar atraso={0.1}>
            <div className="mt-8 max-w-lg space-y-5 text-lg text-tinta-2">
              <p>
                A câmera no pescoço não é enfeite. Antes de qualquer tratamento, cada sorriso é fotografado, estudado e
                planejado, porque estética é feita de detalhes: cor, textura, proporção.
              </p>
              <p>
                Na Clínica Coral o atendimento é com hora marcada e sem pressa. Você entende o que será feito, por que, e
                em quantas etapas.
              </p>
            </div>
            <blockquote className="mt-10 border-l border-ouro pl-6 font-display text-2xl italic">
              Cada sorriso é uma tela diferente.
            </blockquote>
          </Revelar>
        </div>
      </div>
    </section>
  )
}

function Contato({ interesse, setInteresse }: { interesse: Interesse; setInteresse: (v: IdTratamento | 'nao-sei') => void }) {
  return (
    <section id="agendar" aria-labelledby="agendar-titulo" className="bg-noite py-24 text-white md:py-36">
      <div className="wrap grid gap-16 md:grid-cols-12 md:gap-8">
        <Revelar className="md:col-span-5">
          <p className="sobrescrito text-[#d8c3a2]">Agendamento</p>
          <h2 id="agendar-titulo" className="titulo mt-5">
            Agende sua <em className="text-[#d8c3a2]">avaliação.</em>
          </h2>
          <p className="mt-6 max-w-sm text-white/75">
            Conte o que você procura e o melhor período. O pedido segue pelo WhatsApp e a clínica responde por lá.
          </p>

          <dl className="mt-12 grid gap-8 border-t border-white/15 pt-10 text-white/85">
            <div>
              <dt className="sobrescrito text-white/50">Atendimento</dt>
              <dd className="mt-2">
                {HORARIOS.length ? HORARIOS.map((h) => <p key={h}>{h}</p>) : <p>Com hora marcada</p>}
              </dd>
            </div>
            {ENDERECO.length > 0 && (
              <div>
                <dt className="sobrescrito text-white/50">Endereço</dt>
                <dd className="mt-2">
                  {ENDERECO.map((l) => (
                    <p key={l}>{l}</p>
                  ))}
                </dd>
              </div>
            )}
            {(TELEFONE || INSTAGRAM) && (
              <div>
                <dt className="sobrescrito text-white/50">Contato</dt>
                <dd className="mt-2 flex flex-wrap gap-x-6">
                  {TELEFONE && (
                    <a href={`tel:+55${TELEFONE}`} className="underline-offset-4 hover:underline">
                      Ligar
                    </a>
                  )}
                  {INSTAGRAM && (
                    <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener" className="underline-offset-4 hover:underline">
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
    </section>
  )
}

function Rodape() {
  return (
    <footer className="bg-creme pb-28 md:pb-0">
      <div className="wrap py-16 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <Marca />
          <nav aria-label="Mapa do site">
            <ul className="grid grid-cols-2 gap-x-12 gap-y-3 text-tinta-2">
              {SECOES.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="underline-offset-4 hover:text-tinta hover:underline">
                    {s.nome}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-linho pt-8 text-sm text-tinta-2 md:flex-row md:justify-between">
          <p>
            Responsável técnica: {RESPONSAVEL}
            {CRO && ` · ${CRO}`}
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
  useMotionValueEvent(scrollY, 'change', (y) => setPassou(y > window.innerHeight * 0.7))

  useEffect(() => {
    const alvo = document.getElementById('agendar')
    if (!alvo) return
    const obs = new IntersectionObserver(([e]) => setNoAgendar(e.isIntersecting), { threshold: 0.1 })
    obs.observe(alvo)
    return () => obs.disconnect()
  }, [])

  const visivel = passou && !noAgendar
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-linho bg-creme/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-500 md:hidden ${
        visivel ? 'translate-y-0' : 'translate-y-full'
      }`}
      inert={!visivel}
    >
      <div className="flex gap-3">
        <BotaoAgendar className="flex-1" />
        {WHATSAPP && (
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-13 items-center rounded-full border border-tinta px-5 text-sm"
          >
            WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [interesse, setInteresse] = useState<Interesse>('')
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-50 -translate-y-24 rounded-full bg-tinta px-4 py-2 text-creme focus:translate-y-0"
      >
        Ir para o conteúdo
      </a>
      <Topo />
      <main id="conteudo">
        <Abertura />
        <Manifesto />
        <Tratamentos escolher={setInteresse} />
        <Alinhadores escolher={setInteresse} />
        <Casos escolher={setInteresse} />
        <Dentista />
        <Contato interesse={interesse} setInteresse={setInteresse} />
      </main>
      <Rodape />
      <BarraCelular />
    </MotionConfig>
  )
}
