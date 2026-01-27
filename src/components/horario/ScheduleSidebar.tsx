'use client'

import { useState, useEffect, useCallback } from 'react'
import { searchMateriasForSchedule } from '@/src/lib/services/scheduleService'
import { useCarrera } from '@/src/contexts/CarreraContext'
import CarreraSelector from '@/src/components/ui/CarreraSelector'
import type { MateriaHorario } from '@/src/lib/services/scheduleService'

interface MateriaResult {
  materia_id: string
  profesor_id: string
  materia_nombre: string
  profesor_nombre: string
  nrc: string
  rating_promedio?: number
  creditos?: number
  bloques?: MateriaHorario[]
}

interface ScheduleSidebarProps {
  onAddMateria: (materia: MateriaResult) => void
  addedNRCs: string[]
}

const DAY_ABREV: Record<string, string> = {
  lunes: 'Lun',
  martes: 'Mar',
  miercoles: 'Mié',
  miércoles: 'Mié',
  jueves: 'Jue',
  viernes: 'Vie',
  sabado: 'Sáb',
  sábado: 'Sáb',
  domingo: 'Dom',
}

function hhmm(time: string) {
  return time?.slice(0, 5) ?? '' // "07:00:00" -> "07:00"
}

function formatHorarioResumen(bloques?: { dia: string; hora_inicio: string; hora_fin: string }[]) {
  if (!bloques || bloques.length === 0) return ''

  const groups = new Map<string, { inicio: string; fin: string; dias: string[] }>()
  for (const b of bloques) {
    const inicio = hhmm(b.hora_inicio)
    const fin = hhmm(b.hora_fin)
    const key = `${inicio}-${fin}`
    const dia = DAY_ABREV[b.dia] ?? b.dia

    const g = groups.get(key) ?? { inicio, fin, dias: [] }
    g.dias.push(dia)
    groups.set(key, g)
  }

  const parts: string[] = []
  for (const g of groups.values()) {
    const diasUnique = Array.from(new Set(g.dias))
    parts.push(`${diasUnique.join(', ')} ${g.inicio}–${g.fin}`)
  }

  return parts.slice(0, 2).join(' · ')
}


export default function ScheduleSidebar({ onAddMateria, addedNRCs }: ScheduleSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<MateriaResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { carreraId, carreraNombre } = useCarrera()

  // Debounced search - ahora con filtro de carrera
  const search = useCallback(async (term: string, cId: string | null) => {
    if (term.length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    const data = await searchMateriasForSchedule(term, cId)
    setResults(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      search(searchTerm, carreraId)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, carreraId, search])

  const isAdded = (nrc: string) => addedNRCs.includes(nrc)

  return (
    <aside className="w-80 md:w-96 flex flex-col border-r border-slate-200 bg-white z-10 shrink-0">
      {/* Selector de Carrera */}
      <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-primary/5 to-cyan-500/5">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Buscando en:
        </div>
        <CarreraSelector showLabel={false} className="w-full" />
        {!carreraId && (
          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
            <span>⚠️</span> Selecciona tu carrera para ver materias
          </p>
        )}
      </div>

      {/* Search Area */}
      <div className="p-4 border-b border-slate-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400">search</span>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-slate-100 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Buscar materia o NRC..."
          />
        </div>
        <div className="flex items-center justify-between mt-3 px-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {results.length > 0 ? `${results.length} resultados` : 'Resultados'}
          </span>
          {carreraNombre && (
            <span className="text-xs text-primary font-medium">
              {carreraNombre.split(' ')[0]}
            </span>
          )}
        </div>
      </div>

      {/* List of Classes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {!isLoading && results.length === 0 && searchTerm.length >= 2 && (
          <div className="text-center py-8 text-slate-500">
            <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
            <p className="text-sm">No se encontraron materias</p>
          </div>
        )}

        {!isLoading && searchTerm.length < 2 && (
          <div className="text-center py-8 text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2 block">school</span>
            <p className="text-sm">Busca una materia o NRC para agregarla a tu horario</p>
          </div>
        )}

        {results.map((materia) => {
          const added = isAdded(materia.nrc)
          const resumen = formatHorarioResumen(materia.bloques)
          
          return (
            <div
              key={`${materia.materia_id}-${materia.nrc}`}
              className={`group flex flex-col bg-white border rounded-lg p-3 transition-all relative overflow-hidden ${
                added 
                  ? 'border-slate-200 opacity-60' 
                  : 'border-slate-200 hover:border-primary/50 hover:shadow-md cursor-pointer'
              }`}
              onClick={() => !added && onAddMateria(materia)}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${added ? 'bg-slate-400' : 'bg-primary group-hover:bg-primary/80'} transition-colors`} />
              
              <div className="flex justify-between items-start mb-1 pl-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 leading-tight truncate">
                    {materia.materia_nombre}
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">
                    NRC {materia.nrc} {materia.creditos ? `• ${materia.creditos} Créditos` : ''}
                  </span>
                </div>
                {materia.rating_promedio && (
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-xs font-medium border border-amber-100 shrink-0">
                    <span className="material-symbols-outlined text-[14px]">star</span>
                    {materia.rating_promedio.toFixed(1)}
                  </div>
                )}
              </div>
              <div className="pl-2 flex items-start justify-between gap-2 mt-2">
  <div className="min-w-0 flex-1">
    <p className="text-xs text-slate-600 flex items-center gap-1 truncate">
      <span className="material-symbols-outlined text-[14px] text-slate-400">person</span>
      {materia.profesor_nombre}
    </p>

    {resumen && (
      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 line-clamp-2">
        <span className="material-symbols-outlined text-[12px] text-slate-400">schedule</span>
        {resumen}
      </p>
    )}
  </div>

  <div className="shrink-0 pt-0.5">
    {added ? (
      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
        <span className="material-symbols-outlined text-[14px]">check</span>
        Agregada
      </span>
    ) : (
      <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">
        add_circle
      </span>
    )}
  </div>
</div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
