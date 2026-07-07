'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface Props {
  filters: {
    año?: string
    municipio?: string
    programa?: string
    tipo_evento?: string
  }
  onChange: (key: string, value: string) => void
}

const años = ['2021', '2022', '2023', '2024', '2025']

const municipiosAntioquia = [
  'Medellín',
  'Bello',
  'Itagüí',
  'Envigado',
  'Apartadó',
  'Rionegro',
  'Turbo',
  'Caucasia',
  'Sabaneta',
  'La Estrella',
  'Copacabana',
  'Girardota',
  'Barbosa',
  'Caldas',
  'Marinilla',
  'La Ceja',
  'Guarne',
  'Carmen de Viboral',
  'Santa Fe de Antioquia',
  'Urrao',
]

const programasList = [
  'Prevención Suicida',
  'Salud Mental',
  'Mitigación SPA',
  'Social y Comunitario',
]
const tipos = ['Intento', 'Muerte', 'Ideación']

export function DashboardFilters({ filters, onChange }: Props) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex flex-wrap gap-4 items-end">
      <div className="min-w-32">
        <Label className="text-xs text-slate-500 mb-1 block">Año</Label>
        <Select
          value={filters.año || 'all'}
          onValueChange={(v) => onChange('año', !v || v === 'all' ? '' : v)}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Todos">{filters.año || 'Todos'}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {años.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-52">
        <Label className="text-xs text-slate-500 mb-1 block">Municipio</Label>
        <Select
          value={filters.municipio || 'all'}
          onValueChange={(v) => onChange('municipio', !v || v === 'all' ? '' : v)}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Todos">{filters.municipio || 'Todos'}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {municipiosAntioquia.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-48">
        <Label className="text-xs text-slate-500 mb-1 block">Programa</Label>
        <Select
          value={filters.programa || 'all'}
          onValueChange={(v) => onChange('programa', !v || v === 'all' ? '' : v)}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Todos">{filters.programa || 'Todos'}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {programasList.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-36">
        <Label className="text-xs text-slate-500 mb-1 block">Tipo de Evento</Label>
        <Select
          value={filters.tipo_evento || 'all'}
          onValueChange={(v) => onChange('tipo_evento', !v || v === 'all' ? '' : v)}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Todos">{filters.tipo_evento || 'Todos'}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {tipos.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
