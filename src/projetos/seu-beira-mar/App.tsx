import { MotionConfig, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Cardapio } from './components/Cardapio'
import { Onda } from './components/Onda'
import { Revelar } from './components/Revelar'
import { ENDERECO, HORARIOS, PLAYLIST_ID, WHATSAPP } from './dados'

// Lido uma vez ao abrir a página: basta para o selo de aberto e o dia de hoje.
const AGORA = new Date()
const ANO = AGORA.getFullYear()
const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

const entrada = { duration: 0.9, ease: [0.22, 1, 0.36, 1] } as const

function linkWhatsApp(mensagem: string) {
  return WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}` : null
}

function abertoAgora(agora: Date) {
  const horario = HORARIOS[agora.getDay()]
  if (!horario) return false
  const minutos = agora.getHours() * 60 + agora.getMinutes()
  const [abre, fecha] = horario.map((h) => {
    const [hh, mm] = h.split(':').map(Number)
    return hh * 60 + mm
  })
  return minutos >= abre && minutos < fecha
}

function Rotulo({ children, claro = false }: { children: ReactNode; claro?: boolean }) {
  return <p className={`rotulo ${claro ? 'text-mar-claro' : 'text-mar-2'}`}>{children}</p>
}

function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`font-display leading-none ${className}`}>
      Seu <em className="text-mar-claro">Beira Mar</em>
    </span>
  )
}

function Topo() {
  const pedido = linkWhatsApp('Olá! Quero fazer um pedido.')
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-mar/95 text-espuma backdrop-blur-sm">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <a href="#inicio" aria-label="Seu Beira Mar, início" className="text-xl md:text-2xl">
          <Logo />
        </a>
        <nav aria-label="Principal" className="flex items-center gap-1 text-sm font-semibold sm:gap-4">
          <a href="#cardapio" className="hidden px-2 py-3 hover:text-mar-claro sm:inline">
            Cardápio
          </a>
          <a href="#visite" className="hidden px-2 py-3 hover:text-mar-claro md:inline">
            Como chegar
          </a>
          {pedido ? (
            <a
              href={pedido}
              target="_blank"
              rel="noopener"
              className="flex min-h-11 items-center rounded-full bg-coral px-5 transition-colors hover:bg-coral-2"
            >
              Pedir
            </a>
          ) : (
            <a href="#cardapio" className="flex min-h-11 items-center rounded-full bg-coral px-5 transition-colors hover:bg-coral-2 sm:hidden">
              Cardápio
            </a>
          )}
        </nav>
      </div>
    </header>
  )
}

function Inicio() {
  const aberto = abertoAgora(AGORA)
  return (
    <section id="inicio" className="relative overflow-hidden bg-mar text-espuma">
      {/* Reflexo do sol na água, só cor. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,rgb(243_178_107/0.28),transparent_45%),radial-gradient(ellipse_at_10%_90%,rgb(159_208_221/0.18),transparent_50%)]"
      />
      <div className="wrap relative flex min-h-[88svh] flex-col justify-center pt-28 pb-16 md:min-h-[82svh]">
        <motion.p
          className="mb-6 inline-flex items-center gap-2 self-start rounded-full border border-espuma/25 px-4 py-1.5 text-sm font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...entrada, delay: 0.3 }}
        >
          <span aria-hidden="true" className={`size-2 rounded-full ${aberto ? 'bg-emerald-300' : 'bg-espuma/50'}`} />
          {aberto ? 'Aberto agora' : 'Fechado agora'}
        </motion.p>

        <motion.h1
          className="font-display text-[clamp(3.5rem,13vw,9.5rem)] leading-[0.92] tracking-[-0.02em]"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={entrada}
        >
          Seu <br />
          <em className="text-mar-claro">Beira Mar</em>
        </motion.h1>

        <motion.p
          className="mt-8 max-w-xl text-lg text-espuma/85 md:text-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...entrada, delay: 0.15 }}
        >
          Frutos do mar com o pé na areia. Toque em um prato do cardápio para ver o vídeo dele antes de
          pedir.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...entrada, delay: 0.25 }}
        >
          <a
            href="#cardapio"
            className="flex min-h-12 items-center rounded-full bg-coral px-8 font-semibold transition-colors hover:bg-coral-2 active:translate-y-px"
          >
            Ver o cardápio
          </a>
          <a
            href="#visite"
            className="flex min-h-12 items-center rounded-full border border-espuma/40 px-7 font-semibold transition-colors hover:bg-espuma hover:text-mar"
          >
            Horários e endereço
          </a>
        </motion.div>
      </div>
      <Onda cor="var(--color-espuma)" animada />
    </section>
  )
}

function Menu() {
  return (
    <section id="cardapio" aria-labelledby="cardapio-titulo" className="bg-espuma">
      <div className="wrap pt-12 pb-20 md:pt-16">
        <Revelar className="mb-10 max-w-2xl">
          <Rotulo>Cardápio</Rotulo>
          <h2 id="cardapio-titulo" className="mt-4 font-display text-5xl leading-tight md:text-6xl">
            O que o mar trouxe <em>hoje</em>
          </h2>
          <p className="mt-5 text-tinta-2">
            Toque no prato para ver o vídeo. Os marcados com "serve 2" vêm na medida para dividir; pergunte ao
            garçom pelo peixe do dia.
          </p>
          <a
            href={`https://www.youtube.com/playlist?list=${PLAYLIST_ID}`}
            target="_blank"
            rel="noopener"
            className="mt-3 inline-block font-semibold text-mar-2 underline underline-offset-4 hover:no-underline"
          >
            Todos os vídeos no YouTube
          </a>
        </Revelar>
        <Cardapio />
      </div>
    </section>
  )
}

