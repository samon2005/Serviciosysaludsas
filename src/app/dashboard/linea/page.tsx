'use client'
import { useState, useEffect, useRef } from 'react'
import { LineaKPICards } from '@/components/dashboard/linea/linea-kpi-cards'
import { LineaFilters } from '@/components/dashboard/linea/linea-filters'
import { LineaCharts } from '@/components/dashboard/linea/linea-charts'
import { DeleteModal } from '@/components/dashboard/delete-modal'
import { HistorialModal } from '@/components/dashboard/historial-modal'
import type { AtencionLinea, LineaKPIData } from '@/lib/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Phone, ChevronDown, Download, Trash2, History, FileSpreadsheet, FileText } from 'lucide-react'

const emptyKpis: LineaKPIData = {
  total_atenciones: 0,
  pct_riesgo_alto: 0,
  rutas_activadas: 0,
  canalizaciones: 0,
}

type DeleteMode = 'all' | 'filtered' | null

export default function LineaDashboardPage() {
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [atenciones, setAtenciones] = useState<AtencionLinea[]>([])
  const [kpis, setKpis] = useState<LineaKPIData>(emptyKpis)
  const [loading, setLoading] = useState(true)
  const [totalSinFiltro, setTotalSinFiltro] = useState(0)
  const [ultimaCarga, setUltimaCarga] = useState<string | null>(null)
  const [fetchTrigger, setFetchTrigger] = useState(0)

  const [deleteMode, setDeleteMode] = useState<DeleteMode>(null)
  const [historialOpen, setHistorialOpen] = useState(false)
  const [gestionMenuOpen, setGestionMenuOpen] = useState(false)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)

  const gestionRef = useRef<HTMLDivElement>(null)
  const exportRef = useRef<HTMLDivElement>(null)
  const dashboardRef = useRef<HTMLDivElement>(null)

  const hasFilters = Object.values(filters).some(Boolean)

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v) as [string, string][]
    )
    const abortController = new AbortController()
    fetch(`/api/linea/stats?${params}`, { signal: abortController.signal })
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return
        setLoading(false)
        setAtenciones(json.atenciones || [])
        setKpis(json.kpis || emptyKpis)
        setTotalSinFiltro(json.total_sin_filtro || 0)
        setUltimaCarga(json.ultima_carga || null)
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
      abortController.abort()
    }
  }, [filters, fetchTrigger])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (gestionRef.current && !gestionRef.current.contains(e.target as Node)) {
        setGestionMenuOpen(false)
      }
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleFilter = (key: string, value: string) => {
    setLoading(true)
    setFilters((f) => ({ ...f, [key]: value }))
  }

  const refetch = () => {
    setLoading(true)
    setFetchTrigger((n) => n + 1)
  }

  const handleDelete = async () => {
    if (!deleteMode) return
    const params =
      deleteMode === 'filtered'
        ? new URLSearchParams(Object.entries(filters).filter(([, v]) => v) as [string, string][])
        : new URLSearchParams()
    await fetch(`/api/linea/data?${params}`, { method: 'DELETE' })
    setDeleteMode(null)
    refetch()
  }

  const handleExportXlsx = () => {
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v) as [string, string][]
    )
    window.open(`/api/linea/export?${params}`, '_blank')
    setExportMenuOpen(false)
  }

  const handleExportPdf = async () => {
    setExportMenuOpen(false)
    if (!dashboardRef.current) return

    const { default: html2canvas } = await import('html2canvas')
    const { jsPDF } = await import('jspdf')

    const canvas = await html2canvas(dashboardRef.current, {
      scale: 1.5,
      useCORS: true,
      backgroundColor: '#FAFBFC',
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] })
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save('dashboard-linea-24-7.pdf')
  }

  const deleteConfig =
    deleteMode === 'all'
      ? {
          title: '¿Eliminar todos los datos?',
          descripcion: 'Se borrarán todos los registros de la Línea 24/7 y el historial de cargas.',
          registros: totalSinFiltro,
        }
      : {
          title: '¿Eliminar registros filtrados?',
          descripcion: 'Se borrarán los registros que coinciden con los filtros activos.',
          registros: atenciones.length,
        }

  return (
    <>
      <div ref={dashboardRef} className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-ink">
              Línea Amiga 24/7 — Indicadores
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Atenciones de la línea de crisis · Antioquia
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Exportar dropdown */}
            <div ref={exportRef} className="relative">
              <Button
                variant="outline"
                className="gap-1.5"
                onClick={() => {
                  setExportMenuOpen((v) => !v)
                  setGestionMenuOpen(false)
                }}
              >
                <Download size={15} />
                Exportar
                <ChevronDown size={14} />
              </Button>
              {exportMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                  <button
                    onClick={handleExportXlsx}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FileSpreadsheet size={15} className="text-green-600" />
                    Descargar Excel
                  </button>
                  <button
                    onClick={handleExportPdf}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FileText size={15} className="text-red-500" />
                    Descargar PDF
                  </button>
                </div>
              )}
            </div>

            {/* Gestionar datos dropdown */}
            <div ref={gestionRef} className="relative">
              <Button
                variant="outline"
                className="gap-1.5"
                onClick={() => {
                  setGestionMenuOpen((v) => !v)
                  setExportMenuOpen(false)
                }}
              >
                <Trash2 size={15} />
                Gestionar datos
                <ChevronDown size={14} />
              </Button>
              {gestionMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                  <button
                    onClick={() => {
                      setDeleteMode('all')
                      setGestionMenuOpen(false)
                    }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Trash2 size={15} className="text-red-500" />
                    Borrar todos los datos
                  </button>
                  <button
                    disabled={!hasFilters}
                    onClick={() => {
                      if (!hasFilters) return
                      setDeleteMode('filtered')
                      setGestionMenuOpen(false)
                    }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={15} className="text-orange-400" />
                    Borrar selección actual
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={() => {
                      setHistorialOpen(true)
                      setGestionMenuOpen(false)
                    }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <History size={15} className="text-blue-500" />
                    Historial de cargas
                  </button>
                </div>
              )}
            </div>

            <Link href="/dashboard/linea/upload">
              <Button className="text-white bg-brand hover:bg-brand-action transition-colors">
                + Cargar Excel
              </Button>
            </Link>
          </div>
        </div>

        <LineaFilters filters={filters} onChange={handleFilter} />

        {/* Contador + última carga */}
        {!loading && totalSinFiltro > 0 && (
          <p className="text-xs text-gray-400 -mt-2">
            Mostrando{' '}
            <span className="font-medium text-gray-600">
              {atenciones.length.toLocaleString('es-CO')}
            </span>{' '}
            de{' '}
            <span className="font-medium text-gray-600">
              {totalSinFiltro.toLocaleString('es-CO')}
            </span>{' '}
            registros
            {ultimaCarga && (
              <>
                {' '}·{' '}Última carga:{' '}
                <span className="font-medium text-gray-600">
                  {new Date(ultimaCarga).toLocaleDateString('es-CO', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </>
            )}
          </p>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400 text-sm">Cargando datos...</div>
          </div>
        ) : atenciones.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="flex justify-center mb-4">
              <Phone size={48} className="text-slate-300" strokeWidth={1} />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-ink">Sin datos aún</h2>
            <p className="text-gray-500 mb-6">
              Cargue un archivo Excel con registros de atenciones para visualizar los indicadores.
            </p>
            <Link href="/dashboard/linea/upload">
              <Button className="text-white bg-brand hover:bg-brand-action transition-colors">
                Cargar primer Excel
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <LineaKPICards kpis={kpis} />
            <LineaCharts atenciones={atenciones} />
          </>
        )}
      </div>

      <DeleteModal
        open={!!deleteMode}
        title={deleteConfig.title}
        descripcion={deleteConfig.descripcion}
        registros={deleteConfig.registros}
        onConfirm={handleDelete}
        onClose={() => setDeleteMode(null)}
      />

      <HistorialModal
        open={historialOpen}
        onClose={() => setHistorialOpen(false)}
        onDeleted={refetch}
        uploadsEndpoint="/api/linea/uploads"
      />
    </>
  )
}
