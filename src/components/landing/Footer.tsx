'use client'

import Link from 'next/link'
import { Github, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative py-12 px-6 bg-white dark:bg-[#0B1220] border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo y descripción */}
          <div className="text-center md:text-left">
            <Link href="/" className="font-display text-xl font-bold text-text dark:text-white">
              Aula Guía
            </Link>
            <p className="font-body text-sm text-muted dark:text-slate-500 mt-1">
              Elige a tus profesores con datos reales.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link 
              href="/buscar" 
              className="font-body text-sm text-muted dark:text-slate-400 hover:text-accent dark:hover:text-cyan-400 transition-colors"
            >
              Buscar
            </Link>
            <Link 
              href="/horario" 
              className="font-body text-sm text-muted dark:text-slate-400 hover:text-accent dark:hover:text-cyan-400 transition-colors"
            >
              Mi Horario
            </Link>
            <Link 
              href="#como-funciona" 
              className="font-body text-sm text-muted dark:text-slate-400 hover:text-accent dark:hover:text-cyan-400 transition-colors"
            >
              Cómo funciona
            </Link>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 
                flex items-center justify-center
                hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Github className="size-4 text-muted dark:text-slate-400" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 
                flex items-center justify-center
                hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Twitter className="size-4 text-muted dark:text-slate-400" />
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 
          text-center">
          <p className="font-body text-xs text-muted dark:text-slate-500">
            © {new Date().getFullYear()} Aula Guía. Hecho con 💙 por TKDev para estudiantes BUAP.
          </p>
        </div>
      </div>
    </footer>
  )
}
