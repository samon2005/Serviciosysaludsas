import type { ReactNode } from 'react'

/** Paleta única para todos los gráficos de la Línea 24/7 (alineada con --color-brand). */
export const PALETA = {
  brand: '#0C4A6E',
  action: '#0369A1',
  medio: '#0EA5E9',
  claro: '#7DD3FC',
  suave: '#BAE6FD',
  gris: '#94A3B8',
  alto: '#C0392B',
  amber: '#D97706',
  verde: '#0F766E',
}

export const SERIE = [PALETA.brand, PALETA.action, PALETA.medio, PALETA.claro, PALETA.suave, PALETA.gris]

export const RIESGO_COLOR: Record<string, string> = {
  Bajo: PALETA.action,
  Medio: PALETA.amber,
  Alto: PALETA.alto,
}

export const fmt = (n: number) => n.toLocaleString('es-CO')
export const fmtPct = (n: number) => `${n.toLocaleString('es-CO', { maximumFractionDigits: 1 })}%`

/** Recorta etiquetas largas para los ejes. */
export function corto(s: string, max = 34): string {
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s
}

interface TipPayload {
  name?: string | number
  value?: number | string
  color?: string
  dataKey?: string | number
  payload?: Record<string, unknown>
}

/** Tooltip coherente con el estilo del sitio. */
export function ChartTooltip({
  active,
  payload,
  label,
  unidad = 'llamadas',
  pctKey,
}: {
  active?: boolean
  payload?: TipPayload[]
  label?: string | number
  unidad?: string
  pctKey?: string
}) {
  if (!active || !payload?.length) return null
  const titulo = (payload[0]?.payload?.etiqueta as string | undefined) ?? label ?? payload[0]?.payload?.name ?? payload[0]?.name
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
      {titulo !== undefined && <p className="mb-1 font-semibold text-ink">{String(titulo)}</p>}
      {payload.map((p, i) => {
        const pct = pctKey ? (p.payload?.[pctKey] as number | undefined) : undefined
        return (
          <p key={i} className="flex items-center gap-2 text-slate-600">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color ?? PALETA.brand }} />
            <span>{p.name && p.name !== 'value' && p.name !== titulo ? p.name : unidad}</span>
            <span className="ml-auto pl-3 font-semibold tabular-nums text-ink">
              {typeof p.value === 'number' ? fmt(p.value) : p.value}
              {pct !== undefined ? ` · ${fmtPct(pct)}` : ''}
            </span>
          </p>
        )
      })}
    </div>
  )
}

export function ChartCard({
  titulo,
  subtitulo,
  children,
  className = '',
  accion,
}: {
  titulo: string
  subtitulo?: string
  children: ReactNode
  className?: string
  accion?: ReactNode
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">{titulo}</h3>
          {subtitulo && <p className="mt-0.5 text-xs text-slate-500">{subtitulo}</p>}
        </div>
        {accion}
      </header>
      {children}
    </section>
  )
}

/** Barra de progreso para distribuciones cortas (zona, género...). */
export function BarraPorcentaje({
  nombre,
  valor,
  pct,
  color = PALETA.action,
}: {
  nombre: string
  valor: number
  pct: number
  color?: string
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span className="font-medium text-slate-700">{nombre}</span>
        <span className="tabular-nums text-slate-500">
          {fmt(valor)} · <span className="font-semibold text-ink">{fmtPct(pct)}</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full" style={{ width: `${Math.max(pct, 1.5)}%`, background: color }} />
      </div>
    </div>
  )
}

/** Ranking con barra integrada: se adapta a cualquier ancho y admite textos largos. */
export function ListaRanking({
  items,
  color = PALETA.action,
  numerar = true,
  maxItems,
}: {
  items: { name: string; value: number; pct: number; sub?: string }[]
  color?: string
  numerar?: boolean
  maxItems?: number
}) {
  const lista = maxItems ? items.slice(0, maxItems) : items
  const max = Math.max(1, ...lista.map((i) => i.value))
  return (
    <ol className="space-y-3">
      {lista.map((it, i) => (
        <li key={it.name + i} className="flex items-start gap-3">
          {numerar && (
            <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-500 tabular-nums">
              {i + 1}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3 text-[13px]">
              <span className="font-medium leading-snug text-slate-800">{it.name}</span>
              <span className="flex-none tabular-nums text-slate-500">
                <span className="font-semibold text-ink">{fmt(it.value)}</span> · {fmtPct(it.pct)}
              </span>
            </div>
            {it.sub && <p className="text-[11px] text-slate-400">{it.sub}</p>}
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full" style={{ width: `${Math.max((it.value / max) * 100, 2)}%`, background: color }} />
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}
