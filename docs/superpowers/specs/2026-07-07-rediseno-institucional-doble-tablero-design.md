# Rediseño institucional + Doble tablero — Spec de diseño

**Fecha:** 2026-07-07
**Fuente de contenido:** `Planeación Estrategica Servicios & Salud.docx` (plataforma estratégica oficial de la empresa)

## Contexto

Servicios & Salud S.A.S es una empresa de salud pública territorial (fundada 2023, Colombia) cuya prioridad principal es la **prevención del suicidio** a través de la **Línea Amiga 24/7**. Su apuesta tecnológica es la **PIPST** (Plataforma Inteligente Psicosocial Territorial): tableros de indicadores, mapas de riesgo y alertas tempranas. La web actual se ve como "landing hecha con IA"; debe verse como sitio de empresa institucional del sector salud.

## Objetivos

1. **Rediseño visual institucional** — nivel Mayo Clinic / Cleveland Clinic: sobrio, confiable, con autoridad.
2. **Línea Amiga 24/7 como protagonista** — es el servicio insignia y la prioridad de la empresa.
3. **Contenido real** — reemplazar contenido genérico con el contenido de la plataforma estratégica.
4. **Dos tableros**: Indicadores Municipales (Antioquia) y Línea 24/7.
5. **Datos de prueba** en Excel para ambos tableros, cargados en la BD local.

## 1. Sistema de diseño institucional

### Principios (de la investigación Mayo/Cleveland + skill de rediseño)

- Paleta restringida: blancos, grises fríos consistentes, **un solo azul institucional**. Los colores por programa quedan SOLO como categorías en dashboards, no en páginas de marketing.
- Tipografía con gravitas: **serif para display/títulos** + sans limpia para cuerpo.
- Mucho espacio en blanco, alto contraste, jerarquía clara.
- Eliminar patrones "IA": gradientes llamativos, 3 tarjetas idénticas por fila, marquee/ticker animado, exceso de íconos Lucide con colores variados, inline styles.
- El teléfono de la Línea 24/7 visible desde el primer segundo (navbar + hero).

### Tokens

