// Entrada da Edge Function: recebe o webhook da uazapi e entrega para handleWebhook.
import Anthropic from '@anthropic-ai/sdk'
import { ANTHROPIC_OPTIONS, askBrain } from '../_shared/bot/brain.ts'
import { handleWebhook } from '../_shared/bot/handler.ts'
import { createSupabaseStore } from '../_shared/bot/store.ts'
import { createUazapiClient } from '../_shared/bot/uazapi.ts'

const env = (k: string) => {
  const v = Deno.env.get(k)
  if (!v) throw new Error(`Variável ${k} não configurada`)
  return v
}

const store = createSupabaseStore(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'))
const anthropic = new Anthropic({ apiKey: env('ANTHROPIC_API_KEY'), ...ANTHROPIC_OPTIONS })
const model = Deno.env.get('BOT_MODEL') ?? 'claude-haiku-5-5'
const uazapiBase = env('UAZAPI_BASE_URL')
const secret = env('WEBHOOK_SECRET')

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('método não permitido', { status: 405 })
  if (new URL(req.url).searchParams.get('k') !== secret) return new Response('não autorizado', { status: 401 })
  let body: unknown = null
  try { body = await req.json() } catch { /* corpo inválido: handleWebhook devolve ignored */ }
  const result = await handleWebhook({
    store,
    uazapi: (r) => createUazapiClient(uazapiBase, r.instanceToken),
    brain: (system, messages) => askBrain(anthropic, { model, system, messages }),
    now: () => new Date(),
    sleep: (ms) => new Promise((res) => setTimeout(res, ms)),
    log: (event, data) => console.log(JSON.stringify({ event, ...data })),
  }, body)
  return Response.json({ outcome: result.outcome }, { status: result.status })
})
