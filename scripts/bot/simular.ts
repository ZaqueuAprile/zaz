// Conversa no terminal com o bot, usando a IA de verdade e os dados de um restaurante, sem WhatsApp.
// Uso: ANTHROPIC_API_KEY=... npx tsx scripts/bot/simular.ts bot/restaurantes/exemplo.json "Nome do restaurante"
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync } from 'node:fs'
import { createInterface } from 'node:readline/promises'
import { askBrain } from '../../supabase/functions/_shared/bot/brain.ts'
import { buildMessages, buildSystemPrompt, validateKnowledge } from '../../supabase/functions/_shared/bot/knowledge.ts'
import type { StoredMessage } from '../../supabase/functions/_shared/bot/types.ts'

const [file, name = 'Restaurante Exemplo'] = process.argv.slice(2)
if (!file) {
  console.error('Uso: npx tsx scripts/bot/simular.ts <dados.json> ["Nome do restaurante"]')
  process.exit(1)
}
const knowledge = validateKnowledge(JSON.parse(readFileSync(file, 'utf8')))
const system = buildSystemPrompt({
  id: 'sim', name, instance: 'sim', instanceToken: '', teamPhone: '', defaultLang: 'pt', handoffHours: 12, active: true,
}, knowledge)
const client = new Anthropic()
const model = process.env.BOT_MODEL ?? 'claude-haiku-5-5'
const history: StoredMessage[] = []
const rl = createInterface({ input: process.stdin, output: process.stdout })
console.log(`Simulando ${name} com ${model}. Escreva como cliente; linha vazia encerra.\n`)
for (;;) {
  const text = (await rl.question('cliente> ')).trim()
  if (!text) break
  const r = await askBrain(client, { model, system, messages: buildMessages(history, text) })
  history.push({ direction: 'client', text, at: new Date() }, { direction: 'bot', text: r.reply, at: new Date() })
  console.log(`bot> ${r.reply}`)
  console.log(`     [idioma ${r.lang} · equipe ${r.handoff ? 'SIM: ' + r.reason : 'não'} · tokens ${r.usage.input}+${r.usage.output}, cache ${r.usage.cacheRead}]\n`)
}
rl.close()
