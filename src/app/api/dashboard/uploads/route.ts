import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { isDemoMode, demoUploadEventos } from '@/lib/demo-mode'

export async function GET() {
  if (isDemoMode()) {
    return NextResponse.json({ uploads: [demoUploadEventos] })
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('uploads')
    .select('*')
    .order('uploaded_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ uploads: data || [] })
}
