import { programas } from '@/lib/programas-data'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const programa = programas.find((p) => p.slug === slug)
  return {
    title: programa
      ? `${programa.title} — Servicios y Salud`
      : 'Programa no encontrado',
  }
}

export function generateStaticParams() {
  return programas.map((p) => ({ slug: p.slug }))
}

export default async function ProgramaDetailPage({ params }: Props) {
  const { slug } = await params
  const programa = programas.find((p) => p.slug === slug)
  if (!programa) notFound()

  return (
    <div>
      <section
        style={{
          background: `linear-gradient(135deg, ${programa.color} 0%, ${programa.color}CC 100%)`,
        }}
        className="py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/programas"
            className="text-white/70 hover:text-white text-sm mb-4 inline-block transition-colors"
          >
            ← Todos los programas
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
              {programa.icon}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {programa.title}
            </h1>
          </div>
          <p className="text-white/80 text-xl max-w-2xl">{programa.description}</p>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: '#F4F6F9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1C2833' }}>
                Descripción del Programa
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {programa.longDescription}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1C2833' }}>
                Objetivos
              </h2>
              <ul className="space-y-3">
                {programa.objetivos.map((o) => (
                  <li key={o} className="flex items-start gap-3">
                    <span
                      className="mt-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs shrink-0"
                      style={{ backgroundColor: programa.color }}
                    >
                      ✓
                    </span>
                    <span className="text-gray-600">{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1C2833' }}>
                Población Objetivo
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {programa.poblacion}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1C2833' }}>
                ¿Le interesa este programa?
              </h3>
              <Link href="/contacto">
                <Button
                  className="w-full text-white"
                  style={{ backgroundColor: programa.color }}
                >
                  Solicitar información
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
