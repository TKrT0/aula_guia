import { z } from 'zod'

// ============================================
// Schemas de Búsqueda
// ============================================

export const searchParamsSchema = z.object({
  q: z.string().optional().default(''),
  vista: z.enum(['grid', 'list']).optional().default('grid'),
  carrera: z.string().optional(),
})

export type SearchParams = z.infer<typeof searchParamsSchema>

// ============================================
// Schemas de Horario
// ============================================

export const createScheduleSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .trim(),
  semestre: z
    .string()
    .regex(/^(PA|OI)\d{4}$/, 'Formato inválido. Ejemplo: PA2026 o OI2025')
    .optional(),
})

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>

export const addMateriaSchema = z.object({
  materia_id: z.string().uuid('ID de materia inválido'),
  profesor_id: z.string().uuid('ID de profesor inválido'),
  nrc: z.string().min(1, 'NRC requerido'),
  materia_nombre: z.string().min(1, 'Nombre de materia requerido'),
  profesor_nombre: z.string().min(1, 'Nombre de profesor requerido'),
  creditos: z.number().min(0).max(20).optional().default(0),
})

export type AddMateriaInput = z.infer<typeof addMateriaSchema>

// ============================================
// Schemas de Carrera
// ============================================

export const carreraSchema = z.object({
  id: z.string(),
  nombre: z.string(),
})

export type Carrera = z.infer<typeof carreraSchema>

// ============================================
// Schemas de Profesor
// ============================================

export const profesorSearchResultSchema = z.object({
  profesor_id: z.string(),
  profesor_nombre: z.string(),
  materia_id: z.string(),
  materia_nombre: z.string(),
  nrc: z.string(),
  carrera_id: z.string().nullable(),
  carrera_nombre: z.string().nullable(),
  rating_promedio: z.number().nullable(),
  dificultad_promedio: z.number().nullable(),
  recomendacion_pct: z.number().nullable(),
})

export type ProfesorSearchResult = z.infer<typeof profesorSearchResultSchema>

// ============================================
// Schemas de Bloque de Horario
// ============================================

export const bloqueHorarioSchema = z.object({
  id: z.string(),
  materia_id: z.string(),
  nrc: z.string().nullable(),
  dia: z.enum(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']),
  hora_inicio: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
  hora_fin: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
  salon: z.string().nullable(),
  edificio: z.string().nullable(),
})

export type BloqueHorario = z.infer<typeof bloqueHorarioSchema>

// ============================================
// Helpers de validación
// ============================================

export function validateSearchTerm(term: string): { valid: boolean; error?: string } {
  if (term.length < 2) {
    return { valid: false, error: 'Escribe al menos 2 caracteres' }
  }
  if (term.length > 100) {
    return { valid: false, error: 'Búsqueda demasiado larga' }
  }
  return { valid: true }
}

export function validateNRC(nrc: string): boolean {
  return /^\d{5,6}$/.test(nrc)
}
