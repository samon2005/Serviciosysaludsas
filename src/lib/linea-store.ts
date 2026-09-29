import { createAdminClient } from '@/lib/supabase/server'
import { isDemoMode, demoIndicadoresLinea, demoUploadLinea } from '@/lib/demo-mode'
import type { IndicadorLinea } from '@/lib/types'

const PAGE = 1000

/** Todas las filas de indicadores (son pocas: ~500 por municipio y año). */
export async function cargarIndicadores(): Promise<{ rows: IndicadorLinea[]; ultimaCarga: string | null; error?: string }> {
  if (isDemoMode()) {
    return { rows: demoIndicadoresLinea, ultimaCarga: demoUploadLinea.uploaded_at }
  }
  const supabase = createAdminClient()
  const rows: IndicadorLinea[] = []
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('indicadores_linea')
      .select('*')
      .order('created_at', { ascending: true })
      .order('id', { ascending: true })
      .range(from, from + PAGE - 1)
    if (error) return { rows: [], ultimaCarga: null, error: error.message }
    rows.push(
      ...(data as Record<string, unknown>[]).map(
        (d) =>
          ({
            municipio: d.municipio,
            año: d.año,
            mes: d.mes,
            dimension: d.dimension,
            categoria: d.categoria,
            detalle: d.detalle,
            valor: d.valor,
          }) as IndicadorLinea
      )
    )
    if (!data || data.length < PAGE) break
  }
  const { data: up } = await supabase
    .from('uploads_linea')
    .select('uploaded_at')
    .order('uploaded_at', { ascending: false })
    .limit(1)
  return { rows, ultimaCarga: up?.[0]?.uploaded_at ?? null }
}
