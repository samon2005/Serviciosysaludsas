import * as XLSX from 'xlsx'
import type { IndicadorLinea, LineaDimension } from './types'
export { grupoHipotesis, GRUPO_DESCRIPCION } from './linea-grupos'

/**
 * Lector del Excel mensual de la Línea de Atención 24/7.
 *
 * El libro trae una hoja por indicador (LLAMADAS, EDAD, RIESGO, GÉNERO, ZONA,
 * EPS, RUTAS ACTIVADAS, POBLACIÓN DIFERENCIAL, ORDEN HIPOTESIS) con los meses
 * en columnas. Se convierte a formato largo (mes × dimensión × categoría).
 *
 * Reglas de calidad:
 *  - Los porcentajes del Excel se ignoran: se recalculan siempre desde los conteos.
 *  - Las hojas de porcentaje / tablas duplicadas se descartan.
 *  - Los códigos de hipótesis duplicados (p. ej. "Z 630" y "Z63.0") se unifican.
 *  - Se generan advertencias cuando las sumas no cuadran con las llamadas del mes.
 */

export interface ParseResult {
  rows: IndicadorLinea[]
  meses: number[]
  warnings: string[]
  hojas: string[]
  resumen: {
    llamadas: number
    hipotesis: number
    categoriasEps: number
    ultimoMes: number
  }
}

const MESES_NOMBRE = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
]
export const MESES_LARGO = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export function norm(v: unknown): string {
  return String(v ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase()
}

function monthOf(v: unknown): number | null {
  if (typeof v !== 'string') return null
  const n = norm(v).replace(/\./g, '')
  if (!n) return null
  const i = MESES_NOMBRE.findIndex((m) => m === n || (n.length >= 3 && m.startsWith(n) && n.length <= 4))
  if (i >= 0) return i + 1
  if (n === 'SEPT' || n === 'SET') return 9
  return null
}

type Grid = unknown[][]

function grid(ws: XLSX.WorkSheet): Grid {
  return XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: null, raw: true })
}

function num(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string') {
    const t = v.trim().replace(',', '.')
    if (t !== '' && !Number.isNaN(Number(t))) return Number(t)
  }
  return null
}

function findSheet(wb: XLSX.WorkBook, ...candidates: string[]): string | null {
  const names = wb.SheetNames
  for (const c of candidates) {
    const hit = names.find((n) => norm(n) === c)
    if (hit) return hit
  }
  for (const c of candidates) {
    const hit = names.find((n) => norm(n).startsWith(c))
    if (hit) return hit
  }
  return null
}

interface TableRow {
  label: string
  values: Map<number, number>
  totalCell: number | null
}
interface MonthTable {
  rows: TableRow[]
  totals: Map<number, number> | null
}

/** Tabla con meses en columnas (EDAD, RIESGO, GÉNERO, ZONA, EPS, RUTAS, ORDEN HIPOTESIS). */
function readMonthTable(g: Grid): MonthTable | null {
  let headerIdx = -1
  let monthCols = new Map<number, number>()
  let totalCol = -1
  for (let r = 0; r < Math.min(g.length, 40); r++) {
    const cols = new Map<number, number>()
    g[r].forEach((c, ci) => {
      const m = monthOf(c)
      if (m) cols.set(ci, m)
    })
    if (cols.size >= 3) {
      headerIdx = r
      monthCols = cols
      totalCol = g[r].findIndex((c) => norm(c) === 'TOTAL')
      break
    }
  }
  if (headerIdx < 0) return null

  const firstMonthCol = Math.min(...monthCols.keys())
  const rows: TableRow[] = []
  let totals: Map<number, number> | null = null

  for (let r = headerIdx + 1; r < g.length; r++) {
    const row = g[r]
    // Otra cabecera de meses => empieza otra tabla (porcentajes), se termina.
    const monthsHere = row.filter((c) => monthOf(c)).length
    if (monthsHere >= 3) break

    let labelCol = -1
    for (let c = 0; c < firstMonthCol; c++) {
      if (typeof row[c] === 'string' && String(row[c]).trim() !== '') {
        labelCol = c
        break
      }
    }
    if (labelCol < 0) continue
    const label = String(row[labelCol]).trim()

    const values = new Map<number, number>()
    monthCols.forEach((mes, ci) => {
      const v = num(row[ci])
      if (v !== null) values.set(mes, v)
    })

    if (norm(label).startsWith('TOTAL')) {
      totals = values
      break
    }
    rows.push({ label, values, totalCell: totalCol >= 0 ? num(row[totalCol]) : null })
  }
  return { rows, totals }
}

