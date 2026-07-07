import Link from 'next/link'
import Image from 'next/image'
import { Phone, ArrowRight } from 'lucide-react'

const stats = [
  { value: '4', label: 'líneas de intervención' },
  { value: 'PDSP', label: 'alineación 2022-2031' },
  { value: '24/7', label: 'sin interrupción' },
  { value: 'Antioquia', label: 'cobertura territorial' },
]

export function Hero() {
  return (
    <section className="relative bg-surface overflow-hidden">
      {/* Soft dotted pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(12,74,110,0.12) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-24">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col">
            {/* Crisis floating pill */}
            <div className="mb-10 inline-flex w-fit">
              <div className="flex items-center gap-3 bg-white rounded-full px-5 py-2.5 shadow-diffusion ring-1 ring-slate-900/5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emergency/10">
                  <Phone size={13} className="text-emergency" strokeWidth={1.5} />
                </span>
                <span className="text-sm font-medium text-slate-700 font-sans">
                  ¿Necesita ayuda ahora? La Línea Amiga responde de inmediato
                </span>
                <Link
                  href="/programas/linea-24-7"
                  className="text-xs font-semibold text-brand-action underline underline-offset-2 hover:text-brand shrink-0"
                >
                  Conozca el servicio
                </Link>
              </div>
            </div>

            {/* Headline */}
            <h1 className="font-heading font-extrabold tracking-tighter text-ink leading-[1.05] text-4xl md:text-5xl lg:text-6xl text-balance mb-7">
              Prevención del suicidio e{' '}
              <span className="text-brand-action">
                inteligencia psicosocial
              </span>{' '}
              territorial
            </h1>

            {/* Subheadline */}
            <p className="text-slate-600 font-sans text-lg sm:text-xl leading-relaxed max-w-[56ch] mb-11">
              Servicios especializados en salud mental pública para los
              municipios de Antioquia, alineados con el Plan Decenal de Salud
              Pública 2022-2031.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/programas/linea-24-7" className="group">
                <span className="inline-flex items-center gap-3 rounded-full bg-emergency text-white px-8 py-4 text-base font-semibold font-sans hover:bg-emergency/90 transition-colors duration-300">
                  Conozca la Línea Amiga 24/7
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight size={16} strokeWidth={1.5} />
                  </span>
                </span>
              </Link>

              <Link href="/programas">
                <span className="inline-flex items-center gap-2 rounded-full ring-1 ring-slate-300 text-ink px-8 py-4 text-base font-semibold font-sans hover:bg-white hover:shadow-diffusion transition-all duration-300">
                  Ver todos los servicios
                </span>
              </Link>
            </div>
          </div>

          {/* ── RIGHT COLUMN: imagen con corte diagonal + tarjeta teléfono ── */}
          <div className="relative hidden sm:block">
            <div
              className="relative h-[26rem] lg:h-[32rem] overflow-hidden rounded-[2rem] shadow-diffusion-lg"
              style={{ clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 0 100%)' }}
            >
              <Image
                src="/images/comunidad-hero.jpg"
                alt="Grupo de personas chocando las manos en un entorno natural, transmitiendo apoyo y comunidad"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
              {/* Velo sutil para integrar la foto con la paleta */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand/25 via-transparent to-transparent" />
            </div>

            {/* Tarjeta teléfono — flotando sobre la imagen */}
            <div className="absolute -bottom-5 left-0 lg:-left-6 bg-brand rounded-[1.5rem] shadow-diffusion-lg px-7 py-5 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-500">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
                <Phone size={20} className="text-white" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60 font-sans">
                  Línea Amiga 24/7
                </span>
                <a
                  href="tel:6044442424"
                  className="font-heading font-extrabold text-white text-2xl tracking-tight whitespace-nowrap"
                >
                  (604) 444 24 24
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Banda de cifras — inline, sin tarjeta */}
        <dl className="mt-20 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-y-8 divide-x-0 lg:divide-x divide-slate-200">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1 lg:px-8 first:pl-0">
              <dt className="font-heading font-extrabold text-3xl md:text-4xl text-ink tracking-tight leading-none">
                {value}
              </dt>
              <dd className="text-xs text-slate-500 font-sans uppercase tracking-wide leading-snug">
                {label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
