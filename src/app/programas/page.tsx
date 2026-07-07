import Link from 'next/link'
import { programas } from '@/lib/programas-data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Servicios — Servicios & Salud S.A.S.',
  description:
    'Línea Amiga 24/7, Proyecto de Vida, Centros de Escucha, PIPST y CTP: los cinco servicios de Servicios & Salud S.A.S. para la salud mental territorial.',
}

export default function ProgramasPage() {
  const flagship = programas.find((p) => p.flagship)
  const rest = programas.filter((p) => !p.flagship)

  return (
    <main>
      {/* Page header */}
      <section className="bg-brand py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-sans font-semibold uppercase tracking-widest text-white/60 mb-3">
            Servicios
          </p>
          <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight">
            Nuestros servicios y programas
          </h1>
          <p className="mt-4 text-white/75 font-sans text-lg max-w-2xl">
            Servicios & Salud S.A.S. opera cinco líneas estratégicas de intervención
            en salud mental y bienestar psicosocial para municipios de Antioquia.
          </p>
        </div>
      </section>

      {/* Flagship — Línea 24/7 */}
      {flagship && (
        <section className="bg-surface border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="flex flex-col md:flex-row md:items-start md:gap-12">
              <div className="flex-1 min-w-0">
                <span className="inline-block bg-emergency/10 text-emergency text-xs font-sans font-semibold uppercase tracking-widest px-3 py-1 rounded-sm mb-4">
                  Servicio insignia
                </span>
                <h2 className="font-heading text-3xl md:text-4xl text-ink mb-4">
                  {flagship.title}
                </h2>
                <p className="font-sans text-slate-600 text-lg leading-relaxed mb-6">
                  {flagship.longDescription}
                </p>
                <div className="mb-6">
                  <p className="text-xs font-sans font-semibold uppercase tracking-widest text-slate-400 mb-3">
                    Actividades principales
                  </p>
                  <ul className="space-y-2">
                    {flagship.actividades.map((a) => (
                      <li key={a} className="flex items-start gap-3 font-sans text-slate-700 text-sm">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-action shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={`/programas/${flagship.slug}`}
                  className="inline-block bg-brand text-white font-sans font-semibold text-sm px-6 py-3 rounded hover:bg-brand-action transition-colors"
                >
                  Ver servicio completo
                </Link>
              </div>

              {/* Phone callout */}
              {flagship.telefono && (
                <aside className="mt-8 md:mt-0 md:w-64 shrink-0 bg-ink rounded-lg p-6 text-white">
                  <p className="font-sans text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">
                    Línea de atención
                  </p>
                  <p className="font-heading text-3xl text-emergency leading-none mb-1">
                    {flagship.telefono}
                  </p>
                  <p className="font-sans text-white/60 text-xs mt-2">
                    Disponible las 24 horas, los 7 días de la semana.
                    Atención telefónica y virtual.
                  </p>
                </aside>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Remaining services — list layout */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl text-ink mb-8">
            Otros servicios estratégicos
          </h2>
          <div className="divide-y divide-slate-100">
            {rest.map((p) => (
              <article key={p.slug} className="py-8 flex flex-col sm:flex-row sm:items-start sm:gap-10">
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-xl text-ink mb-2">
                    {p.title}
                  </h3>
                  <p className="font-sans text-slate-600 text-sm leading-relaxed mb-3">
                    {p.description}
                  </p>
                  <p className="font-sans text-slate-500 text-sm leading-relaxed">
                    <span className="font-semibold text-slate-700">Objetivo: </span>
                    {p.objetivo}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:shrink-0">
                  <Link
                    href={`/programas/${p.slug}`}
                    className="inline-block border border-brand text-brand font-sans font-semibold text-sm px-5 py-2.5 rounded hover:bg-brand hover:text-white transition-colors"
                  >
                    Ver detalle
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
