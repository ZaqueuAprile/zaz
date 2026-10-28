import { useId, useRef, useState, type FormEvent } from 'react'
import { WHATSAPP } from '../dados'

type Campo = 'nome' | 'entrada' | 'saida' | 'adultos' | 'criancas'
type Valores = Record<Campo | 'obs', string>
type Erros = Partial<Record<Campo, string>>

const CAMPOS: Campo[] = ['nome', 'entrada', 'saida', 'adultos', 'criancas']

const hojeIso = () => {
  const agora = new Date()
  return new Date(agora.getTime() - agora.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

const dia = (iso: string) => new Date(iso + 'T12:00:00')
const noites = (de: string, ate: string) => Math.round((dia(ate).getTime() - dia(de).getTime()) / 86400000)
const porExtenso = (iso: string) =>
  dia(iso).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`

function validar(campo: Campo, v: Valores): string | null {
  switch (campo) {
    case 'nome':
      return v.nome.trim().length >= 2 ? null : 'Informe o seu nome.'
    case 'entrada':
      return v.entrada !== '' && v.entrada >= hojeIso() ? null : 'Escolha a data de chegada, a partir de hoje.'
    case 'saida':
      if (v.saida === '') return 'Escolha a data de saída.'
      if (v.entrada !== '' && noites(v.entrada, v.saida) < 1) return 'A saída precisa ser depois da chegada.'
      return null
    case 'adultos': {
      const n = Number(v.adultos)
      return Number.isInteger(n) && n >= 1 && n <= 10 ? null : 'Informe de 1 a 10 adultos.'
    }
    case 'criancas': {
      const n = Number(v.criancas || 0)
      return Number.isInteger(n) && n >= 0 && n <= 10 ? null : 'Informe de 0 a 10 crianças.'
    }
  }
}

const ler = (form: HTMLFormElement): Valores => {
  const f = new FormData(form)
  const valor = (k: string) => String(f.get(k) ?? '')
  return {
    nome: valor('nome'),
    entrada: valor('entrada'),
    saida: valor('saida'),
    adultos: valor('adultos'),
    criancas: valor('criancas'),
    obs: valor('obs'),
  }
}

const entrada =
  'block w-full min-h-12 border-0 border-b border-tinta/30 bg-transparent px-0 py-2 text-lg text-tinta transition-colors hover:border-tinta focus:border-tinta focus:outline-none focus-visible:outline-none aria-invalid:border-erro'

export function Reserva() {
  const id = useId()
  const form = useRef<HTMLFormElement>(null)
  const [erros, setErros] = useState<Erros>({})
  const [status, setStatus] = useState<{ tipo: 'ok' | 'erro'; texto: string; link?: string; mensagem?: string } | null>(
    null,
  )

  const conferir = (campo: Campo) => {
    if (!form.current) return
    const erro = validar(campo, ler(form.current))
    setErros((atual) => ({ ...atual, [campo]: erro ?? undefined }))
  }

  // Corrige o erro enquanto a pessoa digita, mas só aponta erro novo ao sair do campo.
  const aoDigitar = (campo: Campo) => {
    if (erros[campo]) conferir(campo)
    if (campo === 'entrada' && form.current && ler(form.current).saida !== '') conferir('saida')
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

    const adultos = Number(v.adultos)
    const criancas = Number(v.criancas || 0)
    const hospedes =
      plural(adultos, 'adulto', 'adultos') + (criancas ? ` e ${plural(criancas, 'criança', 'crianças')}` : '')
    const estadia = plural(noites(v.entrada, v.saida), 'noite', 'noites')

    const mensagem = [
      'Olá! Gostaria de reservar uma estadia na Gaivota.',
      '',
      `*Nome:* ${v.nome.trim()}`,
      `*Chegada:* ${porExtenso(v.entrada)}`,
      `*Saída:* ${porExtenso(v.saida)} (${estadia})`,
      `*Hóspedes:* ${hospedes}`,
      ...(v.obs.trim() ? [`*Observações:* ${v.obs.trim()}`] : []),
    ].join('\n')

    if (!WHATSAPP) {
      setStatus({ tipo: 'ok', texto: 'Pedido pronto. Este é o texto que seguiria para o WhatsApp da pousada:', mensagem })
      return
    }

    // O WhatsApp abre com a mensagem pronta; a pessoa só precisa tocar em enviar.
    const link = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`
    window.open(link, '_blank', 'noopener')
    setStatus({
      tipo: 'ok',
      texto: `Abrimos o WhatsApp com o seu pedido: ${estadia}, ${hospedes}. Toque em enviar para a pousada receber.`,
      link,
    })
    el.reset()
  }

  const rotulo = (campo: Campo | 'obs', texto: string) => (
    <label htmlFor={`${id}-${campo}`} className="text-sm text-tinta-2">
      {texto}
    </label>
  )

  const erro = (campo: Campo) =>
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
    <form ref={form} onSubmit={enviar} noValidate className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
      <div className="sm:col-span-2">
        {rotulo('nome', 'Nome')}
        <input type="text" autoComplete="name" {...ligacoes('nome')} />
        {erro('nome')}
      </div>
      <div>
        {rotulo('entrada', 'Chegada')}
        <input type="date" min={hojeIso()} {...ligacoes('entrada')} />
        {erro('entrada')}
      </div>
      <div>
        {rotulo('saida', 'Saída')}
        <input type="date" min={hojeIso()} {...ligacoes('saida')} />
        {erro('saida')}
      </div>
      <div>
        {rotulo('adultos', 'Adultos')}
        <input type="number" min={1} max={10} inputMode="numeric" defaultValue={2} {...ligacoes('adultos')} />
        {erro('adultos')}
      </div>
      <div>
        {rotulo('criancas', 'Crianças')}
        <input type="number" min={0} max={10} inputMode="numeric" defaultValue={0} {...ligacoes('criancas')} />
        {erro('criancas')}
      </div>
      <div className="sm:col-span-2">
        {rotulo('obs', 'Observações (opcional)')}
        <textarea id={`${id}-obs`} name="obs" rows={2} className={`${entrada} resize-y`} />
      </div>

      <div className="flex flex-col items-start gap-5 sm:col-span-2">
        <button
          type="submit"
          className="min-h-14 cursor-pointer rounded-md bg-mar px-9 py-4 text-sm tracking-[0.14em] text-white uppercase transition-colors duration-300 hover:bg-terracota active:translate-y-px"
        >
          Enviar pelo WhatsApp
        </button>
        <div role="status" aria-live="polite" className={status?.tipo === 'erro' ? 'text-erro' : 'text-tinta'}>
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
            <pre className="mt-4 rounded-md bg-areia-2 p-5 font-sans text-sm whitespace-pre-wrap">{status.mensagem}</pre>
          )}
        </div>
      </div>
    </form>
  )
}
