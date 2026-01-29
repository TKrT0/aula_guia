'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import ThemeToggle from '@/src/components/ui/ThemeToggle'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 dark:bg-[#0B1220]/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-800/50' 
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="font-display text-xl font-bold text-text dark:text-white 
              hover:text-accent dark:hover:text-cyan-400 transition-colors"
          >
            Aula Guía
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="#como-funciona" 
              className="font-body text-sm text-muted dark:text-slate-400 
                hover:text-text dark:hover:text-white transition-colors"
            >
              Cómo funciona
            </Link>
            <Link 
              href="/buscar" 
              className="font-body text-sm text-muted dark:text-slate-400 
                hover:text-text dark:hover:text-white transition-colors"
            >
              Buscar
            </Link>
            <Link 
              href="/horario" 
              className="font-body text-sm text-muted dark:text-slate-400 
                hover:text-text dark:hover:text-white transition-colors"
            >
              Mi Horario
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <Button 
              asChild
              size="sm"
              className="hidden md:inline-flex font-body font-medium
                bg-[#003A5C] hover:bg-[#00507A] dark:bg-[#00BCD4] dark:hover:bg-[#00ACC1]
                text-white dark:text-[#0B1220]"
            >
              <Link href="/buscar">
                Comenzar
              </Link>
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden size-10 flex items-center justify-center 
                rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="size-5 text-text dark:text-white" />
              ) : (
                <Menu className="size-5 text-text dark:text-white" />
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden 
              bg-white dark:bg-[#0B1220] border-b border-slate-200 dark:border-slate-800
              shadow-lg"
          >
            <div className="p-6 space-y-4">
              <Link 
                href="#como-funciona"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block font-body text-base text-text dark:text-white 
                  py-2 hover:text-accent dark:hover:text-cyan-400 transition-colors"
              >
                Cómo funciona
              </Link>
              <Link 
                href="/buscar"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block font-body text-base text-text dark:text-white 
                  py-2 hover:text-accent dark:hover:text-cyan-400 transition-colors"
              >
                Buscar
              </Link>
              <Link 
                href="/horario"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block font-body text-base text-text dark:text-white 
                  py-2 hover:text-accent dark:hover:text-cyan-400 transition-colors"
              >
                Mi Horario
              </Link>
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button 
                  asChild
                  className="w-full font-body font-medium
                    bg-[#003A5C] hover:bg-[#00507A] dark:bg-[#00BCD4] dark:hover:bg-[#00ACC1]
                    text-white dark:text-[#0B1220]"
                >
                  <Link href="/buscar">
                    Comenzar Ahora
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
