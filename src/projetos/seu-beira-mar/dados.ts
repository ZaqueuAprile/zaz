// WhatsApp da casa que recebe os pedidos: código do país e DDD, só dígitos.
// Deixe vazio para esconder os botões de pedido.
export const WHATSAPP = ''

// ID da playlist do YouTube (o valor de "list=" no link). Os vídeos tocam em
// sequência no player da seção "Na cozinha".
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
}

export type Categoria = {
  id: string
  nome: string
  nota?: string
  pratos: Prato[]
}

// Cardápio de exemplo: troque nomes, descrições e preços pelos da casa.
export const CARDAPIO: Categoria[] = [
  {
    id: 'petiscos',
    nome: 'Petiscos',
    nota: 'Para dividir enquanto o mar não cansa.',
    pratos: [
      { nome: 'Casquinha de siri', descricao: 'Siri catado, leite de coco e farofa de dendê, servida na casca.', preco: 32, destaque: true },
      { nome: 'Bolinho de peixe', descricao: 'Oito unidades, com maionese de limão-cravo.', preco: 38 },
      { nome: 'Camarão alho e óleo', descricao: 'Camarão médio salteado no alho dourado, com pão da casa.', preco: 64, serve: 2 },
      { nome: 'Lula à dorê', descricao: 'Anéis empanados na hora, molho tártaro e limão.', preco: 56, serve: 2 },
      { nome: 'Ostras frescas', descricao: 'Meia dúzia, com limão e vinagrete de pimenta-de-cheiro.', preco: 48 },
    ],
  },
  {
    id: 'moquecas',
    nome: 'Moquecas',
    nota: 'Na panela de barro, com arroz, pirão e farofa.',
    pratos: [
      { nome: 'Moqueca de peixe', descricao: 'Peixe do dia, dendê, leite de coco, pimentões e coentro.', preco: 148, serve: 2, destaque: true },
      { nome: 'Moqueca de camarão', descricao: 'Camarão VG, dendê, leite de coco e tomate maduro.', preco: 176, serve: 2 },
      { nome: 'Moqueca mista', descricao: 'Peixe, camarão, lula e polvo na mesma panela.', preco: 198, serve: 2 },
      { nome: 'Moqueca de banana-da-terra', descricao: 'Versão vegetariana, com castanha de caju tostada.', preco: 112, serve: 2 },
    ],
  },
  {
    id: 'grelhados',
    nome: 'Da grelha',
    nota: 'Acompanha arroz de coco e salada da estação.',
    pratos: [
      { nome: 'Peixe do dia na brasa', descricao: 'Inteiro ou em posta, conforme o que o barco trouxer.', preco: 128, serve: 2 },
      { nome: 'Polvo grelhado', descricao: 'Batatas ao murro, azeite e páprica defumada.', preco: 136, destaque: true },
      { nome: 'Camarão no espeto', descricao: 'Dez camarões grandes com manteiga de ervas.', preco: 98 },
      { nome: 'Lagosta na manteiga', descricao: 'Meia lagosta grelhada, manteiga de garrafa e limão.', preco: 189 },
    ],
  },
  {
    id: 'sobremesas',
    nome: 'Sobremesas',
    pratos: [
      { nome: 'Cocada de forno', descricao: 'Morna, com sorvete de tapioca.', preco: 26 },
      { nome: 'Pudim de leite', descricao: 'A receita da casa, sem furinhos.', preco: 22 },
      { nome: 'Abacaxi na brasa', descricao: 'Com canela, rapadura e creme de coco.', preco: 24 },
    ],
  },
  {
    id: 'bebidas',
    nome: 'Bebidas',
    pratos: [
      { nome: 'Caipirinha', descricao: 'Limão, caju ou maracujá. Cachaça, vodca ou saquê.', preco: 28 },
      { nome: 'Água de coco', descricao: 'Gelada, servida no coco.', preco: 12 },
      { nome: 'Suco da fruta', descricao: 'Cajá, mangaba, acerola ou graviola.', preco: 14 },
      { nome: 'Cerveja long neck', descricao: 'Pergunte as opções do dia.', preco: 14 },
    ],
  },
]
