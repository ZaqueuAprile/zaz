import { useId, useRef, useState, type FormEvent } from 'react'
import { HORARIOS, WHATSAPP } from '../dados'

type Campo = 'nome' | 'contato' | 'data' | 'hora' | 'pessoas'
type Valores = Record<Campo | 'obs', string>
type Erros = Partial<Record<Campo, string>>

const hojeIso = () => {
  const agora = new Date()
  return new Date(agora.getTime() - agora.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

const faixaDe = (dataIso: string) => (dataIso ? HORARIOS[new Date(dataIso + 'T12:00:00').getDay()] : undefined)
const minutos = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5))

// Devolve a mensagem de erro do campo, ou null quando ele está certo.
function validar(campo: Campo, v: Valores): string | null {
  const hoje = hojeIso()
  switch (campo) {
    case 'nome':
      return v.nome.trim().length >= 2 ? null : 'Informe o seu nome.'
    case 'contato':
      return v.contato.replace(/\D/g, '').length >= 10 ? null : 'Informe um telefone com DDD.'
    case 'data':
      if (v.data === '' || v.data < hoje) return 'Escolha uma data a partir de hoje.'
      return faixaDe(v.data) === null ? 'A casa fecha às terças. Escolha outra data.' : null
    case 'hora': {
      if (v.hora === '') return 'Escolha um horário.'
      const faixa = faixaDe(v.data)
      if (faixa === undefined) return null
      if (faixa === null) return 'A casa fecha às terças. Escolha outra data.'
      // A última mesa é marcada até 1h antes de fechar.
      const ultima = minutos(faixa[1]) - 60
      if (minutos(v.hora) >= minutos(faixa[0]) && minutos(v.hora) <= ultima) return null
      const ate = String(Math.floor(ultima / 60)).padStart(2, '0') + ':00'
      return `Neste dia a casa recebe das ${faixa[0]} às ${faixa[1]}. Escolha um horário entre ${faixa[0]} e ${ate}.`
    }
    case 'pessoas': {
      const n = Number(v.pessoas)
      return n >= 1 && n <= 12 ? null : 'Informe de 1 a 12 pessoas. Para grupos maiores, fale com a casa.'
    }
  }
}

const CAMPOS: Campo[] = ['nome', 'contato', 'data', 'hora', 'pessoas']

const ler = (form: HTMLFormElement): Valores => {
  const f = new FormData(form)
  const valor = (k: string) => String(f.get(k) ?? '')
  return {
    nome: valor('nome'),
    contato: valor('contato'),
    data: valor('data'),
    hora: valor('hora'),
    pessoas: valor('pessoas'),
    obs: valor('obs'),
  }
}

const entrada =
  'block w-full min-h-12 border-0 border-b border-tinta/40 bg-transparent px-0 py-2 text-base text-tinta transition-colors placeholder:text-tinta-2/60 hover:border-tinta focus:border-tinta focus:outline-none focus-visible:outline-none aria-invalid:border-erro'

