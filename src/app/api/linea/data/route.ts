import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)

  const año = searchParams.get('año')
  const municipio = searchParams.get('municipio')
  const nivel_riesgo = searchParams.get('nivel_riesgo')
  const canal = searchParams.get('canal')

  const hasFilters = año || municipio || nivel_riesgo || canal

  let query = supabase.from('atenciones_linea').delete()

  if (hasFilters) {
    if (año) {
      query = query
        .gte('fecha', `${año}-01-01`)
        .lte('fecha', `${año}-12-31`)
    }
    if (municipio) query = query.eq('municipio', municipio)
    if (nivel_riesgo) query = query.eq('nivel_riesgo', nivel_riesgo)
    if (canal) query = query.eq('canal', canal)
  } else {
    query = query.neq('id', '00000000-0000-0000-0000-000000000000')
  }

  const { error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (!hasFilters) {
    await supabase
      .from('uploads_linea')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
  }

  return NextResponse.json({ success: true })
}
