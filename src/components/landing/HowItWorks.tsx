'use client'

import { motion } from 'framer-motion'
import { Search, CalendarPlus, Download } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Busca',
    description: 'Encuentra tus materias por nombre, carrera o profesor. Filtra por horarios y revisa ratings.',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    number: '02',
    icon: CalendarPlus,
    title: 'Construye',
    description: 'Agrega materias a tu horario. Te alertamos de conflictos automáticamente.',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    number: '03',
    icon: Download,
    title: 'Exporta',
    description: 'Descarga tu horario en PDF, imagen PNG o agrégalo a tu calendario.',
    color: 'from-indigo-500 to-violet-500'
  }
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="relative py-24 px-6 bg-slate-50 dark:bg-[#0A0F1A]">
      {/* Noise sutil */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <span className="font-body text-sm font-medium text-accent dark:text-cyan-400 
            uppercase tracking-wider mb-4 block">
            Cómo funciona
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold 
            text-text dark:text-white">
            Tres pasos simples
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector line (desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-full h-px 
                  bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-700" />
              )}

              {/* Step content */}
              <div className="text-center md:text-left">
                {/* Number + Icon */}
                <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                  <span className={`font-display text-5xl font-bold 
                    text-transparent bg-clip-text bg-gradient-to-r ${step.color}`}>
                    {step.number}
                  </span>
                  <div className={`size-14 rounded-2xl bg-gradient-to-br ${step.color} 
                    flex items-center justify-center shadow-lg`}>
                    <step.icon className="size-7 text-white" />
                  </div>
                </div>

                {/* Text */}
                <h3 className="font-display text-xl font-semibold 
                  text-text dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="font-body text-muted dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