function Visite() {
  const reserva = linkWhatsApp('Olá! Quero reservar uma mesa no Seu Beira Mar.')
  const hoje = AGORA.getDay()
  return (
    <section id="visite" aria-labelledby="visite-titulo" className="bg-mar text-espuma">
      <Onda cor="var(--color-mar)" fundo="var(--color-espuma)" />
      <div className="wrap grid gap-14 pt-12 pb-20 md:grid-cols-2 md:pt-16 md:pb-28">
        <Revelar>
          <Rotulo claro>Visite</Rotulo>
          <h2 id="visite-titulo" className="mt-4 font-display text-5xl leading-tight md:text-6xl">
            A mesa é na <em className="text-mar-claro">areia</em>.
          </h2>
          <p className="mt-6 flex items-start gap-3 text-lg text-espuma/85">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-1 size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            {ENDERECO}
          </p>
          {reserva && (
            <a
              href={reserva}
              target="_blank"
              rel="noopener"
              className="mt-10 inline-flex min-h-12 items-center rounded-full bg-coral px-8 font-semibold transition-colors hover:bg-coral-2"
            >
              Reservar pelo WhatsApp
            </a>
          )}
        </Revelar>

        <Revelar atraso={0.1}>
          <h3 className="rotulo text-mar-claro">Horários</h3>
          <dl className="mt-4 divide-y divide-espuma/15 border-y border-espuma/15">
            {DIAS.map((dia, i) => {
              const h = HORARIOS[i]
              return (
                <div key={dia} className={`flex justify-between gap-4 py-3 ${i === hoje ? 'font-semibold text-espuma' : 'text-espuma/80'}`}>
                  <dt>
                    {dia}
                    {i === hoje && <span className="ml-2 text-sm text-mar-claro">hoje</span>}
                  </dt>
                  <dd className="tabular-nums">{h ? `${h[0]} – ${h[1]}` : 'Fechado'}</dd>
                </div>
              )
            })}
          </dl>
        </Revelar>
      </div>

      <footer className="border-t border-espuma/15">
        <div className="wrap flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-espuma/70">
          <Logo className="text-lg text-espuma" />
          <p>© {ANO} Seu Beira Mar</p>
        </div>
      </footer>
    </section>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#cardapio"
        className="fixed top-2 left-2 z-50 -translate-y-20 rounded-full bg-espuma px-4 py-2 font-semibold text-mar focus:translate-y-0"
      >
        Pular para o cardápio
      </a>
      <Topo />
      <main>
        <Inicio />
        <Menu />
        <Visite />
      </main>
    </MotionConfig>
  )
}
