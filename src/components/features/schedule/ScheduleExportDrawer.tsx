'use client'

import { useState } from 'react'
import MobileDrawer from '@/src/components/ui/MobileDrawer'
import type { HorarioMateria } from '@/src/lib/services/scheduleService'
import { exportAsImage } from '@/src/lib/export/exportSchedule' 
import { generateSchedulePDF } from '@/src/components/features/schedule/SchedulePDF' 

interface Props {
  isOpen: boolean
  onClose: () => void
  scheduleName: string
  materias: HorarioMateria[]
  imageElementId: string
}

export default function ScheduleExportDrawer({
  isOpen,
  onClose,
  scheduleName,
  materias,
  imageElementId,
}: Props) {
  const [loading, setLoading] = useState<'pdf' | 'png' | null>(null)

  const onExportPDF = async () => {
    try {
      setLoading('pdf')
      await generateSchedulePDF(scheduleName, materias)
      onClose()
    } finally {
      setLoading(null)
    }
  }

  const onExportPNG = async () => {
    try {
      setLoading('png')
      await exportAsImage(imageElementId, `Horario_${scheduleName.replace(/\s+/g, '_')}`)
      onClose()
    } finally {
      setLoading(null)
    }
  }

  return (
    <MobileDrawer isOpen={isOpen} onClose={onClose} title="Exportar horario">
      <div className="p-4 space-y-3">
        <button
          onClick={onExportPDF}
          disabled={loading !== null}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-60"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">picture_as_pdf</span>
            <div className="text-left">
              <div className="font-semibold text-slate-900">Exportar PDF</div>
              <div className="text-xs text-slate-500">Ideal para imprimir o guardar</div>
            </div>
          </div>
          {loading === 'pdf' ? (
            <span className="text-xs text-slate-500">Generando…</span>
          ) : (
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          )}
        </button>

        <button
          onClick={onExportPNG}
          disabled={true}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white opacity-60 cursor-not-allowed"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">image</span>
            <div className="text-left">
              <div className="font-semibold text-slate-900">Exportar imagen (PNG)</div>
              <div className="text-xs text-slate-500">Próximamente</div>
            </div>
          </div>
          <span className="text-xs text-slate-500">Próximamente</span>
        </button>

        <p className="text-[11px] text-slate-500 text-center pt-1">
          Consejo: usa PDF para imprimir o guardar tu horario.
        </p>
      </div>
    </MobileDrawer>
  )
}
