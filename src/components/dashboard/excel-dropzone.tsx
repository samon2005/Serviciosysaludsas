'use client'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  onSuccess: (rows: number) => void
}

export function ExcelDropzone({ onSuccess }: Props) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleFile = useCallback((f: File) => {
    if (!f.name.match(/\.(xlsx|xls)$/i)) {
      setError('Solo se aceptan archivos Excel (.xlsx, .xls)')
      return
    }
    setFile(f)
    setError('')
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const f = e.dataTransfer.files[0]
      if (f) handleFile(f)
    },
    [handleFile]
  )

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const json = await res.json()

    setUploading(false)
    if (res.ok) {
      setFile(null)
      onSuccess(json.rows_imported)
    } else {
      setError(json.error || 'Error al procesar el archivo')
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer ${
          dragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
        }`}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
        />
        <div className="text-5xl mb-4">📂</div>
        {file ? (
          <div>
            <p className="font-semibold text-gray-700">{file.name}</p>
            <p className="text-sm text-gray-400 mt-1">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ) : (
          <div>
            <p className="font-medium text-gray-600">
              Arrastra el archivo Excel aquí
            </p>
            <p className="text-sm text-gray-400 mt-1">
              o haz clic para seleccionar · .xlsx, .xls
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full text-white"
        style={{ backgroundColor: '#1A5276' }}
      >
        {uploading ? 'Procesando...' : 'Cargar datos al sistema'}
      </Button>
    </div>
  )
}
