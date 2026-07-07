import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { isDemoMode, demoUploadLinea } from '@/lib/demo-mode'

export async function GET() {
  if (isDemoMode()) {
    return NextResponse.json({ uploads: [demoUploadLinea] })
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('uploads_linea')
    .select('*')
    .order('uploaded_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ uploads: data || [] })
}
