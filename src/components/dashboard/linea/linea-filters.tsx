'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { MESES_LARGO } from '@/lib/linea-aggregate'

interface Props {
  filters: { año?: string; municipio?: string; mes?: string }
  onChange: (key: string, value: string) => void
  municipios: string[]
  años: number[]
  /** Meses con datos para el municipio y año elegidos */
  meses: number[]
}

function Campo({
  label,
  value,
  onChange,
  opciones,
  todos,
  ancho,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  opciones: { value: string; label: string }[]
  todos: string
  ancho: string
}) {
  const actual = opciones.find((o) => o.value === value)?.label ?? todos
  return (
    <div className={ancho}>
      <Label className="mb-1 block text-xs text-slate-500">{label}</Label>
      <Select value={value || 'all'} onValueChange={(v) => onChange(!v || v === 'all' ? '' : v)}>
        <SelectTrigger className="h-9 bg-white">
          <SelectValue placeholder={todos}>{actual}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{todos}</SelectItem>
          {opciones.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function LineaFilters({ filters, onChange, municipios, años, meses }: Props) {
  return (
    <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <Campo
        label="Municipio"
        value={filters.municipio ?? ''}
        onChange={(v) => onChange('municipio', v)}
        opciones={municipios.map((m) => ({ value: m, label: m }))}
        todos="Todos los municipios"
        ancho="min-w-56"
      />
      <Campo
        label="Año"
        value={filters.año ?? ''}
        onChange={(v) => onChange('año', v)}
        opciones={años.map((a) => ({ value: String(a), label: String(a) }))}
        todos="Todos los años"
        ancho="min-w-36"
      />
      <Campo
        label="Periodo"
        value={filters.mes ?? ''}
        onChange={(v) => onChange('mes', v)}
        opciones={meses.map((m) => ({ value: String(m), label: MESES_LARGO[m - 1].replace(/^./, (c) => c.toUpperCase()) }))}
        todos="Acumulado del año"
        ancho="min-w-48"
      />
      {(filters.municipio || filters.año || filters.mes) && (
        <button
          onClick={() => {
            onChange('municipio', '')
            onChange('año', '')
            onChange('mes', '')
          }}
          className="h-9 text-sm font-medium text-brand-action hover:underline"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  )
}
