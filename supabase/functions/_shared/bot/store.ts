import { createClient } from '@supabase/supabase-js'
import type { BrainReply } from './brain.ts'
import { validateKnowledge, type Knowledge } from './knowledge.ts'
import type { Conversation, Lang, Restaurant, StoredMessage } from './types.ts'

export type SaveInput = StoredMessage & { externalId?: string; tokens?: BrainReply['usage'] }

export interface Store {
  restaurantByInstance(instance: string): Promise<{ restaurant: Restaurant; knowledge: Knowledge } | null>
  conversation(restaurantId: string, phone: string): Promise<Conversation>
  saveMessage(convId: string, m: SaveInput): Promise<'saved' | 'duplicate'>
  history(convId: string, limit: number): Promise<StoredMessage[]>
  setPause(convId: string, until: Date | null): Promise<void>
  setLang(convId: string, lang: Lang): Promise<void>
}

export class FakeStore implements Store {
  restaurants: { restaurant: Restaurant; knowledge: Knowledge }[] = []
  conversations: Conversation[] = []
  messages: (SaveInput & { convId: string })[] = []

  seed(restaurant: Restaurant, knowledge: Knowledge) {
    this.restaurants.push({ restaurant, knowledge })
  }
  async restaurantByInstance(instance: string) {
    return this.restaurants.find((x) => x.restaurant.instance === instance) ?? null
  }
  async conversation(restaurantId: string, phone: string) {
    let c = this.conversations.find((x) => x.restaurantId === restaurantId && x.phone === phone)
    if (!c) {
      c = { id: `c${this.conversations.length + 1}`, restaurantId, phone, lang: null, pausedUntil: null }
      this.conversations.push(c)
    }
    return { ...c }
  }
  async saveMessage(convId: string, m: SaveInput) {
    if (m.externalId && this.messages.some((x) => x.externalId === m.externalId)) return 'duplicate' as const
    this.messages.push({ ...m, convId })
    return 'saved' as const
  }
  async history(convId: string, limit: number) {
    return this.messages.filter((x) => x.convId === convId)
      .sort((a, b) => a.at.getTime() - b.at.getTime())
      .slice(-limit)
      .map(({ direction, text, at, externalId }) => ({ direction, text, at, externalId }))
  }
  async setPause(convId: string, until: Date | null) {
    this.conversations.find((x) => x.id === convId)!.pausedUntil = until
  }
  async setLang(convId: string, lang: Lang) {
    this.conversations.find((x) => x.id === convId)!.lang = lang
  }
}

export function createSupabaseStore(url: string, serviceKey: string): Store {
  const db = createClient(url, serviceKey, { auth: { persistSession: false } })
  const fail = (what: string, e: { message: string } | null) => {
    if (e) throw new Error(`Supabase ${what}: ${e.message}`)
  }
  const toConv = (row: Record<string, unknown>): Conversation => ({
    id: row.id as string,
    restaurantId: row.restaurant_id as string,
    phone: row.phone as string,
    lang: (row.lang as Lang | null) ?? null,
    pausedUntil: row.paused_until ? new Date(row.paused_until as string) : null,
  })
  return {
    async restaurantByInstance(instance) {
      const { data, error } = await db.from('restaurants').select('*, knowledge(data)').eq('instance', instance).maybeSingle()
      fail('restaurantByInstance', error)
      if (!data) return null
      const k = Array.isArray(data.knowledge) ? data.knowledge[0] : data.knowledge
      if (!k) return null
      return {
        restaurant: {
          id: data.id, name: data.name, instance: data.instance, instanceToken: data.instance_token,
          teamPhone: data.team_phone, defaultLang: data.default_lang, handoffHours: data.handoff_hours, active: data.active,
          timezone: data.timezone,
        },
        knowledge: validateKnowledge(k.data),
      }
    },
    async conversation(restaurantId, phone) {
      const { data, error } = await db.from('conversations')
        .upsert({ restaurant_id: restaurantId, phone }, { onConflict: 'restaurant_id,phone', ignoreDuplicates: false })
        .select().single()
      fail('conversation', error)
      return toConv(data)
    },
    async saveMessage(convId, m) {
      const { error } = await db.from('messages').insert({
        conversation_id: convId, direction: m.direction, text: m.text, external_id: m.externalId ?? null,
        created_at: m.at.toISOString(),
        input_tokens: m.tokens?.input ?? null, output_tokens: m.tokens?.output ?? null, cache_read_tokens: m.tokens?.cacheRead ?? null,
      })
      if (error?.code === '23505') return 'duplicate'
      fail('saveMessage', error)
      return 'saved'
    },
    async history(convId, limit) {
      const { data, error } = await db.from('messages').select('direction, text, created_at, external_id')
        .eq('conversation_id', convId).order('created_at', { ascending: false }).limit(limit)
      fail('history', error)
      return (data ?? []).reverse().map((r) => ({ direction: r.direction, text: r.text, at: new Date(r.created_at), externalId: r.external_id ?? undefined }))
    },
    async setPause(convId, until) {
      const { error } = await db.from('conversations').update({ paused_until: until?.toISOString() ?? null }).eq('id', convId)
      fail('setPause', error)
    },
    async setLang(convId, lang) {
      const { error } = await db.from('conversations').update({ lang }).eq('id', convId)
      fail('setLang', error)
    },
  }
}
