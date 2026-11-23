export type Lang = 'pt' | 'es' | 'en'

export interface IncomingMessage {
  instance: string
  externalId: string
  phone: string
  fromMe: boolean
  sentByApi: boolean
  isGroup: boolean
  isStatus: boolean
  kind: 'text' | 'media' | 'other'
  text: string
  senderName?: string
  at: Date
}

export interface Restaurant {
  id: string
  name: string
  instance: string
  instanceToken: string
  teamPhone: string
  defaultLang: Lang
  handoffHours: number
  active: boolean
  timezone: string
}

export type Direction = 'client' | 'bot' | 'team'

export interface StoredMessage {
  direction: Direction
  text: string
  at: Date
  externalId?: string
}

export interface Conversation {
  id: string
  restaurantId: string
  phone: string
  lang: Lang | null
  pausedUntil: Date | null
}
