'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import { 
  initFuseIndex, 
  fuzzySearch, 
  fuzzySuggestions, 
  isFuseIndexReady,
  type SearchableItem 
} from '@/src/lib/search/fuzzySearch'

interface UseFuzzySearchOptions {
  carreraId?: string | null
  limit?: number
}

interface UseFuzzySearchReturn {
  search: (term: string) => SearchableItem[]
  suggestions: (term: string) => SearchableItem[]
  isReady: boolean
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// Cache global para evitar múltiples fetches
let globalDataPromise: Promise<SearchableItem[]> | null = null
let globalDataLoaded = false

async function fetchAllSearchData(): Promise<SearchableItem[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('vista_buscador')
    .select('materia_id, materia_nombre, profesor_id, profesor_nombre, nrc, carrera_id, carrera_nombre, rating_promedio, dificultad_promedio, recomendacion_pct')
    .limit(1000) // Ajustar según tamaño esperado de datos
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data || []
}

export function useFuzzySearch(options: UseFuzzySearchOptions = {}): UseFuzzySearchReturn {
  const { carreraId, limit = 50 } = options
  const [isReady, setIsReady] = useState(isFuseIndexReady())
  const [isLoading, setIsLoading] = useState(!globalDataLoaded)
  const [error, setError] = useState<string | null>(null)
  const initializedRef = useRef(false)

  const loadData = useCallback(async () => {
    if (globalDataLoaded && isFuseIndexReady()) {
      setIsReady(true)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Usar promise global para evitar múltiples fetches simultáneos
      if (!globalDataPromise) {
        globalDataPromise = fetchAllSearchData()
      }
      
      const data = await globalDataPromise
      initFuseIndex(data)
      globalDataLoaded = true
      setIsReady(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos de búsqueda')
      globalDataPromise = null // Reset para permitir retry
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true
      loadData()
    }
  }, [loadData])

  const search = useCallback((term: string): SearchableItem[] => {
    if (!isReady) return []
    return fuzzySearch(term, carreraId, limit)
  }, [isReady, carreraId, limit])

  const suggestions = useCallback((term: string): SearchableItem[] => {
    if (!isReady) return []
    return fuzzySuggestions(term, carreraId, 8)
  }, [isReady, carreraId])

  const refetch = useCallback(async () => {
    globalDataPromise = null
    globalDataLoaded = false
    await loadData()
  }, [loadData])

  return {
    search,
    suggestions,
    isReady,
    isLoading,
    error,
    refetch
  }
}
