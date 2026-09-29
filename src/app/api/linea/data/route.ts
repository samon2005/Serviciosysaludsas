import { createAdminClient } from '@/lib/supabase/server'
import { isDemoMode, DEMO_MESSAGE } from '@/lib/demo-mode'
import { NextRequest, NextResponse } from 'next/server'

const NIL = '00000000-0000-0000-0000-000000000000'

export async function DELETE(req: NextRequest) {
  if (isDemoMode()) {
    return NextResponse.json({ error: DEMO_MESSAGE }, { status: 403 })
  }

  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const año = searchParams.get('año')
  const municipio = searchParams.get('municipio')
  const filtrado = Boolean(municipio || año)

  // Borrar las cargas elimina en cascada sus indicadores.
  let q = supabase.from('uploads_linea').delete()
  if (!filtrado) q = q.neq('id', NIL)
  if (municipio) q = q.eq('municipio', municipio)
  if (año) q = q.eq('año', parseInt(año))
  const { error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Filas sueltas (sin carga asociada) que coincidan con el filtro
  let q2 = supabase.from('indicadores_linea').delete()
  if (!filtrado) q2 = q2.neq('id', NIL)
  if (municipio) q2 = q2.eq('municipio', municipio)
  if (año) q2 = q2.eq('año', parseInt(año))
  const { error: error2 } = await q2
  if (error2) return NextResponse.json({ error: error2.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
