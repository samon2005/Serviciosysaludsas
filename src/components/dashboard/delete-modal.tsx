'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, X } from 'lucide-react'

interface Props {
  open: boolean
  title: string
  descripcion: string
  registros: number
  onConfirm: () => Promise<void>
  onClose: () => void
}

export function DeleteModal({ open, title, descripcion, registros, onConfirm, onClose }: Props) {
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm()
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">{descripcion}</p>
            {registros > 0 && (
              <p className="text-sm font-medium text-red-600 mt-3">
                Se eliminarán{' '}
                <span className="font-bold">{registros.toLocaleString('es-CO')}</span>{' '}
                registro{registros !== 1 ? 's' : ''}. Esta acción no se puede deshacer.
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="text-white bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
