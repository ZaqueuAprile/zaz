import type Anthropic from '@anthropic-ai/sdk'
import type { BrainReply } from './brain.ts'
import { buildMessages, buildSystemPrompt, HISTORY_LIMIT } from './knowledge.ts'
import { classify, FIXED, isPaused, pauseUntil, teamAlert, wantsHuman } from './rules.ts'
import type { Store } from './store.ts'
import type { Conversation, IncomingMessage, Lang, Restaurant } from './types.ts'
import { parseWebhook, type UazapiClient } from './uazapi.ts'

export interface Deps {
  store: Store
  uazapi: (r: Restaurant) => UazapiClient
  brain: (system: string, messages: Anthropic.MessageParam[]) => Promise<BrainReply>
  now: () => Date
  sleep: (ms: number) => Promise<void>
  log: (event: string, data: Record<string, unknown>) => void
}

export type Outcome =
  | 'ignored' | 'duplicate' | 'team' | 'paused' | 'media' | 'replied' | 'handoff' | 'failure' | 'unknown_instance'

export async function handleWebhook(deps: Deps, body: unknown): Promise<{ status: 200; outcome: Outcome }> {
  try {
    return { status: 200, outcome: await run(deps, body) }
  } catch (e) {
    deps.log('erro_inesperado', { error: String(e) })
    return { status: 200, outcome: 'failure' }
  }
}

async function run(deps: Deps, body: unknown): Promise<Outcome> {
  const msg = parseWebhook(body)
  if (!msg) return 'ignored'
  const found = await deps.store.restaurantByInstance(msg.instance)
  if (!found || !found.restaurant.active) {
    deps.log('instancia_desconhecida', { instance: msg.instance })
    return 'unknown_instance'
  }
  const { restaurant: r, knowledge } = found
  const kind = classify(msg)
  if (kind === 'ignore') return 'ignored'

  const now = deps.now()
  const conv = await deps.store.conversation(r.id, msg.phone)
  const saved = await deps.store.saveMessage(conv.id, {
    direction: kind === 'team' ? 'team' : 'client', text: msg.text || `[${msg.kind}]`, at: msg.at, externalId: msg.externalId,
  })
  if (saved === 'duplicate') return 'duplicate'

  if (kind === 'team') {
    await deps.store.setPause(conv.id, pauseUntil(now, r.handoffHours))
    return 'team'
  }
  if (isPaused(conv, now)) return 'paused'

  const wa = deps.uazapi(r)
  const lang: Lang = conv.lang ?? r.defaultLang

  if (msg.kind !== 'text') {
    await reply(deps, wa, conv, msg.phone, FIXED.media[lang], now)
    return 'media'
  }

  if (wantsHuman(msg.text)) {
    await reply(deps, wa, conv, msg.phone, FIXED.failure[lang], now)
    await handoff(deps, wa, r, conv, msg, 'cliente pediu para falar com uma pessoa', now)
    return 'handoff'
  }

  let answer: BrainReply
  try {
    const history = await deps.store.history(conv.id, HISTORY_LIMIT + 1)
    const previous = history.slice(0, -1) // a última é a mensagem que acabou de chegar
    answer = await deps.brain(buildSystemPrompt(r, knowledge), buildMessages(previous, msg.text))
  } catch (e) {
    deps.log('falha_ia', { error: String(e), restaurant: r.id })
    await reply(deps, wa, conv, msg.phone, FIXED.failure[lang], now)
    await handoff(deps, wa, r, conv, msg, 'falha no atendimento automático', now)
    return 'failure'
  }

  await reply(deps, wa, conv, msg.phone, answer.reply, now, answer.usage)
  await deps.store.setLang(conv.id, answer.lang)
  if (answer.handoff) {
    await handoff(deps, wa, r, conv, msg, answer.reason || 'atendimento automático pediu ajuda', now)
    return 'handoff'
  }
  return 'replied'
}

async function reply(
  deps: Deps, wa: UazapiClient, conv: Conversation, to: string, text: string, now: Date, tokens?: BrainReply['usage'],
) {
  const wait = 1500 + Math.floor(Math.random() * 1500)
  try { await wa.sendTyping(to, wait) } catch (e) { deps.log('falha_digitando', { error: String(e) }) }
  await deps.sleep(wait)
  await wa.sendText(to, text)
  await deps.store.saveMessage(conv.id, { direction: 'bot', text, at: new Date(now.getTime() + wait), tokens })
}

async function handoff(
  deps: Deps, wa: UazapiClient, r: Restaurant, conv: Conversation, msg: IncomingMessage, reason: string, now: Date,
) {
  await deps.store.setPause(conv.id, pauseUntil(now, r.handoffHours))
  try {
    await wa.sendText(r.teamPhone, teamAlert(msg.phone, reason, msg.text))
  } catch (e) {
    deps.log('falha_alerta_equipe', { error: String(e), restaurant: r.id })
  }
}
