'use client'

import Link from 'next/link'
import { signOut } from '@/src/lib/services/authService'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import type { ConflictInfo } from '@/src/lib/services/scheduleService'

interface ScheduleHeaderProps {
  user: User | null
  totalCreditos: number
  conflicts: ConflictInfo[]
  scheduleName: string
  onExport?: () => void
}

export default function ScheduleHeader({ 
  user, 
  totalCreditos, 
  conflicts, 
  scheduleName,
  onExport 
}: ScheduleHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  const qualityScore = conflicts.length === 0 ? 10 : Math.max(0, 10 - conflicts.length * 2)

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-6 py-3 shrink-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="size-8 bg-primary/10 text-primary flex items-center justify-center rounded-lg">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight">Aula Guía</h2>
        </Link>
        
        <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block" />
        
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
          <span className="text-primary font-bold">Simulador</span>
          <Link href="/" className="hover:text-slate-800 transition-colors">Buscar Profesores</Link>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        {/* Stats */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Carga Actual</span>
            <span className="text-slate-900 font-bold text-sm">{totalCreditos} créditos</span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Estado</span>
            <div className={`flex items-center gap-1 font-bold text-sm ${conflicts.length === 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              <span>{conflicts.length === 0 ? 'Sin conflictos' : `${conflicts.length} conflicto${conflicts.length > 1 ? 's' : ''}`}</span>
              <span className="material-symbols-outlined text-[16px]">
                {conflicts.length === 0 ? 'check_circle' : 'warning'}
              </span>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <button 
          onClick={onExport}
          className="hidden sm:flex items-center justify-center gap-2 cursor-pointer overflow-hidden rounded-lg h-9 px-4 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold shadow-sm shadow-blue-200"
        >
          <span className="material-symbols-outlined text-[20px]">calendar_add_on</span>
          <span className="truncate">Exportar</span>
        </button>

        {/* User Menu */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs text-slate-500">Conectado como</span>
              <span className="text-sm font-medium text-slate-700 truncate max-w-[150px]">
                {user.user_metadata?.full_name || user.email}
              </span>
            </div>
            <div className="relative group">
              <div 
                className="bg-center bg-no-repeat bg-cover rounded-full size-9 border border-slate-200 cursor-pointer"
                style={{ 
                  backgroundImage: user.user_metadata?.avatar_url 
                    ? `url("${user.user_metadata.avatar_url}")` 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              />
              <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-slate-200 py-2 min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {user.user_metadata?.full_name || 'Usuario'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
