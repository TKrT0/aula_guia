import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos - datos "frescos"
      gcTime: 1000 * 60 * 30, // 30 minutos - garbage collection (antes cacheTime)
      retry: 2,
      refetchOnWindowFocus: false, // Evitar refetch innecesario
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
})
