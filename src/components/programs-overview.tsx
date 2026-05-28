import Link from 'next/link'
import { programas } from '@/lib/programas-data'
import { ArrowRight, Brain, Heart, Shield, Users } from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  brain: <Brain size={22} strokeWidth={1.5} />,
  heart: <Heart size={22} strokeWidth={1.5} />,
  shield: <Shield size={22} strokeWidth={1.5} />,
  users: <Users size={22} strokeWidth={1.5} />,
}

export function ProgramsOverview() {
  return (
    <section className="py-24" style={{ backgroundColor: '#F4F6F9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: '#2980B9', fontFamily: 'var(--font-sans), sans-serif' }}
          >
            Nuestros Programas
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: '#1C2833', fontFamily: 'var(--font-heading), Georgia, serif' }}
          >
            Líneas de Intervención
          </h2>
          <p
            className="mt-4 text-gray-500 max-w-xl text-base leading-relaxed"
            style={{ fontFamily: 'var(--font-sans), sans-serif' }}
          >
            Estrategias integrales y basadas en evidencia para atender las
            principales necesidades de salud pública del territorio colombiano.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {programas.map((p) => (
            <Link key={p.slug} href={`/programas/${p.slug}`}>
              <div
                className="group h-full bg-white rounded-xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col"
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center mb-5 transition-colors"
                  style={{ backgroundColor: `${p.color}14`, color: p.color }}
                >
                  {iconMap[p.icon] ?? null}
                </div>
                <h3
                  className="font-semibold text-base mb-3 leading-snug"
                  style={{ color: '#1C2833', fontFamily: 'var(--font-sans), sans-serif' }}
                >
                  {p.title}
                </h3>
                <p
                  className="text-gray-500 text-sm leading-relaxed flex-1"
                  style={{ fontFamily: 'var(--font-sans), sans-serif' }}
                >
                  {p.description}
                </p>
                <div
                  className="flex items-center gap-1.5 mt-5 text-xs font-semibold tracking-wide uppercase transition-colors"
                  style={{ color: p.color, fontFamily: 'var(--font-sans), sans-serif' }}
                >
                  Ver más <ArrowRight size={13} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
