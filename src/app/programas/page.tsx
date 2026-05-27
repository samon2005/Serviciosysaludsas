import Link from 'next/link'
import { programas } from '@/lib/programas-data'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Programas — Servicios y Salud S.A.S.',
}

export default function ProgramasPage() {
  return (
    <div>
      <section
        style={{ background: 'linear-gradient(135deg, #1A5276 0%, #2980B9 100%)' }}
        className="py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-white/20 text-white border-0">
            Líneas de Intervención
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nuestros Programas
          </h1>
          <p className="text-blue-100 text-xl max-w-2xl">
            Soluciones integrales y basadas en evidencia para la salud mental y
            el bienestar comunitario.
          </p>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: '#F4F6F9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programas.map((p) => (
              <Card key={p.slug} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
                      style={{ backgroundColor: `${p.color}18` }}
                    >
                      {p.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold" style={{ color: '#1C2833' }}>
                        {p.title}
                      </h2>
                      <p className="text-gray-500 text-sm mt-1">{p.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                      Objetivos
                    </p>
                    <ul className="space-y-1">
                      {p.objetivos.slice(0, 3).map((o) => (
                        <li key={o} className="flex items-start gap-2 text-sm text-gray-600">
                          <span style={{ color: p.color }} className="mt-0.5 shrink-0">
                            •
                          </span>
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href={`/programas/${p.slug}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      style={{ borderColor: p.color, color: p.color }}
                    >
                      Ver programa completo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
