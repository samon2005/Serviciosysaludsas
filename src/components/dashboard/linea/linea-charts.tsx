'use client'
import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Search } from 'lucide-react'
import type { LineaResumen, Parte } from '@/lib/linea-aggregate'
import { MESES_CORTO, MESES_LARGO } from '@/lib/linea-aggregate'
import {
  BarraPorcentaje,
  ChartCard,
  ChartTooltip,
  ListaRanking,
  PALETA,
  RIESGO_COLOR,
  SERIE,
  corto,
  fmt,
  fmtPct,
} from '@/components/linea/chart-utils'

interface Props {
  r: LineaResumen
}

const EJE = { fontSize: 11, fill: '#64748B' }
const GRID = '#E2E8F0'

function Dona({
  data,
  colorDe,
  centro,
  etiqueta,
}: {
  data: Parte[]
  colorDe?: (p: Parte, i: number) => string
  centro: string
  etiqueta: string
}) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={230}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={62}
            outerRadius={92}
            paddingAngle={data.length > 1 ? 2 : 0}
            stroke="none"
          >
            {data.map((p, i) => (
              <Cell key={p.name} fill={colorDe ? colorDe(p, i) : SERIE[i % SERIE.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip pctKey="pct" unidad="llamadas" />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tabular-nums text-ink">{centro}</span>
        <span className="text-[11px] text-slate-500">{etiqueta}</span>
      </div>
    </div>
  )
}

function Leyenda({ data, colorDe }: { data: Parte[]; colorDe?: (p: Parte, i: number) => string }) {
  return (
    <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-600">
      {data.map((p, i) => (
        <li key={p.name} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: colorDe ? colorDe(p, i) : SERIE[i % SERIE.length] }} />
          {p.name} <span className="font-semibold tabular-nums text-ink">{fmtPct(p.pct)}</span>
        </li>
      ))}
    </ul>
  )
}

function BarrasHorizontales({
  data,
  color = PALETA.action,
  altoFila = 30,
  anchoEje = 130,
}: {
  data: Parte[]
  color?: string
  altoFila?: number
  anchoEje?: number
}) {
  const filas = data.map((d) => ({ ...d, etiqueta: d.name, corto: corto(d.name, 26) }))
  return (
    <ResponsiveContainer width="100%" height={Math.max(150, filas.length * altoFila + 20)}>
      <BarChart data={filas} layout="vertical" margin={{ top: 0, right: 48, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="corto" tick={EJE} width={anchoEje} axisLine={false} tickLine={false} />
        <Tooltip cursor={{ fill: '#F1F5F9' }} content={<ChartTooltip pctKey="pct" />} />
        <Bar dataKey="value" name="Llamadas" fill={color} radius={[0, 6, 6, 0]} barSize={16}>
          <LabelList dataKey="value" position="right" style={{ fontSize: 11, fill: '#0F172A', fontWeight: 600 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// ---------- tabla de hipótesis ----------

function TablaHipotesis({ r }: { r: LineaResumen }) {
  const [q, setQ] = useState('')
  const [grupo, setGrupo] = useState('')
  const [verTodo, setVerTodo] = useState(false)

  const filas = useMemo(() => {
    const t = q.trim().toLowerCase()
    return r.hipotesis
      .map((h, i) => ({ h, rank: i + 1 }))
      .filter(
        ({ h }) =>
          (!grupo || h.grupo === grupo) &&
          (!t || h.nombre.toLowerCase().includes(t) || h.codigo.toLowerCase().includes(t))
      )
  }, [r.hipotesis, q, grupo])

  const visibles = verTodo || q || grupo ? filas : filas.slice(0, 15)
  const max = Math.max(1, ...r.hipotesis.flatMap((h) => h.porMes))

  return (
    <ChartCard
      titulo="Hipótesis clasificatoria — todos los motivos de consulta"
      subtitulo={`Acumulado ${r.periodo} · ${fmt(r.hipotesisTotal)} hipótesis registradas en ${r.hipotesis.length} categorías`}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <div className="relative min-w-56 flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por código o nombre…"
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-brand-action focus:ring-2 focus:ring-brand-action/20"
          />
        </div>
        <select
          value={grupo}
          onChange={(e) => setGrupo(e.target.value)}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-brand-action"
        >
          <option value="">Todos los grupos</option>
          {r.gruposHipotesis.map((g) => (
            <option key={g.name} value={g.name}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2.5 font-semibold">#</th>
              <th className="px-3 py-2.5 font-semibold">Código</th>
              <th className="px-3 py-2.5 font-semibold">Hipótesis</th>
              <th className="px-3 py-2.5 font-semibold">Grupo</th>
              {r.meses.map((m) => (
                <th key={m} className="px-1.5 py-2.5 text-center font-semibold">
                  {MESES_CORTO[m - 1]}
                </th>
              ))}
              <th className="px-3 py-2.5 text-right font-semibold">Total</th>
              <th className="px-3 py-2.5 text-right font-semibold">%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibles.map(({ h, rank }) => (
              <tr key={h.key} className="hover:bg-slate-50/70">
                <td className="px-3 py-2 tabular-nums text-slate-400">{rank}</td>
                <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-brand-action">{h.codigo}</td>
                <td className="px-3 py-2 text-slate-800">{h.nombre}</td>
                <td className="px-3 py-2 text-xs text-slate-500">{h.grupo}</td>
                {r.meses.map((m) => {
                  const v = h.porMes[m - 1]
                  return (
                    <td key={m} className="px-1 py-1.5 text-center">
                      <span
                        className="inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1 text-[11px] tabular-nums"
                        style={{
                          background: v ? `rgba(3,105,161,${0.08 + (v / max) * 0.5})` : 'transparent',
                          color: v ? (v / max > 0.55 ? '#fff' : '#0C4A6E') : '#CBD5E1',
                        }}
                      >
                        {v || '·'}
                      </span>
                    </td>
                  )
                })}
                <td className="px-3 py-2 text-right font-semibold tabular-nums text-ink">{fmt(h.total)}</td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-500">{fmtPct(h.pct)}</td>
              </tr>
            ))}
            {visibles.length === 0 && (
              <tr>
                <td colSpan={7 + r.meses.length} className="px-3 py-8 text-center text-slate-400">
                  Ninguna hipótesis coincide con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!q && !grupo && filas.length > 15 && (
        <button
          onClick={() => setVerTodo((v) => !v)}
          className="mt-3 text-sm font-medium text-brand-action hover:underline"
        >
          {verTodo ? 'Ver solo las 15 principales' : `Ver las ${filas.length} categorías`}
        </button>
      )}
      {r.sinHipotesis > 0 && (
        <p className="mt-3 text-xs text-slate-500">
          {fmt(r.sinHipotesis)} llamadas del periodo no tienen hipótesis clasificatoria registrada. Los códigos repetidos
          en el Excel (por ejemplo «Z 630» y «Z63.0») se unifican automáticamente.
        </p>
      )}
    </ChartCard>
  )
}

// ---------- gráficos ----------

export function LineaCharts({ r }: Props) {
  const riesgoColor = (p: Parte) => RIESGO_COLOR[p.name] ?? PALETA.gris
  const generoColor = (p: Parte) =>
    p.name === 'Mujer' ? PALETA.brand : p.name === 'Hombre' ? PALETA.medio : PALETA.gris

  const epsPrincipales = r.eps.slice(0, 7)
  const epsResto = r.eps.slice(7).reduce((a, e) => a + e.value, 0)
  const epsTotal = r.eps.reduce((a, e) => a + e.value, 0)
  const epsData: Parte[] = [
    ...epsPrincipales,
    ...(epsResto > 0
      ? [{ name: 'Otras', value: epsResto, pct: Math.round((epsResto / epsTotal) * 1000) / 10 }]
      : []),
  ]

  const top10 = r.hipotesis.slice(0, 10).map((h) => ({
    name: h.nombre,
    sub: `${h.codigo} · ${h.grupo}`,
    value: h.total,
    pct: h.pct,
  }))

  const totalRiesgo = r.riesgo.reduce((a, x) => a + x.value, 0)
  const totalGenero = r.genero.reduce((a, x) => a + x.value, 0)
  const pobTotal = r.poblacion.reduce((a, x) => a + x.value, 0)

  return (
    <div className="space-y-4">
      {/* Fila 1: tendencia */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard titulo="Llamadas recibidas por mes" subtitulo={`Enero a ${r.periodo.split(' a ')[1] ?? r.periodo}`}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={r.porMes} margin={{ top: 18, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="nombre" tick={EJE} axisLine={false} tickLine={false} />
              <YAxis tick={EJE} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#F1F5F9' }} content={<ChartTooltip />} />
              <Bar dataKey="llamadas" name="Llamadas" radius={[6, 6, 0, 0]} maxBarSize={44}>
                {r.porMes.map((m) => (
                  <Cell
                    key={m.mes}
                    fill={!r.mesFiltro || r.mesFiltro === m.mes ? PALETA.action : PALETA.suave}
                  />
                ))}
                <LabelList dataKey="llamadas" position="top" style={{ fontSize: 11, fill: '#0F172A', fontWeight: 600 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard titulo="Nivel de riesgo por mes" subtitulo="Casos clasificados como bajo, medio y alto">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={r.porMes} margin={{ top: 18, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="nombre" tick={EJE} axisLine={false} tickLine={false} />
              <YAxis tick={EJE} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#F1F5F9' }} content={<ChartTooltip />} />
              <Bar dataKey="riesgo_bajo" name="Bajo" stackId="r" fill={RIESGO_COLOR.Bajo} maxBarSize={44} />
              <Bar dataKey="riesgo_medio" name="Medio" stackId="r" fill={RIESGO_COLOR.Medio} maxBarSize={44} />
              <Bar dataKey="riesgo_alto" name="Alto" stackId="r" fill={RIESGO_COLOR.Alto} radius={[6, 6, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
          <ul className="mt-2 flex justify-center gap-4 text-xs text-slate-600">
            {['Bajo', 'Medio', 'Alto'].map((n) => (
              <li key={n} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: RIESGO_COLOR[n] }} />
                {n}
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>

      {/* Fila 2: perfil */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ChartCard titulo="Nivel de riesgo" subtitulo={r.periodo}>
          <Dona data={r.riesgo} colorDe={riesgoColor} centro={fmtPct(r.pct_riesgo_alto)} etiqueta="riesgo alto" />
          <Leyenda data={r.riesgo} colorDe={riesgoColor} />
          <p className="mt-2 text-center text-[11px] text-slate-400">{fmt(totalRiesgo)} llamadas clasificadas</p>
        </ChartCard>

        <ChartCard titulo="Género de quienes llaman" subtitulo={r.periodo}>
          <Dona data={r.genero} colorDe={generoColor} centro={fmtPct(r.pct_mujeres)} etiqueta="mujeres" />
          <Leyenda data={r.genero} colorDe={generoColor} />
          <p className="mt-2 text-center text-[11px] text-slate-400">{fmt(totalGenero)} llamadas con dato de género</p>
        </ChartCard>

        <ChartCard titulo="Zona y rutas de atención" subtitulo={r.periodo} className="md:col-span-2 xl:col-span-1">
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Zona de residencia</p>
              {r.zona.map((z, i) => (
                <BarraPorcentaje key={z.name} nombre={z.name} valor={z.value} pct={z.pct} color={i === 0 ? PALETA.brand : PALETA.medio} />
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                ¿Se activó ruta de atención?
              </p>
              {r.rutas.map((x) => (
                <BarraPorcentaje key={x.name} nombre={x.name === 'Sí' ? 'Sí se activó' : 'No se activó'} valor={x.value} pct={x.pct} color={x.name === 'Sí' ? PALETA.alto : PALETA.gris} />
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Fila 3: edad + EPS */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard titulo="Grupos de edad" subtitulo={r.periodo}>
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={r.edad} margin={{ top: 22, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ ...EJE, fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
              <YAxis tick={EJE} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#F1F5F9' }} content={<ChartTooltip pctKey="pct" />} />
              <Bar dataKey="value" name="Llamadas" fill={PALETA.action} radius={[6, 6, 0, 0]} maxBarSize={52}>
                <LabelList
                  dataKey="pct"
                  position="top"
                  formatter={(v) => fmtPct(Number(v))}
                  style={{ fontSize: 11, fill: '#0F172A', fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard titulo="Afiliación a EPS" subtitulo={`${r.periodo} · principales aseguradoras`}>
          <BarrasHorizontales data={epsData} color={PALETA.brand} altoFila={31} anchoEje={110} />
        </ChartCard>
      </div>

      {/* Fila 4: población diferencial */}
      <ChartCard
        titulo="Población diferencial y prioritaria"
        subtitulo={
          r.poblacionHasta
            ? `Registros de enero a ${MESES_LARGO[r.poblacionHasta - 1]}${r.poblacionHasta < r.ultimoMes ? ' — los meses posteriores aún no tienen registro en el Excel' : ''}`
            : 'Sin registros'
        }
      >
        {pobTotal > 0 ? (
          <BarrasHorizontales data={r.poblacion} color={PALETA.verde} altoFila={30} anchoEje={150} />
        ) : (
          <p className="py-8 text-center text-sm text-slate-400">Sin registros de población diferencial en este periodo.</p>
        )}
      </ChartCard>

      {/* Fila 5: hipótesis */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <ChartCard
          titulo="Motivos de consulta por grupo"
          subtitulo="Hipótesis agrupadas por tema"
          className="xl:col-span-2"
        >
          <ListaRanking items={r.gruposHipotesis} numerar={false} />
        </ChartCard>
        <ChartCard
          titulo="Top 10 hipótesis clasificatorias"
          subtitulo={`Por qué consulta más la gente · acumulado ${r.periodo}`}
          className="xl:col-span-3"
        >
          <ListaRanking items={top10} color={PALETA.brand} />
        </ChartCard>
      </div>

      <TablaHipotesis r={r} />

      {/* Tabla mensual */}
      <ChartCard titulo="Resumen mensual" subtitulo="Llamadas, clasificación de riesgo y rutas de atención por mes">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2.5 text-left font-semibold">Mes</th>
                <th className="px-3 py-2.5 text-right font-semibold">Llamadas</th>
                <th className="px-3 py-2.5 text-right font-semibold">Riesgo bajo</th>
                <th className="px-3 py-2.5 text-right font-semibold">Riesgo medio</th>
                <th className="px-3 py-2.5 text-right font-semibold">Riesgo alto</th>
                <th className="px-3 py-2.5 text-right font-semibold">Rutas activadas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {r.porMes.map((m) => (
                <tr key={m.mes} className={r.mesFiltro === m.mes ? 'bg-sky-50' : 'hover:bg-slate-50/70'}>
                  <td className="px-3 py-2 font-medium text-slate-800">{m.nombre}</td>
                  <td className="px-3 py-2 text-right font-semibold tabular-nums text-ink">{fmt(m.llamadas)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-600">{fmt(m.riesgo_bajo)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-600">{fmt(m.riesgo_medio)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-600">{fmt(m.riesgo_alto)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-600">{fmt(m.rutas)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-slate-200 bg-slate-50 font-semibold text-ink">
              <tr>
                <td className="px-3 py-2.5">Total</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{fmt(r.porMes.reduce((a, m) => a + m.llamadas, 0))}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{fmt(r.porMes.reduce((a, m) => a + m.riesgo_bajo, 0))}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{fmt(r.porMes.reduce((a, m) => a + m.riesgo_medio, 0))}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{fmt(r.porMes.reduce((a, m) => a + m.riesgo_alto, 0))}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{fmt(r.porMes.reduce((a, m) => a + m.rutas, 0))}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </ChartCard>
    </div>
  )
}
