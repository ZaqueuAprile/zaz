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

// Responsável técnica e inscrição no CRO, obrigatórias na publicidade
// odontológica. Exemplo: CRO = "CRO-SP 000000".
export const RESPONSAVEL = 'Dra. Julia S. Moreno'
export const CRO = ''

export const SECOES = [
  { id: 'tratamentos', nome: 'Tratamentos' },
  { id: 'casos', nome: 'Casos' },
  { id: 'dentista', nome: 'A dentista' },
  { id: 'agendar', nome: 'Agendar' },
] as const

export const TRATAMENTOS = [
  {
    id: 'facetas',
    nome: 'Lentes e facetas',
    texto:
      'Cor, forma e proporção redesenhadas para o seu rosto. O planejamento começa pelo sorriso inteiro, não por um dente.',
    pontos: ['Planejamento do sorriso', 'Cor e formato sob medida'],
  },
  {
    id: 'alinhadores',
    nome: 'Alinhadores invisíveis',
    texto:
      'Placas transparentes e removíveis que alinham os dentes aos poucos, sem bráquetes e sem fios aparentes.',
    pontos: ['Discretos e removíveis', 'Planejamento digital'],
  },
  {
    id: 'proteses',
    nome: 'Próteses',
    texto:
      'Totais ou parciais removíveis, para devolver a mastigação, a fala e a vontade de sorrir sem pensar nisso.',
    pontos: ['Próteses totais', 'Parciais removíveis'],
  },
  {
    id: 'restauracoes',
    nome: 'Restaurações estéticas',
    texto:
      'Cáries e fraturas tratadas com resina na cor do dente, preservando o máximo da estrutura natural.',
    pontos: ['Resina na cor do dente', 'Mínimo desgaste'],
  },
] as const

export type IdTratamento = (typeof TRATAMENTOS)[number]['id']
