/**
 * generate-sample-data.mjs
 *
 * Generates two sample Excel files and seeds the local Supabase database.
 * Run with: node scripts/generate-sample-data.mjs
 *
 * Deterministic via seeded PRNG (mulberry32).
 */

import * as XLSX from 'xlsx'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// ---------------------------------------------------------------------------
// 1. Read .env.local manually (dotenv may not be installed)
// ---------------------------------------------------------------------------
function readEnvLocal() {
  const envPath = path.join(ROOT, '.env.local')
  const content = fs.readFileSync(envPath, 'utf8')
  const env = {}
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const value = trimmed.slice(eqIdx + 1).trim()
    env[key] = value
  }
  return env
}

const env = readEnvLocal()
const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL']
const SERVICE_ROLE_KEY = env['SUPABASE_SERVICE_ROLE_KEY']

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

// ---------------------------------------------------------------------------
// 2. Seeded PRNG (mulberry32) — deterministic
// ---------------------------------------------------------------------------
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeRng(seed) {
  const rand = mulberry32(seed)
  return {
    rand,
    pick(arr) {
      return arr[Math.floor(rand() * arr.length)]
    },
    weighted(items, weights) {
      const total = weights.reduce((a, b) => a + b, 0)
      let r = rand() * total
      for (let i = 0; i < items.length; i++) {
        r -= weights[i]
        if (r <= 0) return items[i]
      }
      return items[items.length - 1]
    },
    int(min, max) {
      return min + Math.floor(rand() * (max - min + 1))
    },
  }
}

// ---------------------------------------------------------------------------
// 3. Shared reference data
// ---------------------------------------------------------------------------
const MUNICIPIOS = [
  'Medellín',
  'Bello',
  'Itagüí',
  'Envigado',
  'Apartadó',
  'Rionegro',
  'Turbo',
  'Caucasia',
  'Sabaneta',
  'La Estrella',
  'Copacabana',
  'Girardota',
  'Barbosa',
  'Caldas',
  'Marinilla',
  'La Ceja',
  'Guarne',
  'Carmen de Viboral',
  'Santa Fe de Antioquia',
  'Urrao',
]

// Medellín gets ~30%, rest distributed
const MUN_WEIGHTS = [
  30, 8, 7, 7, 5, 5, 4, 4, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 1,
]

// ---------------------------------------------------------------------------
// 4. Generate eventos-municipios-antioquia.xlsx (~500 rows)
// ---------------------------------------------------------------------------
function generateEventos() {
  const rng = makeRng(0xdeadbeef)

  const SEXO_ITEMS = ['Masculino', 'Femenino']
  const SEXO_W = [40, 60]

  const GRUPOS = ['10-14', '15-19', '20-24', '25-29', '30-39', '40-59', '60+']
  const GRUPOS_W = [5, 20, 22, 18, 15, 12, 8]

  const METODOS = [
    'Intoxicación',
    'Arma cortopunzante',
    'Ahorcamiento',
    'Lanzamiento al vacío',
    'Otro',
  ]
  const METODOS_W = [45, 22, 16, 8, 9]

  const TIPOS = ['Intento', 'Ideación', 'Muerte']
  const TIPOS_W = [78, 18, 4]

  const PROGRAMAS = [
    'Prevención Suicida',
    'Salud Mental',
    'Mitigación SPA',
    'Social y Comunitario',
  ]
  const PROGRAMAS_W = [55, 22, 13, 10]

  // casos: small integers 1-9, weighted toward 1-3
  const CASOS_W = [0, 30, 28, 18, 10, 6, 4, 2, 1, 1]

  const rows = []

  // ~500 rows spread across years/months
  const TARGET = 500
  const YEARS = [2022, 2023, 2024, 2025]
  // slight year-over-year growth factor
  const YEAR_W = [15, 22, 30, 33]

  for (let i = 0; i < TARGET; i++) {
    const año = rng.weighted(YEARS, YEAR_W)
    const maxMes = año === 2025 ? 6 : 12
    const mes = rng.int(1, maxMes)
    const municipio = rng.weighted(MUNICIPIOS, MUN_WEIGHTS)
    const sexo = rng.weighted(SEXO_ITEMS, SEXO_W)
    const grupo_etario = rng.weighted(GRUPOS, GRUPOS_W)
    const metodo = rng.weighted(METODOS, METODOS_W)
    const tipo_evento = rng.weighted(TIPOS, TIPOS_W)
    const programa = rng.weighted(PROGRAMAS, PROGRAMAS_W)
    const casos = rng.weighted([1, 2, 3, 4, 5, 6, 7, 8, 9], CASOS_W.slice(1))

    rows.push({
      municipio,
      año,
      mes,
      sexo,
      grupo_etario,
      metodo,
      tipo_evento,
      programa,
      casos,
    })
  }

  return rows
}