/** Hoja LLAMADAS: meses en filas. */
function readLlamadas(g: Grid): Map<number, number> {
  const out = new Map<number, number>()
  for (const row of g) {
    for (let c = 0; c < row.length; c++) {
      const m = monthOf(row[c])
      if (!m) continue
      for (let k = c + 1; k < row.length; k++) {
        const v = num(row[k])
        if (v !== null) {
          out.set(m, v)
          break
        }
      }
      break
    }
  }
  return out
}

/** Hoja POBLACIÓN DIFERENCIAL: categorías en columnas, meses en filas. Usa la primera tabla. */
function readPoblacion(g: Grid): Map<string, Map<number, number>> | null {
  let headerIdx = -1
  for (let r = 0; r < g.length; r++) {
    const strings = g[r].filter((c) => typeof c === 'string' && String(c).trim() !== '')
    if (strings.length >= 6 && !g[r].some((c) => monthOf(c))) {
      headerIdx = r
      break
    }
  }
  if (headerIdx < 0) return null
  const header = g[headerIdx]
  const cats: { col: number; nombre: string }[] = []
  header.forEach((c, ci) => {
    if (typeof c === 'string' && c.trim()) cats.push({ col: ci, nombre: cleanCategoria(c) })
  })
  const result = new Map<string, Map<number, number>>()
  cats.forEach((c) => result.set(c.nombre, new Map()))
  let seenMonth = false
  for (let r = headerIdx + 1; r < g.length; r++) {
    const row = g[r]
    const m = row.map(monthOf).find((x) => x)
    if (!m) {
      if (seenMonth) break // termina la primera tabla
      continue
    }
    seenMonth = true
    cats.forEach((c) => {
      result.get(c.nombre)!.set(m, num(row[c.col]) ?? 0)
    })
  }
  return seenMonth ? result : null
}

// ---------- normalización de etiquetas ----------

function cap(s: string): string {
  const t = s.trim().toLowerCase()
  return t.charAt(0).toUpperCase() + t.slice(1)
}

function cleanCategoria(s: string): string {
  const t = s.replace(/\s+/g, ' ').trim()
  const known: Record<string, string> = {
    'ROOM (GITANO)': 'Rrom (gitano)',
    'VICTIMA MINAS ANTIPERSONA': 'Víctima de minas antipersona',
    'MUJER CABEZA FAMILIA': 'Mujer cabeza de familia',
    'LGTBI': 'LGBTI',
    'VIOLENCIA INTRAFAMILIAR': 'Violencia intrafamiliar',
    'VIOLENCIA FISICA': 'Violencia física',
    'VIOLENCIA SEXUAL': 'Violencia sexual',
    'DISCAPACIDAD': 'Discapacidad',
    'INDIGENAS': 'Indígenas',
    'AFRO-COLOMBIANO': 'Afrocolombiano',
    'MUJER GESTANTE': 'Mujer gestante',
    'DESPLAZADO': 'Desplazado',
  }
  return known[norm(t)] ?? cap(t)
}

const EDAD_ORDEN = ['0 a 5 años', '6 a 12 años', '13 a 18 años', '19 a 59 años', '60 años o más', 'Sin dato']
function edadLabel(s: string): string {
  const n = norm(s)
  if (/\b0 A 5\b/.test(n)) return EDAD_ORDEN[0]
  if (/\b6 A 12\b/.test(n)) return EDAD_ORDEN[1]
  if (/\b13 A 18\b/.test(n)) return EDAD_ORDEN[2]
  if (/\b19 A 59\b/.test(n)) return EDAD_ORDEN[3]
  if (/MAYOR|60/.test(n)) return EDAD_ORDEN[4]
  if (/SIN/.test(n)) return EDAD_ORDEN[5]
  return cap(s)
}