- **Fuentes:** `Source Serif 4` (display/títulos, gravitas institucional) + `Public Sans` (cuerpo/UI — la fuente de instituciones gubernamentales US, ideal para el tono). Reemplazan Outfit/DM Sans.
- **Colores:**
  - Azul institucional primario: `#154360` (más profundo que el actual #1A5276)
  - Azul de acción/enlaces: `#1F618D`
  - Tinta (texto): `#17202A`
  - Grises fríos: escala consistente (slate) — sin mezclar grises cálidos
  - Fondo claro: `#FAFBFC`; fondo oscuro institucional: `#0E2433`
  - Acento de emergencia (solo Línea 24/7): un coral/rojo sobrio `#C0392B` usado con moderación
- Definir todo como variables CSS en `globals.css` (@theme de Tailwind v4). Eliminar los inline styles `style={{color: '#...'}}` repartidos por el código.

### Componentes

- Botones con estados hover/active/focus reales (200ms transitions).
- Cards sin el patrón genérico borde+sombra+blanco: usar solo fondo o solo espaciado.
- Navbar: barra superior delgada con teléfono Línea 24/7 + navbar principal. Activo visible.
- Footer institucional: NIT, datos de contacto, enlaces legales (política de privacidad, tratamiento de datos — obligatorio en Colombia por Habeas Data), alineación normativa.

## 2. Páginas públicas

### Home

1. **Hero**: mensaje centrado en prevención del suicidio con autoridad y sobriedad. Banda superior o elemento fijo con la Línea 24/7 ("¿Necesitas ayuda ahora? Línea Amiga 24/7 disponible"). CTA primario → página Línea 24/7; secundario → programas. Sin marquee: reemplazar por una banda de cifras estática institucional (4 líneas de intervención, 32 municipios objetivo en Antioquia, PDSP 2022-2031, atención 24/7).
2. **Línea Amiga 24/7 destacada**: sección propia inmediatamente después del hero — qué es, cómo funciona (atención inmediata → escucha activa → activación Ruta de Crisis → registro para alertas tempranas).
3. **Servicios estratégicos** (5, del documento): Línea Amiga 24/7, Proyecto de Vida (SPA), Centros de Escucha, PIPST, CTP + jornadas de bienestar/apoyo PIC como "otras actividades". Layout asimétrico (no 3 tarjetas iguales); la Línea 24/7 con jerarquía mayor.
4. **Misión / Visión** (texto real del documento; visión 2028: líder nacional en inteligencia psicosocial territorial).
5. **Alineación normativa**: PDSP 2022-2031, Ley 1616 de 2013, Política Nacional de Salud Mental 2018. Presentación sobria tipo credenciales institucionales.
6. **Valores y fortalezas** (resumen, sin listas infladas).

### Página Línea 24/7 (nueva o programa destacado)

Contenido del documento: objetivo (reducir conductas autolesivas y suicidios consumados), actividades (atención telefónica/virtual permanente, escucha activa y canalización, activación de la Ruta de Atención en Crisis Suicida, registro estandarizado para alertas tempranas).

### Programas

Actualizar `programas-data.ts` con los 5 servicios reales y sus objetivos/actividades del documento.

### Quiénes somos

Reseña histórica real (fundada 2023, proyectos liderados, reconocimiento nacional del director), misión, visión, valores, política de calidad.

## 3. Tablero "Indicadores Municipales — Antioquia"

El dashboard actual se convierte a nivel municipal de Antioquia:

- Filtro `departamento` → filtro `municipio` (municipios de Antioquia).
- KPI "Departamento con más casos" → "Municipio con más casos".
- `DepartamentoChart` → `MunicipioChart` (top municipios por casos).
- La tabla `eventos` no cambia de estructura (ya tiene columna `municipio`); cambia qué dimensión se usa en API, filtros y gráficas.
- Plantilla Excel actualizada (columna departamento puede quedar fija "Antioquia" o eliminarse de la plantilla).

## 4. Tablero "Línea 24/7" (nuevo)

### Esquema

```sql
create table atenciones_linea (
  id uuid primary key default gen_random_uuid(),
  fecha date not null,
  hora time,
  canal text not null,               -- 'Telefónico' | 'Virtual'
  sexo text,
  grupo_etario text,
  municipio text,
  motivo text,                       -- 'Ideación suicida', 'Crisis emocional', 'Consumo SPA', 'Violencia', 'Duelo', 'Otro'
  nivel_riesgo text,                 -- 'Bajo' | 'Medio' | 'Alto'
  ruta_activada boolean default false,
  canalizado_a text,                 -- 'Hospital', 'EPS', 'Secretaría de Salud', 'Policía', 'No requirió', ...
  estado_seguimiento text,           -- 'En seguimiento' | 'Cerrado' | 'Sin contacto'
  upload_id uuid references uploads_linea(id) on delete cascade,
  created_at timestamptz default now()
);

create table uploads_linea (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  rows_imported integer default 0,
  uploaded_at timestamptz default now()
);
```

### KPIs

Total atenciones · % riesgo alto · Rutas de crisis activadas · Canalizaciones efectivas.

### Gráficas

Atenciones por mes (línea) · por canal (dona) · por nivel de riesgo (barras apiladas o dona) · top municipios (barras) · por motivo (barras horizontales) · demografía sexo/grupo etario.

### Funcionalidad heredada del tablero actual

Filtros (año, municipio, nivel de riesgo, canal) · carga Excel con plantilla propia · gestión de datos (borrar todo/filtro/lote, historial) · exportar Excel/PDF · contador de registros y última carga.

### Navegación entre tableros

Switcher en el layout del dashboard (tabs superiores): "Indicadores Municipales" | "Línea 24/7". Rutas: `/dashboard` (municipal) y `/dashboard/linea` (24/7). Upload por tablero: `/dashboard/upload` y `/dashboard/linea/upload`.

## 5. Datos de prueba

- `public/samples/eventos-municipios-antioquia.xlsx`: ~500 filas. Municipios reales de Antioquia (Medellín, Bello, Itagüí, Envigado, Apartadó, Rionegro, Turbo, Caucasia, etc.), años 2022-2025, distribuciones realistas no uniformes (Medellín concentra más casos), números orgánicos.
- `public/samples/atenciones-linea-24-7.xlsx`: ~800 filas. Fechas 2024-2025, más atenciones nocturnas y en fechas sensibles, ~15% riesgo alto, rutas activadas correlacionadas con riesgo alto.
- Script generador en `scripts/generate-sample-data.mjs` (usa `xlsx` ya instalado).
- Cargar ambos a la BD local vía las APIs o SQL directo para que los tableros muestren información.

## Fuera de alcance

- Mapas de riesgo territorial (fase futura PIPST).
- Alertas automatizadas.
- Registro manual de atenciones en formulario web.
- Supabase cloud (sigue pendiente de credenciales del cliente).

## Criterios de aceptación

1. La web no contiene los patrones genéricos del audit de rediseño (fuentes por defecto, 3 tarjetas iguales, ticker, inline styles de color, un solo peso tipográfico).
2. La Línea 24/7 es visible en navbar, hero y tiene su propia sección/página.
3. El contenido corresponde al documento estratégico (no texto inventado genérico).
4. `/dashboard` filtra y grafica por municipios de Antioquia.
5. `/dashboard/linea` muestra KPIs y gráficas de la Línea 24/7 con carga Excel propia.
6. Ambos tableros tienen datos de prueba visibles en local.
7. `npm run build` pasa sin errores.
