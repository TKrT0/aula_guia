'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MobileDrawer from '@/src/components/ui/MobileDrawer'
import type { HorarioMateria } from '@/src/lib/services/scheduleService'
import { exportAsImage, exportToCalendar } from '@/src/lib/export/exportSchedule' 
import { generateSchedulePDF } from '@/src/components/features/schedule/SchedulePDF' 
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Image, 
  CalendarDays, 
  ChevronRight, 
  Loader2,
  Info,
  CheckCircle2
} from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  scheduleName: string
  materias: HorarioMateria[]
  imageElementId: string
}

type ExportType = 'pdf' | 'png' | 'ics' | null

export default function ScheduleExportDrawer({
  isOpen,
  onClose,
  scheduleName,
  materias,
  imageElementId,
}: Props) {
  const [loading, setLoading] = useState<ExportType>(null)

  const onExportPDF = async () => {
    try {
      setLoading('pdf')
      await generateSchedulePDF(scheduleName, materias)
      toast.success('PDF exportado correctamente', {
        icon: <CheckCircle2 className="size-4 text-emerald-500" />
      })
      onClose()
    } catch (error) {
      toast.error('Error al exportar PDF')
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  const onExportPNG = async () => {
    try {
      setLoading('png')
      const success = await exportAsImage(imageElementId, `Horario_${scheduleName.replace(/\s+/g, '_')}`)
      if (success) {
        toast.success('Imagen exportada correctamente', {
          icon: <CheckCircle2 className="size-4 text-emerald-500" />
        })
        onClose()
      } else {
        toast.error('Error al exportar imagen')
      }
    } catch (error) {
      toast.error('Error al exportar imagen')
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  const onExportICS = async () => {
    try {
      setLoading('ics')
      
      // Flatten all blocks from all materias
      const bloques = materias.flatMap(m => 
        (m.bloques ?? []).map(b => ({
          materia_nombre: m.materia_nombre,
          profesor_nombre: m.profesor_nombre,
          dia: b.dia,
          hora_inicio: b.hora_inicio,
          hora_fin: b.hora_fin,
          salon: b.salon,
          nrc: m.nrc
        }))
      )

      if (bloques.length === 0) {
        toast.error('No hay clases para exportar al calendario')
        return
      }

      const success = await exportToCalendar(bloques, scheduleName)
      if (success) {
        toast.success('Calendario exportado correctamente', {
          description: 'Importa el archivo .ics en tu app de calendario',
          icon: <CheckCircle2 className="size-4 text-emerald-500" />
        })
        onClose()
      } else {
        toast.error('Error al exportar calendario')
      }
    } catch (error) {
      toast.error('Error al exportar calendario')
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  const exportOptions = [
    {
      id: 'pdf' as const,
      title: 'Exportar PDF',
      description: 'Ideal para imprimir o guardar',
      icon: FileText,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      onClick: onExportPDF,
      disabled: false
    },
    {
      id: 'ics' as const,
      title: 'Exportar Calendario',
      description: 'Próximamente',
      icon: CalendarDays,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      onClick: onExportICS,
      disabled: true
    },
    {
      id: 'png' as const,
      title: 'Exportar Imagen',
      description: 'Próximamente',
      icon: Image,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      onClick: onExportPNG,
      disabled: true
    }
  ]

  return (
    <MobileDrawer isOpen={isOpen} onClose={onClose} title="Exportar horario">
      <div className="p-4 space-y-3">
        <AnimatePresence>
          {exportOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`overflow-hidden transition-all ${
                  option.disabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'cursor-pointer hover:shadow-md hover:border-primary/30'
                }`}
                onClick={() => !option.disabled && !loading && option.onClick()}
              >
                <button
                  disabled={option.disabled || loading !== null}
                  className="w-full flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      whileHover={!option.disabled ? { scale: 1.1 } : {}}
                      className={`size-10 rounded-lg ${option.bgColor} flex items-center justify-center`}
                    >
                      <option.icon className={`size-5 ${option.iconColor}`} />
                    </motion.div>
                    <div className="text-left">
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        {option.title}
                        {option.disabled && (
                          <Badge variant="secondary" className="text-[10px]">
                            Pronto
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </div>
                  
                  {loading === option.id ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader2 className="size-5 text-muted-foreground" />
                    </motion.div>
                  ) : (
                    <ChevronRight className="size-5 text-muted-foreground" />
                  )}
                </button>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-start gap-2 pt-2 px-1"
        >
          <Info className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground">
            El PDF es ideal para imprimir. El calendario (.ics) se puede importar en Google Calendar, Apple Calendar u Outlook.
          </p>
        </motion.div>
      </div>
    </MobileDrawer>
  )
}
