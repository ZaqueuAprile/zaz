import { beforeEach, describe, expect, it } from 'vitest'
import exemplo from '../../../../bot/restaurantes/exemplo.json'
import fixture from './fixtures/uazapi-message.json'
import type { BrainReply } from './brain.ts'
import { handleWebhook, type Deps } from './handler.ts'
import { validateKnowledge } from './knowledge.ts'
import { FIXED } from './rules.ts'
import { FakeStore } from './store.ts'
import type { Restaurant } from './types.ts'

const r: Restaurant = {
  id: 'r1', name: 'Restaurante Exemplo', instance: 'rest-centro', instanceToken: 'tok-centro', teamPhone: '5573911112222',
  defaultLang: 'pt', handoffHours: 12, active: true,
}
const CLIENT = '5573999990000'

let n = 0
function body(over: Record<string, unknown> = {}, base: Record<string, any> = fixture.text) {
  n++
  return { ...base, message: { ...base.message, messageid: `id-${n}`, ...over } }
}

let store: FakeStore
let sent: { to: string; text: string }[]
let brainCalls: number
let brainImpl: () => Promise<BrainReply>
let now: Date

const ok = (reply: string, handoff = false, reason = ''): BrainReply =>
  ({ reply, handoff, reason, lang: 'pt', usage: { input: 10, output: 5, cacheRead: 0 } })

function deps(): Deps {
  return {
    store,
    uazapi: () => ({
      sendText: async (to, text) => { sent.push({ to, text }) },
      sendTyping: async () => {},
    }),
    brain: async () => { brainCalls++; return brainImpl() },
    now: () => now,
    sleep: async () => {},
    log: () => {},
  }
}

beforeEach(() => {
  store = new FakeStore()
  store.seed(r, validateKnowledge(exemplo))
  sent = []
  brainCalls = 0
  brainImpl = async () => ok('Abrimos às 18h, até as 23h.')
  now = new Date('2026-11-20T21:00:00Z')
})

describe('handleWebhook', () => {
  it('responde o cliente e guarda a resposta', async () => {
    const res = await handleWebhook(deps(), body())
    expect(res).toEqual({ status: 200, outcome: 'replied' })
    expect(sent).toEqual([{ to: CLIENT, text: 'Abrimos às 18h, até as 23h.' }])
    expect(store.messages.map((m) => m.direction)).toEqual(['client', 'bot'])
  })

  it('não responde duas vezes a mesma mensagem', async () => {
    const b = body()
    await handleWebhook(deps(), b)
    const res = await handleWebhook(deps(), b)
    expect(res.outcome).toBe('duplicate')
    expect(sent).toHaveLength(1)
  })

  it('ignora o eco da própria mensagem do bot sem pausar', async () => {
    const res = await handleWebhook(deps(), body({ fromMe: true, wasSentByApi: true }))
    expect(res.outcome).toBe('ignored')
    expect(store.conversations.every((c) => c.pausedUntil === null)).toBe(true)
    expect(await handleWebhook(deps(), body())).toMatchObject({ outcome: 'replied' })
  })

  it('para de responder quando a equipe responde pelo celular', async () => {
    expect((await handleWebhook(deps(), body({ fromMe: true, wasSentByApi: false }))).outcome).toBe('team')
    expect((await handleWebhook(deps(), body())).outcome).toBe('paused')
    expect(sent).toHaveLength(0)
    expect(store.messages.map((m) => m.direction)).toEqual(['team', 'client'])
  })

  it('volta a responder quando a pausa vence', async () => {
    await handleWebhook(deps(), body({ fromMe: true, wasSentByApi: false }))
    now = new Date(now.getTime() + 13 * 3_600_000)
    expect((await handleWebhook(deps(), body())).outcome).toBe('replied')
  })

  it('pede texto quando chega áudio, sem chamar a IA', async () => {
    const res = await handleWebhook(deps(), body({}, fixture.audio))
    expect(res.outcome).toBe('media')
    expect(sent).toEqual([{ to: CLIENT, text: FIXED.media.pt }])
    expect(brainCalls).toBe(0)
  })

  it('passa para a equipe quando o cliente pede atendente', async () => {
    const res = await handleWebhook(deps(), body({ text: 'quero falar com um atendente' }))
    expect(res.outcome).toBe('handoff')
    expect(brainCalls).toBe(0)
    expect(sent.find((s) => s.to === CLIENT)).toBeTruthy()
    expect(sent.find((s) => s.to === r.teamPhone)?.text).toContain('[Aprile] Conversa com 5573999990000')
    expect(store.conversations[0].pausedUntil).toEqual(new Date(now.getTime() + 12 * 3_600_000))
  })

  it('passa para a equipe quando a IA pede', async () => {
    brainImpl = async () => ok('Vou confirmar com a equipe.', true, 'prato fora do cardápio')
    const res = await handleWebhook(deps(), body({ text: 'tem lagosta?' }))
    expect(res.outcome).toBe('handoff')
    expect(sent).toEqual([
      { to: CLIENT, text: 'Vou confirmar com a equipe.' },
      { to: r.teamPhone, text: expect.stringContaining('prato fora do cardápio') },
    ])
    expect(store.conversations[0].pausedUntil).not.toBeNull()
  })

  it('avisa o cliente e a equipe quando a IA falha', async () => {
    brainImpl = async () => { throw new Error('timeout') }
    const res = await handleWebhook(deps(), body())
    expect(res).toEqual({ status: 200, outcome: 'failure' })
    expect(sent).toEqual([
      { to: CLIENT, text: FIXED.failure.pt },
      { to: r.teamPhone, text: expect.stringContaining('[Aprile]') },
    ])
    expect(store.conversations[0].pausedUntil).not.toBeNull()
  })

  it('ignora grupo e instância desconhecida', async () => {
    expect((await handleWebhook(deps(), body({ isGroup: true, chatid: '1203630@g.us' }))).outcome).toBe('ignored')
    expect((await handleWebhook(deps(), { ...body(), instanceName: 'outra' })).outcome).toBe('unknown_instance')
    expect(sent).toHaveLength(0)
  })

  it('ignora restaurante desativado', async () => {
    store.restaurants[0].restaurant.active = false
    expect((await handleWebhook(deps(), body())).outcome).toBe('unknown_instance')
    expect(sent).toHaveLength(0)
  })

  it('nunca lança, mesmo com corpo estranho', async () => {
    expect(await handleWebhook(deps(), 'lixo')).toEqual({ status: 200, outcome: 'ignored' })
  })
})
