import { Hero } from '@/components/hero'
import { ProgramsOverview } from '@/components/programs-overview'
import { Reveal } from '@/components/reveal'
import Link from 'next/link'
import { Phone, ArrowRight, CheckCircle } from 'lucide-react'

/* ──────────────────────────────────────────────
   Sección 2: Línea Amiga 24/7 — los 4 pasos
────────────────────────────────────────────── */
const pasos = [
  {
    numero: '01',
    titulo: 'Atención inmediata',
    descripcion:
      'La llamada o contacto virtual es recibido de inmediato por un profesional de la salud mental, sin tiempos de espera.',
  },
  {
    numero: '02',
    titulo: 'Escucha activa y orientación',
    descripcion:
      'El profesional aplica técnicas de escucha activa, valora el nivel de riesgo y orienta al consultante y su familia.',
  },
  {
    numero: '03',
    titulo: 'Activación de la ruta de atención en crisis suicida',
    descripcion:
      'Cuando se detecta riesgo, se activa la Ruta de Atención en Crisis Suicida coordinando con hospitales, EPS, Policía o Secretaría de Salud.',
  },
  {
    numero: '04',
    titulo: 'Registro estandarizado para alertas tempranas',
    descripcion:
      'Cada atención queda registrada en el sistema PIPST, generando datos para análisis de tendencias y alertas tempranas municipales.',
  },
]

/* ──────────────────────────────────────────────
   Sección 5: Marco normativo
────────────────────────────────────────────── */
const normas = [
  {
    codigo: 'PDSP 2022-2031',
    titulo: 'Plan Decenal de Salud Pública',
    descripcion:
      'Los servicios de Servicios & Salud S.A.S. están alineados con los objetivos y metas del Plan Decenal de Salud Pública de Colombia 2022-2031.',
  },
  {
    codigo: 'Ley 1616 de 2013',
    titulo: 'Ley de Salud Mental',
    descripcion:
      'La Ley 1616 establece el marco normativo para garantizar el ejercicio pleno del derecho a la salud mental de la población colombiana.',
  },
  {
    codigo: 'PNSM 2018',
    titulo: 'Política Nacional de Salud Mental 2018',
    descripcion:
      'Marco de política que orienta la gestión integral de la salud mental con enfoque territorial, diferencial y de derechos.',
  },
]

