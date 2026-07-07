import Link from 'next/link'
import { ArrowRight, Phone, BookOpen, Users, BarChart2, Building2 } from 'lucide-react'

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
        <div className="mb-14 max-w-2xl">
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-action mb-3 font-sans">
            Servicios estratégicos
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-ink font-bold text-balance leading-tight">
            Cinco líneas de intervención en salud mental pública
          </h2>
          <p className="mt-4 text-slate-500 font-sans text-base leading-relaxed">
            Cada servicio está diseñado para un rol específico en el ecosistema
            de salud pública territorial de Antioquia.
          </p>
        </div>

        {/* Asymmetric grid: featured block + 2×2 */}
        <div className="grid lg:grid-cols-5 gap-5">

          {/* Featured — Línea 24/7, spanning 2 columns vertically */}
          <Link
            href={`/programas/${featured.slug}`}
            className="lg:col-span-2 lg:row-span-2 group block"
          >
            <div className="h-full flex flex-col bg-surface-dark rounded-2xl p-8 border border-white/5 hover:border-brand-action/30 transition-colors duration-200 min-h-[320px]">
              <div className="w-12 h-12 rounded-xl bg-emergency/10 flex items-center justify-center mb-6 shrink-0">
                <featured.icon size={22} className="text-emergency" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emergency/80 mb-3 font-sans">
                  Servicio insignia
                </span>
                <h3 className="font-heading text-white text-2xl font-bold mb-4 leading-snug">
                  {featured.title}
                </h3>
                <p className="text-white/55 font-sans text-sm leading-relaxed">
                  {featured.description}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-8 text-xs font-semibold text-brand-action uppercase tracking-wide font-sans group-hover:gap-3 transition-all duration-200">
                Conocer el servicio <ArrowRight size={13} />
              </div>
            </div>
          </Link>

          {/* Remaining 4 services in 2×2 grid */}
          {rest.map(({ slug, title, description, icon: Icon }) => (
            <Link
              key={slug}
              href={`/programas/${slug}`}
              className="lg:col-span-1 group block"
            >
              <div className="h-full flex flex-col bg-white rounded-xl p-6 border border-slate-100 hover:border-brand-action/25 hover:shadow-sm transition-all duration-200 min-h-[160px]">
                <div className="w-10 h-10 rounded-lg bg-brand/8 flex items-center justify-center mb-4 shrink-0">
                  <Icon size={18} className="text-brand" strokeWidth={1.5} />
                </div>
                <h3 className="font-sans font-semibold text-ink text-sm mb-2 leading-snug">
                  {title}
                </h3>
                <p className="text-slate-500 font-sans text-xs leading-relaxed flex-1">
                  {description}
                </p>
                <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-brand-action uppercase tracking-wide font-sans group-hover:gap-2 transition-all duration-200">
                  Ver más <ArrowRight size={11} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Link to all programs */}
        <div className="mt-10 text-center">
          <Link
            href="/programas"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-action hover:text-brand font-sans transition-colors duration-200"
          >
            Ver todos los servicios <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
