# Sites para negócios de Jequié — portfólio e modelos

Portfólio de **Everton Fagundes**, desenvolvedor de sites em Jequié/BA. O repositório reúne
oito páginas: o hub do portfólio e sete modelos completos, um para cada setor do comércio local.
Tudo é HTML, CSS e JavaScript escritos à mão — sem framework, sem build e sem requisição externa.

**Ver online:** https://evertonfagundes.github.io/kit-sites-jequie/

## Os modelos

| # | Modelo | Setor | O que demonstra | Abrir |
|---|---|---|---|---|
| 01 | Sorriso Novo | Odontologia | Agendamento, tratamentos, equipe, FAQ e mapa | [odonto.html](odonto.html) |
| 02 | Horizonte Imóveis | Imobiliária | Filtro por finalidade, tipo e bairro, com contador e reset | [imobiliaria.html](imobiliaria.html) |
| 03 | Martins & Prado | Advocacia | Editorial, orientações em acordeão e contato sem captação (Provimento 205/2021) | [advocacia.html](advocacia.html) |
| 04 | Vida Plena | Clínica médica | Especialidades, preparo da consulta, equipe e agendamento | [clinica.html](clinica.html) |
| 05 | Nova Contabilidade | Contabilidade | Abas por perfil, calendário do ano e checklist de documentos | [contabilidade.html](contabilidade.html) |
| 06 | Serra Azul | Hotelaria | Hero imersivo, quartos e reserva com validação de datas | [hotel.html](hotel.html) |
| 07 | Navalha | Barbearia | Tema escuro, tabela de preços, equipe e agendamento | [barbearia.html](barbearia.html) |

O `index.html` é o portfólio público. Ele não mostra preço nem condições comerciais.

## O que é demonstrativo

- Nomes, endereços, registros profissionais (OAB, CRM, CRC) e preços são **fictícios**.
- Nenhum dado real de empresa foi usado. O rodapé de cada página declara isso.
- As fotografias são de banco de imagens (Pexels, licença comercial) e **não** retratam os
  estabelecimentos. No site de um cliente, entram fotos reais do negócio.
- O telefone e o WhatsApp dos modelos levam ao desenvolvedor, não a um cliente.
- A página de advocacia não tem WhatsApp nem formulário, e o texto evita captação de clientela,
  promessa de resultado e divulgação de êxito, conforme o Provimento 205/2021 da OAB.
- A clínica não se apresenta como pronto-socorro e orienta a procurar o 192 em emergência.
- A contabilidade não publica honorários. O hotel não confirma reserva na hora.
- A barbearia usa preços de exemplo, declarados no rodapé.

## Estrutura

```
index.html                 portfólio público
odonto.html                modelo 01
imobiliaria.html           modelo 02
advocacia.html             modelo 03
clinica.html               modelo 04
contabilidade.html         modelo 05
hotel.html                 modelo 06
barbearia.html             modelo 07

assets/
  base.css                 sistema visual compartilhado (tokens, componentes, responsivo)
  site.js                  telefone central, menu, reveal, formulários, filtro e abas
  fonts/                   22 woff2 self-hosted (Google Fonts, OFL) + fonts.css
  img/                     JPGs originais
  img/w/                   WebP responsivos (480/900/1400 quando aplicável)
  img/covers/              capas 640×336 usadas no portfólio
  img/portfolio/           capturas reais 520×1126 usadas no hero
  og/                      imagens 1200×630 para compartilhamento
  favicon-*.svg            ícones por nicho
  apple-touch-*.png        ícones 180×180

tools/build-demos-mobile.mjs   gerador da versão portátil
demos-mobile/                  saída gerada (8 HTML + LEIA-ME.txt)
.nojekyll                      evita processamento Jekyll no GitHub Pages
```

## Telefone e WhatsApp

O número fica em **um lugar**: `assets/site.js`, no objeto `CONTACT`.

```js
var CONTACT = {
  phone: "5573988659878",     // dígitos, com DDI + DDD
  display: "(73) 98865-9878",
  tel: "+5573988659878"
};
```

Ao trocar para o número de um cliente, procure também por `5573988659878` e
`(73) 98865-9878` nos HTML. Os links `tel:`, os textos visíveis e o `noscript` são reescritos
pelo `site.js`, mas o telefone do JSON-LD (`"telephone"`) é fixo em cada página e precisa ser
trocado à mão.

O número atual é o do desenvolvedor: **(73) 98865-9878**.

## Fontes

