import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, HeartPulse } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F8FA] px-6 text-center">
      <div className="mb-6 w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#EBF2FA' }}>
        <HeartPulse size={28} style={{ color: '#1A5276' }} strokeWidth={1.5} />
      </div>

      <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#2980B9' }}>
        Error 404
      </p>

      <h1 className="text-4xl font-bold mb-3" style={{ color: '#1C2833' }}>
        Página no encontrada
      </h1>

      <p className="text-gray-500 text-base max-w-sm mb-8 leading-relaxed">
        La página que busca no existe o fue movida. Verifique la dirección o regrese al inicio.
      </p>

      <Link href="/">
        <Button className="gap-2 text-white" style={{ backgroundColor: '#1A5276' }}>
          <ArrowLeft size={16} />
          Volver al inicio
        </Button>
      </Link>
    </div>
  )
}
