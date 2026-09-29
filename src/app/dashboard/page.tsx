'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Download, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LineaKPICards } from '@/components/dashboard/linea/linea-kpi-cards'
import { LineaFilters } from '@/components/dashboard/linea/linea-filters'
import { LineaCharts } from '@/components/dashboard/linea/linea-charts'
import type { LineaResumen } from '@/lib/linea-aggregate'

const MUNICIPIO_INICIAL = 'La Estrella'

/** Vista municipal: el resumen de la Línea 24/7 por municipio (La Estrella por defecto). */
export default function IndicadoresMunicipalesPage() {
  const [filters, setFilters] = useState<Record<string, string>>({ municipio: MUNICIPIO_INICIAL })
  const [resumen, setResumen] = useState<LineaResumen | null>(null)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelado = false
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v) as [string, string][])
    fetch(`/api/linea/stats?${params}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelado) return
        const r: LineaResumen | undefined = json.resumen
        // Si La Estrella aún no tiene datos, mostrar el primer municipio disponible
        if (r?.vacio && filters.municipio === MUNICIPIO_INICIAL && r.municipios.length > 0 && !r.municipios.includes(MUNICIPIO_INICIAL)) {
          setFilters({ municipio: r.municipios[0] })
          return
        }
        setResumen(r ?? null)
        setTotal(json.total_registros || 0)
        setLoading(false)
      })
      .catch(() => !cancelado && setLoading(false))
    return () => {
      cancelado = true
    }
  }, [filters])

  const cambiar = (key: string, value: string) => {
    setLoading(true)
    setFilters((f) => ({ ...f, [key]: value }))
  }
  const query = new URLSearchParams(Object.entries(filters).filter(([, v]) => v) as [string, string][]).toString()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Indicadores Municipales — Antioquia</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin size={14} /> Resumen por municipio de la Línea de Atención 24/7
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href={`/api/linea/export?${query}`}>
            <Button variant="outline" className="gap-1.5">
              <Download size={15} /> Exportar Excel
            </Button>
          </a>
          <Link href="/dashboard/linea/upload">
            <Button className="bg-brand text-white hover:bg-brand-action">+ Cargar Excel</Button>
          </Link>
        </div>
      </div>

      {resumen && (
        <LineaFilters
          filters={filters}
          onChange={cambiar}
          municipios={resumen.municipios}
          años={resumen.años}
          meses={resumen.meses}
        />
      )}

      {loading && !resumen ? (
        <div className="flex h-64 items-center justify-center text-sm text-gray-400">Cargando datos...</div>
      ) : !resumen || resumen.vacio ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-ink">
            {total > 0 ? 'Sin datos para esta selección' : 'Sin datos aún'}
          </h2>
          <p className="mb-6 text-gray-500">
            {total > 0 ? 'Pruebe con otro municipio o año.' : 'Cargue el Excel mensual para visualizar los indicadores.'}
          </p>
          {total === 0 && (
            <Link href="/dashboard/linea/upload">
              <Button className="bg-brand text-white hover:bg-brand-action">Cargar primer Excel</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className={`space-y-4 transition-opacity ${loading ? 'opacity-60' : ''}`}>
          <LineaKPICards r={resumen} />
          <LineaCharts r={resumen} variante="resumen" />
          <Link
            href="/dashboard/linea"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-action hover:underline"
          >
            Ver el detalle completo de la Línea 24/7 <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </div>
  )
}
