'use client'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CheckCircle2, FileSpreadsheet, AlertTriangle, Loader2, Info } from 'lucide-react'
import { MESES_LARGO } from '@/lib/linea-aggregate'

const MUNICIPIOS = [
  'La Estrella', 'Sabaneta', 'Itagüí', 'Envigado', 'Caldas', 'Medellín', 'Bello', 'Copacabana',
  'Girardota', 'Barbosa', 'Rionegro', 'Marinilla', 'La Ceja', 'Guarne', 'Apartadó', 'Turbo', 'Caucasia',
]

interface Resumen {
  municipio: string
  año: number
  meses: number[]
  hojas: string[]
  warnings: string[]
  llamadas: number
  hipotesis: number
  ultimoMes: number
  filas: number
}

const campo =
  'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-brand-action focus:ring-2 focus:ring-brand-action/20'

export default function LineaUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [municipio, setMunicipio] = useState('La Estrella')
  const [año, setAño] = useState(String(new Date().getFullYear()))
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [resumen, setResumen] = useState<Resumen | null>(null)
  const [hecho, setHecho] = useState<Resumen | null>(null)

  const elegir = useCallback((f: File) => {
    if (!/\.(xlsx|xls)$/i.test(f.name)) {
      setError('Solo se aceptan archivos Excel (.xlsx, .xls)')
      return
    }
    setFile(f)
    setResumen(null)
    setError('')
  }, [])

  const enviar = async (preview: boolean) => {
    if (!file) return
    setBusy(true)
    setError('')
    const fd = new FormData()
    fd.append('file', file)
    fd.append('municipio', municipio.trim())
    fd.append('anio', año)
    try {
      const res = await fetch(`/api/linea/upload${preview ? '?preview=1' : ''}`, { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'No se pudo procesar el archivo')
      } else if (preview) {
        setResumen(json)
      } else {
        setHecho(json)
      }
    } catch {
      setError('Error de conexión. Intente de nuevo.')
    } finally {
      setBusy(false)
    }
  }

  const reiniciar = () => {
    setFile(null)
    setResumen(null)
    setHecho(null)
    setError('')
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Cargar datos — Línea de Atención 24/7</h1>
        <p className="mt-1 text-sm text-gray-500">
          Suba el Excel mensual de análisis de datos de un municipio para actualizar los indicadores.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-sm">
        {hecho ? (
          <div className="py-8 text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircle2 size={48} className="text-green-600" strokeWidth={1.5} />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-ink">
              {hecho.llamadas.toLocaleString('es-CO')} llamadas de {hecho.municipio} cargadas
            </h2>
            <p className="mb-6 text-gray-500">
              Enero a {MESES_LARGO[hecho.ultimoMes - 1]} de {hecho.año}. Los datos anteriores de este municipio y año
              fueron reemplazados por esta carga.
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={reiniciar} variant="outline">
                Cargar otro archivo
              </Button>
              <Link href="/dashboard/linea">
                <Button className="bg-brand text-white transition-colors hover:bg-brand-action">Ver tablero</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Label className="mb-1 block text-xs text-slate-500">Municipio del archivo</Label>
                <input
                  list="municipios-linea"
                  value={municipio}
                  onChange={(e) => {
                    setMunicipio(e.target.value)
                    setResumen(null)
                  }}
                  className={campo}
                  placeholder="Ej. La Estrella"
                />
                <datalist id="municipios-linea">
                  {MUNICIPIOS.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </div>
              <div>
                <Label className="mb-1 block text-xs text-slate-500">Año</Label>
                <input
                  type="number"
                  value={año}
                  onChange={(e) => {
                    setAño(e.target.value)
                    setResumen(null)
                  }}
                  className={campo}
                />
              </div>
            </div>

            <div
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                const f = e.dataTransfer.files[0]
                if (f) elegir(f)
              }}
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onClick={() => document.getElementById('linea-file')?.click()}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
                dragging ? 'border-brand-action bg-sky-50' : 'border-slate-200 hover:border-brand-action/60'
              }`}
            >
              <input
                id="linea-file"
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && elegir(e.target.files[0])}
              />
              <FileSpreadsheet size={36} className="mx-auto mb-3 text-slate-300" strokeWidth={1.3} />
              {file ? (
                <>
                  <p className="font-medium text-ink">{file.name}</p>
                  <p className="mt-1 text-sm text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                </>
              ) : (
                <>
                  <p className="font-medium text-gray-600">Arrastre el Excel aquí</p>
                  <p className="mt-1 text-sm text-gray-400">o haga clic para seleccionarlo · .xlsx, .xls</p>
                </>
              )}
            </div>

            {error && (
              <p className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                <AlertTriangle size={16} className="mt-0.5 flex-none" /> {error}
              </p>
            )}

            {resumen && (
              <div className="space-y-3 rounded-xl border border-sky-100 bg-sky-50/60 p-4 text-sm">
                <p className="font-semibold text-ink">Revisión del archivo</p>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-600">
                  <li>
                    Llamadas: <b className="text-ink">{resumen.llamadas.toLocaleString('es-CO')}</b>
                  </li>
                  <li>
                    Meses: <b className="text-ink">enero a {MESES_LARGO[resumen.ultimoMes - 1]}</b>
                  </li>
                  <li>
                    Hipótesis distintas: <b className="text-ink">{resumen.hipotesis}</b>
                  </li>
                  <li>
                    Hojas leídas: <b className="text-ink">{resumen.hojas.length}</b>
                  </li>
                </ul>
                {resumen.warnings.length > 0 && (
                  <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                    <p className="mb-1 flex items-center gap-1.5 font-semibold">
                      <Info size={13} /> Observaciones del archivo (no impiden la carga)
                    </p>
                    <ul className="list-disc space-y-0.5 pl-4">
                      {resumen.warnings.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-xs text-slate-500">
                  Al confirmar, se reemplazan los datos ya cargados de {resumen.municipio} para {resumen.año}.
                </p>
              </div>
            )}

            {resumen ? (
              <Button
                onClick={() => enviar(false)}
                disabled={busy}
                className="w-full bg-brand text-white hover:bg-brand-action"
              >
                {busy ? <Loader2 size={16} className="animate-spin" /> : 'Confirmar y cargar al sistema'}
              </Button>
            ) : (
              <Button
                onClick={() => enviar(true)}
                disabled={!file || !municipio.trim() || busy}
                className="w-full bg-brand text-white hover:bg-brand-action"
              >
                {busy ? <Loader2 size={16} className="animate-spin" /> : 'Revisar archivo'}
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-brand-action">Formato esperado del Excel</h3>
        <p className="mb-3 text-xs text-gray-500">
          Un libro con una hoja por indicador y los meses en columnas (Enero, Febrero…). Cada mes se acumula en el mismo
          archivo; al subir el del mes siguiente se actualiza todo el año.
        </p>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
          {['LLAMADAS', 'EDAD', 'RIESGO', 'GÉNERO', 'ZONA', 'EPS', 'RUTAS ACTIVADAS', 'POBLACIÓN DIFERENCIAL', 'ORDEN HIPOTESIS'].map(
            (h) => (
              <span key={h} className="rounded border border-blue-100 bg-white px-2 py-1 font-mono text-xs text-gray-600">
                {h}
              </span>
            )
          )}
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Los porcentajes del Excel no se usan: el sistema los recalcula desde los conteos para evitar inconsistencias.
        </p>
        <a
          href="/samples/analisis-datos-mensuales-la-estrella.xlsx"
          download
          className="mt-3 inline-block text-xs text-brand-action hover:underline"
        >
          Descargar archivo de ejemplo (La Estrella) →
        </a>
      </div>
    </div>
  )
}
