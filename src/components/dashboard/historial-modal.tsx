'use client'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { X, Trash2, FileSpreadsheet, Loader2 } from 'lucide-react'
import { DeleteModal } from './delete-modal'

interface Upload {
  id: string
  filename: string
  rows_imported: number
  uploaded_at: string
}

interface Props {
  open: boolean
  onClose: () => void
  onDeleted: () => void
}

export function HistorialModal({ open, onClose, onDeleted }: Props) {
  const [uploads, setUploads] = useState<Upload[]>([])
  const [loading, setLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Upload | null>(null)

  const fetchUploads = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/dashboard/uploads')
    const json = await res.json()
    setUploads(json.uploads || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (open) fetchUploads()
  }, [open, fetchUploads])

  const handleDelete = async () => {
    if (!deleteTarget) return
    await fetch(`/api/dashboard/uploads/${deleteTarget.id}`, { method: 'DELETE' })
    setDeleteTarget(null)
    await fetchUploads()
    onDeleted()
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Historial de cargas</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>

          <div className="p-5 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 size={24} className="animate-spin text-gray-400" />
              </div>
            ) : uploads.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No hay cargas registradas.</p>
            ) : (
              <div className="space-y-2">
                {uploads.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <FileSpreadsheet size={15} style={{ color: '#1A5276' }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 truncate max-w-56">
                          {u.filename}
                        </p>
                        <p className="text-xs text-gray-400">
                          {u.rows_imported.toLocaleString('es-CO')} registros ·{' '}
                          {new Date(u.uploaded_at).toLocaleDateString('es-CO', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDeleteTarget(u)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <DeleteModal
        open={!!deleteTarget}
        title="¿Eliminar esta carga?"
        descripcion={`Se eliminarán todos los eventos importados desde "${deleteTarget?.filename}".`}
        registros={deleteTarget?.rows_imported || 0}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  )
}
