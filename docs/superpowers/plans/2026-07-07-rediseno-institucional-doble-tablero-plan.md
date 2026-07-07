# Plan de implementación — Rediseño institucional + Doble tablero

**Spec:** `docs/superpowers/specs/2026-07-07-rediseno-institucional-doble-tablero-design.md` (leerla es obligatorio para cada tarea)
**Proyecto:** Next.js 16 App Router + Tailwind v4 + Supabase local + shadcn/Base UI. Leer `AGENTS.md` (Next.js tiene breaking changes; consultar `node_modules/next/dist/docs/` antes de escribir código Next).
**Regla global:** cada tarea termina con `npx tsc --noEmit` limpio. No commitear (el orquestador commitea por fase).

---

## Fase 1 — Fundación (secuencial)

### Tarea 1.1 — Sistema de diseño: tokens, fuentes y limpieza

**Archivos:** `src/app/globals.css`, `src/app/layout.tsx`

- Cambiar fuentes en `layout.tsx`: `Source_Serif_4` (variable `--font-heading`) y `Public_Sans` (variable `--font-sans`) desde `next/font/google`. Eliminar Outfit y DM_Sans.
- En `globals.css` definir tokens institucionales bajo `@theme`: `--color-brand: #154360`, `--color-brand-action: #1F618D`, `--color-ink: #17202A`, `--color-surface: #FAFBFC`, `--color-surface-dark: #0E2433`, `--color-emergency: #C0392B`, escala slate para grises.
- Botones/enlaces globales: transiciones 200ms, focus-visible ring.
- No tocar componentes todavía (eso es Fase 2), pero dejar los tokens listos para que las demás tareas los usen con clases Tailwind (`text-brand`, `bg-surface-dark`, etc.).

### Tarea 1.2 — Migración BD: tablas Línea 24/7

**Archivos:** `supabase/migrations/003_linea_24_7.sql`, `src/lib/types.ts`

- Crear `uploads_linea` y `atenciones_linea` según el esquema del spec (sección 4).
- Índices: fecha, municipio, nivel_riesgo, upload_id.
- Aplicar con `supabase migration up`.
- Agregar a `types.ts`: `AtencionLinea`, `LineaKPIData` (total_atenciones, pct_riesgo_alto, rutas_activadas, canalizaciones), `LineaFilters` (año, municipio, nivel_riesgo, canal).

---

## Fase 2 — Páginas públicas (tras Fase 1; tareas paralelizables, archivos disjuntos)

### Tarea 2.1 — Navbar y Footer institucionales

**Archivos:** `src/components/navbar.tsx`, `src/components/footer.tsx`

- Navbar: banda superior delgada fondo `surface-dark` con "Línea Amiga 24/7 — Atención inmediata en crisis" y teléfono placeholder `(604) 444 24 24`; navbar principal blanca con logo, enlaces (Inicio, Quiénes Somos, Programas, Línea 24/7, Contacto), estado activo visible (usePathname), CTA "Dashboard".
- Footer: NIT placeholder, contacto, enlaces legales (Política de privacidad, Tratamiento de datos personales — Habeas Data), alineación normativa (PDSP 2022-2031 · Ley 1616 de 2013 · Política Nacional de Salud Mental 2018). Sin link-farm de 4 columnas.
- Usar tokens del tema; cero inline styles de color.

### Tarea 2.2 — Hero y Home institucional

**Archivos:** `src/components/hero.tsx`, `src/app/page.tsx`, `src/components/programs-overview.tsx`, eliminar el marquee de `globals.css` si queda huérfano

- Hero sobrio: fondo `surface-dark` o claro con serif display; mensaje centrado en prevención del suicidio con autoridad ("Prevención del suicidio e inteligencia psicosocial territorial" o similar del spec); CTA primario → `/programas/linea-24-7`, secundario → `/programas`. **Eliminar el ticker/marquee** y reemplazar por banda de cifras estática (4 líneas de intervención · PDSP 2022-2031 · atención 24/7 · Antioquia).
- Home según spec sección 2: sección Línea 24/7 destacada tras el hero (los 4 pasos: atención inmediata → escucha activa → activación Ruta de Crisis → registro/alertas), servicios con layout asimétrico (Línea 24/7 jerarquía mayor), misión/visión reales, banda normativa, valores resumidos.
- Responsive completo (mobile primero en verificar).

### Tarea 2.3 — Contenido de programas + página Quiénes Somos

**Archivos:** `src/lib/programas-data.ts`, `src/app/programas/page.tsx`, `src/app/programas/[slug]/page.tsx`, `src/app/quienes-somos/page.tsx`

