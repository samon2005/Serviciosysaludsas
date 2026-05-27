import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1A5276 0%, #2980B9 100%)' }}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <span className="text-white text-sm font-medium">
              Cobertura Nacional · Colombia
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Transformando vidas a través de la{' '}
            <span className="text-blue-200">salud mental</span> y el{' '}
            <span className="text-blue-200">bienestar social</span>
          </h1>

          <p className="text-blue-100 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
            Desarrollamos estrategias integrales en educación, intervención
            psicosocial y salud pública para comunidades, instituciones y
            entidades territoriales de Colombia.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/programas">
              <Button
                size="lg"
                className="bg-white font-semibold w-full sm:w-auto hover:bg-blue-50"
                style={{ color: '#1A5276' }}
              >
                Conocer Programas
              </Button>
            </Link>
            <Link href="/contacto">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
              >
                Contáctanos
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/20 pt-8">
            {[
              { value: '4', label: 'Líneas de Intervención' },
              { value: '32', label: 'Departamentos' },
              { value: '100%', label: 'Basado en Evidencia' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-blue-200 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
