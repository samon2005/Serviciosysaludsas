/**
 * Genera public/logo.svg (y variantes) — logo vectorial de Servicios & Salud S.A.S.
 * El icono se redibujó a partir del logo original (JPEG de 150 px) y el texto
 * se convierte a curvas con Montserrat, así no depende de ninguna fuente.
 *
 * Uso (dependencias temporales, no van en package.json):
 *   npm i --no-save opentype.js @fontsource/montserrat
 *   node scripts/generate-logo.mjs
 */
import { createRequire } from 'node:module'
import { readFileSync, writeFileSync } from 'node:fs'
const require = createRequire(import.meta.url)
const opentype = require('opentype.js')

const font = (w) => {
  const b = readFileSync(
    require.resolve(`@fontsource/montserrat/files/montserrat-latin-${w}-normal.woff`)
  )
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength))
}
const f600 = font(600)
const f800 = font(800)
const f700 = font(700)

/** Texto -> path con letter-spacing; devuelve {d, width} */
function textPath(f, text, x, baseline, size, tracking = 0) {
  let cx = x
  let d = ''
  for (const ch of text) {
    const g = f.charToGlyph(ch)
    d += g.getPath(cx, baseline, size).toPathData(2)
    cx += (g.advanceWidth * size) / f.unitsPerEm + tracking
  }
  return { d, width: cx - x - tracking }
}

// ---- Icono (cuadrícula de 20 unidades = 1 px del original) ----
// Coordenadas del icono en un lienzo 0..600 x 0..620
const iconLight = 'M200 60H460V260H330V420H40V260H200Z' // mitad clara: brazo superior + izquierdo
const iconDark = 'M348 276H610V420H460V600H208V436H348Z' // mitad oscura: brazo derecho + inferior
const iconGold = 'M480 80H640V250H480Z'
const iconGoldIn = 'M512 116H612V214H512Z'
const iconDot = 'M122 442H198V540H122Z'

const iconScale = 0.2 // 600 -> 120
const iconX = -8 // recorte: el icono empieza en x=40
const iconY = 0

// ---- Texto ----
const ICON_W = 130
const dividerX = ICON_W + 14
const textX = dividerX + 22

const s1 = textPath(f600, 'SERVICIOS &', textX, 62, 50, 2.2)
const s2 = textPath(f800, 'SALUD', textX - 3, 122, 78, 1)
const s3 = textPath(f700, 'S.A.S.', textX + s2.width + 14, 122, 20, 3)

const W = Math.ceil(Math.max(textX + s1.width, textX + s2.width + 14 + s3.width) + 4)
const H = 140

const svg = (variant) => {
  const mono = variant === 'white'
  const c = {
    light: mono ? '#FFFFFF' : 'url(#gL)',
    dark: mono ? '#FFFFFF' : 'url(#gD)',
    gold: mono ? '#FFFFFF' : '#B9A76C',
    goldIn: mono ? '#0B1B26' : '#FFFBEA',
    dot: mono ? '#FFFFFF' : '#7A5A3A',
    t1: mono ? '#FFFFFF' : 'url(#gT1)',
    t2: mono ? '#FFFFFF' : 'url(#gT2)',
    t3: mono ? '#E6EEF5' : '#2B5A96',
    line: mono ? '#FFFFFF' : '#4B7F94',
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Servicios &amp; Salud S.A.S.">
  <defs>
    <linearGradient id="gL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#29A9E0"/><stop offset="1" stop-color="#1E76BC"/></linearGradient>
    <linearGradient id="gD" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2079C4"/><stop offset="1" stop-color="#1B4A92"/></linearGradient>
    <linearGradient id="gT1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1F6FB5"/><stop offset="1" stop-color="#1B4F94"/></linearGradient>
    <linearGradient id="gT2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1E62B2"/><stop offset="1" stop-color="#1A4590"/></linearGradient>
  </defs>
  <g transform="translate(${iconX + 8} ${iconY + 8}) scale(${iconScale})" stroke-linejoin="round">
    <path d="${iconLight}" fill="${c.light}"/>
    <path d="${iconDark}" fill="${c.dark}"/>
    <path d="${iconGold}" fill="${c.gold}"/>
    <path d="${iconGoldIn}" fill="${c.goldIn}"/>
    <path d="${iconDot}" fill="${c.dot}"/>
  </g>
  <rect x="${dividerX}" y="10" width="3" height="120" rx="1.5" fill="${c.line}"/>
  <path d="${s1.d}" fill="${c.t1}"/>
  <path d="${s2.d}" fill="${c.t2}"/>
  <path d="${s3.d}" fill="${c.t3}"/>
</svg>
`
}

const out = new URL('../public/', import.meta.url)
writeFileSync(new URL('logo.svg', out), svg('color'))
writeFileSync(new URL('logo-blanco.svg', out), svg('white'))
console.log('OK', W, H)
