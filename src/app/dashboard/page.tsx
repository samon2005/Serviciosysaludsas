'use client'
import { useState, useEffect, useCallback } from 'react'
import { KPICards } from '@/components/dashboard/kpi-cards'
import { DashboardFilters } from '@/components/dashboard/filters'
import { DepartamentoChart } from '@/components/dashboard/departamento-chart'
import { TemporalChart } from '@/components/dashboard/temporal-chart'
import { DistribucionCharts } from '@/components/dashboard/distribucion-charts'
import type { Evento, KPIData } from '@/lib/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const emptyKpis: KPIData = {
  total_casos: 0,
  top_departamento: 'N/A',
  variacion_anual: 0,
  total_registros: 0,
}

export default function DashboardPage() {
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [eventos, setEventos] = useState<Evento[]>([])
  const [kpis, setKpis] = useState<KPIData>(emptyKpis)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v) as [string, string][]
    )
    const res = await fetch(`/api/dashboard/stats?${params}`)
    const json = await res.json()
    setEventos(json.eventos || [])
    setKpis(json.kpis || emptyKpis)
    setLoading(false)
  }, [filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleFilter = (key: string, value: string) =>
    setFilters((f) => ({ ...f, [key]: value }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1C2833' }}>
            Panel de Indicadores
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Conducta suicida y salud mental — Colombia
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button className="text-white" style={{ backgroundColor: '#1A5276' }}>
            + Cargar Excel
          </Button>
        </Link>
      </div>

      <DashboardFilters filters={filters} onChange={handleFilter} />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 text-sm">Cargando datos...</div>
        </div>
      ) : eventos.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <p className="text-5xl mb-4">📊</p>
          <h2 className="text-xl font-semibold mb-2" style={{ color: '#1C2833' }}>
            Sin datos aún
          </h2>
          <p className="text-gray-500 mb-6">
            Cargue un archivo Excel para visualizar los indicadores.
          </p>
          <Link href="/dashboard/upload">
            <Button className="text-white" style={{ backgroundColor: '#1A5276' }}>
              Cargar primer Excel
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <KPICards kpis={kpis} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DepartamentoChart eventos={eventos} />
            <TemporalChart eventos={eventos} />
          </div>
          <DistribucionCharts eventos={eventos} />
        </>
      )}
    </div>
  )
}
