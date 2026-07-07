import { programas } from '@/lib/programas-data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const programa = programas.find((p) => p.slug === slug)
  return {
    title: programa
      ? `${programa.shortTitle} — Servicios & Salud S.A.S.`
      : 'Servicio no encontrado',
  }
}

export function generateStaticParams() {
  return programas.map((p) => ({ slug: p.slug }))
}

export default async function ProgramaDetailPage({ params }: Props) {
  const { slug } = await params
  const programa = programas.find((p) => p.slug === slug)
  if (!programa) notFound()

  const isLinea = programa.flagship && programa.slug === 'linea-24-7'

  return (
    <main>
      {/* Header */}
      <section className={isLinea ? 'bg-ink py-16 md:py-20' : 'bg-brand py-14 md:py-18'}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/programas"
            className="font-sans text-sm text-white/60 hover:text-white/90 mb-6 inline-block transition-colors"
          >
            ← Todos los servicios
          </Link>

          {isLinea && (
            <span className="block mb-3 inline-block bg-emergency/15 text-emergency text-xs font-sans font-semibold uppercase tracking-widest px-3 py-1 rounded-sm">
              Servicio insignia · Prevención del suicidio
            </span>
          )}

          <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight">
            {programa.title}
          </h1>
          <p className="mt-4 font-sans text-white/75 text-lg max-w-2xl leading-relaxed">
            {programa.description}
          </p>

          {/* Emergency phone for Línea 24/7 */}
          {isLinea && programa.telefono && (
            <div className="mt-8 inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg px-6 py-4">
              <div>
                <p className="font-sans text-xs text-white/50 font-semibold uppercase tracking-widest mb-0.5">
                  Línea de atención — 24 horas, 7 días
                </p>
                <p className="font-heading text-3xl text-emergency leading-none">
                  {programa.telefono}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Body */}
      <section className="bg-surface py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-10">

            {/* Main content — 2/3 */}
            <div className="md:col-span-2 space-y-10">

              {/* Objetivo */}
              <div>
                <h2 className="font-heading text-2xl text-ink mb-4">Objetivo</h2>
                <p className="font-sans text-slate-700 text-base leading-relaxed">
                  {programa.objetivo}
                </p>
              </div>

              {/* Descripción */}
              <div>
                <h2 className="font-heading text-2xl text-ink mb-4">
                  {isLinea ? 'Cómo funciona' : 'Descripción'}
                </h2>
                <p className="font-sans text-slate-600 text-base leading-relaxed">
                  {programa.longDescription}
                </p>
              </div>

              {/* Actividades */}
              <div>
                <h2 className="font-heading text-2xl text-ink mb-4">Actividades</h2>
                <ol className="space-y-4">
                  {programa.actividades.map((a, i) => (
                    <li key={a} className="flex items-start gap-4">
                      <span
                        className={`font-sans font-bold text-sm w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isLinea
                            ? 'bg-emergency/10 text-emergency'
                            : 'bg-brand/10 text-brand'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="font-sans text-slate-700 text-sm leading-relaxed pt-1">
                        {a}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Sidebar — 1/3 */}
            <aside className="space-y-6">
              {/* Población */}
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="font-heading text-lg text-ink mb-3">
                  Población objetivo
                </h3>
                <p className="font-sans text-slate-500 text-sm leading-relaxed">
                  {programa.poblacion}
                </p>
              </div>

              {/* Contact / CTA */}
              <div className="bg-brand rounded-lg p-6 text-white">
                <h3 className="font-heading text-lg mb-2">
                  ¿Le interesa este servicio?
                </h3>
                <p className="font-sans text-white/70 text-sm mb-4 leading-relaxed">
                  Comuníquese con nuestro equipo para coordinar una intervención
                  o solicitar información técnica.
                </p>
                <Link
                  href="/contacto"
                  className="block text-center bg-white text-brand font-sans font-semibold text-sm px-5 py-3 rounded hover:bg-slate-100 transition-colors"
                >
                  Solicitar información
                </Link>
              </div>

              {/* Back link */}
              <Link
                href="/programas"
                className="font-sans text-sm text-brand-action hover:underline block"
              >
                ← Ver todos los servicios
              </Link>
            </aside>

          </div>
        </div>
      </section>

      {/* Línea 24/7 only: How-it-works strip */}
      {isLinea && (
        <section className="bg-ink py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl text-white mb-8">
              Ruta de atención en crisis suicida
            </h2>
            <ol className="grid sm:grid-cols-4 gap-6">
              {[
                { n: '1', label: 'Contacto', desc: 'La persona llama o escribe. La línea responde de inmediato.' },
                { n: '2', label: 'Escucha activa', desc: 'El profesional evalúa el nivel de riesgo y contiene la crisis.' },
                { n: '3', label: 'Canalización', desc: 'Se orienta y acompaña hacia los recursos adecuados.' },
                { n: '4', label: 'Activación de ruta', desc: 'Si el riesgo es alto, se activa la red territorial de emergencia.' },
              ].map((s) => (
                <li key={s.n} className="flex flex-col">
                  <span className="font-heading text-4xl text-emergency mb-3">{s.n}</span>
                  <strong className="font-sans font-semibold text-white text-sm mb-1">{s.label}</strong>
                  <span className="font-sans text-white/55 text-sm leading-relaxed">{s.desc}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}
    </main>
  )
}