function generoLabel(s: string): string {
  const n = norm(s)
  if (/HOMBRE|MASCUL/.test(n)) return 'Hombre'
  if (/MUJER|FEMEN/.test(n)) return 'Mujer'
  return 'Otro'
}

function zonaLabel(s: string): string {
  return /RURAL/.test(norm(s)) ? 'Rural' : 'Urbana'
}

function epsLabel(s: string): string {
  const n = norm(s)
  const known: Record<string, string> = {
    'NUEVA EPS': 'Nueva EPS',
    'SIN AFILICION': 'Sin afiliación',
    'SIN AFILIACION': 'Sin afiliación',
    'SIN DATO': 'Sin dato',
    'SIN DATOS': 'Sin dato',
    'SANIDAD MILITAR': 'Sanidad Militar',
    'FOMAG': 'FOMAG',
    'SURA': 'Sura',
  }
  return known[n] ?? n.split(' ').map(cap).join(' ')
}

// ---------- hipótesis ----------

const TYPOS: [RegExp, string][] = [
  [/habitualmene/gi, 'habitualmente'],
  [/estresanes/gi, 'estresantes'],
  [/famiiares/gi, 'familiares'],
  [/circustancias/gi, 'circunstancias'],
  [/desaparicion/gi, 'desaparición'],
  [/separacion/gi, 'separación'],
  [/relacion(?!ad)/gi, 'relación'],
  [/perturbacion/gi, 'perturbación'],
  [/autolesion\b/gi, 'autolesión'],
  [/panico/gi, 'pánico'],
  [/estres\b/gi, 'estrés'],
  [/ninez/gi, 'niñez'],
  [/traumatico/gi, 'traumático'],
  [/psicologico/gi, 'psicológico'],
  [/auoinflingida/gi, 'autoinfligida'],
  [/trast\.emocion\.y de comportam\./gi, 'trastornos emocionales y del comportamiento'],
  [/habitualm\.en/gi, 'habitualmente en'],
  [/adolesc\./gi, 'adolescencia'],
  [/tension/gi, 'tensión'],
  [/sintomas/gi, 'síntomas'],
  [/emocion\b/gi, 'emoción'],
]

function nombreHipotesis(raw: string): string {
  let t = raw.replace(/\s+/g, ' ').trim().replace(/^[—–\-:.,\s]+/, '')
  const letters = t.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ]/g, '')
  const upper = letters.replace(/[^A-ZÁÉÍÓÚÑ]/g, '').length
  if (letters.length && upper / letters.length > 0.6) t = t.toLowerCase()
  for (const [re, rep] of TYPOS) t = t.replace(re, rep)
  t = t.replace(/\bno especificad([oa])\b/gi, 'no especificad$1')
  return t.charAt(0).toUpperCase() + t.slice(1)
}

export interface CodigoHipotesis {
  key: string
  display: string
  nombre: string
}

export function parseHipotesis(label: string): CodigoHipotesis {
  const s = label.replace(/\s+/g, ' ').trim()
  let m = s.match(/^([A-Za-z])\s?(\d{2,3}(?:[.,]\d+)?)\s*[xX]?\s*[:.\-–—]?\s*(.*)$/)
  if (m) {
    const key = (m[1] + m[2]).toUpperCase().replace(/[.,]/g, '')
    const display = /^[A-Z]\d{4,}$/.test(key) ? `${key.slice(0, 3)}.${key.slice(3)}` : key
    return { key, display, nombre: nombreHipotesis(m[3]) }
  }
  m = s.match(/^(\d{3}(?:\.\d+)?[xX]?(?:\s*[–-]\s*\d{3}(?:\.\d+)?[xX]?)?(?:\s*\([A-Z]\d+(?:\.\d+)?\))?)\s*[—–-]?\s*(.*)$/)
  if (m) {
    const display = m[1].replace(/\s+/g, ' ')
    return { key: display.toUpperCase().replace(/[\s.()–]/g, ''), display, nombre: nombreHipotesis(m[2]) }
  }
  return { key: norm(s).slice(0, 24), display: '—', nombre: nombreHipotesis(s) }
}

