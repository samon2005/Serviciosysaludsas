import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import {
  isDemoMode,
  filterAtenciones,
  demoAtenciones,
  demoUploadLinea,
} from '@/lib/demo-mode'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  let data, error, totalSinFiltro, ultimaCargaData

  if (isDemoMode()) {
    data = filterAtenciones(searchParams)
    error = null
    totalSinFiltro = demoAtenciones.length
    ultimaCargaData = [{ uploaded_at: demoUploadLinea.uploaded_at }]
  } else {
    const supabase = await createClient()

    const año = searchParams.get('año')
    const municipio = searchParams.get('municipio')
    const nivel_riesgo = searchParams.get('nivel_riesgo')
    const canal = searchParams.get('canal')

    let query = supabase.from('atenciones_linea').select('*')

    if (año) {
      query = query
        .gte('fecha', `${año}-01-01`)
        .lte('fecha', `${año}-12-31`)
    }
    if (municipio) query = query.eq('municipio', municipio)
    if (nivel_riesgo) query = query.eq('nivel_riesgo', nivel_riesgo)
    if (canal) query = query.eq('canal', canal)

    ;[{ data, error }, { count: totalSinFiltro }, { data: ultimaCargaData }] =
      await Promise.all([
        query,
        supabase.from('atenciones_linea').select('*', { count: 'exact', head: true }),
        supabase
          .from('uploads_linea')
          .select('uploaded_at')
          .order('uploaded_at', { ascending: false })
          .limit(1),
      ])
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (!data || data.length === 0) {
    return NextResponse.json({
      atenciones: [],
      kpis: {
        total_atenciones: 0,
        pct_riesgo_alto: 0,
        rutas_activadas: 0,
        canalizaciones: 0,
      },
      total_sin_filtro: totalSinFiltro || 0,
      ultima_carga: ultimaCargaData?.[0]?.uploaded_at || null,
    })
  }

  const total_atenciones = data.length
  const alto = data.filter((a) => a.nivel_riesgo === 'Alto').length
  const pct_riesgo_alto = Math.round((alto / total_atenciones) * 100)
  const rutas_activadas = data.filter((a) => a.ruta_activada === true).length
  const canalizaciones = data.filter(
    (a) => a.canalizado_a && a.canalizado_a !== 'No requirió'
  ).length

  return NextResponse.json({
    atenciones: data,
    kpis: { total_atenciones, pct_riesgo_alto, rutas_activadas, canalizaciones },
    total_sin_filtro: totalSinFiltro || 0,
    ultima_carga: ultimaCargaData?.[0]?.uploaded_at || null,
  })
}
