# Servicios y Salud — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full Servicios y Salud S.A.S. corporate website with dashboard protegido, carga de Excel via drag & drop, y documento de propuesta comercial en Word.

**Architecture:** Next.js 15 App Router con TypeScript para frontend y API routes. Supabase (PostgreSQL + Auth + Storage) en Docker Compose. Dashboard protegido con middleware que verifica sesión Supabase. Excel parseado en servidor con `xlsx` e insertado en tabla `eventos`.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Supabase JS, Recharts, xlsx, Docker Compose, docx (Word)

---

## File Map

```
/
├── docker-compose.yml
├── Dockerfile
├── .env.local.example
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── src/
│   ├── middleware.ts
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx                          (Home)
│   │   ├── quienes-somos/page.tsx
│   │   ├── programas/page.tsx
│   │   ├── programas/[slug]/page.tsx
│   │   ├── contacto/page.tsx
│   │   ├── login/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── upload/page.tsx
│   │   └── api/
│   │       ├── auth/login/route.ts
│   │       ├── auth/logout/route.ts
│   │       └── upload/route.ts
│   ├── components/
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── hero.tsx
│   │   ├── programs-overview.tsx
│   │   └── dashboard/
│   │       ├── kpi-cards.tsx
│   │       ├── departamento-chart.tsx
│   │       ├── temporal-chart.tsx
│   │       ├── distribucion-charts.tsx
│   │       ├── filters.tsx
│   │       └── excel-dropzone.tsx
│   └── lib/
│       ├── supabase/client.ts
│       ├── supabase/server.ts
│       ├── programas-data.ts
│       └── types.ts
├── supabase/
│   └── migrations/001_initial.sql
└── samples/
    └── datos-ejemplo.xlsx   (generado por script)
```

---

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `.env.local.example`, `.gitignore`

- [ ] **Step 1: Crear proyecto Next.js**

```bash
cd /Users/lelo/Documents/ETERNALGROWTH/Proyectos/PSICOLOGIA
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*" --eslint --no-git --yes
```

- [ ] **Step 2: Instalar dependencias**

```bash
npm install recharts xlsx @supabase/supabase-js @supabase/ssr
npm install docx file-saver
npm install -D @types/file-saver
```

- [ ] **Step 3: Inicializar shadcn/ui**

```bash
npx shadcn@latest init --defaults
npx shadcn@latest add button card input label badge separator sheet tabs table select
```

- [ ] **Step 4: Crear .env.local.example**

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

- [ ] **Step 5: git init y primer commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js 15 project"
```

---

### Task 2: Docker Compose + Supabase

**Files:**
- Create: `docker-compose.yml`
- Create: `Dockerfile`

- [ ] **Step 1: Crear Dockerfile**

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

- [ ] **Step 2: Crear docker-compose.yml**

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=http://kong:8000
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SERVICE_ROLE_KEY}
    depends_on:
      - db
    networks:
      - supabase_network

  db:
    image: supabase/postgres:15.1.0.147
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: postgres
    volumes:
      - db_data:/var/lib/postgresql/data
      - ./supabase/migrations:/docker-entrypoint-initdb.d
    networks:
      - supabase_network

  kong:
    image: kong:2.8.1
    ports:
      - "8000:8000"
      - "8443:8443"
    environment:
      KONG_DATABASE: "off"
      KONG_DECLARATIVE_CONFIG: /var/lib/kong/kong.yml
    networks:
      - supabase_network

  auth:
    image: supabase/gotrue:v2.143.0
    ports:
      - "9999:9999"
    environment:
      GOTRUE_API_HOST: 0.0.0.0
      GOTRUE_API_PORT: 9999
      GOTRUE_DB_DRIVER: postgres
      GOTRUE_DB_DATABASE_URL: postgres://supabase_auth_admin:${POSTGRES_PASSWORD:-postgres}@db:5432/postgres
      GOTRUE_SITE_URL: http://localhost:3000
      GOTRUE_JWT_SECRET: ${JWT_SECRET:-super-secret-jwt-token-with-at-least-32-characters}
      GOTRUE_DISABLE_SIGNUP: "false"
      API_EXTERNAL_URL: http://localhost:8000
    depends_on:
      - db
    networks:
      - supabase_network

volumes:
  db_data:

networks:
  supabase_network:
    driver: bridge
```

- [ ] **Step 3: Añadir next.config.ts con output standalone**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
}

export default nextConfig
```

- [ ] **Step 4: Commit**

```bash
git add docker-compose.yml Dockerfile next.config.ts
git commit -m "feat: add Docker Compose with Supabase"
```

---

### Task 3: Supabase Schema & Lib

**Files:**
- Create: `supabase/migrations/001_initial.sql`
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/types.ts`

- [ ] **Step 1: Crear migración SQL**

```sql
-- supabase/migrations/001_initial.sql

create table if not exists eventos (
  id uuid primary key default gen_random_uuid(),
  departamento text not null,
  municipio text,
  año integer not null,
  mes integer check (mes between 1 and 12),
  sexo text,
  grupo_etario text,
  metodo text,
  tipo_evento text,
  programa text,
  casos integer not null default 0,
  created_at timestamptz default now()
);

create index idx_eventos_departamento on eventos(departamento);
create index idx_eventos_año on eventos(año);
create index idx_eventos_programa on eventos(programa);

create table if not exists uploads (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  rows_imported integer default 0,
  uploaded_at timestamptz default now()
);
```

- [ ] **Step 2: Crear src/lib/types.ts**

```typescript
export interface Evento {
  id: string
  departamento: string
  municipio: string | null
  año: number
  mes: number | null
  sexo: string | null
  grupo_etario: string | null
  metodo: string | null
  tipo_evento: string | null
  programa: string | null
  casos: number
  created_at: string
}

export interface DashboardFilters {
  año?: number
  departamento?: string
  programa?: string
  tipo_evento?: string
}

export interface KPIData {
  total_casos: number
  top_departamento: string
  variacion_anual: number
  total_registros: number
}
```

- [ ] **Step 3: Crear src/lib/supabase/client.ts**

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 4: Crear src/lib/supabase/server.ts**

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add supabase/ src/lib/
git commit -m "feat: add Supabase schema and client libs"
```

---

### Task 4: Theme Global & Layout

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/components/navbar.tsx`
- Create: `src/components/footer.tsx`

- [ ] **Step 1: Actualizar globals.css con paleta de marca**

```css
@import "tailwindcss";

:root {
  --color-primary: #1A5276;
  --color-primary-light: #2980B9;
  --color-accent: #2ECC71;
  --color-bg: #F4F6F9;
  --color-text: #1C2833;
  --font-sans: 'Inter', system-ui, sans-serif;
}

body {
  font-family: var(--font-sans);
  background-color: #ffffff;
  color: var(--color-text);
}

.section-bg {
  background-color: var(--color-bg);
}
```

- [ ] **Step 2: Crear src/app/layout.tsx**

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Servicios y Salud S.A.S.',
  description: 'Desarrollo de estrategias en salud mental, prevención de conducta suicida, mitigación de SPA y desarrollo social comunitario.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Crear src/components/navbar.tsx**

