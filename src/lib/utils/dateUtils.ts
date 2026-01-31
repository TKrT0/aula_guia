import { 
  format, 
  formatDistanceToNow, 
  isToday, 
  isYesterday,
  parseISO,
  addDays,
  addWeeks,
  startOfWeek,
  endOfWeek,
  isSameDay,
  differenceInMinutes
} from 'date-fns'
import { es } from 'date-fns/locale'

// ============================================
// Formateo de fechas
// ============================================

export function formatDate(date: Date | string, formatStr: string = 'dd/MM/yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, formatStr, { locale: es })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  
  if (isToday(d)) {
    return `Hoy a las ${format(d, 'HH:mm')}`
  }
  
  if (isYesterday(d)) {
    return `Ayer a las ${format(d, 'HH:mm')}`
  }
  
  return formatDistanceToNow(d, { addSuffix: true, locale: es })
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, "d MMM", { locale: es })
}

// ============================================
// Formateo de horarios
// ============================================

export function formatTimeRange(horaInicio: string, horaFin: string): string {
  return `${horaInicio} - ${horaFin}`
}

export function formatHour(time: string): string {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

export function getDurationInMinutes(horaInicio: string, horaFin: string): number {
  const [startHours, startMinutes] = horaInicio.split(':').map(Number)
  const [endHours, endMinutes] = horaFin.split(':').map(Number)
  
  const startTotal = startHours * 60 + startMinutes
  const endTotal = endHours * 60 + endMinutes
  
  return endTotal - startTotal
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) return `${mins} min`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}min`
}

// ============================================
// Días de la semana
// ============================================

export const DIAS_SEMANA = [
  'Lunes',
  'Martes', 
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado'
] as const

export type DiaSemana = typeof DIAS_SEMANA[number]

export function getDiaIndex(dia: string): number {
  return DIAS_SEMANA.indexOf(dia as DiaSemana)
}

export function getDiaAbreviado(dia: string): string {
  const abreviaturas: Record<string, string> = {
    'Lunes': 'Lun',
    'Martes': 'Mar',
    'Miércoles': 'Mié',
    'Jueves': 'Jue',
    'Viernes': 'Vie',
    'Sábado': 'Sáb'
  }
  return abreviaturas[dia] || dia.substring(0, 3)
}

// ============================================
// Cálculos de semestre
// ============================================

export function getCurrentSemester(): string {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  
  // Primavera: Enero - Junio, Otoño-Invierno: Agosto - Diciembre
  if (month >= 1 && month <= 6) {
    return `PA${year}`
  } else {
    return `OI${year}`
  }
}

export function formatSemester(codigo: string): string {
  if (!codigo) return ''
  
  const tipo = codigo.substring(0, 2)
  const year = codigo.substring(2)
  
  if (tipo === 'PA') {
    return `Primavera ${year}`
  } else if (tipo === 'OI') {
    return `Otoño-Invierno ${year}`
  }
  
  return codigo
}

// ============================================
// Utilidades de calendario
// ============================================

export function getWeekDates(baseDate: Date = new Date()): Date[] {
  const start = startOfWeek(baseDate, { weekStartsOn: 1 }) // Lunes
  return Array.from({ length: 6 }, (_, i) => addDays(start, i))
}

export function getNextClassDate(dia: DiaSemana): Date {
  const today = new Date()
  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1 // Ajustar para empezar en Lunes
  const targetIndex = getDiaIndex(dia)
  
  let daysToAdd = targetIndex - todayIndex
  if (daysToAdd <= 0) {
    daysToAdd += 7
  }
  
  return addDays(today, daysToAdd)
}
