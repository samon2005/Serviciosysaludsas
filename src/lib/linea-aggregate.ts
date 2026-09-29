import type { IndicadorLinea, LineaDimension } from './types'
import { grupoHipotesis } from './linea-grupos'

export const MESES_CORTO = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
export const MESES_LARGO = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

export interface Parte {
  name: string
  value: number
  pct: number
}

export interface HipotesisResumen {
  key: string
  codigo: string
  nombre: string
  grupo: string
  total: number
  pct: number
  /** 12 posiciones (ene–dic) */
  porMes: number[]
}

export interface MesResumen {
  mes: number
  nombre: string
  llamadas: number
  riesgo_alto: number
  riesgo_medio: number
  riesgo_bajo: number
  rutas: number
}

export interface LineaResumen {
  vacio: boolean
  municipios: string[]
  años: number[]
  /** Meses con llamadas reportadas (según filtros de municipio y año) */
  meses: number[]
  ultimoMes: number
  /** Mes filtrado (0 = acumulado del año) */
  mesFiltro: number
  periodo: string
  total_llamadas: number
  promedio_mensual: number
  mes_pico: { mes: string; llamadas: number } | null
  riesgo_alto: number
  pct_riesgo_alto: number
  rutas_activadas: number
  pct_mujeres: number
  porMes: MesResumen[]
  riesgo: Parte[]
  edad: Parte[]
  genero: Parte[]
  zona: Parte[]
  eps: Parte[]
  rutas: Parte[]
  poblacion: Parte[]
  poblacionHasta: number
  hipotesis: HipotesisResumen[]
  hipotesisTotal: number
  gruposHipotesis: Parte[]
  sinHipotesis: number
  topHipotesis: HipotesisResumen | null
}

const EDAD_ORDEN = ['0 a 5 años', '6 a 12 años', '13 a 18 años', '19 a 59 años', '60 años o más', 'Sin dato']
const RIESGO_ORDEN = ['Bajo', 'Medio', 'Alto']
const GENERO_ORDEN = ['Mujer', 'Hombre', 'Otro']

function pctOf(v: number, total: number): number {
  return total > 0 ? Math.round((v / total) * 1000) / 10 : 0
}

function partes(map: Map<string, number>, orden?: string[], soloPositivos = false): Parte[] {
  const total = [...map.values()].reduce((a, b) => a + b, 0)
  let arr = [...map.entries()].map(([name, value]) => ({ name, value, pct: pctOf(value, total) }))
  if (soloPositivos) arr = arr.filter((p) => p.value > 0)
  if (orden) {
    arr.sort((a, b) => {
      const ia = orden.indexOf(a.name)
      const ib = orden.indexOf(b.name)
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib)
    })
  } else {
    arr.sort((a, b) => b.value - a.value)
  }
  return arr
}

export function filtrarIndicadores(
  rows: IndicadorLinea[],
  f: { municipio?: string | null; año?: string | null }
): IndicadorLinea[] {
  return rows.filter(
    (r) => (!f.municipio || r.municipio === f.municipio) && (!f.año || String(r.año) === f.año)
  )
}

/**
 * Agrega las filas (ya filtradas por municipio/año) en el resumen que consumen
 * el dashboard y la sección pública. `mes` (1-12) limita los indicadores de
 * distribución a un mes; la serie mensual siempre muestra todos los meses.
 */
