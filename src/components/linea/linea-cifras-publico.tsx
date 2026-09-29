'use client'
import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChevronDown, HeartHandshake, Phone, Users } from 'lucide-react'
import type { LineaResumen } from '@/lib/linea-aggregate'
import { GRUPO_DESCRIPCION } from '@/lib/linea-grupos'
import { ChartTooltip, ListaRanking, PALETA, fmt, fmtPct } from '@/components/linea/chart-utils'

/**
 * Sección pública "La línea en cifras": pocos datos, lenguaje claro y sin cifras
 * de riesgo. Se alimenta de lo que se sube en el dashboard.
 */
export function LineaCifrasPublico({ municipioInicial = 'La Estrella' }: { municipioInicial?: string }) {
  const [municipio, setMunicipio] = useState(municipioInicial)
  const [r, setR] = useState<LineaResumen | null>(null)
  const [estado, setEstado] = useState<'cargando' | 'ok' | 'vacio'>('cargando')

  useEffect(() => {
    let cancelado = false
    fetch(`/api/linea/stats?municipio=${encodeURIComponent(municipio)}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelado) return
        const resumen: LineaResumen | undefined = json.resumen
        if (!resumen) return setEstado('vacio')
        if (resumen.vacio && resumen.municipios.length > 0 && !resumen.municipios.includes(municipio)) {
          setMunicipio(resumen.municipios[0]) // el inicial no tiene datos: usar el primero disponible
          return
        }
        setR(resumen)
        setEstado(resumen.vacio ? 'vacio' : 'ok')
      })
      .catch(() => !cancelado && setEstado('vacio'))
    return () => {
      cancelado = true
    }
  }, [municipio])

  const motivos = useMemo(() => {
    if (!r) return []
    return r.gruposHipotesis
      .filter((g) => g.name !== 'Otros motivos')
      .slice(0, 6)
      .map((g) => ({ ...g, sub: GRUPO_DESCRIPCION[g.name] }))
  }, [r])

  if (estado === 'vacio' && !r) return null

  const edadTop = r?.edad.filter((e) => e.name !== 'Sin dato').sort((a, b) => b.value - a.value)[0]
  const municipios = r?.municipios ?? [municipio]

  return (
    <section id="linea-en-cifras" className="py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-4 inline-block rounded-full bg-brand/8 px-3 py-1 text-xs uppercase tracking-[0.2em] text-brand">
              La línea en cifras
            </span>
            <h2 className="max-w-[24ch] text-3xl font-bold leading-tight tracking-tighter text-ink md:text-4xl">
              ¿Por qué nos contactan las personas?
            </h2>
            <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-slate-600">
              Un resumen de las llamadas que atiende la Línea de Atención 24/7 en cada municipio. Son datos agregados: no
              se identifica a ninguna persona.
            </p>
          </div>

          <label className="relative block w-full md:w-64">
            <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-slate-500">Municipio</span>
            <select
              value={municipio}
              onChange={(e) => {
                setEstado('cargando')
                setMunicipio(e.target.value)
              }}
              className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-base font-semibold text-ink shadow-sm outline-none transition focus:border-brand-action focus:ring-4 focus:ring-brand-action/15"
            >
              {municipios.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="pointer-events-none absolute bottom-3.5 right-4 text-slate-400" />
          </label>
        </div>

        {estado === 'cargando' || !r ? (
          <div className="grid gap-4 md:grid-cols-3" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-3xl bg-slate-100" />
            ))}
            <div className="h-72 animate-pulse rounded-3xl bg-slate-100 md:col-span-3" />
          </div>
        ) : (
          <div className="space-y-5">
            {/* Resumen en lenguaje llano */}
            <p className="rounded-3xl bg-brand p-6 text-lg leading-relaxed text-white/90 md:p-8 md:text-xl">
              {r.meses.length > 1 ? 'Entre ' : 'En '}
              <b className="text-white">{r.periodo.replace(' a ', ' y ')}</b>, la línea recibió{' '}
              <b className="text-white">{fmt(r.total_llamadas)} llamadas</b> de personas de{' '}
              <b className="text-white">{municipio}</b>
              {r.topHipotesis && motivos[0] ? (
                <>
                  . El tema que más se repite es <b className="text-white">{motivos[0].name.toLowerCase()}</b>
                  {motivos[1] ? (
                    <>
                      , seguido de <b className="text-white">{motivos[1].name.toLowerCase()}</b>
                    </>
                  ) : null}
                  .
                </>
              ) : (
                '.'
              )}
            </p>

            {/* Tres cifras */}
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { icon: <Phone size={20} />, valor: fmt(r.total_llamadas), titulo: 'llamadas atendidas', nota: `${fmt(r.promedio_mensual)} en promedio cada mes` },
                {
                  icon: <Users size={20} />,
                  valor: edadTop ? fmtPct(edadTop.pct) : '—',
                  titulo: edadTop
                    ? edadTop.name.includes(' a ')
                      ? `tiene entre ${edadTop.name.replace(' años', '').replace(' a ', ' y ')} años`
                      : `tiene ${edadTop.name}`
                    : 'grupo de edad',
                  nota: 'es el grupo que más nos llama',
                },
                {
                  icon: <HeartHandshake size={20} />,
                  valor: fmtPct(r.pct_mujeres),
                  titulo: 'son mujeres',
                  nota: 'de quienes se comunican con la línea',
                },
              ].map((k) => (
                <div key={k.titulo} className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/8 text-brand">{k.icon}</span>
                  <p className="text-4xl font-extrabold tracking-tighter text-brand tabular-nums">{k.valor}</p>
                  <p className="mt-1 text-base font-semibold text-ink">{k.titulo}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{k.nota}</p>
                </div>
              ))}
            </div>

            {/* Gráficas */}
            <div className="grid gap-5 lg:grid-cols-5">
              <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm lg:col-span-2">
                <h3 className="text-base font-semibold text-ink">Llamadas cada mes</h3>
                <p className="mb-4 text-sm text-slate-500">{municipio} · {r.periodo}</p>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={r.porMes} margin={{ top: 18, right: 4, left: -26, bottom: 0 }}>
                    <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="nombre" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#F1F5F9' }} content={<ChartTooltip />} />
                    <Bar dataKey="llamadas" name="Llamadas" radius={[8, 8, 0, 0]} maxBarSize={34}>
                      {r.porMes.map((m) => (
                        <Cell key={m.mes} fill={m.llamadas === Math.max(...r.porMes.map((x) => x.llamadas)) ? PALETA.brand : PALETA.medio} />
                      ))}
                      <LabelList dataKey="llamadas" position="top" style={{ fontSize: 10, fill: '#0F172A', fontWeight: 600 }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm lg:col-span-3">
                <h3 className="text-base font-semibold text-ink">Motivos por los que consultan</h3>
                <p className="mb-5 text-sm text-slate-500">Temas agrupados · porcentaje de las consultas</p>
                <ListaRanking items={motivos} color={PALETA.action} numerar={false} />
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400">
              Fuente: registros de la Línea de Atención 24/7, Servicios &amp; Salud S.A.S. Los motivos se agrupan a partir
              de la clasificación profesional de cada llamada. Si usted o alguien cercano necesita ayuda, llame a la línea:
              está disponible las 24 horas, todos los días.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
