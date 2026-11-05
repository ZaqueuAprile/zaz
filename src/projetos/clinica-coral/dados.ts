// WhatsApp da clínica que recebe os pedidos de avaliação: código do país e
// DDD, só dígitos. Exemplo: "5511999999999". Vazio = o formulário mostra a
// mensagem pronta na tela e os botões de WhatsApp somem.
export const WHATSAPP = ''

// Telefone para o botão "Ligar", só dígitos com DDD. Vazio = sem botão.
export const TELEFONE = ''

// Perfil do Instagram, sem @. Vazio = sem link.
export const INSTAGRAM = ''

// Endereço em linhas. Vazio = a seção mostra só "atendimento com hora marcada".
export const ENDERECO: string[] = []

// Horários em linhas, por exemplo "Segunda a sexta · 9h às 19h".
export const HORARIOS: string[] = []

// As dentistas da clínica. Na publicidade odontológica, nome e CRO de quem
// atende precisam aparecer: preencha `cro` (ex.: "CRO-SP 000000").
// `foto`: importe a imagem no App e passe aqui; sem foto, o cartão mostra as
// iniciais. `sobre`: uma ou duas frases sobre a dentista (vazio = some).
export type Dentista = {
  id: string
  nome: string
  cro: string
  areas: string[]
  sobre: string
}

export const DENTISTAS: Dentista[] = [
  {
    id: 'julia',
    nome: 'Dra. Julia S. Moreno',
    cro: '',
    areas: [],
    sobre: '',
  },
  {
    id: 'ana-carolina',
    nome: 'Dra. Ana Carolina',
    cro: '',
    areas: [],
    sobre: '',
  },
]

export const SECOES = [
  { id: 'tratamentos', nome: 'Tratamentos' },
  { id: 'casos', nome: 'Casos' },
  { id: 'equipe', nome: 'Equipe' },
  { id: 'agendar', nome: 'Agendar' },
] as const

export const TRATAMENTOS = [
  {
    id: 'facetas',
    nome: 'Lentes e facetas',
    texto: 'Cor, forma e proporção redesenhadas para o seu rosto, a partir de um planejamento do sorriso inteiro.',
  },
  {
    id: 'alinhadores',
    nome: 'Alinhadores invisíveis',
    texto: 'Placas transparentes e removíveis que alinham os dentes aos poucos, sem bráquetes.',
  },
  {
    id: 'proteses',
    nome: 'Próteses',
    texto: 'Totais ou parciais removíveis, para devolver a mastigação, a fala e a vontade de sorrir.',
  },
  {
    id: 'restauracoes',
    nome: 'Restaurações estéticas',
    texto: 'Cáries e fraturas tratadas com resina na cor do dente, preservando o máximo da estrutura natural.',
  },
] as const

export type IdTratamento = (typeof TRATAMENTOS)[number]['id']
