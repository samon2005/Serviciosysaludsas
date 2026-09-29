import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { cargarIndicadores } from '@/lib/linea-store'
import { agregarLinea, MESES_CORTO } from '@/lib/linea-aggregate'

/** Exporta el resumen filtrado en un libro con una hoja por indicador. */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const { rows, error } = await cargarIndicadores()
  if (error) return NextResponse.json({ error }, { status: 500 })

  const r = agregarLinea(rows, {
    municipio: searchParams.get('municipio'),
    año: searchParams.get('año'),
    mes: searchParams.get('mes'),
  })

  const wb = XLSX.utils.book_new()
  const add = (name: string, data: Record<string, string | number>[]) =>
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.length ? data : [{ 'Sin datos': '' }]), name)
  const partes = (p: { name: string; value: number; pct: number }[], label: string) =>
    p.map((x) => ({ [label]: x.name, Total: x.value, 'Porcentaje (%)': x.pct }))

  add('Resumen', [
    { Indicador: 'Municipio', Valor: searchParams.get('municipio') || 'Todos' },
    { Indicador: 'Periodo', Valor: r.periodo || '—' },
    { Indicador: 'Llamadas recibidas', Valor: r.total_llamadas },
    { Indicador: 'Riesgo alto (%)', Valor: r.pct_riesgo_alto },
    { Indicador: 'Rutas activadas', Valor: r.rutas_activadas },
    { Indicador: 'Mujeres (%)', Valor: r.pct_mujeres },
  ])
  add(
    'Llamadas por mes',
    r.porMes.map((m) => ({
      Mes: m.nombre,
      Llamadas: m.llamadas,
      'Riesgo bajo': m.riesgo_bajo,
      'Riesgo medio': m.riesgo_medio,
      'Riesgo alto': m.riesgo_alto,
      'Rutas activadas': m.rutas,
    }))
  )
  add('Edad', partes(r.edad, 'Grupo de edad'))
  add('Riesgo', partes(r.riesgo, 'Nivel de riesgo'))
  add('Género', partes(r.genero, 'Género'))
  add('Zona', partes(r.zona, 'Zona'))
  add('EPS', partes(r.eps, 'EPS'))
  add('Rutas', partes(r.rutas, 'Ruta activada'))
  add('Población diferencial', partes(r.poblacion, 'Grupo'))
  add(
    'Hipótesis',
    r.hipotesis.map((h, i) => ({
      '#': i + 1,
      Código: h.codigo,
      Hipótesis: h.nombre,
      Grupo: h.grupo,
      Total: h.total,
      'Porcentaje (%)': h.pct,
      ...Object.fromEntries(r.meses.map((m) => [MESES_CORTO[m - 1], h.porMes[m - 1]])),
    }))
  )

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="linea-atencion-24-7.xlsx"',
    },
  })
}
