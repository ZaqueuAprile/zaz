import type { Restaurant, StoredMessage } from './types.ts'

export interface Dish {
  category: string
  name: string
  description?: string
  price: number
  available: boolean
  tags?: string[]
}

export interface Knowledge {
  hours: string
  address: string
  payment: string
  delivery: string
  houseRules: string[]
  faq: { q: string; a: string }[]
  menu: Dish[]
  tone?: string
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

function need(cond: boolean, field: string): asserts cond {
  if (!cond) throw new Error(`Dados do restaurante inválidos: campo "${field}"`)
}

export function validateKnowledge(data: unknown): Knowledge {
  need(isObj(data), 'raiz')
  for (const f of ['hours', 'address', 'payment', 'delivery'] as const) need(typeof data[f] === 'string', f)
  need(Array.isArray(data.houseRules) && data.houseRules.every((x) => typeof x === 'string'), 'houseRules')
  need(Array.isArray(data.faq) && data.faq.every((x) => isObj(x) && typeof x.q === 'string' && typeof x.a === 'string'), 'faq')
  need(Array.isArray(data.menu), 'menu')
  data.menu.forEach((d, i) => {
    need(isObj(d), `menu[${i}]`)
    need(typeof d.category === 'string' && typeof d.name === 'string', `menu[${i}].name`)
    need(typeof d.price === 'number' && Number.isFinite(d.price), `menu[${i}].price`)
    need(typeof d.available === 'boolean', `menu[${i}].available`)
  })
  need(data.tone === undefined || typeof data.tone === 'string', 'tone')
  return data as unknown as Knowledge
}

const brl = (v: number) => 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')

export function buildSystemPrompt(r: Restaurant, k: Knowledge): string {
  const byCat = new Map<string, Dish[]>()
  for (const d of k.menu.filter((x) => x.available)) {
    if (!byCat.has(d.category)) byCat.set(d.category, [])
    byCat.get(d.category)!.push(d)
  }
  const menu = [...byCat].map(([cat, ds]) => `${cat}:\n` + ds.map((d) =>
    `- ${d.name}: ${brl(d.price)}${d.description ? ` (${d.description})` : ''}${d.tags?.length ? ` [${d.tags.join(', ')}]` : ''}`).join('\n')).join('\n\n')
  return [
    `Você é o atendente do ${r.name} no WhatsApp. Atende clientes que querem saber sobre o restaurante.`,
    '',
    'Regras:',
    '- Responda somente com as informações do restaurante abaixo. Nunca invente preço, prato, horário, promoção ou promessa.',
    '- Responda no idioma do cliente: português, espanhol ou inglês. Informe esse idioma no campo lang.',
    '- Respostas curtas, de até 3 frases, no tom de WhatsApp, sem listas longas. Se o cliente pedir o cardápio, cite as categorias e alguns pratos.',
    '- Se a informação não estiver abaixo, diga que vai confirmar com a equipe e marque handoff como true.',
    '- Reclamação, pedido de reembolso, evento, reserva para grupo grande ou qualquer pedido de falar com uma pessoa: responda com gentileza que vai chamar a equipe e marque handoff como true.',
    '- Mensagens marcadas com [equipe] foram escritas por funcionários do restaurante.',
    '- Em reason, explique em poucas palavras o motivo do handoff; deixe vazio quando handoff for false.',
    k.tone ? `- Tom: ${k.tone}` : '',
    '',
    `# ${r.name}`,
    `Horário: ${k.hours}`,
    `Endereço: ${k.address}`,
    `Pagamento: ${k.payment}`,
    `Entrega: ${k.delivery}`,
    '',
    'Regras da casa:',
    ...k.houseRules.map((x) => `- ${x}`),
    '',
    'Perguntas frequentes:',
    ...k.faq.map((f) => `- ${f.q} ${f.a}`),
    '',
    'Cardápio (somente os pratos disponíveis hoje):',
    menu,
  ].filter((l, i, a) => !(l === '' && a[i - 1] === '')).join('\n')
}

export const HISTORY_LIMIT = 12

export function buildMessages(history: StoredMessage[], incoming: string): { role: 'user' | 'assistant'; content: string }[] {
  const out: { role: 'user' | 'assistant'; content: string }[] = []
  const push = (role: 'user' | 'assistant', content: string) => {
    const last = out.at(-1)
    if (last && last.role === role) last.content += '\n' + content
    else out.push({ role, content })
  }
  for (const m of history.slice(-HISTORY_LIMIT)) {
    if (m.direction === 'bot') push('assistant', m.text)
    else push('user', m.direction === 'team' ? `[equipe] ${m.text}` : m.text)
  }
  while (out.length && out[0].role === 'assistant') out.shift()
  push('user', incoming)
  return out
}
