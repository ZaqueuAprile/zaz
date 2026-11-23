import { describe, expect, it } from 'vitest'
import fixture from './fixtures/uazapi-message.json'
import { createUazapiClient, parseWebhook } from './uazapi.ts'

describe('parseWebhook', () => {
  it('lê uma mensagem de texto do cliente', () => {
    const m = parseWebhook(fixture.text)!
    expect(m.kind).toBe('text')
    expect(m.text).toBe('Vocês abrem hoje à noite?')
    expect(m.fromMe).toBe(false)
    expect(m.phone).toBe('5573999990000')
    expect(m.instance).toBe('rest-centro')
    expect(m.externalId).toBe('3EB0A1B2C3D4E5F6')
    expect(m.at).toBeInstanceOf(Date)
  })

  it('marca mensagem enviada pelo celular da casa', () => {
    const m = parseWebhook(fixture.fromPhone)!
    expect(m.fromMe).toBe(true)
    expect(m.sentByApi).toBe(false)
    expect(m.phone).toBe('5573999990000')
  })

  it('trata áudio como mídia sem texto', () => {
    const m = parseWebhook(fixture.audio)!
    expect(m.kind).toBe('media')
    expect(m.text).toBe('')
  })

  it('devolve null para o que não é mensagem', () => {
    expect(parseWebhook({})).toBeNull()
    expect(parseWebhook({ EventType: 'connection' })).toBeNull()
    expect(parseWebhook(null)).toBeNull()
  })
})

describe('createUazapiClient', () => {
  it('envia texto com o token da instância', async () => {
    const calls: { url: string; init: RequestInit }[] = []
    const fakeFetch = (async (url: string, init: RequestInit) => {
      calls.push({ url, init })
      return new Response('{}', { status: 200 })
    }) as unknown as typeof fetch
    await createUazapiClient('https://x.uazapi.com/', 'tok', fakeFetch).sendText('5573999990000', 'oi')
    expect(calls).toHaveLength(1)
    expect(calls[0].url).toBe('https://x.uazapi.com/send/text')
    expect((calls[0].init.headers as Record<string, string>).token).toBe('tok')
    expect(JSON.parse(calls[0].init.body as string)).toEqual({ number: '5573999990000', text: 'oi' })
  })

  it('falha quando a uazapi responde erro', async () => {
    const fakeFetch = (async () => new Response('x', { status: 500 })) as unknown as typeof fetch
    await expect(createUazapiClient('https://x.uazapi.com', 'tok', fakeFetch).sendText('1', 'oi')).rejects.toThrow()
  })
})

describe('timeout da uazapi', () => {
  it('envia com sinal de cancelamento', async () => {
    let signal: AbortSignal | undefined
    const fakeFetch = (async (_u: string, init: RequestInit) => {
      signal = init.signal ?? undefined
      return new Response('{}', { status: 200 })
    }) as unknown as typeof fetch
    await createUazapiClient('https://x.uazapi.com', 'tok', fakeFetch).sendText('1', 'oi')
    expect(signal).toBeInstanceOf(AbortSignal)
  })
})

describe('outros tipos', () => {
  it('reação vira kind other', () => {
    const m = parseWebhook({ ...fixture.text, message: { ...fixture.text.message, messageType: 'ReactionMessage', text: '' } })!
    expect(m.kind).toBe('other')
  })
})
