'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, User } from 'lucide-react'
import type { HorarioMateria, ConflictInfo } from '@/src/lib/services/scheduleService'

interface ScheduleGridProps {
  materias: HorarioMateria[]
  conflicts: ConflictInfo[]
  onMateriaClick?: (materia: HorarioMateria) => void
}

const DAYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
const DAY_LABELS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const HOURS = Array.from({ length: 15 }, (_, i) => i + 7) // 7:00 - 21:00

const HOUR_HEIGHT = 60 // px per hour

export default function ScheduleGrid({ materias, conflicts, onMateriaClick }: ScheduleGridProps) {
  // Procesar bloques para mostrar en el grid (con deduplicación)
  const bloquesPorDia = useMemo(() => {
    const result: Record<string, Array<{
      materia: HorarioMateria
      bloque: { hora_inicio: string; hora_fin: string; salon: string | null; edificio: string | null }
      hasConflict: boolean
    }>> = {}

    DAYS.forEach(day => {
      result[day] = []
    })

    // Track seen blocks to avoid duplicates
    const seenBlocks = new Set<string>()

    materias.forEach(materia => {
      if (!materia.bloques) return

      materia.bloques.forEach(bloque => {
        const dia = bloque.dia.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        
        // Create unique key for this block
        const blockKey = `${materia.id}-${dia}-${bloque.hora_inicio}-${bloque.hora_fin}`
        
        // Skip if already added
        if (seenBlocks.has(blockKey)) return
        seenBlocks.add(blockKey)
        
        if (result[dia]) {
          // Verificar si este bloque tiene conflicto
          const hasConflict = conflicts.some(
            c => (c.materia1.id === materia.id || c.materia2.id === materia.id) && 
                 c.dia.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === dia
          )
          
          result[dia].push({
            materia,
            bloque: {
              hora_inicio: bloque.hora_inicio,
              hora_fin: bloque.hora_fin,
              salon: bloque.salon,
              edificio: bloque.edificio
            },
            hasConflict
          })
        }
      })
    })

    return result
  }, [materias, conflicts])

  // Calcular posición y altura de un bloque
  const getBlockStyle = (horaInicio: string, horaFin: string) => {
    const [startH, startM] = horaInicio.split(':').map(Number)
    const [endH, endM] = horaFin.split(':').map(Number)

    const startMinutes = (startH - 7) * 60 + startM
    const endMinutes = (endH - 7) * 60 + endM
    const duration = endMinutes - startMinutes

    return {
      top: `${startMinutes}px`,
      height: `${duration}px`
    }
  }

  // Obtener hora actual para indicador
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTimePosition = currentHour >= 7 && currentHour < 22 
    ? (currentHour - 7) * 60 + currentMinute 
    : null

  return (
    <div id="schedule-export-area" className="flex-1 flex flex-col relative overflow-hidden bg-white dark:bg-[#0F1C2E]">
      {/* Header de días */}
      <div className="grid grid-cols-[60px_repeat(6,1fr)] border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1C2E] z-10 shrink-0 shadow-sm">
        <div className="p-3 border-r border-slate-100 dark:border-slate-700 flex items-end justify-center">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Hora</span>
        </div>
        {DAY_LABELS.map((day, index) => (
          <div key={day} className={`p-3 text-center border-r border-slate-100 dark:border-slate-700 ${index === now.getDay() - 1 ? 'bg-[#00BCD4]/5 dark:bg-cyan-500/10' : ''}`}>
            <span className={`block text-xs uppercase font-semibold tracking-wide ${index === now.getDay() - 1 ? 'text-[#00BCD4] dark:text-cyan-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Grid body */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="relative" style={{ minHeight: `${15 * HOUR_HEIGHT}px` }}>
          {/* Columna de horas */}
          <div className="absolute top-0 left-0 w-[60px] h-full bg-slate-50 dark:bg-[#0B1220] border-r border-slate-200 dark:border-slate-700 z-10 flex flex-col text-xs text-slate-500 dark:text-slate-400 font-medium">
            {HOURS.map(hour => (
              <div key={hour} className="h-[60px] flex items-start justify-center pt-2 relative">
                <span className="-mt-3">{hour.toString().padStart(2, '0')}:00</span>
              </div>
            ))}
          </div>

          {/* Columnas de días */}
          <div className="absolute top-0 left-[60px] right-0 h-full grid grid-cols-6 divide-x divide-slate-100 dark:divide-slate-700">
            {DAYS.map((day, dayIndex) => (
              <div key={day} className={`relative h-full w-full ${dayIndex === 5 ? 'bg-slate-50/30 dark:bg-[#0B1220]/30' : 'bg-white dark:bg-[#0F1C2E]'}`}>
                {/* Líneas horizontales de fondo */}
                {HOURS.map(hour => (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 border-t border-slate-100 dark:border-slate-700"
                    style={{ top: `${(hour - 7) * HOUR_HEIGHT}px` }}
                  />
                ))}

                {/* Bloques de materias */}
                {bloquesPorDia[day]?.map((item, idx) => {
                  const style = getBlockStyle(item.bloque.hora_inicio, item.bloque.hora_fin)
                  
                  return (
                    <motion.div
                      key={`${item.materia.id}-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="absolute left-1 right-1 z-10 cursor-pointer"
                      style={style}
                      onClick={() => onMateriaClick?.(item.materia)}
                    >
                      <div 
                        className={`h-full w-full rounded-md p-2 text-xs flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow ${
                          item.hasConflict 
                            ? 'border-2 border-red-500 ring-2 ring-red-100 dark:ring-red-500/20' 
                            : 'border-l-4'
                        }`}
                        style={{ 
                          backgroundColor: item.hasConflict ? '#fef2f2 dark:bg-red-500/10' : `${item.materia.color}20`,
                          borderLeftColor: item.hasConflict ? undefined : item.materia.color,
                        }}
                      >
                        {item.hasConflict && (
                          <div className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold text-[10px]">
                            <AlertTriangle className="size-3" />
                            Conflicto
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-sm mb-0.5 truncate text-slate-800 dark:text-white">
                            {item.materia.materia_nombre}
                          </div>
                          {item.bloque.salon && (
                            <div className="text-slate-600 dark:text-slate-300 truncate">{item.bloque.salon}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-400">
                          <User className="size-3" />
                          <span className="truncate">{item.materia.profesor_nombre.split(' ')[0]}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Indicador de hora actual */}
          {currentTimePosition !== null && (
            <div 
              className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
              style={{ top: `${currentTimePosition}px` }}
            >
              <div className="w-[60px] text-right pr-2 text-xs font-bold text-[#00BCD4] dark:text-cyan-400">
                {currentHour.toString().padStart(2, '0')}:{currentMinute.toString().padStart(2, '0')}
              </div>
              <div className="flex-1 h-px bg-[#00BCD4]/50 dark:bg-cyan-400/50 relative">
                <div className="absolute -top-1 right-0 size-2 bg-[#00BCD4] dark:bg-cyan-400 rounded-full" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
