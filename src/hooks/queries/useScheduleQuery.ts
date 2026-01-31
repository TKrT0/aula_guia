'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getUserSchedules, 
  getScheduleWithMaterias, 
  createSchedule,
  addMateriaToSchedule,
  removeMateriaFromSchedule,
  deleteSchedule,
  detectAllConflicts,
  searchMateriasForSchedule,
  type Horario,
  type HorarioMateria
} from '@/src/lib/services/scheduleService'
import { toast } from 'sonner'

// Query keys centralizadas
export const scheduleKeys = {
  all: ['schedules'] as const,
  lists: () => [...scheduleKeys.all, 'list'] as const,
  detail: (id: string) => [...scheduleKeys.all, 'detail', id] as const,
  conflicts: (id: string) => [...scheduleKeys.all, 'conflicts', id] as const,
  search: (term: string, carreraId?: string | null) => 
    [...scheduleKeys.all, 'search', term, carreraId] as const,
}

// Hook para obtener todos los horarios del usuario
export function useSchedulesQuery() {
  return useQuery({
    queryKey: scheduleKeys.lists(),
    queryFn: getUserSchedules,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Hook para obtener un horario específico con sus materias
export function useScheduleDetailQuery(scheduleId: string | null) {
  return useQuery({
    queryKey: scheduleKeys.detail(scheduleId || ''),
    queryFn: () => getScheduleWithMaterias(scheduleId!),
    enabled: !!scheduleId,
    staleTime: 1000 * 60 * 2,
  })
}

// Hook para detectar conflictos
export function useConflictsQuery(scheduleId: string | null) {
  return useQuery({
    queryKey: scheduleKeys.conflicts(scheduleId || ''),
    queryFn: () => detectAllConflicts(scheduleId!),
    enabled: !!scheduleId,
    staleTime: 1000 * 30, // 30 segundos
  })
}

// Hook para buscar materias para agregar al horario
export function useSearchMateriasQuery(term: string, carreraId?: string | null) {
  return useQuery({
    queryKey: scheduleKeys.search(term, carreraId),
    queryFn: () => searchMateriasForSchedule(term, carreraId),
    enabled: term.length >= 2,
    staleTime: 1000 * 60 * 2,
  })
}

// Mutation para crear horario
export function useCreateScheduleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ nombre, semestre }: { nombre: string; semestre?: string }) =>
      createSchedule(nombre, semestre),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() })
        toast.success('Horario creado exitosamente')
      } else {
        toast.error(result.error || 'Error al crear horario')
      }
    },
    onError: () => {
      toast.error('Error al crear horario')
    },
  })
}

// Mutation para agregar materia
export function useAddMateriaMutation(scheduleId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (materia: {
      materia_id: string
      profesor_id: string
      nrc: string
      materia_nombre: string
      profesor_nombre: string
      creditos?: number
    }) => addMateriaToSchedule(scheduleId, materia),
    onSuccess: (result, variables) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(scheduleId) })
        queryClient.invalidateQueries({ queryKey: scheduleKeys.conflicts(scheduleId) })
        toast.success(`${variables.materia_nombre} agregada`)
        
        if (result.conflicts && result.conflicts.length > 0) {
          toast.warning(`¡Atención! Hay ${result.conflicts.length} conflicto(s) de horario`)
        }
      } else {
        toast.error(result.error || 'Error al agregar materia')
      }
    },
    onError: () => {
      toast.error('Error al agregar materia')
    },
  })
}

// Mutation para eliminar materia
export function useRemoveMateriaMutation(scheduleId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (materiaId: string) => removeMateriaFromSchedule(materiaId, scheduleId),
    onMutate: async (materiaId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: scheduleKeys.detail(scheduleId) })
      
      const previousSchedule = queryClient.getQueryData<Horario>(scheduleKeys.detail(scheduleId))
      
      if (previousSchedule) {
        queryClient.setQueryData<Horario>(scheduleKeys.detail(scheduleId), {
          ...previousSchedule,
          materias: previousSchedule.materias?.filter(m => m.id !== materiaId) || [],
        })
      }
      
      return { previousSchedule }
    },
    onError: (_err, _materiaId, context) => {
      // Rollback on error
      if (context?.previousSchedule) {
        queryClient.setQueryData(scheduleKeys.detail(scheduleId), context.previousSchedule)
      }
      toast.error('Error al eliminar materia')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.conflicts(scheduleId) })
      toast.success('Materia eliminada')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(scheduleId) })
    },
  })
}

// Mutation para eliminar horario
export function useDeleteScheduleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (scheduleId: string) => deleteSchedule(scheduleId),
    onSuccess: (result, scheduleId) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() })
        queryClient.removeQueries({ queryKey: scheduleKeys.detail(scheduleId) })
        toast.success('Horario eliminado')
      } else {
        toast.error(result.error || 'Error al eliminar horario')
      }
    },
    onError: () => {
      toast.error('Error al eliminar horario')
    },
  })
}
