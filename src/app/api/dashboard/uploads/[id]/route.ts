import { createClient } from '@/lib/supabase/server'
import { isDemoMode, DEMO_MESSAGE } from '@/lib/demo-mode'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (isDemoMode()) {
    return NextResponse.json({ error: DEMO_MESSAGE }, { status: 403 })
  }

  const supabase = await createClient()
  const { id } = await params

  const { error } = await supabase.from('uploads').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
