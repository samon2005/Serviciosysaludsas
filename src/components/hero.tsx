import Link from 'next/link'
import { Phone, ArrowRight } from 'lucide-react'

const stats = [
  { value: '4', label: 'líneas de intervención' },
  { value: 'PDSP', label: 'alineación 2022-2031' },
  { value: '24/7', label: 'sin interrupción' },
  { value: 'Antioquia', label: 'cobertura territorial' },
]

export function Hero() {
  return (
    <section className="relative bg-surface min-h-[calc(100dvh-8rem)] overflow-hidden">
      {/* Subtle background interest: radial gradient blob */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-10%',
          right: '-5%',
          width: '60%',
          height: '80%',
          background: 'radial-gradient(ellipse at center, rgba(3,105,161,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />
      {/* Soft dotted pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(12,74,110,0.12) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col">
            {/* Eyebrow pill */}
            <div className="mb-8 inline-flex w-fit">
              <span className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] bg-brand/8 text-brand font-semibold font-sans">
                Servicios &amp; Salud S.A.S · Salud pública territorial
              </span>
            </div>

            {/* Crisis floating pill — above headline */}
            <div className="mb-8 inline-flex w-fit">
              <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-diffusion ring-1 ring-slate-900/5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emergency/10">
                  <Phone size={11} className="text-emergency" strokeWidth={1.5} />
                </span>
                <span className="text-xs font-medium text-slate-700 font-sans">
                  ¿Necesita ayuda ahora? La Línea Amiga responde de inmediato
                </span>
                <Link
                  href="/programas/linea-24-7"
                  className="text-[11px] font-semibold text-brand-action underline underline-offset-2 hover:text-brand shrink-0"
                >
                  Conozca el servicio
                </Link>
              </div>
            </div>

            {/* Headline */}
            <h1 className="font-heading font-extrabold tracking-tighter text-ink leading-[1.05] text-4xl md:text-5xl lg:text-6xl text-balance mb-6">
              Prevención del suicidio e{' '}
              <span className="text-brand-action">
                inteligencia psicosocial
              </span>{' '}
              territorial
            </h1>

            {/* Subheadline */}
            <p className="text-slate-600 font-sans text-base sm:text-lg leading-relaxed max-w-[60ch] mb-10">
              Servicios especializados en salud mental pública para los
              municipios de Antioquia, alineados con el Plan Decenal de Salud
              Pública 2022-2031.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Primary CTA */}
              <Link href="/programas/linea-24-7" className="group">
                <span className="inline-flex items-center gap-3 rounded-full bg-emergency text-white px-7 py-3.5 text-sm font-semibold font-sans hover:bg-emergency/90 transition-colors duration-300">
                  Conozca la Línea Amiga 24/7
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight size={14} strokeWidth={1.5} />
                  </span>
                </span>
              </Link>

              {/* Secondary CTA */}
              <Link href="/programas">
                <span className="inline-flex items-center gap-2 rounded-full ring-1 ring-slate-300 text-ink px-7 py-3.5 text-sm font-semibold font-sans hover:bg-white hover:shadow-diffusion transition-all duration-300">
                  Ver todos los servicios
                </span>
              </Link>
            </div>
          </div>

          {/* ── RIGHT COLUMN: floating bento mini-stack ── */}
          <div className="relative flex flex-col gap-4 lg:pl-4">

            {/* Stats card — 2×2 grid */}
            <div className="bg-white rounded-[2rem] shadow-diffusion-lg ring-1 ring-slate-900/5 p-7 -rotate-1 hover:rotate-0 transition-transform duration-500">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-6 font-sans">
                Alcance institucional
              </p>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
                {stats.map(({ value, label }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <dt className="font-heading font-extrabold text-2xl md:text-3xl text-ink tracking-tight leading-none">
                      {value}
                    </dt>
                    <dd className="text-[11px] text-slate-500 font-sans uppercase tracking-wide leading-snug">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Accent card — phone number */}
            <div className="bg-brand rounded-[1.5rem] shadow-diffusion-lg ring-1 ring-brand/20 px-7 py-5 flex items-center justify-between translate-x-4 hover:translate-x-3 transition-transform duration-500">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 font-sans">
                  Línea Amiga 24/7
                </span>
                <span className="font-heading font-extrabold text-white text-xl tracking-tight">
                  (604) 444 24 24
                </span>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                <Phone size={18} className="text-white" strokeWidth={1.5} />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
