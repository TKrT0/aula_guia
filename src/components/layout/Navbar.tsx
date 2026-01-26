'use client';

import Link from 'next/link';
import ThemeToggle from '@/src/components/ui/ThemeToggle';

export default function Navbar() {
  return (
    <header className="w-full border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-background-dark sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <h2 className="text-primary dark:text-white text-xl font-bold">Aula Guía</h2>
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <Link 
            href="/horario"
            className="flex h-10 px-6 items-center justify-center gap-2 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:bg-[#002a42]"
          >
            <span className="material-symbols-outlined text-lg">calendar_month</span>
            <span className="hidden sm:inline">Crear Horario</span>
          </Link>
        </div>
      </div>
    </header>
  );
}