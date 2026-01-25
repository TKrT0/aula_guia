'use client'

import { useState, useEffect, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import ScheduleHeader from './ScheduleHeader'
import ScheduleSidebar from './ScheduleSidebar'
import ScheduleGrid from './ScheduleGrid'
import ConflictAlert from './ConflictAlert'
import { 
  getUserSchedules, 
  getScheduleWithMaterias, 
  createSchedule,
  addMateriaToSchedule,
  removeMateriaFromSchedule,
  detectAllConflicts,
  getMateriaBlocks,
  type Horario,
  type HorarioMateria,
  type ConflictInfo
} from '@/src/lib/services/scheduleService'

interface ScheduleClientProps {
  user: User
}

export default function ScheduleClient({ user }: ScheduleClientProps) {
  const [currentSchedule, setCurrentSchedule] = useState<Horario | null>(null)
  const [conflicts, setConflicts] = useState<ConflictInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showConflictAlert, setShowConflictAlert] = useState(true)

  // Cargar o crear horario al iniciar
  const loadSchedule = useCallback(async () => {
    setIsLoading(true)
    
    const schedules = await getUserSchedules()
    
    if (schedules.length > 0) {
      // Cargar el horario activo o el más reciente
      const activeSchedule = schedules.find(s => s.es_activo) || schedules[0]
      const scheduleWithMaterias = await getScheduleWithMaterias(activeSchedule.id)
      setCurrentSchedule(scheduleWithMaterias)
      
      // Detectar conflictos
      if (scheduleWithMaterias) {
        const detectedConflicts = await detectAllConflicts(scheduleWithMaterias.id)
        setConflicts(detectedConflicts)
      }
    } else {
      // Crear nuevo horario
      const result = await createSchedule('Mi Horario', '2025-1')
      if (result.success && result.data) {
        setCurrentSchedule({ ...result.data, materias: [] })
      }
    }
    
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadSchedule()
  }, [loadSchedule])

  // Agregar materia al horario
  const handleAddMateria = async (materia: {
    materia_id: string
    profesor_id: string
    nrc: string
    materia_nombre: string
    profesor_nombre: string
    creditos?: number
  }) => {
    if (!currentSchedule) return

    const result = await addMateriaToSchedule(currentSchedule.id, {
      materia_id: materia.materia_id,
      profesor_id: materia.profesor_id,
      nrc: materia.nrc,
      materia_nombre: materia.materia_nombre,
      profesor_nombre: materia.profesor_nombre,
      creditos: materia.creditos || 0
    })

    if (result.success && result.data) {
      // Obtener bloques de horario para la nueva materia (por nrc)
      const bloques = await getMateriaBlocks(materia.nrc)
      const newMateria = { ...result.data, bloques }
      
      setCurrentSchedule(prev => {
        if (!prev) return prev
        return {
          ...prev,
          materias: [...(prev.materias || []), newMateria],
          total_creditos: prev.total_creditos + (materia.creditos || 0)
        }
      })

      // Re-detectar conflictos
      const detectedConflicts = await detectAllConflicts(currentSchedule.id)
      setConflicts(detectedConflicts)
      setShowConflictAlert(detectedConflicts.length > 0)
    }
  }

  // Eliminar materia del horario
  const handleRemoveMateria = async (materia: HorarioMateria) => {
    if (!currentSchedule) return

    const result = await removeMateriaFromSchedule(materia.id, currentSchedule.id)

    if (result.success) {
      setCurrentSchedule(prev => {
        if (!prev) return prev
        return {
          ...prev,
          materias: (prev.materias || []).filter(m => m.id !== materia.id),
          total_creditos: prev.total_creditos - (materia.creditos || 0)
        }
      })

      // Re-detectar conflictos
      const detectedConflicts = await detectAllConflicts(currentSchedule.id)
      setConflicts(detectedConflicts)
    }
  }

  // Exportar horario (placeholder)
  const handleExport = () => {
    // TODO: Implementar exportación a imagen/PDF
    alert('Función de exportación próximamente disponible')
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando tu horario...</p>
        </div>
      </div>
    )
  }

  const addedNRCs = (currentSchedule?.materias || []).map(m => m.nrc)

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
      <ScheduleHeader
        user={user}
        totalCreditos={currentSchedule?.total_creditos || 0}
        conflicts={conflicts}
        scheduleName={currentSchedule?.nombre || 'Mi Horario'}
        onExport={handleExport}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <ScheduleSidebar 
          onAddMateria={handleAddMateria}
          addedNRCs={addedNRCs}
        />
        
        <ScheduleGrid
          materias={currentSchedule?.materias || []}
          conflicts={conflicts}
          onMateriaClick={handleRemoveMateria}
        />
      </div>

      {showConflictAlert && conflicts.length > 0 && (
        <ConflictAlert 
          conflicts={conflicts} 
          onDismiss={() => setShowConflictAlert(false)}
        />
      )}
    </div>
  )
}
