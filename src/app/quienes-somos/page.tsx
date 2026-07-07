import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quiénes somos — Servicios & Salud S.A.S.',
  description:
    'Empresa privada con enfoque social y territorial fundada en 2023, dedicada a la gestión integral de la salud mental y el bienestar psicosocial en Antioquia.',
}

const valores = [
  { title: 'Trabajo en equipo', desc: 'Construimos resultados de manera conjunta, articulando capacidades internas y alianzas institucionales.' },
  { title: 'Competencia', desc: 'Actuamos desde la formación técnica y la experiencia territorial, con rigor metodológico en cada intervención.' },
  { title: 'Ética', desc: 'Nuestras actuaciones se rigen por principios deontológicos y por el respeto a la dignidad de las personas atendidas.' },
  { title: 'Confianza', desc: 'Generamos relaciones sólidas con los municipios, las comunidades y los equipos de salud pública.' },
  { title: 'Transparencia', desc: 'Comunicamos con claridad los procesos, resultados y limitaciones de nuestras intervenciones.' },
]

const proyectosLiderados = [
  'Línea Amiga 24/7',
  'Proyecto de Vida (mitigación SPA)',
  'Centros de Escucha',
  'Diplomado en Atención Integral a la Primera Infancia',
  'Fortalecimiento Institucional del Concejo Municipal',
  'Programa de Intervención en Zoonosis',
]

export default function QuienesSomosPage() {
  return (
    <main>
      {/* Header */}
      <section className="bg-brand py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-sans font-semibold uppercase tracking-widest text-white/60 mb-3">
            La empresa
          </p>
          <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight">
            Quiénes somos
          </h1>
          <p className="mt-4 font-sans text-white/75 text-lg max-w-2xl">
            Empresa privada con enfoque social y territorial dedicada a la gestión
            integral de la salud mental y el bienestar psicosocial en Colombia.
          </p>
        </div>
      </section>

      {/* Reseña histórica */}
      <section className="bg-surface py-14 md:py-18">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2">
              <h2 className="font-heading text-2xl text-ink mb-6">Reseña histórica</h2>
              <div className="font-sans text-slate-600 text-base leading-relaxed space-y-4">
                <p>
                  Servicios &amp; Salud S.A.S. fue constituida en 2023 con el propósito de
                  gestionar de manera integral la salud mental y el bienestar psicosocial
                  en el territorio antioqueño. Desde su fundación, la empresa ha liderado
                  proyectos de alto impacto en prevención del suicidio, mitigación del
                  consumo de sustancias psicoactivas, atención comunitaria y fortalecimiento
                  institucional.
                </p>
                <p>
                  Su director cuenta con reconocimiento a nivel nacional en el campo de la
                  salud pública territorial, lo que ha permitido articular con secretarías
                  de salud, entidades educativas y organismos municipales para desarrollar
                  respuestas pertinentes a las necesidades del territorio.
                </p>
              </div>

              <div className="mt-8">
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                  Proyectos liderados desde 2023
                </p>
                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                  {proyectosLiderados.map((p) => (
                    <li key={p} className="flex items-start gap-2 font-sans text-sm text-slate-700">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-action shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick facts */}
            <aside className="space-y-4">
              {[
                { label: 'Año de fundación', value: '2023' },
                { label: 'Sector', value: 'Salud pública territorial' },
                { label: 'Sede principal', value: 'Antioquia, Colombia' },
                { label: 'Marco normativo', value: 'PDSP 2022-2031 · Ley 1616 de 2013' },
              ].map((f) => (
                <div key={f.label} className="bg-white border border-slate-200 rounded-lg px-5 py-4">
                  <p className="font-sans text-xs text-slate-400 font-semibold uppercase tracking-widest mb-1">
                    {f.label}
                  </p>
                  <p className="font-sans text-sm font-semibold text-ink">{f.value}</p>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="bg-white py-14 md:py-18 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Misión */}
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand mb-3">
                Misión
              </p>
              <h2 className="font-heading text-2xl text-ink mb-4">
                Lo que hacemos y para quién
              </h2>
              <p className="font-sans text-slate-600 text-base leading-relaxed">
                Somos una empresa privada con enfoque social y territorial dedicada
                a la gestión integral de la salud mental y el bienestar psicosocial.
                Diseñamos, implementamos y evaluamos programas de prevención, atención
                y mitigación en salud mental, articulando con los municipios, las
                secretarías de salud y las comunidades para generar respuestas oportunas
                y pertinentes al territorio.
              </p>
            </div>

            {/* Visión */}
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand mb-3">
                Visión 2028
              </p>
              <h2 className="font-heading text-2xl text-ink mb-4">
                Hacia dónde vamos
              </h2>
              <p className="font-sans text-slate-600 text-base leading-relaxed mb-4">
                Ser la empresa líder nacional en inteligencia psicosocial territorial,
                reconocida por sus aportes en:
              </p>
              <ul className="space-y-2">
                {[
                  'Innovación en prevención del suicidio y mitigación de SPA',
                  'Analítica predictiva y alertas tempranas territoriales',
                  'Modelos de intervención replicables en otros departamentos',
                  'Liderazgo en la formulación de políticas públicas de salud mental',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 font-sans text-sm text-slate-700">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-action shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-surface py-14 md:py-18 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-brand mb-3">
            Valores corporativos
          </p>
          <h2 className="font-heading text-2xl text-ink mb-8">
            Los principios que guían nuestra actuación
          </h2>
          <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {valores.map((v) => (
              <div key={v.title} className="bg-white border border-slate-200 rounded-lg p-6">
                <dt className="font-heading text-lg text-ink mb-2">{v.title}</dt>
                <dd className="font-sans text-slate-500 text-sm leading-relaxed">{v.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Política de calidad */}
      <section className="bg-brand py-14 md:py-18">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-white/50 mb-3">
            Política de calidad
          </p>
          <h2 className="font-heading text-2xl text-white mb-6">
            Compromiso con la calidad y la mejora continua
          </h2>
          <div className="font-sans text-white/75 text-base leading-relaxed space-y-4 max-w-3xl">
            <p>
              Servicios &amp; Salud S.A.S. se compromete a estandarizar sus procesos
              de intervención para garantizar la eficacia de las acciones preventivas
              y la pertinencia de sus programas en el territorio.
            </p>
            <p>
              La política de calidad orienta la formación continua del equipo técnico,
              la generación de información estratégica replicable y el estricto
              cumplimiento del Plan Decenal de Salud Pública 2022-2031, así como de
              las disposiciones de protección de datos personales vigentes en Colombia
              (Ley 1581 de 2012 y normas reglamentarias — Habeas Data).
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
