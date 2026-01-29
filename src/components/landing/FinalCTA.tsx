'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Fondo con spotlight suave para cierre */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#0A0F1A]" />
      
      {/* Aurora suave (reutilizada del hero pero más sutil) */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          w-[600px] h-[400px] rounded-full 
          bg-[rgba(0,188,212,0.08)] dark:bg-[rgba(0,188,212,0.15)]
          blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 
          w-[300px] h-[300px] rounded-full 
          bg-[rgba(43,140,238,0.05)] dark:bg-[rgba(43,140,238,0.10)]
          blur-[100px]" />
      </div>

      {/* Spotlight central */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 50% 40% at 50% 50%,
            rgba(0, 188, 212, 0.06) 0%,
            transparent 70%
          )`
        }}
      />

      {/* Grid sutil */}
      <div 
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `
            linear-gradient(rgba(15, 23, 42, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
            bg-accent/10 dark:bg-cyan-500/20 
            border border-accent/20 dark:border-cyan-500/30
            text-accent dark:text-cyan-400 
            text-sm font-medium mb-8">
            <Sparkles className="size-4" />
            <span>100% Gratis</span>
          </div>

          {/* Título */}
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold 
            text-text dark:text-white leading-tight mb-6">
            Comienza a construir{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BCD4] to-[#2B8CEE]">
              tu horario ideal
            </span>
          </h2>

          {/* Subtítulo */}
          <p className="font-body text-lg sm:text-xl text-muted dark:text-slate-400 
            max-w-2xl mx-auto mb-10">
            Únete a miles de estudiantes BUAP que ya eligen mejor 
            a sus profesores con Aula Guía.
          </p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button 
              asChild
              size="lg" 
              className="font-body font-semibold text-lg px-10 py-7
                bg-[#003A5C] hover:bg-[#00507A] dark:bg-[#00BCD4] dark:hover:bg-[#00ACC1]
                text-white dark:text-[#0B1220]
                shadow-xl shadow-primary/20 dark:shadow-cyan-500/30
                transition-all duration-300 hover:scale-105"
            >
              <Link href="/buscar">
                Comenzar Ahora
                <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>

            <p className="font-body text-sm text-muted dark:text-slate-500 mt-6">
              Sin registro requerido · Sin tarjeta de crédito
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
