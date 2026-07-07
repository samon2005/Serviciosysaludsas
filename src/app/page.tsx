import { Hero } from '@/components/hero'
import { ProgramsOverview } from '@/components/programs-overview'
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
   Sección 4: Misión y Visión
────────────────────────────────────────────── */

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
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
            <div>
              <div className="inline-flex items-center gap-2 bg-emergency/8 border border-emergency/20 rounded-full px-4 py-1.5 mb-6">
                <Phone size={13} className="text-emergency" strokeWidth={2} />
                <span className="text-xs font-semibold text-emergency font-sans">
                  Línea Amiga 24/7
                </span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl text-ink font-bold leading-tight text-balance mb-5">
                Atención permanente en crisis suicida y emergencias psicosociales
              </h2>
              <p className="text-slate-500 font-sans text-base leading-relaxed mb-8">
                La Línea Amiga 24/7 es el servicio insignia de Servicios &amp; Salud S.A.S.
                Su objetivo es reducir las conductas autolesivas y los suicidios consumados
                en los municipios de Antioquia mediante atención especializada sin
                interrupción.
              </p>
              <Link href="/programas/linea-24-7">
                <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-sm font-semibold bg-emergency text-white hover:bg-emergency/90 transition-colors duration-200 font-sans">
                  Conozca la Línea Amiga 24/7 <ArrowRight size={14} />
                </button>
              </Link>
            </div>

            {/* Credencial visual */}
            <div className="bg-surface rounded-2xl p-8 border border-slate-100">
              <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-6 font-sans">
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
                    <CheckCircle size={15} className="text-brand mt-0.5 shrink-0" strokeWidth={2} />
                    <span className="text-sm text-slate-600 font-sans leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Los 4 pasos */}
          <div className="border-t border-slate-100 pt-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-8 font-sans">
              Cómo funciona
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pasos.map(({ numero, titulo, descripcion }) => (
                <div key={numero} className="flex flex-col gap-4">
                  <span className="font-heading text-4xl font-bold text-slate-100 leading-none select-none">
                    {numero}
                  </span>
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
        </div>
      </section>

      {/* 3. Servicios estratégicos — asimétrico */}
      <ProgramsOverview />

      {/* 4. Misión / Visión */}
      <section className="py-24 bg-surface-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Misión */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-brand-action mb-6 font-sans">
                Misión
              </p>
              <h2 className="font-heading text-2xl md:text-3xl text-white font-bold leading-tight mb-6 text-balance">
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
              <p className="text-xs font-semibold tracking-widest uppercase text-brand-action mb-6 font-sans">
                Visión 2028
              </p>
              <h2 className="font-heading text-2xl md:text-3xl text-white font-bold leading-tight mb-6 text-balance">
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
      </section>

      {/* 5. Alineación normativa */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-action mb-3 font-sans">
              Marco normativo
            </p>
            <h2 className="font-heading text-2xl md:text-3xl text-ink font-bold leading-tight text-balance">
              Alineación con la política nacional de salud mental
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {normas.map(({ codigo, titulo, descripcion }) => (
              <div
                key={codigo}
                className="flex flex-col gap-3 p-6 border border-slate-100 rounded-xl bg-surface"
              >
                <span className="font-sans text-xs font-bold tracking-widest uppercase text-brand-action">
                  {codigo}
                </span>
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
      </section>

      {/* 6. Valores y fortalezas */}
      <section className="py-20 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-action mb-3 font-sans">
              Nuestros principios
            </p>
            <h2 className="font-heading text-2xl md:text-3xl text-ink font-bold leading-tight text-balance">
              Valores que orientan cada intervención
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
            {valores.map(({ titulo, descripcion }) => (
              <div key={titulo} className="flex gap-4 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-action mt-2 shrink-0" />
                <div>
                  <h3 className="font-sans font-semibold text-ink text-sm mb-1.5">
                    {titulo}
                  </h3>
                  <p className="text-slate-500 font-sans text-sm leading-relaxed">
                    {descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
