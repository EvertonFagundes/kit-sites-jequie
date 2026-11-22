#!/usr/bin/env node
/*
  Gera demos-mobile/: uma versão portátil de cada página, com CSS, fontes,
  ícones e imagens embutidos em base64. Cada arquivo abre sozinho, sem pasta
  de assets e sem internet.

  Uso:  node tools/build-demos-mobile.mjs
*/
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "demos-mobile");
const pages = [
  "index.html",
  "odonto.html",
  "imobiliaria.html",
  "advocacia.html",
  "clinica.html",
  "contabilidade.html",
  "hotel.html",
  "barbearia.html",
];

const mime = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

function dataUri(relPath) {
  const file = path.join(root, relPath);
  if (!fs.existsSync(file)) throw new Error("Arquivo não encontrado: " + relPath);
  const ext = path.extname(file).toLowerCase();
  return `data:${mime[ext] || "application/octet-stream"};base64,${fs.readFileSync(file).toString("base64")}`;
}

const baseCss = fs.readFileSync(path.join(root, "assets", "base.css"), "utf8");
const faceRe = /@font-face\{[^}]*\}/g;
const allFaces = baseCss.match(faceRe) || [];
const cssRest = baseCss.replace(faceRe, "").trim();
const siteJs = fs.readFileSync(path.join(root, "assets", "site.js"), "utf8");

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const report = [];

for (const page of pages) {
  let html = fs.readFileSync(path.join(root, page), "utf8");

  /* 1. Descobre as duas famílias tipográficas da página. */
  const families = new Set();
  const display = html.match(/--font-display:\s*'([^']+)'/);
  const text = html.match(/--font-text:\s*'([^']+)'/);
  if (display) families.add(display[1]);
  if (text) families.add(text[1]);

  /* 2. Mantém só os @font-face das famílias usadas e embute os woff2. */
  const faces = allFaces
    .filter((face) => {
      const family = face.match(/font-family:'([^']+)'/);
      return family && families.has(family[1]);
    })
    .map((face) =>
      face.replace(/url\('fonts\/([^']+)'\)/, (match, file) =>
        `url('${dataUri(path.join("assets", "fonts", file))}')`
      )
    )
    .join("\n");

  html = html.replace(
    /<link rel="stylesheet" href="assets\/base\.css">\s*/i,
    `<style>\n${faces}\n${cssRest}\n</style>\n`
  );

  /* 3. Preloads não fazem sentido quando tudo já está embutido. */
  html = html.replace(/<link rel="preload"[^>]*>\s*/gi, "");
  html = html.replace(/<link rel="apple-touch-icon"[^>]*>\s*/gi, "");

  /* 4. Favicon vira data URI. */
  html = html.replace(/<link rel="icon" href="(assets\/[^"]+)"[^>]*>/i, (match, file) => {
    return `<link rel="icon" href="${dataUri(file)}">`;
  });

  /* 5. site.js embutido no fim do body. */
  html = html.replace(
    /<script src="assets\/site\.js" defer><\/script>/,
    `<script>\n${siteJs}\n</script>`
  );

  /* 6. Imagens: escolhe a menor candidata do srcset (tela de celular),
        embute em base64 e remove srcset/sizes. */
  html = html.replace(/<img\b[^>]*>/gi, (tag) => {
    let next = tag;
    let chosen = null;

    const src = next.match(/\bsrc="(assets\/[^"]+)"/i);
    if (src) chosen = src[1];

    const srcset = next.match(/\bsrcset="([^"]+)"/i);
    if (srcset) {
      const candidates = srcset[1]
        .split(",")
        .map((part) => part.trim().split(/\s+/))
        .filter((part) => part[0] && part[0].startsWith("assets/"))
        .sort((a, b) => (parseInt(a[1], 10) || 0) - (parseInt(b[1], 10) || 0));
      if (candidates.length) chosen = candidates[0][0];
    }

    if (chosen) next = next.replace(/\bsrc="[^"]*"/i, `src="${dataUri(chosen)}"`);
    next = next.replace(/\s+srcset="[^"]*"/gi, "").replace(/\s+sizes="[^"]*"/gi, "");
    return next;
  });

  html = html.replace(
    /<!DOCTYPE html>/i,
    "<!DOCTYPE html>\n<!-- Versão portátil: CSS, fontes, ícones e imagens embutidos. Gerada por tools/build-demos-mobile.mjs. -->"
  );

  const leftover = [
    ...html.matchAll(/(?:src|href)="(assets\/[^"]+)"/gi),
    ...html.matchAll(/url\(['"]?(assets\/[^'")]+)/gi),
  ].map((m) => m[1]);

  if (leftover.length) {
    throw new Error(`${page}: ainda referencia assets/ -> ${leftover.join(", ")}`);
  }

  const target = path.join(outDir, page);
  fs.writeFileSync(target, html, "utf8");
  const kb = Math.round(Buffer.byteLength(html) / 1024);
  report.push({ page, kb });
}

fs.writeFileSync(
  path.join(outDir, "LEIA-ME.txt"),
  [
    "MODELOS PORTÁTEIS — Everton Fagundes",
    "",
    "Cada arquivo .html abre sozinho no navegador do celular ou do computador.",
    "CSS, fontes, ícones e imagens estão embutidos: não precisa de pasta, instalação ou internet.",
    "",
    "Para enviar um modelo a um cliente, envie somente o arquivo correspondente.",
    "O index.html é o hub do portfólio: para ele abrir os sete modelos, envie a pasta inteira.",
    "",
    "Os links de WhatsApp e de mapa abrem os aplicativos e precisam de internet.",
    "Nomes, endereços, registros e preços são fictícios — veja o rodapé de cada página.",
  ].join("\n"),
  "utf8"
);

console.log("demos-mobile/ gerado:");
for (const item of report) console.log(`  ${item.page.padEnd(20)} ${String(item.kb).padStart(5)} KB`);
console.log("  LEIA-ME.txt");
