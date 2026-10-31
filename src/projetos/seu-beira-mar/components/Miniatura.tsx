import { useState } from 'react'

// Miniatura do vídeo. Shorts às vezes têm uma miniatura vertical (oardefault);
// quando não têm, usa a horizontal ampliada para cortar as faixas pretas. O
// YouTube não responde com erro para miniatura inexistente: devolve uma imagem
// cinza de 120 px, então a troca também acontece quando ela chega.
export function Miniatura({ video, vertical, className = '' }: { video: string; vertical?: boolean; className?: string }) {
  const [horizontal, setHorizontal] = useState(!vertical)
  return (
    <img
      src={`https://i.ytimg.com/vi/${video}/${horizontal ? 'hqdefault' : 'oardefault'}.jpg`}
      onError={() => setHorizontal(true)}
      onLoad={(e) => !horizontal && e.currentTarget.naturalWidth <= 120 && setHorizontal(true)}
      alt=""
      loading="lazy"
      draggable={false}
      className={`h-full w-full object-cover ${horizontal && vertical ? 'scale-[1.34]' : ''} ${className}`}
    />
  )
}
