import { programas } from '@/lib/programas-data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Reveal } from '@/components/reveal'
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
    <main className="bg-surface min-h-screen">
      {/* Header */}
      {isLinea ? (
        /* Línea 24/7 — dark sheet with rounded container */
        <section className="bg-surface-dark py-20 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/programas"
              className="text-sm text-white/50 hover:text-white/80 mb-8 inline-block transition-colors"
            >
              ← Todos los servicios
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-block rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] bg-emergency/15 text-emergency">
                Servicio insignia · Prevención del suicidio
              </span>

              {/* Emergency phone chip */}
              {programa.telefono && (
                <span className="inline-flex items-center gap-2 bg-emergency text-white font-bold text-sm rounded-full px-4 py-1.5 tracking-tight">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
                  {programa.telefono}
                </span>
              )}
            </div>

            <h1 className="font-extrabold tracking-tighter text-4xl md:text-5xl text-white leading-tight mb-4">
              {programa.title}
            </h1>
            <p className="text-slate-400 text-lg max-w-[65ch] leading-relaxed">
              {programa.description}
            </p>

            {/* 4-step ruta strip — numbered chips with connectors */}
            {isLinea && (
              <div className="mt-12 bg-white/5 border border-white/10 rounded-[1.5rem] p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-6">
                  Ruta de atención en crisis suicida
                </p>
                <ol className="grid sm:grid-cols-4 gap-0 relative">
                  {[
                    { n: '1', label: 'Contacto', desc: 'La persona llama o escribe. La línea responde de inmediato.' },
                    { n: '2', label: 'Escucha activa', desc: 'El profesional evalúa el nivel de riesgo y contiene la crisis.' },
                    { n: '3', label: 'Canalización', desc: 'Se orienta y acompaña hacia los recursos adecuados.' },
                    { n: '4', label: 'Activación de ruta', desc: 'Si el riesgo es alto, se activa la red territorial de emergencia.' },
                  ].map((s, i, arr) => (
                    <li key={s.n} className="flex flex-col relative pr-4">
                      {/* Connector line */}
                      {i < arr.length - 1 && (
                        <span className="hidden sm:block absolute top-4 left-[2.5rem] right-0 h-px bg-white/10" />
                      )}
                      <span className="relative z-10 w-8 h-8 rounded-full bg-emergency/20 border border-emergency/30 text-emergency font-bold text-sm flex items-center justify-center mb-3 shrink-0">
                        {s.n}
                      </span>
                      <strong className="text-white font-semibold text-sm mb-1">{s.label}</strong>
                      <span className="text-white/45 text-xs leading-relaxed">{s.desc}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </section>
      ) : (
        /* Standard service — light header */
        <section className="bg-surface border-b border-slate-100 py-20 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/programas"
              className="text-sm text-slate-400 hover:text-slate-700 mb-8 inline-block transition-colors"
            >
              ← Todos los servicios
            </Link>
            <span className="inline-block rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] bg-brand/8 text-brand mb-5">
              Servicio estratégico
            </span>
            <h1 className="font-extrabold tracking-tighter text-4xl md:text-5xl text-ink leading-tight mb-4">
              {programa.title}
            </h1>
            <p className="text-slate-600 text-lg max-w-[65ch] leading-relaxed">
              {programa.objetivo}
            </p>
          </div>
        </section>
      )}

      {/* Body */}
      <section className={isLinea ? 'bg-surface py-16 md:py-20' : 'py-16 md:py-20'}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">

            {/* Main content — 2/3 */}
            <div className="md:col-span-2 space-y-12">

              {/* Objetivo — as lede (only for non-linea; linea shows it in header) */}
              {!isLinea && (
                <Reveal>
                  <div>
                    <span className="inline-block rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] bg-brand/8 text-brand mb-4">
                      Objetivo
                    </span>
                    <p className="text-slate-700 text-base leading-relaxed max-w-[65ch]">
                      {programa.objetivo}
                    </p>
                  </div>
                </Reveal>
              )}

              {/* Descripción */}
              <Reveal delay={isLinea ? 0 : 100}>
                <div>
                  <h2 className="font-bold tracking-tight text-2xl text-ink mb-4">
                    {isLinea ? 'Cómo funciona' : 'Descripción'}
                  </h2>
                  <p className="text-slate-600 text-base leading-relaxed max-w-[65ch]">
                    {programa.longDescription}
                  </p>
                </div>
              </Reveal>

              {/* Actividades — numbered timeline */}
              <Reveal delay={isLinea ? 100 : 200}>
                <div>
                  <h2 className="font-bold tracking-tight text-2xl text-ink mb-6">
                    Actividades
                  </h2>
                  <ol className="space-y-5">
                    {programa.actividades.map((a, i) => (
                      <li key={a} className="flex items-start gap-4">
                        {/* Brand number chip */}
                        <span
                          className={`font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isLinea
                              ? 'bg-emergency/10 text-emergency border border-emergency/20'
                              : 'bg-brand/8 text-brand border border-brand/15'
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className="text-slate-700 text-sm leading-relaxed pt-1.5">
                          {a}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>
            </div>

            {/* Sidebar — 1/3 */}
            <aside className="space-y-5">
              {/* Población */}
              <Reveal delay={150}>
                <div className="bg-white rounded-[1.5rem] shadow-diffusion ring-1 ring-slate-900/5 p-6">
                  <h3 className="font-bold tracking-tight text-base text-ink mb-3">
                    Población objetivo
                  </h3>
                  <p className="text-slate-500 text-base leading-relaxed">
                    {programa.poblacion}
                  </p>
                </div>
              </Reveal>

              {/* Contact / CTA */}
              <Reveal delay={200}>
                <div className={`rounded-[1.5rem] p-6 text-white ${isLinea ? 'bg-emergency' : 'bg-brand'}`}>
                  <h3 className="font-bold tracking-tight text-base mb-2">
                    ¿Le interesa este servicio?
                  </h3>
                  <p className="text-white/70 text-sm mb-5 leading-relaxed">
                    Comuníquese con nuestro equipo para coordinar una intervención
                    o solicitar información técnica.
                  </p>
                  <Link
                    href="/contacto"
                    className="block text-center bg-white font-bold text-sm px-5 py-3 rounded-[1rem] hover:-translate-y-0.5 transition-transform"
                    style={{ color: isLinea ? '#C0392B' : '#0C4A6E' }}
                  >
                    Solicitar información
                  </Link>
                </div>
              </Reveal>

              {/* Back link */}
              <Link
                href="/programas"
                className="text-sm text-brand-action hover:text-brand block pt-1"
              >
                ← Ver todos los servicios
              </Link>
            </aside>

          </div>
        </div>
      </section>
    </main>
  )
}
