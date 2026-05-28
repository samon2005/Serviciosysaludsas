import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#13394F' }} className="text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div>
            <div className="mb-5 inline-block bg-white rounded-lg" style={{ height: '64px', width: '175px', overflow: 'hidden', flexShrink: 0 }}>
              <Image
                src="/590417596_17846916483605348_3563196473665147198_n.jpeg"
                alt="Servicios y Salud S.A.S."
                width={175}
                height={175}
                style={{
                  height: '175px',
                  width: 'auto',
                  marginTop: '-52px',
                  marginLeft: '-14px',
                }}
              />
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-sans), sans-serif' }}
            >
              Desarrollo de estrategias y proyectos en servicios de educación,
              intervención psicosocial y salud pública.
            </p>
          </div>

          <div>
            <h3
              className="text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans), sans-serif' }}
            >
              Programas
            </h3>
            <ul className="space-y-2.5" style={{ fontFamily: 'var(--font-sans), sans-serif' }}>
              {[
                { href: '/programas/salud-mental', label: 'Salud Mental' },
                { href: '/programas/prevencion-suicida', label: 'Prevención Suicida' },
                { href: '/programas/spa', label: 'Mitigación SPA' },
                { href: '/programas/social-comunitario', label: 'Social y Comunitario' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors footer-link"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className="text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans), sans-serif' }}
            >
              Contacto
            </h3>
            <ul className="space-y-2.5 text-sm footer-contact" style={{ fontFamily: 'var(--font-sans), sans-serif' }}>
              <li>Colombia — Cobertura Nacional</li>
              <li>
                <a
                  href="https://www.instagram.com/serviciosysaludsas/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link transition-colors"
                >
                  @serviciosysaludsas
                </a>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="footer-link transition-colors"
                >
                  Formulario de Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="pt-7 text-xs text-center"
          style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-sans), sans-serif' }}
        >
          &copy; {new Date().getFullYear()} Servicios y Salud S.A.S. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
