'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/quienes-somos', label: 'Quiénes Somos' },
  { href: '/programas', label: 'Programas' },
  { href: '/contacto', label: 'Contacto' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100" style={{ boxShadow: '0 1px 3px rgba(26,82,118,0.06)' }}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center">
          {/*
            Crop del padding blanco: la imagen tiene ~22% espacio blanco arriba y abajo.
            Mostramos la imagen más grande que el contenedor y usamos marginTop para saltar
            ese espacio superior. El contenedor con overflow:hidden recorta el resto.
            imageH = tamaño de display · marginTop = imageH × 0.22 (padding superior)
            containerH = imageH × 0.56 (solo el contenido del logo ~56% del alto)
          */}
          <div style={{ height: '64px', width: '175px', overflow: 'hidden', flexShrink: 0 }}>
            <Image
              src="/590417596_17846916483605348_3563196473665147198_n.jpeg"
              alt="Servicios y Salud S.A.S."
              width={175}
              height={175}
              priority
              style={{
                height: '175px',
                width: 'auto',
                marginTop: '-52px',  /* ajustado: más negativo = sube la imagen, menos espacio arriba */
                marginLeft: '-14px', /* 175 × 0.08 ≈ 14px de padding lateral */
              }}
            />
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium tracking-wide transition-colors"
              style={{ color: '#4A6074', fontFamily: 'var(--font-sans), sans-serif' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#1A5276')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#4A6074')}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-5 flex flex-col gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-600 hover:text-[#1A5276] transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
