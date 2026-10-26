import { MotionConfig, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { Cardapio } from './components/Cardapio'
import { Reserva } from './components/Reserva'
import { Revelar } from './components/Revelar'
import { Rio } from './components/Rio'
import bar from './img/bar.webp'
import chefKelvin from './img/chef-kelvin.webp'
import chefViko from './img/chef-viko.webp'
import placaNoite from './img/placa-noite.webp'
import rioPolaroids from './img/rio-polaroids.webp'
import salao from './img/salao.webp'

const ANO = new Date().getFullYear()

const entrada = { duration: 1.1, ease: [0.22, 1, 0.36, 1] } as const

// Espaço vazio onde o rio atravessa a página de uma margem à outra.
function Curva() {
  return <div data-curva aria-hidden="true" className="h-36 md:h-56" />
}

function Rotulo({ numero, children }: { numero: string; children: ReactNode }) {
  return (
    <p className="rotulo text-tinta-2">
      <span className="tabular-nums">{numero}</span>
      <span aria-hidden="true"> — </span>
      {children}
    </p>
  )
}

function Topo() {
  const { scrollY } = useScroll()
  const [solido, setSolido] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setSolido(y > 24))

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solido ? 'bg-cal/95 shadow-[0_1px_0_var(--color-linha)] backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <a href="#inicio" className="font-display text-xl" aria-label="Bossa Cucina, início">
          Bossa <em>Cucina</em>
        </a>
        <nav aria-label="Principal" className="flex items-center gap-6 text-sm font-medium">
          <a href="#massa" className="hidden py-3 sublinhado sm:inline">
            Cardápio
          </a>
          <a href="#mesa" className="py-3 sublinhado">
            Reservar
          </a>
        </nav>
      </div>
    </header>
  )
}

function Inicio() {
  return (
    <section id="inicio" className="wrap flex min-h-dvh flex-col pt-28 pb-10 md:pt-32">
      <div className="grid flex-1 items-end gap-10 md:grid-cols-12">
        <div className="md:col-span-8">
          <motion.p
            className="rotulo mb-8 text-tinta-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...entrada, delay: 0.2 }}
          >
            Casa de massas · à beira do rio
          </motion.p>
          <h1 className="font-display leading-[0.82] tracking-[-0.02em]">
            <motion.span
              className="block text-[clamp(6rem,24vw,17rem)]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={entrada}
            >
              Bossa
            </motion.span>
            <motion.em
              className="block pl-[0.6em] text-[clamp(3rem,11vw,8rem)]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...entrada, delay: 0.12 }}
            >
              Cucina
            </motion.em>
          </h1>
          <motion.p
            className="mt-10 max-w-sm font-mao text-2xl leading-snug md:text-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...entrada, delay: 0.5 }}
          >
            onde o rio desenha suas curvas, moldamos nossas massas
          </motion.p>
        </div>

        <motion.figure
          className="md:col-span-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...entrada, delay: 0.35 }}
        >
          <img
            src={placaNoite}
            width={892}
            height={1189}
            className="aspect-[3/4] w-full max-w-xs object-cover md:ml-auto"
            alt="Placa luminosa do Bossa à noite, pendurada em um tronco, com a lua cheia refletida no mar ao fundo."
          />
        </motion.figure>
      </div>

      <div className="mt-12 flex flex-wrap items-end justify-between gap-4 border-t border-linha pt-5 text-sm text-tinta-2">
        <p>Quarta a segunda, a partir das 18h. Domingo, a partir das 14h.</p>
        <a href="#casa" className="sublinhado font-medium text-tinta">
          Descer pelo rio
        </a>
      </div>
    </section>
  )
}

function Casa() {
  return (
    <section id="casa" aria-labelledby="casa-titulo" className="wrap grid gap-10 md:grid-cols-12">
      <div className="md:col-span-3">
        <Rotulo numero="01">A casa</Rotulo>
      </div>
      <Revelar className="md:col-span-5">
        <h2 id="casa-titulo" className="mb-8 font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.02] text-balance">
          Uma casa de massas feita para ficar
        </h2>
        <p className="mb-5 max-w-prose">
          O Bossa fica à beira do rio, entre árvores e telhado de barro. Lá dentro, uma linha preta corre pela parede do
          salão e escreve o que fazemos: massas moldadas no ritmo das curvas do rio que passa em frente.
        </p>
        <p className="max-w-prose">
          Cozinhamos com calma. A massa é aberta e cortada todos os dias, os molhos cozinham o tempo que precisam e a mesa
          é para conversar.
        </p>
        <ul className="mt-10 border-t border-linha text-sm">
          {[
            'Massas frescas feitas todos os dias',
            'Mesas no salão e na calçada, de frente para o rio',
            'Vinhos e drinks no balcão desde a abertura',
          ].map((fato) => (
            <li key={fato} className="border-b border-linha py-3">
              {fato}
            </li>
          ))}
        </ul>
      </Revelar>
      <Revelar className="md:col-span-4" atraso={0.1}>
        <img
          src={salao}
          width={1088}
          height={1344}
          loading="lazy"
          className="w-full"
          alt="Salão do Bossa: parede branca com o lema escrito à mão e uma linha preta que desenha um rio, lustres de palha e mesas redondas de madeira."
        />
      </Revelar>
    </section>
  )
}

