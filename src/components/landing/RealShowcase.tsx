'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Star, 
  Clock, 
  User, 
  AlertTriangle, 
  Calendar,
  FileText,
  Image as ImageIcon,
  CalendarDays,
  Check,
  X
} from 'lucide-react'

export default function RealShowcase() {
  return (
    <section className="relative py-24 px-6 bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Glow sutil en esquinas */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full 
        bg-[rgba(0,188,212,0.06)] dark:bg-[rgba(0,188,212,0.10)] blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-[250px] h-[250px] rounded-full 
        bg-[rgba(79,70,229,0.04)] dark:bg-[rgba(79,70,229,0.08)] blur-[80px]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="font-body text-sm font-medium text-accent dark:text-cyan-400 
            uppercase tracking-wider mb-4 block">
            Showcase
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold 
            text-text dark:text-white mb-4">
            Así se ve en acción
          </h2>
          <p className="font-body text-lg text-muted dark:text-slate-400 max-w-2xl mx-auto">
            Capturas reales de la aplicación.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Resultado de búsqueda */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-5 bg-white dark:bg-card-dark border-slate-200 dark:border-slate-800 
              hover:shadow-xl hover:shadow-accent/5 transition-shadow duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-display text-sm font-bold text-text dark:text-white truncate">
                    Cálculo Diferencial
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs text-muted dark:text-slate-500">
                      NRC 12345
                    </span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      6 cr
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 
                  text-amber-600 dark:text-amber-400 px-2 py-1 rounded text-xs font-medium">
                  <Star className="size-3 fill-current" />
                  4.5
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted dark:text-slate-400 flex items-center gap-1.5">
                  <User className="size-3" />
                  Dr. Juan Pérez López
                </p>
                <p className="text-xs text-muted dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="size-3" />
                  Lun, Mié 07:00–09:00
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1 text-xs h-8 
                  bg-[#003A5C] hover:bg-[#00507A] dark:bg-[#00BCD4] dark:hover:bg-[#00ACC1]
                  text-white dark:text-[#0B1220]">
                  Agregar
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-8">
                  Ver más
                </Button>
              </div>

              <p className="font-body text-xs text-center text-muted dark:text-slate-500 mt-4 pt-3 
                border-t border-slate-100 dark:border-slate-800">
                Resultado de búsqueda con horarios
              </p>
            </Card>
          </motion.div>

          {/* Card 2: Conflicto detectado */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-5 bg-white dark:bg-card-dark border-red-200 dark:border-red-900/50 
              hover:shadow-xl hover:shadow-red-500/5 transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-full bg-red-100 dark:bg-red-500/10 
                  flex items-center justify-center">
                  <AlertTriangle className="size-5 text-red-500" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-red-600 dark:text-red-400">
                    Conflicto detectado
                  </h4>
                  <p className="text-xs text-muted dark:text-slate-400">
                    2 materias se empalman
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/5 
                  border border-red-100 dark:border-red-900/30">
                  <div className="flex items-start gap-2">
                    <X className="size-4 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-text dark:text-white">
                        Cálculo Diferencial
                      </p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          <Calendar className="size-2.5 mr-0.5" />
                          Lunes
                        </Badge>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          <Clock className="size-2.5 mr-0.5" />
                          07:00–09:00
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button size="sm" className="w-full mt-4 text-xs h-8">
                <Check className="size-3 mr-1" />
                Entendido
              </Button>

              <p className="font-body text-xs text-center text-muted dark:text-slate-500 mt-4 pt-3 
                border-t border-slate-100 dark:border-slate-800">
                Conflicto detectado automáticamente
              </p>
            </Card>
          </motion.div>

          {/* Card 3: Export PDF */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-5 bg-white dark:bg-card-dark border-slate-200 dark:border-slate-800 
              hover:shadow-xl hover:shadow-accent/5 transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 
                  flex items-center justify-center">
                  <FileText className="size-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-text dark:text-white">
                    Exportar horario
                  </h4>
                  <p className="text-xs text-muted dark:text-slate-400">
                    Elige el formato
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <button className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 
                  border border-slate-200 dark:border-slate-700
                  hover:border-accent/50 dark:hover:border-cyan-500/50
                  flex items-center gap-3 transition-colors duration-200">
                  <div className="size-8 rounded-lg bg-red-100 dark:bg-red-500/10 
                    flex items-center justify-center">
                    <FileText className="size-4 text-red-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-text dark:text-white">PDF</p>
                    <p className="text-[10px] text-muted dark:text-slate-500">Listo para imprimir</p>
                  </div>
                </button>

                <button className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 
                  border border-slate-200 dark:border-slate-700
                  hover:border-accent/50 dark:hover:border-cyan-500/50
                  flex items-center gap-3 transition-colors duration-200">
                  <div className="size-8 rounded-lg bg-purple-100 dark:bg-purple-500/10 
                    flex items-center justify-center">
                    <ImageIcon className="size-4 text-purple-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-text dark:text-white">Imagen PNG</p>
                    <p className="text-[10px] text-muted dark:text-slate-500">Comparte en redes</p>
                  </div>
                </button>

                <button className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 
                  border border-slate-200 dark:border-slate-700
                  hover:border-accent/50 dark:hover:border-cyan-500/50
                  flex items-center gap-3 transition-colors duration-200">
                  <div className="size-8 rounded-lg bg-blue-100 dark:bg-blue-500/10 
                    flex items-center justify-center">
                    <CalendarDays className="size-4 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-text dark:text-white">Calendario</p>
                    <p className="text-[10px] text-muted dark:text-slate-500">Google / Apple</p>
                  </div>
                </button>
              </div>

              <p className="font-body text-xs text-center text-muted dark:text-slate-500 mt-4 pt-3 
                border-t border-slate-100 dark:border-slate-800">
                Exportación en múltiples formatos
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
