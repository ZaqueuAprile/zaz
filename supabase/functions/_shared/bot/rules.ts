import type { Conversation, IncomingMessage, Lang } from './types.ts'

export function classify(msg: IncomingMessage): 'ignore' | 'team' | 'client' {
  if (msg.isGroup || msg.isStatus || msg.sentByApi) return 'ignore'
  return msg.fromMe ? 'team' : 'client'
}

export function isPaused(conv: Conversation, now: Date): boolean {
  return conv.pausedUntil !== null && conv.pausedUntil.getTime() > now.getTime()
}

export function pauseUntil(now: Date, hours: number): Date {
  return new Date(now.getTime() + hours * 3_600_000)
}

const normalize = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const HUMAN = [
  /\batendente\b/, /\b(falar|conversar) com (uma |um |alguem|a equipe|o gerente|o dono|uma pessoa)/, /\bpessoa de verdade\b/,
  /\b(hablar|habla) con (una persona|alguien|un humano|el encargado)/, /\bagente humano\b/,
  /\b(talk|speak) to (a |an )?(human|person|someone|real person|manager|staff)\b/, /\breal person\b/,
]

export function wantsHuman(text: string): boolean {
  const t = normalize(text)
  return HUMAN.some((re) => re.test(t))
}

export const FIXED: Record<'media' | 'failure', Record<Lang, string>> = {
  media: {
    pt: 'Por aqui eu leio só mensagens de texto. Pode escrever a sua dúvida? Se preferir, chamo alguém da equipe.',
    es: 'Por aquí solo leo mensajes de texto. ¿Puedes escribir tu pregunta? Si prefieres, llamo a alguien del equipo.',
    en: 'I can only read text messages here. Could you type your question? If you prefer, I can call someone from the team.',
  },
  failure: {
    pt: 'Já vou chamar alguém da equipe para te responder.',
    es: 'Ya llamo a alguien del equipo para responderte.',
    en: "I'll get someone from the team to answer you.",
  },
}

export function teamAlert(phone: string, reason: string, lastText: string): string {
  return `[Aprile] Conversa com ${phone} passou para a equipe. Motivo: ${reason}. Última mensagem: "${lastText}"`
}
