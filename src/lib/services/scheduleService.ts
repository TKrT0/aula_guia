import { createClient } from '@/src/utils/supabase/client'

// Types
export interface MateriaHorario {
  id: string
  materia_id: string
  nrc?: string | null
  dia: string
  hora_inicio: string
  hora_fin: string
  salon: string | null
  edificio: string | null
}

export interface HorarioMateria {
  id: string
  horario_id: string
  materia_id: string
  profesor_id: string
  nrc: string
  materia_nombre: string
  profesor_nombre: string
  creditos: number
  color: string
  bloques?: MateriaHorario[]
}

export interface Horario {
  id: string
  user_id: string
  nombre: string
  semestre: string | null
  total_creditos: number
  created_at: string
  updated_at: string
  es_activo: boolean
  materias?: HorarioMateria[]
}

export interface ConflictInfo {
  materia1: HorarioMateria
  materia2: HorarioMateria
  dia: string
  hora_inicio: string
  hora_fin: string
}

// Colores predefinidos para materias
const COLORS = [
  '#2b8cee', // primary blue
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
]

// Obtener horarios del usuario
export async function getUserSchedules(): Promise<Horario[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('horarios')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return []
  }

  return data || []
}

// Obtener un horario con sus materias
export async function getScheduleWithMaterias(horarioId: string): Promise<Horario | null> {
  const supabase = createClient()
  
  const { data: horario, error: horarioError } = await supabase
    .from('horarios')
    .select('*')
    .eq('id', horarioId)
    .single()

  if (horarioError || !horario) {
    return null
  }

  const { data: materias, error: materiasError } = await supabase
    .from('horario_materias')
    .select('*')
    .eq('horario_id', horarioId)

  if (materiasError) {
    return { ...horario, materias: [] }
  }

  // Obtener bloques de horario para cada materia (usando nrc para distinguir profesores)
  const materiasConBloques = await Promise.all(
    (materias || []).map(async (materia: HorarioMateria) => {
      const { data: bloques } = await supabase
        .from('horarios_materia')
        .select('*')
        .eq('nrc', materia.nrc)
      
      return { ...materia, bloques: bloques || [] }
    })
  )

  return { ...horario, materias: materiasConBloques }
}

