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
    nivel_riesgo?: string
    canal?: string
  }
  onChange: (key: string, value: string) => void
}

const años = ['2024', '2025', '2026']

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

const nivelesRiesgo = ['Bajo', 'Medio', 'Alto']
const canales = ['Telefónico', 'Virtual']

export function LineaFilters({ filters, onChange }: Props) {
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

      <div className="min-w-40">
        <Label className="text-xs text-slate-500 mb-1 block">Nivel de riesgo</Label>
        <Select
          value={filters.nivel_riesgo || 'all'}
          onValueChange={(v) => onChange('nivel_riesgo', !v || v === 'all' ? '' : v)}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Todos">{filters.nivel_riesgo || 'Todos'}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {nivelesRiesgo.map((n) => (
              <SelectItem key={n} value={n}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-36">
        <Label className="text-xs text-slate-500 mb-1 block">Canal</Label>
        <Select
          value={filters.canal || 'all'}
          onValueChange={(v) => onChange('canal', !v || v === 'all' ? '' : v)}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Todos">{filters.canal || 'Todos'}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {canales.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
