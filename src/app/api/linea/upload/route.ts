import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { createClient } from '@/lib/supabase/server'

/** Excel serial date to YYYY-MM-DD */
function excelSerialToDate(serial: number): string {
  // Excel epoch: Jan 1 1900 (with leap-year bug: serial 1 = Jan 1 1900)
  const date = new Date(Math.round((serial - 25569) * 86400 * 1000))
  return date.toISOString().slice(0, 10)
}

function parseDate(raw: unknown): string | null {
  if (raw == null || raw === '') return null
  if (typeof raw === 'number') {
    // Likely an Excel serial number
    try {
      return excelSerialToDate(raw)
    } catch {
      return null
    }
  }
  if (raw instanceof Date) {
    return raw.toISOString().slice(0, 10)
  }
  const s = String(raw).trim()
  // Try ISO or DD/MM/YYYY or similar
  const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`
  const dmyMatch = s.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})/)
  if (dmyMatch) return `${dmyMatch[3]}-${dmyMatch[2].padStart(2, '0')}-${dmyMatch[1].padStart(2, '0')}`
  return null
}

function parseRutaActivada(raw: unknown): boolean {
  if (raw == null) return false
  if (typeof raw === 'boolean') return raw
  if (typeof raw === 'number') return raw !== 0
  const s = String(raw).trim().toLowerCase()
  return s === 'sí' || s === 'si' || s === 'true' || s === '1' || s === 'yes'
}

function str(v: unknown): string | null {
  if (v == null) return null
  const s = String(v).trim()
  return s || null
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // TEMPORAL: dashboard público — sin chequeo de sesión mientras el cliente revisa.

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 })

  const buffer = await file.arrayBuffer()
  // cellDates:true makes XLSX parse date cells as JS Date objects automatically
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)

  const rawAtenciones = rows
    .map((row) => {
      const fechaRaw =
        row['fecha'] ?? row['Fecha'] ?? row['FECHA']
      const canalRaw = str(row['canal'] ?? row['Canal'] ?? row['CANAL'])

      const fecha = parseDate(fechaRaw)

      return {
        fecha,
        hora: str(row['hora'] ?? row['Hora'] ?? row['HORA']),
        canal: canalRaw,
        sexo: str(row['sexo'] ?? row['Sexo'] ?? row['SEXO']),
        grupo_etario: str(
          row['grupo_etario'] ??
            row['Grupo Etario'] ??
            row['Grupo_etario'] ??
            row['GRUPO_ETARIO']
        ),
        municipio: str(row['municipio'] ?? row['Municipio'] ?? row['MUNICIPIO']),
        motivo: str(row['motivo'] ?? row['Motivo'] ?? row['MOTIVO']),
        nivel_riesgo: str(
          row['nivel_riesgo'] ??
            row['Nivel Riesgo'] ??
            row['Nivel_riesgo'] ??
            row['NIVEL_RIESGO'] ??
            row['nivel riesgo']
        ),
        ruta_activada: parseRutaActivada(
          row['ruta_activada'] ??
            row['Ruta Activada'] ??
            row['Ruta_activada'] ??
            row['RUTA_ACTIVADA'] ??
            row['ruta activada']
        ),
        canalizado_a: str(
          row['canalizado_a'] ??
            row['Canalizado a'] ??
            row['Canalizado_a'] ??
            row['CANALIZADO_A'] ??
            row['canalizado a']
        ),
        estado_seguimiento: str(
          row['estado_seguimiento'] ??
            row['Estado Seguimiento'] ??
            row['Estado_seguimiento'] ??
            row['ESTADO_SEGUIMIENTO'] ??
            row['estado seguimiento']
        ),
      }
    })
    .filter((a) => a.fecha && a.canal)

  if (rawAtenciones.length === 0) {
    return NextResponse.json(
      { error: 'No se encontraron filas válidas. Verifique que el archivo tenga las columnas "fecha" y "canal".' },
      { status: 400 }
    )
  }

  const { data: upload, error: uploadError } = await supabase
    .from('uploads_linea')
    .insert({ filename: file.name, rows_imported: rawAtenciones.length })
    .select('id')
    .single()

  if (uploadError || !upload) {
    return NextResponse.json(
      { error: uploadError?.message || 'Error al registrar carga' },
      { status: 500 }
    )
  }

  const atenciones = rawAtenciones.map((a) => ({ ...a, upload_id: upload.id }))

  const { error } = await supabase.from('atenciones_linea').insert(atenciones)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, rows_imported: atenciones.length })
}
