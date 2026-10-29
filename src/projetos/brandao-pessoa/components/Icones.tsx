import type { ReactNode } from 'react'

// Ícones de traço fino para as áreas de atuação e os botões, no mesmo peso.

const TRACOS: Record<string, ReactNode> = {
  civel: (
    <>
      <path d="M12 3v18M8 21h8M5 6.5h14M12 4.5 5 6.5M12 4.5l7 2" />
      <path d="M5 6.5 2.5 13a2.6 2.6 0 0 0 5 0zM19 6.5 16.5 13a2.6 2.6 0 0 0 5 0z" />
    </>
  ),
  consumidor: (
    <>
      <path d="M5.5 8h13l-1 12.5h-11z" />
      <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
    </>
  ),
  criminal: <path d="M12 3 19.5 6v5.5c0 4.8-3.3 8.2-7.5 9.5-4.2-1.3-7.5-4.7-7.5-9.5V6z" />,
  familia: (
    <>
      <circle cx="8.5" cy="8" r="3" />
      <path d="M3 20a5.5 5.5 0 0 1 11 0" />
      <circle cx="16.5" cy="9.5" r="2.4" />
      <path d="M15 14.4a4.5 4.5 0 0 1 6 4.6" />
    </>
  ),
  previdenciario: (
    <>
      <path d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5h-17A8.5 8.5 0 0 1 12 3.5z" />
      <path d="M12 12v6.5a2 2 0 0 0 4 0" />
    </>
  ),
  trabalhista: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="1.5" />
      <path d="M9 7.5V5.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18M11 13v2h2v-2" />
    </>
  ),
  transito: (
    <>
      <path d="M4.5 15.5 6.2 10a2 2 0 0 1 1.9-1.4h7.8a2 2 0 0 1 1.9 1.4l1.7 5.5" />
      <rect x="3.5" y="15.5" width="17" height="3.5" rx="1" />
      <path d="M6 19v1.5M18 19v1.5" />
      <circle cx="7.5" cy="17.2" r=".4" />
      <circle cx="16.5" cy="17.2" r=".4" />
    </>
  ),
}

export function IconeArea({ id, className }: { id: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {TRACOS[id]}
    </svg>
  )
}

export function Seta({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? 'size-4'} aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function IconeWhatsApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.44-9.44a9.38 9.38 0 0 1 9.43 9.45c0 5.2-4.23 9.43-9.44 9.43zm8.03-17.47A11.28 11.28 0 0 0 12.05.7C5.8.7.7 5.79.7 12.04c0 2 .52 3.95 1.52 5.67L.6 23.6l6.03-1.58a11.33 11.33 0 0 0 5.42 1.38h.01c6.25 0 11.34-5.09 11.34-11.34 0-3.03-1.18-5.88-3.32-8.02z" />
    </svg>
  )
}
