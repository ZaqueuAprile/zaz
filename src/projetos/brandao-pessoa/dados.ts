// Dados do escritório. O que estiver vazio aparece no site como "a confirmar"
// (no rodapé) ou some (botões de ligar e e-mail), até ser preenchido.

// WhatsApp que recebe os contatos: código do país e DDD, só dígitos.
// Exemplo: "5511999999999". Vazio = os botões levam ao formulário, que mostra
// a mensagem pronta na tela.
export const WHATSAPP = ''

// Telefone para o botão "Ligar", só dígitos com DDD. Exemplo: "11999999999".
export const TELEFONE = ''

export const EMAIL = ''

export const INSTAGRAM = 'brandaoepessoa'

// Cidade e estado, como aparecem no topo da abertura. Ex.: "São Paulo · SP".
export const CIDADE = ''

// Linhas do endereço. Ex.: ['Edifício X · Sala 101', 'Rua Y, 100 · Centro', 'Cidade - UF · 00000-000']
export const ENDERECO: string[] = []

export const CNPJ = ''

export type Advogado = {
  nome: string
  cargo: string
  oab: string
  foto: string
  bio: string
}

export const AREAS = [
  {
    id: 'civel',
    nome: 'Direito Cível',
    texto:
      'Contratos, cobranças, indenizações por danos morais e materiais, responsabilidade civil, posse e propriedade, e medidas urgentes para proteger direitos e patrimônio.',
  },
  {
    id: 'consumidor',
    nome: 'Direito do Consumidor',
    texto:
      'Cobranças indevidas, negativação irregular, produtos e serviços com defeito, problemas com bancos, planos de saúde, companhias aéreas e operadoras.',
  },
  {
    id: 'criminal',
    nome: 'Direito Criminal',
    texto:
      'Defesa em inquérito policial e processo penal, acompanhamento em delegacia, audiências de custódia, pedidos de liberdade, júri e recursos.',
  },
  {
    id: 'familia',
    nome: 'Família',
    texto:
      'Divórcio, guarda, pensão alimentícia, regulamentação de visitas, união estável, partilha de bens e inventário, com condução técnica e humana.',
  },
  {
    id: 'previdenciario',
    nome: 'Previdenciário',
    texto:
      'Aposentadorias, auxílio por incapacidade, BPC/LOAS, pensão por morte, revisões de benefício e recursos contra negativas do INSS.',
  },
  {
    id: 'trabalhista',
    nome: 'Trabalhista',
    texto:
      'Verbas rescisórias, horas extras, vínculo de emprego, assédio, acidente de trabalho e consultoria para empregadores na prevenção de passivos.',
  },
  {
    id: 'transito',
    nome: 'Trânsito',
    texto:
      'Defesa em multas e processos de suspensão ou cassação da CNH, recursos administrativos e indenizações por acidentes de trânsito.',
  },
] as const

export const SECOES = [
  { id: 'escritorio', nome: 'O escritório' },
  { id: 'socios', nome: 'Sócios e equipe' },
  { id: 'areas', nome: 'Áreas de atuação' },
  { id: 'atendimento', nome: 'Como atendemos' },
  { id: 'duvidas', nome: 'Dúvidas' },
  { id: 'contato', nome: 'Contato' },
] as const

// Link do WhatsApp com uma mensagem já escrita, ou o formulário quando não há número.
export const linkWhatsApp = (texto = 'Olá! Gostaria de falar com um advogado do escritório.') =>
  WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}` : '#contato'
