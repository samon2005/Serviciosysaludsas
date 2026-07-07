import Link from 'next/link'
import { programas } from '@/lib/programas-data'
import { Reveal } from '@/components/reveal'
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
    <main className="bg-surface min-h-screen">
      {/* Page header */}
      <section className="bg-brand py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] bg-white/10 text-white/80 mb-5">
            Servicios
          </span>
          <h1 className="font-bold tracking-tighter text-4xl md:text-5xl text-white leading-tight">
            Nuestros servicios y programas
          </h1>
          <p className="mt-5 text-white/75 text-lg max-w-[65ch] leading-relaxed">
            Servicios & Salud S.A.S. opera cinco líneas estratégicas de intervención
            en salud mental y bienestar psicosocial para municipios de Antioquia.
          </p>
        </div>
      </section>

      {/* Flagship — Línea 24/7 full-width feature */}
      {flagship && (
        <section className="py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="bg-surface-dark rounded-[2.5rem] shadow-diffusion-lg ring-1 ring-slate-900/5 p-8 md:p-12 lg:p-14">
                <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-16">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Emergency pill */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] bg-emergency/15 text-emergency">
                        Servicio insignia
                      </span>
                      {flagship.telefono && (
                        <span className="inline-flex items-center gap-2 bg-emergency text-white font-bold text-sm rounded-full px-4 py-1.5 tracking-tight">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
                          {flagship.telefono}
                        </span>
                      )}
                    </div>

                    <h2 className="font-extrabold tracking-tighter text-3xl md:text-4xl text-white mb-4">
                      {flagship.title}
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-[65ch] mb-8">
                      {flagship.longDescription}
                    </p>

                    <div className="mb-8">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-4">
                        Actividades principales
                      </p>
                      <ul className="space-y-2.5">
                        {flagship.actividades.map((a) => (
                          <li key={a} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-action shrink-0" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA with nested arrow chip */}
                    <Link
                      href={`/programas/${flagship.slug}`}
                      className="inline-flex items-center gap-3 bg-brand-action text-white font-bold text-sm px-6 py-3.5 rounded-[1.5rem] hover:-translate-y-1 transition-transform"
                    >
                      Ver servicio completo
                      <span className="bg-white/15 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        →
                      </span>
                    </Link>
                  </div>

                  {/* Phone callout card */}
                  {flagship.telefono && (
                    <aside className="lg:w-64 shrink-0 bg-white/5 border border-white/10 rounded-[1.5rem] p-7 text-white">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">
                        Línea de atención
                      </p>
                      <p className="font-extrabold tracking-tighter text-2xl xl:text-3xl whitespace-nowrap text-emergency leading-none mb-2">
                        {flagship.telefono}
                      </p>
                      <p className="text-white/50 text-xs leading-relaxed mt-3">
                        Disponible las 24 horas, los 7 días de la semana.
                        Atención telefónica y virtual.
                      </p>
                    </aside>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Remaining services — alternating offset rows */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-10 flex items-center gap-4">
              <span className="inline-block rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] bg-brand/8 text-brand">
                Portafolio
              </span>
              <h2 className="font-bold tracking-tighter text-2xl text-ink">
                Otros servicios estratégicos
              </h2>
            </div>
          </Reveal>

          <div className="divide-y divide-slate-100">
            {rest.map((p, idx) => (
              <Reveal key={p.slug} delay={idx * 80}>
                <article className="py-8 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 group hover:-translate-y-0.5 transition-transform">
                  {/* Number accent */}
                  <span className="shrink-0 w-10 h-10 rounded-full bg-brand/8 text-brand font-bold text-sm flex items-center justify-center">
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold tracking-tight text-xl text-ink mb-1.5">
                      {p.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-2 max-w-[65ch]">
                      {p.description}
                    </p>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      <span className="font-semibold text-slate-700">Objetivo: </span>
                      {p.objetivo}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <Link
                      href={`/programas/${p.slug}`}
                      className="inline-flex items-center gap-2 border border-brand/30 text-brand font-semibold text-sm px-5 py-2.5 rounded-[1rem] hover:bg-brand hover:text-white hover:-translate-y-0.5 transition-all"
                    >
                      Ver detalle
                      <span className="text-xs opacity-60">→</span>
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
