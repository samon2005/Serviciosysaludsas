'use client'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ContactoPage() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    organizacion: '',
    mensaje: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div>
      <section
        style={{ background: 'linear-gradient(135deg, #1A5276 0%, #2980B9 100%)' }}
        className="py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-white/20 text-white border-0">
            Comunícate con nosotros
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contacto</h1>
          <p className="text-blue-100 text-xl max-w-2xl">
            Cuéntenos sobre su organización y necesidades. Diseñamos propuestas a
            la medida.
          </p>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: '#F4F6F9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1C2833' }}>
              Envíenos un mensaje
            </h2>

            {status === 'sent' ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <p className="text-green-700 font-medium">
                  ✓ Mensaje enviado. Nos comunicaremos pronto.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-2xl p-8 shadow-sm">
                <div>
                  <Label htmlFor="nombre">Nombre completo *</Label>
                  <Input
                    id="nombre"
                    value={form.nombre}
                    onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Correo electrónico *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="organizacion">Organización / Institución</Label>
                  <Input
                    id="organizacion"
                    value={form.organizacion}
                    onChange={(e) => setForm((f) => ({ ...f, organizacion: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="mensaje">Mensaje *</Label>
                  <textarea
                    id="mensaje"
                    rows={5}
                    value={form.mensaje}
                    onChange={(e) => setForm((f) => ({ ...f, mensaje: e.target.value }))}
                    required
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                </div>
                {status === 'error' && (
                  <p className="text-red-500 text-sm">
                    Error al enviar. Intente nuevamente.
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full text-white"
                  style={{ backgroundColor: '#1A5276' }}
                >
                  {status === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
                </Button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1C2833' }}>
                Información de contacto
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>📍 Colombia — Cobertura Nacional</p>
                <p>
                  📱{' '}
                  <a
                    href="https://www.instagram.com/serviciosysaludsas/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: '#2980B9' }}
                  >
                    @serviciosysaludsas
                  </a>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1C2833' }}>
                Trabajamos con
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  'Secretarías de Salud y Educación',
                  'Hospitales y ESE',
                  'Instituciones Educativas',
                  'Empresas y Organizaciones',
                  'Alcaldías y Gobernaciones',
                  'ONG y Fundaciones',
                ].map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span style={{ color: '#2980B9' }}>•</span> {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