export function Reserva() {
  const id = useId()
  const form = useRef<HTMLFormElement>(null)
  const [erros, setErros] = useState<Erros>({})
  const [status, setStatus] = useState<{ tipo: 'ok' | 'erro'; texto: string; whatsapp?: string } | null>(null)

  const conferir = (campo: Campo) => {
    if (!form.current) return
    const erro = validar(campo, ler(form.current))
    setErros((atual) => ({ ...atual, [campo]: erro ?? undefined }))
  }

  // Corrige o erro enquanto a pessoa digita, mas só aponta erro novo ao sair do campo.
  const aoDigitar = (campo: Campo) => {
    if (erros[campo]) conferir(campo)
    if (campo === 'data' && form.current && ler(form.current).hora !== '') conferir('hora')
  }

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    const el = evento.currentTarget
    const v = ler(el)
    const novos: Erros = {}
    for (const campo of CAMPOS) {
      const erro = validar(campo, v)
      if (erro) novos[campo] = erro
    }
    setErros(novos)

    const primeiro = CAMPOS.find((c) => novos[c])
    if (primeiro) {
      el.querySelector<HTMLInputElement>(`[name="${primeiro}"]`)?.focus()
      setStatus({ tipo: 'erro', texto: 'Corrija os campos destacados para enviar o pedido.' })
      return
    }

    const data = new Date(v.data + 'T12:00:00').toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
    const resumo = `${data}, às ${v.hora}, para ${v.pessoas} ${Number(v.pessoas) === 1 ? 'pessoa' : 'pessoas'}`
    const mensagem =
      `Olá, sou ${v.nome.trim()}. Gostaria de reservar uma mesa no Bossa Cucina: ${resumo}.` +
      (v.obs.trim() ? ` Observações: ${v.obs.trim()}.` : '') +
      ` Meu contato: ${v.contato.trim()}.`

    setStatus({
      tipo: 'ok',
      texto: `Pedido recebido para ${resumo}. A casa confirma pelo telefone informado.`,
      whatsapp: WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}` : undefined,
    })
    el.reset()
  }

  const rotuloDe = (campo: Campo | 'obs', texto: string) => (
    <label htmlFor={`${id}-${campo}`} className="rotulo text-tinta-2">
      {texto}
    </label>
  )

  const erroDe = (campo: Campo) =>
    erros[campo] ? (
      <p id={`${id}-${campo}-erro`} className="mt-2 text-sm text-erro">
        {erros[campo]}
      </p>
    ) : null

  const ligacoes = (campo: Campo) => ({
    id: `${id}-${campo}`,
    name: campo,
    'aria-invalid': erros[campo] ? true : undefined,
    'aria-describedby': erros[campo] ? `${id}-${campo}-erro` : undefined,
    onBlur: () => conferir(campo),
    onInput: () => aoDigitar(campo),
    className: entrada,
  })

  return (
    <form ref={form} onSubmit={enviar} noValidate className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
      <div className="sm:col-span-2">
        {rotuloDe('nome', 'Nome')}
        <input type="text" autoComplete="name" {...ligacoes('nome')} />
        {erroDe('nome')}
      </div>
      <div className="sm:col-span-2">
        {rotuloDe('contato', 'Telefone com DDD')}
        <input type="tel" inputMode="tel" autoComplete="tel" {...ligacoes('contato')} />
        {erroDe('contato')}
      </div>
      <div>
        {rotuloDe('data', 'Data')}
        <input type="date" min={hojeIso()} {...ligacoes('data')} />
        {erroDe('data')}
      </div>
      <div>
        {rotuloDe('hora', 'Horário')}
        <input type="time" step={900} {...ligacoes('hora')} />
        {erroDe('hora')}
      </div>
      <div className="sm:col-span-2">
        {rotuloDe('pessoas', 'Pessoas')}
        <input type="number" min={1} max={12} inputMode="numeric" defaultValue={2} {...ligacoes('pessoas')} />
        {erroDe('pessoas')}
      </div>
      <div className="sm:col-span-2">
        {rotuloDe('obs', 'Observações (opcional)')}
        <textarea id={`${id}-obs`} name="obs" rows={2} className={`${entrada} resize-y`} />
      </div>

      <div className="flex flex-col items-start gap-4 sm:col-span-2">
        <button
          type="submit"
          className="min-h-12 cursor-pointer bg-tinta px-8 py-3 font-medium text-cal transition-colors hover:bg-oliva active:translate-y-px"
        >
          Enviar pedido de reserva
        </button>
        <p role="status" aria-live="polite" className={status?.tipo === 'erro' ? 'text-erro' : 'text-tinta'}>
          {status?.texto}
          {status?.whatsapp && (
            <>
              {' '}
              <a className="sublinhado font-medium" href={status.whatsapp} target="_blank" rel="noopener">
                Enviar pelo WhatsApp
              </a>
            </>
          )}
        </p>
      </div>
    </form>
  )
}
