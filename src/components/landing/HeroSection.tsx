'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import HeroBackground from './HeroBackground'
import { TypingAnimation } from '@/components/ui/typing-animation'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fondo WOW */}
      <HeroBackground />
      
      {/* Overlay de contraste (accesibilidad) */}
      <div className="absolute inset-0 bg-white/30 dark:bg-black/20 pointer-events-none" />
      
      {/* Contenido */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
            bg-accent/10 dark:bg-accent/20 
            border border-accent/20 dark:border-accent/30
            text-accent dark:text-cyan-400 
            text-sm font-medium mb-8"
        >
          <Sparkles className="size-4" />
          <span>BUAP · Primavera 2026</span>
        </motion.div>

        {/* Título principal */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold 
            text-text dark:text-white 
            leading-tight tracking-tight mb-6"
        >
          Elige a tus profesores{' '}
          <span className="text-white font-black">
            <TypingAnimation
            words={['con datos reales', 'sin errores', 'confiables', 'fácilmente']}
            className="text-white font-black"
            />
          </span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-body text-lg sm:text-xl md:text-2xl 
            text-muted dark:text-slate-400 
            max-w-2xl mx-auto mb-10"
        >
          Construye tu horario ideal con ratings verificados, 
          detección de conflictos y exportación en un clic.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button 
            asChild
            size="lg" 
            className="font-body font-semibold text-base px-8 py-6 
              bg-[#003A5C] hover:bg-[#00507A] dark:bg-[#00BCD4] dark:hover:bg-[#00ACC1]
              text-white dark:text-[#0B1220]
              shadow-lg shadow-primary/20 dark:shadow-cyan-500/20
              transition-all duration-300"
          >
            <Link href="/buscar">
              Comenzar Ahora
              <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
          
          <Button 
            asChild
            variant="outline" 
            size="lg"
            className="font-body font-medium text-base px-8 py-6
              border-2 border-slate-300 dark:border-slate-700
              hover:bg-slate-100 dark:hover:bg-slate-800
              transition-all duration-300"
          >
            <Link href="#como-funciona">
              Ver cómo funciona
            </Link>
          </Button>
        </motion.div>

        {/* Stats rápidos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-8 sm:gap-12 mt-16 pt-8 
            border-t border-slate-200/50 dark:border-slate-700/50"
        >
          <div className="text-center">
            <p className="font-display text-2xl sm:text-3xl font-bold text-text dark:text-white">
              Todos los
            </p>
            <p className="font-body text-sm text-muted dark:text-slate-500">
              Profesores
            </p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl sm:text-3xl font-bold text-text dark:text-white">
              Todas
            </p>
            <p className="font-body text-sm text-muted dark:text-slate-500">
              las clases
            </p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl sm:text-3xl font-bold text-accent dark:text-cyan-400">
              4.8★
            </p>
            <p className="font-body text-sm text-muted dark:text-slate-500">
              Calificación
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-slate-400 dark:border-slate-600 flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600" />
        </motion.div>
      </motion.div>
    </section>
  )
}
