'use client'

import Link from 'next/link'
import { GraduationCap, Calendar, Search } from 'lucide-react'
import ThemeToggle from '@/src/components/ui/ThemeToggle'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800 
      bg-white/80 dark:bg-[#0B1220]/80 backdrop-blur-lg 
      sticky top-0 z-50 transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group"
        >
          <div className="size-9 bg-gradient-to-br from-[#003A5C] to-[#00507A] 
            dark:from-[#00BCD4] dark:to-[#2B8CEE]
            rounded-xl flex items-center justify-center 
            shadow-md group-hover:shadow-lg transition-shadow">
            <GraduationCap className="size-5 text-white" />
          </div>
          <span className="font-display text-lg font-bold text-[#003A5C] dark:text-white">
            Aula Guía
          </span>
        </Link>
        
        {/* Nav Links (desktop) */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/buscar"
            className="font-body text-sm text-slate-600 dark:text-slate-400 
              hover:text-[#00BCD4] dark:hover:text-cyan-400 transition-colors
              flex items-center gap-1.5"
          >
            <Search className="size-4" />
            Buscar
          </Link>
          <Link 
            href="/horario"
            className="font-body text-sm text-slate-600 dark:text-slate-400 
              hover:text-[#00BCD4] dark:hover:text-cyan-400 transition-colors
              flex items-center gap-1.5"
          >
            <Calendar className="size-4" />
            Mi Horario
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* ThemeToggle deshabilitado temporalmente */}
          {/* <ThemeToggle /> */}
          
          <Button 
            asChild
            size="sm"
            className="font-body font-semibold
              bg-[#003A5C] hover:bg-[#00507A] dark:bg-[#00BCD4] dark:hover:bg-[#00ACC1]
              text-white dark:text-[#0B1220]
              shadow-md hover:shadow-lg transition-all"
          >
            <Link href="/horario" className="flex items-center gap-2">
              <Calendar className="size-4" />
              <span className="hidden sm:inline">Crear Horario</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}