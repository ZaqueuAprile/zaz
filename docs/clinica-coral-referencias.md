# Clínica Coral: referências de UX/UI

Pesquisa para o site da Clínica Coral (Odontologia & Estética, Dra. Julia S. Moreno).
Ponto de partida: a logo e os posts do Instagram que a clínica já usa.

## 1. O que a marca já diz

| Elemento | No material atual | Como levar para o site |
|---|---|---|
| Cor principal | Dourado/bronze da logo, ~`#9E825D` | Botões, filetes, ícones e o selo da logo. Nada de azul hospitalar |
| Fundo | Bege quente, luz de vela, plantas (post dos alinhadores) | Areia clara `#F5EFE6` / creme `#FBF8F3`, com seções escuras `#25262A` (o fundo da logo) |
| Tipografia | "Clínica" sem serifa fina + "CORAL" em serifa de alto contraste; títulos em itálico serifado ("*alinhadores invisíveis.*") | Serifa de alto contraste com itálico para títulos (Cormorant Garamond, Bodoni Moda ou Newsreader, que já está no projeto) + sem serifa limpa para o texto (Hanken Grotesk, já instalada) |
| Recurso gráfico | Linhas finas com cantos retos ligando rótulos ao objeto (post dos alinhadores); setas finas ("A tela → / A obra de arte →") | Usar esse filete de 1px como linguagem do site: legendas de tratamentos, divisores, setas nos CTAs |
| Tom de voz | "A tela, a artista, a obra de arte" | Odontologia como ofício artesanal. A Dra. Julia é a protagonista |
| Coral (o galho da logo) | Ramo que sai do dente | Pode virar um desenho em SVG que cresce com a rolagem, como o rio do Bossa Cucina |

Posicionamento: estúdio de estética, mais perto de spa e hotelaria do que de consultório. O site deve parecer a sala do post dos alinhadores.

## 2. Referências de sites

### Odontologia premium / estúdio
- **La Clinique Dentaire de l'Avenir** (Montreal), Site of the Day no Awwwards. Mostra como uma clínica pequena chega a um nível editorial. https://www.awwwards.com/sites/l-avenir-dental-clinic
- **Alley Dental** (Awwwards). https://www.awwwards.com/sites/alley-dental
- **South Cliff Dental Group**, menção honrosa no Awwwards em 2026. Referência para mais de uma unidade e interação 3D (usar com moderação). https://www.awwwards.com/sites/south-cliff-dental-group
- **Natalie Herzel Dental Clinic** (Awwwards Inspiration). Grade de fotos e uso de fotografia própria. https://www.awwwards.com/inspiration/photos-natalie-herzel-dental-clinic
- **Tend** (EUA). Vídeo curto e calmo no hero, um CTA de cor forte e texto fácil de ler. Boa referência de jornada de agendamento.
- **Arbor: A Dental Concept**. Paleta escura e calma, layout arejado, cara de estúdio de design.
- **Free State Dental**. Taupe, marrom e tan com serifa grande; é a paleta mais próxima da Coral.
- **Shorewood** (caso de estudo dental + spa). Sálvia e tons quentes, sensação de spa.
- **Essence Dental Clinic** (Site of the Day, CSS Nectar). https://cssnectar.com/css-gallery-inspiration/dental-clinic-and-implantology/

### Fora da odontologia (para o clima)
- **The Spa Amsterdam** (redesign, Contra): creme + verde-floresta + bronze, Fraunces nos títulos e Inter no texto. Quase a mesma receita da Coral. https://contra.com/p/ZXXUcqoY-the-spa-amsterdam-website-redesign
- **Pousada Gaivota** (neste repositório): a mesma lógica de "luxo silencioso", com fundo de areia, serifa leve com itálico e muito espaço. Dá para reaproveitar a estrutura.

### Dribbble / Behance / Framer (componentes)
- Luxury Dental Clinic UI/UX, Dhaval Gohil: https://contra.com/p/veUkv2XO-luxury-dental-clinic-website-uiux
- Lumine Dental Clinic: https://contra.com/p/rbON2Ars-lumine-dental-clinic-full-website-design-and-development
- Alexey Dybin, dental clinic: https://dribbble.com/alexeydybin
- Sofino (Zurique), série de clínicas: https://dribbble.com/nickrillen
- Framer Community, Dental Clinic Website: https://www.framer.com/community/posts/MtbMHE4qnUquHPtmyvF8x7/
- Para buscar mais no Dribbble/Behance, use: `dental clinic cream`, `dental studio serif`, `aesthetic clinic beige`, `dental spa`.

