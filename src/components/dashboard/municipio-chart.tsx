'use client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { Evento } from '@/lib/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface Props {
  eventos: Evento[]
}

export function MunicipioChart({ eventos }: Props) {
  const data = Object.entries(
    eventos.reduce<Record<string, number>>((acc, e) => {
      const key = e.municipio || 'Sin municipio'
      acc[key] = (acc[key] || 0) + e.casos
      return acc
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([municipio, casos]) => ({
      municipio: municipio.length > 14 ? municipio.slice(0, 14) + '.' : municipio,
      casos,
    }))

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <h3 className="font-semibold text-sm text-ink">
          Top 10 Municipios — Antioquia
        </h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="municipio"
              tick={{ fontSize: 11 }}
              angle={-40}
              textAnchor="end"
              interval={0}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [v, 'Casos']} />
            <Bar dataKey="casos" fill="#154360" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
