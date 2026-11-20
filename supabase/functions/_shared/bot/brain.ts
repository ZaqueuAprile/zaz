import type Anthropic from '@anthropic-ai/sdk'
import type { Lang } from './types.ts'

export interface BrainReply {
  reply: string
  handoff: boolean
  reason: string
  lang: Lang
  usage: { input: number; output: number; cacheRead: number }
}

const SCHEMA = {
  type: 'object',
  properties: {
    reply: { type: 'string', description: 'Mensagem para o cliente, no idioma dele.' },
    handoff: { type: 'boolean', description: 'true quando a conversa deve passar para a equipe.' },
    reason: { type: 'string', description: 'Motivo do handoff em poucas palavras; vazio quando handoff é false.' },
    lang: { type: 'string', enum: ['pt', 'es', 'en'] },
  },
  required: ['reply', 'handoff', 'reason', 'lang'],
  additionalProperties: false,
} as const

// A Edge Function morre perto de 150 s; sem isto o SDK espera até 10 min com 2 novas tentativas.
export const ANTHROPIC_OPTIONS = { timeout: 20_000, maxRetries: 1 }

export async function askBrain(
  client: Anthropic,
  opts: { model: string; system: string; messages: Anthropic.MessageParam[] },
): Promise<BrainReply> {
  const response = await client.messages.create({
    model: opts.model,
    max_tokens: 4096, // o raciocínio adaptativo do modelo também conta aqui
    system: [{ type: 'text', text: opts.system, cache_control: { type: 'ephemeral' } }],
    messages: opts.messages,
    output_config: { effort: 'low', format: { type: 'json_schema', schema: SCHEMA } },
  })
  if (response.stop_reason !== 'end_turn') throw new Error(`IA parou com ${response.stop_reason}`)
  const text = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text')?.text ?? ''
  const data = JSON.parse(text) as Omit<BrainReply, 'usage'>
  if (typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('IA devolveu resposta vazia')
  if (!['pt', 'es', 'en'].includes(data.lang)) throw new Error(`IA devolveu idioma inválido: ${data.lang}`)
  return {
    reply: data.reply.trim(),
    handoff: data.handoff === true,
    reason: typeof data.reason === 'string' ? data.reason : '',
    lang: data.lang,
    usage: {
      input: response.usage.input_tokens,
      output: response.usage.output_tokens,
      cacheRead: response.usage.cache_read_input_tokens ?? 0,
    },
  }
}
