import { Card, CardContent } from '@/components/ui/card'
import { Phone, AlertTriangle, ShieldCheck, ArrowRightLeft } from 'lucide-react'
import type { LineaKPIData } from '@/lib/types'

interface Props {
  kpis: LineaKPIData
}

export function LineaKPICards({ kpis }: Props) {
  const cards = [
    {
      label: 'Total atenciones',
      value: kpis.total_atenciones.toLocaleString('es-CO'),
      icon: <Phone size={18} strokeWidth={1.5} />,
      color: '#154360',
      bg: '#15436012',
    },
    {
      label: 'Riesgo alto',
      value: `${kpis.pct_riesgo_alto}%`,
      icon: <AlertTriangle size={18} strokeWidth={1.5} />,
      color: '#C0392B',
      bg: '#C0392B12',
    },
    {
      label: 'Rutas de crisis activadas',
      value: kpis.rutas_activadas.toLocaleString('es-CO'),
      icon: <ShieldCheck size={18} strokeWidth={1.5} />,
      color: '#1F618D',
      bg: '#1F618D12',
    },
    {
      label: 'Canalizaciones',
      value: kpis.canalizaciones.toLocaleString('es-CO'),
      icon: <ArrowRightLeft size={18} strokeWidth={1.5} />,
      color: '#5D6D7E',
      bg: '#5D6D7E12',
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
                style={{ backgroundColor: c.bg, color: c.color }}
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
