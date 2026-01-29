'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  User,
  Clock,
  MapPin,
  Star,
  Hash,
  BookOpen,
  PlusCircle,
  Check,
  Calendar
} from 'lucide-react'
import { formatBlocksDetailed } from '@/src/lib/schedule'
import type { MateriaResult } from './ScheduleSidebar'

interface ScheduleResultPreviewSheetProps {
  isOpen: boolean
  onClose: () => void
  materia: MateriaResult | null
  onAdd: (materia: MateriaResult) => void
  isAdded: boolean
}

export default function ScheduleResultPreviewSheet({
  isOpen,
  onClose,
  materia,
  onAdd,
  isAdded
}: ScheduleResultPreviewSheetProps) {
  if (!materia) return null

  const bloquesList = formatBlocksDetailed(materia.bloques)

  const handleAdd = () => {
    onAdd(materia)
    // onClose is handled by handleAddFromPreview in parent
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SheetTitle className="text-xl leading-tight pr-8">
              {materia.materia_nombre}
            </SheetTitle>
            <SheetDescription className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="font-mono">
                <Hash className="size-3 mr-1" />
                NRC {materia.nrc}
              </Badge>
              {materia.creditos && (
                <Badge variant="outline">
                  <BookOpen className="size-3 mr-1" />
                  {materia.creditos} créditos
                </Badge>
              )}
            </SheetDescription>
          </motion.div>
        </SheetHeader>

        <Separator className="my-4" />

        {/* Professor Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="size-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground">Profesor</p>
              <p className="text-base font-semibold truncate">{materia.profesor_nombre}</p>
              {materia.rating_promedio && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`size-3.5 ${
                          star <= Math.round(materia.rating_promedio!)
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-amber-600 ml-1">
                    {materia.rating_promedio.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <Separator className="my-4" />

        {/* Schedule Blocks */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Calendar className="size-4" />
            Horario de clases
          </div>

          <AnimatePresence>
            {bloquesList.length > 0 ? (
              <div className="space-y-2">
                {bloquesList.map((bloque, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + index * 0.05 }}
                  >
                    <Card className="p-3 bg-muted/50">
                      <div className="flex items-start gap-3">
                        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Clock className="size-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{bloque}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground text-center">
                  No hay información de horario disponible
                </p>
              </Card>
            )}
          </AnimatePresence>

          {/* Location info if available */}
          {materia.bloques && materia.bloques.some(b => b.salon || b.edificio) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pt-2"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                Las ubicaciones pueden variar. Confirma en tu sistema escolar.
              </div>
            </motion.div>
          )}
        </motion.div>

        <Separator className="my-6" />

        {/* Footer Actions */}
        <SheetFooter className="flex-col gap-2 sm:flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full"
          >
            {isAdded ? (
              <Button 
                disabled 
                className="w-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10"
                size="lg"
              >
                <Check className="size-4 mr-2" />
                Ya está agregada
              </Button>
            ) : (
              <Button 
                onClick={handleAdd}
                className="w-full"
                size="lg"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center"
                >
                  <PlusCircle className="size-4 mr-2" />
                  Agregar al horario
                </motion.div>
              </Button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="w-full"
            >
              Cancelar
            </Button>
          </motion.div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
