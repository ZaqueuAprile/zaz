// Sobe (ou atualiza) um restaurante e os dados do bot no Supabase.
// Uso: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/bot/carregar-dados.ts <dados.json> \
//        --name "Nome" --instance <instancia-uazapi> --token <token-da-instancia> --team <telefone-da-equipe> [--cnpj ...] [--lang pt]
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import { validateKnowledge } from '../../supabase/functions/_shared/bot/knowledge.ts'

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    name: { type: 'string' }, instance: { type: 'string' }, token: { type: 'string' },
    team: { type: 'string' }, cnpj: { type: 'string' }, lang: { type: 'string', default: 'pt' },
  },
})
const file = positionals[0]
const missing = (['name', 'instance', 'token', 'team'] as const).filter((k) => !values[k])
if (!file || missing.length) {
  console.error(`Faltando: ${[!file && 'arquivo', ...missing].filter(Boolean).join(', ')}`)
  process.exit(1)
}
const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}
const data = validateKnowledge(JSON.parse(readFileSync(file, 'utf8')))
const db = createClient(url, key, { auth: { persistSession: false } })
const { data: rest, error } = await db.from('restaurants').upsert({
  name: values.name, instance: values.instance, instance_token: values.token,
  team_phone: values.team!.replace(/\D/g, ''), cnpj: values.cnpj ?? null, default_lang: values.lang,
}, { onConflict: 'instance' }).select('id').single()
if (error) throw error
const { error: e2 } = await db.from('knowledge').upsert({ restaurant_id: rest.id, data, published_at: new Date().toISOString() })
if (e2) throw e2
console.log(`OK: ${values.name} (${rest.id}) com ${data.menu.length} pratos.`)
