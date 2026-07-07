'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Phone } from 'lucide-react'

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    // "Línea 24/7" vive bajo /programas/: solo un enlace puede estar activo.
    if (href === '/programas') {
      return (
        (pathname === '/programas' || pathname.startsWith('/programas/')) &&
        pathname !== '/programas/linea-24-7'
      )
    }
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <header className="sticky top-0 z-50 pointer-events-none">
      {/* Top crisis band — full width, pointer-events restored */}
      <div className="bg-surface-dark text-white pointer-events-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop */}
          <div className="hidden sm:flex items-center justify-between h-10 text-sm font-sans">
            <span className="text-white/90 font-medium">
              Línea Amiga 24/7 — Atención inmediata en crisis
            </span>
            <a
              href="tel:6044442424"
              className="flex items-center gap-2 text-white font-bold tracking-wide hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-surface-dark rounded"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emergency">
                <Phone size={11} strokeWidth={2} aria-hidden="true" className="text-white" />
              </span>
              (604) 444 24 24
            </a>
          </div>
          {/* Mobile */}
          <div className="sm:hidden flex items-center justify-center gap-2 h-10 text-sm font-sans">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emergency">
              <Phone size={11} strokeWidth={2} className="text-white" aria-hidden="true" />
            </span>
            <a
              href="tel:6044442424"
              className="text-white font-bold tracking-wide hover:text-white/80 transition-colors"
            >
              (604) 444 24 24
            </a>
            <span className="text-white/70">· Línea 24/7</span>
          </div>
        </div>
      </div>

      {/* Floating nav island */}
      <div className="pointer-events-auto px-4 sm:px-6 pt-2">
        <nav
          className="max-w-6xl mx-auto bg-white/85 backdrop-blur-xl ring-1 ring-slate-900/[0.06] shadow-diffusion rounded-full px-3 py-2 flex items-center justify-between"
          aria-label="Navegación principal"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-full flex-shrink-0"
            aria-label="Servicios y Salud S.A.S — inicio"
          >
            <Image
              src="/logo.svg"
              alt="Servicios y Salud S.A.S."
              width={140}
              height={34}
              priority
              className="h-9 w-auto pl-2"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              const isLinea = link.href === '/programas/linea-24-7'
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                    isLinea
                      ? active
                        ? 'text-emergency font-semibold bg-red-50'
                        : 'text-emergency/75 hover:text-emergency hover:bg-red-50/60'
                      : active
                        ? 'text-brand font-semibold bg-brand/[0.08]'
                        : 'text-slate-600 hover:text-brand hover:bg-slate-50',
                  ].join(' ')}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                  {active && !isLinea && (
                    <span
                      className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand"
                      aria-hidden="true"
                    />
                  )}
                  {active && isLinea && (
                    <span
                      className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emergency"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="hidden md:inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-brand rounded-full hover:bg-brand-action transition-all duration-300 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              Dashboard
            </Link>

            {/* Hamburger — morphs to X */}
            <button
              className="md:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-full text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
            >
              <span
                className={[
                  'block w-5 h-[1.5px] bg-current rounded-full origin-center transition-transform duration-300',
                  open ? 'translate-y-[6.5px] rotate-45' : '',
                ].join(' ')}
              />
              <span
                className={[
                  'block w-5 h-[1.5px] bg-current rounded-full transition-opacity duration-300',
                  open ? 'opacity-0' : '',
                ].join(' ')}
              />
              <span
                className={[
                  'block w-5 h-[1.5px] bg-current rounded-full origin-center transition-transform duration-300',
                  open ? '-translate-y-[6.5px] -rotate-45' : '',
                ].join(' ')}
              />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile overlay */}
      <div
        className={[
          'md:hidden fixed inset-0 z-40 bg-white/92 backdrop-blur-2xl pointer-events-auto flex flex-col transition-all duration-300',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        aria-hidden={!open}
      >
        {/* Spacer for the band + island */}
        <div className="h-[5.5rem] flex-shrink-0" />

        <nav className="flex-1 px-6 pt-6 pb-10 flex flex-col gap-1" aria-label="Navegación móvil">
          {navLinks.map((link, i) => {
            const active = isActive(link.href)
            const isLinea = link.href === '/programas/linea-24-7'
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{
                  transitionDelay: open ? `${i * 50}ms` : '0ms',
                  transform: open ? 'translateY(0)' : 'translateY(16px)',
                  opacity: open ? 1 : 0,
                  transition: 'transform 400ms cubic-bezier(0.16,1,0.3,1), opacity 400ms cubic-bezier(0.16,1,0.3,1)',
                }}
                className={[
                  'px-4 py-3.5 text-base font-medium rounded-2xl transition-colors',
                  isLinea
                    ? active
                      ? 'text-emergency bg-red-50 font-semibold'
                      : 'text-emergency/80 hover:text-emergency hover:bg-red-50/60'
                    : active
                      ? 'text-brand bg-brand/[0.07] font-semibold'
                      : 'text-slate-700 hover:text-brand hover:bg-slate-50',
                ].join(' ')}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            )
          })}

          <div
            style={{
              transitionDelay: open ? `${navLinks.length * 50}ms` : '0ms',
              transform: open ? 'translateY(0)' : 'translateY(16px)',
              opacity: open ? 1 : 0,
              transition: 'transform 400ms cubic-bezier(0.16,1,0.3,1), opacity 400ms cubic-bezier(0.16,1,0.3,1)',
            }}
            className="mt-4"
          >
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center px-4 py-3.5 text-sm font-semibold text-white bg-brand rounded-full hover:bg-brand-action transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </nav>

        {/* Crisis line at bottom of overlay */}
        <div className="px-6 pb-10 border-t border-slate-100 pt-6">
          <a
            href="tel:6044442424"
            className="flex items-center gap-2.5 text-emergency font-semibold"
          >
            <Phone size={16} strokeWidth={1.5} aria-hidden="true" />
            (604) 444 24 24 · Línea 24/7
          </a>
        </div>
      </div>
    </header>
  )
}
