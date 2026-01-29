'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  AlertTriangle,
  Clock,
  Calendar,
  X,
  Check,
  Info
} from 'lucide-react'
import { formatConflict, formatDayFull, formatTimeRange } from '@/src/lib/schedule'
import type { ConflictInfo } from '@/src/lib/services/scheduleService'

interface ConflictDialogProps {
  isOpen: boolean
  onClose: () => void
  conflicts: ConflictInfo[]
  onAddAnyway?: () => void
  allowAddAnyway?: boolean
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
  }
}

export default function ConflictDialog({
  isOpen,
  onClose,
  conflicts,
  onAddAnyway,
  allowAddAnyway = false
}: ConflictDialogProps) {
  if (conflicts.length === 0) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="mx-auto mb-2 size-12 rounded-full bg-destructive/10 flex items-center justify-center"
          >
            <AlertTriangle className="size-6 text-destructive" />
          </motion.div>
          <DialogTitle className="text-center text-lg">
            {conflicts.length === 1 ? 'Conflicto detectado' : `${conflicts.length} conflictos detectados`}
          </DialogTitle>
          <DialogDescription className="text-center">
            {conflicts.length === 1 
              ? 'Esta materia se empalma con otra en tu horario'
              : 'Estas materias se empalman con otras en tu horario'
            }
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-1" />

        {/* Conflicts List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2 max-h-[200px] overflow-y-auto py-1 flex-1"
        >
          <AnimatePresence>
            {conflicts.map((conflict) => (
              <motion.div
                key={`${conflict.materia1.id}-${conflict.materia2.id}-${conflict.dia}-${conflict.hora_inicio}-${conflict.hora_fin}`}
                variants={itemVariants}
              >
                <Card className="p-3 border-destructive/20 bg-destructive/5">
                  <div className="space-y-2">
                    {/* Conflict header */}
                    <div className="flex items-start gap-2">
                      <div className="size-6 rounded bg-destructive/10 flex items-center justify-center shrink-0">
                        <X className="size-3 text-destructive" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {conflict.materia1.materia_nombre || `NRC ${conflict.materia1.nrc}`}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            <Calendar className="size-2.5 mr-0.5" />
                            {formatDayFull(conflict.dia)}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            <Clock className="size-2.5 mr-0.5" />
                            {formatTimeRange(conflict.hora_inicio, conflict.hora_fin)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Info message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 mt-2"
        >
          <Info className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-tight">
            Los empalmes pueden causar problemas al inscribirte.
          </p>
        </motion.div>

        <DialogFooter className="flex-col gap-2 sm:flex-col mt-3 pt-0">
          <Button onClick={onClose} className="w-full">
            <Check className="size-4 mr-2" />
            Entendido
          </Button>
          
          {allowAddAnyway && onAddAnyway && (
            <Button 
              variant="outline" 
              onClick={() => {
                onAddAnyway()
                onClose()
              }}
              className="w-full text-muted-foreground"
            >
              Agregar de todos modos
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
