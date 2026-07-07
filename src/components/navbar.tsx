'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/quienes-somos', label: 'Quiénes somos' },
  { href: '/programas', label: 'Programas' },
  { href: '/programas/linea-24-7', label: 'Línea 24/7' },
  { href: '/contacto', label: 'Contacto' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Top emergency band */}
      <div className="bg-surface-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop band */}
          <div className="hidden sm:flex items-center justify-between h-9 text-xs font-sans">
            <span className="text-white/80">
              Línea Amiga 24/7 — Atención inmediata en crisis
            </span>
            <a
              href="tel:6044442424"
              className="flex items-center gap-1.5 text-emergency font-semibold hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-surface-dark rounded"
            >
              <Phone size={13} aria-hidden="true" />
              (604) 444 24 24
            </a>
          </div>
          {/* Mobile band: compact */}
          <div className="sm:hidden flex items-center justify-center gap-2 h-9 text-xs font-sans">
            <Phone size={12} className="text-emergency" aria-hidden="true" />
            <a
              href="tel:6044442424"
              className="text-emergency font-semibold hover:text-white transition-colors"
            >
              (604) 444 24 24
            </a>
            <span className="text-white/60">· Línea 24/7</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className="bg-white border-b border-slate-200"
        aria-label="Navegación principal"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
            aria-label="Servicios y Salud S.A.S — inicio"
          >
            <div className="h-16 w-44 overflow-hidden flex-shrink-0">
              <Image
                src="/590417596_17846916483605348_3563196473665147198_n.jpeg"
                alt="Servicios y Salud S.A.S."
                width={175}
                height={175}
                priority
                className="h-[175px] w-auto -mt-[52px] -ml-[14px]"
              />
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              const isLinea = link.href === '/programas/linea-24-7'
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'relative px-3 py-2 text-sm font-sans font-medium rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                    isLinea
                      ? active
                        ? 'text-emergency font-semibold'
                        : 'text-emergency/80 hover:text-emergency'
                      : active
                        ? 'text-brand font-semibold'
                        : 'text-slate-600 hover:text-brand',
                  ].join(' ')}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                  {active && (
                    <span
                      className={[
                        'absolute bottom-0 left-3 right-3 h-0.5 rounded-full',
                        isLinea ? 'bg-emergency' : 'bg-brand',
                      ].join(' ')}
                      aria-hidden="true"
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right side: Dashboard link + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden md:inline-flex items-center px-3.5 py-1.5 text-xs font-sans font-medium text-slate-500 border border-slate-300 rounded hover:border-brand hover:text-brand transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Dashboard
            </Link>

            <button
              className="md:hidden p-2 rounded text-slate-500 hover:text-brand hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              const isLinea = link.href === '/programas/linea-24-7'
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={[
                    'px-3 py-2.5 text-sm font-sans font-medium rounded transition-colors',
                    isLinea
                      ? active
                        ? 'text-emergency bg-red-50 font-semibold'
                        : 'text-emergency/80 hover:text-emergency hover:bg-red-50'
                      : active
                        ? 'text-brand bg-blue-50 font-semibold'
                        : 'text-slate-600 hover:text-brand hover:bg-slate-50',
                  ].join(' ')}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="mt-2 px-3 py-2.5 text-sm font-sans font-medium text-slate-500 border border-slate-200 rounded hover:border-brand hover:text-brand transition-colors text-center"
            >
              Dashboard
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
