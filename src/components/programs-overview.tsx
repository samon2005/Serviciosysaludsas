import Link from 'next/link'
import { programas } from '@/lib/programas-data'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

export function ProgramsOverview() {
  return (
    <section className="py-20" style={{ backgroundColor: '#F4F6F9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 text-white" style={{ backgroundColor: '#1A5276' }}>
            Nuestros Programas
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#1C2833' }}>
            Líneas de Intervención
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
            Trabajamos con un enfoque integral y basado en evidencia para atender
            las principales necesidades de salud pública del país.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programas.map((p) => (
            <Link key={p.slug} href={`/programas/${p.slug}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                    style={{ backgroundColor: `${p.color}18` }}
                  >
                    {p.icon}
                  </div>
                  <h3 className="font-bold text-lg" style={{ color: '#1C2833' }}>
                    {p.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {p.description}
                  </p>
                  <div
                    className="flex items-center gap-1 mt-4 text-sm font-medium"
                    style={{ color: p.color }}
                  >
                    Ver más <ArrowRight size={14} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
