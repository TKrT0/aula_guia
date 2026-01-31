'use client'

import { useState, useEffect, useCallback } from 'react'
import { searchMateriasForSchedule } from '@/src/lib/services/scheduleService'
import { useCarrera } from '@/src/contexts/CarreraContext'
import CarreraSelector from '@/src/components/ui/CarreraSelector'
import type { MateriaHorario } from '@/src/lib/services/scheduleService'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  SearchX, 
  GraduationCap, 
  User, 
  Clock, 
  Star, 
  Check, 
  PlusCircle,
  AlertTriangle,
  Eye
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatBlocksSummary } from '@/src/lib/schedule'

export interface MateriaResult {
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
  onPreviewMateria?: (materia: MateriaResult) => void
  addedNRCs: string[]
  variant?: 'sidebar' | 'drawer'
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
  }
}

export default function ScheduleSidebar({ onAddMateria, onPreviewMateria, addedNRCs, variant = 'sidebar' }: ScheduleSidebarProps) {
  const isDrawer = variant === 'drawer'
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<MateriaResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { carreraId, carreraNombre } = useCarrera()

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

  const handleCardClick = (materia: MateriaResult, added: boolean) => {
    if (added) return
    if (onPreviewMateria) {
      onPreviewMateria(materia)
    } else {
      onAddMateria(materia)
    }
  }

  const handleQuickAdd = (e: React.MouseEvent, materia: MateriaResult) => {
    e.stopPropagation()
    onAddMateria(materia)
  }

  return (
    <motion.aside 
      initial={isDrawer ? { opacity: 0 } : { x: -20, opacity: 0 }}
      animate={isDrawer ? { opacity: 1 } : { x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={isDrawer 
        ? "w-full flex flex-col bg-background" 
        : "w-72 sm:w-80 md:w-96 flex flex-col border-r border-border bg-background z-10 shrink-0"
      }
    >
      {/* Selector de Carrera */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-cyan-500/5">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Buscando en:
        </div>
        <CarreraSelector showLabel={false} className="w-full" />
        <AnimatePresence>
          {!carreraId && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-amber-600 mt-2 flex items-center gap-1"
            >
              <AlertTriangle className="size-3" />
              Selecciona tu carrera para ver materias
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Search Area */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 w-full"
            placeholder="Buscar materia o NRC..."
          />
        </div>
        <div className="flex items-center justify-between mt-3 px-1">
          <Badge variant="secondary" className="text-xs">
            {results.length > 0 ? `${results.length} resultados` : 'Resultados'}
          </Badge>
          {carreraNombre && (
            <span className="text-xs text-primary font-medium truncate max-w-[120px]">
              {carreraNombre.split(' ')[0]}
            </span>
          )}
        </div>
      </div>

      {/* List of Classes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
        {/* Loading State */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-3">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </Card>
              ))}
            </motion.div>
          )}

          {/* Empty State - No Results */}
          {!isLoading && results.length === 0 && searchTerm.length >= 2 && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <SearchX className="size-12 text-muted-foreground mx-auto mb-3" />
              </motion.div>
              <p className="text-sm text-muted-foreground">No se encontraron materias</p>
              <p className="text-xs text-muted-foreground mt-1">Intenta con otro término de búsqueda</p>
            </motion.div>
          )}

          {/* Empty State - Initial */}
          {!isLoading && searchTerm.length < 2 && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <GraduationCap className="size-12 text-muted-foreground mx-auto mb-3" />
              </motion.div>
              <p className="text-sm text-muted-foreground">
                Busca una materia o NRC
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                para agregarla a tu horario
              </p>
            </motion.div>
          )}

          {/* Results List */}
          {!isLoading && results.length > 0 && (
            <motion.div
              key="results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {results.map((materia) => {
                const added = isAdded(materia.nrc)
                const resumen = formatBlocksSummary(materia.bloques)
                
                return (
                  <motion.div
                    key={`${materia.materia_id}-${materia.nrc}`}
                    variants={itemVariants}
                    layout
                  >
                    <Card
                      className={`group relative overflow-hidden transition-all duration-200 ${
                        added 
                          ? 'opacity-60 cursor-default' 
                          : 'cursor-pointer hover:shadow-lg hover:border-primary/50 hover:-translate-y-0.5'
                      }`}
                      onClick={() => handleCardClick(materia, added)}
                    >
                      {/* Left accent bar */}
                      <motion.div 
                        className={`absolute left-0 top-0 bottom-0 w-1 ${
                          added ? 'bg-muted-foreground' : 'bg-primary'
                        }`}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      <div className="p-3 pl-4">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 min-w-0 pr-2">
                            <h4 className="text-sm font-bold text-foreground leading-tight truncate">
                              {materia.materia_nombre}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground font-mono">
                                NRC {materia.nrc}
                              </span>
                              {materia.creditos && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                  {materia.creditos} cr
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {materia.rating_promedio && (
                            <motion.div 
                              whileHover={{ scale: 1.1 }}
                              className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded text-xs font-medium border border-amber-200 dark:border-amber-500/20 shrink-0"
                            >
                              <Star className="size-3 fill-current" />
                              {materia.rating_promedio.toFixed(1)}
                            </motion.div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1 space-y-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                              <User className="size-3 shrink-0" />
                              {materia.profesor_nombre}
                            </p>

                            {resumen && (
                              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                                <Clock className="size-3 shrink-0" />
                                <span className="truncate">{resumen}</span>
                              </p>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="shrink-0 flex items-center gap-1">
                            {added ? (
                              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-500/10">
                                <Check className="size-3 mr-1" />
                                Agregada
                              </Badge>
                            ) : (
                              <>
                                {/* Preview button (eye icon) */}
                                {onPreviewMateria && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onPreviewMateria(materia)
                                    }}
                                  >
                                    <Eye className="size-4" />
                                  </Button>
                                )}
                                {/* Quick add button */}
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7 text-primary hover:text-primary hover:bg-primary/10"
                                    onClick={(e) => handleQuickAdd(e, materia)}
                                  >
                                    <PlusCircle className="size-5" />
                                  </Button>
                                </motion.div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  )
}