function Massa() {
  return (
    <section id="massa" aria-labelledby="massa-titulo" className="wrap grid gap-10 md:grid-cols-12">
      <div className="md:col-span-3">
        <Rotulo numero="02">A massa</Rotulo>
      </div>
      <div className="md:col-span-9">
        <Revelar>
          <h2 id="massa-titulo" className="font-display text-[clamp(3rem,9vw,8.5rem)] leading-[0.92] tracking-[-0.015em]">
            Farinha, ovos, água <em className="text-oliva">e tempo.</em>
          </h2>
        </Revelar>
        <Revelar className="mt-12 grid gap-8 md:grid-cols-2" atraso={0.1}>
          <p>
            A massa é feita à mão, todos os dias. Farinha, ovos e água descansam o tempo que precisam e são abertos,
            cortados e recheados na própria casa, sem atalhos.
          </p>
          <p>
            Cada formato pede um molho. Os fios finos levam ragus de cozimento lento, os recheados pedem manteiga e
            ervas, e os mais simples pedem só o que não atrapalha.
          </p>
        </Revelar>
        <Revelar className="mt-10" atraso={0.15}>
          <Cardapio />
        </Revelar>
      </div>
    </section>
  )
}

function OSRio() {
  return (
    <section id="rio" aria-labelledby="rio-titulo" className="bg-oliva-foto py-24 text-cal-claro md:py-36">
      <div className="wrap grid items-center gap-12 md:grid-cols-12">
        <Revelar className="md:col-span-6 md:col-start-1">
          <img
            src={rioPolaroids}
            width={1350}
            height={1688}
            loading="lazy"
            className="w-full"
            alt="Cinco polaroids com vistas aéreas das curvas do rio cercado de mata, sobre um fundo verde-oliva."
          />
        </Revelar>
        <Revelar className="md:col-span-5 md:col-start-8" atraso={0.1}>
          <p className="rotulo mb-8 text-cal-claro">
            <span className="tabular-nums">03</span>
            <span aria-hidden="true"> — </span>O rio
          </p>
          <h2 id="rio-titulo" className="mb-8 font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.02] text-balance">
            O rio é o nosso desenho
          </h2>
          <p className="mb-5">
            Vista de cima, a água faz curvas largas no meio da mata. É esse desenho que aparece na parede do salão, no
            nome dos pratos e no jeito de cortar a massa: sem pressa e sem linha reta.
          </p>
          <p>
            Cozinhamos com o que o rio, o mar e as hortas ao redor oferecem, e servimos a poucos metros da água.
          </p>
        </Revelar>
      </div>
    </section>
  )
}

const CHEFS = [
  {
    nome: 'Viko Tangoda',
    cargo: 'Chef executivo',
    foto: chefViko,
    tamanho: 447,
    alt: 'Retrato do chef Viko Tangoda, sorrindo, de braços cruzados, com dólmã branco e óculos de armação redonda.',
    historia: [
      'Viko vem de uma família que sempre gostou de receber, e foi à mesa que a cozinha começou para ele. Desde 2004 é o banqueteiro oficial dos camarotes da Sapucaí, no Carnaval do Rio, e atende os paddocks VIP do Grande Prêmio de Fórmula 1 do Brasil.',
      'Já foi apontado como o melhor banqueteiro do país pela revista Prazeres da Mesa. Hoje assina o cardápio do Bossa e conduz o Mesa Solidária, projeto que leva comida a quem precisa.',
    ],
  },
  {
    nome: 'Kelvin Ribeiro',
    cargo: 'Chef, à frente da operação',
    foto: chefKelvin,
    tamanho: 1000,
    alt: 'Retrato do chef Kelvin Ribeiro de avental azul-escuro, com as mãos apoiadas no balcão de madeira diante de um prato de lula.',
    historia: [
      'Aos 17 anos, Kelvin bateu à porta de um restaurante em Santo André em busca do primeiro emprego. Encontrou muito mais que uma oportunidade: descobriu sua paixão pela gastronomia.',
      'Entre mestres generosos e encontros que transformam destinos, construiu uma história de talento e gratidão. E a vida lhe reservou uma bonita coincidência: voltar ao lugar onde tudo começou, agora como chef.',
    ],
  },
]