```tsx
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
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1A5276' }}>
            <span className="text-white font-bold text-sm">+</span>
          </div>
          <span className="font-bold text-lg" style={{ color: '#1A5276' }}>
            Servicios y Salud
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-600 hover:text-[#1A5276] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/dashboard">
            <Button size="sm" style={{ backgroundColor: '#1A5276' }} className="text-white hover:opacity-90">
              Dashboard
            </Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-4">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-gray-700" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/dashboard" onClick={() => setOpen(false)}>
            <Button size="sm" className="w-full" style={{ backgroundColor: '#1A5276' }}>
              Dashboard
            </Button>
          </Link>
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 4: Crear src/components/footer.tsx**

```tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#1A5276' }} className="text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="font-bold text-sm" style={{ color: '#1A5276' }}>+</span>
              </div>
              <span className="font-bold text-lg">Servicios y Salud S.A.S.</span>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              Desarrollo de estrategias y proyectos en servicios de educación, intervención psicosocial y salud pública.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Programas</h3>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li><Link href="/programas/salud-mental" className="hover:text-white transition-colors">Salud Mental</Link></li>
              <li><Link href="/programas/prevencion-suicida" className="hover:text-white transition-colors">Prevención Suicida</Link></li>
              <li><Link href="/programas/spa" className="hover:text-white transition-colors">Mitigación SPA</Link></li>
              <li><Link href="/programas/social-comunitario" className="hover:text-white transition-colors">Social y Comunitario</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li>Colombia — Cobertura Nacional</li>
              <li>
                <a href="https://www.instagram.com/serviciosysaludsas/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  @serviciosysaludsas
                </a>
              </li>
              <li><Link href="/contacto" className="hover:text-white transition-colors">Formulario de Contacto</Link></li>
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
```

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/components/navbar.tsx src/components/footer.tsx
git commit -m "feat: global theme, layout, navbar and footer"
```

---

### Task 5: Home Page

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/components/hero.tsx`
- Create: `src/components/programs-overview.tsx`
- Create: `src/lib/programas-data.ts`

- [ ] **Step 1: Crear src/lib/programas-data.ts**

```typescript
export interface Programa {
  slug: string
  title: string
  description: string
  longDescription: string
  icon: string
  color: string
  objetivos: string[]
  poblacion: string
}

export const programas: Programa[] = [
  {
    slug: 'salud-mental',
    title: 'Salud Mental',
    description: 'Intervención psicosocial y fortalecimiento de la salud mental en comunidades e instituciones.',
    longDescription: 'Desarrollamos estrategias integrales de intervención psicosocial orientadas al fortalecimiento de la salud mental en comunidades, instituciones educativas y empresas a nivel nacional. Nuestro equipo multidisciplinario trabaja en la identificación temprana de factores de riesgo y la promoción del bienestar emocional.',
    icon: '🧠',
    color: '#2980B9',
    objetivos: [
      'Diagnóstico de necesidades en salud mental comunitaria',
      'Diseño de rutas de atención psicosocial',
      'Formación a profesionales y cuidadores',
      'Acompañamiento a instituciones educativas y empresariales',
    ],
    poblacion: 'Comunidades, instituciones educativas, empresas y entidades del sector salud.',
  },
  {
    slug: 'prevencion-suicida',
    title: 'Prevención de la Conducta Suicida',
    description: 'Programas especializados en la prevención, detección temprana y posvención del suicidio.',
    longDescription: 'Implementamos programas especializados basados en evidencia para la prevención de la conducta suicida. Trabajamos con equipos de salud, instituciones educativas y familias para desarrollar competencias en detección temprana, intervención en crisis y posvención.',
    icon: '💙',
    color: '#1A5276',
    objetivos: [
      'Detección temprana de factores de riesgo suicida',
      'Entrenamiento en primeros auxilios psicológicos',
      'Desarrollo de protocolos institucionales de posvención',
      'Seguimiento estadístico y reportes por departamento',
    ],
    poblacion: 'Secretarías de salud, hospitales, colegios, universidades y familias.',
  },
  {
    slug: 'spa',
    title: 'Mitigación del Consumo de SPA',
    description: 'Estrategias de prevención y mitigación del consumo de sustancias psicoactivas.',
    longDescription: 'Diseñamos e implementamos estrategias de prevención, mitigación y tratamiento del consumo de sustancias psicoactivas (SPA), adaptadas a cada contexto territorial y población. Articulamos con entidades públicas y privadas para desarrollar respuestas integrales.',
    icon: '🛡️',
    color: '#27AE60',
    objetivos: [
      'Caracterización del consumo de SPA en territorios',
      'Diseño de programas de prevención basados en evidencia',
      'Capacitación a familias, docentes y líderes comunitarios',
      'Articulación con redes de atención y rehabilitación',
    ],
    poblacion: 'Jóvenes, familias, instituciones educativas y entidades territoriales.',
  },
  {
    slug: 'social-comunitario',
    title: 'Estrategias Sociales y Comunitarias',
    description: 'Desarrollo de proyectos sociales con impacto comunitario a nivel nacional.',
    longDescription: 'Acompañamos procesos de desarrollo social y comunitario a nivel nacional, articulando actores institucionales, comunitarios y del sector privado. Diseñamos proyectos con impacto medible orientados al fortalecimiento del tejido social y la participación ciudadana.',
    icon: '🤝',
    color: '#8E44AD',
    objetivos: [
      'Diagnósticos participativos de necesidades comunitarias',
      'Formulación y gestión de proyectos sociales',
      'Fortalecimiento de organizaciones de base',
      'Medición de impacto social con indicadores cualitativos y cuantitativos',
    ],
    poblacion: 'Comunidades, organizaciones sociales, alcaldías y gobernaciones.',
  },
]
```

- [ ] **Step 2: Crear src/components/hero.tsx**

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1A5276 0%, #2980B9 100%)' }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <span className="text-white text-sm font-medium">Cobertura Nacional · Colombia</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Transformando vidas a través de la{' '}
            <span className="text-blue-200">salud mental</span> y el{' '}
            <span className="text-blue-200">bienestar social</span>
          </h1>

          <p className="text-blue-100 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
            Desarrollamos estrategias integrales en educación, intervención psicosocial y salud pública para comunidades, instituciones y entidades territoriales de Colombia.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/programas">
              <Button size="lg" className="bg-white text-[#1A5276] hover:bg-blue-50 font-semibold w-full sm:w-auto">
                Conocer Programas
              </Button>
            </Link>
            <Link href="/contacto">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                Contáctanos
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/20 pt-8">
            {[
              { value: '4', label: 'Líneas de Intervención' },
              { value: '32', label: 'Departamentos' },
              { value: '100%', label: 'Enfoque Basado en Evidencia' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-blue-200 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Crear src/components/programs-overview.tsx**

```tsx
import Link from 'next/link'
import { programas } from '@/lib/programas-data'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

