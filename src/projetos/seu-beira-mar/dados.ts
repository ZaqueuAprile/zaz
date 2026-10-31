// WhatsApp da casa que recebe os pedidos: código do país e DDD, só dígitos.
// Deixe vazio para esconder os botões de pedido.
export const WHATSAPP = ''

export const ENDERECO = 'Orla da praia, s/n'

// Funcionamento por dia da semana (0 = domingo). Segunda fechada.
export const HORARIOS: Record<number, [string, string] | null> = {
  0: ['11:00', '18:00'],
  1: null,
  2: ['11:00', '22:00'],
  3: ['11:00', '22:00'],
  4: ['11:00', '22:00'],
  5: ['11:00', '23:00'],
  6: ['11:00', '23:00'],
}

export type Prato = {
  nome: string
  descricao?: string
  // Sem preço, o cartão mostra só o nome.
  preco?: number
  serve?: number
  destaque?: boolean
  // Link do vídeo do prato no YouTube (watch, youtu.be ou shorts) ou só o ID.
  // Vazio: o cartão aparece sem player.
  video: string
  // Vídeo em pé (Shorts, Reels): o player abre na vertical.
  vertical?: boolean
}

export type Categoria = {
  id: string
  nome: string
  nota?: string
  pratos: Prato[]
}

// Cardápio da casa, um vídeo por prato. Para mostrar preço e descrição no
// cartão, acrescente preco: 148 e descricao: '...' ao prato.
export const CARDAPIO: Categoria[] = [
  {
    id: 'entradas',
    nome: 'Entradas',
    pratos: [
      { nome: 'Crudo de Peixe', video: 'https://youtube.com/shorts/OGXOVAkoxH0', vertical: true },
      { nome: 'Ceviche', video: 'https://youtube.com/shorts/GXzRzZYt4XE', vertical: true },
    ],
  },
  {
    id: 'petiscos',
    nome: 'Petiscos',
    pratos: [
      { nome: 'Mandioca', video: 'https://youtube.com/shorts/Cr0wAN3R8oI', vertical: true },
      { nome: 'Tartar de Camarão', video: 'https://youtube.com/shorts/Q33wH5ypinY', vertical: true },
      { nome: 'Pastel', video: 'https://youtube.com/shorts/iykZTCueBa4', vertical: true },
    ],
  },
  {
    id: 'saladas',
    nome: 'Saladas',
    pratos: [
      { nome: 'Caesar de Camarão', video: 'https://youtube.com/shorts/oHpIMH_hUT8', vertical: true },
      { nome: 'Peras Grelhadas', video: 'https://youtube.com/shorts/Xtlw56wQiNA', vertical: true },
    ],
  },
  {
    id: 'do-mar',
    nome: 'Do mar',
    pratos: [
      { nome: 'Lagosta Campeã', video: 'https://youtube.com/shorts/9Fm3-SRZTKs', vertical: true },
      { nome: 'Dourado', video: 'https://youtube.com/shorts/1y2M-nQUY2A', vertical: true },
      { nome: 'Olho de Boi', video: 'https://youtube.com/shorts/MRMpnHtUXpc', vertical: true },
    ],
  },
  {
    id: 'da-terra',
    nome: 'Da terra',
    pratos: [
      { nome: 'Filé Mignon de Sol', video: 'https://youtube.com/shorts/nGMjoTl9G2g', vertical: true },
      { nome: 'Chuck Eye', video: 'https://youtube.com/shorts/jrRdtWWLWmo', vertical: true },
      { nome: 'Ossobuco', video: 'https://youtube.com/shorts/bnwix3qLLck', vertical: true },
    ],
  },
  {
    id: 'massas',
    nome: 'Massas',
    pratos: [
      { nome: 'Raviolini de Mussarela', video: 'https://youtube.com/shorts/tHdbBh9Qi8w', vertical: true },
      { nome: 'Ravioli Del Plin', video: 'https://youtube.com/shorts/zvVQ5of6K04', vertical: true },
    ],
  },
  {
    id: 'vegs',
    nome: 'Vegs',
    pratos: [
      { nome: 'Risoto de Cogumelo', video: 'https://youtube.com/shorts/eeMSEpAGD-c', vertical: true },
    ],
  },
  {
    id: 'sobremesas',
    nome: 'Sobremesas',
    pratos: [
      { nome: 'Brigadeiro de Colher', video: 'https://youtube.com/shorts/DeloFjEsado', vertical: true },
    ],
  },
]

// Aceita o link em qualquer formato do YouTube, ou o ID puro, e devolve o ID.
export function idDoVideo(link: string) {
  const texto = link.trim()
  if (/^[\w-]{11}$/.test(texto)) return texto
  const achado = texto.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/)
  return achado ? achado[1] : null
}
