'use client'

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
    <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50">
      <div className="bg-red-50 border border-red-200 rounded-xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-red-600">warning</span>
          </div>
          
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
            <button
              onClick={onDismiss}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