- Reescribir `programas-data.ts` con los 5 servicios reales del spec (slug `linea-24-7` incluido, con el contenido más completo). Objetivos y actividades textuales del documento estratégico (están en el spec).
- Quiénes somos: reseña histórica real (2023, proyectos, reconocimiento del director), misión, visión 2028, valores, política de calidad.
- `generateStaticParams` debe reflejar los nuevos slugs.

---

## Fase 3 — Tableros (tras Fase 1; 3.1 antes que 3.2 por archivos compartidos)

### Tarea 3.1 — Tablero municipal Antioquia + switcher

**Archivos:** `src/app/dashboard/layout.tsx`, `src/app/dashboard/page.tsx`, `src/components/dashboard/filters.tsx`, `src/components/dashboard/kpi-cards.tsx`, nuevo `src/components/dashboard/municipio-chart.tsx` (reemplaza `departamento-chart.tsx`), `src/app/api/dashboard/stats/route.ts`, `src/app/dashboard/upload/page.tsx`

- Switcher de tableros en el layout del dashboard: tabs "Indicadores Municipales" (`/dashboard`) y "Línea 24/7" (`/dashboard/linea`).
- Filtro departamento → municipio (lista de municipios de Antioquia: Medellín, Bello, Itagüí, Envigado, Apartadó, Rionegro, Turbo, Caucasia, Sabaneta, La Estrella, Copacabana, Girardota, Barbosa, Caldas, Marinilla, La Ceja, Guarne, Carmen de Viboral, Santa Fe de Antioquia, Urrao).
- KPI y gráfica principal por municipio. API `stats` filtra por `municipio` en vez de `departamento`.
- Título del tablero: "Indicadores Municipales — Antioquia".
- Plantilla de columnas esperadas en upload sin `departamento`.
- Mantener intactas: gestión de datos, exportación, contador (ya funcionan).

### Tarea 3.2 — Tablero Línea 24/7 completo

**Archivos nuevos:** `src/app/dashboard/linea/page.tsx`, `src/app/dashboard/linea/upload/page.tsx`, `src/app/api/linea/stats/route.ts`, `src/app/api/linea/upload/route.ts`, `src/app/api/linea/uploads/route.ts`, `src/app/api/linea/uploads/[id]/route.ts`, `src/app/api/linea/data/route.ts`, `src/app/api/linea/export/route.ts`, `src/components/dashboard/linea/*` (kpis, charts, filters)

- Réplica del patrón del tablero municipal sobre `atenciones_linea` (leer los archivos del tablero actual como referencia de patrón).
- KPIs: Total atenciones · % riesgo alto · Rutas de crisis activadas · Canalizaciones efectivas.
- Gráficas (recharts, ya instalado): atenciones/mes (línea), canal (dona), nivel de riesgo (dona con colores semánticos: Alto=emergency, Medio=ámbar sobrio, Bajo=brand), top municipios (barras), motivo (barras horizontales), sexo/grupo etario.
- Filtros: año, municipio, nivel de riesgo, canal.
- Upload con parser propio (columnas: fecha, hora, canal, sexo, grupo_etario, municipio, motivo, nivel_riesgo, ruta_activada, canalizado_a, estado_seguimiento) y gestión de datos/exportación equivalentes a las del tablero municipal.

---

## Fase 4 — Datos de prueba y verificación (tras Fase 3)

### Tarea 4.1 — Generador de Excel + seed local

**Archivos:** `scripts/generate-sample-data.mjs`, `public/samples/eventos-municipios-antioquia.xlsx`, `public/samples/atenciones-linea-24-7.xlsx`

- Script Node con `xlsx`: genera ambos archivos según spec sección 5 (distribuciones realistas, no uniformes; números orgánicos; riesgo alto ~15% correlacionado con ruta_activada).
- Insertar los datos en la BD local (vía `@supabase/supabase-js` con la service key local de `.env.local`, registrando lotes en `uploads`/`uploads_linea`).
- Actualizar los links de plantilla en ambas páginas de upload.

### Tarea 4.2 — Verificación integral

- `npm run build` limpio.
- Levantar dev server y verificar con browser tools: home institucional (desktop y móvil), navbar/footer, página Línea 24/7, `/dashboard` con datos municipales, `/dashboard/linea` con datos de la línea, carga de una plantilla, exportación.
- Checklist del audit de rediseño: sin inline color styles en páginas públicas, sin ticker, tipografía serif en títulos, un solo azul en marketing.
- Reportar con capturas.
