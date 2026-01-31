'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/src/lib/supabase/client'

interface Carrera {
  id: string
  codigo: string
  nombre: string
  facultad?: string
}

// Carreras fallback (hardcoded) para cuando no hay conexión
const CARRERAS_FALLBACK: Carrera[] = [
  { id: '1', codigo: 'ICC', nombre: 'Ing. en Ciencias de la Computación' },
  { id: '2', codigo: 'LICC', nombre: 'Lic. en Ciencias de la Computación' },
  { id: '3', codigo: 'ITI', nombre: 'Ing. en Tecnologías de la Información' },
]

async function fetchCarreras(): Promise<Carrera[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('carreras')
    .select('id, codigo, nombre, facultad')
    .order('nombre')

  if (error) {
    console.error('Error fetching carreras:', error)
    // Return fallback on error
    return CARRERAS_FALLBACK
  }

  return data || CARRERAS_FALLBACK
}

export function useCarrerasQuery() {
  return useQuery({
    queryKey: ['carreras'],
    queryFn: fetchCarreras,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - carreras rarely change
    gcTime: 1000 * 60 * 60 * 24 * 7, // Keep in cache for 7 days
    placeholderData: CARRERAS_FALLBACK,
    retry: 2,
    retryDelay: 1000,
  })
}

// Prefetch carreras for better UX
export async function prefetchCarreras(queryClient: ReturnType<typeof import('@tanstack/react-query').useQueryClient>) {
  await queryClient.prefetchQuery({
    queryKey: ['carreras'],
    queryFn: fetchCarreras,
    staleTime: 1000 * 60 * 60 * 24,
  })
}
