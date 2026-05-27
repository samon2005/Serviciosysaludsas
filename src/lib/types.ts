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
  departamento?: string
  programa?: string
  tipo_evento?: string
}

export interface KPIData {
  total_casos: number
  top_departamento: string
  variacion_anual: number
  total_registros: number
}
