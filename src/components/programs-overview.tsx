import Link from 'next/link'
import { ArrowRight, Phone, BookOpen, Users, BarChart2, Building2 } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const servicios = [
  {
    slug: 'linea-24-7',
    title: 'Línea Amiga 24/7',
    description:
      'Atención telefónica y virtual permanente en crisis suicida y emergencias psicosociales. Escucha activa, orientación, activación de la Ruta de Atención en Crisis Suicida y registro estandarizado para alertas tempranas.',
    icon: Phone,
    featured: true,
  },
  {
    slug: 'proyecto-de-vida',
    title: 'Proyecto de Vida (SPA)',
    description:
      'Estrategias de prevención, mitigación y rehabilitación del consumo de sustancias psicoactivas, con enfoque territorial y basadas en evidencia.',
    icon: BookOpen,
    featured: false,
  },
  {
    slug: 'centros-de-escucha',
    title: 'Centros de Escucha',
    description:
      'Espacios comunitarios de atención psicosocial para la detección temprana, orientación y canalización en salud mental.',
    icon: Users,
    featured: false,
  },
  {
    slug: 'pipst',
    title: 'PIPST',
    description:
      'Plataforma Inteligente Psicosocial Territorial: tableros de indicadores municipales, mapas de riesgo y alertas tempranas para la toma de decisiones en salud pública.',
    icon: BarChart2,
    featured: false,
  },
  {
    slug: 'ctp',
    title: 'CTP',
    description:
      'Consejos Territoriales de Política Social: articulación con secretarías de salud, alcaldías y entidades del sector para la planeación intersectorial en salud mental.',
    icon: Building2,
    featured: false,
  },
]

export function ProgramsOverview() {
  const [featured, ...rest] = servicios

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <Reveal className="mb-14 max-w-2xl">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-action mb-3 font-sans">
            Servicios estratégicos
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-ink font-bold tracking-tighter text-balance leading-tight">
            Cinco líneas de intervención en salud mental pública
          </h2>
          <p className="mt-4 text-slate-500 font-sans text-base leading-relaxed">
            Cada servicio está diseñado para un rol específico en el ecosistema
            de salud pública territorial de Antioquia.
          </p>
        </Reveal>

        {/* Asymmetric bento grid */}
        <div className="grid lg:grid-cols-5 gap-5">

          {/* Featured — Línea 24/7, col-span-2, tall */}
          <Reveal className="lg:col-span-2 lg:row-span-2">
            <Link
              href={`/programas/${featured.slug}`}
              className="group block h-full"
            >
              <div className="h-full flex flex-col bg-surface-dark rounded-[2rem] p-8 ring-1 ring-white/5 shadow-diffusion-lg hover:ring-brand-action/30 hover:-translate-y-1 hover:shadow-diffusion-lg transition-all duration-300 min-h-[340px]">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-[1rem] bg-emergency/15 flex items-center justify-center shrink-0">
                    <featured.icon size={22} className="text-emergency" strokeWidth={1.5} />
                  </div>
                  {/* Emergency phone chip */}
                  <div className="flex items-center gap-2 rounded-full bg-white/8 ring-1 ring-white/10 px-3 py-1.5">
                    <Phone size={11} className="text-emergency" strokeWidth={1.5} />
                    <span className="text-[11px] font-semibold text-white/70 font-sans">(604) 444 24 24</span>
                  </div>
                </div>

                <div className="flex-1">
                  <span className="inline-block text-[10px] font-semibold tracking-[0.2em] uppercase text-emergency/80 mb-3 font-sans">
                    Servicio insignia
                  </span>
                  <h3 className="font-heading text-white text-2xl font-bold tracking-tighter mb-4 leading-snug">
                    {featured.title}
                  </h3>
                  <p className="text-white/55 font-sans text-sm leading-relaxed">
                    {featured.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-8">
                  <span className="text-xs font-semibold text-brand-action uppercase tracking-wide font-sans group-hover:mr-0.5 transition-all duration-200">
                    Conocer el servicio
                  </span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-action/15 transition-all duration-300 group-hover:bg-brand-action/25 group-hover:translate-x-0.5">
                    <ArrowRight size={13} className="text-brand-action" strokeWidth={1.5} />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* Remaining 4 services */}
          {rest.map(({ slug, title, description, icon: Icon }, i) => (
            <Reveal key={slug} delay={i * 80} className="lg:col-span-1">
              <Link
                href={`/programas/${slug}`}
                className="group block h-full"
              >
                <div className="h-full flex flex-col bg-white rounded-[1.5rem] p-6 ring-1 ring-slate-900/5 shadow-diffusion hover:shadow-diffusion-lg hover:-translate-y-1 hover:ring-brand-action/20 transition-all duration-300 min-h-[160px]">
                  <div className="w-10 h-10 rounded-[0.75rem] bg-brand/8 flex items-center justify-center mb-4 shrink-0">
                    <Icon size={18} className="text-brand" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-sans font-semibold text-ink text-sm mb-2 leading-snug">
                    {title}
                  </h3>
                  <p className="text-slate-500 font-sans text-xs leading-relaxed flex-1">
                    {description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-4">
                    <span className="text-xs font-semibold text-brand-action uppercase tracking-wide font-sans">
                      Ver más
                    </span>
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-action/10 transition-all duration-300 group-hover:bg-brand-action/20 group-hover:translate-x-0.5">
                      <ArrowRight size={10} className="text-brand-action" strokeWidth={1.5} />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Link to all programs */}
        <Reveal className="mt-10 text-center">
          <Link
            href="/programas"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-action hover:text-brand font-sans transition-colors duration-200"
          >
            Ver todos los servicios <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
