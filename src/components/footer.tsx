import Link from 'next/link'

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#1A5276' }} className="text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="font-bold text-sm" style={{ color: '#1A5276' }}>
                  +
                </span>
              </div>
              <span className="font-bold text-lg">Servicios y Salud S.A.S.</span>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              Desarrollo de estrategias y proyectos en servicios de educación,
              intervención psicosocial y salud pública.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Programas</h3>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li>
                <Link
                  href="/programas/salud-mental"
                  className="hover:text-white transition-colors"
                >
                  Salud Mental
                </Link>
              </li>
              <li>
                <Link
                  href="/programas/prevencion-suicida"
                  className="hover:text-white transition-colors"
                >
                  Prevención Suicida
                </Link>
              </li>
              <li>
                <Link
                  href="/programas/spa"
                  className="hover:text-white transition-colors"
                >
                  Mitigación SPA
                </Link>
              </li>
              <li>
                <Link
                  href="/programas/social-comunitario"
                  className="hover:text-white transition-colors"
                >
                  Social y Comunitario
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li>Colombia — Cobertura Nacional</li>
              <li>
                <a
                  href="https://www.instagram.com/serviciosysaludsas/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  @serviciosysaludsas
                </a>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="hover:text-white transition-colors"
                >
                  Formulario de Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-400 mt-8 pt-8 text-center text-blue-100 text-sm">
          © {new Date().getFullYear()} Servicios y Salud S.A.S. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
