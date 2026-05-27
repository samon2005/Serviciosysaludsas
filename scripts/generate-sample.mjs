import * as XLSX from 'xlsx'
import { writeFileSync, mkdirSync } from 'fs'

const departamentos = [
  'Antioquia', 'Cundinamarca', 'Valle del Cauca', 'Atlántico', 'Santander',
  'Bolívar', 'Nariño', 'Córdoba', 'Tolima', 'Cauca',
  'Meta', 'Risaralda', 'Caldas', 'Huila', 'Boyacá',
]

const municipiosPorDept = {
  'Antioquia': ['Medellín', 'Bello', 'Envigado'],
  'Cundinamarca': ['Bogotá', 'Soacha', 'Chía'],
  'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura'],
  'Atlántico': ['Barranquilla', 'Soledad'],
  'Santander': ['Bucaramanga', 'Floridablanca'],
}

const sexos = ['Masculino', 'Femenino']
const gruposEtarios = ['10-14', '15-19', '20-29', '30-44', '45-59', '60+']
const metodos = ['Intoxicación', 'Arma corto-punzante', 'Ahorcamiento', 'Arma de fuego', 'Precipitación']
const tipos = ['Intento', 'Muerte', 'Ideación']
const programas = ['Prevención Suicida', 'Salud Mental', 'Mitigación SPA', 'Social y Comunitario']

const rows = []

for (const año of [2022, 2023, 2024]) {
  for (const mes of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
    for (const dept of departamentos) {
      const munis = municipiosPorDept[dept] || [dept]
      const n = Math.floor(Math.random() * 3) + 1
      for (let i = 0; i < n; i++) {
        rows.push({
          departamento: dept,
          municipio: munis[Math.floor(Math.random() * munis.length)],
          año,
          mes,
          sexo: sexos[Math.floor(Math.random() * sexos.length)],
          grupo_etario: gruposEtarios[Math.floor(Math.random() * gruposEtarios.length)],
          metodo: metodos[Math.floor(Math.random() * metodos.length)],
          tipo_evento: tipos[Math.floor(Math.random() * tipos.length)],
          programa: programas[Math.floor(Math.random() * programas.length)],
          casos: Math.floor(Math.random() * 15) + 1,
        })
      }
    }
  }
}

const wb = XLSX.utils.book_new()
const ws = XLSX.utils.json_to_sheet(rows)

ws['!cols'] = [
  { wch: 18 }, { wch: 18 }, { wch: 6 }, { wch: 5 },
  { wch: 12 }, { wch: 12 }, { wch: 22 }, { wch: 14 },
  { wch: 24 }, { wch: 8 },
]

XLSX.utils.book_append_sheet(wb, ws, 'Datos')

mkdirSync('public/samples', { recursive: true })
const outPath = 'public/samples/datos-ejemplo.xlsx'
writeFileSync(outPath, XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }))
console.log(`✓ Generado: ${outPath} con ${rows.length} filas`)
