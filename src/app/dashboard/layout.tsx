import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TEMPORAL: dashboard público mientras el cliente lo revisa.
  // Para reactivar la protección, restaurar el chequeo de sesión con
  // createClient() + supabase.auth.getUser() y redirect('/login').

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="font-semibold text-sm text-brand hover:text-brand-action transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-slate-200">|</span>
            <Link
              href="/dashboard/linea/upload"
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Cargar Excel
            </Link>
          </div>
          <form action="/api/auth/logout" method="POST">
            <Button type="submit" variant="ghost" size="sm" className="text-slate-500">
              Cerrar sesión
            </Button>
          </form>
        </div>
      </div>

      <DashboardTabs />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </div>
  )
}
