import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { isDemoMode, filterEventos } from '@/lib/demo-mode'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  if (isDemoMode()) {
    const rows = filterEventos(searchParams).map(
      ({ departamento, municipio, año, mes, sexo, grupo_etario, metodo, tipo_evento, programa, casos }) =>
        ({ departamento, municipio, año, mes, sexo, grupo_etario, metodo, tipo_evento, programa, casos })
    )
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Datos')
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="datos-salud-mental.xlsx"',
      },
    })
  }

  const supabase = await createClient()

  const año = searchParams.get('año')
  const departamento = searchParams.get('departamento')
  const programa = searchParams.get('programa')
  const tipo_evento = searchParams.get('tipo_evento')

  let query = supabase.from('eventos').select(
    'departamento, municipio, año, mes, sexo, grupo_etario, metodo, tipo_evento, programa, casos'
  )

  if (año) query = query.eq('año', parseInt(año))
  if (departamento) query = query.eq('departamento', departamento)
  if (programa) query = query.eq('programa', programa)
  if (tipo_evento) query = query.eq('tipo_evento', tipo_evento)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const ws = XLSX.utils.json_to_sheet(data || [])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Datos')

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="datos-salud-mental.xlsx"',
    },
  })
}
