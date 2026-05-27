const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageBreak, Header, Footer, PageNumber
} = require('docx')
const fs = require('fs')

const PRIMARY = '1A5276'
const PRIMARY_LIGHT = '2980B9'
const LIGHT_BG = 'EBF5FB'
const MEDIUM_BG = 'D5E8F0'
const WHITE = 'FFFFFF'

const border = { style: BorderStyle.SINGLE, size: 1, color: 'D0D7DE' }
const borders = { top: border, bottom: border, left: border, right: border }
const cellMargins = { top: 100, bottom: 100, left: 160, right: 160 }

// Content width: A4 (11906 DXA) - 2 * 1134 (margin) = 9638 DXA
const CONTENT_WIDTH = 9638

function h1(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 32, color: PRIMARY, font: 'Arial' })],
    spacing: { before: 480, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: PRIMARY_LIGHT, space: 1 } },
  })
}

function h2(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 26, color: PRIMARY, font: 'Arial' })],
    spacing: { before: 320, after: 140 },
  })
}

function body(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, color: '1C2833', font: 'Arial' })],
    spacing: { after: 120 },
    alignment: AlignmentType.JUSTIFIED,
  })
}

function note(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 20, color: '555555', italics: true, font: 'Arial' })],
    spacing: { after: 120 },
    alignment: AlignmentType.JUSTIFIED,
  })
}

