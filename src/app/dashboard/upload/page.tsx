'use client'
import { useState } from 'react'
import { ExcelDropzone } from '@/components/dashboard/excel-dropzone'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export default function UploadPage() {
  const [success, setSuccess] = useState<number | null>(null)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#1C2833' }}>
          Cargar Datos Excel
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Importe datos de eventos para actualizar los indicadores del dashboard.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        {success !== null ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={48} style={{ color: '#27AE60' }} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: '#1C2833' }}>
              {success} registros importados
            </h2>
            <p className="text-gray-500 mb-6">
              Los datos ya están disponibles en el dashboard.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setSuccess(null)} variant="outline">
                Cargar otro archivo
              </Button>
              <Link href="/dashboard">
                <Button className="text-white" style={{ backgroundColor: '#1A5276' }}>
                  Ver Dashboard
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <ExcelDropzone onSuccess={setSuccess} />
        )}
      </div>

      <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <h3 className="font-semibold text-sm mb-2" style={{ color: '#1A5276' }}>
          Formato esperado del Excel
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          El archivo debe tener las siguientes columnas en la primera hoja:
        </p>
        <div className="grid grid-cols-2 gap-1">
          {[
            'municipio',
            'año',
            'mes',
            'sexo',
            'grupo_etario',
            'metodo',
            'tipo_evento',
            'programa',
            'casos',
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
          href="/samples/eventos-municipios-antioquia.xlsx"
          download
          className="text-xs mt-3 inline-block hover:underline"
          style={{ color: '#2980B9' }}
        >
          Descargar plantilla de ejemplo →
        </a>
      </div>
    </div>
  )
}
