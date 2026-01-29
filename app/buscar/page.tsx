'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, SlidersHorizontal, Grid3X3, List, Sparkles } from 'lucide-react'
import Navbar from "@/src/components/layout/Navbar"
import { buscarProfesoresYMaterias } from '@/src/lib/supabase/queries'
import ProfessorCard from '@/src/components/features/search/ProfessorCard'
import SearchBar from '@/src/components/features/search/SearchBar'
import EmptyState from '@/src/components/ui/EmptyState'
import CarreraSelector from '@/src/components/ui/CarreraSelector'
import { useCarrera } from '@/src/contexts/CarreraContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#0F1C2E] rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
      <div className="flex items-start gap-3 mb-4">
        <Skeleton className="size-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="size-4 rounded" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Skeleton className="h-14 rounded-lg" />
        <Skeleton className="h-14 rounded-lg" />
      </div>
      <Skeleton className="h-10 rounded-xl" />
    </div>
  )
}

export default function BuscarPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  const [resultados, setResultados] = useState<any[]>([])
  const [cargando, setCargando] = useState(query ? true : false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { carreraId, carreraNombre } = useCarrera()

  const handleSearch = (term: string) => {
    router.push(`/buscar?q=${encodeURIComponent(term)}`)
  }

  useEffect(() => {
    async function obtenerDatos() {
      setCargando(true)
      const data = await buscarProfesoresYMaterias(query, carreraId)
      setResultados(data)
      setCargando(false)
    }
    
    if (query) {
      obtenerDatos()
    }
  }, [query, carreraId])

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220]">
      <Navbar />
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Search Bar Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <SearchBar 
            onSearch={handleSearch} 
            initialValue={query}
            variant="compact"
          />
        </motion.div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          {/* Title & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <div className="size-8 rounded-lg bg-[#00BCD4]/10 dark:bg-cyan-500/20 
                  flex items-center justify-center">
                  <Search className="size-4 text-[#00BCD4]" />
                </div>
                {query ? 'Resultados de búsqueda' : 'Buscar profesores y materias'}
              </h1>
              {query && (
                <p className="font-body text-sm text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2 mt-2">
                  Buscando: 
                  <Badge variant="secondary" className="font-medium">
                    "{query}"
                  </Badge>
                  {carreraNombre && (
                    <>
                      <span>en</span>
                      <Badge variant="outline" className="font-medium text-[#00BCD4] border-[#00BCD4]/30">
                        {carreraNombre}
                      </Badge>
                    </>
                  )}
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <CarreraSelector showLabel={false} />
              
              {/* View Toggle */}
              <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="size-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setViewMode('list')}
                >
                  <List className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count Bar */}
          <div className="flex items-center justify-between p-3 rounded-xl 
            bg-white dark:bg-[#0F1C2E] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-[#00BCD4]" />
              <span className="font-body text-sm text-slate-600 dark:text-slate-300">
                {cargando ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 border-2 border-[#00BCD4] border-t-transparent rounded-full animate-spin" />
                    Buscando coincidencias...
                  </span>
                ) : (
                  <>
                    <span className="font-semibold text-[#00BCD4]">{resultados.length}</span>
                    {' '}resultados encontrados
                  </>
                )}
              </span>
            </div>
            
            <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 text-slate-500">
              <SlidersHorizontal className="size-4" />
              Filtros
            </Button>
          </div>
        </motion.div>

        {/* Results Grid */}
        <AnimatePresence mode="wait">
          {cargando ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`grid gap-4 sm:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1 max-w-3xl mx-auto'
              }`}
            >
              {[...Array(8)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </motion.div>
          ) : resultados.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <EmptyState termino={query} />
              {carreraId && (
                <p className="font-body text-slate-400 mt-4 text-sm">
                  Prueba seleccionando otra carrera o busca sin filtro
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`grid gap-4 sm:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1 max-w-3xl mx-auto'
              }`}
            >
              {resultados.map((item, index) => (
                <ProfessorCard
                  key={item.materia_id || index}
                  id={item.profesor_id}
                  nombre={item.profesor_nombre || "Sin nombre"}
                  facultad={`Materia: ${item.materia_nombre}`}
                  rating={item.rating_promedio ?? null}
                  dificultad={item.dificultad_promedio ?? null}
                  recomendacion={item.recomendacion_pct ?? null}
                  nrc={item.nrc ?? null}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
