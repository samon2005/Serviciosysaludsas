import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import {
  isDemoMode,
  filterEventos,
  demoEventos,
  demoUploadEventos,
} from '@/lib/demo-mode'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const año = searchParams.get('año')

  let data, error, totalSinFiltro, ultimaCargaData

  if (isDemoMode()) {
    data = filterEventos(searchParams)
    error = null
    totalSinFiltro = demoEventos.length
    ultimaCargaData = [{ uploaded_at: demoUploadEventos.uploaded_at }]
  } else {
    const supabase = await createClient()

    const municipio = searchParams.get('municipio')
    const programa = searchParams.get('programa')
    const tipo_evento = searchParams.get('tipo_evento')

    let query = supabase.from('eventos').select('*')

    if (año) query = query.eq('año', parseInt(año))
    if (municipio) query = query.eq('municipio', municipio)
    if (programa) query = query.eq('programa', programa)
    if (tipo_evento) query = query.eq('tipo_evento', tipo_evento)

    ;[{ data, error }, { count: totalSinFiltro }, { data: ultimaCargaData }] =
      await Promise.all([
        query,
        supabase.from('eventos').select('*', { count: 'exact', head: true }),
        supabase.from('uploads').select('uploaded_at').order('uploaded_at', { ascending: false }).limit(1),
      ])
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (!data || data.length === 0) {
    return NextResponse.json({
      eventos: [],
      kpis: {
        total_casos: 0,
        top_municipio: 'N/A',
        variacion_anual: 0,
        total_registros: 0,
      },
      total_sin_filtro: totalSinFiltro || 0,
      ultima_carga: ultimaCargaData?.[0]?.uploaded_at || null,
    })
  }

  const total_casos = data.reduce((acc, e) => acc + (e.casos || 0), 0)
  const total_registros = data.length

  const byMunicipio = data.reduce<Record<string, number>>((acc, e) => {
    const key = e.municipio || 'Sin municipio'
    acc[key] = (acc[key] || 0) + e.casos
    return acc
  }, {})
  const top_municipio =
    Object.entries(byMunicipio).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

  // Sin filtro de año, comparar el último año con datos (no el año calendario,
  // que puede no tener registros aún y daría siempre -100%).
  const currentYear = año ? parseInt(año) : Math.max(...data.map((e) => e.año))
  const currentCasos = data
    .filter((e) => e.año === currentYear)
    .reduce((acc, e) => acc + e.casos, 0)
  const prevCasos = data
    .filter((e) => e.año === currentYear - 1)
    .reduce((acc, e) => acc + e.casos, 0)
  const variacion_anual =
    prevCasos > 0
      ? Math.round(((currentCasos - prevCasos) / prevCasos) * 100)
      : 0

  return NextResponse.json({
    eventos: data,
    kpis: { total_casos, top_municipio, variacion_anual, total_registros },
    total_sin_filtro: totalSinFiltro || 0,
    ultima_carga: ultimaCargaData?.[0]?.uploaded_at || null,
  })
}
