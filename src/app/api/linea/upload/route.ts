import { NextRequest, NextResponse } from 'next/server'
import { isDemoMode, DEMO_MESSAGE } from '@/lib/demo-mode'
import { createAdminClient } from '@/lib/supabase/server'
import { parseLineaWorkbook } from '@/lib/linea-parser'

const CHUNK = 500

/**
 * Recibe el Excel mensual de la Línea 24/7 (una hoja por indicador).
 * - `preview=1` solo lee el archivo y devuelve el resumen (funciona también en modo demo).
 * - Al guardar, reemplaza lo cargado antes para el mismo municipio y año, porque
 *   cada Excel trae el acumulado de enero al último mes reportado.
 */
export async function POST(req: NextRequest) {
  const preview = new URL(req.url).searchParams.get('preview') === '1'
  if (!preview && isDemoMode()) {
    return NextResponse.json({ error: DEMO_MESSAGE }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const municipio = String(formData.get('municipio') ?? '').trim()
  const año = parseInt(String(formData.get('año') ?? formData.get('anio') ?? ''))

  if (!file) return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 })
  if (!municipio) return NextResponse.json({ error: 'Seleccione el municipio del archivo.' }, { status: 400 })
  if (!año || año < 2020 || año > 2100) {
    return NextResponse.json({ error: 'Indique un año válido.' }, { status: 400 })
  }

  let parsed
  try {
    parsed = parseLineaWorkbook(await file.arrayBuffer(), { municipio, año })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'No se pudo leer el archivo Excel.' },
      { status: 400 }
    )
  }

  const resumen = {
    municipio,
    año,
    meses: parsed.meses,
    hojas: parsed.hojas,
    warnings: parsed.warnings,
    ...parsed.resumen,
    filas: parsed.rows.length,
  }
  if (preview) return NextResponse.json({ preview: true, ...resumen })

  const supabase = createAdminClient()

  // Reemplazo por municipio + año
  const { error: delErr } = await supabase
    .from('uploads_linea')
    .delete()
    .eq('municipio', municipio)
    .eq('año', año)
  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 })
  await supabase.from('indicadores_linea').delete().eq('municipio', municipio).eq('año', año)

  const { data: upload, error: upErr } = await supabase
    .from('uploads_linea')
    .insert({ filename: file.name, rows_imported: parsed.rows.length, municipio, año })
    .select('id')
    .single()
  if (upErr || !upload) {
    return NextResponse.json({ error: upErr?.message || 'Error al registrar la carga' }, { status: 500 })
  }

  const payload = parsed.rows.map((r) => ({ ...r, upload_id: upload.id }))
  for (let i = 0; i < payload.length; i += CHUNK) {
    const { error } = await supabase.from('indicadores_linea').insert(payload.slice(i, i + CHUNK))
    if (error) {
      await supabase.from('uploads_linea').delete().eq('id', upload.id)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true, rows_imported: payload.length, ...resumen })
}
