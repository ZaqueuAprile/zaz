// Para enviar o pedido de reserva por WhatsApp, coloque o número com
// código do país e DDD, só dígitos. Exemplo: "5573999999999".
export const WHATSAPP = ''

export const CARDAPIO_URL = 'https://heyzine.com/flip-book/c0c5c34d09.html'

// Funcionamento por dia da semana (0 = domingo). Terça fechada.
export const HORARIOS: Record<number, [string, string] | null> = {
  0: ['14:00', '21:00'],
  1: ['18:00', '23:00'],
  2: null,
  3: ['18:00', '23:00'],
  4: ['18:00', '23:00'],
  5: ['18:00', '23:00'],
  6: ['18:00', '23:00'],
}
