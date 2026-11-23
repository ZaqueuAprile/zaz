import { describe, expect, it } from 'vitest'
import { classify, FIXED, isPaused, pauseUntil, teamAlert, wantsHuman } from './rules.ts'
import type { Conversation, IncomingMessage } from './types.ts'

const msg = (over: Partial<IncomingMessage>): IncomingMessage => ({
  instance: 'i', externalId: 'x', phone: '5573999990000', fromMe: false, sentByApi: false,
  isGroup: false, isStatus: false, kind: 'text', text: 'oi', at: new Date(), ...over,
})
const conv = (pausedUntil: Date | null): Conversation =>
  ({ id: 'c', restaurantId: 'r', phone: '1', lang: null, pausedUntil })

describe('classify', () => {
  it('ignora grupo, status e eco da API', () => {
    expect(classify(msg({ isGroup: true }))).toBe('ignore')
    expect(classify(msg({ isStatus: true }))).toBe('ignore')
    expect(classify(msg({ fromMe: true, sentByApi: true }))).toBe('ignore')
  })
  it('reconhece a equipe respondendo pelo celular', () => {
    expect(classify(msg({ fromMe: true, sentByApi: false }))).toBe('team')
  })
  it('o resto é cliente', () => {
    expect(classify(msg({}))).toBe('client')
  })
})

describe('pausa', () => {
  const now = new Date('2026-11-20T12:00:00Z')
  it('isPaused', () => {
    expect(isPaused(conv(null), now)).toBe(false)
    expect(isPaused(conv(new Date(now.getTime() + 60_000)), now)).toBe(true)
    expect(isPaused(conv(new Date(now.getTime() - 60_000)), now)).toBe(false)
  })
  it('pauseUntil soma as horas', () => {
    expect(pauseUntil(now, 12).toISOString()).toBe('2026-11-21T00:00:00.000Z')
  })
})

describe('wantsHuman', () => {
  it('detecta pedido de pessoa em pt, es e en', () => {
    expect(wantsHuman('quero falar com um atendente')).toBe(true)
    expect(wantsHuman('Quero falar com alguém da equipe')).toBe(true)
    expect(wantsHuman('hablar con una persona')).toBe(true)
    expect(wantsHuman('can I talk to a human?')).toBe(true)
  })
  it('não dispara em pergunta comum', () => {
    expect(wantsHuman('qual o horário?')).toBe(false)
    expect(wantsHuman('tem opção vegana?')).toBe(false)
  })
})

describe('textos fixos', () => {
  it('alerta da equipe no formato combinado', () => {
    expect(teamAlert('5573999990000', 'pediu atendente', 'oi')).toBe(
      '[Aprile] Conversa com 5573999990000 passou para a equipe. Motivo: pediu atendente. Última mensagem: "oi"',
    )
  })
  it('mídia e falha nos três idiomas', () => {
    expect(FIXED.media.pt).toBe('Por aqui eu leio só mensagens de texto. Pode escrever a sua dúvida? Se preferir, chamo alguém da equipe.')
    expect(FIXED.failure.en).toBe("I'll get someone from the team to answer you.")
    expect(Object.keys(FIXED.media).sort()).toEqual(['en', 'es', 'pt'])
  })
})
