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
    longDescription:
      'Desarrollamos estrategias integrales de intervención psicosocial orientadas al fortalecimiento de la salud mental en comunidades, instituciones educativas y empresas a nivel nacional. Nuestro equipo multidisciplinario trabaja en la identificación temprana de factores de riesgo y la promoción del bienestar emocional.',
    icon: 'brain',
    color: '#2980B9',
    objetivos: [
      'Diagnóstico de necesidades en salud mental comunitaria',
      'Diseño de rutas de atención psicosocial',
      'Formación a profesionales y cuidadores',
      'Acompañamiento a instituciones educativas y empresariales',
    ],
    poblacion:
      'Comunidades, instituciones educativas, empresas y entidades del sector salud.',
  },
  {
    slug: 'prevencion-suicida',
    title: 'Prevención de la Conducta Suicida',
    description:
      'Programas especializados en la prevención, detección temprana y posvención del suicidio.',
    longDescription:
      'Implementamos programas especializados basados en evidencia para la prevención de la conducta suicida. Trabajamos con equipos de salud, instituciones educativas y familias para desarrollar competencias en detección temprana, intervención en crisis y posvención.',
    icon: 'heart',
    color: '#1A5276',
    objetivos: [
      'Detección temprana de factores de riesgo suicida',
      'Entrenamiento en primeros auxilios psicológicos',
      'Desarrollo de protocolos institucionales de posvención',
      'Seguimiento estadístico y reportes por departamento',
    ],
    poblacion:
      'Secretarías de salud, hospitales, colegios, universidades y familias.',
  },
  {
    slug: 'spa',
    title: 'Mitigación del Consumo de SPA',
    description:
      'Estrategias de prevención y mitigación del consumo de sustancias psicoactivas.',
    longDescription:
      'Diseñamos e implementamos estrategias de prevención, mitigación y tratamiento del consumo de sustancias psicoactivas (SPA), adaptadas a cada contexto territorial y población. Articulamos con entidades públicas y privadas para desarrollar respuestas integrales.',
    icon: 'shield',
    color: '#27AE60',
    objetivos: [
      'Caracterización del consumo de SPA en territorios',
      'Diseño de programas de prevención basados en evidencia',
      'Capacitación a familias, docentes y líderes comunitarios',
      'Articulación con redes de atención y rehabilitación',
    ],
    poblacion:
      'Jóvenes, familias, instituciones educativas y entidades territoriales.',
  },
  {
    slug: 'social-comunitario',
    title: 'Estrategias Sociales y Comunitarias',
    description:
      'Desarrollo de proyectos sociales con impacto comunitario a nivel nacional.',
    longDescription:
      'Acompañamos procesos de desarrollo social y comunitario a nivel nacional, articulando actores institucionales, comunitarios y del sector privado. Diseñamos proyectos con impacto medible orientados al fortalecimiento del tejido social y la participación ciudadana.',
    icon: 'users',
    color: '#8E44AD',
    objetivos: [
      'Diagnósticos participativos de necesidades comunitarias',
      'Formulación y gestión de proyectos sociales',
      'Fortalecimiento de organizaciones de base',
      'Medición de impacto social con indicadores cuantitativos y cualitativos',
    ],
    poblacion:
      'Comunidades, organizaciones sociales, alcaldías y gobernaciones.',
  },
]