// ---------- parser principal ----------

export function parseLineaWorkbook(
  buffer: ArrayBuffer | Buffer,
  opts: { municipio: string; año: number }
): ParseResult {
  const wb = XLSX.read(buffer, { type: 'buffer' })
  const warnings: string[] = []
  const rows: IndicadorLinea[] = []
  const hojas: string[] = []
  const { municipio, año } = opts

  const push = (
    mes: number,
    dimension: LineaDimension,
    categoria: string,
    valor: number,
    detalle?: string
  ) => {
    rows.push({ municipio, año, mes, dimension, categoria, detalle: detalle ?? null, valor })
  }

  // 1) LLAMADAS — define qué meses están reportados
  const shLlamadas = findSheet(wb, 'LLAMADAS')
  if (!shLlamadas) {
    throw new Error('No se encontró la hoja "LLAMADAS". Verifique que el archivo tenga el formato mensual esperado.')
  }
  hojas.push(shLlamadas)
  const llamadas = readLlamadas(grid(wb.Sheets[shLlamadas]))
  const meses = [...llamadas.entries()].filter(([, v]) => v > 0).map(([m]) => m).sort((a, b) => a - b)
  if (meses.length === 0) throw new Error('La hoja LLAMADAS no tiene meses con datos.')
  meses.forEach((m) => push(m, 'llamadas', 'Total', llamadas.get(m) ?? 0))
  const ultimoMes = meses[meses.length - 1]
  const totalLlamadas = meses.reduce((a, m) => a + (llamadas.get(m) ?? 0), 0)

  const checkTable = (
    nombre: string,
    t: MonthTable,
    { compararLlamadas = true }: { compararLlamadas?: boolean } = {}
  ) => {
    // Total de la fila vs suma de meses
    for (const r of t.rows) {
      if (r.totalCell !== null) {
        const suma = [...r.values.values()].reduce((a, b) => a + b, 0)
        if (suma !== r.totalCell) {
          warnings.push(`${nombre}: "${r.label.trim()}" suma ${suma} por meses pero el Excel indica ${r.totalCell}.`)
        }
      }
    }
    if (!compararLlamadas) return
    for (const m of meses) {
      const suma = t.rows.reduce((a, r) => a + (r.values.get(m) ?? 0), 0)
      const esperado = llamadas.get(m) ?? 0
      if (suma !== esperado) {
        warnings.push(
          `${nombre}: en ${MESES_LARGO[m - 1].toLowerCase()} la suma es ${suma} y las llamadas son ${esperado}.`
        )
      }
    }
  }

  const simple = (
    sheet: string[],
    dimension: LineaDimension,
    label: (s: string) => string,
    nombre: string,
    opts2: { soloNoCero?: boolean } = {}
  ) => {
    const sh = findSheet(wb, ...sheet)
    if (!sh) {
      warnings.push(`No se encontró la hoja de ${nombre}; ese indicador quedará vacío.`)
      return null
    }
    hojas.push(sh)
    const t = readMonthTable(grid(wb.Sheets[sh]))
    if (!t || t.rows.length === 0) {
      warnings.push(`La hoja ${sh} no tiene datos legibles.`)
      return null
    }
    checkTable(nombre, t)
    // Unificar filas que caen en la misma categoría
    const acum = new Map<string, Map<number, number>>()
    for (const r of t.rows) {
      const cat = label(r.label)
      const cur = acum.get(cat) ?? new Map<number, number>()
      for (const m of meses) cur.set(m, (cur.get(m) ?? 0) + (r.values.get(m) ?? 0))
      acum.set(cat, cur)
    }
    for (const [cat, vals] of acum) {
      for (const m of meses) {
        const v = vals.get(m) ?? 0
        if (opts2.soloNoCero && v === 0) continue
        push(m, dimension, cat, v)
      }
    }
    return t
  }

  simple(['EDAD'], 'edad', edadLabel, 'Edad')
  simple(['RIESGO'], 'riesgo', (s) => cap(s), 'Riesgo')
  simple(['GENERO'], 'genero', generoLabel, 'Género')
  simple(['ZONA'], 'zona', zonaLabel, 'Zona')
  const eps = simple(['EPS'], 'eps', epsLabel, 'EPS', { soloNoCero: true })

  // Rutas: la fila "NO" viene incompleta en el Excel; se deriva de las llamadas.
  const shRuta = findSheet(wb, 'RUTAS ACTIVADAS', 'RUTAS')
  if (shRuta) {
    hojas.push(shRuta)
    const t = readMonthTable(grid(wb.Sheets[shRuta]))
    const si = t?.rows.find((r) => norm(r.label) === 'SI')
    if (si) {
      for (const m of meses) {
        const v = si.values.get(m) ?? 0
        const total = llamadas.get(m) ?? 0
        push(m, 'ruta', 'Sí', v)
        push(m, 'ruta', 'No', Math.max(total - v, 0))
      }
    } else {
      warnings.push('La hoja de rutas activadas no tiene la fila "SI".')
    }
  } else {
    warnings.push('No se encontró la hoja de rutas activadas; ese indicador quedará vacío.')
  }

  // Población diferencial (solo se registran los meses presentes en la hoja)
  const shPob = findSheet(wb, 'POBLACION DIFERENCIAL', 'POBLACION')
  if (shPob) {
    hojas.push(shPob)
    const pob = readPoblacion(grid(wb.Sheets[shPob]))
    if (pob) {
      let mesMax = 0
      for (const [cat, vals] of pob) {
        for (const [m, v] of vals) {
          if (!meses.includes(m)) continue
          mesMax = Math.max(mesMax, m)
          push(m, 'poblacion', cat, v)
        }
      }
      if (mesMax && mesMax < ultimoMes) {
        warnings.push(
          `Población diferencial solo tiene registros hasta ${MESES_LARGO[mesMax - 1].toLowerCase()}; los meses siguientes no se contarán.`
        )
      }
    }
  } else {
    warnings.push('No se encontró la hoja de población diferencial.')
  }

  // Hipótesis — se prefiere la hoja con el orden y los 8 meses
  const shHip = findSheet(wb, 'ORDEN HIPOTESIS', 'HIPOTESIS CLASIFICATORIA', 'HIPOTESIS')
  let totalHip = 0
  const claves = new Set<string>()
  if (shHip) {
    hojas.push(shHip)
    const t = readMonthTable(grid(wb.Sheets[shHip]))
    if (t) {
      checkTable('Hipótesis', t, { compararLlamadas: false })
      const acum = new Map<string, { display: string; nombre: string; vals: Map<number, number> }>()
      for (const r of t.rows) {
        const c = parseHipotesis(r.label)
        const cur = acum.get(c.key) ?? { display: c.display, nombre: c.nombre, vals: new Map() }
        if (!cur.nombre && c.nombre) cur.nombre = c.nombre
        for (const m of meses) cur.vals.set(m, (cur.vals.get(m) ?? 0) + (r.values.get(m) ?? 0))
        acum.set(c.key, cur)
      }
      for (const [key, h] of acum) {
        for (const m of meses) {
          const v = h.vals.get(m) ?? 0
          if (v === 0) continue
          totalHip += v
          claves.add(key)
          push(m, 'hipotesis', key, v, `${h.display}|${h.nombre}`)
        }
      }
      if (totalHip < totalLlamadas) {
        warnings.push(
          `${(totalLlamadas - totalHip).toLocaleString('es-CO')} llamadas no tienen hipótesis clasificatoria registrada.`
        )
      } else if (totalHip > totalLlamadas) {
        warnings.push(`Hay más hipótesis (${totalHip}) que llamadas (${totalLlamadas}); revise la hoja de hipótesis.`)
      }
    }
  } else {
    warnings.push('No se encontró la hoja de hipótesis clasificatoria.')
  }

  return {
    rows,
    meses,
    warnings,
    hojas,
    resumen: {
      llamadas: totalLlamadas,
      hipotesis: claves.size,
      categoriasEps: eps ? new Set(rows.filter((r) => r.dimension === 'eps').map((r) => r.categoria)).size : 0,
      ultimoMes,
    },
  }
}
