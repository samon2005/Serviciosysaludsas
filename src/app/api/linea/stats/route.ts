import { NextRequest, NextResponse } from 'next/server'
import { cargarIndicadores } from '@/lib/linea-store'
import { agregarLinea } from '@/lib/linea-aggregate'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const { rows, ultimaCarga, error } = await cargarIndicadores()
  if (error) return NextResponse.json({ error }, { status: 500 })

  const resumen = agregarLinea(rows, {
    municipio: searchParams.get('municipio'),
    año: searchParams.get('año'),
    mes: searchParams.get('mes'),
  })

  return NextResponse.json({
    resumen,
    total_registros: rows.length,
    ultima_carga: ultimaCarga,
  })
}
