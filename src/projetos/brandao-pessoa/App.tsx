import { MotionConfig, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'
import { Contato } from './components/Contato'
import { IconeArea, IconeWhatsApp, Seta } from './components/Icones'
import { Marca, Monograma } from './components/Logo'
import { Menu } from './components/Menu'
import { Cabecalho, Revelar } from './components/Revelar'
import {
  AREAS,
  CIDADE,
  CNPJ,
  EMAIL,
  ENDERECO,
  INSTAGRAM,
  SECOES,
  TELEFONE,
  WHATSAPP,
  linkWhatsApp,
  type Advogado,
} from './dados'
import albino from './img/albino-brandao.webp'
import almir from './img/almir-lopes.webp'
import arthur from './img/arthur-campos.webp'
import philipe from './img/philipe-pessoa.webp'

const ANO = new Date().getFullYear()
const curva = [0.22, 1, 0.36, 1] as const

// Nome, cargo e OAB de cada advogado. OAB "a confirmar" até virem os números;
// as biografias são provisórias, para trocar pelo texto de cada um.
const SOCIOS: Advogado[] = [
  {
    nome: 'Albino Brandão',
    cargo: 'Sócio fundador',
    oab: 'OAB a confirmar',
    foto: albino,
    bio: 'Acompanha pessoalmente os casos do escritório, do primeiro atendimento à decisão final, com orientação clara em cada etapa.',
  },
  {
    nome: 'Philipe Pessoa',
    cargo: 'Sócio fundador',
    oab: 'OAB a confirmar',
    foto: philipe,
    bio: 'Está à frente do atendimento aos clientes, com análise cuidadosa de cada situação e acompanhamento próximo até a solução.',
  },
]

const EQUIPE: Advogado[] = [
  { nome: 'Arthur Campos', cargo: 'Advogado', oab: 'OAB a confirmar', foto: arthur, bio: '' },
  { nome: 'Almir Lopes', cargo: 'Advogado', oab: 'OAB a confirmar', foto: almir, bio: '' },
]

const PASSOS = [
  {
    titulo: 'Primeiro contato',
    texto: 'Você fala com o escritório pelo WhatsApp, por telefone ou pelo formulário e conta, em poucas palavras, o que está acontecendo.',
  },
  {
    titulo: 'Análise do caso',
    texto: 'Um advogado estuda a situação e os documentos, e explica com franqueza quais caminhos existem e quais são os riscos de cada um.',
  },
  {
    titulo: 'Estratégia',
    texto: 'Definimos juntos o melhor caminho, judicial ou por acordo, com os próximos passos e o que será preciso de você.',
  },
  {
    titulo: 'Acompanhamento',
    texto: 'Você recebe notícias de cada andamento importante e tem um canal direto com quem cuida do seu caso.',
  },
]

const DUVIDAS = [
  {
    p: 'Como faço o primeiro contato com o escritório?',
    r: 'Pelo WhatsApp, por telefone ou pelo formulário desta página. Conte de forma resumida o que aconteceu, e retornamos para entender melhor e agendar o atendimento.',
  },
  {
    p: 'O atendimento pode ser online?',
    r: 'Sim. Além do atendimento presencial no escritório, atendemos por videochamada e acompanhamos processos eletrônicos de clientes de outras cidades.',
  },
  {
    p: 'Quais documentos devo separar para a primeira conversa?',
    r: 'Documento de identificação e tudo o que tiver relação com o caso: contratos, mensagens, comprovantes, notificações, decisões ou números de processo. Se não tiver tudo, não tem problema; orientamos o que buscar.',
  },
  {
    p: 'Como sei se o escritório pode me ajudar?',
    r: 'Na primeira conversa avaliamos se a sua situação está dentro das nossas áreas de atuação. Se não estiver, dizemos com clareza e, quando possível, indicamos o caminho mais adequado.',
  },
  {
    p: 'Quando devo procurar um advogado com urgência?',
    r: 'Em prisões, intimações com prazo, ordens de despejo, bloqueios de conta, negativas de benefício ou qualquer situação com prazo correndo. Nesses casos, fale com o escritório o quanto antes.',
  },
]

function Topo() {
  const { scrollY } = useScroll()
  const [rolou, setRolou] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setRolou(y > 24))

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b text-marfim transition-[background-color,border-color] duration-500 ${
        rolou ? 'border-marfim/10 bg-noite/92 backdrop-blur-md' : 'border-transparent bg-transparent'
      }`}
    >
      <div className="wrap flex h-20 items-center justify-between gap-6">
        <a href="#inicio" aria-label="Brandão & Pessoa Advocacia, início">
          <Marca />
        </a>
        <div className="flex items-center gap-6">
          <a href={linkWhatsApp()} className="botao hidden min-h-11 border border-marfim/30 px-5 text-[0.7rem] hover:border-dourado hover:text-dourado md:inline-flex">
            Falar com um advogado
          </a>
          <Menu />
        </div>
      </div>
    </header>
  )
}

// Fundo da abertura: linhas finas como uma fachada vista de baixo e o
// monograma grande, quase apagado, saindo da tela.
function FundoAbertura() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_10%,#1d2c4b_0%,#0b1324_60%)]" />
      <svg className="absolute inset-0 size-full opacity-[0.16]" preserveAspectRatio="none" viewBox="0 0 100 100">
        {Array.from({ length: 14 }, (_, i) => (
          <line key={`v${i}`} x1={50 + (i - 7) * 2.4} y1="0" x2={(i - 7) * 16 + 50} y2="100" stroke="#d5bd8c" strokeWidth="0.06" />
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * i * 1.1} x2="100" y2={i * i * 1.1} stroke="#d5bd8c" strokeWidth="0.05" />
        ))}
      </svg>
      <motion.div
        className="absolute -right-[18vmin] -bottom-[14vmin] text-dourado/[0.07]"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: curva }}
      >
        <Monograma className="size-[95vmin]" />
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-noite" />
    </div>
  )
}

function Abertura() {
  const linha = (atraso: number) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, ease: curva, delay: atraso },
  })

  return (
    <section id="inicio" className="relative isolate overflow-hidden text-marfim">
      <FundoAbertura />
      <div className="wrap flex min-h-dvh flex-col items-center justify-center pt-28 pb-20 text-center">
        <motion.p className="rotulo text-dourado before:hidden" {...linha(0.1)}>
          <span aria-hidden="true" className="hidden h-px w-8 bg-current sm:block" />
          {CIDADE ? `Advocacia em ${CIDADE}` : 'Escritório de advocacia'}
          <span aria-hidden="true" className="hidden h-px w-8 bg-current sm:block" />
        </motion.p>

        <h1 className="mt-8 text-[clamp(2.5rem,8.4vw,6.4rem)] leading-[0.98] font-extrabold tracking-[-0.025em] uppercase">
          <motion.span className="block" {...linha(0.2)}>
            Defesa técnica,
          </motion.span>
          <motion.span className="block text-[0.62em] font-semibold tracking-[-0.01em] text-marfim/80" {...linha(0.32)}>
            atendimento
          </motion.span>
          <motion.span className="block text-dourado" {...linha(0.44)}>
            próximo.
          </motion.span>
        </h1>
        <motion.span
          aria-hidden="true"
          className="mt-7 block h-0.5 w-[min(28rem,70vw)] bg-linear-to-r from-transparent via-dourado to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, ease: curva, delay: 0.6 }}
        />

        <motion.p className="mt-8 max-w-2xl text-[clamp(1.05rem,2.2vw,1.35rem)] leading-relaxed text-marfim/85" {...linha(0.7)}>
          Atuação em Direito Cível, Consumidor, Criminal, Família, Previdenciário, Trabalhista e Trânsito, com quem
          conduz o seu caso sempre ao alcance.
        </motion.p>

        <motion.p className="rotulo mt-10 text-[0.68rem] text-dourado/90 before:hidden" {...linha(0.8)}>
          Atendimento presencial e online
        </motion.p>

        <motion.div className="mt-10 grid w-full max-w-md gap-4 sm:max-w-none sm:grid-flow-col sm:justify-center" {...linha(0.9)}>
          <a href={linkWhatsApp()} className="botao bg-marfim text-noite hover:bg-dourado">
            Falar com o escritório
          </a>
          <a href="#areas" className="botao rounded-xl border border-marfim/40 hover:border-dourado hover:text-dourado">
            Conhecer as áreas <Seta />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function Escritorio() {
  const credenciais = [
    { t: 'Sete áreas de atuação', d: 'Do cível ao criminal, das relações de trabalho à previdência.' },
    { t: 'Atendimento presencial', d: CIDADE ? `No escritório, em ${CIDADE}.` : 'No escritório, com hora marcada.' },
    { t: 'Atendimento online', d: 'Orientação por videochamada para clientes de qualquer cidade.' },
  ]

  return (
    <section id="escritorio" className="relative overflow-hidden bg-noite pt-16 pb-28 text-marfim md:pb-36">
      <div className="wrap grid gap-16 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-20">
        <div>
          <Revelar>
            <p className="rotulo text-dourado">O escritório</p>
            <h2 className="mt-8 text-[clamp(1.8rem,4vw,2.9rem)] leading-[1.18] font-medium tracking-[-0.01em]">
              Advocacia de confiança para proteger{' '}
              <span className="text-dourado">direitos, família e patrimônio nos momentos que mais importam.</span>
            </h2>
          </Revelar>
          <Revelar atraso={0.1} className="mt-10 grid gap-6 text-lg leading-relaxed text-marfim/80">
            <p>
              O Brandão &amp; Pessoa nasceu da parceria entre advogados que acreditam numa advocacia próxima: quem cuida do
              seu caso conhece a sua história, responde às suas dúvidas e explica cada passo sem juridiquês.
            </p>
            <p>
              Com atuação em sete áreas do Direito, o escritório atende pessoas e empresas que precisam de orientação
              segura, seja para resolver um conflito, seja para evitar que ele aconteça.
            </p>
          </Revelar>
          <Revelar atraso={0.2} className="mt-12">
            <a href={linkWhatsApp()} className="botao rounded-xl bg-dourado text-noite hover:bg-marfim">
              Falar com um advogado <Seta />
            </a>
          </Revelar>
        </div>

        <Revelar atraso={0.15} className="rounded-3xl border border-marfim/12 bg-noite-2/80 p-8 md:p-10">
          <p className="text-xs font-bold tracking-[0.3em] text-dourado uppercase">Credenciais</p>
          <ol className="mt-8 divide-y divide-marfim/10">
            {credenciais.map((c, i) => (
              <li key={c.t} className="grid grid-cols-[2.5rem_1fr] py-6 first:pt-0 last:pb-0">
                <span className="text-sm font-bold text-dourado tabular-nums">0{i + 1}</span>
                <div>
                  <h3 className="text-[0.95rem] font-bold tracking-[0.12em] uppercase">{c.t}</h3>
                  <p className="mt-2 text-marfim/75">{c.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Revelar>
      </div>
    </section>
  )
}

function CartaoSocio({ a, atraso }: { a: Advogado; atraso: number }) {
  return (
    <Revelar as="article" atraso={atraso} className="group overflow-hidden rounded-[2rem] bg-noite p-3 text-marfim shadow-[0_30px_60px_-30px_rgba(11,19,36,0.55)]">
      <div className="aspect-[4/5] overflow-hidden rounded-[1.6rem]">
        <img
          src={a.foto}
          alt={`Foto de ${a.nome}`}
          loading="lazy"
          decoding="async"
          className="size-full object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="px-5 pt-8 pb-7 md:px-7">
        <p className="text-sm tracking-[0.32em] text-marfim/75 uppercase">{a.cargo}</p>
        <h3 className="mt-3 text-[clamp(1.6rem,3vw,2.1rem)] leading-tight font-extrabold uppercase">{a.nome}</h3>
        <p className="mt-2 text-sm tracking-[0.18em] text-dourado uppercase">{a.oab}</p>
        <p className="mt-6 leading-relaxed text-marfim/80">{a.bio}</p>
      </div>
    </Revelar>
  )
}

function Socios() {
  return (
    <section id="socios" className="bg-marfim py-28 md:py-36">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <Cabecalho rotulo="Sócios fundadores" titulo="Atendimento com presença e" destaque="responsabilidade" />
          <Revelar atraso={0.1} className="text-lg leading-relaxed text-tinta-2 lg:pb-3">
            A condução dos casos é acompanhada diretamente pelos sócios, com uma equipe que une experiência em demandas
            cíveis, criminais, familiares, trabalhistas, previdenciárias, de consumo e de trânsito.
          </Revelar>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 md:gap-10">
          {SOCIOS.map((a, i) => (
            <CartaoSocio key={a.nome} a={a} atraso={i * 0.1} />
          ))}
        </div>

        <Revelar className="mt-20">
          <p className="rotulo text-bronze">Equipe</p>
        </Revelar>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {EQUIPE.map((a, i) => (
            <Revelar as="li" key={a.nome} atraso={i * 0.08} className="flex items-center gap-6 rounded-3xl border border-marfim-2 bg-white/60 p-5 md:p-6">
              <img
                src={a.foto}
                alt={`Foto de ${a.nome}`}
                loading="lazy"
                decoding="async"
                className="size-24 shrink-0 rounded-full object-cover ring-2 ring-bronze/30 ring-offset-4 ring-offset-marfim md:size-28"
              />
              <div>
                <h3 className="text-xl font-extrabold text-tinta uppercase">{a.nome}</h3>
                <p className="mt-1 text-sm tracking-[0.2em] text-tinta-2 uppercase">{a.cargo}</p>
                <p className="mt-1 text-xs tracking-[0.18em] text-bronze uppercase">{a.oab}</p>
              </div>
            </Revelar>
          ))}
        </ul>

        <Revelar className="mt-16 text-center">
          <a href={linkWhatsApp()} className="botao rounded-xl bg-bronze text-marfim hover:bg-noite">
            Falar com o escritório <Seta />
          </a>
        </Revelar>
      </div>
    </section>
  )
}

function Areas() {
  return (
    <section id="areas" className="bg-marfim-2 py-28 md:py-36">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-10">
          <Cabecalho rotulo="Especialidades" titulo="Áreas de" destaque="atuação" />
          <Revelar>
            <a href={linkWhatsApp()} className="botao bg-noite text-marfim outline outline-1 -outline-offset-[7px] outline-marfim/30 hover:bg-bronze">
              Falar com um advogado
            </a>
          </Revelar>
        </div>

        <ul className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((a, i) => (
            <Revelar
              as="li"
              key={a.id}
              atraso={(i % 3) * 0.08}
              className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-white bg-linear-to-br from-white to-marfim p-8 shadow-[0_18px_40px_-28px_rgba(22,28,40,0.35)] transition-transform duration-500 hover:-translate-y-1 md:p-9"
            >
              <span className="text-sm font-bold tracking-[0.2em] text-bronze tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <IconeArea id={a.id} className="mt-7 size-12 text-bronze" />
              <h3 className="mt-7 text-xl font-extrabold tracking-[0.06em] text-tinta uppercase">{a.nome}</h3>
              <p className="mt-4 flex-1 leading-relaxed text-tinta-2">{a.texto}</p>
              <a
                href={linkWhatsApp(`Olá! Gostaria de falar sobre um caso de ${a.nome}.`)}
                className="mt-8 inline-flex items-center gap-3 self-start py-2 text-[0.78rem] font-bold tracking-[0.22em] text-bronze uppercase"
              >
                Falar sobre o meu caso <Seta className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
              <span aria-hidden="true" className="absolute inset-x-8 bottom-0 h-0.5 origin-left scale-x-0 bg-bronze transition-transform duration-500 group-hover:scale-x-100" />
            </Revelar>
          ))}
          <Revelar as="li" atraso={0.16} className="flex flex-col justify-between rounded-[1.75rem] bg-noite p-8 text-marfim md:p-9 lg:col-span-2">
            <Monograma className="size-12 text-dourado" />
            <div className="mt-10">
              <h3 className="text-xl font-extrabold tracking-[0.06em] uppercase">Não encontrou o seu caso?</h3>
              <p className="mt-4 leading-relaxed text-marfim/75">
                Conte o que está acontecendo. Se não for da nossa área, dizemos com clareza e orientamos o caminho.
              </p>
              <a href="#contato" className="mt-8 inline-flex items-center gap-3 py-2 text-[0.78rem] font-bold tracking-[0.22em] text-dourado uppercase">
                Enviar mensagem <Seta />
              </a>
            </div>
          </Revelar>
        </ul>
      </div>
    </section>
  )
}

function Atendimento() {
  return (
    <section id="atendimento" className="bg-noite py-28 text-marfim md:py-36">
      <div className="wrap">
        <Cabecalho rotulo="Como atendemos" titulo="Do primeiro contato à" destaque="solução" claro />
        <ol className="mt-16 grid gap-px overflow-hidden rounded-[1.75rem] border border-marfim/12 bg-marfim/12 md:grid-cols-2 lg:grid-cols-4">
          {PASSOS.map((p, i) => (
            <Revelar as="li" key={p.titulo} atraso={i * 0.08} className="bg-noite-2 p-8 md:p-9">
              <span className="text-5xl font-extrabold text-dourado/30 tabular-nums">0{i + 1}</span>
              <h3 className="mt-6 text-lg font-bold tracking-[0.12em] uppercase">{p.titulo}</h3>
              <p className="mt-4 leading-relaxed text-marfim/75">{p.texto}</p>
            </Revelar>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Frase() {
  return (
    <section aria-label="Nosso compromisso" className="bg-marfim py-24 md:py-32">
      <div className="wrap">
        <Revelar>
          <blockquote className="max-w-5xl text-[clamp(1.7rem,4.2vw,3.2rem)] leading-[1.25] font-medium tracking-[-0.01em] text-tinta">
            “Cada caso tem uma história. O nosso trabalho é conduzi-la com técnica, clareza e responsabilidade, do
            começo ao fim.”
          </blockquote>
          <p className="rotulo mt-10 text-bronze">Brandão &amp; Pessoa Advocacia</p>
        </Revelar>
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {[
            { t: 'Visão estratégica', d: 'Antes de qualquer ação, analisamos cenários, riscos e os caminhos possíveis para o seu caso.' },
            { t: 'Linguagem clara', d: 'Você entende o que está acontecendo, o que esperar e o que será preciso em cada etapa.' },
            { t: 'Compromisso real', d: 'Cada estratégia parte do seu problema concreto e dos seus objetivos, não de um modelo pronto.' },
          ].map((d, i) => (
            <Revelar key={d.t} atraso={i * 0.08} className="rounded-[1.75rem] border border-marfim-2 bg-white/70 p-8">
              <span className="text-sm font-bold tracking-[0.2em] text-bronze">0{i + 1}</span>
              <h3 className="mt-4 text-lg font-extrabold tracking-[0.08em] text-tinta uppercase">{d.t}</h3>
              <p className="mt-3 leading-relaxed text-tinta-2">{d.d}</p>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  )
}

function Duvidas() {
  return (
    <section id="duvidas" className="bg-marfim-2 py-28 md:py-36">
      <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <Cabecalho rotulo="Perguntas frequentes" titulo="Dúvidas sobre o primeiro" destaque="atendimento" className="lg:sticky lg:top-32 lg:self-start" />
        <Revelar className="grid gap-4">
          {DUVIDAS.map((d) => (
            <details key={d.p} className="group rounded-2xl border border-white bg-white/80 open:bg-white">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 text-lg leading-snug font-bold text-tinta md:p-7 [&::-webkit-details-marker]:hidden">
                {d.p}
                <span aria-hidden="true" className="relative size-5 shrink-0 text-bronze">
                  <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
                  <span className="absolute inset-y-0 left-1/2 w-px bg-current transition-transform duration-300 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="px-6 pb-7 leading-relaxed text-tinta-2 md:px-7">{d.r}</p>
            </details>
          ))}
        </Revelar>
      </div>
    </section>
  )
}

function Contatos() {
  return (
    <section id="contato" className="relative isolate overflow-hidden bg-noite py-28 text-marfim md:py-36">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(90%_60%_at_50%_0%,#1d2c4b_0%,transparent_70%)]" />
      <div className="wrap">
        <div className="mx-auto max-w-3xl text-center">
          <Cabecalho rotulo="Entre em contato" titulo="O seu caso merece" destaque="atenção de verdade." claro centro />
          <Revelar atraso={0.1} className="mt-10 text-lg leading-relaxed text-marfim/80">
            Fale com o escritório. A sua situação será analisada com cuidado desde o primeiro contato.
          </Revelar>
        </div>

        <Revelar atraso={0.15} className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-[repeat(auto-fit,minmax(13rem,1fr))]">
          <a href={linkWhatsApp()} className="botao bg-marfim text-noite hover:bg-dourado">
            <IconeWhatsApp className="size-5" /> Falar no WhatsApp
          </a>
          {TELEFONE && (
            <a href={`tel:+55${TELEFONE}`} className="botao bg-dourado text-noite outline outline-1 -outline-offset-[7px] outline-noite/25 hover:bg-marfim">
              Ligar agora
            </a>
          )}
          {EMAIL && (
            <a href={`mailto:${EMAIL}`} className="botao rounded-xl border border-marfim/40 hover:border-dourado hover:text-dourado">
              Enviar e-mail <Seta />
            </a>
          )}
        </Revelar>

        <Revelar className="mx-auto mt-16 max-w-3xl border border-marfim/15 bg-noite-2 p-7 md:p-12">
          <p className="text-xs font-bold tracking-[0.3em] text-dourado uppercase">Contato por mensagem</p>
          <h3 className="mt-4 text-[clamp(1.6rem,3vw,2.2rem)] font-bold">Envie a sua solicitação</h3>
          <p className="mt-4 mb-10 leading-relaxed text-marfim/70">
            Descreva brevemente a sua necessidade. As informações serão usadas somente para o retorno do escritório.
          </p>
          <Contato />
        </Revelar>
      </div>
    </section>
  )
}

function Pendente({ children }: { children: string }) {
  return <span className="inline-block border border-dashed border-dourado/50 px-2 text-sm text-dourado/80">{children}</span>
}

function Rodape() {
  return (
    <footer className="border-t border-marfim/10 bg-[#080e1b] pt-20 pb-10 text-marfim">
      <div className="wrap grid gap-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Marca className="[&_svg]:size-11" />
          <p className="mt-8 max-w-sm text-marfim/80">Defesa técnica e atendimento próximo, do primeiro contato à solução do caso.</p>
          <address className="mt-8 grid gap-1.5 text-dourado not-italic">
            {ENDERECO.length ? ENDERECO.map((l) => <span key={l}>{l}</span>) : <Pendente>Endereço a confirmar</Pendente>}
            <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
              {TELEFONE ? <a href={`tel:+55${TELEFONE}`}>{formatarTelefone(TELEFONE)}</a> : <Pendente>Telefone a confirmar</Pendente>}
              {EMAIL ? <a href={`mailto:${EMAIL}`}>{EMAIL}</a> : <Pendente>E-mail a confirmar</Pendente>}
            </span>
            <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener" className="mt-1 hover:underline">
              @{INSTAGRAM}
            </a>
          </address>
        </div>

        <nav aria-label="Áreas de atuação">
          <p className="text-xs font-bold tracking-[0.3em] text-dourado uppercase">Atuação</p>
          <ul className="mt-6 grid gap-1">
            {AREAS.map((a) => (
              <li key={a.id}>
                <a href="#areas" className="inline-block py-1.5 text-marfim/85 hover:text-dourado">
                  {a.nome}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="O escritório">
          <p className="text-xs font-bold tracking-[0.3em] text-dourado uppercase">O escritório</p>
          <ul className="mt-6 grid gap-1">
            {SECOES.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="inline-block py-1.5 text-marfim/85 hover:text-dourado">
                  {s.nome}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="wrap mt-16 border-t border-marfim/10 pt-8 text-center text-sm leading-relaxed text-marfim/60">
        <p>© {ANO} Brandão &amp; Pessoa Advocacia. Todos os direitos reservados.</p>
        <p className="mt-2">
          Sócios: Albino Brandão · {SOCIOS[0].oab} | Philipe Pessoa · {SOCIOS[1].oab}
        </p>
        {CNPJ && <p className="mt-2">CNPJ nº {CNPJ}</p>}
      </div>
    </footer>
  )
}

const formatarTelefone = (t: string) =>
  t.length === 11 ? `(${t.slice(0, 2)}) ${t.slice(2, 7)}-${t.slice(7)}` : t.length === 10 ? `(${t.slice(0, 2)}) ${t.slice(2, 6)}-${t.slice(6)}` : t

function BotaoWhatsApp() {
  return (
    <motion.a
      href={linkWhatsApp()}
      aria-label={WHATSAPP ? 'Conversar no WhatsApp' : 'Ir para o contato'}
      className="fixed right-4 bottom-4 z-30 grid size-16 place-items-center rounded-full bg-whats text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,0.6)] md:right-6 md:bottom-6"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.4, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.06 }}
    >
      <IconeWhatsApp className="size-8" />
    </motion.a>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Topo />
      <main>
        <Abertura />
        <Escritorio />
        <Socios />
        <Areas />
        <Atendimento />
        <Frase />
        <Duvidas />
        <Contatos />
      </main>
      <Rodape />
      <BotaoWhatsApp />
    </MotionConfig>
  )
}