export function ProgramsOverview() {
  return (
    <section className="py-20" style={{ backgroundColor: '#F4F6F9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4" style={{ backgroundColor: '#1A5276' }}>Nuestros Programas</Badge>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#1C2833' }}>
            Líneas de Intervención
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
            Trabajamos con un enfoque integral y basado en evidencia para atender las principales necesidades de salud pública del país.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programas.map(p => (
            <Link key={p.slug} href={`/programas/${p.slug}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                    style={{ backgroundColor: `${p.color}15` }}
                  >
                    {p.icon}
                  </div>
                  <h3 className="font-bold text-lg" style={{ color: '#1C2833' }}>{p.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.description}</p>
                  <div className="flex items-center gap-1 mt-4 text-sm font-medium" style={{ color: p.color }}>
                    Ver más <ArrowRight size={14} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Crear src/app/page.tsx**

```tsx
import { Hero } from '@/components/hero'
import { ProgramsOverview } from '@/components/programs-overview'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProgramsOverview />

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1C2833' }}>
            ¿Trabajamos juntos?
          </h2>
          <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
            Contáctenos para diseñar una estrategia personalizada para su institución, comunidad o entidad territorial.
          </p>
          <Link href="/contacto">
            <Button size="lg" style={{ backgroundColor: '#1A5276' }} className="text-white hover:opacity-90">
              Solicitar información
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/
git commit -m "feat: home page with hero and programs overview"
```

---

### Task 6: Quiénes Somos & Programas Pages

**Files:**
- Create: `src/app/quienes-somos/page.tsx`
- Create: `src/app/programas/page.tsx`
- Create: `src/app/programas/[slug]/page.tsx`

- [ ] **Step 1: Crear src/app/quienes-somos/page.tsx**

```tsx
import { Badge } from '@/components/ui/badge'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quiénes Somos — Servicios y Salud S.A.S.',
}

const valores = [
  { title: 'Integridad', desc: 'Actuamos con transparencia y responsabilidad en cada intervención.' },
  { title: 'Impacto', desc: 'Medimos nuestros resultados y aprendemos continuamente de la práctica.' },
  { title: 'Innovación', desc: 'Adaptamos estrategias basadas en la mejor evidencia disponible.' },
  { title: 'Compromiso Social', desc: 'Ponemos el bienestar de las comunidades en el centro de nuestra labor.' },
]

export default function QuienesSomosPage() {
  return (
    <div>
      {/* Header */}
      <section style={{ background: 'linear-gradient(135deg, #1A5276 0%, #2980B9 100%)' }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-white/20 text-white border-0">Nuestra Organización</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Quiénes Somos</h1>
          <p className="text-blue-100 text-xl max-w-2xl">
            Una organización colombiana dedicada al desarrollo de estrategias en salud pública, intervención psicosocial y bienestar comunitario.
          </p>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-20" style={{ backgroundColor: '#F4F6F9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-2xl" style={{ backgroundColor: '#E8F4FD' }}>🎯</div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1A5276' }}>Misión</h2>
            <p className="text-gray-600 leading-relaxed">
              Desarrollar e implementar estrategias y proyectos de intervención en salud mental, prevención de conducta suicida, mitigación del consumo de sustancias psicoactivas y desarrollo social comunitario, contribuyendo al bienestar integral de las comunidades colombianas.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-2xl" style={{ backgroundColor: '#E8F4FD' }}>🔭</div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1A5276' }}>Visión</h2>
            <p className="text-gray-600 leading-relaxed">
              Ser reconocidos a nivel nacional como la organización líder en intervención psicosocial y salud pública, articulando actores públicos, privados y comunitarios para generar impacto sostenible en la calidad de vida de los colombianos.
            </p>
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Badge className="mb-4" style={{ backgroundColor: '#1A5276' }}>Nuestra Historia</Badge>
            <h2 className="text-3xl font-bold mb-6" style={{ color: '#1C2833' }}>
              Construyendo bienestar desde la experiencia
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
              <p>
                Servicios y Salud S.A.S. nació de la convicción de que la salud mental y el bienestar social son derechos fundamentales de toda comunidad. Desde nuestra fundación, hemos trabajado incansablemente para diseñar e implementar programas que respondan a las necesidades reales del territorio colombiano.
              </p>
              <p>
                Contamos con un equipo interdisciplinario de psicólogos, trabajadores sociales, educadores y expertos en salud pública, comprometidos con la excelencia técnica y el impacto social medible.
              </p>
              <p>
                Nuestra cobertura alcanza los 32 departamentos del país, articulando con secretarías de salud, instituciones educativas, empresas y organizaciones comunitarias para construir territorios más saludables y resilientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20" style={{ backgroundColor: '#F4F6F9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4" style={{ backgroundColor: '#1A5276' }}>Lo que nos mueve</Badge>
            <h2 className="text-3xl font-bold" style={{ color: '#1C2833' }}>Nuestros Valores</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map(v => (
              <div key={v.title} className="bg-white rounded-xl p-6 shadow-sm text-center">
                <h3 className="font-bold text-lg mb-2" style={{ color: '#1A5276' }}>{v.title}</h3>
                <p className="text-gray-500 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Crear src/app/programas/page.tsx**

```tsx
import Link from 'next/link'
import { programas } from '@/lib/programas-data'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Programas — Servicios y Salud S.A.S.',
}

export default function ProgramasPage() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #1A5276 0%, #2980B9 100%)' }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-white/20 text-white border-0">Líneas de Intervención</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Nuestros Programas</h1>
          <p className="text-blue-100 text-xl max-w-2xl">
            Soluciones integrales y basadas en evidencia para la salud mental y el bienestar comunitario.
          </p>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: '#F4F6F9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programas.map(p => (
              <Card key={p.slug} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0" style={{ backgroundColor: `${p.color}15` }}>
                      {p.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold" style={{ color: '#1C2833' }}>{p.title}</h2>
                      <p className="text-gray-500 text-sm mt-1">{p.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Objetivos</p>
                    <ul className="space-y-1">
                      {p.objetivos.slice(0, 3).map(o => (
                        <li key={o} className="flex items-start gap-2 text-sm text-gray-600">
                          <span style={{ color: p.color }} className="mt-0.5">•</span>
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href={`/programas/${p.slug}`}>
                    <Button variant="outline" size="sm" style={{ borderColor: p.color, color: p.color }}>
                      Ver programa completo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 3: Crear src/app/programas/[slug]/page.tsx**

```tsx
import { programas } from '@/lib/programas-data'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const programa = programas.find(p => p.slug === slug)
  return { title: programa ? `${programa.title} — Servicios y Salud` : 'Programa no encontrado' }
}

export function generateStaticParams() {
  return programas.map(p => ({ slug: p.slug }))
}

export default async function ProgramaDetailPage({ params }: Props) {
  const { slug } = await params
  const programa = programas.find(p => p.slug === slug)
  if (!programa) notFound()

  return (
    <div>
      <section style={{ background: `linear-gradient(135deg, ${programa.color} 0%, ${programa.color}CC 100%)` }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/programas" className="text-white/70 hover:text-white text-sm mb-4 inline-block">← Todos los programas</Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">{programa.icon}</div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">{programa.title}</h1>
          </div>
          <p className="text-white/80 text-xl max-w-2xl">{programa.description}</p>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: '#F4F6F9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1C2833' }}>Descripción del Programa</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{programa.longDescription}</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1C2833' }}>Objetivos</h2>
              <ul className="space-y-3">
                {programa.objetivos.map(o => (
                  <li key={o} className="flex items-start gap-3">
                    <span className="mt-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs shrink-0" style={{ backgroundColor: programa.color }}>✓</span>
                    <span className="text-gray-600">{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1C2833' }}>Población Objetivo</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{programa.poblacion}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1C2833' }}>¿Le interesa este programa?</h3>
              <Link href="/contacto">
                <Button className="w-full text-white" style={{ backgroundColor: programa.color }}>
                  Solicitar información
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/quienes-somos src/app/programas src/lib/programas-data.ts
git commit -m "feat: quienes somos and programas pages"
```

---

### Task 7: Contacto Page

**Files:**
- Create: `src/app/contacto/page.tsx`
- Create: `src/app/api/contacto/route.ts`

- [ ] **Step 1: Crear src/app/api/contacto/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nombre, email, mensaje, organizacion } = body

  if (!nombre || !email || !mensaje) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  // En producción: enviar email con Resend/Nodemailer o guardar en DB
  console.log('Nuevo contacto:', { nombre, email, organizacion, mensaje })

  return NextResponse.json({ success: true })
}
```

- [ ] **Step 2: Crear src/app/contacto/page.tsx**

```tsx
'use client'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Metadata } from 'next'

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: '', email: '', organizacion: '', mensaje: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) setStatus('sent')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #1A5276 0%, #2980B9 100%)' }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-white/20 text-white border-0">Comunícate con nosotros</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contacto</h1>
          <p className="text-blue-100 text-xl max-w-2xl">
            Cuéntenos sobre su organización y necesidades. Diseñamos propuestas a la medida.
          </p>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: '#F4F6F9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1C2833' }}>Envíenos un mensaje</h2>

            {status === 'sent' ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <p className="text-green-700 font-medium">✓ Mensaje enviado. Nos comunicaremos pronto.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-2xl p-8 shadow-sm">
                <div>
                  <Label htmlFor="nombre">Nombre completo *</Label>
                  <Input id="nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">Correo electrónico *</Label>
                  <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="organizacion">Organización / Institución</Label>
                  <Input id="organizacion" value={form.organizacion} onChange={e => setForm(f => ({ ...f, organizacion: e.target.value }))} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="mensaje">Mensaje *</Label>
                  <textarea
                    id="mensaje"
                    rows={5}
                    value={form.mensaje}
                    onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
                    required
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                </div>
                {status === 'error' && <p className="text-red-500 text-sm">Error al enviar. Intente nuevamente.</p>}
                <Button type="submit" disabled={status === 'sending'} className="w-full text-white" style={{ backgroundColor: '#1A5276' }}>
                  {status === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
                </Button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4" style={{ color: '#1C2833' }}>Información de contacto</h3>
              <div className="space-y-3 text-gray-600">
                <p>📍 Colombia — Cobertura Nacional</p>
                <p>📱 <a href="https://www.instagram.com/serviciosysaludsas/" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: '#2980B9' }}>@serviciosysaludsas</a></p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-3" style={{ color: '#1C2833' }}>Trabajamos con</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {['Secretarías de Salud y Educación', 'Hospitales y ESE', 'Instituciones Educativas', 'Empresas y Organizaciones', 'Alcaldías y Gobernaciones', 'ONG y Fundaciones'].map(i => (
                  <li key={i} className="flex items-center gap-2">
                    <span style={{ color: '#2980B9' }}>•</span> {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/contacto src/app/api/contacto
git commit -m "feat: contact page and API route"
```

---

### Task 8: Auth — Login & Middleware

**Files:**
- Create: `src/app/login/page.tsx`
- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/auth/logout/route.ts`
- Create: `src/middleware.ts`

- [ ] **Step 1: Crear src/middleware.ts**

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

- [ ] **Step 2: Crear src/app/login/page.tsx**

```tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Credenciales incorrectas. Intente nuevamente.')
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F4F6F9' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#1A5276' }}>
              <span className="text-white text-2xl font-bold">+</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#1C2833' }}>Acceso al Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Servicios y Salud S.A.S.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1" autoComplete="email" />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1" autoComplete="current-password" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full text-white" style={{ backgroundColor: '#1A5276' }}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Crear src/app/api/auth/logout/route.ts**

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
}
```

- [ ] **Step 4: Commit**

```bash
git add src/middleware.ts src/app/login src/app/api/auth
git commit -m "feat: auth middleware and login page"
```

---

### Task 9: Dashboard — Layout, KPIs y Filtros

**Files:**
- Create: `src/app/dashboard/layout.tsx`
- Create: `src/app/dashboard/page.tsx`
- Create: `src/components/dashboard/kpi-cards.tsx`
- Create: `src/components/dashboard/filters.tsx`
- Create: `src/app/api/dashboard/stats/route.ts`

- [ ] **Step 1: Crear src/app/api/dashboard/stats/route.ts**

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)

  const año = searchParams.get('año')
  const departamento = searchParams.get('departamento')
  const programa = searchParams.get('programa')
  const tipo_evento = searchParams.get('tipo_evento')

  let query = supabase.from('eventos').select('*')

  if (año) query = query.eq('año', parseInt(año))
  if (departamento) query = query.eq('departamento', departamento)
  if (programa) query = query.eq('programa', programa)
  if (tipo_evento) query = query.eq('tipo_evento', tipo_evento)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data || data.length === 0) return NextResponse.json({ eventos: [], kpis: { total_casos: 0, top_departamento: 'N/A', variacion_anual: 0, total_registros: 0 } })

  const total_casos = data.reduce((acc, e) => acc + (e.casos || 0), 0)
  const total_registros = data.length

  const byDept = data.reduce<Record<string, number>>((acc, e) => {
    acc[e.departamento] = (acc[e.departamento] || 0) + e.casos
    return acc
  }, {})
  const top_departamento = Object.entries(byDept).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

  const currentYear = año ? parseInt(año) : new Date().getFullYear()
  const currentCasos = data.filter(e => e.año === currentYear).reduce((acc, e) => acc + e.casos, 0)
  const prevCasos = data.filter(e => e.año === currentYear - 1).reduce((acc, e) => acc + e.casos, 0)
  const variacion_anual = prevCasos > 0 ? Math.round(((currentCasos - prevCasos) / prevCasos) * 100) : 0

  return NextResponse.json({
    eventos: data,
    kpis: { total_casos, top_departamento, variacion_anual, total_registros },
  })
}
```

- [ ] **Step 2: Crear src/components/dashboard/kpi-cards.tsx**

```tsx
import { Card, CardContent } from '@/components/ui/card'
import type { KPIData } from '@/lib/types'

interface Props { kpis: KPIData }

export function KPICards({ kpis }: Props) {
  const cards = [
    { label: 'Total de Casos', value: kpis.total_casos.toLocaleString('es-CO'), icon: '📊', color: '#1A5276' },
    { label: 'Departamento con más casos', value: kpis.top_departamento, icon: '📍', color: '#2980B9' },
    {
      label: 'Variación Anual',
      value: `${kpis.variacion_anual > 0 ? '+' : ''}${kpis.variacion_anual}%`,
      icon: kpis.variacion_anual > 0 ? '📈' : '📉',
      color: kpis.variacion_anual > 0 ? '#E74C3C' : '#27AE60',
    },
    { label: 'Total Registros', value: kpis.total_registros.toLocaleString('es-CO'), icon: '📋', color: '#8E44AD' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(c => (
        <Card key={c.label} className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{c.label}</p>
                <p className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</p>
              </div>
              <span className="text-2xl">{c.icon}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Crear src/components/dashboard/filters.tsx**

```tsx
'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface Props {
  filters: { año?: string; departamento?: string; programa?: string; tipo_evento?: string }
  onChange: (key: string, value: string) => void
}

const años = ['2021', '2022', '2023', '2024', '2025']
const programas = ['Prevención Suicida', 'Salud Mental', 'Mitigación SPA', 'Social y Comunitario']
const tipos = ['Intento', 'Muerte', 'Ideación']

export function DashboardFilters({ filters, onChange }: Props) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex flex-wrap gap-4 items-end">
      <div className="min-w-32">
        <Label className="text-xs text-gray-500 mb-1 block">Año</Label>
        <Select value={filters.año || 'all'} onValueChange={v => onChange('año', v === 'all' ? '' : v)}>
          <SelectTrigger className="h-9"><SelectValue placeholder="Todos" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {años.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-40">
        <Label className="text-xs text-gray-500 mb-1 block">Programa</Label>
        <Select value={filters.programa || 'all'} onValueChange={v => onChange('programa', v === 'all' ? '' : v)}>
          <SelectTrigger className="h-9"><SelectValue placeholder="Todos" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {programas.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-36">
        <Label className="text-xs text-gray-500 mb-1 block">Tipo de Evento</Label>
        <Select value={filters.tipo_evento || 'all'} onValueChange={v => onChange('tipo_evento', v === 'all' ? '' : v)}>
          <SelectTrigger className="h-9"><SelectValue placeholder="Todos" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {tipos.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Crear src/app/dashboard/layout.tsx**

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F6F9' }}>
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="font-semibold text-sm" style={{ color: '#1A5276' }}>Dashboard</Link>
            <span className="text-gray-300">|</span>
            <Link href="/dashboard/upload" className="text-sm text-gray-500 hover:text-gray-700">Cargar Excel</Link>
          </div>
          <form action="/api/auth/logout" method="POST">
            <Button type="submit" variant="ghost" size="sm" className="text-gray-500">Cerrar sesión</Button>
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/layout.tsx src/components/dashboard/ src/app/api/dashboard/
git commit -m "feat: dashboard layout, KPI cards and filters"
```

---

### Task 10: Dashboard Charts

**Files:**
- Create: `src/components/dashboard/departamento-chart.tsx`
- Create: `src/components/dashboard/temporal-chart.tsx`
- Create: `src/components/dashboard/distribucion-charts.tsx`

- [ ] **Step 1: Crear src/components/dashboard/departamento-chart.tsx**

```tsx
'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { Evento } from '@/lib/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface Props { eventos: Evento[] }

export function DepartamentoChart({ eventos }: Props) {
  const data = Object.entries(
    eventos.reduce<Record<string, number>>((acc, e) => {
      acc[e.departamento] = (acc[e.departamento] || 0) + e.casos
      return acc
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([departamento, casos]) => ({ departamento: departamento.slice(0, 12), casos }))

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <h3 className="font-semibold text-sm" style={{ color: '#1C2833' }}>Top 10 Departamentos</h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="departamento" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" interval={0} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [v, 'Casos']} />
            <Bar dataKey="casos" fill="#1A5276" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Crear src/components/dashboard/temporal-chart.tsx**

```tsx
'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { Evento } from '@/lib/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface Props { eventos: Evento[] }

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export function TemporalChart({ eventos }: Props) {
  const years = [...new Set(eventos.map(e => e.año))].sort().slice(-3)

  const data = MESES.map((mes, i) => {
    const row: Record<string, string | number> = { mes }
    years.forEach(year => {
      row[String(year)] = eventos
        .filter(e => e.año === year && e.mes === i + 1)
        .reduce((acc, e) => acc + e.casos, 0)
    })
    return row
  })

  const colors = ['#1A5276', '#2980B9', '#5DADE2']

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <h3 className="font-semibold text-sm" style={{ color: '#1C2833' }}>Evolución Temporal (por mes)</h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {years.map((year, i) => (
              <Line key={year} type="monotone" dataKey={String(year)} stroke={colors[i]} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 3: Crear src/components/dashboard/distribucion-charts.tsx**

```tsx
'use client'
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import type { Evento } from '@/lib/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface Props { eventos: Evento[] }

const COLORS = ['#1A5276', '#2980B9', '#5DADE2', '#85C1E9', '#AED6F1']

export function DistribucionCharts({ eventos }: Props) {
  const porSexo = Object.entries(
    eventos.reduce<Record<string, number>>((acc, e) => {
      if (e.sexo) acc[e.sexo] = (acc[e.sexo] || 0) + e.casos
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  const porEtario = Object.entries(
    eventos.reduce<Record<string, number>>((acc, e) => {
      if (e.grupo_etario) acc[e.grupo_etario] = (acc[e.grupo_etario] || 0) + e.casos
      return acc
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .map(([grupo_etario, casos]) => ({ grupo_etario, casos }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-sm" style={{ color: '#1C2833' }}>Distribución por Sexo</h3>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={porSexo} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={12}>
                {porSexo.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [v, 'Casos']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-sm" style={{ color: '#1C2833' }}>Casos por Grupo Etario</h3>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={porEtario} margin={{ top: 5, right: 10, left: 0, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="grupo_etario" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [v, 'Casos']} />
              <Bar dataKey="casos" fill="#2980B9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 4: Crear src/app/dashboard/page.tsx**

```tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import { KPICards } from '@/components/dashboard/kpi-cards'
import { DashboardFilters } from '@/components/dashboard/filters'
import { DepartamentoChart } from '@/components/dashboard/departamento-chart'
import { TemporalChart } from '@/components/dashboard/temporal-chart'
import { DistribucionCharts } from '@/components/dashboard/distribucion-charts'
import type { Evento, KPIData } from '@/lib/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [eventos, setEventos] = useState<Evento[]>([])
  const [kpis, setKpis] = useState<KPIData>({ total_casos: 0, top_departamento: 'N/A', variacion_anual: 0, total_registros: 0 })
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v))
    const res = await fetch(`/api/dashboard/stats?${params}`)
    const json = await res.json()
    setEventos(json.eventos || [])
    setKpis(json.kpis || { total_casos: 0, top_departamento: 'N/A', variacion_anual: 0, total_registros: 0 })
    setLoading(false)
  }, [filters])

  useEffect(() => { fetchData() }, [fetchData])

  const handleFilter = (key: string, value: string) => setFilters(f => ({ ...f, [key]: value }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1C2833' }}>Panel de Indicadores</h1>
          <p className="text-gray-500 text-sm mt-1">Conducta suicida y salud mental — Colombia</p>
        </div>
        <Link href="/dashboard/upload">
          <Button style={{ backgroundColor: '#1A5276' }} className="text-white">+ Cargar Excel</Button>
        </Link>
      </div>

      <DashboardFilters filters={filters} onChange={handleFilter} />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 text-sm">Cargando datos...</div>
        </div>
      ) : eventos.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <p className="text-5xl mb-4">📊</p>
          <h2 className="text-xl font-semibold mb-2" style={{ color: '#1C2833' }}>Sin datos aún</h2>
          <p className="text-gray-500 mb-6">Cargue un archivo Excel para visualizar los indicadores.</p>
          <Link href="/dashboard/upload">
            <Button style={{ backgroundColor: '#1A5276' }} className="text-white">Cargar primer Excel</Button>
          </Link>
        </div>
      ) : (
        <>
          <KPICards kpis={kpis} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DepartamentoChart eventos={eventos} />
            <TemporalChart eventos={eventos} />
          </div>
          <DistribucionCharts eventos={eventos} />
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/ src/app/dashboard/page.tsx
git commit -m "feat: dashboard charts and main page"
```

---

### Task 11: Excel Upload

**Files:**
- Create: `src/app/dashboard/upload/page.tsx`
- Create: `src/components/dashboard/excel-dropzone.tsx`
- Create: `src/app/api/upload/route.ts`

- [ ] **Step 1: Crear src/app/api/upload/route.ts**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 })

  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)

  const eventos = rows.map(row => ({
    departamento: String(row['departamento'] || row['Departamento'] || ''),
    municipio: String(row['municipio'] || row['Municipio'] || ''),
    año: Number(row['año'] || row['Año'] || 0),
    mes: Number(row['mes'] || row['Mes'] || null) || null,
    sexo: String(row['sexo'] || row['Sexo'] || '') || null,
    grupo_etario: String(row['grupo_etario'] || row['Grupo Etario'] || '') || null,
    metodo: String(row['metodo'] || row['Método'] || '') || null,
    tipo_evento: String(row['tipo_evento'] || row['Tipo Evento'] || '') || null,
    programa: String(row['programa'] || row['Programa'] || '') || null,
    casos: Number(row['casos'] || row['Casos'] || 0),
  })).filter(e => e.departamento && e.año > 0)

  if (eventos.length === 0) {
    return NextResponse.json({ error: 'No se encontraron filas válidas. Verifique el formato del archivo.' }, { status: 400 })
  }

  const { error } = await supabase.from('eventos').insert(eventos)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('uploads').insert({ filename: file.name, rows_imported: eventos.length })

  return NextResponse.json({ success: true, rows_imported: eventos.length })
}
```

- [ ] **Step 2: Crear src/components/dashboard/excel-dropzone.tsx**

```tsx
'use client'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'

interface Props { onSuccess: (rows: number) => void }

export function ExcelDropzone({ onSuccess }: Props) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleFile = useCallback((f: File) => {
    if (!f.name.match(/\.(xlsx|xls)$/i)) {
      setError('Solo se aceptan archivos Excel (.xlsx, .xls)')
      return
    }
    setFile(f)
    setError('')
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [handleFile])

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const json = await res.json()

    setUploading(false)
    if (res.ok) {
      setFile(null)
      onSuccess(json.rows_imported)
    } else {
      setError(json.error || 'Error al procesar el archivo')
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer ${dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
        <div className="text-5xl mb-4">📂</div>
        {file ? (
          <div>
            <p className="font-semibold text-gray-700">{file.name}</p>
            <p className="text-sm text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        ) : (
          <div>
            <p className="font-medium text-gray-600">Arrastra el archivo Excel aquí</p>
            <p className="text-sm text-gray-400 mt-1">o haz clic para seleccionar • .xlsx, .xls</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full text-white"
        style={{ backgroundColor: '#1A5276' }}
      >
        {uploading ? 'Procesando...' : 'Cargar datos al sistema'}
      </Button>
    </div>
  )
}
```

- [ ] **Step 3: Crear src/app/dashboard/upload/page.tsx**

```tsx
'use client'
import { useState } from 'react'
import { ExcelDropzone } from '@/components/dashboard/excel-dropzone'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function UploadPage() {
  const [success, setSuccess] = useState<number | null>(null)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#1C2833' }}>Cargar Datos Excel</h1>
        <p className="text-gray-500 text-sm mt-1">Importe datos de eventos para actualizar los indicadores del dashboard.</p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        {success !== null ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: '#1C2833' }}>
              {success} registros importados
            </h2>
            <p className="text-gray-500 mb-6">Los datos ya están disponibles en el dashboard.</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setSuccess(null)} variant="outline">Cargar otro archivo</Button>
              <Link href="/dashboard">
                <Button style={{ backgroundColor: '#1A5276' }} className="text-white">Ver Dashboard</Button>
              </Link>
            </div>
          </div>
        ) : (
          <ExcelDropzone onSuccess={setSuccess} />
        )}
      </div>

      <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <h3 className="font-semibold text-sm mb-2" style={{ color: '#1A5276' }}>Formato esperado del Excel</h3>
        <p className="text-xs text-gray-500 mb-3">El archivo debe tener las siguientes columnas en la primera hoja:</p>
        <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 font-mono">
          {['departamento', 'municipio', 'año', 'mes', 'sexo', 'grupo_etario', 'metodo', 'tipo_evento', 'programa', 'casos'].map(col => (
            <span key={col} className="bg-white rounded px-2 py-1 border border-blue-100">{col}</span>
          ))}
        </div>
        <Link href="/samples/datos-ejemplo.xlsx" className="text-xs mt-3 inline-block" style={{ color: '#2980B9' }}>
          Descargar plantilla de ejemplo →
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/upload src/components/dashboard/excel-dropzone.tsx src/app/dashboard/upload
git commit -m "feat: Excel drag & drop upload and API route"
```

---

### Task 12: Sample Excel File

**Files:**
- Create: `scripts/generate-sample.mjs`
- Create: `public/samples/datos-ejemplo.xlsx`

- [ ] **Step 1: Crear scripts/generate-sample.mjs**

```javascript
import * as XLSX from 'xlsx'
import { writeFileSync, mkdirSync } from 'fs'

const departamentos = [
  'Antioquia', 'Cundinamarca', 'Valle del Cauca', 'Atlántico', 'Santander',
  'Bolívar', 'Nariño', 'Córdoba', 'Tolima', 'Cauca',
  'Meta', 'Risaralda', 'Caldas', 'Huila', 'Boyacá',
]

const municipiosPorDept = {
  'Antioquia': ['Medellín', 'Bello', 'Envigado'],
  'Cundinamarca': ['Bogotá', 'Soacha', 'Chía'],
  'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura'],
  'Atlántico': ['Barranquilla', 'Soledad'],
  'Santander': ['Bucaramanga', 'Floridablanca'],
}

const sexos = ['Masculino', 'Femenino']
const gruposEtarios = ['10-14', '15-19', '20-29', '30-44', '45-59', '60+']
const metodos = ['Intoxicación', 'Arma corto-punzante', 'Ahorcamiento', 'Arma de fuego', 'Precipitación']
const tipos = ['Intento', 'Muerte', 'Ideación']
const programas = ['Prevención Suicida', 'Salud Mental', 'Mitigación SPA', 'Social y Comunitario']

const rows = []

for (const año of [2022, 2023, 2024]) {
  for (const mes of [1,2,3,4,5,6,7,8,9,10,11,12]) {
    for (const dept of departamentos) {
      const munis = municipiosPorDept[dept] || [dept]
      const n = Math.floor(Math.random() * 3) + 1
      for (let i = 0; i < n; i++) {
        rows.push({
          departamento: dept,
          municipio: munis[Math.floor(Math.random() * munis.length)],
          año,
          mes,
          sexo: sexos[Math.floor(Math.random() * sexos.length)],
          grupo_etario: gruposEtarios[Math.floor(Math.random() * gruposEtarios.length)],
          metodo: metodos[Math.floor(Math.random() * metodos.length)],
          tipo_evento: tipos[Math.floor(Math.random() * tipos.length)],
          programa: programas[Math.floor(Math.random() * programas.length)],
          casos: Math.floor(Math.random() * 15) + 1,
        })
      }
    }
  }
}

const wb = XLSX.utils.book_new()
const ws = XLSX.utils.json_to_sheet(rows)

ws['!cols'] = [
  { wch: 18 }, { wch: 18 }, { wch: 6 }, { wch: 5 },
  { wch: 12 }, { wch: 12 }, { wch: 20 }, { wch: 14 },
  { wch: 22 }, { wch: 8 },
]

XLSX.utils.book_append_sheet(wb, ws, 'Datos')

mkdirSync('public/samples', { recursive: true })
writeFileSync('public/samples/datos-ejemplo.xlsx', XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }))
console.log(`✓ Generado: public/samples/datos-ejemplo.xlsx con ${rows.length} filas`)
```

- [ ] **Step 2: Ejecutar script para generar el Excel**

```bash
node --input-type=module < scripts/generate-sample.mjs
```

- [ ] **Step 3: Commit**

```bash
git add scripts/generate-sample.mjs public/samples/
git commit -m "feat: sample Excel file with synthetic data"
```

---

### Task 13: Word Document — Propuesta Comercial

**Files:**
- Create: `scripts/generate-proposal.mjs`
- Output: `Propuesta_Comercial_ServiciosySalud.docx`

- [ ] **Step 1: Crear scripts/generate-proposal.mjs**

```javascript
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } from 'docx'
import { writeFileSync } from 'fs'

const PRIMARY = '1A5276'
const LIGHT_BG = 'EBF5FB'

const heading1 = (text) => new Paragraph({
  text,
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 400, after: 200 },
  run: { color: PRIMARY, bold: true },
})

const heading2 = (text) => new Paragraph({
  text,
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 300, after: 150 },
  run: { color: PRIMARY },
})

const body = (text) => new Paragraph({
  children: [new TextRun({ text, size: 24, color: '1C2833' })],
  spacing: { after: 120 },
})

const bullet = (text) => new Paragraph({
  children: [new TextRun({ text: `• ${text}`, size: 24, color: '1C2833' })],
  spacing: { after: 80 },
  indent: { left: 360 },
})

const tableRow = (label, value, isHeader = false) => new TableRow({
  children: [
    new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: label, bold: isHeader, size: 22, color: isHeader ? 'FFFFFF' : '1C2833' })] })],
      shading: isHeader ? { fill: PRIMARY, type: ShadingType.CLEAR } : { fill: LIGHT_BG, type: ShadingType.CLEAR },
      width: { size: 60, type: WidthType.PERCENTAGE },
    }),
    new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: value, bold: isHeader, size: 22, color: isHeader ? 'FFFFFF' : '1C2833' })] })],
      shading: isHeader ? { fill: PRIMARY, type: ShadingType.CLEAR } : undefined,
      width: { size: 40, type: WidthType.PERCENTAGE },
    }),
  ],
})