export function agregarLinea(
  todas: IndicadorLinea[],
  filtros: { municipio?: string | null; año?: string | null; mes?: string | null } = {}
): LineaResumen {
  const rows = filtrarIndicadores(todas, filtros)
  const mesFiltro = filtros.mes ? parseInt(filtros.mes) || 0 : 0

  const municipios = [...new Set(todas.map((r) => r.municipio))].sort((a, b) => a.localeCompare(b, 'es'))
  const años = [...new Set(todas.map((r) => r.año))].sort((a, b) => b - a)

  const sumDim = (dim: LineaDimension, mes?: number) => {
    const m = new Map<string, number>()
    for (const r of rows) {
      if (r.dimension !== dim) continue
      if (mes && r.mes !== mes) continue
      m.set(r.categoria, (m.get(r.categoria) ?? 0) + r.valor)
    }
    return m
  }

  const llamadasPorMes = new Map<number, number>()
  for (const r of rows) {
    if (r.dimension === 'llamadas') llamadasPorMes.set(r.mes, (llamadasPorMes.get(r.mes) ?? 0) + r.valor)
  }
  const meses = [...llamadasPorMes.keys()].filter((m) => (llamadasPorMes.get(m) ?? 0) > 0).sort((a, b) => a - b)

  if (meses.length === 0) {
    return {
      vacio: true, municipios, años, meses: [], ultimoMes: 0, mesFiltro, periodo: '',
      total_llamadas: 0, promedio_mensual: 0, mes_pico: null, riesgo_alto: 0, pct_riesgo_alto: 0,
      rutas_activadas: 0, pct_mujeres: 0, porMes: [], riesgo: [], edad: [], genero: [], zona: [],
      eps: [], rutas: [], poblacion: [], poblacionHasta: 0, hipotesis: [], hipotesisTotal: 0,
      gruposHipotesis: [], sinHipotesis: 0, topHipotesis: null,
    }
  }

  const ultimoMes = meses[meses.length - 1]
  const mesSel = mesFiltro && meses.includes(mesFiltro) ? mesFiltro : 0

  // Serie mensual completa
  const porMes: MesResumen[] = meses.map((m) => {
    const val = (dim: LineaDimension, cat: string) =>
      rows.filter((r) => r.mes === m && r.dimension === dim && r.categoria === cat).reduce((a, r) => a + r.valor, 0)
    return {
      mes: m,
      nombre: MESES_CORTO[m - 1],
      llamadas: llamadasPorMes.get(m) ?? 0,
      riesgo_alto: val('riesgo', 'Alto'),
      riesgo_medio: val('riesgo', 'Medio'),
      riesgo_bajo: val('riesgo', 'Bajo'),
      rutas: val('ruta', 'Sí'),
    }
  })

  const mesesSel = mesSel ? [mesSel] : meses
  const total_llamadas = mesesSel.reduce((a, m) => a + (llamadasPorMes.get(m) ?? 0), 0)
  const pico = porMes.reduce((a, b) => (b.llamadas > a.llamadas ? b : a), porMes[0])

  const riesgo = partes(sumDim('riesgo', mesSel), RIESGO_ORDEN)
  const edad = partes(sumDim('edad', mesSel), EDAD_ORDEN)
  const genero = partes(sumDim('genero', mesSel), GENERO_ORDEN, true)
  const zona = partes(sumDim('zona', mesSel), ['Urbana', 'Rural'], true)
  const eps = partes(sumDim('eps', mesSel), undefined, true)
  const rutas = partes(sumDim('ruta', mesSel), ['Sí', 'No'])

  // Población diferencial: solo cuenta meses con registro
  const pobMeses = [...new Set(rows.filter((r) => r.dimension === 'poblacion').map((r) => r.mes))]
  const poblacionHasta = pobMeses.length ? Math.max(...pobMeses) : 0
  const poblacion = partes(sumDim('poblacion', mesSel), undefined, true)

  // Hipótesis
  const hip = new Map<string, HipotesisResumen>()
  for (const r of rows) {
    if (r.dimension !== 'hipotesis') continue
    let h = hip.get(r.categoria)
    if (!h) {
      const [codigo, ...resto] = (r.detalle ?? '').split('|')
      h = {
        key: r.categoria,
        codigo: codigo || r.categoria,
        nombre: resto.join('|') || r.categoria,
        grupo: grupoHipotesis(r.categoria),
        total: 0,
        pct: 0,
        porMes: Array(12).fill(0),
      }
      hip.set(r.categoria, h)
    }
    h.porMes[r.mes - 1] += r.valor
    if (!mesSel || r.mes === mesSel) h.total += r.valor
  }
  const hipotesis = [...hip.values()].filter((h) => h.total > 0).sort((a, b) => b.total - a.total)
  const hipotesisTotal = hipotesis.reduce((a, h) => a + h.total, 0)
  hipotesis.forEach((h) => (h.pct = pctOf(h.total, hipotesisTotal)))
  const grupos = new Map<string, number>()
  hipotesis.forEach((h) => grupos.set(h.grupo, (grupos.get(h.grupo) ?? 0) + h.total))
  const gruposHipotesis = partes(grupos)

  const mujeres = genero.find((g) => g.name === 'Mujer')?.value ?? 0
  const generoTotal = genero.reduce((a, g) => a + g.value, 0)
  const alto = riesgo.find((r) => r.name === 'Alto')?.value ?? 0
  const riesgoTotal = riesgo.reduce((a, r) => a + r.value, 0)
  const rutasSi = rutas.find((r) => r.name === 'Sí')?.value ?? 0

  const año = filtros.año ?? (años.length === 1 ? String(años[0]) : '')
  const periodo = mesSel
    ? `${MESES_LARGO[mesSel - 1]}${año ? ` de ${año}` : ''}`
    : meses.length === 1
      ? `${MESES_LARGO[meses[0] - 1]}${año ? ` de ${año}` : ''}`
      : `enero a ${MESES_LARGO[ultimoMes - 1]}${año ? ` de ${año}` : ''}`

  return {
    vacio: false,
    municipios,
    años,
    meses,
    ultimoMes,
    mesFiltro: mesSel,
    periodo,
    total_llamadas,
    promedio_mensual: Math.round(total_llamadas / mesesSel.length),
    mes_pico: { mes: MESES_LARGO[pico.mes - 1], llamadas: pico.llamadas },
    riesgo_alto: alto,
    pct_riesgo_alto: pctOf(alto, riesgoTotal),
    rutas_activadas: rutasSi,
    pct_mujeres: pctOf(mujeres, generoTotal),
    porMes,
    riesgo,
    edad,
    genero,
    zona,
    eps,
    rutas,
    poblacion,
    poblacionHasta,
    hipotesis,
    hipotesisTotal,
    gruposHipotesis,
    sinHipotesis: Math.max(total_llamadas - hipotesisTotal, 0),
    topHipotesis: hipotesis[0] ?? null,
  }
}
