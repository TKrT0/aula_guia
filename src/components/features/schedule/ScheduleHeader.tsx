'use client'

import Link from 'next/link'
import { signOut } from '@/src/lib/services/authService'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import type { ConflictInfo } from '@/src/lib/services/scheduleService'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  GraduationCap, 
  Calendar, 
  ChevronDown, 
  Download, 
  Image, 
  CalendarDays, 
  FileText, 
  Folder,
  Share2,
  Search,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ScheduleHeaderProps {
  user: User | null
  totalCreditos: number
  conflicts: ConflictInfo[]
  scheduleName: string
  onExport?: (format: 'image' | 'calendar' | 'print') => void
  onManageSchedules?: () => void
  onOpenSearch?: () => void
  onOpenExport?: () => void
  onShowConflicts?: () => void
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
  onOpenExport,
  onShowConflicts,
  isExporting = false,
  scheduleCount = 1,
}: ScheduleHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <TooltipProvider delayDuration={300}>
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1C2E] px-4 md:px-6 py-3 shrink-0 z-20 shadow-sm"
      >
        {/* Left Section: Logo + Schedule Selector */}
        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="size-8 bg-gradient-to-br from-[#003A5C] to-[#00507A] dark:from-[#00BCD4] dark:to-[#2B8CEE] text-white flex items-center justify-center rounded-lg shadow-md"
            >
              <GraduationCap className="size-5" />
            </motion.div>
            <h2 className="text-slate-800 dark:text-white text-lg font-bold leading-tight tracking-tight hidden sm:block group-hover:text-[#00BCD4] dark:group-hover:text-cyan-400 transition-colors">
              Aula Guía
            </h2>
          </Link>
          
          <Separator orientation="vertical" className="h-6 hidden md:block" />
          
          {/* Schedule Selector - Desktop */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="secondary"
              onClick={onManageSchedules}
              className="hidden md:flex items-center gap-2 h-9"
            >
              <Calendar className="size-4 text-primary" />
              <span className="max-w-[150px] truncate font-semibold">{scheduleName}</span>
              {scheduleCount > 1 && (
                <Badge variant="secondary" className="text-xs px-1.5">
                  +{scheduleCount - 1}
                </Badge>
              )}
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </motion.div>
        </div>

        {/* Right Section: Stats + Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Stats Badges - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50"
                >
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Carga</span>
                  <Badge variant="secondary" className="font-bold">
                    {totalCreditos} cr
                  </Badge>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total de créditos inscritos</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={conflicts.length > 0 ? onShowConflicts : undefined}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    conflicts.length === 0 
                      ? 'bg-emerald-500/10' 
                      : 'bg-destructive/10 cursor-pointer hover:bg-destructive/20'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {conflicts.length === 0 ? (
                      <motion.div
                        key="ok"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="size-4 text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-600">OK</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="conflicts"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-1.5"
                      >
                        <AlertTriangle className="size-4 text-destructive" />
                        <span className="text-sm font-bold text-destructive">
                          {conflicts.length} conflicto{conflicts.length !== 1 ? 's' : ''}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                {conflicts.length === 0 
                  ? 'Sin conflictos de horario' 
                  : 'Clic para ver los conflictos'
                }
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Export Dropdown - Desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                className="hidden sm:flex gap-2"
                disabled={isExporting}
              >
                <AnimatePresence mode="wait">
                  {isExporting ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Loader2 className="size-4 animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="download"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Download className="size-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span>{isExporting ? 'Exportando...' : 'Exportar'}</span>
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Opciones de exportación</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onExport?.('image')}
                className="cursor-pointer"
              >
                <Image className="size-4 text-emerald-500" />
                <div className="flex flex-col">
                  <span>Descargar Imagen</span>
                  <span className="text-xs text-muted-foreground">PNG de alta calidad</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onExport?.('calendar')}
                className="cursor-pointer"
              >
                <CalendarDays className="size-4 text-blue-500" />
                <div className="flex flex-col">
                  <span>Calendario (ICS)</span>
                  <span className="text-xs text-muted-foreground">Google/Apple Calendar</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onExport?.('print')}
                className="cursor-pointer"
              >
                <FileText className="size-4 text-amber-500" />
                <div className="flex flex-col">
                  <span>Imprimir / PDF</span>
                  <span className="text-xs text-muted-foreground">Guardar como PDF</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onManageSchedules}
                >
                  <Folder className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Gestionar horarios</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onOpenExport}
                >
                  <Share2 className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Exportar</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onOpenSearch}
                >
                  <Search className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Buscar materias</TooltipContent>
            </Tooltip>
          </div>

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <div 
                    className="bg-center bg-no-repeat bg-cover rounded-full size-9 border-2 border-border cursor-pointer"
                    style={{ 
                      backgroundImage: user.user_metadata?.avatar_url 
                        ? `url("${user.user_metadata.avatar_url}")` 
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium truncate">
                    {user.user_metadata?.full_name || 'Usuario'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="size-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </motion.header>
    </TooltipProvider>
  )
}
