'use client'

import { useState, useEffect, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import ScheduleHeader from './ScheduleHeader'
import ScheduleSidebar from './ScheduleSidebar'
import ScheduleGrid from './ScheduleGrid'
import ScheduleGridMobile from './ScheduleGridMobile'
import ConflictAlert from './ConflictAlert'
import ScheduleManager from './ScheduleManager'
import MobileDrawer from '@/src/components/ui/MobileDrawer'
import { useIsMobile } from '@/src/hooks/useMediaQuery'
import { useToast } from '@/src/contexts/ToastContext'
import { exportAsImage, exportToCalendar } from '@/src/lib/utils/exportSchedule'
import { generateSchedulePDF } from './SchedulePDF'
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
  const [allSchedules, setAllSchedules] = useState<Horario[]>([])
  const [currentSchedule, setCurrentSchedule] = useState<Horario | null>(null)
  const [conflicts, setConflicts] = useState<ConflictInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showConflictAlert, setShowConflictAlert] = useState(true)
  const [showScheduleManager, setShowScheduleManager] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  
  const isMobile = useIsMobile()
  const { success, error, info } = useToast()

  // Cargar o crear horario al iniciar
  const loadSchedule = useCallback(async () => {
    setIsLoading(true)
    
    try {
      const schedules = await getUserSchedules()
      setAllSchedules(schedules)
      
      if (schedules.length > 0) {
        // Cargar el horario activo o el más reciente
        const activeSchedule = schedules.find(s => s.es_activo) || schedules[0]
        const scheduleWithMaterias = await getScheduleWithMaterias(activeSchedule.id)
        setCurrentSchedule(scheduleWithMaterias)
        
        // Detectar conflictos
        if (scheduleWithMaterias) {
          const detectedConflicts = await detectAllConflicts(scheduleWithMaterias.id)
          setConflicts(detectedConflicts)
          if (detectedConflicts.length > 0) {
            info(`${detectedConflicts.length} conflicto(s) de horario detectado(s)`)
          }
        }
      } else {
        // Crear nuevo horario
        const result = await createSchedule('Mi Horario PA2026', 'PA2026')
        if (result.success && result.data) {
          setCurrentSchedule({ ...result.data, materias: [] })
          setAllSchedules([result.data])
          success('¡Horario creado! Agrega materias desde el panel izquierdo')
        } else {
          error('Error al crear horario inicial')
        }
      }
    } catch (err) {
      error('Error al cargar horarios')
    }
    
    setIsLoading(false)
  }, [success, error, info])

  useEffect(() => {
    loadSchedule()
  }, [loadSchedule])

  // Cargar un horario específico
  const loadSpecificSchedule = async (scheduleId: string) => {
    setIsLoading(true)
    const scheduleWithMaterias = await getScheduleWithMaterias(scheduleId)
    setCurrentSchedule(scheduleWithMaterias)
    
    if (scheduleWithMaterias) {
      const detectedConflicts = await detectAllConflicts(scheduleWithMaterias.id)
      setConflicts(detectedConflicts)
    }
    setIsLoading(false)
  }

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

      success(`${materia.materia_nombre} agregada`)

      // Re-detectar conflictos
      const detectedConflicts = await detectAllConflicts(currentSchedule.id)
      setConflicts(detectedConflicts)
      setShowConflictAlert(detectedConflicts.length > 0)
      
      if (result.conflicts && result.conflicts.length > 0) {
        error(`¡Advertencia! Hay conflictos de horario`)
      }
    } else {
      error(result.error || 'Error al agregar materia')
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

      success(`${materia.materia_nombre} eliminada`)

      // Re-detectar conflictos
      const detectedConflicts = await detectAllConflicts(currentSchedule.id)
      setConflicts(detectedConflicts)
    } else {
      error(result.error || 'Error al eliminar materia')
    }
  }

  // Exportar horario - maneja 3 formatos
  const handleExport = async (format: 'image' | 'calendar' | 'print') => {
    if (isExporting) return
    
    setIsExporting(true)
    
    const filename = `horario_${currentSchedule?.nombre?.replace(/\s+/g, '_') || 'mi_horario'}`
    
    try {
      if (format === 'image') {
        info('Generando imagen...')
        const result = await exportAsImage('schedule-grid', filename)
        if (result) {
          success('¡Imagen descargada!')
        } else {
          error('Error al generar imagen')
        }
      } else if (format === 'calendar') {
        info('Generando archivo de calendario...')
        // Recopilar todos los bloques de las materias
        const bloques = (currentSchedule?.materias || []).flatMap(materia => 
          (materia.bloques || []).map(bloque => ({
            materia_nombre: materia.materia_nombre,
            profesor_nombre: materia.profesor_nombre,
            dia: bloque.dia,
            hora_inicio: bloque.hora_inicio,
            hora_fin: bloque.hora_fin,
            salon: bloque.salon,
            nrc: materia.nrc,
          }))
        )
        
        if (bloques.length === 0) {
          error('No hay materias para exportar al calendario')
        } else {
          const result = await exportToCalendar(bloques, currentSchedule?.nombre || 'Mi Horario')
          if (result) {
            success('¡Archivo .ics descargado! Ábrelo para importar a tu calendario')
          } else {
            error('Error al generar archivo de calendario')
          }
        }
      } else if (format === 'print') {
        info('Generando PDF...')
        const materias = currentSchedule?.materias || []
        if (materias.length === 0) {
          error('No hay materias para exportar')
        } else {
          const result = await generateSchedulePDF(
            currentSchedule?.nombre || 'Mi Horario',
            materias
          )
          if (result) {
            success('¡PDF descargado!')
          } else {
            error('Error al generar PDF')
          }
        }
      }
    } catch (err) {
      error('Error al exportar')
      console.error(err)
    }
    
    setIsExporting(false)
  }

  // Callbacks para ScheduleManager
  const handleScheduleCreated = (newSchedule: Horario) => {
    setAllSchedules(prev => [newSchedule, ...prev])
    loadSpecificSchedule(newSchedule.id)
  }

  const handleScheduleDeleted = (deletedId: string) => {
    setAllSchedules(prev => prev.filter(s => s.id !== deletedId))
    if (currentSchedule?.id === deletedId) {
      const remaining = allSchedules.filter(s => s.id !== deletedId)
      if (remaining.length > 0) {
        loadSpecificSchedule(remaining[0].id)
      } else {
        // Crear nuevo horario
        loadSchedule()
      }
    }
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Cargando tu horario...</p>
        </div>
      </div>
    )
  }

  const addedNRCs = (currentSchedule?.materias || []).map(m => m.nrc)

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">
      <ScheduleHeader
        user={user}
        totalCreditos={currentSchedule?.total_creditos || 0}
        conflicts={conflicts}
        scheduleName={currentSchedule?.nombre || 'Mi Horario'}
        onExport={handleExport}
        onManageSchedules={() => setShowScheduleManager(true)}
        onOpenSearch={() => setShowMobileSidebar(true)}
        isExporting={isExporting}
        scheduleCount={allSchedules.length}
        isMobile={isMobile}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar desktop */}
        {!isMobile && (
          <ScheduleSidebar 
            onAddMateria={handleAddMateria}
            addedNRCs={addedNRCs}
          />
        )}
        
        {/* Grid desktop o mobile */}
        {isMobile ? (
          <ScheduleGridMobile
            materias={currentSchedule?.materias || []}
            conflicts={conflicts}
            onMateriaClick={handleRemoveMateria}
          />
        ) : (
          <ScheduleGrid
            materias={currentSchedule?.materias || []}
            conflicts={conflicts}
            onMateriaClick={handleRemoveMateria}
          />
        )}
      </div>

      {/* Sidebar móvil como drawer */}
      <MobileDrawer
        isOpen={showMobileSidebar}
        onClose={() => setShowMobileSidebar(false)}
        title="Agregar Materias"
      >
        <ScheduleSidebar 
          onAddMateria={(materia) => {
            handleAddMateria(materia)
            // No cerrar automáticamente para permitir agregar más
          }}
          addedNRCs={addedNRCs}
        />
      </MobileDrawer>

      {/* FAB para abrir búsqueda en móvil */}
      {isMobile && (
        <button
          onClick={() => setShowMobileSidebar(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center z-40 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
        </button>
      )}

      {showConflictAlert && conflicts.length > 0 && (
        <ConflictAlert 
          conflicts={conflicts} 
          onDismiss={() => setShowConflictAlert(false)}
        />
      )}

      <ScheduleManager
        schedules={allSchedules}
        activeScheduleId={currentSchedule?.id || null}
        onSelectSchedule={loadSpecificSchedule}
        onScheduleCreated={handleScheduleCreated}
        onScheduleDeleted={handleScheduleDeleted}
        isOpen={showScheduleManager}
        onClose={() => setShowScheduleManager(false)}
      />
    </div>
  )
}
