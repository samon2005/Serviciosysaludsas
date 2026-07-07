'use client'
import { useState } from 'react'
import { ExcelDropzone } from '@/components/dashboard/excel-dropzone'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export default function LineaUploadPage() {
  const [success, setSuccess] = useState<number | null>(null)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Cargar datos — Línea Amiga 24/7</h1>
        <p className="text-gray-500 text-sm mt-1">
          Importe registros de atenciones de la línea de crisis para actualizar los indicadores.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        {success !== null ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={48} className="text-green-600" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-ink">
              {success} registros importados
            </h2>
            <p className="text-gray-500 mb-6">
              Los datos ya están disponibles en el tablero Línea 24/7.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setSuccess(null)} variant="outline">
                Cargar otro archivo
              </Button>
              <Link href="/dashboard/linea">
                <Button className="text-white bg-brand hover:bg-brand-action transition-colors">
                  Ver tablero
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <ExcelDropzone onSuccess={setSuccess} endpoint="/api/linea/upload" />
        )}
      </div>

      <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <h3 className="font-semibold text-sm mb-2 text-brand-action">
          Formato esperado del Excel
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          El archivo debe tener las siguientes columnas en la primera hoja:
        </p>
        <div className="grid grid-cols-2 gap-1">
          {[
            'fecha',
            'hora',
            'canal',
            'sexo',
            'grupo_etario',
            'municipio',
            'motivo',
            'nivel_riesgo',
            'ruta_activada',
            'canalizado_a',
            'estado_seguimiento',
          ].map((col) => (
            <span
              key={col}
              className="bg-white rounded px-2 py-1 border border-blue-100 text-xs text-gray-600 font-mono"
            >
              {col}
            </span>
          ))}
        </div>
        <a
          href="/samples/atenciones-linea-24-7.xlsx"
          download
          className="text-xs mt-3 inline-block text-brand-action hover:underline"
        >
          Descargar plantilla de ejemplo →
        </a>
      </div>
    </div>
  )
}
