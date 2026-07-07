'use client'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { MapPin, AtSign } from 'lucide-react'

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
    <div className="bg-surface min-h-screen">
      {/* Header */}
      <section className="bg-brand py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] bg-white/10 text-white/80 mb-5">
            Comunícate con nosotros
          </span>
          <h1 className="font-extrabold tracking-tighter text-4xl md:text-5xl text-white mb-4 leading-tight">
            Contacto
          </h1>
          <p className="text-white/75 text-xl max-w-[65ch] leading-relaxed">
            Cuéntenos sobre su organización y necesidades. Diseñamos propuestas a
            la medida.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Form — white diffusion card */}
          <div>
            <h2 className="font-bold tracking-tight text-2xl text-ink mb-6">
              Envíenos un mensaje
            </h2>

            {status === 'sent' ? (
              <div className="bg-white rounded-[1.5rem] shadow-diffusion ring-1 ring-slate-900/5 p-8">
                <p className="text-emerald-700 font-medium text-sm">
                  Mensaje enviado. Nos comunicaremos pronto.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-[2rem] shadow-diffusion-lg ring-1 ring-slate-900/5 p-8 md:p-10 space-y-6"
              >
                {/* Nombre */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nombre" className="text-sm font-semibold text-slate-700">
                    Nombre completo <span className="text-emergency">*</span>
                  </Label>
                  <input
                    id="nombre"
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                    required
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-action focus:border-transparent transition-shadow"
                    placeholder="Su nombre"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                    Correo electrónico <span className="text-emergency">*</span>
                  </Label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-action focus:border-transparent transition-shadow"
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                {/* Organización */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="organizacion" className="text-sm font-semibold text-slate-700">
                    Organización / Institución
                  </Label>
                  <input
                    id="organizacion"
                    type="text"
                    value={form.organizacion}
                    onChange={(e) => setForm((f) => ({ ...f, organizacion: e.target.value }))}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-action focus:border-transparent transition-shadow"
                    placeholder="Nombre de su institución (opcional)"
                  />
                </div>

                {/* Mensaje */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="mensaje" className="text-sm font-semibold text-slate-700">
                    Mensaje <span className="text-emergency">*</span>
                  </Label>
                  <textarea
                    id="mensaje"
                    rows={5}
                    value={form.mensaje}
                    onChange={(e) => setForm((f) => ({ ...f, mensaje: e.target.value }))}
                    required
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-action focus:border-transparent transition-shadow resize-none"
                    placeholder="Cuéntenos sobre su organización y sus necesidades..."
                  />
                </div>

                {status === 'error' && (
                  <p className="text-emergency text-sm">
                    Error al enviar. Intente nuevamente.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-brand-action text-white font-bold text-sm py-3.5 rounded-[1rem] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-transform"
                >
                  {status === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
                </button>
              </form>
            )}
          </div>

          {/* Info column */}
          <div className="space-y-5">
            {/* Línea 24/7 emergency chip */}
            <div className="bg-surface-dark rounded-[1.5rem] p-6 text-white">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">
                Línea de emergencia
              </p>
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center gap-2 bg-emergency text-white font-bold text-sm rounded-full px-4 py-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0" />
                  (604) 444 24 24
                </span>
              </div>
              <p className="text-white/50 text-xs leading-relaxed">
                Línea Amiga 24/7 — Atención en crisis. Disponible las 24 horas, los 7 días de la semana.
              </p>
            </div>

            {/* Contact info */}
            <div className="bg-white rounded-[1.5rem] shadow-diffusion ring-1 ring-slate-900/5 p-6">
              <h3 className="font-bold tracking-tight text-base text-ink mb-4">
                Información de contacto
              </h3>
              <div className="space-y-3 text-slate-600 text-sm">
                <p className="flex items-center gap-2.5">
                  <MapPin size={14} strokeWidth={1.5} className="text-brand-action shrink-0" />
                  Colombia — Cobertura Nacional
                </p>
                <p className="flex items-center gap-2.5">
                  <AtSign size={14} strokeWidth={1.5} className="text-brand-action shrink-0" />
                  <a
                    href="https://www.instagram.com/serviciosysaludsas/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-action hover:text-brand"
                  >
                    @serviciosysaludsas
                  </a>
                </p>
              </div>
            </div>

            {/* Trabajamos con */}
            <div className="bg-white rounded-[1.5rem] shadow-diffusion ring-1 ring-slate-900/5 p-6">
              <h3 className="font-bold tracking-tight text-base text-ink mb-4">
                Trabajamos con
              </h3>
              <ul className="divide-y divide-slate-50 text-sm text-slate-600">
                {[
                  'Secretarías de Salud y Educación',
                  'Hospitales y ESE',
                  'Instituciones Educativas',
                  'Empresas y Organizaciones',
                  'Alcaldías y Gobernaciones',
                  'ONG y Fundaciones',
                ].map((i) => (
                  <li key={i} className="flex items-center gap-2.5 py-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-action shrink-0" />
                    {i}
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
