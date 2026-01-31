'use client'

import { useState, useEffect, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import ScheduleHeader from './ScheduleHeader'
import ScheduleSidebar, { type MateriaResult } from './ScheduleSidebar'
import ScheduleGrid from './ScheduleGrid'
import ScheduleGridMobile from './ScheduleGridMobile'
import ScheduleManager from './ScheduleManager'
import ScheduleExportDrawer from './ScheduleExportDrawer'
import ScheduleResultPreviewSheet from './ScheduleResultPreviewSheet'
import ConflictDialog from './ConflictDialog'
import MobileDrawer from '@/src/components/ui/MobileDrawer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useIsMobile } from '@/src/hooks/useMediaQuery'
import { toast } from 'sonner'
import { exportAsImage, exportToCalendar } from '@/src/lib/export/exportSchedule'
import { generateSchedulePDF } from './SchedulePDF'
import { 
  Plus, 
  Share2, 
  Trash2, 
  Calendar,
  AlertTriangle,
  Loader2,
  GraduationCap
} from 'lucide-react'
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
  const [showExportDrawer, setShowExportDrawer] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  
  const [previewMateria, setPreviewMateria] = useState<MateriaResult | null>(null)
  const [showConflictDialog, setShowConflictDialog] = useState(false)
  
  const isMobile = useIsMobile()

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
            toast.warning(`${detectedConflicts.length} conflicto(s) de horario detectado(s)`)
          }
        }
      } else {
        // Crear nuevo horario
        const result = await createSchedule('Mi Horario PA2026', 'PA2026')
        if (result.success && result.data) {
          setCurrentSchedule({ ...result.data, materias: [] })
          setAllSchedules([result.data])
          toast.success('¡Horario creado! Agrega materias desde el panel izquierdo')
        } else {
          toast.error('Error al crear horario inicial')
        }
      }
    } catch (err) {
      toast.error('Error al cargar horarios')
    }
    
    setIsLoading(false)
  }, [])

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

      toast.success(`${materia.materia_nombre} agregada`)

      // Re-detectar conflictos
      const detectedConflicts = await detectAllConflicts(currentSchedule.id)
      setConflicts(detectedConflicts)
      
      if (result.conflicts && result.conflicts.length > 0) {
        setShowConflictDialog(true)
      }
    } else {
      toast.error(result.error || 'Error al agregar materia')
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

      toast.success(`${materia.materia_nombre} eliminada`)

      // Re-detectar conflictos
      const detectedConflicts = await detectAllConflicts(currentSchedule.id)
      setConflicts(detectedConflicts)
    } else {
      toast.error(result.error || 'Error al eliminar materia')
    }
  }

  // Exportar horario - maneja 3 formatos
  const handleExport = async (format: 'image' | 'calendar' | 'print') => {
    if (isExporting) return
    
    setIsExporting(true)
    
    const filename = `horario_${currentSchedule?.nombre?.replace(/\s+/g, '_') || 'mi_horario'}`
    
    try {
      if (format === 'image') {
        const toastId = toast.loading('Generando imagen...')
        const result = await exportAsImage('schedule-grid', filename)
        if (result) {
          toast.success('¡Imagen descargada!', { id: toastId })
        } else {
          toast.error('Error al generar imagen', { id: toastId })
        }
      } else if (format === 'calendar') {
        const toastId = toast.loading('Generando archivo de calendario...')
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
          toast.error('No hay materias para exportar al calendario', { id: toastId })
        } else {
          const result = await exportToCalendar(bloques, currentSchedule?.nombre || 'Mi Horario')
          if (result) {
            toast.success('¡Archivo .ics descargado!', {
              description: 'Ábrelo para importar a tu calendario',
              id: toastId
            })
          } else {
            toast.error('Error al generar archivo de calendario', { id: toastId })
          }
        }
      } else if (format === 'print') {
        const toastId = toast.loading('Generando PDF...')
        const materias = currentSchedule?.materias || []
        if (materias.length === 0) {
          toast.error('No hay materias para exportar', { id: toastId })
        } else {
          const result = await generateSchedulePDF(
            currentSchedule?.nombre || 'Mi Horario',
            materias
          )
          if (result) {
            toast.success('¡PDF descargado!', { id: toastId })
          } else {
            toast.error('Error al generar PDF', { id: toastId })
          }
        }
      }
    } catch (err) {
      toast.error('Error al exportar')
      console.error(err)
    }
    
    setIsExporting(false)
  }

  // Handle preview materia
  const handlePreviewMateria = (materia: MateriaResult) => {
    setPreviewMateria(materia)
  }

  // Handle add from preview
  const handleAddFromPreview = (materia: MateriaResult) => {
    handleAddMateria(materia)
    setPreviewMateria(null)
  }

  // Clear all materias
  const handleClearSchedule = async () => {
    if (!currentSchedule?.materias?.length) return
    
    const confirmed = window.confirm('¿Estás seguro de que quieres limpiar todo el horario?')
    if (!confirmed) return

    for (const materia of currentSchedule.materias) {
      await removeMateriaFromSchedule(materia.id, currentSchedule.id)
    }
    
    setCurrentSchedule(prev => prev ? { ...prev, materias: [], total_creditos: 0 } : null)
    setConflicts([])
    toast.success('Horario limpiado')
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
      <div className="h-screen flex items-center justify-center bg-background">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 w-12 h-12">
            <Loader2 className="size-12 text-primary animate-spin" />
          </div>
          <p className="text-muted-foreground">Cargando tu horario...</p>
        </motion.div>
      </div>
    )
  }

  const addedNRCs = (currentSchedule?.materias || []).map(m => m.nrc)

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <ScheduleHeader
        user={user}
        totalCreditos={currentSchedule?.total_creditos || 0}
        conflicts={conflicts}
        scheduleName={currentSchedule?.nombre || 'Mi Horario'}
        onExport={handleExport}
        onManageSchedules={() => setShowScheduleManager(true)}
        onOpenSearch={() => setShowMobileSidebar(true)}
        onOpenExport={() => setShowExportDrawer(true)}
        onShowConflicts={() => setShowConflictDialog(true)}
        isExporting={isExporting}
        scheduleCount={allSchedules.length}
        isMobile={isMobile}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar desktop */}
        {!isMobile && (
          <ScheduleSidebar 
            onAddMateria={handleAddMateria}
            onPreviewMateria={handlePreviewMateria}
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
          }}
          onPreviewMateria={handlePreviewMateria}
          addedNRCs={addedNRCs}
        />
      </MobileDrawer>

      {/* Mobile Bottom Action Bar */}
      <AnimatePresence>
        {isMobile && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border p-3 z-40 safe-area-inset-bottom"
          >
            <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
              {/* Stats */}
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-bold">
                  {currentSchedule?.total_creditos || 0} cr
                </Badge>
                {conflicts.length > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="cursor-pointer"
                    onClick={() => setShowConflictDialog(true)}
                  >
                    <AlertTriangle className="size-3 mr-1" />
                    {conflicts.length}
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExportDrawer(true)}
                >
                  <Share2 className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSchedule}
                  disabled={!currentSchedule?.materias?.length}
                >
                  <Trash2 className="size-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowMobileSidebar(true)}
                  className="gap-1"
                >
                  <Plus className="size-4" />
                  Agregar
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Sheet */}
      <ScheduleResultPreviewSheet
        isOpen={!!previewMateria}
        onClose={() => setPreviewMateria(null)}
        materia={previewMateria}
        onAdd={handleAddFromPreview}
        isAdded={previewMateria ? addedNRCs.includes(previewMateria.nrc) : false}
      />

      {/* Conflict Dialog */}
      <ConflictDialog
        isOpen={showConflictDialog}
        onClose={() => setShowConflictDialog(false)}
        conflicts={conflicts}
      />

      <ScheduleManager
        schedules={allSchedules}
        activeScheduleId={currentSchedule?.id || null}
        onSelectSchedule={loadSpecificSchedule}
        onScheduleCreated={handleScheduleCreated}
        onScheduleDeleted={handleScheduleDeleted}
        isOpen={showScheduleManager}
        onClose={() => setShowScheduleManager(false)}
      />

      <ScheduleExportDrawer
        isOpen={showExportDrawer}
        onClose={() => setShowExportDrawer(false)}
        scheduleName={currentSchedule?.nombre || 'Mi Horario'}
        materias={currentSchedule?.materias || []}
        imageElementId="schedule-export-area"
      />
    </div>
  )
}
