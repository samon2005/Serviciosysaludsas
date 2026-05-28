import { Hero } from '@/components/hero'
import { ProgramsOverview } from '@/components/programs-overview'
import Link from 'next/link'
import { CheckCircle2, FileSearch, Network, BarChart3 } from 'lucide-react'

const diferenciadores = [
  {
    icon: FileSearch,
    title: 'Basado en evidencia',
    desc: 'Cada programa está fundamentado en investigación científica y protocolos validados internacionalmente para garantizar resultados medibles.',
  },
  {
    icon: Network,
    title: 'Articulación institucional',
    desc: 'Trabajamos directamente con secretarías de salud, alcaldías, gobernaciones, ESE y entidades del sector privado y social.',
  },
  {
    icon: BarChart3,
    title: 'Indicadores de impacto',
    desc: 'Medimos y reportamos resultados con trazabilidad completa, desde la intervención individual hasta el análisis por departamento.',
  },
]

const entidades = [
  'Secretarías de Salud',
  'Hospitales y ESE',
  'Instituciones Educativas',
  'Alcaldías y Gobernaciones',
  'Empresas y Organizaciones',
  'ONG y Fundaciones',
]

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* ── Programas ── */}
      <ProgramsOverview />

      {/* ── Por qué nosotros ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Texto izquierda */}
            <div>
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color: '#2980B9', fontFamily: 'var(--font-sans), sans-serif' }}
              >
                Nuestro enfoque
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold mb-6 leading-tight"
                style={{ color: '#1C2833', fontFamily: 'var(--font-heading), Georgia, serif' }}
              >
                Intervención técnica<br />con compromiso territorial
              </h2>
              <p
                className="text-gray-500 leading-relaxed mb-8"
                style={{ fontFamily: 'var(--font-sans), sans-serif' }}
              >
                Combinamos rigor técnico, experiencia en campo y conocimiento
                del contexto colombiano para diseñar e implementar proyectos
                que generan impacto real en las comunidades.
              </p>

              {/* Con quiénes trabajamos */}
              <div>
                <p
                  className="text-xs font-semibold tracking-widest uppercase mb-4"
                  style={{ color: '#9CA3AF', fontFamily: 'var(--font-sans), sans-serif' }}
                >
                  Trabajamos con
                </p>
                <div className="flex flex-wrap gap-2">
                  {entidades.map((e) => (
                    <span
                      key={e}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{
                        backgroundColor: '#F4F6F9',
                        color: '#4A6074',
                        fontFamily: 'var(--font-sans), sans-serif',
                        border: '1px solid #E5EAF0',
                      }}
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tarjetas diferenciadores */}
            <div className="flex flex-col gap-4">
              {diferenciadores.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-5 p-6 rounded-xl"
                  style={{ border: '1px solid #E5EAF0', backgroundColor: '#FAFBFC' }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: '#E8F4FD', color: '#1A5276' }}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3
                      className="font-semibold mb-1.5"
                      style={{ color: '#1C2833', fontFamily: 'var(--font-sans), sans-serif' }}
                    >
                      {title}
                    </h3>
                    <p
                      className="text-sm text-gray-500 leading-relaxed"
                      style={{ fontFamily: 'var(--font-sans), sans-serif' }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="py-24" style={{ backgroundColor: '#0F2D3F' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color: '#5FA8D3', fontFamily: 'var(--font-sans), sans-serif' }}
              >
                Siguiente paso
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight"
                style={{ fontFamily: 'var(--font-heading), Georgia, serif' }}
              >
                ¿Su institución necesita una estrategia en salud mental?
              </h2>
              <p
                className="leading-relaxed mb-8"
                style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-sans), sans-serif' }}
              >
                Cuéntenos sobre su contexto y diseñamos una propuesta técnica
                a la medida, sin costo inicial.
              </p>
              <Link href="/contacto">
                <button
                  className="px-8 py-3.5 text-sm font-semibold rounded-lg transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#2980B9', color: '#fff', fontFamily: 'var(--font-sans), sans-serif' }}
                >
                  Solicitar propuesta
                </button>
              </Link>
            </div>

            {/* Lista de lo que incluye */}
            <div className="flex flex-col gap-3">
              {[
                'Diagnóstico de necesidades del territorio',
                'Diseño de ruta de intervención psicosocial',
                'Equipo interdisciplinario especializado',
                'Reportes e indicadores de impacto',
                'Articulación con actores institucionales',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={16} strokeWidth={2} style={{ color: '#5FA8D3', flexShrink: 0 }} />
                  <span
                    className="text-sm"
                    style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-sans), sans-serif' }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
