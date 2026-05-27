'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/quienes-somos', label: 'Quiénes Somos' },
  { href: '/programas', label: 'Programas' },
  { href: '/contacto', label: 'Contacto' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-base"
            style={{ backgroundColor: '#1A5276' }}
          >
            +
          </div>
          <span className="font-bold text-lg" style={{ color: '#1A5276' }}>
            Servicios y Salud
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-600 hover:text-[#1A5276] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/dashboard">
            <Button
              size="sm"
              className="text-white hover:opacity-90"
              style={{ backgroundColor: '#1A5276' }}
            >
              Dashboard
            </Button>
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-700"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/dashboard" onClick={() => setOpen(false)}>
            <Button
              size="sm"
              className="w-full text-white"
              style={{ backgroundColor: '#1A5276' }}
            >
              Dashboard
            </Button>
          </Link>
        </div>
      )}
    </header>
  )
}
