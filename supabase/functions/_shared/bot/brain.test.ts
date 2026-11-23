import type Anthropic from '@anthropic-ai/sdk'
import { describe, expect, it } from 'vitest'
import { askBrain } from './brain.ts'

function fakeClient(reply: { text?: string; stop?: string }) {
  const calls: Record<string, unknown>[] = []
  const client = {
    messages: {
      create: async (params: Record<string, unknown>) => {
        calls.push(params)
        return {
          id: 'msg_1', type: 'message', role: 'assistant', model: params.model,
          stop_reason: reply.stop ?? 'end_turn', stop_sequence: null,
          content: [{ type: 'text', text: reply.text ?? '' }],
          usage: { input_tokens: 120, output_tokens: 40, cache_read_input_tokens: 3000, cache_creation_input_tokens: 0 },
        }
      },
    },
  }
  return { client: client as unknown as Anthropic, calls }
}

const opts = { model: 'claude-haiku-5-5', system: 'SISTEMA', messages: [{ role: 'user' as const, content: 'abre hoje?' }] }

describe('askBrain', () => {
  it('monta a chamada com modelo, esforço baixo, cache e formato JSON', async () => {
    const { client, calls } = fakeClient({ text: '{"reply":"Abrimos às 18h","handoff":false,"reason":"","lang":"pt"}' })
    await askBrain(client, opts)
    const p = calls[0] as any
    expect(p.model).toBe('claude-haiku-5-5')
    expect(p.max_tokens).toBe(4096)
    expect(p.output_config.effort).toBe('low')
    expect(p.system).toEqual([{ type: 'text', text: 'SISTEMA', cache_control: { type: 'ephemeral' } }])
    expect(p.output_config.format.type).toBe('json_schema')
    const schema = p.output_config.format.schema
    expect(schema.required.sort()).toEqual(['handoff', 'lang', 'reason', 'reply'])
    expect(schema.properties.lang.enum).toEqual(['pt', 'es', 'en'])
    expect(p.temperature).toBeUndefined()
    expect(p.thinking).toBeUndefined()
  })

  it('devolve a resposta e o uso de tokens', async () => {
    const { client } = fakeClient({ text: '{"reply":"Abrimos às 18h","handoff":false,"reason":"","lang":"pt"}' })
    expect(await askBrain(client, opts)).toEqual({
      reply: 'Abrimos às 18h', handoff: false, reason: '', lang: 'pt',
      usage: { input: 120, output: 40, cacheRead: 3000 },
    })
  })

  it('rejeita recusa', async () => {
    const { client } = fakeClient({ text: '', stop: 'refusal' })
    await expect(askBrain(client, opts)).rejects.toThrow()
  })

  it('rejeita resposta cortada', async () => {
    const { client } = fakeClient({ text: '{"reply":"Abri', stop: 'max_tokens' })
    await expect(askBrain(client, opts)).rejects.toThrow()
  })

  it('rejeita texto que não é JSON', async () => {
    const { client } = fakeClient({ text: 'Abrimos às 18h' })
    await expect(askBrain(client, opts)).rejects.toThrow()
  })

  it('rejeita resposta vazia', async () => {
    const { client } = fakeClient({ text: '{"reply":"","handoff":false,"reason":"","lang":"pt"}' })
    await expect(askBrain(client, opts)).rejects.toThrow()
  })
})

describe('ANTHROPIC_OPTIONS', () => {
  it('limita o tempo da IA para caber na Edge Function', async () => {
    const { ANTHROPIC_OPTIONS } = await import('./brain.ts')
    expect(ANTHROPIC_OPTIONS).toEqual({ timeout: 20_000, maxRetries: 1 })
  })
})
