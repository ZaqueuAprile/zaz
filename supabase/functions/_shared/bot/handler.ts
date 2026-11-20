import type Anthropic from '@anthropic-ai/sdk'
import type { BrainReply } from './brain.ts'
import { buildMessages, buildSystemPrompt, HISTORY_LIMIT, localNow } from './knowledge.ts'
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

const ECHO_WINDOW_MS = 5 * 60_000

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
  if (kind === 'ignore' || msg.phone === r.teamPhone) return 'ignored'

  const now = deps.now()
  const conv = await deps.store.conversation(r.id, msg.phone)

  if (kind === 'team') {
    // Eco de uma resposta do bot que chegou sem a marca de "enviada pela API": não é a equipe.
    const recent = await deps.store.history(conv.id, HISTORY_LIMIT)
    const echo = recent.some((m) => m.direction === 'bot' && m.text === msg.text && now.getTime() - m.at.getTime() < ECHO_WINDOW_MS)
    if (echo) return 'ignored'
  }

  // Hora do servidor, não a do celular: mantém a ordem da conversa certa.
  const saved = await deps.store.saveMessage(conv.id, {
    direction: kind === 'team' ? 'team' : 'client', text: msg.text || `[${msg.kind}]`, at: now, externalId: msg.externalId,
  })
  if (saved === 'duplicate') return 'duplicate'

  if (kind === 'team') {
    await deps.store.setPause(conv.id, pauseUntil(now, r.handoffHours))
    return 'team'
  }
  if (isPaused(conv, now)) return 'paused'
  if (msg.kind === 'other') return 'ignored'

  const wa = deps.uazapi(r)
  const lang: Lang = conv.lang ?? r.defaultLang
  let alerted = false
  const handoffOnce = async (reason: string) => {
    if (alerted) return
    alerted = true
    await handoff(deps, wa, r, conv, msg, reason, now)
  }

  try {
    if (msg.kind === 'media') {
      await reply(deps, wa, conv, msg.phone, FIXED.media[lang], now)
      return 'media'
    }

    if (wantsHuman(msg.text)) {
      await handoffOnce('cliente pediu para falar com uma pessoa')
      await reply(deps, wa, conv, msg.phone, FIXED.failure[lang], now)
      return 'handoff'
    }

    let answer: BrainReply
    try {
      const history = await deps.store.history(conv.id, HISTORY_LIMIT + 1)
      const previous = history.filter((m) => m.externalId !== msg.externalId).slice(-HISTORY_LIMIT)
      answer = await deps.brain(buildSystemPrompt(r, knowledge), buildMessages(previous, msg.text, localNow(now, r.timezone)))
    } catch (e) {
      deps.log('falha_ia', { error: String(e), restaurant: r.id })
      await handoffOnce('falha no atendimento automático')
      await reply(deps, wa, conv, msg.phone, FIXED.failure[lang], now)
      return 'failure'
    }

    if (answer.handoff) await handoffOnce(answer.reason || 'atendimento automático pediu ajuda')
    await reply(deps, wa, conv, msg.phone, answer.reply, now, answer.usage)
    await deps.store.setLang(conv.id, answer.lang)
    return answer.handoff ? 'handoff' : 'replied'
  } catch (e) {
    // Qualquer falha depois de guardar a mensagem: a equipe precisa saber, senão o cliente fica sem resposta.
    deps.log('falha_envio', { error: String(e), restaurant: r.id })
    try { await handoffOnce('falha ao responder pelo WhatsApp') } catch (e2) { deps.log('falha_handoff', { error: String(e2) }) }
    return 'failure'
  }
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
