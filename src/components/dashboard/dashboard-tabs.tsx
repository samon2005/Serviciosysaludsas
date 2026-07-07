'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function DashboardTabs() {
  const pathname = usePathname()

  const isLinea = pathname.startsWith('/dashboard/linea')
  const isMunicipal = !isLinea

  const base =
    'px-4 py-2 text-sm font-medium transition-colors duration-200 border-b-2'
  const active = 'border-brand text-brand'
  const inactive = 'border-transparent text-slate-500 hover:text-brand hover:border-brand/40'

  return (
    <nav className="flex border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1">
        <Link
          href="/dashboard"
          className={`${base} ${isMunicipal ? active : inactive}`}
        >
          Indicadores Municipales
        </Link>
        <Link
          href="/dashboard/linea"
          className={`${base} ${isLinea ? active : inactive}`}
        >
          Línea 24/7
        </Link>
      </div>
    </nav>
  )
}
