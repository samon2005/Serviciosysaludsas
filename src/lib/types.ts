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

export interface AtencionLinea {
  id: string
  fecha: string
  hora: string | null
  canal: string
  sexo: string | null
  grupo_etario: string | null
  municipio: string | null
  motivo: string | null
  nivel_riesgo: string | null
  ruta_activada: boolean
  canalizado_a: string | null
  estado_seguimiento: string | null
  upload_id: string | null
  created_at: string
}

export interface LineaKPIData {
  total_atenciones: number
  pct_riesgo_alto: number
  rutas_activadas: number
  canalizaciones: number
}

export interface LineaFilters {
  año?: string
  municipio?: string
  nivel_riesgo?: string
  canal?: string
}
