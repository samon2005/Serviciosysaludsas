/** Agrupación de hipótesis clasificatorias (sin dependencias, usable en cliente y servidor). */

/** Grupo "amigable" para el público. */
export function grupoHipotesis(key: string): string {
  const k = key.toUpperCase()
  if (k === 'R45' || k === 'Z915') return 'Ideación suicida y autolesión'
  if (['R458', 'R457', 'Z733', 'Z566', 'Z567', 'Z553', 'Z558'].includes(k)) return 'Malestar emocional y estrés'
  if (k === 'Z719' || k === 'Z504') return 'Orientación y acompañamiento'
  if (k === 'Z710') return 'Consulta en nombre de otra persona'
  if (k === 'Z534' || k === 'Z634') return 'Duelo y pérdidas'
  if (/^Z6[0-4]/.test(k) || k === 'Y060') return 'Familia, pareja y crianza'
  if (/^(T74|T76|Y07)/.test(k)) return 'Violencia y maltrato'
  if (/^(F4[01]|F3[2-4]|F311|F329)/.test(k)) return 'Ansiedad y depresión'
  if (/^F43/.test(k)) return 'Estrés, trauma y adaptación'
  if (/^(F19|F10|Z722|Z864|Z813|Z814)/.test(k)) return 'Consumo de sustancias'
  if (/^(F8|F9|F53)/.test(k)) return 'Niñez y adolescencia'
  if (/^(29[0-9]|F60|F68|F31)/.test(k)) return 'Otros trastornos mentales'
  return 'Otros motivos'
}

/** Descripción en lenguaje llano de cada grupo (sección pública). */
export const GRUPO_DESCRIPCION: Record<string, string> = {
  'Orientación y acompañamiento': 'Personas que buscan escucha, orientación o apoyo psicológico.',
  'Malestar emocional y estrés': 'Tristeza, angustia, estrés o sensación de estar desbordado.',
  'Familia, pareja y crianza': 'Conflictos en el hogar, en la pareja o en la crianza de los hijos.',
  'Ansiedad y depresión': 'Ansiedad, crisis de pánico, depresión y cambios en el estado de ánimo.',
  'Consulta en nombre de otra persona': 'Familiares o amigos que llaman preocupados por alguien más.',
  'Ideación suicida y autolesión': 'Pensamientos de hacerse daño; la línea activa la ruta de ayuda.',
  'Niñez y adolescencia': 'Comportamiento, aprendizaje y emociones en niños y jóvenes.',
  'Duelo y pérdidas': 'Muerte o desaparición de un ser querido.',
  'Consumo de sustancias': 'Preocupación por el consumo de alcohol u otras drogas.',
  'Estrés, trauma y adaptación': 'Reacciones a hechos difíciles o a cambios importantes de vida.',
  'Violencia y maltrato': 'Situaciones de maltrato o violencia.',
  'Otros trastornos mentales': 'Otras condiciones de salud mental.',
}
