// Tudo o que depende do formato da uazapi fica neste arquivo.
// Formato assumido pela uazapi v2; confirmar com uma captura real (fixtures/uazapi-message.json).
import type { IncomingMessage } from './types.ts'

const TEXT_TYPES = new Set(['conversation', 'extendedtextmessage', 'text'])
const MEDIA_TYPES = new Set([
  'audiomessage', 'imagemessage', 'videomessage', 'stickermessage', 'documentmessage', 'ptvmessage',
])

type Obj = Record<string, unknown>
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null
const str = (v: unknown) => (typeof v === 'string' ? v : '')

function digits(jid: string): string {
  return jid.split('@')[0].split(':')[0].replace(/\D/g, '')
}

export function parseWebhook(body: unknown): IncomingMessage | null {
  if (!isObj(body) || str(body.EventType).toLowerCase() !== 'messages' || !isObj(body.message)) return null
  const m = body.message
  const chatid = str(m.chatid)
  const externalId = str(m.messageid) || str(m.id)
  if (!chatid || !externalId) return null
  const type = str(m.messageType).toLowerCase()
  const text = str(m.text).trim()
  const kind: IncomingMessage['kind'] = TEXT_TYPES.has(type) && text
    ? 'text'
    : MEDIA_TYPES.has(type) ? 'media' : text ? 'text' : 'other'
  const ts = typeof m.messageTimestamp === 'number' ? m.messageTimestamp : Date.now()
  return {
    instance: str(body.instanceName),
    externalId,
    phone: digits(chatid),
    fromMe: m.fromMe === true,
    sentByApi: m.wasSentByApi === true,
    isGroup: m.isGroup === true || chatid.endsWith('@g.us'),
    isStatus: chatid.startsWith('status@') || chatid.endsWith('@broadcast'),
    kind,
    text: kind === 'text' ? text : '',
    senderName: str(m.senderName) || undefined,
    at: new Date(ts < 1e12 ? ts * 1000 : ts),
  }
}

export interface UazapiClient {
  sendText(to: string, text: string): Promise<void>
  sendTyping(to: string, ms: number): Promise<void>
}

export function createUazapiClient(baseUrl: string, instanceToken: string, fetchFn: typeof fetch = fetch): UazapiClient {
  const base = baseUrl.replace(/\/+$/, '')
  async function post(path: string, body: Obj) {
    const res = await fetchFn(base + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', token: instanceToken },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) throw new Error(`uazapi ${path} respondeu ${res.status}`)
  }
  return {
    sendText: (to, text) => post('/send/text', { number: to, text }),
    sendTyping: (to, ms) => post('/message/presence', { number: to, presence: 'composing', delay: ms }),
  }
}
