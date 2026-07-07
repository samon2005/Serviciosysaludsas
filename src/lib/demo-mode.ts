import type { Evento, AtencionLinea } from '@/lib/types'
import eventosJson from '@/lib/demo-data/eventos.json'
import atencionesJson from '@/lib/demo-data/atenciones.json'

/**
 * MODO DEMOSTRACIÓN (temporal)
 *
 * Mientras no exista un proyecto Supabase en la nube, las APIs del dashboard
 * sirven estos datos empaquetados. Se activa automáticamente cuando la URL de
 * Supabase es el placeholder; al configurar credenciales reales en Vercel,
 * el modo demo se desactiva solo.
 */
export function isDemoMode(): boolean {
  // NEXT_PUBLIC_* se inlinea en build; la service key se lee en runtime.
  // Se consideran ambas para que el modo demo funcione en cualquier entorno.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return (
    url === '' ||
    url.includes('placeholder') ||
    serviceKey === '' ||
    serviceKey.includes('placeholder')
  )
}

export const DEMO_MESSAGE =
  'Modo demostración: la carga y eliminación de datos estará disponible cuando se conecte la base de datos.'

export const demoEventos = eventosJson as Evento[]
export const demoAtenciones = atencionesJson as AtencionLinea[]

export const demoUploadEventos = {
  id: 'demo-eventos',
  filename: 'eventos-municipios-antioquia.xlsx',
  rows_imported: demoEventos.length,
  uploaded_at: '2026-07-07T12:00:00Z',
}

export const demoUploadLinea = {
  id: 'demo-linea',
  filename: 'atenciones-linea-24-7.xlsx',
  rows_imported: demoAtenciones.length,
  uploaded_at: '2026-07-07T12:00:00Z',
}

export function filterEventos(params: URLSearchParams): Evento[] {
  const año = params.get('año')
  const municipio = params.get('municipio')
  const programa = params.get('programa')
  const tipo_evento = params.get('tipo_evento')
  return demoEventos.filter(
    (e) =>
      (!año || e.año === parseInt(año)) &&
      (!municipio || e.municipio === municipio) &&
      (!programa || e.programa === programa) &&
      (!tipo_evento || e.tipo_evento === tipo_evento)
  )
}

export function filterAtenciones(params: URLSearchParams): AtencionLinea[] {
  const año = params.get('año')
  const municipio = params.get('municipio')
  const nivel_riesgo = params.get('nivel_riesgo')
  const canal = params.get('canal')
  return demoAtenciones.filter(
    (a) =>
      (!año || a.fecha.startsWith(año)) &&
      (!municipio || a.municipio === municipio) &&
      (!nivel_riesgo || a.nivel_riesgo === nivel_riesgo) &&
      (!canal || a.canal === canal)
  )
}
