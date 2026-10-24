import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

type Traco = { largura: number; altura: number; d: string }
type Faixa = { topo: number; base: number }

// Ponto da tela, em fração da altura da janela, onde fica a ponta do rio.
const PONTA = 0.62

/*
  O rio desce por uma das margens da página e, a cada elemento marcado com
  data-curva, atravessa para a margem oposta numa curva em S. Entre as curvas
  ele ondula de leve, como a linha pintada na parede do salão.
  O traço é calculado em pixels reais, então a espessura nunca distorce.
*/
function tracar(largura: number, altura: number, curvas: Faixa[]): string {
  const estreito = largura < 640
  const margem = estreito ? 11 : Math.min(56, largura * 0.035)
  const onda = estreito ? 3 : 12
  const margens = [margem, largura - margem]

  let lado = 0
  let x = margens[lado]
  let y = 0
  let d = `M ${x} ${y}`

  const descer = (ate: number) => {
    if (ate <= y) return
    const passos = Math.max(1, Math.round((ate - y) / 380))
    const passo = (ate - y) / passos
    for (let i = 1; i <= passos; i++) {
      const ny = y + passo
      const nx = margens[lado] + (i === passos ? 0 : i % 2 ? onda : -onda)
      const k = passo * 0.5
      d += ` C ${x} ${y + k}, ${nx} ${ny - k}, ${nx} ${ny}`
      x = nx
      y = ny
    }
  }

  for (const { topo, base } of curvas) {
    descer(topo)
    lado = 1 - lado
    const ox = margens[lado]
    const h = base - y
    d += ` C ${x} ${y + h * 0.85}, ${ox} ${base - h * 0.85}, ${ox} ${base}`
    x = ox
    y = base
  }

  descer(altura)
  return d
}

// Desenha o rio sobre o elemento pai, que precisa ter position: relative.
export function Rio() {
  const svg = useRef<SVGSVGElement>(null)
  const caminho = useRef<SVGPathElement>(null)
  const alturas = useRef<number[]>([])
  const [traco, setTraco] = useState<Traco | null>(null)
  const reduzido = useReducedMotion()

  const { scrollY } = useScroll()
  const destino = useMotionValue(0)
  const comprimento = useSpring(destino, { stiffness: 70, damping: 22, restDelta: 0.0005 })

  // Mede a página e redesenha o rio sempre que ela muda de tamanho.
  useLayoutEffect(() => {
    const raiz = svg.current?.parentElement
    if (!raiz) return
    const medir = () => {
      const caixa = raiz.getBoundingClientRect()
      const curvas = [...raiz.querySelectorAll<HTMLElement>('[data-curva]')].map((el) => {
        const r = el.getBoundingClientRect()
        return { topo: r.top - caixa.top, base: r.bottom - caixa.top }
      })
      setTraco({
        largura: caixa.width,
        altura: caixa.height,
        d: tracar(caixa.width, caixa.height, curvas),
      })
    }
    medir()
    const observador = new ResizeObserver(medir)
    observador.observe(raiz)
    return () => observador.disconnect()
  }, [])

  // Faz a ponta do rio acompanhar a rolagem: procura o ponto do traço que
  // está na altura da PONTA da janela. O rio sempre desce, então a altura
  // cresce junto com o comprimento e a busca binária funciona.
  const acompanhar = () => {
    const raiz = svg.current?.parentElement
    const ys = alturas.current
    if (!raiz || ys.length < 2) return
    const alvoY = window.scrollY + window.innerHeight * PONTA - (raiz.getBoundingClientRect().top + window.scrollY)
    let baixo = 0
    let alto = ys.length - 1
    while (baixo < alto) {
      const meio = (baixo + alto) >> 1
      if (ys[meio] < alvoY) baixo = meio + 1
      else alto = meio
    }
    destino.set(baixo / (ys.length - 1))
  }

  useEffect(() => {
    const p = caminho.current
    if (!p || !traco) return
    const total = p.getTotalLength()
    const n = Math.min(3000, Math.max(2, Math.ceil(total / 6)))
    alturas.current = Array.from({ length: n + 1 }, (_, i) => p.getPointAtLength((i / n) * total).y)
    acompanhar()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só reamostra quando o traço muda
  }, [traco])

  useMotionValueEvent(scrollY, 'change', acompanhar)

  return (
    <svg
      ref={svg}
      className="pointer-events-none absolute inset-0 z-30 overflow-visible"
      width={traco?.largura ?? 0}
      height={traco?.altura ?? 0}
      viewBox={traco ? `0 0 ${traco.largura} ${traco.altura}` : undefined}
      aria-hidden="true"
      focusable="false"
    >
      {traco && (
        <motion.path
          ref={caminho}
          d={traco.d}
          fill="none"
          stroke="var(--color-tinta)"
          strokeWidth={1.75}
          strokeLinecap="round"
          style={{ pathLength: reduzido ? 1 : comprimento }}
        />
      )}
    </svg>
  )
}
