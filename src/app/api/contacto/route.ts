import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nombre, email, mensaje, organizacion } = body

  if (!nombre || !email || !mensaje) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  console.log('Nuevo contacto:', { nombre, email, organizacion, mensaje })

  return NextResponse.json({ success: true })
}
