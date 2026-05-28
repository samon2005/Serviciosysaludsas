import { Card, CardContent } from '@/components/ui/card'
import { BarChart2, MapPin, TrendingUp, TrendingDown, FileText } from 'lucide-react'
import type { KPIData } from '@/lib/types'

interface Props {
  kpis: KPIData
}

export function KPICards({ kpis }: Props) {
  const TrendIcon = kpis.variacion_anual > 0 ? TrendingUp : TrendingDown
  const trendColor = kpis.variacion_anual > 0 ? '#E74C3C' : '#27AE60'

  const cards = [
    {
      label: 'Total de Casos',
      value: kpis.total_casos.toLocaleString('es-CO'),
      icon: <BarChart2 size={18} strokeWidth={1.5} />,
      color: '#1A5276',
    },
    {
      label: 'Departamento con más casos',
      value: kpis.top_departamento,
      icon: <MapPin size={18} strokeWidth={1.5} />,
      color: '#2980B9',
    },
    {
      label: 'Variación Anual',
      value: `${kpis.variacion_anual > 0 ? '+' : ''}${kpis.variacion_anual}%`,
      icon: <TrendIcon size={18} strokeWidth={1.5} />,
      color: trendColor,
    },
    {
      label: 'Total Registros',
      value: kpis.total_registros.toLocaleString('es-CO'),
      icon: <FileText size={18} strokeWidth={1.5} />,
      color: '#5D6D7E',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card key={c.label} className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1 font-medium tracking-wide uppercase">
                  {c.label}
                </p>
                <p className="text-2xl font-bold mt-2" style={{ color: c.color }}>
                  {c.value}
                </p>
              </div>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mt-0.5"
                style={{ backgroundColor: `${c.color}12`, color: c.color }}
              >
                {c.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
