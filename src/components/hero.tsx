import Link from 'next/link'
import { Phone } from 'lucide-react'

const stats = [
  { value: '4', label: 'líneas de intervención' },
  { value: 'PDSP 2022-2031', label: 'alineación normativa' },
  { value: 'Atención 24/7', label: 'sin interrupción' },
  { value: 'Antioquia', label: 'cobertura territorial' },
]

export function Hero() {
  return (
    <section className="relative flex flex-col bg-surface-dark min-h-[calc(100dvh-4rem)]">
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Crisis banner — emergency accent, fixed within hero */}
      <div className="relative w-full bg-emergency/10 border-b border-emergency/20 py-2.5 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 flex-wrap">
          <Phone size={14} className="text-emergency shrink-0" strokeWidth={2} />
          <span className="text-sm font-medium text-emergency">
            ¿Necesita ayuda ahora? La Línea Amiga responde de inmediato, todos los días
          </span>
          <span className="text-white/30 hidden sm:inline">·</span>
          <Link
            href="/programas/linea-24-7"
            className="text-xs font-semibold text-white/70 underline underline-offset-2 hover:text-white transition-colors duration-200"
          >
            Conozca el servicio
          </Link>
        </div>
      </div>

      {/* Main hero content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
        <div className="max-w-3xl mx-auto">

          {/* Eyebrow */}
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-action/80 mb-8 font-sans">
            Servicios &amp; Salud S.A.S. · Salud pública territorial · Colombia
          </p>

          {/* Headline */}
          <h1 className="font-heading text-white leading-tight mb-8 text-balance"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.75rem)', fontWeight: 700, lineHeight: '1.1' }}>
            Prevención del suicidio e inteligencia psicosocial territorial
          </h1>

          {/* Subheadline */}
          <p className="text-white/55 font-sans text-base sm:text-lg leading-relaxed mb-12 max-w-xl mx-auto">
            Servicios especializados en salud mental pública para los
            municipios de Antioquia, alineados con el Plan Decenal de Salud
            Pública 2022-2031.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/programas/linea-24-7">
              <button className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-semibold bg-emergency text-white hover:bg-emergency/90 transition-colors duration-200 font-sans">
                Conozca la Línea Amiga 24/7
              </button>
            </Link>
            <Link href="/programas">
              <button className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-semibold text-white/80 border border-white/20 hover:border-white/40 hover:text-white hover:bg-white/5 transition-colors duration-200 font-sans">
                Ver todos los servicios
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Static institutional stats band */}
      <div className="relative border-t border-white/8 bg-black/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-y-5 gap-x-8 text-center">
            {stats.map(({ value, label }) => (
              <div key={value} className="flex flex-col gap-1">
                <dt className="text-lg sm:text-xl font-heading font-bold text-brand-action">
                  {value}
                </dt>
                <dd className="text-xs text-white/45 font-sans uppercase tracking-wide">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
