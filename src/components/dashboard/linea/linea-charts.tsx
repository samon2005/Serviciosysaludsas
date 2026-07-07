'use client'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { AtencionLinea } from '@/lib/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface Props {
  atenciones: AtencionLinea[]
}

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

// Risk colors: Alto = emergency, Medio = amber-600, Bajo = brand
const RIESGO_COLORS: Record<string, string> = {
  Alto: '#C0392B',
  Medio: '#D97706',
  Bajo: '#154360',
}
const CANAL_COLORS = ['#154360', '#1F618D']
const DIST_COLORS = ['#154360', '#1F618D', '#5DADE2', '#85C1E9', '#AED6F1']

export function LineaCharts({ atenciones }: Props) {
  // (a) Atenciones por mes
  const porMes = MESES.map((mes, i) => ({
    mes,
    atenciones: atenciones.filter((a) => {
      const m = a.fecha ? new Date(a.fecha).getUTCMonth() : -1
      return m === i
    }).length,
  }))

  // (b) Dona por canal
  const canalMap = atenciones.reduce<Record<string, number>>((acc, a) => {
    if (a.canal) acc[a.canal] = (acc[a.canal] || 0) + 1
    return acc
  }, {})
  const porCanal = Object.entries(canalMap).map(([name, value]) => ({ name, value }))

  // (c) Dona por nivel de riesgo
  const riesgoMap = atenciones.reduce<Record<string, number>>((acc, a) => {
    if (a.nivel_riesgo) acc[a.nivel_riesgo] = (acc[a.nivel_riesgo] || 0) + 1
    return acc
  }, {})
  const porRiesgo = Object.entries(riesgoMap).map(([name, value]) => ({ name, value }))

  // (d) Top 10 municipios
  const municipioMap = atenciones.reduce<Record<string, number>>((acc, a) => {
    if (a.municipio) acc[a.municipio] = (acc[a.municipio] || 0) + 1
    return acc
  }, {})
  const topMunicipios = Object.entries(municipioMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([municipio, atenciones]) => ({
      municipio: municipio.length > 14 ? municipio.slice(0, 14) + '.' : municipio,
      atenciones,
    }))

  // (e) Barras horizontales por motivo
  const motivoMap = atenciones.reduce<Record<string, number>>((acc, a) => {
    if (a.motivo) acc[a.motivo] = (acc[a.motivo] || 0) + 1
    return acc
  }, {})
  const porMotivo = Object.entries(motivoMap)
    .sort((a, b) => b[1] - a[1])
    .map(([motivo, count]) => ({ motivo, count }))

  // (f) Demografía: sexo + grupo etario
  const sexoMap = atenciones.reduce<Record<string, number>>((acc, a) => {
    if (a.sexo) acc[a.sexo] = (acc[a.sexo] || 0) + 1
    return acc
  }, {})
  const porSexo = Object.entries(sexoMap).map(([name, value]) => ({ name, value }))

  const etarioMap = atenciones.reduce<Record<string, number>>((acc, a) => {
    if (a.grupo_etario) acc[a.grupo_etario] = (acc[a.grupo_etario] || 0) + 1
    return acc
  }, {})
  const porEtario = Object.entries(etarioMap)
    .sort((a, b) => b[1] - a[1])
    .map(([grupo_etario, count]) => ({ grupo_etario, count }))

  return (
    <div className="space-y-4">
      {/* Row 1: Temporal + Canal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <h3 className="font-semibold text-sm text-ink">Atenciones por mes</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={porMes} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [v, 'Atenciones']} />
                <Line
                  type="monotone"
                  dataKey="atenciones"
                  stroke="#154360"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <h3 className="font-semibold text-sm text-ink">Distribución por canal</h3>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={porCanal}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name ?? ''} ${(((percent as number | undefined) ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                  fontSize={12}
                >
                  {porCanal.map((_, i) => (
                    <Cell key={i} fill={CANAL_COLORS[i % CANAL_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [v, 'Atenciones']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Riesgo + Top Municipios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <h3 className="font-semibold text-sm text-ink">Nivel de riesgo</h3>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={porRiesgo}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name ?? ''} ${(((percent as number | undefined) ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                  fontSize={12}
                >
                  {porRiesgo.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={RIESGO_COLORS[entry.name] ?? DIST_COLORS[i % DIST_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [v, 'Atenciones']} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <h3 className="font-semibold text-sm text-ink">Top 10 municipios</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topMunicipios} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="municipio"
                  tick={{ fontSize: 11 }}
                  angle={-40}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [v, 'Atenciones']} />
                <Bar dataKey="atenciones" fill="#154360" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Motivo (horizontal bars) */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-sm text-ink">Motivos de consulta</h3>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={Math.max(200, porMotivo.length * 36)}>
            <BarChart
              data={porMotivo}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="motivo"
                tick={{ fontSize: 11 }}
                width={95}
              />
              <Tooltip formatter={(v) => [v, 'Atenciones']} />
              <Bar dataKey="count" fill="#1F618D" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Row 4: Demografía */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <h3 className="font-semibold text-sm text-ink">Distribución por sexo</h3>
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
                    <Cell key={i} fill={DIST_COLORS[i % DIST_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [v, 'Atenciones']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <h3 className="font-semibold text-sm text-ink">Atenciones por grupo etario</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={porEtario} margin={{ top: 5, right: 10, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="grupo_etario"
                  tick={{ fontSize: 10 }}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [v, 'Atenciones']} />
                <Bar dataKey="count" fill="#1F618D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
