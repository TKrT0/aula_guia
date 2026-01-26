'use client'

import { useState } from 'react'
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
  onExport?: (format: 'image' | 'calendar' | 'print') => void
  onManageSchedules?: () => void
  onOpenSearch?: () => void
  isExporting?: boolean
  scheduleCount?: number
  isMobile?: boolean
}

export default function ScheduleHeader({ 
  user, 
  totalCreditos, 
  conflicts, 
  scheduleName,
  onExport,
  onManageSchedules,
  onOpenSearch,
  isExporting = false,
  scheduleCount = 1,
  isMobile = false
}: ScheduleHeaderProps) {
  const router = useRouter()
  const [showExportMenu, setShowExportMenu] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3 shrink-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="size-8 bg-primary/10 text-primary flex items-center justify-center rounded-lg">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Aula Guía</h2>
        </Link>
        
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-600 mx-2 hidden md:block" />
        
        {/* Schedule Selector */}
        <button
          onClick={onManageSchedules}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          <span className="material-symbols-outlined text-lg text-primary">calendar_month</span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[150px] truncate">{scheduleName}</span>
          {scheduleCount > 1 && (
            <span className="text-xs text-slate-500 dark:text-slate-400">+{scheduleCount - 1}</span>
          )}
          <span className="material-symbols-outlined text-sm text-slate-400">expand_more</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Stats */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Carga</span>
            <span className="text-slate-900 dark:text-white font-bold text-sm">{totalCreditos} cr</span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-600" />
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Estado</span>
            <div className={`flex items-center gap-1 font-bold text-sm ${conflicts.length === 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              <span>{conflicts.length === 0 ? 'OK' : `${conflicts.length} ⚠`}</span>
              <span className="material-symbols-outlined text-[16px]">
                {conflicts.length === 0 ? 'check_circle' : 'warning'}
              </span>
            </div>
          </div>
        </div>

        {/* Export Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={isExporting}
            className="hidden sm:flex items-center justify-center gap-2 cursor-pointer overflow-hidden rounded-lg h-9 px-4 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold shadow-sm shadow-blue-200 disabled:opacity-50"
          >
            {isExporting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <span className="material-symbols-outlined text-[20px]">download</span>
            )}
            <span className="truncate">{isExporting ? 'Exportando...' : 'Exportar'}</span>
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
          
          {showExportMenu && !isExporting && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
              <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600 py-2 min-w-[200px] z-20">
                <button
                  onClick={() => {
                    onExport?.('image')
                    setShowExportMenu(false)
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg text-emerald-500">image</span>
                  <div>
                    <div className="font-medium">Descargar Imagen</div>
                    <div className="text-xs text-slate-400">PNG de alta calidad</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onExport?.('calendar')
                    setShowExportMenu(false)
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg text-blue-500">calendar_month</span>
                  <div>
                    <div className="font-medium">Sincronizar Calendario</div>
                    <div className="text-xs text-slate-400">Exportar a Google/Apple</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onExport?.('print')
                    setShowExportMenu(false)
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg text-amber-500">print</span>
                  <div>
                    <div className="font-medium">Imprimir / PDF</div>
                    <div className="text-xs text-slate-400">Guardar como PDF</div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Manage Schedules Mobile */}
        <button
          onClick={onManageSchedules}
          className="md:hidden flex items-center justify-center size-9 rounded-lg bg-slate-100 dark:bg-slate-700"
        >
          <span className="material-symbols-outlined text-lg text-slate-600 dark:text-slate-300">folder</span>
        </button>

        {/* User Menu */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div 
                className="bg-center bg-no-repeat bg-cover rounded-full size-9 border border-slate-200 dark:border-slate-600 cursor-pointer"
                style={{ 
                  backgroundImage: user.user_metadata?.avatar_url 
                    ? `url("${user.user_metadata.avatar_url}")` 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              />
              <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600 py-2 min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                    {user.user_metadata?.full_name || 'Usuario'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
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