function space(pts = 200) {
  return new Paragraph({ children: [], spacing: { after: pts } })
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  styles: {
    default: { document: { run: { font: 'Arial', size: 22, color: '1C2833' } } },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
      },
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: 'SERVICIOS Y SALUD S.A.S.', bold: true, size: 18, color: WHITE, font: 'Arial' }),
              new TextRun({ text: '\t\tPROPUESTA COMERCIAL', size: 18, color: 'B0C8E0', font: 'Arial' }),
            ],
            tabStops: [{ type: 'right', position: 9638 }],
            shading: { fill: PRIMARY, type: ShadingType.CLEAR },
            spacing: { before: 80, after: 80 },
            indent: { left: 160, right: 160 },
          }),
        ],
      }),
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: 'Servicios y Salud S.A.S. · Colombia  ', size: 16, color: '888888', font: 'Arial' }),
              new TextRun({ text: '\tPágina ', size: 16, color: '888888', font: 'Arial' }),
              new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '888888', font: 'Arial' }),
            ],
            tabStops: [{ type: 'right', position: 9638 }],
            border: { top: { style: BorderStyle.SINGLE, size: 2, color: 'D0D7DE', space: 1 } },
            spacing: { before: 80 },
          }),
        ],
      }),
    },
    children: [
      // ────────────────── PORTADA ──────────────────
      space(2000),

      new Paragraph({
        children: [new TextRun({ text: 'SERVICIOS Y SALUD S.A.S.', bold: true, size: 64, color: PRIMARY, font: 'Arial' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),

      new Paragraph({
        children: [new TextRun({ text: 'PROPUESTA COMERCIAL', bold: true, size: 44, color: PRIMARY_LIGHT, font: 'Arial' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      }),

      new Paragraph({
        children: [new TextRun({
          text: 'Desarrollo de Plataforma Web Institucional y Gestión de Redes Sociales',
          size: 26, color: '555555', italics: true, font: 'Arial',
        })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),

      space(200),

      // Divider
      new Paragraph({
        children: [],
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: PRIMARY_LIGHT, space: 1 } },
        spacing: { after: 200 },
      }),

      new Paragraph({
        children: [new TextRun({ text: 'Fecha: Mayo 2026', size: 22, color: '888888', font: 'Arial' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),

      // Info box
      new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [CONTENT_WIDTH],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders,
                width: { size: CONTENT_WIDTH, type: WidthType.DXA },
                shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
                margins: { top: 180, bottom: 180, left: 360, right: 360 },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: 'Preparado para:', size: 20, color: '888888', font: 'Arial' })],
                    spacing: { after: 60 },
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: 'Servicios y Salud S.A.S.', bold: true, size: 28, color: PRIMARY, font: 'Arial' })],
                    spacing: { after: 80 },
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: '@serviciosysaludsas · Colombia', size: 20, color: '666666', font: 'Arial' })],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),

      space(2000),
      new Paragraph({ children: [new PageBreak()] }),

      // ────────────────── 1. PRESENTACIÓN ──────────────────
      h1('1. Presentación'),

      body('Nos complace presentar esta propuesta comercial en respuesta a la solicitud de Servicios y Salud S.A.S. para el desarrollo de su plataforma web institucional y el fortalecimiento de su ecosistema digital corporativo.'),

      body('El equipo de desarrollo propone una solución integral, moderna y escalable que contempla todos los componentes solicitados, con tecnologías de última generación y un diseño profesional acorde con la identidad corporativa de la organización.'),

      body('Esta propuesta incluye el desarrollo completo del sitio web, la implementación de un sistema de visualización de datos estadísticos en salud mental y conducta suicida, y el servicio de gestión estratégica de redes sociales.'),

      // ────────────────── 2. DESCRIPCIÓN ──────────────────
      h1('2. Descripción del Proyecto'),

      body('El proyecto contempla el desarrollo de una plataforma web completa para Servicios y Salud S.A.S., organización dedicada a la salud mental, prevención de la conducta suicida, mitigación del consumo de sustancias psicoactivas y estrategias sociales y comunitarias a nivel nacional.'),

      h2('2.1 Objetivo General'),

      body('Diseñar, desarrollar e implementar una plataforma web institucional moderna, funcional y escalable que posicione digitalmente a Servicios y Salud S.A.S. y facilite la gestión y visualización de información estadística sobre conducta suicida a nivel departamental en Colombia.'),

      h2('2.2 Objetivos Específicos'),

      ...[
        'Crear un sitio web corporativo con diseño profesional, adaptable a dispositivos móviles.',
        'Desarrollar espacios informativos sobre los cuatro programas de intervención de la organización.',
        'Implementar un sistema de almacenamiento y organización de datos sobre conducta suicida.',
        'Desarrollar un tablero visual (dashboard) con estadísticas por departamento.',
        'Garantizar la escalabilidad del sistema para integrar nuevas herramientas en el futuro.',
      ].map(text => new Paragraph({
        numbering: { reference: 'bullets', level: 0 },
        children: [new TextRun({ text, size: 22, color: '1C2833', font: 'Arial' })],
        spacing: { after: 80 },
      })),

      space(100),

      // ────────────────── 3. COMPONENTES ──────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('3. Componentes del Proyecto'),

      h2('3.1 Sitio Web Corporativo'),

      ...[
        'Diseño moderno, institucional y completamente adaptable a dispositivos móviles (responsive design).',
        'Página de inicio con presentación institucional y programas de intervención.',
        'Sección "Quiénes Somos": historia, misión, visión y valores corporativos.',
        'Sección de Programas: Salud Mental, Prevención Suicida, Mitigación SPA y Social/Comunitario.',
        'Página de Contacto con formulario de solicitud de información.',
        'Dominio web incluido en el precio de desarrollo.',
        'Optimización básica para motores de búsqueda (SEO).',
      ].map(text => new Paragraph({
        numbering: { reference: 'bullets', level: 0 },
        children: [new TextRun({ text, size: 22, color: '1C2833', font: 'Arial' })],
        spacing: { after: 80 },
      })),

      space(100),
      h2('3.2 Dashboard de Indicadores (Acceso Restringido)'),

      body('Panel de control protegido con autenticación para el equipo interno de Servicios y Salud S.A.S.'),

      ...[
        'Acceso protegido mediante usuario y contraseña.',
        'Carga de datos mediante archivos Excel (.xlsx) con interfaz de arrastrar y soltar (drag & drop).',
        'Visualización de indicadores: mapa de casos por departamento, gráficas de barras, líneas de tendencia temporal, distribución por sexo y grupo etario.',
        'Filtros interactivos por año, departamento, programa y tipo de evento.',
        'Tarjetas de indicadores clave (KPIs): total de casos, departamento con mayor incidencia, variación anual.',
      ].map(text => new Paragraph({
        numbering: { reference: 'bullets', level: 0 },
        children: [new TextRun({ text, size: 22, color: '1C2833', font: 'Arial' })],
        spacing: { after: 80 },
      })),

      space(100),
      h2('3.3 Infraestructura y Base de Datos'),

      ...[
        'Base de datos PostgreSQL gestionada con Supabase, desplegada inicialmente en Docker (servidor local o dedicado).',
        'Arquitectura preparada para migración a la nube sin cambios de código.',
        'Docker Compose para facilidad de instalación y mantenimiento.',
        'Dominio web registrado a nombre del cliente.',
      ].map(text => new Paragraph({
        numbering: { reference: 'bullets', level: 0 },
        children: [new TextRun({ text, size: 22, color: '1C2833', font: 'Arial' })],
        spacing: { after: 80 },
      })),

      space(100),
      h2('3.4 Gestión de Redes Sociales — Instagram Corporativo'),

      body('Como componente complementario e independiente al desarrollo web, se ofrece el servicio de gestión estratégica del Instagram corporativo (@serviciosysaludsas):'),

      ...[
        'Definición y aplicación de línea gráfica coherente con la identidad institucional.',
        'Optimización del perfil: descripción, highlights y foto de perfil.',
        'Producción de contenidos digitales mensuales (publicaciones, carruseles, reels o stories).',
        'Acompañamiento en posicionamiento y crecimiento orgánico del perfil.',
      ].map(text => new Paragraph({
        numbering: { reference: 'bullets', level: 0 },
        children: [new TextRun({ text, size: 22, color: '1C2833', font: 'Arial' })],
        spacing: { after: 80 },
      })),

      space(100),
      note('Nota importante: El servicio de gestión de redes sociales se cotiza de manera separada al desarrollo web. El número de piezas, formato (imágenes, videos, reels) y alcance puede variar según las necesidades del cliente, por lo que el valor indicado en esta propuesta corresponde a un estimado base sujeto a ajuste previo acuerdo.'),

      // ────────────────── 4. COSTOS ──────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('4. Desglose de Costos'),

      space(100),

      new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [Math.round(CONTENT_WIDTH * 0.62), Math.round(CONTENT_WIDTH * 0.38)],
        rows: [
          // Header
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.62), type: WidthType.DXA },
                shading: { fill: PRIMARY, type: ShadingType.CLEAR },
                children: [new Paragraph({
                  children: [new TextRun({ text: 'Componente', bold: true, size: 22, color: WHITE, font: 'Arial' })],
                })],
              }),
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.38), type: WidthType.DXA },
                shading: { fill: PRIMARY, type: ShadingType.CLEAR },
                children: [new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: 'Valor', bold: true, size: 22, color: WHITE, font: 'Arial' })],
                })],
              }),
            ],
          }),
          // Row 1
          new TableRow({
            children: [
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.62), type: WidthType.DXA },
                shading: { fill: WHITE, type: ShadingType.CLEAR },
                children: [new Paragraph({
                  children: [new TextRun({ text: 'Desarrollo web completo + dominio (pago único)', size: 22, color: '1C2833', font: 'Arial' })],
                })],
              }),
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.38), type: WidthType.DXA },
                shading: { fill: WHITE, type: ShadingType.CLEAR },
                children: [new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: '$2.500.000 COP', size: 22, color: '1C2833', font: 'Arial' })],
                })],
              }),
            ],
          }),
          // Row 2
          new TableRow({
            children: [
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.62), type: WidthType.DXA },
                shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: 'Gestión de redes sociales — estimado base mensual', size: 22, color: '1C2833', font: 'Arial' })],
                    spacing: { after: 40 },
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: '(~12 publicaciones/mes — sujeto a ajuste según necesidad)', size: 18, italics: true, color: '666666', font: 'Arial' })],
                  }),
                ],
              }),
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.38), type: WidthType.DXA },
                shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
                children: [new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: '$500.000 COP/mes', size: 22, color: '1C2833', font: 'Arial' })],
                })],
              }),
            ],
          }),
          // Total
          new TableRow({
            children: [
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.62), type: WidthType.DXA },
                shading: { fill: PRIMARY, type: ShadingType.CLEAR },
                children: [new Paragraph({
                  children: [new TextRun({ text: 'TOTAL INVERSIÓN INICIAL', bold: true, size: 24, color: WHITE, font: 'Arial' })],
                })],
              }),
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.38), type: WidthType.DXA },
                shading: { fill: PRIMARY, type: ShadingType.CLEAR },
                children: [new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: '$3.000.000 COP', bold: true, size: 24, color: WHITE, font: 'Arial' })],
                })],
              }),
            ],
          }),
        ],
      }),

      space(200),

      note('* El valor de gestión de redes corresponde a un estimado base para aproximadamente 12 publicaciones mensuales. El precio final se ajusta según el volumen de piezas, formato del contenido y alcance acordado. Esta cifra puede variar (más o menos publicaciones, solo videos, etc.).'),

      space(100),
      h2('4.1 Modalidad de Pago — Desarrollo Web'),

      new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [Math.round(CONTENT_WIDTH * 0.6), Math.round(CONTENT_WIDTH * 0.4)],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.6), type: WidthType.DXA },
                shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: 'Primer pago — al inicio del proyecto', size: 22, font: 'Arial' })] })],
              }),
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.4), type: WidthType.DXA },
                shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: '$1.500.000 COP (50%)', size: 22, font: 'Arial' })] })],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.6), type: WidthType.DXA },
                shading: { fill: WHITE, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: 'Segundo pago — al finalizar y entregar el proyecto', size: 22, font: 'Arial' })] })],
              }),
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.4), type: WidthType.DXA },
                shading: { fill: WHITE, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: '$1.500.000 COP (50%)', size: 22, font: 'Arial' })] })],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.6), type: WidthType.DXA },
                shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: 'Servicio mensual de redes sociales (post-entrega)', size: 22, font: 'Arial' })] })],
              }),
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.4), type: WidthType.DXA },
                shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: '$500.000 COP/mes (est.)', size: 22, font: 'Arial' })] })],
              }),
            ],
          }),
        ],
      }),

      // ────────────────── 5. CRONOGRAMA ──────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('5. Cronograma Estimado de Desarrollo'),

      space(80),

      new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [Math.round(CONTENT_WIDTH * 0.65), Math.round(CONTENT_WIDTH * 0.35)],
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.65), type: WidthType.DXA },
                shading: { fill: PRIMARY, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: 'Fase', bold: true, size: 22, color: WHITE, font: 'Arial' })] })],
              }),
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.35), type: WidthType.DXA },
                shading: { fill: PRIMARY, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Duración estimada', bold: true, size: 22, color: WHITE, font: 'Arial' })] })],
              }),
            ],
          }),
          ...([
            ['Semana 1-2: Diseño de identidad visual y arquitectura del sitio', '2 semanas'],
            ['Semana 2-3: Desarrollo de páginas informativas (Home, Quiénes Somos, Programas, Contacto)', '2 semanas'],
            ['Semana 3-4: Desarrollo del dashboard y sistema de carga de Excel', '2 semanas'],
            ['Semana 4-5: Integración con base de datos, pruebas y ajustes', '1-2 semanas'],
            ['Semana 5-6: Despliegue, configuración del dominio y entrega final', '1 semana'],
          ].map(([fase, dur], i) => new TableRow({
            children: [
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.65), type: WidthType.DXA },
                shading: { fill: i % 2 === 0 ? WHITE : LIGHT_BG, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: fase, size: 22, color: '1C2833', font: 'Arial' })] })],
              }),
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.35), type: WidthType.DXA },
                shading: { fill: i % 2 === 0 ? WHITE : LIGHT_BG, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: dur, size: 22, color: '1C2833', font: 'Arial' })] })],
              }),
            ],
          }))),
          new TableRow({
            children: [
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.65), type: WidthType.DXA },
                shading: { fill: MEDIUM_BG, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: 'TOTAL', bold: true, size: 22, color: PRIMARY, font: 'Arial' })] })],
              }),
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.35), type: WidthType.DXA },
                shading: { fill: MEDIUM_BG, type: ShadingType.CLEAR },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '4 a 6 semanas', bold: true, size: 22, color: PRIMARY, font: 'Arial' })] })],
              }),
            ],
          }),
        ],
      }),

      // ────────────────── 6. ESCALABILIDAD ──────────────────
      h1('6. Escalabilidad Futura'),

      body('La plataforma se construye sobre una arquitectura modular y desacoplada que permite incorporar nuevas funcionalidades sin necesidad de reescribir el sistema existente:'),

      ...[
        'Migración de la base de datos de Docker local a Supabase Cloud con un solo cambio de configuración, sin modificaciones de código.',
        'Módulo de gestión de noticias y blog institucional.',
        'Módulo de diplomados y formación virtual.',
        'Integración con sistemas de información en salud pública (SIVIGILA, RIPS, etc.).',
        'Generación automática de reportes en PDF por departamento o período.',
        'Aplicación móvil complementaria en el futuro.',
      ].map(text => new Paragraph({
        numbering: { reference: 'bullets', level: 0 },
        children: [new TextRun({ text, size: 22, color: '1C2833', font: 'Arial' })],
        spacing: { after: 80 },
      })),

      space(100),

      // ────────────────── 7. STACK TECNOLÓGICO ──────────────────
      h1('7. Stack Tecnológico'),

      new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [Math.round(CONTENT_WIDTH * 0.35), Math.round(CONTENT_WIDTH * 0.65)],
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.35), type: WidthType.DXA },
                shading: { fill: PRIMARY, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: 'Capa', bold: true, size: 22, color: WHITE, font: 'Arial' })] })],
              }),
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.65), type: WidthType.DXA },
                shading: { fill: PRIMARY, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: 'Tecnología', bold: true, size: 22, color: WHITE, font: 'Arial' })] })],
              }),
            ],
          }),
          ...([
            ['Frontend / Backend', 'Next.js 15 (App Router) + TypeScript'],
            ['Diseño UI', 'Tailwind CSS + shadcn/ui'],
            ['Base de datos', 'PostgreSQL 16 vía Supabase'],
            ['Autenticación', 'Supabase Auth'],
            ['Gráficas', 'Recharts'],
            ['Procesamiento Excel', 'xlsx (server-side)'],
            ['Despliegue inicial', 'Docker Compose'],
            ['Migración a la nube', 'Supabase Cloud (listo para migrar)'],
          ].map(([capa, tec], i) => new TableRow({
            children: [
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.35), type: WidthType.DXA },
                shading: { fill: i % 2 === 0 ? WHITE : LIGHT_BG, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: capa, bold: true, size: 22, color: PRIMARY, font: 'Arial' })] })],
              }),
              new TableCell({
                borders, margins: cellMargins,
                width: { size: Math.round(CONTENT_WIDTH * 0.65), type: WidthType.DXA },
                shading: { fill: i % 2 === 0 ? WHITE : LIGHT_BG, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: tec, size: 22, color: '1C2833', font: 'Arial' })] })],
              }),
            ],
          }))),
        ],
      }),

      // ────────────────── 8. CONDICIONES ──────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1('8. Condiciones Generales'),

      ...[
        'Los cambios o adiciones de funcionalidades fuera del alcance acordado serán cotizados por separado antes de ser ejecutados.',
        'El cliente proveerá los textos institucionales, fotografías y cualquier otro contenido necesario para el desarrollo del sitio.',
        'Esta propuesta tiene una validez de 30 días calendario a partir de su fecha de emisión.',
        'El dominio web queda registrado a nombre del cliente una vez concluido el pago total del desarrollo.',
        'El servicio de gestión de redes sociales puede iniciarse antes, durante o después del desarrollo web, de manera independiente.',
        'Los precios están expresados en pesos colombianos (COP) y no incluyen IVA.',
      ].map(text => new Paragraph({
        numbering: { reference: 'bullets', level: 0 },
        children: [new TextRun({ text, size: 22, color: '1C2833', font: 'Arial' })],
        spacing: { after: 80 },
      })),

      space(100),

      // ────────────────── 9. PRÓXIMOS PASOS ──────────────────
      h1('9. Próximos Pasos'),

      body('Para dar inicio al proyecto, se requiere:'),

      ...[
        'Confirmación y aprobación de esta propuesta por parte del cliente.',
        'Pago del 50% inicial para arrancar el desarrollo ($1.500.000 COP).',
        'Reunión de kickoff para definir accesos, contenidos y afinación de detalles específicos.',
        'Envío de logo en alta resolución, textos institucionales y cualquier recurso gráfico disponible.',
      ].map(text => new Paragraph({
        numbering: { reference: 'bullets', level: 0 },
        children: [new TextRun({ text, size: 22, color: '1C2833', font: 'Arial' })],
        spacing: { after: 80 },
      })),

      space(500),

      // ────────────────── CIERRE ──────────────────
      new Paragraph({
        children: [],
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: PRIMARY_LIGHT, space: 1 } },
        spacing: { after: 300 },
      }),

      new Paragraph({
        children: [new TextRun({
          text: 'Quedamos atentos a sus comentarios y a resolver cualquier inquietud que pueda surgir.',
          size: 24, italics: true, color: '555555', font: 'Arial',
        })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      }),

      new Paragraph({
        children: [new TextRun({ text: 'Cordialmente,', size: 22, color: '1C2833', font: 'Arial' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      }),

      new Paragraph({
        children: [new TextRun({ text: 'Equipo de Desarrollo Digital', bold: true, size: 28, color: PRIMARY, font: 'Arial' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
      }),

      new Paragraph({
        children: [new TextRun({ text: 'Mayo 2026', size: 20, color: '888888', font: 'Arial' })],
        alignment: AlignmentType.CENTER,
      }),
    ],
  }],
})

Packer.toBuffer(doc).then(buffer => {
  const outPath = 'Propuesta_Comercial_ServiciosySalud.docx'
  fs.writeFileSync(outPath, buffer)
  console.log(`✓ Documento generado: ${outPath}`)
})