/* ──────────────────────────────────────────────
   Sección 6: Valores
────────────────────────────────────────────── */
const valores = [
  {
    titulo: 'Rigor técnico',
    descripcion: 'Intervenciones fundamentadas en evidencia científica y protocolos validados.',
  },
  {
    titulo: 'Compromiso territorial',
    descripcion: 'Profundo conocimiento del contexto municipal y departamental de Antioquia.',
  },
  {
    titulo: 'Articulación institucional',
    descripcion: 'Trabajo coordinado con secretarías de salud, alcaldías, hospitales y entidades del sector.',
  },
  {
    titulo: 'Transparencia en resultados',
    descripcion: 'Medición y reporte de impacto con trazabilidad desde la intervención individual hasta el análisis municipal.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Línea Amiga 24/7 — sección destacada */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <Reveal className="grid lg:grid-cols-2 gap-12 items-start mb-16">
            <div>
              <div className="inline-flex items-center gap-2 bg-emergency/8 border border-emergency/20 rounded-full px-4 py-1.5 mb-6">
                <Phone size={13} className="text-emergency" strokeWidth={1.5} />
                <span className="text-xs font-semibold text-emergency font-sans">
                  Línea Amiga 24/7
                </span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl text-ink font-bold leading-tight tracking-tighter text-balance mb-5">
                Atención permanente en crisis suicida y emergencias psicosociales
              </h2>
              <p className="text-slate-500 font-sans text-base leading-relaxed mb-8">
                La Línea Amiga 24/7 es el servicio insignia de Servicios &amp; Salud S.A.S.
                Su objetivo es reducir las conductas autolesivas y los suicidios consumados
                en los municipios de Antioquia mediante atención especializada sin
                interrupción.
              </p>
              <Link href="/programas/linea-24-7" className="group">
                <span className="inline-flex items-center gap-3 rounded-full bg-emergency text-white px-7 py-3.5 text-sm font-semibold font-sans hover:bg-emergency/90 transition-colors duration-300">
                  Conozca la Línea Amiga 24/7
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight size={13} strokeWidth={1.5} />
                  </span>
                </span>
              </Link>
            </div>

            {/* Credencial visual */}
            <div className="bg-surface rounded-[1.5rem] p-8 shadow-diffusion ring-1 ring-slate-900/5">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-slate-400 mb-6 font-sans">
                Lo que garantizamos
              </p>
              <ul className="flex flex-col gap-4">
                {[
                  'Atención telefónica y virtual permanente, todos los días del año',
                  'Profesionales de la salud mental especializados en crisis',
                  'Activación inmediata de la Ruta de Atención en Crisis Suicida',
                  'Registro estandarizado para análisis de tendencias y alertas tempranas',
                  'Articulación con hospitales, EPS, Policía y Secretarías de Salud',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle size={15} className="text-brand mt-0.5 shrink-0" strokeWidth={1.5} />
                    <span className="text-sm text-slate-600 font-sans leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Los 4 pasos — connected horizontal flow */}
          <Reveal>
            <div className="bg-white rounded-[2rem] shadow-diffusion-lg ring-1 ring-slate-900/5 p-8 md:p-10">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-slate-400 mb-8 font-sans">
                Cómo funciona
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                {pasos.map(({ numero, titulo, descripcion }, i) => (
                  <div key={numero} className="flex flex-col gap-3 px-0 sm:px-6 lg:px-7 py-6 sm:py-0 first:pl-0 last:pr-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/8 text-brand font-heading font-bold text-[11px] tracking-wide">
                        {numero}
                      </span>
                      {i < pasos.length - 1 && (
                        <div className="hidden lg:block flex-1 h-px bg-slate-100" />
                      )}
                    </div>
                    <h3 className="font-sans font-semibold text-ink text-sm leading-snug">
                      {titulo}
                    </h3>
                    <p className="text-slate-500 font-sans text-xs leading-relaxed">
                      {descripcion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. Servicios estratégicos — asimétrico */}
      <ProgramsOverview />

      {/* 4. Misión / Visión — single allowed dark section */}
      <section className="py-24 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="bg-surface-dark rounded-[2.5rem] px-8 py-14 md:px-14 md:py-16">
              <div className="grid lg:grid-cols-2 gap-16 items-start">

                {/* Misión */}
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-action mb-6 font-sans">
                    Misión
                  </p>
                  <h2 className="font-heading text-2xl md:text-3xl text-white font-bold tracking-tighter leading-tight mb-6 text-balance">
                    Fortalecer la salud mental pública con intervención técnica y territorial
                  </h2>
                  <p className="text-white/55 font-sans text-base leading-relaxed">
                    Servicios &amp; Salud S.A.S. brinda servicios especializados en salud mental,
                    prevención del suicidio y gestión psicosocial a entidades territoriales y
                    del sector salud. Generamos impacto medible mediante intervenciones basadas
                    en evidencia, articulación intersectorial y tecnología aplicada al análisis
                    de indicadores de salud pública.
                  </p>
                </div>

                {/* Visión */}
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-action mb-6 font-sans">
                    Visión 2028
                  </p>
                  <h2 className="font-heading text-2xl md:text-3xl text-white font-bold tracking-tighter leading-tight mb-6 text-balance">
                    Empresa líder nacional en inteligencia psicosocial territorial
                  </h2>
                  <p className="text-white/55 font-sans text-base leading-relaxed">
                    Para 2028, Servicios &amp; Salud S.A.S. será reconocida como la empresa
                    colombiana referente en inteligencia psicosocial territorial, con presencia
                    en todos los departamentos y una plataforma de datos —PIPST— que oriente
                    la política pública en salud mental a nivel nacional.
                  </p>
                </div>

              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. Alineación normativa */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-12">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-action mb-3 font-sans">
                Marco normativo
              </p>
              <h2 className="font-heading text-2xl md:text-3xl text-ink font-bold tracking-tighter leading-tight text-balance">
                Alineación con la política nacional de salud mental
              </h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            {normas.map(({ codigo, titulo, descripcion }, i) => (
              <Reveal key={codigo} delay={i * 100} className="flex flex-col gap-3 py-8 sm:py-0 sm:px-8 first:pl-0 last:pr-0">
                <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-brand-action">
                  {codigo}
                </span>
                <h3 className="font-sans font-semibold text-ink text-sm leading-snug">
                  {titulo}
                </h3>
                <p className="text-slate-500 font-sans text-xs leading-relaxed">
                  {descripcion}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Valores y fortalezas */}
      <section className="py-20 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-action mb-3 font-sans">
              Nuestros principios
            </p>
            <h2 className="font-heading text-2xl md:text-3xl text-ink font-bold tracking-tighter leading-tight text-balance">
              Valores que orientan cada intervención
            </h2>
          </Reveal>

          <div className="flex flex-wrap gap-x-3 gap-y-3">
            {valores.map(({ titulo, descripcion }) => (
              <div
                key={titulo}
                title={descripcion}
                className="group relative flex items-center gap-2.5 rounded-full bg-white ring-1 ring-slate-200 px-5 py-2.5 hover:ring-brand-action/30 hover:shadow-diffusion transition-all duration-300 cursor-default"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-action shrink-0" />
                <span className="font-sans font-semibold text-ink text-sm">{titulo}</span>
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-ink text-white text-xs font-sans leading-relaxed rounded-xl px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 shadow-diffusion-lg">
                  {descripcion}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
