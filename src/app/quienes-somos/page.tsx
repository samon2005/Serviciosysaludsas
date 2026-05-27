import { Badge } from '@/components/ui/badge'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quiénes Somos — Servicios y Salud S.A.S.',
}

const valores = [
  {
    title: 'Integridad',
    desc: 'Actuamos con transparencia y responsabilidad en cada intervención.',
  },
  {
    title: 'Impacto',
    desc: 'Medimos nuestros resultados y aprendemos continuamente de la práctica.',
  },
  {
    title: 'Innovación',
    desc: 'Adaptamos estrategias basadas en la mejor evidencia disponible.',
  },
  {
    title: 'Compromiso Social',
    desc: 'Ponemos el bienestar de las comunidades en el centro de nuestra labor.',
  },
]

export default function QuienesSomosPage() {
  return (
    <div>
      <section
        style={{ background: 'linear-gradient(135deg, #1A5276 0%, #2980B9 100%)' }}
        className="py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-white/20 text-white border-0">
            Nuestra Organización
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Quiénes Somos
          </h1>
          <p className="text-blue-100 text-xl max-w-2xl">
            Una organización colombiana dedicada al desarrollo de estrategias en
            salud pública, intervención psicosocial y bienestar comunitario.
          </p>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: '#F4F6F9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div
              className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-2xl"
              style={{ backgroundColor: '#E8F4FD' }}
            >
              🎯
            </div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1A5276' }}>
              Misión
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Desarrollar e implementar estrategias y proyectos de intervención en
              salud mental, prevención de conducta suicida, mitigación del consumo
              de sustancias psicoactivas y desarrollo social comunitario,
              contribuyendo al bienestar integral de las comunidades colombianas.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div
              className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-2xl"
              style={{ backgroundColor: '#E8F4FD' }}
            >
              🔭
            </div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1A5276' }}>
              Visión
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Ser reconocidos a nivel nacional como la organización líder en
              intervención psicosocial y salud pública, articulando actores
              públicos, privados y comunitarios para generar impacto sostenible en
              la calidad de vida de los colombianos.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Badge className="mb-4 text-white" style={{ backgroundColor: '#1A5276' }}>
              Nuestra Historia
            </Badge>
            <h2 className="text-3xl font-bold mb-6" style={{ color: '#1C2833' }}>
              Construyendo bienestar desde la experiencia
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
              <p>
                Servicios y Salud S.A.S. nació de la convicción de que la salud
                mental y el bienestar social son derechos fundamentales de toda
                comunidad. Desde nuestra fundación, hemos trabajado incansablemente
                para diseñar e implementar programas que respondan a las necesidades
                reales del territorio colombiano.
              </p>
              <p>
                Contamos con un equipo interdisciplinario de psicólogos, trabajadores
                sociales, educadores y expertos en salud pública, comprometidos con
                la excelencia técnica y el impacto social medible.
              </p>
              <p>
                Nuestra cobertura alcanza los 32 departamentos del país, articulando
                con secretarías de salud, instituciones educativas, empresas y
                organizaciones comunitarias para construir territorios más saludables
                y resilientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: '#F4F6F9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 text-white" style={{ backgroundColor: '#1A5276' }}>
              Lo que nos mueve
            </Badge>
            <h2 className="text-3xl font-bold" style={{ color: '#1C2833' }}>
              Nuestros Valores
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map((v) => (
              <div key={v.title} className="bg-white rounded-xl p-6 shadow-sm text-center">
                <h3 className="font-bold text-lg mb-2" style={{ color: '#1A5276' }}>
                  {v.title}
                </h3>
                <p className="text-gray-500 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
