import { describe, expect, it } from 'vitest'
import exemplo from '../../../../bot/restaurantes/exemplo.json'
import { validateKnowledge } from './knowledge.ts'
import { FakeStore } from './store.ts'
import type { Restaurant } from './types.ts'

const r: Restaurant = {
  id: 'r1', name: 'Restaurante Exemplo', instance: 'rest-centro', instanceToken: 't', teamPhone: '557300000000',
  defaultLang: 'pt', handoffHours: 12, active: true,
}

describe('FakeStore', () => {
  it('acha o restaurante pela instância', async () => {
    const s = new FakeStore()
    s.seed(r, validateKnowledge(exemplo))
    expect((await s.restaurantByInstance('rest-centro'))?.restaurant.id).toBe('r1')
    expect(await s.restaurantByInstance('outra')).toBeNull()
  })

  it('cria a conversa uma vez e devolve a mesma depois', async () => {
    const s = new FakeStore()
    const a = await s.conversation('r1', '5573999990000')
    const b = await s.conversation('r1', '5573999990000')
    expect(b.id).toBe(a.id)
    expect(a.pausedUntil).toBeNull()
  })

  it('não salva duas vezes a mesma mensagem externa', async () => {
    const s = new FakeStore()
    const c = await s.conversation('r1', '1')
    const m = { direction: 'client' as const, text: 'oi', at: new Date(), externalId: 'abc' }
    expect(await s.saveMessage(c.id, m)).toBe('saved')
    expect(await s.saveMessage(c.id, m)).toBe('duplicate')
  })

  it('devolve o histórico mais recente em ordem', async () => {
    const s = new FakeStore()
    const c = await s.conversation('r1', '1')
    for (let i = 0; i < 20; i++) await s.saveMessage(c.id, { direction: 'client', text: `m${i}`, at: new Date(1_000 * i) })
    const h = await s.history(c.id, 12)
    expect(h).toHaveLength(12)
    expect(h[0].text).toBe('m8')
    expect(h.at(-1)!.text).toBe('m19')
  })

  it('guarda pausa e idioma', async () => {
    const s = new FakeStore()
    const c = await s.conversation('r1', '1')
    const until = new Date('2026-11-21T00:00:00Z')
    await s.setPause(c.id, until)
    await s.setLang(c.id, 'es')
    const again = await s.conversation('r1', '1')
    expect(again.pausedUntil).toEqual(until)
    expect(again.lang).toBe('es')
  })
})
