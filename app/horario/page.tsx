'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import LoginPrompt from '@/src/components/features/schedule/LoginPrompt'
import ScheduleClient from '@/src/components/features/schedule/ScheduleClient'
import type { User, Session } from '@supabase/supabase-js'

export default function HorarioPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    // Función para verificar y establecer usuario
    const initAuth = async () => {
      try {
        // Primero intentar obtener sesión existente
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
          setLoading(false)
          return
        }

        // Si no hay sesión, verificar si hay código en la URL (OAuth callback)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        
        if (accessToken) {
          // Hay tokens en el hash, Supabase los procesará automáticamente
          const { data: { user: authUser } } = await supabase.auth.getUser()
          setUser(authUser)
          // Limpiar el hash de la URL
          window.history.replaceState(null, '', window.location.pathname)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Auth error:', error)
        setLoading(false)
      }
    }
    
    initAuth()

    // Escuchar cambios de auth 
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPrompt redirectTo="/horario" />
  }

  return <ScheduleClient user={user} />
}