const doc = new Document({
  sections: [{
    properties: {},
    children: [
      // Portada
      new Paragraph({
        children: [new TextRun({ text: 'SERVICIOS Y SALUD S.A.S.', bold: true, size: 52, color: PRIMARY })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 2000, after: 300 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'PROPUESTA COMERCIAL', bold: true, size: 36, color: '2980B9' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Desarrollo de Plataforma Web Institucional y Gestión de Redes Sociales', size: 26, color: '555555', italics: true })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 1500 },
      }),
      new Paragraph({
        children: [new TextRun({ text: `Fecha: Mayo 2026`, size: 22, color: '888888' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 2000 },
      }),

      // 1. Presentación
      heading1('1. Presentación'),
      body('Nos complace presentar esta propuesta comercial en respuesta a la solicitud de Servicios y Salud S.A.S. para el desarrollo de su plataforma web institucional y el fortalecimiento de su ecosistema digital corporativo.'),
      body('El equipo de desarrollo propone una solución integral, moderna y escalable que contempla todos los componentes solicitados, con tecnologías de última generación y un diseño profesional acorde con la identidad corporativa de la organización.'),

      // 2. Descripción del Proyecto
      heading1('2. Descripción del Proyecto'),
      body('El proyecto contempla el desarrollo de una plataforma web completa para Servicios y Salud S.A.S., organización dedicada a la salud mental, prevención de la conducta suicida, mitigación del consumo de sustancias psicoactivas y estrategias sociales y comunitarias a nivel nacional.'),

      heading2('2.1 Objetivo General'),
      body('Diseñar, desarrollar e implementar una plataforma web institucional moderna, funcional y escalable que posicione digitalmente a Servicios y Salud S.A.S. y facilite la gestión de información estadística sobre conducta suicida a nivel departamental.'),

      // 3. Componentes del Proyecto
      heading1('3. Componentes del Proyecto'),

      heading2('3.1 Sitio Web Corporativo'),
      bullet('Diseño moderno, institucional y completamente adaptable a dispositivos móviles (responsive design)'),
      bullet('Página de inicio con presentación institucional y programas de intervención'),
      bullet('Sección "Quiénes Somos": historia, misión, visión y valores'),
      bullet('Sección de Programas: Salud Mental, Prevención Suicida, Mitigación SPA y Social/Comunitario'),
      bullet('Página de Contacto con formulario de solicitud de información'),
      bullet('Optimización para motores de búsqueda (SEO básico)'),

      heading2('3.2 Dashboard de Indicadores (Acceso Restringido)'),
      bullet('Panel de visualización estadística sobre conducta suicida y salud mental a nivel departamental'),
      bullet('Acceso protegido con autenticación (usuario y contraseña)'),
      bullet('Carga de datos mediante archivos Excel (formato .xlsx) con interfaz drag & drop'),
      bullet('Visualizaciones: mapa de Colombia por intensidad de casos, gráficas de barras, líneas temporales, tortas y KPIs'),
      bullet('Filtros interactivos por año, departamento, programa y tipo de evento'),

      heading2('3.3 Infraestructura y Base de Datos'),
      bullet('Base de datos PostgreSQL con Supabase en Docker (despliegue inicial local/servidor propio)'),
      bullet('Arquitectura preparada para migración a la nube sin cambios de código'),
      bullet('Despliegue inicial en Docker para facilidad de instalación y mantenimiento'),
      bullet('Dominio web incluido en el precio de desarrollo'),

      heading2('3.4 Gestión de Redes Sociales — Instagram Corporativo'),
      body('Como componente complementario, se ofrece el servicio de gestión estratégica del Instagram corporativo (@serviciosysaludsas), que incluye:'),
      bullet('Definición y aplicación de línea gráfica coherente con la identidad institucional'),
      bullet('Optimización del perfil: descripción, highlights, foto de perfil'),
      bullet('Producción de contenidos digitales mensuales (publicaciones, carruseles, reels o stories)'),
      bullet('Acompañamiento en posicionamiento y crecimiento orgánico'),
      body('Nota: Este componente se cobra de manera separada e independiente al desarrollo web. El número de piezas mensuales, formato y alcance del servicio puede variar según las necesidades del cliente, por lo que el valor indicado en la propuesta corresponde a un estimado base.'),

      // 4. Desglose de Costos
      heading1('4. Desglose de Costos'),

      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
          left: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
          right: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
          insideH: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
          insideV: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
        },
        rows: [
          tableRow('Componente', 'Valor', true),
          tableRow('Desarrollo web + dominio (pago único)', '$2.500.000 COP'),
          tableRow('Gestión de redes sociales (estimado mensual — 12 posts)', '$500.000 COP/mes'),
          tableRow('TOTAL INVERSIÓN INICIAL', '$3.000.000 COP', false),
        ],
      }),

      new Paragraph({ spacing: { before: 200 } }),

      body('El valor de gestión de redes sociales corresponde a un estimado base para 12 publicaciones mensuales. Este valor puede ajustarse según el volumen de piezas, formato (imágenes, videos, reels) y alcance del servicio acordado con el cliente.'),

      heading2('4.1 Modalidad de Pago'),
      bullet('50% al inicio del proyecto: $1.500.000 COP'),
      bullet('50% al finalizar y entregar el proyecto: $1.500.000 COP'),
      bullet('Servicio mensual de redes sociales: $500.000 COP/mes (estimado)'),

      // 5. Cronograma
      heading1('5. Cronograma Estimado de Desarrollo'),

      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
          left: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
          right: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
          insideH: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
          insideV: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
        },
        rows: [
          tableRow('Fase', 'Duración estimada', true),
          tableRow('Semana 1-2: Diseño y estructura del sitio', '2 semanas'),
          tableRow('Semana 2-3: Desarrollo páginas informativas', '2 semanas'),
          tableRow('Semana 3-4: Dashboard y carga de Excel', '2 semanas'),
          tableRow('Semana 4-5: Integración, pruebas y ajustes', '1-2 semanas'),
          tableRow('Semana 5-6: Despliegue y entrega final', '1 semana'),
          tableRow('TOTAL', '4 a 6 semanas'),
        ],
      }),

      new Paragraph({ spacing: { before: 200 } }),

      // 6. Escalabilidad
      heading1('6. Escalabilidad Futura'),
      body('La plataforma está diseñada con una arquitectura modular que permite la integración de nuevos módulos y herramientas en el futuro, tales como:'),
      bullet('Migración de base de datos de Docker a Supabase Cloud sin cambios de código'),
      bullet('Módulo de gestión de noticias y blog institucional'),
      bullet('Módulo de diplomados y formación virtual'),
      bullet('Integración con sistemas de información en salud pública'),
      bullet('Aplicación móvil complementaria'),
      bullet('Módulo de reportes automatizados en PDF'),

      // 7. Condiciones
      heading1('7. Condiciones Generales'),
      bullet('Los cambios o adiciones de funcionalidades fuera del alcance acordado serán cotizados por separado.'),
      bullet('El cliente proveerá los textos, imágenes y contenidos institucionales necesarios para el desarrollo.'),
      bullet('La propuesta tiene una validez de 30 días calendario.'),
      bullet('El dominio web queda a nombre del cliente una vez concluido el pago total.'),
      bullet('El servicio de gestión de redes sociales puede iniciarse antes, durante o después del desarrollo web.'),

      // Cierre
      heading1('8. Próximos Pasos'),
      body('Para proceder con el proyecto, se requiere:'),
      bullet('Confirmación y firma de esta propuesta'),
      bullet('Pago del 50% inicial para arrancar el desarrollo'),
      bullet('Reunión de kickoff para definir accesos, contenidos y afinación de detalles'),

      new Paragraph({ spacing: { before: 600 } }),
      new Paragraph({
        children: [new TextRun({ text: 'Quedamos atentos a sus comentarios y a resolver cualquier inquietud.', size: 24, color: '555555', italics: true })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Cordialmente,', size: 24, color: '1C2833' })],
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Equipo de Desarrollo Digital', bold: true, size: 26, color: PRIMARY })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      }),
    ],
  }],
})

Packer.toBuffer(doc).then(buffer => {
  writeFileSync('Propuesta_Comercial_ServiciosySalud.docx', buffer)
  console.log('✓ Documento generado: Propuesta_Comercial_ServiciosySalud.docx')
})
```

- [ ] **Step 2: Ejecutar el script**

```bash
node --input-type=module < scripts/generate-proposal.mjs
```

- [ ] **Step 3: Commit**

```bash
git add scripts/generate-proposal.mjs Propuesta_Comercial_ServiciosySalud.docx
git commit -m "docs: commercial proposal Word document"
```

---

### Task 14: Final Wiring & .env.local

**Files:**
- Create: `.env.local`

- [ ] **Step 1: Crear .env.local para desarrollo**

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMzUzMTk4NSwiZXhwIjoxOTI5MTA3OTg1fQ.placeholder
SUPABASE_SERVICE_ROLE_KEY=placeholder
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 2: Verificar que todo compila**

```bash
npm run build
```

Expected: Build exitoso sin errores de TypeScript.

- [ ] **Step 3: Commit final**

```bash
git add .env.local.example
git commit -m "chore: finalize env config and verify build"
```
