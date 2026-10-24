import { useRef, useState } from 'react'
import { CARDAPIO_URL } from '../dados'

// O cardápio é um flipbook externo: abre numa janela sobre o site e só
// carrega o iframe na primeira vez que a janela abre.
export function Cardapio() {
  const dialogo = useRef<HTMLDialogElement>(null)
  const botao = useRef<HTMLButtonElement>(null)
  const [carregado, setCarregado] = useState(false)

  const abrir = () => {
    const d = dialogo.current
    if (!d || typeof d.showModal !== 'function') {
      window.open(CARDAPIO_URL, '_blank', 'noopener')
      return
    }
    setCarregado(true)
    d.showModal()
    document.body.style.overflow = 'hidden'
  }

  const aoFechar = () => {
    document.body.style.overflow = ''
    botao.current?.focus({ preventScroll: true })
  }

  return (
    <>
      <button
        ref={botao}
        type="button"
        onClick={abrir}
        aria-haspopup="dialog"
        className="min-h-12 cursor-pointer bg-tinta px-8 py-3 font-medium text-cal transition-colors hover:bg-oliva active:translate-y-px"
      >
        Abrir o cardápio
      </button>

      <dialog
        ref={dialogo}
        aria-labelledby="cardapio-titulo"
        onClose={aoFechar}
        onClick={(e) => e.target === dialogo.current && dialogo.current?.close()}
        className="cardapio-dialogo m-auto h-[min(92dvh,56rem)] w-[min(94vw,72rem)] max-w-none bg-cal p-0 text-tinta backdrop:bg-transparent"
      >
        <div className="flex h-full flex-col">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-linha px-5 py-3">
            <h2 id="cardapio-titulo" className="mr-auto font-display text-2xl">
              Cardápio
            </h2>
            <a className="sublinhado text-sm font-medium" href={CARDAPIO_URL} target="_blank" rel="noopener">
              Abrir em nova aba
            </a>
            <button
              type="button"
              onClick={() => dialogo.current?.close()}
              className="min-h-11 cursor-pointer px-2 text-sm font-medium sublinhado"
            >
              Fechar
            </button>
          </div>
          {carregado && (
            <iframe className="w-full flex-1 border-0" src={CARDAPIO_URL} title="Cardápio do Bossa Cucina" allowFullScreen />
          )}
        </div>
      </dialog>
    </>
  )
}
