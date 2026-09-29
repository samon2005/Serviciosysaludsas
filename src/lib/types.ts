export interface Evento {
  id: string
  departamento: string
  municipio: string | null
  año: number
  mes: number | null
  sexo: string | null
  grupo_etario: string | null
  metodo: string | null
  tipo_evento: string | null
  programa: string | null
  casos: number
  created_at: string
}

export interface DashboardFilters {
  año?: string
  municipio?: string
  programa?: string
  tipo_evento?: string
}

export interface KPIData {
  total_casos: number
  top_municipio: string
  variacion_anual: number
  total_registros: number
}

export type LineaDimension =
  | 'llamadas'
  | 'edad'
  | 'riesgo'
  | 'genero'
  | 'zona'
  | 'eps'
  | 'ruta'
  | 'poblacion'
  | 'hipotesis'

/** Una celda del Excel mensual de la Línea 24/7 (formato largo). */
export interface IndicadorLinea {
  municipio: string
  año: number
  mes: number
  dimension: LineaDimension
  categoria: string
  /** Solo hipótesis: nombre completo del diagnóstico */
  detalle?: string | null
  valor: number
}

export interface LineaFilters {
  año?: string
  municipio?: string
  mes?: string
}
