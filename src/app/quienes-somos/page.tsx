import { Reveal } from '@/components/reveal'
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

const timelineItems = [
  {
    year: '2023',
    title: 'Fundación',
    desc: 'Servicios & Salud S.A.S. fue constituida con el propósito de gestionar de manera integral la salud mental y el bienestar psicosocial en el territorio antioqueño.',
  },
  {
    year: '2023',
    title: 'Primeros proyectos',
    desc: 'Desde su fundación, la empresa lideró proyectos de alto impacto en prevención del suicidio, mitigación del consumo de sustancias psicoactivas, atención comunitaria y fortalecimiento institucional.',
  },
  {
    year: 'Hoy',
    title: 'Expansión territorial',
    desc: 'El director cuenta con reconocimiento a nivel nacional en salud pública territorial, articulando con secretarías de salud, entidades educativas y organismos municipales para desarrollar respuestas pertinentes al territorio.',
  },
]

export default function QuienesSomosPage() {
  return (
    <main className="bg-surface min-h-screen">
      {/* Header — editorial intro */}
      <section className="bg-brand py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] bg-white/10 text-white/80 mb-5">
            La empresa
          </span>
          <h1 className="font-extrabold tracking-tighter text-4xl md:text-6xl text-white leading-tight max-w-3xl">
            Quiénes somos
          </h1>
          <p className="mt-5 text-white/75 text-lg max-w-[65ch] leading-relaxed">
            Empresa privada con enfoque social y territorial dedicada a la gestión
            integral de la salud mental y el bienestar psicosocial en Colombia.
          </p>
        </div>
      </section>

      {/* Reseña histórica — vertical timeline */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            <div className="md:col-span-2">
              <Reveal>
                <span className="inline-block rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] bg-brand/8 text-brand mb-4">
                  Reseña histórica
                </span>
                <h2 className="font-bold tracking-tighter text-3xl text-ink mb-10">
                  Una empresa nacida del territorio
                </h2>
              </Reveal>

              {/* Vertical timeline */}
              <div className="relative">
                {/* Hairline */}
                <div className="absolute left-3.5 top-2 bottom-4 w-px bg-slate-200" />

                <ol className="space-y-10 pl-10">
                  {timelineItems.map((item, i) => (
                    <Reveal key={item.title} delay={i * 100}>
                      <li className="relative">
                        {/* Dot */}
                        <span className="absolute -left-[2.35rem] top-1 w-3 h-3 rounded-full bg-brand border-2 border-surface" />
                        <span className="inline-block text-[11px] uppercase tracking-[0.15em] text-brand font-semibold mb-1">
                          {item.year}
                        </span>
                        <h3 className="font-bold text-ink text-base mb-1.5">{item.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed max-w-[60ch]">{item.desc}</p>
                      </li>
                    </Reveal>
                  ))}
                </ol>
              </div>

              <Reveal delay={300}>
                <div className="mt-12 pl-10">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-4">
                    Proyectos liderados desde 2023
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
                    {proyectosLiderados.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-action shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            {/* Quick facts sidebar */}
            <aside className="space-y-3">
              <Reveal delay={100}>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-4">Datos clave</p>
              </Reveal>
              {[
                { label: 'Año de fundación', value: '2023' },
                { label: 'Sector', value: 'Salud pública territorial' },
                { label: 'Sede principal', value: 'Antioquia, Colombia' },
                { label: 'Marco normativo', value: 'PDSP 2022-2031 · Ley 1616 de 2013' },
              ].map((f, i) => (
                <Reveal key={f.label} delay={i * 60 + 120}>
                  <div className="bg-white rounded-[1rem] shadow-diffusion ring-1 ring-slate-900/5 px-5 py-4">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-slate-400 mb-1">
                      {f.label}
                    </p>
                    <p className="font-semibold text-sm text-ink">{f.value}</p>
                  </div>
                </Reveal>
              ))}
            </aside>
          </div>
        </div>
      </section>

      {/* Misión y Visión — asymmetric 2-col split */}
      <section className="border-t border-slate-100 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="inline-block rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] bg-brand/8 text-brand mb-8">
              Misión y visión
            </span>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Misión — white diffusion card */}
            <Reveal delay={0}>
              <div className="bg-white rounded-[2rem] shadow-diffusion-lg ring-1 ring-slate-900/5 p-8 md:p-10 h-full">
                <p className="text-[11px] uppercase tracking-[0.2em] text-brand mb-4">Misión</p>
                <h2 className="font-bold tracking-tighter text-2xl text-ink mb-5">
                  Lo que hacemos y para quién
                </h2>
                <p className="text-slate-600 text-base leading-relaxed max-w-[55ch]">
                  Somos una empresa privada con enfoque social y territorial dedicada
                  a la gestión integral de la salud mental y el bienestar psicosocial.
                  Diseñamos, implementamos y evaluamos programas de prevención, atención
                  y mitigación en salud mental, articulando con los municipios, las
                  secretarías de salud y las comunidades para generar respuestas oportunas
                  y pertinentes al territorio.
                </p>
              </div>
            </Reveal>

            {/* Visión — brand/dark card */}
            <Reveal delay={100}>
              <div className="bg-brand rounded-[2rem] p-8 md:p-10 text-white h-full">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-4">Visión 2028</p>
                <h2 className="font-bold tracking-tighter text-2xl text-white mb-5">
                  Hacia dónde vamos
                </h2>
                <p className="text-white/70 text-base leading-relaxed mb-6">
                  Ser la empresa líder nacional en inteligencia psicosocial territorial,
                  reconocida por sus aportes en:
                </p>
                <ul className="space-y-3">
                  {[
                    'Innovación en prevención del suicidio y mitigación de SPA',
                    'Analítica predictiva y alertas tempranas territoriales',
                    'Modelos de intervención replicables en otros departamentos',
                    'Liderazgo en la formulación de políticas públicas de salud mental',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-white/80 text-sm">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Valores — inline pills */}
      <section className="bg-surface border-t border-slate-100 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="inline-block rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] bg-brand/8 text-brand mb-4">
              Valores corporativos
            </span>
            <h2 className="font-bold tracking-tighter text-3xl text-ink mb-10">
              Los principios que guían nuestra actuación
            </h2>
          </Reveal>

          <dl className="space-y-0 divide-y divide-slate-100">
            {valores.map((v, i) => (
              <Reveal key={v.title} delay={i * 60}>
                <div className="py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
                  <dt className="shrink-0">
                    <span className="inline-block rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.15em] font-semibold bg-brand/8 text-brand">
                      {v.title}
                    </span>
                  </dt>
                  <dd className="text-slate-600 text-sm leading-relaxed max-w-[65ch]">{v.desc}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Política de calidad — numbered list with divide-y */}
      <section className="bg-white border-t border-slate-100 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="inline-block rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] bg-brand/8 text-brand mb-4">
              Política de calidad
            </span>
            <h2 className="font-bold tracking-tighter text-3xl text-ink mb-8">
              Compromiso con la calidad y la mejora continua
            </h2>
          </Reveal>

          <div className="divide-y divide-slate-100 max-w-3xl">
            {[
              {
                n: '01',
                text: 'Estandarización de procesos de intervención para garantizar la eficacia de las acciones preventivas y la pertinencia de sus programas en el territorio.',
              },
              {
                n: '02',
                text: 'Formación continua del equipo técnico orientada a la generación de información estratégica replicable.',
              },
              {
                n: '03',
                text: 'Estricto cumplimiento del Plan Decenal de Salud Pública 2022-2031 y de las disposiciones de protección de datos personales vigentes en Colombia (Ley 1581 de 2012 y normas reglamentarias — Habeas Data).',
              },
            ].map((item, i) => (
              <Reveal key={item.n} delay={i * 80}>
                <div className="py-6 flex items-start gap-6">
                  <span className="shrink-0 font-bold text-2xl tracking-tighter text-brand/20 w-10 text-right">
                    {item.n}
                  </span>
                  <p className="text-slate-600 text-base leading-relaxed">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
