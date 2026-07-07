import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // TEMPORAL: dashboard público — sin chequeo de sesión mientras el cliente revisa.

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 })

  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)

  const rawEventos = rows
    .map((row) => ({
      departamento: String(row['departamento'] || row['Departamento'] || '') || 'Antioquia',
      municipio: String(row['municipio'] || row['Municipio'] || '') || null,
      año: Number(row['año'] || row['Año'] || 0),
      mes: Number(row['mes'] || row['Mes'] || 0) || null,
      sexo: String(row['sexo'] || row['Sexo'] || '') || null,
      grupo_etario: String(row['grupo_etario'] || row['Grupo Etario'] || '') || null,
      metodo: String(row['metodo'] || row['Método'] || '') || null,
      tipo_evento: String(row['tipo_evento'] || row['Tipo Evento'] || '') || null,
      programa: String(row['programa'] || row['Programa'] || '') || null,
      casos: Number(row['casos'] || row['Casos'] || 0),
    }))
    .filter((e) => e.municipio && e.año > 0)

  if (rawEventos.length === 0) {
    return NextResponse.json(
      { error: 'No se encontraron filas válidas. Verifique el formato del archivo.' },
      { status: 400 }
    )
  }

  const { data: upload, error: uploadError } = await supabase
    .from('uploads')
    .insert({ filename: file.name, rows_imported: rawEventos.length })
    .select('id')
    .single()

  if (uploadError || !upload) {
    return NextResponse.json({ error: uploadError?.message || 'Error al registrar carga' }, { status: 500 })
  }

  const eventos = rawEventos.map((e) => ({ ...e, upload_id: upload.id }))

  const { error } = await supabase.from('eventos').insert(eventos)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, rows_imported: eventos.length })
}
