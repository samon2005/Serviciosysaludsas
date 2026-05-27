'use client'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import type { Evento } from '@/lib/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface Props {
  eventos: Evento[]
}

const COLORS = ['#1A5276', '#2980B9', '#5DADE2', '#85C1E9', '#AED6F1']

export function DistribucionCharts({ eventos }: Props) {
  const porSexo = Object.entries(
    eventos.reduce<Record<string, number>>((acc, e) => {
      if (e.sexo) acc[e.sexo] = (acc[e.sexo] || 0) + e.casos
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  const porEtario = Object.entries(
    eventos.reduce<Record<string, number>>((acc, e) => {
      if (e.grupo_etario) acc[e.grupo_etario] = (acc[e.grupo_etario] || 0) + e.casos
      return acc
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .map(([grupo_etario, casos]) => ({ grupo_etario, casos }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-sm" style={{ color: '#1C2833' }}>
            Distribución por Sexo
          </h3>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={porSexo}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name ?? ''} ${(((percent as number | undefined) ?? 0) * 100).toFixed(0)}%`
                }
                labelLine={false}
                fontSize={12}
              >
                {porSexo.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [v, 'Casos']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-sm" style={{ color: '#1C2833' }}>
            Casos por Grupo Etario
          </h3>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={porEtario}
              margin={{ top: 5, right: 10, left: 0, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="grupo_etario"
                tick={{ fontSize: 10 }}
                angle={-30}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [v, 'Casos']} />
              <Bar dataKey="casos" fill="#2980B9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