// Crear nuevo horario
export async function createSchedule(nombre: string, semestre?: string): Promise<{ success: boolean; data?: Horario; error?: string }> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Usuario no autenticado' }
  }

  const { data, error } = await supabase
    .from('horarios')
    .insert({
      user_id: user.id,
      nombre,
      semestre: semestre || null,
      total_creditos: 0,
      es_activo: true
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

// Agregar materia a horario
export async function addMateriaToSchedule(
  horarioId: string,
  materiaData: {
    materia_id: string
    profesor_id: string
    nrc: string
    materia_nombre: string
    profesor_nombre: string
    creditos?: number
  }
): Promise<{ success: boolean; data?: HorarioMateria; error?: string; conflicts?: ConflictInfo[] }> {
  const supabase = createClient()
  
  // Obtener color basado en cuántas materias ya hay
  const { data: existingMaterias } = await supabase
    .from('horario_materias')
    .select('id')
    .eq('horario_id', horarioId)
  
  const colorIndex = (existingMaterias?.length || 0) % COLORS.length
  const color = COLORS[colorIndex]

  // Verificar conflictos antes de agregar (usando nrc)
  const conflicts = await checkConflicts(horarioId, materiaData.nrc)
  
  const { data, error } = await supabase
    .from('horario_materias')
    .insert({
      horario_id: horarioId,
      materia_id: materiaData.materia_id,
      profesor_id: materiaData.profesor_id,
      nrc: materiaData.nrc,
      materia_nombre: materiaData.materia_nombre,
      profesor_nombre: materiaData.profesor_nombre,
      creditos: materiaData.creditos || 0,
      color
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  // Actualizar total de créditos
  await updateTotalCredits(horarioId)

  return { success: true, data, conflicts: conflicts.length > 0 ? conflicts : undefined }
}

// Eliminar materia de horario
export async function removeMateriaFromSchedule(materiaId: string, horarioId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('horario_materias')
    .delete()
    .eq('id', materiaId)

  if (error) {
    return { success: false, error: error.message }
  }

  await updateTotalCredits(horarioId)

  return { success: true }
}

// Actualizar total de créditos
async function updateTotalCredits(horarioId: string): Promise<void> {
  const supabase = createClient()
  
  const { data: materias } = await supabase
    .from('horario_materias')
    .select('creditos')
    .eq('horario_id', horarioId)

  const totalCreditos = (materias || []).reduce((sum: number, m: { creditos: number | null }) => sum + (m.creditos || 0), 0)

  await supabase
    .from('horarios')
    .update({ total_creditos: totalCreditos, updated_at: new Date().toISOString() })
    .eq('id', horarioId)
}

// Verificar conflictos de horario (usando nrc)
export async function checkConflicts(horarioId: string, newNrc: string): Promise<ConflictInfo[]> {
  const supabase = createClient()
  const conflicts: ConflictInfo[] = []

  // Obtener bloques del nuevo NRC
  const { data: newBloques } = await supabase
    .from('horarios_materia')
    .select('*')
    .eq('nrc', newNrc)

  if (!newBloques || newBloques.length === 0) {
    return []
  }

  // Obtener materias existentes en el horario
  const { data: materiasExistentes } = await supabase
    .from('horario_materias')
    .select('*')
    .eq('horario_id', horarioId)

  if (!materiasExistentes || materiasExistentes.length === 0) {
    return []
  }

  // Para cada materia existente, verificar conflictos
  for (const materia of materiasExistentes) {
    const { data: bloquesExistentes } = await supabase
      .from('horarios_materia')
      .select('*')
      .eq('nrc', materia.nrc)

    if (!bloquesExistentes) continue

    for (const bloqueExistente of bloquesExistentes) {
      for (const bloqueNuevo of newBloques) {
        if (bloqueExistente.dia === bloqueNuevo.dia) {
          // Verificar overlap de tiempo
          if (timeOverlaps(
            bloqueExistente.hora_inicio,
            bloqueExistente.hora_fin,
            bloqueNuevo.hora_inicio,
            bloqueNuevo.hora_fin
          )) {
            conflicts.push({
              materia1: materia,
              materia2: { nrc: newNrc } as HorarioMateria,
              dia: bloqueExistente.dia,
              hora_inicio: bloqueNuevo.hora_inicio,
              hora_fin: bloqueNuevo.hora_fin
            })
          }
        }
      }
    }
  }

  return conflicts
}

// Verificar si dos rangos de tiempo se superponen
function timeOverlaps(start1: string, end1: string, start2: string, end2: string): boolean {
  const toMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  const s1 = toMinutes(start1)
  const e1 = toMinutes(end1)
  const s2 = toMinutes(start2)
  const e2 = toMinutes(end2)

  return s1 < e2 && s2 < e1
}

// Eliminar horario completo
export async function deleteSchedule(horarioId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('horarios')
    .delete()
    .eq('id', horarioId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Buscar materias disponibles para agregar (usa vista_buscador)
export async function searchMateriasForSchedule(termino: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('vista_buscador')
    .select('*')
    .or(`materia_nombre.ilike.%${termino}%,profesor_nombre.ilike.%${termino}%,nrc.ilike.%${termino}%`)
    .limit(20)

  if (error) {
    return []
  }

  return data || []
}

// Obtener bloques de horario para una materia (por nrc)
export async function getMateriaBlocks(nrc: string): Promise<MateriaHorario[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('horarios_materia')
    .select('*')
    .eq('nrc', nrc)

  if (error) {
    return []
  }

  return data || []
}

// Detectar todos los conflictos en un horario
export async function detectAllConflicts(horarioId: string): Promise<ConflictInfo[]> {
  const supabase = createClient()
  const conflicts: ConflictInfo[] = []

  const { data: materias } = await supabase
    .from('horario_materias')
    .select('*')
    .eq('horario_id', horarioId)

  if (!materias || materias.length < 2) {
    return []
  }

  // Obtener todos los bloques de todas las materias (usando nrc)
  const materiasConBloques = await Promise.all(
    materias.map(async (materia: HorarioMateria) => {
      const { data: bloques } = await supabase
        .from('horarios_materia')
        .select('*')
        .eq('nrc', materia.nrc)
      return { ...materia, bloques: bloques || [] }
    })
  )

  // Comparar cada par de materias
  for (let i = 0; i < materiasConBloques.length; i++) {
    for (let j = i + 1; j < materiasConBloques.length; j++) {
      const materia1 = materiasConBloques[i]
      const materia2 = materiasConBloques[j]

      for (const bloque1 of materia1.bloques) {
        for (const bloque2 of materia2.bloques) {
          if (bloque1.dia === bloque2.dia) {
            if (timeOverlaps(
              bloque1.hora_inicio,
              bloque1.hora_fin,
              bloque2.hora_inicio,
              bloque2.hora_fin
            )) {
              conflicts.push({
                materia1,
                materia2,
                dia: bloque1.dia,
                hora_inicio: bloque1.hora_inicio > bloque2.hora_inicio ? bloque1.hora_inicio : bloque2.hora_inicio,
                hora_fin: bloque1.hora_fin < bloque2.hora_fin ? bloque1.hora_fin : bloque2.hora_fin
              })
            }
          }
        }
      }
    }
  }

  return conflicts
}