// ---------------------------------------------------------------------------
// 5. Generate atenciones-linea-24-7.xlsx (~800 rows)
// ---------------------------------------------------------------------------
function generateAtenciones() {
  const rng = makeRng(0xcafebabe)

  const CANALES = ['Telefónico', 'Virtual']
  const CANAL_W = [70, 30]

  const SEXO_ITEMS = ['Femenino', 'Masculino']
  const SEXO_W = [58, 42]

  const GRUPOS = ['10-14', '15-19', '20-24', '25-29', '30-39', '40-59', '60+']
  const GRUPOS_W = [4, 22, 25, 18, 14, 11, 6]

  const MOTIVOS = [
    'Crisis emocional',
    'Ideación suicida',
    'Consumo SPA',
    'Violencia intrafamiliar',
    'Duelo',
    'Otro',
  ]
  const MOTIVOS_W = [30, 25, 15, 12, 10, 8]

  const RIESGOS = ['Bajo', 'Medio', 'Alto']
  const RIESGO_W = [55, 30, 15]

  const CANALIZADOS_SI = ['Hospital', 'EPS', 'Secretaría de Salud', 'Policía']
  const CANALIZADOS_NO = ['No requirió', 'EPS']
  const CANAL_NO_W = [82, 18]

  const SEGUIMIENTOS_ALTO = ['En seguimiento', 'Cerrado', 'Sin contacto']
  const SEG_ALTO_W = [50, 40, 10]
  const SEGUIMIENTOS_OTROS = ['Cerrado', 'En seguimiento', 'Sin contacto']
  const SEG_OTROS_W = [70, 20, 10]

  // Evening/night weighted hours: 18:00-02:00 ~55%
  // Build a list of weighted hours
  function pickHour() {
    const evening = rng.rand() < 0.55
    if (evening) {
      // 18-23 or 0-2
      const slot = Math.floor(rng.rand() * 9) // 0-8 → 18,19,20,21,22,23,0,1,2
      return slot < 6 ? 18 + slot : slot - 6
    } else {
      // 3-17
      return 3 + Math.floor(rng.rand() * 15)
    }
  }

  const rows = []
  const TARGET = 800

  // Date range: 2024-01 to 2025-06
  // Total months: 18; slight upward trend
  const MONTHS = []
  for (let y = 2024; y <= 2025; y++) {
    const maxM = y === 2025 ? 6 : 12
    for (let m = 1; m <= maxM; m++) {
      MONTHS.push({ y, m })
    }
  }
  // Month weights: increasing over time
  const MONTH_W = MONTHS.map((_, i) => 1 + i * 0.08)

  for (let i = 0; i < TARGET; i++) {
    const { y: year, m: month } = rng.weighted(MONTHS, MONTH_W)
    const daysInMonth = new Date(year, month, 0).getDate()
    const day = rng.int(1, daysInMonth)
    const mm = String(month).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    const fecha = `${year}-${mm}-${dd}` // YYYY-MM-DD string

    const hour = pickHour()
    const minute = rng.int(0, 59)
    const hora = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`

    const canal = rng.weighted(CANALES, CANAL_W)
    const sexo = rng.weighted(SEXO_ITEMS, SEXO_W)
    const grupo_etario = rng.weighted(GRUPOS, GRUPOS_W)
    const municipio = rng.weighted(MUNICIPIOS, MUN_WEIGHTS)
    const motivo = rng.weighted(MOTIVOS, MOTIVOS_W)
    const nivel_riesgo = rng.weighted(RIESGOS, RIESGO_W)

    // ruta_activada: ~85% if Alto, ~10% if Medio, never Bajo
    let ruta_activada
    if (nivel_riesgo === 'Alto') {
      ruta_activada = rng.rand() < 0.85 ? 'Sí' : 'No'
    } else if (nivel_riesgo === 'Medio') {
      ruta_activada = rng.rand() < 0.10 ? 'Sí' : 'No'
    } else {
      ruta_activada = 'No'
    }

    const canalizado_a =
      ruta_activada === 'Sí'
        ? rng.pick(CANALIZADOS_SI)
        : rng.weighted(CANALIZADOS_NO, CANAL_NO_W)

    const estado_seguimiento =
      nivel_riesgo === 'Alto'
        ? rng.weighted(SEGUIMIENTOS_ALTO, SEG_ALTO_W)
        : rng.weighted(SEGUIMIENTOS_OTROS, SEG_OTROS_W)

    rows.push({
      fecha,
      hora,
      canal,
      sexo,
      grupo_etario,
      municipio,
      motivo,
      nivel_riesgo,
      ruta_activada,
      canalizado_a,
      estado_seguimiento,
    })
  }

  return rows
}

// ---------------------------------------------------------------------------
// 6. Write Excel files
// ---------------------------------------------------------------------------
function writeExcel(rows, filePath) {
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Datos')
  XLSX.writeFile(wb, filePath)
}

// ---------------------------------------------------------------------------
// 7. Seed Supabase
// ---------------------------------------------------------------------------
async function seedEventos(rows) {
  const filename = 'eventos-municipios-antioquia.xlsx'

  // Delete existing upload (cascade deletes eventos rows)
  const { data: existing } = await supabase
    .from('uploads')
    .select('id')
    .eq('filename', filename)
  if (existing && existing.length > 0) {
    for (const row of existing) {
      await supabase.from('uploads').delete().eq('id', row.id)
    }
    console.log(`Deleted ${existing.length} existing upload(s) for ${filename}`)
  }

  // Insert upload batch record
  const { data: upload, error: uploadErr } = await supabase
    .from('uploads')
    .insert({ filename, rows_imported: rows.length })
    .select('id')
    .single()

  if (uploadErr) throw new Error(`Upload insert failed: ${uploadErr.message}`)
  const uploadId = upload.id

  // Bulk insert eventos rows
  const dbRows = rows.map((r) => ({
    upload_id: uploadId,
    departamento: 'Antioquia',
    municipio: r.municipio,
    año: r.año,
    mes: r.mes,
    sexo: r.sexo,
    grupo_etario: r.grupo_etario,
    metodo: r.metodo,
    tipo_evento: r.tipo_evento,
    programa: r.programa,
    casos: r.casos,
  }))

  // Insert in batches of 100
  const BATCH = 100
  let inserted = 0
  for (let i = 0; i < dbRows.length; i += BATCH) {
    const chunk = dbRows.slice(i, i + BATCH)
    const { error } = await supabase.from('eventos').insert(chunk)
    if (error) throw new Error(`eventos insert failed at row ${i}: ${error.message}`)
    inserted += chunk.length
  }

  console.log(`Inserted ${inserted} rows into eventos (upload_id: ${uploadId})`)
  return inserted
}

async function seedAtenciones(rows) {
  const filename = 'atenciones-linea-24-7.xlsx'

  // Delete existing upload (cascade deletes atenciones rows)
  const { data: existing } = await supabase
    .from('uploads_linea')
    .select('id')
    .eq('filename', filename)
  if (existing && existing.length > 0) {
    for (const row of existing) {
      await supabase.from('uploads_linea').delete().eq('id', row.id)
    }
    console.log(`Deleted ${existing.length} existing upload(s) for ${filename}`)
  }

  // Insert upload batch record
  const { data: upload, error: uploadErr } = await supabase
    .from('uploads_linea')
    .insert({ filename, rows_imported: rows.length })
    .select('id')
    .single()

  if (uploadErr) throw new Error(`uploads_linea insert failed: ${uploadErr.message}`)
  const uploadId = upload.id

  // Bulk insert atenciones rows
  const dbRows = rows.map((r) => ({
    upload_id: uploadId,
    fecha: r.fecha, // YYYY-MM-DD string
    hora: r.hora,
    canal: r.canal,
    sexo: r.sexo,
    grupo_etario: r.grupo_etario,
    municipio: r.municipio,
    motivo: r.motivo,
    nivel_riesgo: r.nivel_riesgo,
    ruta_activada: r.ruta_activada === 'Sí', // convert to boolean
    canalizado_a: r.canalizado_a,
    estado_seguimiento: r.estado_seguimiento,
  }))

  // Insert in batches of 100
  const BATCH = 100
  let inserted = 0
  for (let i = 0; i < dbRows.length; i += BATCH) {
    const chunk = dbRows.slice(i, i + BATCH)
    const { error } = await supabase.from('atenciones_linea').insert(chunk)
    if (error) throw new Error(`atenciones_linea insert failed at row ${i}: ${error.message}`)
    inserted += chunk.length
  }

  console.log(`Inserted ${inserted} rows into atenciones_linea (upload_id: ${uploadId})`)
  return inserted
}

// ---------------------------------------------------------------------------
// 8. Main
// ---------------------------------------------------------------------------
async function main() {
  const samplesDir = path.join(ROOT, 'public', 'samples')
  if (!fs.existsSync(samplesDir)) fs.mkdirSync(samplesDir, { recursive: true })

  // Generate data
  console.log('Generating eventos data...')
  const eventosRows = generateEventos()
  console.log(`  ${eventosRows.length} rows generated`)

  console.log('Generating atenciones data...')
  const atencionesRows = generateAtenciones()
  console.log(`  ${atencionesRows.length} rows generated`)

  // Write Excel files
  const eventosPath = path.join(samplesDir, 'eventos-municipios-antioquia.xlsx')
  writeExcel(eventosRows, eventosPath)
  console.log(`Written: ${eventosPath}`)

  const atencionesPath = path.join(samplesDir, 'atenciones-linea-24-7.xlsx')
  writeExcel(atencionesRows, atencionesPath)
  console.log(`Written: ${atencionesPath}`)

  // Seed database
  console.log('\nSeeding local Supabase database...')
  const eventosInserted = await seedEventos(eventosRows)
  const atencionesInserted = await seedAtenciones(atencionesRows)

  console.log('\nDone.')
  console.log(`  eventos rows in DB:         ${eventosInserted}`)
  console.log(`  atenciones_linea rows in DB: ${atencionesInserted}`)

  if (eventosInserted < 400) {
    console.error('WARNING: eventos count is below 400!')
  }
  if (atencionesInserted < 700) {
    console.error('WARNING: atenciones count is below 700!')
  }
}

main().catch((err) => {
  console.error('FATAL:', err)
  process.exit(1)
})
