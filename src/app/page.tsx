import { Hero } from '@/components/hero'
import { ProgramsOverview } from '@/components/programs-overview'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProgramsOverview />

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: '#1C2833' }}
          >
            ¿Trabajamos juntos?
          </h2>
          <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
            Contáctenos para diseñar una estrategia personalizada para su
            institución, comunidad o entidad territorial.
          </p>
          <Link href="/contacto">
            <Button
              size="lg"
              className="text-white hover:opacity-90"
              style={{ backgroundColor: '#1A5276' }}
            >
              Solicitar información
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
