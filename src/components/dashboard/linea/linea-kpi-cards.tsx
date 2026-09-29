import { Phone, AlertTriangle, ShieldCheck, Users, MessageCircleHeart } from 'lucide-react'
import type { LineaResumen } from '@/lib/linea-aggregate'
import { fmt, fmtPct } from '@/components/linea/chart-utils'

export function LineaKPICards({ r }: { r: LineaResumen }) {
  const cards = [
    {
      label: 'Llamadas recibidas',
      value: fmt(r.total_llamadas),
      nota: `${fmt(r.promedio_mensual)} por mes en promedio`,
      icon: <Phone size={18} strokeWidth={1.6} />,
      color: '#0C4A6E',
    },
    {
      label: 'Riesgo alto',
      value: fmt(r.riesgo_alto),
      nota: `${fmtPct(r.pct_riesgo_alto)} de las llamadas`,
      icon: <AlertTriangle size={18} strokeWidth={1.6} />,
      color: '#C0392B',
    },
    {
      label: 'Rutas activadas',
      value: fmt(r.rutas_activadas),
      nota: 'Ruta de atención en crisis',
      icon: <ShieldCheck size={18} strokeWidth={1.6} />,
      color: '#0369A1',
    },
    {
      label: 'Mujeres',
      value: fmtPct(r.pct_mujeres),
      nota: 'de quienes llaman',
      icon: <Users size={18} strokeWidth={1.6} />,
      color: '#0F766E',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{c.label}</p>
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: `${c.color}14`, color: c.color }}
              >
                {c.icon}
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold tabular-nums" style={{ color: c.color }}>
              {c.value}
            </p>
            <p className="mt-1 text-xs text-slate-500">{c.nota}</p>
          </div>
        ))}
      </div>

      {r.topHipotesis && (
        <div className="flex items-start gap-4 rounded-2xl border border-sky-100 bg-sky-50/70 p-5">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white text-brand-action shadow-sm">
            <MessageCircleHeart size={20} strokeWidth={1.6} />
          </span>
          <div className="min-w-0 text-sm text-slate-700">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-action">
              Motivo de consulta principal · {r.periodo}
            </p>
            <p className="mt-1 text-base font-semibold text-ink">{r.topHipotesis.nombre}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              {r.topHipotesis.codigo} · {fmt(r.topHipotesis.total)} llamadas ({fmtPct(r.topHipotesis.pct)} de las hipótesis
              registradas). Es el motivo por el que más personas se comunican.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
