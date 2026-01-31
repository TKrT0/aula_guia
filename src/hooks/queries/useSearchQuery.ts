'use client'

import { useQuery } from '@tanstack/react-query'
import { buscarProfesoresYMaterias, obtenerSugerencias } from '@/src/lib/supabase/queries'
import { useFuzzySearch } from '@/src/hooks/useFuzzySearch'

// Query keys centralizadas
export const searchKeys = {
  all: ['search'] as const,
  results: (term: string, carreraId?: string | null) => 
    [...searchKeys.all, 'results', term, carreraId] as const,
  suggestions: (term: string, carreraId?: string | null) => 
    [...searchKeys.all, 'suggestions', term, carreraId] as const,
}

interface UseSearchQueryOptions {
  term: string
  carreraId?: string | null
  enabled?: boolean
}

export function useSearchQuery({ term, carreraId, enabled = true }: UseSearchQueryOptions) {
  const { search: fuzzySearch, isReady: fuzzyReady } = useFuzzySearch({ carreraId, limit: 50 })

  return useQuery({
    queryKey: searchKeys.results(term, carreraId),
    queryFn: async () => {
      // Intentar búsqueda fuzzy primero (instantánea)
      if (fuzzyReady && term.trim()) {
        const fuzzyResults = fuzzySearch(term)
        if (fuzzyResults.length > 0) {
          return { results: fuzzyResults, source: 'fuzzy' as const }
        }
      }
      
      // Fallback a Supabase
      const results = await buscarProfesoresYMaterias(term, carreraId)
      return { results, source: 'supabase' as const }
    },
    enabled: enabled && term.length >= 2,
    staleTime: 1000 * 60 * 2, // 2 minutos
  })
}

export function useSuggestionsQuery({ term, carreraId, enabled = true }: UseSearchQueryOptions) {
  return useQuery({
    queryKey: searchKeys.suggestions(term, carreraId),
    queryFn: () => obtenerSugerencias(term, carreraId),
    enabled: enabled && term.length >= 2,
    staleTime: 1000 * 60, // 1 minuto
  })
}
