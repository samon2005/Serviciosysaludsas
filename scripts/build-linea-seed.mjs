/**
 * Convierte el Excel mensual de la Línea 24/7 en el seed del modo demostración.
 *   node --experimental-strip-types scripts/build-linea-seed.mjs <ruta.xlsx> "<Municipio>" <año>
 * Usa el mismo parser que la carga desde el dashboard.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { parseLineaWorkbook } from '../src/lib/linea-parser.ts'

const [, , file, municipio = 'La Estrella', año = '2026'] = process.argv
if (!file) {
  console.error('Uso: node --experimental-strip-types scripts/build-linea-seed.mjs <xlsx> [municipio] [año]')
  process.exit(1)
}
const res = parseLineaWorkbook(readFileSync(file), { municipio, año: Number(año) })
writeFileSync(
  new URL('../src/lib/demo-data/linea-indicadores.json', import.meta.url),
  JSON.stringify(res.rows)
)
console.log('filas:', res.rows.length, '| meses:', res.meses.join(','), '| resumen:', res.resumen)
console.log('hojas:', res.hojas.join(', '))
console.log('advertencias:\n - ' + res.warnings.join('\n - '))
