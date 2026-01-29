/**
 * Helpers de formato para horarios
 */

import { normalizeDay, type NormalizedDay } from './normalize'

const DAY_ABBREV: Record<NormalizedDay, string> = {
  lunes: 'Lun',
  martes: 'Mar',
  miercoles: 'Mié',
  jueves: 'Jue',
  viernes: 'Vie',
  sabado: 'Sáb',
  domingo: 'Dom',
}

const DAY_FULL: Record<NormalizedDay, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo',
}

/**
 * Obtiene la abreviatura del día
 * @param day - Día en cualquier formato
 * @returns Abreviatura del día (Lun, Mar, etc.)
 */
export function formatDayAbbrev(day: string): string {
  const normalized = normalizeDay(day)
  return DAY_ABBREV[normalized] || day
}

/**
 * Obtiene el nombre completo del día (con acento correcto)
 * @param day - Día en cualquier formato
 * @returns Nombre completo del día
 */
export function formatDayFull(day: string): string {
  const normalized = normalizeDay(day)
  return DAY_FULL[normalized] || day
}

/**
 * Formatea hora de "HH:MM:SS" a "HH:MM"
 * @param time - Hora en formato HH:MM:SS o HH:MM
 * @returns Hora en formato HH:MM
 */
export function hhmm(time: string): string {
  if (!time) return ''
  return time.slice(0, 5)
}

/**
 * Formatea rango de tiempo
 * @param inicio - Hora de inicio
 * @param fin - Hora de fin
 * @returns Rango formateado "07:00–09:00"
 */
export function formatTimeRange(inicio: string, fin: string): string {
  return `${hhmm(inicio)}–${hhmm(fin)}`
}

interface Bloque {
  dia: string
  hora_inicio: string
  hora_fin: string
  salon?: string | null
  edificio?: string | null
}

/**
 * Formatea resumen de bloques de horario
 * Agrupa por horario igual y muestra días + rango de hora
 * @param bloques - Array de bloques de horario
 * @returns Resumen formateado "Lun, Mié 07:00–09:00 · Vie 10:00–11:00"
 */
export function formatBlocksSummary(bloques?: Bloque[]): string {
  if (!bloques || bloques.length === 0) return ''

  const groups = new Map<string, { inicio: string; fin: string; dias: string[] }>()
  
  for (const b of bloques) {
    const inicio = hhmm(b.hora_inicio)
    const fin = hhmm(b.hora_fin)
    const key = `${inicio}-${fin}`
    const dia = formatDayAbbrev(b.dia)

    const g = groups.get(key) ?? { inicio, fin, dias: [] }
    if (!g.dias.includes(dia)) {
      g.dias.push(dia)
    }
    groups.set(key, g)
  }

  const parts: string[] = []
  for (const g of groups.values()) {
    parts.push(`${g.dias.join(', ')} ${g.inicio}–${g.fin}`)
  }

  return parts.slice(0, 2).join(' · ')
}

/**
 * Formatea lista detallada de bloques (para preview sheet)
 * @param bloques - Array de bloques de horario
 * @returns Array de strings formateados
 */
export function formatBlocksDetailed(bloques?: Bloque[]): string[] {
  if (!bloques || bloques.length === 0) return []

  return bloques.map(b => {
    const dia = formatDayFull(b.dia)
    const rango = formatTimeRange(b.hora_inicio, b.hora_fin)
    const location = [b.salon, b.edificio].filter(Boolean).join(', ')
    
    return location 
      ? `${dia} ${rango} — ${location}`
      : `${dia} ${rango}`
  })
}

/**
 * Formatea información de conflicto en texto legible
 */
export function formatConflict(conflict: {
  materia1: { materia_nombre?: string; nrc?: string }
  materia2: { materia_nombre?: string; nrc?: string }
  dia: string
  hora_inicio: string
  hora_fin: string
}): string {
  const dia = formatDayFull(conflict.dia)
  const rango = formatTimeRange(conflict.hora_inicio, conflict.hora_fin)
  const materia = conflict.materia1.materia_nombre || `NRC ${conflict.materia1.nrc}`
  
  return `Se empalma con ${materia} el ${dia} ${rango}`
}
