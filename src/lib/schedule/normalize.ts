/**
 * Normalización de días y datos de horario
 */

const DAY_MAP: Record<string, string> = {
  'lunes': 'lunes',
  'martes': 'martes',
  'miercoles': 'miercoles',
  'miércoles': 'miercoles',
  'jueves': 'jueves',
  'viernes': 'viernes',
  'sabado': 'sabado',
  'sábado': 'sabado',
  'domingo': 'domingo',
}

export type NormalizedDay = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo'

/**
 * Normaliza el día removiendo acentos y estandarizando
 * @param dia - Día en cualquier formato (con/sin acentos, mayúsculas)
 * @returns Día normalizado en minúsculas sin acentos
 */
export function normalizeDay(dia: string): NormalizedDay {
  const normalized = dia.toLowerCase().trim()
  return (DAY_MAP[normalized] || normalized) as NormalizedDay
}

/**
 * Orden de días para ordenamiento
 */
export const DAY_ORDER: Record<NormalizedDay, number> = {
  lunes: 0,
  martes: 1,
  miercoles: 2,
  jueves: 3,
  viernes: 4,
  sabado: 5,
  domingo: 6,
}

/**
 * Compara dos días para ordenamiento
 */
export function compareDays(a: string, b: string): number {
  return DAY_ORDER[normalizeDay(a)] - DAY_ORDER[normalizeDay(b)]
}
