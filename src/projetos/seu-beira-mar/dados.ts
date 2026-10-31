// WhatsApp da casa que recebe os pedidos: código do país e DDD, só dígitos.
// Deixe vazio para esconder os botões de pedido.
export const WHATSAPP = ''

// Playlist com todos os vídeos, para o link "ver todos no YouTube".
export const PLAYLIST_ID = 'PLMdrpAAr63Ow'

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
  descricao: string
  preco: number
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

// Cardápio de exemplo: troque nomes, descrições e preços pelos da casa e cole
// em "video" o link do vídeo de cada prato.
export const CARDAPIO: Categoria[] = [
  {
    id: 'petiscos',
    nome: 'Petiscos',
    nota: 'Para dividir enquanto o mar não cansa.',
    pratos: [
      { nome: 'Casquinha de siri', descricao: 'Siri catado, leite de coco e farofa de dendê, servida na casca.', preco: 32, destaque: true, video: '' },
      { nome: 'Bolinho de peixe', descricao: 'Oito unidades, com maionese de limão-cravo.', preco: 38, video: '' },
      { nome: 'Camarão alho e óleo', descricao: 'Camarão médio salteado no alho dourado, com pão da casa.', preco: 64, serve: 2, video: '' },
      { nome: 'Lula à dorê', descricao: 'Anéis empanados na hora, molho tártaro e limão.', preco: 56, serve: 2, video: '' },
      { nome: 'Ostras frescas', descricao: 'Meia dúzia, com limão e vinagrete de pimenta-de-cheiro.', preco: 48, video: '' },
    ],
  },
  {
    id: 'moquecas',
    nome: 'Moquecas',
    nota: 'Na panela de barro, com arroz, pirão e farofa.',
    pratos: [
      { nome: 'Moqueca de peixe', descricao: 'Peixe do dia, dendê, leite de coco, pimentões e coentro.', preco: 148, serve: 2, destaque: true, video: '' },
      { nome: 'Moqueca de camarão', descricao: 'Camarão VG, dendê, leite de coco e tomate maduro.', preco: 176, serve: 2, video: '' },
      { nome: 'Moqueca mista', descricao: 'Peixe, camarão, lula e polvo na mesma panela.', preco: 198, serve: 2, video: '' },
      { nome: 'Moqueca de banana-da-terra', descricao: 'Versão vegetariana, com castanha de caju tostada.', preco: 112, serve: 2, video: '' },
    ],
  },
  {
    id: 'grelhados',
    nome: 'Da grelha',
    nota: 'Acompanha arroz de coco e salada da estação.',
    pratos: [
      { nome: 'Peixe do dia na brasa', descricao: 'Inteiro ou em posta, conforme o que o barco trouxer.', preco: 128, serve: 2, video: '' },
      { nome: 'Polvo grelhado', descricao: 'Batatas ao murro, azeite e páprica defumada.', preco: 136, destaque: true, video: '' },
      { nome: 'Camarão no espeto', descricao: 'Dez camarões grandes com manteiga de ervas.', preco: 98, video: '' },
      { nome: 'Lagosta na manteiga', descricao: 'Meia lagosta grelhada, manteiga de garrafa e limão.', preco: 189, video: '' },
    ],
  },
  {
    id: 'sobremesas',
    nome: 'Sobremesas',
    pratos: [
      { nome: 'Cocada de forno', descricao: 'Morna, com sorvete de tapioca.', preco: 26, video: '' },
      { nome: 'Pudim de leite', descricao: 'A receita da casa, sem furinhos.', preco: 22, video: '' },
      { nome: 'Abacaxi na brasa', descricao: 'Com canela, rapadura e creme de coco.', preco: 24, video: '' },
    ],
  },
  {
    id: 'bebidas',
    nome: 'Bebidas',
    pratos: [
      { nome: 'Caipirinha', descricao: 'Limão, caju ou maracujá. Cachaça, vodca ou saquê.', preco: 28, video: '' },
      { nome: 'Água de coco', descricao: 'Gelada, servida no coco.', preco: 12, video: '' },
      { nome: 'Suco da fruta', descricao: 'Cajá, mangaba, acerola ou graviola.', preco: 14, video: '' },
      { nome: 'Cerveja long neck', descricao: 'Pergunte as opções do dia.', preco: 14, video: '' },
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
