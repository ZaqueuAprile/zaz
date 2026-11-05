import { useId, useState, type FormEvent } from 'react'
import { TRATAMENTOS, WHATSAPP, type IdTratamento } from '../dados'

const OPCOES = [...TRATAMENTOS.map((t) => ({ id: t.id as string, nome: t.nome })), { id: 'nao-sei', nome: 'Ainda não sei' }]
const PERIODOS = ['Manhã', 'Tarde', 'Tanto faz']

const entrada =
  'block w-full min-h-12 border-0 border-b border-white/35 bg-transparent px-0 py-2 text-lg text-white placeholder:text-white/50 transition-colors hover:border-white focus:border-white focus:outline-none focus-visible:outline-none aria-invalid:border-[#ffe1d6]'

// Opção em pílula: um rádio de verdade, escondido, com o rótulo desenhado.
function Pilula({ nome, valor, texto, marcado, aoMarcar }: { nome: string; valor: string; texto: string; marcado: boolean; aoMarcar: (v: string) => void }) {
  return (
    <label className="cursor-pointer">
      <input type="radio" name={nome} value={valor} checked={marcado} onChange={() => aoMarcar(valor)} className="peer sr-only" />
      <span className="inline-flex min-h-11 items-center rounded-full border border-white/40 px-5 text-[0.95rem] text-white transition-colors duration-300 peer-checked:border-creme peer-checked:bg-creme peer-checked:text-coral-escuro peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white hover:border-white">
        {texto}
      </span>
    </label>
  )
}

export function Agendar({ interesse, setInteresse }: { interesse: IdTratamento | 'nao-sei' | ''; setInteresse: (v: IdTratamento | 'nao-sei') => void }) {
  const id = useId()
  const [nome, setNome] = useState('')
  const [periodo, setPeriodo] = useState('Tanto faz')
  const [obs, setObs] = useState('')
  const [erroNome, setErroNome] = useState('')
  const [status, setStatus] = useState<{ texto: string; link?: string; mensagem?: string } | null>(null)

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (nome.trim().length < 2) {
      setErroNome('Informe o seu nome.')
      e.currentTarget.querySelector<HTMLInputElement>('[name="nome"]')?.focus()
      setStatus(null)
      return
    }
    setErroNome('')
    const assunto = OPCOES.find((o) => o.id === interesse)?.nome ?? 'Ainda não sei'
    const mensagem = [
      'Olá! Gostaria de agendar uma avaliação na Clínica Coral.',
      '',
      `*Nome:* ${nome.trim()}`,
      `*Interesse:* ${assunto}`,
      `*Melhor período:* ${periodo}`,
      ...(obs.trim() ? [`*Observações:* ${obs.trim()}`] : []),
    ].join('\n')

    if (!WHATSAPP) {
      setStatus({ texto: 'Pedido pronto. Este é o texto que seguiria para o WhatsApp da clínica:', mensagem })
      return
    }
    const link = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`
    window.open(link, '_blank', 'noopener')
    setStatus({ texto: 'Abrimos o WhatsApp com o seu pedido. Toque em enviar para a clínica receber.', link })
  }

  return (
    <form onSubmit={enviar} noValidate className="grid gap-10">
      <div>
        <label htmlFor={`${id}-nome`} className="text-sm text-white/85">
          Nome
        </label>
        <input
          id={`${id}-nome`}
          name="nome"
          type="text"
          autoComplete="name"
          value={nome}
          onChange={(e) => {
            setNome(e.target.value)
            if (erroNome && e.target.value.trim().length >= 2) setErroNome('')
          }}
          aria-invalid={erroNome ? true : undefined}
          aria-describedby={erroNome ? `${id}-nome-erro` : undefined}
          className={entrada}
        />
        {erroNome && (
          <p id={`${id}-nome-erro`} className="mt-2 text-sm font-medium text-[#ffe1d6]">
            {erroNome}
          </p>
        )}
      </div>

      <fieldset>
        <legend className="text-sm text-white/85">O que você procura?</legend>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {OPCOES.map((o) => (
            <Pilula
              key={o.id}
              nome="interesse"
              valor={o.id}
              texto={o.nome}
              marcado={(interesse || 'nao-sei') === o.id}
              aoMarcar={(v) => setInteresse(v as IdTratamento | 'nao-sei')}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm text-white/85">Melhor período</legend>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {PERIODOS.map((p) => (
            <Pilula key={p} nome="periodo" valor={p} texto={p} marcado={periodo === p} aoMarcar={setPeriodo} />
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={`${id}-obs`} className="text-sm text-white/85">
          Quer contar algo antes? (opcional)
        </label>
        <textarea id={`${id}-obs`} rows={2} value={obs} onChange={(e) => setObs(e.target.value)} className={`${entrada} resize-y`} />
      </div>

      <div className="flex flex-col items-start gap-5">
        <button
          type="submit"
          className="min-h-14 cursor-pointer rounded-full bg-tinta px-9 text-[0.95rem] font-medium text-white transition-colors duration-300 hover:bg-noite active:translate-y-px"
        >
          Enviar pelo WhatsApp
        </button>
        <div role="status" aria-live="polite" className="text-white/90">
          {status?.texto}
          {status?.link && (
            <>
              {' '}
              <a className="underline underline-offset-4" href={status.link} target="_blank" rel="noopener">
                Se o WhatsApp não abriu, toque aqui.
              </a>
            </>
          )}
          {status?.mensagem && (
            <pre className="mt-4 rounded-xl bg-black/15 p-5 font-sans text-sm whitespace-pre-wrap text-white">{status.mensagem}</pre>
          )}
        </div>
      </div>
    </form>
  )
}