function Cozinha() {
  return (
    <section id="cozinha" aria-labelledby="cozinha-titulo" className="wrap">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <Rotulo numero="04">Cozinha</Rotulo>
        </div>
        <div className="md:col-span-9">
          <Revelar>
            <h2 id="cozinha-titulo" className="mb-6 font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.02]">
              Duas mãos na massa
            </h2>
            <p className="mb-14 max-w-prose">
              Um chef assina o cardápio, o outro comanda a operação do dia a dia.
            </p>
          </Revelar>
          <div className="grid gap-14 sm:grid-cols-2 sm:gap-10">
            {CHEFS.map((chef, i) => (
              <Revelar key={chef.nome} atraso={i * 0.08}>
                <img
                  src={chef.foto}
                  width={chef.tamanho}
                  height={chef.tamanho}
                  loading="lazy"
                  className="aspect-square w-full object-cover grayscale-[35%]"
                  alt={chef.alt}
                />
                <h3 className="mt-6 font-display text-3xl">{chef.nome}</h3>
                <p className="rotulo mt-1 text-tinta-2">{chef.cargo}</p>
                <details className="group mt-5 border-t border-linha">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 text-sm font-medium">
                    <span className="group-open:hidden">Ler a história</span>
                    <span className="hidden group-open:inline">Fechar a história</span>
                    <span aria-hidden="true" className="text-lg transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="space-y-4 pb-2 text-[0.95rem] text-tinta-2">
                    {chef.historia.map((p) => (
                      <p key={p.slice(0, 24)}>{p}</p>
                    ))}
                  </div>
                </details>
              </Revelar>
            ))}
          </div>
        </div>
      </div>

      <Revelar className="mt-24 md:mt-32">
        <figure>
          <img
            src={bar}
            width={1206}
            height={671}
            loading="lazy"
            className="w-full"
            alt="Balcão do bar com iluminação quente, um grande vaso de barro com bambu, prateleiras de taças e garrafas e janelas abertas para o rio."
          />
          <figcaption className="mt-4 max-w-md text-sm text-tinta-2">
            O balcão recebe quem chega para um drink antes do jantar, com a porta aberta para o rio.
          </figcaption>
        </figure>
      </Revelar>
    </section>
  )
}

function Mesa() {
  return (
    <section id="mesa" aria-labelledby="mesa-titulo" className="wrap grid gap-10 pb-24 md:grid-cols-12 md:pb-36">
      <div className="md:col-span-3">
        <Rotulo numero="05">Mesa</Rotulo>
      </div>
      <Revelar className="md:col-span-4">
        <h2 id="mesa-titulo" className="mb-8 font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.02]">
          Reserve sua mesa
        </h2>
        <p className="mb-5">
          Informe a data, o horário e o número de pessoas. O pedido segue pelo WhatsApp da casa, que confirma a reserva por lá.
        </p>
        <p className="text-tinta-2">Para grupos acima de 12 pessoas, fale direto com a casa.</p>
      </Revelar>
      <Revelar className="md:col-span-5" atraso={0.1}>
        <Reserva />
      </Revelar>
    </section>
  )
}

function Rodape() {
  const colunas = [
    { titulo: 'Contato', linhas: ['[Endereço da casa]', '[Cidade, UF]', '[Telefone]'] },
    { titulo: 'Horários', linhas: ['Qua a sáb e seg: 18h às 23h', 'Domingo: 14h às 21h', 'Terça: fechado'] },
    { titulo: 'Siga a casa', linhas: ['Instagram: [@perfil]'] },
  ]
  return (
    <footer className="border-t border-linha">
      <div className="wrap grid gap-10 py-16 text-sm sm:grid-cols-2 md:grid-cols-12">
        <p className="font-display text-3xl sm:col-span-2 md:col-span-3">
          Bossa <em>Cucina</em>
        </p>
        {colunas.map((c) => (
          <div key={c.titulo} className="md:col-span-3">
            <h2 className="rotulo mb-3 text-tinta-2">{c.titulo}</h2>
            {c.linhas.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        ))}
      </div>
      <div className="wrap flex flex-wrap justify-between gap-4 border-t border-linha py-6 text-xs text-tinta-2">
        <p>© {ANO} Bossa Cucina</p>
        <a href="../" className="sublinhado">
          Conceito de portfólio
        </a>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-50 -translate-y-24 bg-tinta px-4 py-2 text-cal focus:translate-y-0"
      >
        Ir para o conteúdo
      </a>
      <Topo />
      <div className="relative overflow-x-clip">
        <Rio />
        <main id="conteudo">
          <Inicio />
          <Curva />
          <Casa />
          <Curva />
          <Massa />
          <Curva />
          <OSRio />
          <Curva />
          <Cozinha />
          <Curva />
          <Mesa />
        </main>
        <Rodape />
      </div>
    </MotionConfig>
  )
}
