import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/demo-mode'

export const dynamic = 'force-dynamic'

/**
 * Consulta mínima a la base de datos. Un cron diario de Vercel (vercel.json) la
 * llama para que Supabase no pause el proyecto por inactividad (plan gratuito).
 */
export async function GET() {
  if (isDemoMode()) return NextResponse.json({ ok: true, demo: true })
  const { error } = await createAdminClient()
    .from('uploads_linea')
    .select('id', { count: 'exact', head: true })
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, at: new Date().toISOString() })
}
