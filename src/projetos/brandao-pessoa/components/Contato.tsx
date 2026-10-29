import { useId, useRef, useState, type FormEvent } from 'react'
import { AREAS, WHATSAPP } from '../dados'

type Campo = 'nome' | 'telefone' | 'assunto' | 'mensagem' | 'aceite'
type Valores = Record<Campo, string>
type Erros = Partial<Record<Campo, string>>

const CAMPOS: Campo[] = ['nome', 'telefone', 'assunto', 'mensagem', 'aceite']

function validar(campo: Campo, v: Valores): string | null {
  switch (campo) {
    case 'nome':
      return v.nome.trim().length >= 2 ? null : 'Informe o seu nome.'
    case 'telefone': {
      const digitos = v.telefone.replace(/\D/g, '').length
      return digitos >= 10 && digitos <= 13 ? null : 'Informe um telefone com DDD.'
    }
    case 'assunto':
      return v.assunto ? null : 'Escolha a área do seu caso.'
    case 'mensagem':
      return v.mensagem.trim().length >= 10 ? null : 'Conte, em poucas palavras, como podemos ajudar.'
    case 'aceite':
      return v.aceite ? null : 'É preciso autorizar o contato para enviar.'
  }
}

const ler = (form: HTMLFormElement): Valores => {
  const f = new FormData(form)
  const valor = (k: string) => String(f.get(k) ?? '')
  return {
    nome: valor('nome'),
    telefone: valor('telefone'),
    assunto: valor('assunto'),
    mensagem: valor('mensagem'),
    aceite: valor('aceite'),
  }
}

const caixa =
  'block w-full min-h-13 border border-marfim/20 bg-noite px-4 py-3 text-base text-marfim placeholder:text-marfim/45 transition-colors hover:border-marfim/40 focus:border-dourado focus:outline-none focus-visible:outline-none aria-invalid:border-erro'
const etiqueta = 'mb-2.5 block text-xs font-bold tracking-[0.22em] text-marfim uppercase'

// Formulário que monta a mensagem e abre o WhatsApp do escritório. Sem número
// configurado, mostra a mensagem pronta na tela.
export function Contato() {
  const id = useId()
  const form = useRef<HTMLFormElement>(null)
  const [erros, setErros] = useState<Erros>({})
  const [pronto, setPronto] = useState<{ link?: string; mensagem: string } | null>(null)

  const conferir = (campo: Campo) => {
    if (!form.current) return
    const erro = validar(campo, ler(form.current))
    setErros((atual) => ({ ...atual, [campo]: erro ?? undefined }))
  }

  // Corrige o erro enquanto a pessoa digita, mas só aponta erro novo ao sair do campo.
  const aoMudar = (campo: Campo) => {
    if (erros[campo]) conferir(campo)
  }

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    const el = evento.currentTarget
    const v = ler(el)
    const novos: Erros = {}
    for (const c of CAMPOS) {
      const erro = validar(c, v)
      if (erro) novos[c] = erro
    }
    setErros(novos)
    const primeiro = CAMPOS.find((c) => novos[c])
    if (primeiro) {
      el.querySelector<HTMLElement>(`[name="${primeiro}"]`)?.focus()
      setPronto(null)
      return
    }

    const mensagem = [
      `Olá! Meu nome é ${v.nome.trim()}.`,
      `Assunto: ${v.assunto}`,
      `Telefone: ${v.telefone.trim()}`,
      '',
      v.mensagem.trim(),
    ].join('\n')
    const link = WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}` : undefined
    setPronto({ link, mensagem })
    if (link) window.open(link, '_blank', 'noopener')
  }

  const erroDe = (campo: Campo) =>
    erros[campo] ? (
      <p id={`${id}-${campo}-erro`} className="mt-2 text-sm text-[#f2b8b5]">
        {erros[campo]}
      </p>
    ) : null

  const props = (campo: Campo) => ({
    id: `${id}-${campo}`,
    name: campo,
    'aria-invalid': erros[campo] ? true : undefined,
    'aria-describedby': erros[campo] ? `${id}-${campo}-erro` : undefined,
    onBlur: () => conferir(campo),
    onChange: () => aoMudar(campo),
  })

  return (
    <form ref={form} onSubmit={enviar} noValidate className="grid gap-7">
      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-nome`} className={etiqueta}>
            Nome
          </label>
          <input {...props('nome')} type="text" autoComplete="name" className={caixa} />
          {erroDe('nome')}
        </div>
        <div>
          <label htmlFor={`${id}-telefone`} className={etiqueta}>
            Telefone / WhatsApp
          </label>
          <input {...props('telefone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="(00) 00000-0000" className={caixa} />
          {erroDe('telefone')}
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-assunto`} className={etiqueta}>
          Assunto
        </label>
        <div className="relative">
          <select {...props('assunto')} defaultValue="" className={`${caixa} cursor-pointer appearance-none pr-12`}>
            <option value="" disabled>
              Selecione uma área
            </option>
            {AREAS.map((a) => (
              <option key={a.id} value={a.nome}>
                {a.nome}
              </option>
            ))}
            <option value="Outro assunto">Outro assunto</option>
          </select>
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-marfim/70" aria-hidden="true">
            <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        {erroDe('assunto')}
      </div>

      <div>
        <label htmlFor={`${id}-mensagem`} className={etiqueta}>
          Mensagem
        </label>
        <textarea
          {...props('mensagem')}
          rows={5}
          placeholder="Conte, de forma resumida, como o escritório pode ajudar."
          className={`${caixa} resize-y`}
        />
        {erroDe('mensagem')}
      </div>

      <div>
        <label className="flex cursor-pointer gap-4 text-[0.95rem] leading-relaxed text-marfim/80">
          <input {...props('aceite')} type="checkbox" value="sim" className="mt-1 size-5 shrink-0 cursor-pointer accent-dourado" />
          <span>
            Autorizo o contato do escritório e o uso destes dados apenas para responder à minha solicitação.
          </span>
        </label>
        {erroDe('aceite')}
      </div>

      <button type="submit" className="botao w-full cursor-pointer bg-marfim text-noite hover:bg-dourado">
        Enviar mensagem
      </button>

      <div aria-live="polite">
        {pronto && (
          <div className="border border-dourado/40 bg-noite p-5 text-[0.95rem] text-marfim/85">
            {pronto.link ? (
              <p>
                Abrimos o WhatsApp com a sua mensagem.{' '}
                <a href={pronto.link} target="_blank" rel="noopener" className="text-dourado underline underline-offset-4">
                  Abrir de novo
                </a>
              </p>
            ) : (
              <>
                <p className="font-semibold text-marfim">Mensagem pronta:</p>
                <pre className="mt-3 font-sans whitespace-pre-wrap">{pronto.mensagem}</pre>
              </>
            )}
          </div>
        )}
      </div>
    </form>
  )
}
