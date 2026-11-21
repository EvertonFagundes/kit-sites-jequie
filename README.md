# Kit de modelos — sites para comércio local (Jequié/BA)

Sete modelos de site, cada um para um nicho do comércio de Jequié. Servem para mostrar
ao empresário, no celular, como o site dele ficaria.

**Ver online:** https://evertonfagundes.github.io/kit-sites-jequie/

| Modelo | Nicho | Abrir |
|---|---|---|
| Odontologia | clínica odontológica | [odonto.html](odonto.html) |
| Imobiliária | imóveis, locação e venda | [imobiliaria.html](imobiliaria.html) |
| Advocacia | escritório de advocacia | [advocacia.html](advocacia.html) |
| Clínica | clínica médica | [clinica.html](clinica.html) |
| Contabilidade | escritório contábil | [contabilidade.html](contabilidade.html) |
| Hotel | hotel e pousada | [hotel.html](hotel.html) |
| Barbearia | barbearia e estética masculina | [barbearia.html](barbearia.html) |

## O que é demonstrativo

- Nome, endereço, telefone, preços e depoimentos são **fictícios**
- As fotos são de banco de imagens (Pexels, licença comercial), **não** dos estabelecimentos
- O rodapé de cada página declara isso

## Estrutura

```
index.html          hub com os 7 modelos
*.html              um arquivo por nicho
assets/base.css     sistema visual compartilhado
assets/img/         fotos (JPG otimizado)
.nojekyll           evita processamento Jekyll no Pages
```

Cada página define a cor da marca em `--accent` / `--accent-soft` no `<style>` do topo.
O telefone aparece como `5573900000000` e deve ser trocado antes de mostrar ao cliente.

## Versão para levar no celular

A pasta `demos-mobile/` (fora deste repositório) tem os mesmos 8 arquivos com CSS e fotos
embutidos em base64 — um arquivo abre o site inteiro sem depender de pasta nem internet.
