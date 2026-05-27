'use client'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { Evento } from '@/lib/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface Props {
  eventos: Evento[]
}

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const COLORS = ['#1A5276', '#2980B9', '#5DADE2']

export function TemporalChart({ eventos }: Props) {
  const years = [...new Set(eventos.map((e) => e.año))].sort().slice(-3)

  const data = MESES.map((mes, i) => {
    const row: Record<string, string | number> = { mes }
    years.forEach((year) => {
      row[String(year)] = eventos
        .filter((e) => e.año === year && e.mes === i + 1)
        .reduce((acc, e) => acc + e.casos, 0)
    })
    return row
  })

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <h3 className="font-semibold text-sm" style={{ color: '#1C2833' }}>
          Evolución Temporal (por mes)
        </h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {years.map((year, i) => (
              <Line
                key={year}
                type="monotone"
                dataKey={String(year)}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
