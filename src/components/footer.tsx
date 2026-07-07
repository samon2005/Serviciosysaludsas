import Link from 'next/link'
import Image from 'next/image'
import { Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-surface-dark text-white mt-auto font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">

        {/* Main content — 3 zones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/10">

          {/* Zone 1 — Identity */}
          <div className="md:col-span-1">
            <div className="mb-5 inline-block bg-white rounded-lg overflow-hidden h-16 w-44 flex-shrink-0">
              <Image
                src="/590417596_17846916483605348_3563196473665147198_n.jpeg"
                alt="Servicios y Salud S.A.S."
                width={175}
                height={175}
                className="h-[175px] w-auto -mt-[52px] -ml-[14px]"
              />
            </div>
            <p className="text-sm leading-relaxed text-white/55 mb-3">
              Empresa de salud pública territorial especializada en prevención
              del suicidio, intervención psicosocial e inteligencia territorial.
            </p>
            <p className="text-xs text-white/35">NIT 901.XXX.XXX-X</p>
          </div>

          {/* Zone 2 — Línea 24/7 + Contact */}
          <div className="md:col-span-1">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-white/35 mb-5">
              Línea Amiga 24/7
            </h2>
            <div className="mb-5">
              <a
                href="tel:6044442424"
                className="flex items-center gap-2 text-emergency font-semibold text-lg hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
              >
                <Phone size={18} aria-hidden="true" />
                (604) 444 24 24
              </a>
              <p className="text-xs text-white/45 mt-1">
                Atención inmediata en crisis · todos los días · 24 horas
              </p>
            </div>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-white/35 mb-3 mt-6">
              Contacto
            </h2>
            <ul className="space-y-2 text-sm text-white/55">
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
            <h2 className="text-xs font-semibold tracking-widest uppercase text-white/35 mb-5">
              Legal
            </h2>
            <ul className="space-y-2.5 text-sm">
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
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>
            &copy; {new Date().getFullYear()} Servicios y Salud S.A.S. Todos los derechos reservados.
          </p>
          <p className="text-center sm:text-right">
            PDSP 2022-2031 · Ley 1616 de 2013 · Política Nacional de Salud Mental 2018
          </p>
        </div>

      </div>
    </footer>
  )
}
