import Link from 'next/link'
import { Brain, Heart, Shield, Users } from 'lucide-react'

const programs = [
  { label: 'Salud Mental', icon: Brain, color: '#2980B9' },
  { label: 'Prevención Suicida', icon: Heart, color: '#1A5276' },
  { label: 'Mitigación SPA', icon: Shield, color: '#27AE60' },
  { label: 'Estrategias Comunitarias', icon: Users, color: '#8E44AD' },
]

export function Hero() {
  return (
    <section
      className="relative overflow-hidden flex flex-col lg:h-screen"
      style={{ background: '#0F2D3F' }}
    >
      {/* fondo split solo en desktop — cubre exactamente la altura del contenido */}
      <div
        className="absolute inset-0 pointer-events-none hidden lg:block"
        style={{ background: 'linear-gradient(to right, #0F2D3F 58%, #ffffff 58%)' }}
      />

      {/* grid sutil solo en el lado oscuro */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
        backgroundSize: '72px 72px',
        width: '58%',
      }} />

      {/* contenido principal */}
      <div className="relative flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row py-16 lg:py-0">

        {/* ── IZQUIERDA — texto ── */}
        <div className="flex flex-col justify-center lg:w-[58%] lg:pr-20 lg:py-24">

          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <div className="h-px w-8" style={{ backgroundColor: '#2980B9' }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#5FA8D3', fontFamily: 'var(--font-sans), sans-serif' }}>
              Salud Pública · Colombia
            </span>
          </div>

          <h1
            className="text-white leading-none mb-6 lg:mb-8"
            style={{
              fontFamily: 'var(--font-heading), Georgia, serif',
              fontSize: 'clamp(2.6rem, 8vw, 4.8rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: '1.05',
            }}
          >
            Intervención<br />
            psicosocial<br />
            <span style={{ color: '#5FA8D3' }}>con impacto</span><br />
            <span style={{ color: '#5FA8D3' }}>territorial.</span>
          </h1>

          <p className="text-sm lg:text-base leading-relaxed mb-8 max-w-md" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-sans), sans-serif' }}>
            Estrategias en salud mental, prevención del suicidio, mitigación de
            SPA y desarrollo comunitario para los 32 departamentos del país.
          </p>

          {/* Pills de programas — solo mobile */}
          <div className="flex flex-wrap gap-2 mb-8 lg:hidden">
            {programs.map(({ label, icon: Icon, color }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${color}25`,
                  color: 'rgba(255,255,255,0.85)',
                  border: `1px solid ${color}55`,
                }}
              >
                <Icon size={12} strokeWidth={1.5} style={{ color }} />
                {label}
              </span>
            ))}
          </div>

          {/* Stat — solo mobile */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <span className="text-3xl font-bold" style={{ color: '#5FA8D3', fontFamily: 'var(--font-heading), Georgia, serif' }}>32</span>
            <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>departamentos<br />de cobertura</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/programas">
              <button
                className="w-full sm:w-auto px-7 py-3 text-sm font-semibold rounded-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#2980B9', color: '#fff', fontFamily: 'var(--font-sans), sans-serif' }}
              >
                Ver programas
              </button>
            </Link>
            <Link
              href="/contacto"
              className="hero-btn-outline w-full sm:w-auto text-center px-7 py-3 text-sm font-semibold rounded-lg transition-colors"
              style={{ fontFamily: 'var(--font-sans), sans-serif' }}
            >
              Contáctenos
            </Link>
          </div>
        </div>

        {/* ── DERECHA — panel blanco (solo desktop) ── */}
        <div className="hidden lg:flex lg:w-[42%] flex-col justify-center pl-20 pr-6 py-24">

          {/* Número grande decorativo */}
          <div className="mb-8 relative">
            <span
              className="font-bold leading-none select-none"
              style={{
                fontSize: '8rem',
                color: '#EEF2F7',
                fontFamily: 'var(--font-heading), Georgia, serif',
                lineHeight: 1,
                fontWeight: 800,
              }}
            >
              32
            </span>
            <p
              className="text-xs font-semibold tracking-widest uppercase"
              style={{
                color: '#2980B9',
                fontFamily: 'var(--font-sans), sans-serif',
                marginTop: '-1.2rem',
              }}
            >
              Departamentos de cobertura
            </p>
          </div>

          {/* Tarjetas de programas */}
          <div className="grid grid-cols-2 gap-3">
            {programs.map(({ label, icon: Icon, color }) => (
              <div
                key={label}
                className="rounded-xl p-4 flex flex-col gap-3"
                style={{ backgroundColor: '#F8FAFC', border: '1px solid #E5EAF0' }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${color}14`, color }}
                >
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <p
                  className="text-xs font-medium leading-snug"
                  style={{ color: '#374151', fontFamily: 'var(--font-sans), sans-serif' }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* pie */}
          <div className="mt-5 pt-5" style={{ borderTop: '1px solid #E5EAF0' }}>
            <p className="text-xs" style={{ color: '#9CA3AF', fontFamily: 'var(--font-sans), sans-serif' }}>
              Estrategias 100% basadas en evidencia científica
            </p>
          </div>
        </div>
      </div>

      {/* ── ticker de información ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          backgroundColor: '#0A1F2E',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        {/* fade izquierdo */}
        <div className="absolute left-0 top-0 h-full w-16 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to right, #0A1F2E, transparent)' }} />
        {/* fade derecho */}
        <div className="absolute right-0 top-0 h-full w-16 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to left, #0A1F2E, transparent)' }} />

        <div className="marquee-track inline-flex items-center gap-0 py-3.5 whitespace-nowrap">
          {[
            { highlight: '4',    text: 'líneas de intervención especializadas' },
            { highlight: '32',   text: 'departamentos de cobertura nacional' },
            { highlight: '100%', text: 'de los programas basados en evidencia científica' },
            { highlight: '+10',  text: 'años de experiencia en salud pública colombiana' },
            { highlight: 'OPS',  text: 'protocolos alineados con la Organización Panamericana de la Salud' },
            { highlight: 'MSPS', text: 'articulación con lineamientos del Ministerio de Salud' },
            { highlight: '3',    text: 'niveles de intervención: individual, familiar y comunitario' },
            { highlight: 'RIA',  text: 'integración con Rutas Integrales de Atención en Salud' },
            { highlight: '24/7', text: 'acompañamiento en crisis mediante primeros auxilios psicológicos' },
          ].concat([
            { highlight: '4',    text: 'líneas de intervención especializadas' },
            { highlight: '32',   text: 'departamentos de cobertura nacional' },
            { highlight: '100%', text: 'de los programas basados en evidencia científica' },
            { highlight: '+10',  text: 'años de experiencia en salud pública colombiana' },
            { highlight: 'OPS',  text: 'protocolos alineados con la Organización Panamericana de la Salud' },
            { highlight: 'MSPS', text: 'articulación con lineamientos del Ministerio de Salud' },
            { highlight: '3',    text: 'niveles de intervención: individual, familiar y comunitario' },
            { highlight: 'RIA',  text: 'integración con Rutas Integrales de Atención en Salud' },
            { highlight: '24/7', text: 'acompañamiento en crisis mediante primeros auxilios psicológicos' },
          ]).map((item, i) => (
            <span key={i} className="inline-flex items-center" style={{ fontFamily: 'var(--font-sans), sans-serif' }}>
              <span className="px-10 inline-flex items-center gap-2.5 text-xs">
                <span className="font-bold text-sm" style={{ color: '#5FA8D3' }}>{item.highlight}</span>
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>{item.text}</span>
              </span>
              <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '1.1rem' }}>·</span>
            </span>
          ))}
        </div>
      </div>

    </section>
  )
}
