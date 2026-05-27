import { Card, CardContent } from '@/components/ui/card'
import type { KPIData } from '@/lib/types'

interface Props {
  kpis: KPIData
}

export function KPICards({ kpis }: Props) {
  const cards = [
    {
      label: 'Total de Casos',
      value: kpis.total_casos.toLocaleString('es-CO'),
      icon: '📊',
      color: '#1A5276',
    },
    {
      label: 'Departamento con más casos',
      value: kpis.top_departamento,
      icon: '📍',
      color: '#2980B9',
    },
    {
      label: 'Variación Anual',
      value: `${kpis.variacion_anual > 0 ? '+' : ''}${kpis.variacion_anual}%`,
      icon: kpis.variacion_anual > 0 ? '📈' : '📉',
      color: kpis.variacion_anual > 0 ? '#E74C3C' : '#27AE60',
    },
    {
      label: 'Total Registros',
      value: kpis.total_registros.toLocaleString('es-CO'),
      icon: '📋',
      color: '#8E44AD',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card key={c.label} className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{c.label}</p>
                <p className="text-2xl font-bold" style={{ color: c.color }}>
                  {c.value}
                </p>
              </div>
              <span className="text-2xl">{c.icon}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
