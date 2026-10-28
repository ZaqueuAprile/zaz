import { createContext, useContext } from 'react'

export const ContextoGaleria = createContext<(botao: HTMLElement) => void>(() => {})

// Foto que, tocada, abre a visualização ampliada.
export const useAmpliar = () => useContext(ContextoGaleria)
