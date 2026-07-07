import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { isDemoMode, filterAtenciones } from '@/lib/demo-mode'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  if (isDemoMode()) {
    const rows = filterAtenciones(searchParams).map(
      ({ fecha, hora, canal, sexo, grupo_etario, municipio, motivo, nivel_riesgo, ruta_activada, canalizado_a, estado_seguimiento }) =>
        ({ fecha, hora, canal, sexo, grupo_etario, municipio, motivo, nivel_riesgo, ruta_activada: ruta_activada ? 'Sí' : 'No', canalizado_a, estado_seguimiento })
    )
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Atenciones')
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="atenciones-linea-24-7.xlsx"',
      },
    })
  }

  const supabase = await createClient()

  const año = searchParams.get('año')
  const municipio = searchParams.get('municipio')
  const nivel_riesgo = searchParams.get('nivel_riesgo')
  const canal = searchParams.get('canal')

  let query = supabase.from('atenciones_linea').select(
    'fecha, hora, canal, sexo, grupo_etario, municipio, motivo, nivel_riesgo, ruta_activada, canalizado_a, estado_seguimiento'
  )

  if (año) {
    query = query
      .gte('fecha', `${año}-01-01`)
      .lte('fecha', `${año}-12-31`)
  }
  if (municipio) query = query.eq('municipio', municipio)
  if (nivel_riesgo) query = query.eq('nivel_riesgo', nivel_riesgo)
  if (canal) query = query.eq('canal', canal)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const ws = XLSX.utils.json_to_sheet(data || [])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Atenciones')

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="atenciones-linea-24-7.xlsx"',
    },
  })
}
