import Link from 'next/link'
import Image from 'next/image'
import { Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-surface-dark text-white mt-auto font-sans rounded-t-[2.5rem] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-10">

        {/* Main grid — 3 zones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/[0.08]">

          {/* Zone 1 — Identity */}
          <div className="md:col-span-1">
            <div className="mb-6 inline-flex items-center">
              <Image
                src="/logo-blanco.svg"
                alt="Servicios y Salud S.A.S."
                width={545}
                height={140}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-sm leading-relaxed text-white/55 mb-4 max-w-xs">
              Empresa de salud pública territorial especializada en prevención
              del suicidio, intervención psicosocial e inteligencia territorial.
            </p>
            <p className="text-xs text-white/30 tracking-wide">NIT 901.XXX.XXX-X</p>
          </div>

          {/* Zone 2 — Línea 24/7 + Contact */}
          <div className="md:col-span-1">
            <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-white/35 mb-5">
              Línea de Atención 24/7
            </p>
            <div className="mb-7">
              <a
                href="tel:6044442424"
                className="inline-flex items-center gap-2.5 text-emergency font-semibold text-xl hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
              >
                <Phone size={18} strokeWidth={1.5} aria-hidden="true" />
                (604) 444 24 24
              </a>
              <p className="text-xs text-white/40 mt-2 leading-relaxed">
                Atención inmediata en crisis · todos los días · 24 horas
              </p>
            </div>

            <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-white/35 mb-4">
              Contacto
            </p>
            <ul className="space-y-2.5 text-sm text-white/55">
              <li>Colombia — cobertura nacional</li>
              <li>
                <a
                  href="https://www.instagram.com/serviciosysaludsas/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                >
                  @serviciosysaludsas
                </a>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                >
                  Formulario de contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Zone 3 — Legal */}
          <div className="md:col-span-1">
            <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-white/35 mb-5">
              Legal
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/privacidad"
                  className="text-white/55 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                >
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/tratamiento-de-datos"
                  className="text-white/55 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                >
                  Tratamiento de datos personales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/25">
          <p>
            &copy; {new Date().getFullYear()} Servicios y Salud S.A.S. Todos los derechos reservados.
          </p>
          <p className="text-right leading-relaxed">
            PDSP 2022-2031 · Ley 1616 de 2013 · Política Nacional de Salud Mental 2018
          </p>
        </div>

      </div>
    </footer>
  )
}
