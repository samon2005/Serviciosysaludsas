# Servicios y Salud S.A.S — Diseño del Sistema

## Resumen

Plataforma web institucional para Servicios y Salud S.A.S., empresa colombiana de intervención psicosocial y salud pública. Incluye sitio web corporativo, dashboard protegido con visualización de datos estadísticos sobre conducta suicida a nivel departamental, y sistema de carga de datos via Excel.

## Stack Técnico

- **Frontend/Backend:** Next.js 15 (App Router, TypeScript)
- **UI:** Tailwind CSS + shadcn/ui
- **Base de datos:** Supabase (PostgreSQL 16 + Auth + Storage) en Docker
- **Gráficas:** Recharts
- **Excel:** xlsx (parsing en servidor)
- **Despliegue inicial:** Docker Compose
- **Migración a cloud:** Supabase Cloud (solo cambio de env vars)

## Arquitectura

```
Docker Compose
├── next-app          (Next.js 15, puerto 3000)
├── supabase-db       (PostgreSQL 16, puerto 5432)
├── supabase-auth     (GoTrue, puerto 9999)
├── supabase-storage  (puerto 5000)
└── supabase-studio   (puerto 54323, solo local)
```

## Identidad Visual

- **Primario:** `#1A5276` (azul institucional profundo)
- **Secundario:** `#2980B9` (azul medio/cian)
- **Fondo:** `#F4F6F9` (gris claro)
- **Texto:** `#1C2833`
- **Blanco:** `#FFFFFF`
- **Tipografía:** Inter
- **Logo:** Cruz médica azul + "SERVICIOS & SALUD S.A.S"

## Páginas del Sitio

| Ruta | Descripción |
|------|-------------|
| `/` | Home — Hero, resumen programas, CTA |
| `/quienes-somos` | Historia, misión, visión, equipo |
| `/programas` | Cards de los 4 programas |
| `/programas/[slug]` | Detalle por programa |
| `/contacto` | Formulario de contacto |
| `/login` | Login para dashboard |
| `/dashboard` | Dashboard protegido |
| `/dashboard/upload` | Subida Excel drag & drop |

## Programas

1. Salud Mental
2. Prevención de la Conducta Suicida
3. Mitigación del Consumo de SPA
4. Estrategias Sociales y Comunitarias

## Dashboard

**Acceso:** login con cuenta compartida (Supabase Auth email/password)

**Visualizaciones:**
- KPIs: total casos, departamento con más casos, variación anual
- Mapa de Colombia por intensidad de casos por departamento
- Barras: top 10 departamentos
- Línea: evolución temporal (año/mes)
- Torta: distribución por sexo
- Barras agrupadas: por grupo etario

**Filtros globales:** año, departamento, programa, tipo_evento

## Estructura del Excel

| Columna | Tipo | Valores de ejemplo |
|---------|------|-------------------|
| departamento | texto | Antioquia, Cundinamarca |
| municipio | texto | Medellín, Bogotá |
| año | número | 2022, 2023, 2024 |
| mes | número (1-12) | 1-12 |
| sexo | texto | Masculino, Femenino |
| grupo_etario | texto | 10-14, 15-29, 30-44 |
| metodo | texto | Intoxicación, Arma de fuego |
| tipo_evento | texto | Intento, Muerte |
| programa | texto | Prevención Suicida |
| casos | número | 12 |

## Esquema de Base de Datos

```sql
-- Tabla principal de eventos
create table eventos (
  id uuid primary key default gen_random_uuid(),
  departamento text not null,
  municipio text,
  año integer not null,
  mes integer,
  sexo text,
  grupo_etario text,
  metodo text,
  tipo_evento text,
  programa text,
  casos integer not null default 0,
  created_at timestamptz default now()
);

-- Tabla de uploads para auditoría
create table uploads (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  rows_imported integer,
  uploaded_at timestamptz default now()
);
```

## Middleware de Autenticación

Rutas `/dashboard` y `/dashboard/*` redirigen a `/login` si no hay sesión activa de Supabase.

## Propuesta Comercial

- **Total inicial:** $3,000,000 COP
  - Desarrollo web + dominio: $2,500,000 COP
  - Contenido redes sociales (12 posts/mes, estimado): $500,000 COP
- **Mensualidad post-entrega:** $500,000 COP/mes (contenido variable según necesidad)
- **Despliegue inicial:** Docker local
- **Entrega estimada:** 4-6 semanas

## Documento Word

Generar `Propuesta_Comercial_ServiciosySalud.docx` con:
- Presentación de la empresa contratista
- Descripción del proyecto
- Componentes incluidos
- Desglose de costos
- Cronograma estimado
- Condiciones de la mensualidad de contenido