### Roundups (para varrer mais exemplos)
- https://azurodigital.com/dental-website-examples/
- https://ueni.com/blog/dental-websites/
- https://delmain.co/blog/best-dental-websites
- https://www.fivebyfive.com.au/best-dental-clinic-website-design/
- https://www.digitalmarketingagency.sg/blog/dentist-websites

## 3. Padrões de UX que valem para a Coral

1. **Mobile primeiro.** A maior parte das buscas por dentista vem do celular, e o tráfego da clínica vem do Instagram. Barra fixa no rodapé com **WhatsApp** e **Ligar**.
2. **Um CTA só, repetido:** "Agendar avaliação" (WhatsApp com mensagem pronta, citando o tratamento da página de origem).
3. **Hero:** frase curta em itálico serifado ("*O sorriso como obra de arte.*"), foto ou vídeo vertical da clínica ou da Dra. Julia trabalhando, e CTA. Sem banco de imagens: as referências premium concordam que foto de stock derruba a percepção de preço.
4. **Tratamentos em cards** (Facetas e lentes, Alinhadores invisíveis, Próteses, Restaurações estéticas, Clareamento). Cada um com página própria contendo indicação, como funciona, número de sessões, FAQ e casos do próprio tratamento.
5. **Casos clínicos:** comparador com arrasto (slider antes/depois) em fotos padronizadas e com legenda. Os posts atuais já servem de material. Ver os limites do CFO na seção 4.
6. **"A artista":** seção sobre a Dra. Julia com foto real (a da câmera funciona bem), CRO, formação e a filosofia "tela → artista → obra".
7. **Prova social:** avaliações do Google (nota + quantidade) perto do CTA, e não escondidas no rodapé.
8. **Ambiente:** galeria da clínica (velas, plantas, luz quente) para reduzir o medo do dentista. É o diferencial emocional.
9. **Localização:** mapa, horários, estacionamento e acessibilidade, em uma seção curta.
10. **Desempenho e acessibilidade:** fotos em AVIF/WebP com `srcset`, carregamento abaixo de 3 s no 4G, contraste AA. O dourado `#9E825D` sobre creme não passa como texto pequeno, então use um tom mais escuro (~`#6F5A3E`) no texto e o dourado só em elementos grandes.
11. **Movimento contido:** fade e leve subida nas seções, o ramo de coral se desenhando, e `prefers-reduced-motion` respeitado.

## 4. Atenção: regras do CFO (Brasil)

Os guias americanos recomendam "mostre os preços" e "galeria de antes e depois em toda parte". No Brasil, a publicidade odontológica segue o Código de Ética (Res. CFO 118/2012) e a **Res. CFO 196/2019**:
- É permitido divulgar imagens de diagnóstico e do resultado final, de casos do próprio profissional, com autorização do paciente (termo de consentimento).
- Imagens do procedimento em andamento e de tecidos biológicos são proibidas.
- **Preços, promoções, serviços gratuitos e formas de captação são proibidos.** Não use "a partir de R$" nem "avaliação grátis".
- Nome do responsável técnico e número do CRO precisam aparecer.

Há debate jurídico sobre o alcance da 196/2019. **Confirme o texto em vigor com o CRO antes de publicar os casos.**
- https://www.migalhas.com.br/depeso/320858/fotos-de-antes-e-depois-por-que-os-dentistas-podem-e-os-medicos-nao
- https://www.migalhas.com.br/coluna/migalhas-de-responsabilidade-civil/377358/antes-e-depois-x-direito-a-imagem-divulgacao-de-fotos-de-pacientes
- Texto oficial: https://sistemas.cfo.org.br

## 5. Estrutura sugerida (one-page + páginas de tratamento)

```
Header fixo: logo · Tratamentos · Casos · A Dra. · Clínica · [Agendar]
1. Hero: itálico serifado + vídeo vertical + CTA
2. Manifesto: "A tela. A artista. A obra." (os três blocos do post)
3. Tratamentos: cards com filete fino ligando rótulo à imagem
4. Casos: slider antes/depois (com consentimento)
5. A Dra. Julia: foto, CRO, formação
6. A clínica: galeria do ambiente
7. Avaliações do Google
8. Como chegar: mapa, horários
Rodapé: CRO do responsável técnico · Instagram · WhatsApp
Mobile: barra fixa [WhatsApp] [Ligar]
```
