import { createClient } from '@/lib/supabase/server'
import { isDemoMode, DEMO_MESSAGE } from '@/lib/demo-mode'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest) {
  if (isDemoMode()) {
    return NextResponse.json({ error: DEMO_MESSAGE }, { status: 403 })
  }

  const supabase = await createClient()
  const { searchParams } = new URL(req.url)

  const año = searchParams.get('año')
  const departamento = searchParams.get('departamento')
  const programa = searchParams.get('programa')
  const tipo_evento = searchParams.get('tipo_evento')

  const hasFilters = año || departamento || programa || tipo_evento

  let query = supabase.from('eventos').delete()

  if (hasFilters) {
    if (año) query = query.eq('año', parseInt(año))
    if (departamento) query = query.eq('departamento', departamento)
    if (programa) query = query.eq('programa', programa)
    if (tipo_evento) query = query.eq('tipo_evento', tipo_evento)
  } else {
    query = query.neq('id', '00000000-0000-0000-0000-000000000000')
  }

  const { error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (!hasFilters) {
    await supabase.from('uploads').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  }

  return NextResponse.json({ success: true })
}
