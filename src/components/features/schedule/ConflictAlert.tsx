'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ConflictInfo } from '@/src/lib/services/scheduleService'

interface ConflictAlertProps {
  conflicts: ConflictInfo[]
  onDismiss?: () => void
}

const DAY_NAMES: Record<string, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado'
}

export default function ConflictAlert({ conflicts, onDismiss }: ConflictAlertProps) {
  if (conflicts.length === 0) return null

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50"
    >
      <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center shrink-0"
          >
            <AlertTriangle className="size-5 text-red-600" />
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-red-800 text-sm mb-1">
              {conflicts.length} conflicto{conflicts.length > 1 ? 's' : ''} detectado{conflicts.length > 1 ? 's' : ''}
            </h3>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {conflicts.slice(0, 3).map((conflict, index) => (
                <div key={index} className="text-xs text-red-700 bg-red-100/50 rounded-lg p-2">
                  <p className="font-semibold">
                    {conflict.materia1.materia_nombre} vs {conflict.materia2.materia_nombre || 'Nueva materia'}
                  </p>
                  <p className="opacity-80">
                    {DAY_NAMES[conflict.dia.toLowerCase()] || conflict.dia} • {conflict.hora_inicio} - {conflict.hora_fin}
                  </p>
                </div>
              ))}
              {conflicts.length > 3 && (
                <p className="text-xs text-red-600 font-medium">
                  +{conflicts.length - 3} conflicto{conflicts.length - 3 > 1 ? 's' : ''} más
                </p>
              )}
            </div>

            <p className="text-xs text-red-600 mt-2">
              Considera cambiar de NRC para resolver los conflictos.
            </p>
          </div>

          {onDismiss && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDismiss}
              className="text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50"
            >
              <X className="size-5" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
