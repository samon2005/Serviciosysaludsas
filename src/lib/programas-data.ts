export interface Actividad {
  texto: string
}

export interface Programa {
  slug: string
  title: string
  shortTitle: string
  description: string
  longDescription: string
  objetivo: string
  actividades: string[]
  poblacion: string
  /** true = Línea 24/7, renders with emergency accent */
  flagship?: boolean
  /** Teléfono visible solo para slug linea-24-7 */
  telefono?: string
}

export const programas: Programa[] = [
  {
    slug: 'linea-24-7',
    title: 'Línea Amiga 24/7',
    shortTitle: 'Línea Amiga 24/7',
    description:
      'Atención inmediata y permanente para la prevención del suicidio y la gestión de crisis emocionales.',
    longDescription:
      'La Línea Amiga 24/7 es el servicio insignia de Servicios & Salud S.A.S. Ofrece atención telefónica y virtual ininterrumpida orientada a reducir las conductas autolesivas y prevenir suicidios consumados. Cada llamada activa un protocolo estandarizado de escucha activa, orientación y canalización inmediata, con capacidad de activar la Ruta de Atención en Crisis Suicida cuando el riesgo lo requiere. Los registros generados alimentan el sistema de alertas tempranas territoriales de la PIPST.',
    objetivo:
      'Reducir las conductas autolesivas y prevenir suicidios consumados mediante atención inmediata, permanente y articulada con la red territorial de emergencia.',
    actividades: [
      'Atención inmediata y permanente, telefónica y virtual',
      'Escucha activa, orientación y canalización inmediata',
      'Activación de la Ruta de Atención en Crisis Suicida (activación de la red de emergencia y respuesta territorial)',
      'Registro estandarizado de información para análisis territorial y alertas tempranas',
    ],
    poblacion:
      'Personas en situación de crisis emocional o riesgo suicida, sus familias y la red de emergencia territorial.',
    flagship: true,
    telefono: '(604) 444 24 24',
  },
  {
    slug: 'proyecto-de-vida',
    title: 'Proyecto de Vida',
    shortTitle: 'Proyecto de Vida',
    description:
      'Talleres vivenciales y seguimiento psicosocial para retrasar la edad de inicio en el consumo de SPA en adolescentes y jóvenes.',
    longDescription:
      'El programa Proyecto de Vida interviene con adolescentes y jóvenes para retrasar la edad de primer consumo y prevenir el uso de sustancias psicoactivas (SPA). A través de talleres vivenciales, convivencias educativas y el desarrollo de habilidades para la vida, los participantes fortalecen su autoconocimiento, manejo de emociones, resolución de conflictos y toma de decisiones. El programa incluye seguimiento psicosocial posterior para acompañar los procesos iniciados en los espacios grupales.',
    objetivo:
      'Retrasar la edad de inicio en el consumo de SPA y prevenir el uso de sustancias psicoactivas en adolescentes y jóvenes.',
    actividades: [
      'Talleres vivenciales y convivencias educativas',
      'Desarrollo de habilidades para la vida: autoconocimiento, manejo de emociones, resolución de conflictos y toma de decisiones',
      'Seguimiento psicosocial posterior a las intervenciones grupales',
    ],
    poblacion:
      'Adolescentes y jóvenes escolarizados y no escolarizados, instituciones educativas y familias.',
    flagship: false,
  },
  {
    slug: 'centros-de-escucha',
    title: 'Centros de Escucha',
    shortTitle: 'Centros de Escucha',
    description:
      'Puntos de atención psicosocial estratégicamente ubicados para fortalecer redes comunitarias de cuidado.',
    longDescription:
      'Los Centros de Escucha son puntos de atención oportuna distribuidos en el territorio para acercar los servicios psicosociales a las comunidades. Combinan la atención directa con la formación de redes comunitarias y el fortalecimiento de líderes locales capaces de identificar necesidades y canalizar casos críticos hacia los servicios especializados.',
    objetivo:
      'Fortalecer las redes comunitarias de atención y facilitar el acceso a servicios psicosociales en el territorio.',
    actividades: [
      'Puntos de atención oportuna estratégicamente ubicados en el territorio',
      'Formación de redes comunitarias y líderes locales',
      'Identificación de necesidades y canalización de casos críticos',
    ],
    poblacion:
      'Comunidades, líderes sociales, organizaciones de base y población en condición de vulnerabilidad psicosocial.',
    flagship: false,
  },
  {
    slug: 'pipst',
    title: 'Plataforma Inteligente Psicosocial Territorial (PIPST)',
    shortTitle: 'PIPST',
    description:
      'Sistema de información territorial para análisis predictivo, alertas tempranas e informes estratégicos para municipios.',
    longDescription:
      'La PIPST consolida la información de todos los programas de Servicios & Salud S.A.S. en un sistema de inteligencia territorial. Digitaliza y estandariza los registros de atención, genera tableros de indicadores y mapas de riesgo, emite alertas automatizadas sobre casos críticos y produce informes estratégicos que orientan la toma de decisiones en municipios y en el marco del Plan de Intervenciones Colectivas (PIC).',
    objetivo:
      'Consolidar información territorial, generar análisis predictivo y emitir alertas tempranas para la gestión de la salud mental en los municipios.',
    actividades: [
      'Digitalización y estandarización de registros de atención',
      'Tableros de indicadores y mapas de riesgo territorial',
      'Alertas automatizadas y seguimiento de casos críticos',
      'Informes estratégicos para municipios y el PIC',
    ],
    poblacion:
      'Secretarías de salud municipales, equipos técnicos del PIC y tomadores de decisión en salud pública territorial.',
    flagship: false,
  },
  {
    slug: 'ctp',
    title: 'Centro de Traslado y Protección (CTP)',
    shortTitle: 'CTP',
    description:
      'Atención 24/7 a personas trasladadas por protección, jornadas de bienestar y apoyo logístico al PIC.',
    longDescription:
      'El Centro de Traslado y Protección (CTP) brinda atención ininterrumpida a personas trasladadas por protección, garantizando la continuidad del cuidado en situaciones de crisis. Complementariamente, el equipo desarrolla jornadas de bienestar dirigidas a personal público, educativo y de salud, y presta apoyo logístico a la implementación del Plan de Intervenciones Colectivas (PIC).',
    objetivo:
      'Garantizar la atención integral a personas trasladadas por protección y apoyar las estrategias colectivas de bienestar y salud pública.',
    actividades: [
      'Atención 24/7 a personas trasladadas por protección',
      'Jornadas de bienestar para personal público, educativo y de salud',
      'Apoyo logístico al Plan de Intervenciones Colectivas (PIC)',
    ],
    poblacion:
      'Personas trasladadas por protección, servidores públicos, docentes, personal de salud y equipos del PIC.',
    flagship: false,
  },
]