| Página | Display | Texto |
|---|---|---|
| index | Instrument Serif | Inter |
| odonto | Fraunces | Inter |
| imobiliária | Bricolage Grotesque | Inter |
| advocacia | Newsreader | Source Sans 3 |
| clínica | Lora | Inter |
| contabilidade | Space Grotesk | Inter |
| hotel | Cormorant Garamond | Karla |
| barbearia | Archivo Black | Archivo |

Todas são self-hosted em `assets/fonts/` (subconjunto latin, licença OFL). Não há chamada ao
Google Fonts. O `base.css` declara todos os rostos; cada página usa apenas o seu par.

## Imagens

- `assets/img/*.jpg` são as origens.
- `assets/img/w/*.webp` são os derivados responsivos. **Nunca referencie uma largura que não
  existe**: algumas séries têm só 480 e 800, e o descritor do `srcset` precisa bater com a
  largura real do arquivo. Confira com `Get-ChildItem`/`python -c "from PIL import Image..."`
  antes de editar `srcset`.
- `assets/img/covers/` tem as sete capas do portfólio, recortadas das OG em 640×336.
- `assets/img/portfolio/` tem as capturas reais em 390×844, reduzidas para 520×1126.
- `assets/og/` tem as oito imagens 1200×630. A do index é uma composição própria; as demais
  saíram das fotos de cada modelo.
- Fotos: Pexels, licença comercial. Confira a licença de cada arquivo antes de usar em um site
  de cliente e substitua pelas fotos reais do estabelecimento.

## Qualidade medida

Medição de novembro de 2026, no Lighthouse do Chrome, nas oito páginas:

- **100** em acessibilidade
- **100** em boas práticas
- **100** em SEO
- **0** requisições externas

Acessibilidade foi conferida com navegação por teclado, `aria-expanded` no menu, foco devolvido
ao botão e formulários com erro em texto. Não há depoimento, estrela, nota do Google nem
contador de clientes inventado.

## Editar um modelo

1. **Marca e textos**: altere o `<title>`, a `<meta name="description">`, o `canonical`, as OG,
   o `.brand` no header e no rodapé.
2. **Cores**: cada página define `--accent`, `--accent-ink`, `--accent-soft` e os neutros no
   `<style>` do topo. O `base.css` é compartilhado; evite mexer nele para um cliente só.
3. **Telefone**: veja a seção acima.
4. **Imagens**: mantenha `width`, `height`, `srcset`, `sizes` e `alt`. O layout reserva o espaço
   pela proporção; trocar só o `src` sem conferir a proporção pode deslocar a página.
5. **Formulário**: o padrão é `data-wa-form="mensagem inicial"`. O `site.js` valida os campos e
   monta a mensagem; não há backend nem armazenamento.
6. **Teste**: abra por um servidor local, confira em 360–430 px, navegue por teclado e rode o
   Lighthouse. Nada vai ao ar sem conferir texto, foto, telefone e horários.

## Versão portátil para enviar no WhatsApp

```bash
node tools/build-demos-mobile.mjs
```

O script recria `demos-mobile/` com oito arquivos HTML independentes. Em cada um:

- o `base.css` e o `site.js` são embutidos;
- apenas as fontes usadas pela página entram como `data:font/woff2`;
- a menor imagem do `srcset` entra como `data:image/webp`;
- favicon vira data URI; preloads e `apple-touch-icon` saem;
- não sobra nenhuma referência a `assets/`.

Tamanhos atuais: 305–568 KB por modelo; o `index.html` fica em 526 KB. Cada modelo abre sozinho,
sem pasta e sem internet (os links de WhatsApp e mapa, claro, precisam de rede). Para enviar um
modelo, envie só o arquivo correspondente. O `index.html` é o hub: para ele abrir os sete, envie
a pasta inteira. O `LEIA-ME.txt` dentro da pasta repete essas instruções.

## Publicar no GitHub Pages

1. Commit e push na branch principal.
2. Em **Settings → Pages**, sirva a raiz do repositório.
3. O `.nojekyll` já está no lugar.
4. As URLs canônicas e de OG usam a base
   `https://evertonfagundes.github.io/kit-sites-jequie/`. Se o repositório ou o domínio mudar,
   troque essa base em todos os HTML, nas OG e no JSON-LD.

## Autoria

**Everton Fagundes** — estudante de Sistemas de Informação na UESB, Jequié/BA.
WhatsApp: (73) 98865-9878 · GitHub: https://github.com/evertonfagundes

Fotografias: Pexels. Fontes: Google Fonts, licença OFL. Textos e código: Everton Fagundes.
