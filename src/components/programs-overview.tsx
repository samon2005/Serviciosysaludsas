import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const servicios = [
  {
    slug: 'linea-24-7',
    title: 'Línea de Atención 24/7',
    description:
      'Atención telefónica y virtual permanente en crisis suicida y emergencias psicosociales. Escucha activa, orientación, activación de la Ruta de Atención en Crisis Suicida y registro estandarizado para alertas tempranas.',
    featured: true,
  },
  {
    slug: 'proyecto-de-vida',
    title: 'Proyecto de Vida (SPA)',
    description:
      'Estrategias de prevención, mitigación y rehabilitación del consumo de sustancias psicoactivas, con enfoque territorial y basadas en evidencia.',
    featured: false,
  },
  {
    slug: 'centros-de-escucha',
    title: 'Centros de Escucha',
    description:
      'Espacios comunitarios de atención psicosocial para la detección temprana, orientación y canalización en salud mental.',
    featured: false,
  },
  {
    slug: 'pipst',
    title: 'PIPST',
    description:
      'Plataforma Inteligente Psicosocial Territorial: tableros de indicadores municipales, mapas de riesgo y alertas tempranas para la toma de decisiones en salud pública.',
    featured: false,
  },
  {
    slug: 'ctp',
    title: 'CTP',
    description:
      'Consejos Territoriales de Política Social: articulación con secretarías de salud, alcaldías y entidades del sector para la planeación intersectorial en salud mental.',
    featured: false,
  },
]

export function ProgramsOverview() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <Reveal className="mb-16 max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-action mb-3 font-sans">
            Servicios estratégicos
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-ink font-bold tracking-tighter text-balance leading-tight">
            Cinco líneas de intervención en salud mental pública
          </h2>
          <p className="mt-5 text-slate-500 font-sans text-lg leading-relaxed">
            Cada servicio está diseñado para un rol específico en el ecosistema
            de salud pública territorial de Antioquia.
          </p>
        </Reveal>

        {/* Lista editorial numerada */}
        <div className="border-t border-slate-200">
          {servicios.map(({ slug, title, description, featured }, i) => (
            <Reveal key={slug} delay={i * 60}>
              <Link
                href={`/programas/${slug}`}
                className="group grid grid-cols-[auto_1fr] md:grid-cols-[6rem_1fr_1.4fr_auto] items-start md:items-center gap-x-6 md:gap-x-10 gap-y-3 py-9 border-b border-slate-200 hover:bg-white transition-colors duration-300 px-2 md:px-4 -mx-2 md:-mx-4"
              >
                {/* Número */}
                <span className="font-heading font-extrabold tracking-tighter text-2xl md:text-3xl text-slate-300 group-hover:text-brand-action transition-colors duration-300 leading-none pt-1 md:pt-0">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Título */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading font-bold tracking-tight text-ink text-xl md:text-2xl leading-snug">
                    {title}
                  </h3>
                  {featured && (
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emergency/8 px-3 py-1">
                      <Phone size={12} className="text-emergency" strokeWidth={1.5} />
                      <span className="text-xs font-semibold text-emergency font-sans whitespace-nowrap">
                        (604) 444 24 24 · Servicio insignia
                      </span>
                    </span>
                  )}
                </div>

                {/* Descripción */}
                <p className="col-span-2 md:col-span-1 text-slate-500 font-sans text-base leading-relaxed">
                  {description}
                </p>

                {/* Flecha */}
                <span className="hidden md:flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-1 ring-slate-200 group-hover:ring-brand-action group-hover:bg-brand-action transition-all duration-300">
                  <ArrowRight
                    size={17}
                    strokeWidth={1.5}
                    className="text-slate-400 group-hover:text-white transition-colors duration-300"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Link to all programs */}
        <Reveal className="mt-12">
          <Link
            href="/programas"
            className="inline-flex items-center gap-2 text-base font-semibold text-brand-action hover:text-brand font-sans transition-colors duration-200"
          >
            Ver todos los servicios <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
