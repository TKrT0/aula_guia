'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Calendar, 
  AlertTriangle, 
  Star, 
  Download, 
  Users,
  Clock,
  FileText,
  Image as ImageIcon,
  CalendarDays,
  User,
  ThumbsUp,
  MessageSquare
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
}

function SearchDemo() {
  const [focused, setFocused] = useState(false)
  const suggestions = [
    { name: 'Dr. Juan Pérez', subject: 'Cálculo Diferencial' },
    { name: 'Dra. María García', subject: 'Programación I' },
  ]

  return (
    <div className="mt-4 relative">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 
        border transition-all duration-200 ${focused ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-transparent'}`}>
        <Search className="size-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar profesor..."
          className="bg-transparent text-xs w-full outline-none text-slate-600 dark:text-slate-300 placeholder:text-slate-400"
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          readOnly
        />
      </div>
      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden z-10"
          >
            {suggestions.map((s, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                <div className="size-6 rounded-full bg-cyan-500/10 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-cyan-600">{s.name[0]}</span>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">{s.name}</p>
                  <p className="text-[8px] text-slate-400">{s.subject}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ScheduleDemo() {
  const blocks = [
    { day: 'Lun', time: '07:00', color: 'bg-cyan-500', name: 'Cálculo' },
    { day: 'Mar', time: '09:00', color: 'bg-blue-500', name: 'Física' },
    { day: 'Mié', time: '07:00', color: 'bg-cyan-500', name: 'Cálculo' },
  ]

  return (
    <div className="mt-4 grid grid-cols-5 gap-1">
      {['Lun', 'Mar', 'Mié', 'Jue', 'Vie'].map((day) => (
        <div key={day} className="text-center">
          <p className="text-[8px] font-medium text-slate-400 mb-1">{day}</p>
          <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded relative overflow-hidden">
            {blocks.filter(b => b.day === day).map((block, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                className={`absolute left-0.5 right-0.5 h-6 ${block.color} rounded text-[6px] text-white font-medium flex items-center justify-center`}
                style={{ top: block.time === '07:00' ? '2px' : '26px' }}
              >
                {block.name}
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ConflictDemo() {
  return (
    <div className="mt-4 space-y-2">
      <motion.div
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-900/30"
      >
        <AlertTriangle className="size-4 text-red-500" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-red-600 dark:text-red-400">Conflicto detectado</p>
          <p className="text-[8px] text-red-500/70">Lunes 07:00–09:00</p>
        </div>
      </motion.div>
      <div className="flex gap-1">
        <Badge variant="outline" className="text-[8px] px-1.5 py-0">Cálculo</Badge>
        <span className="text-[8px] text-slate-400">vs</span>
        <Badge variant="outline" className="text-[8px] px-1.5 py-0">Física</Badge>
      </div>
    </div>
  )
}

function RatingsDemo() {
  const [hovered, setHovered] = useState<number | null>(null)
  
  return (
    <div className="mt-4">
      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.div
            key={star}
            onHoverStart={() => setHovered(star)}
            onHoverEnd={() => setHovered(null)}
            whileHover={{ scale: 1.2 }}
            className="cursor-pointer"
          >
            <Star 
              className={`size-5 transition-colors ${
                star <= (hovered || 4) 
                  ? 'text-amber-400 fill-amber-400' 
                  : 'text-slate-300 dark:text-slate-600'
              }`} 
            />
          </motion.div>
        ))}
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-1">4.5</span>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <ThumbsUp className="size-3" /> 92%
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare className="size-3" /> 47
        </span>
      </div>
    </div>
  )
}

function ExportDemo() {
  const options = [
    { icon: FileText, label: 'PDF', color: 'text-red-500 bg-red-100 dark:bg-red-500/10' },
    { icon: ImageIcon, label: 'PNG', color: 'text-purple-500 bg-purple-100 dark:bg-purple-500/10' },
    { icon: CalendarDays, label: 'iCal', color: 'text-blue-500 bg-blue-100 dark:bg-blue-500/10' },
  ]

  return (
    <div className="mt-4 flex gap-2">
      {options.map((opt, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
          whileHover={{ scale: 1.05, y: -2 }}
          className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer 
            border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all`}
        >
          <div className={`size-8 rounded-lg ${opt.color} flex items-center justify-center`}>
            <opt.icon className="size-4" />
          </div>
          <span className="text-[9px] font-medium text-slate-600 dark:text-slate-400">{opt.label}</span>
        </motion.div>
      ))}
    </div>
  )
}

function CommunityDemo() {
  const reviews = [
    { name: 'Carlos M.', text: 'Excelente profesor, explica muy bien', rating: 5 },
    { name: 'Ana L.', text: 'Tareas pesadas pero vale la pena', rating: 4 },
  ]

  return (
    <div className="mt-4 space-y-2">
      {reviews.map((review, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.15 }}
          className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50"
        >
          <div className="size-6 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
            <User className="size-3 text-violet-500" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">{review.name}</span>
              <div className="flex">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="size-2 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate">{review.text}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

const features = [
  {
    icon: Search,
    title: 'Búsqueda Inteligente',
    description: 'Encuentra materias por nombre, profesor, NRC o carrera.',
    className: 'md:col-span-2',
    gradient: 'from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20',
    demo: SearchDemo
  },
  {
    icon: Calendar,
    title: 'Constructor Visual',
    description: 'Arma tu horario de forma visual e intuitiva.',
    className: 'md:col-span-1',
    gradient: 'from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20',
    demo: ScheduleDemo
  },
  {
    icon: AlertTriangle,
    title: 'Detección de Conflictos',
    description: 'Te alertamos si tus materias se empalman.',
    className: 'md:col-span-1',
    gradient: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20',
    demo: ConflictDemo
  },
  {
    icon: Star,
    title: 'Ratings Reales',
    description: 'Calificaciones basadas en experiencias de estudiantes.',
    className: 'md:col-span-1',
    gradient: 'from-yellow-500/10 to-amber-500/10 dark:from-yellow-500/20 dark:to-amber-500/20',
    demo: RatingsDemo
  },
  {
    icon: Download,
    title: 'Exporta tu Horario',
    description: 'Descarga en PDF, imagen o calendario.',
    className: 'md:col-span-1',
    gradient: 'from-emerald-500/10 to-cyan-500/10 dark:from-emerald-500/20 dark:to-cyan-500/20',
    demo: ExportDemo
  },
  {
    icon: Users,
    title: 'Comunidad Estudiantil',
    description: 'Opiniones verificadas de tu facultad.',
    className: 'md:col-span-2',
    gradient: 'from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20',
    demo: CommunityDemo
  }
]

export default function BentoGrid() {
  return (
    <section className="relative py-24 px-6 bg-background-light dark:bg-background-dark">
      {/* Fondo calmado con glow sutil */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full 
          bg-[rgba(0,188,212,0.05)] dark:bg-[rgba(0,188,212,0.08)] blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full 
          bg-[rgba(79,70,229,0.03)] dark:bg-[rgba(79,70,229,0.06)] blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold 
            text-text dark:text-white mb-4">
            Todo lo que necesitas
          </h2>
          <p className="font-body text-lg text-muted dark:text-slate-400 max-w-2xl mx-auto">
            Herramientas diseñadas para que elijas mejor y más rápido.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`group relative p-6 rounded-2xl 
                bg-white dark:bg-card-dark
                border border-slate-200 dark:border-slate-800
                hover:border-accent/50 dark:hover:border-cyan-500/50
                hover:shadow-xl hover:shadow-accent/5
                transition-all duration-300 overflow-hidden
                ${feature.className}`}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <motion.div 
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="size-12 rounded-xl bg-accent/10 dark:bg-cyan-500/10 
                      flex items-center justify-center
                      group-hover:bg-accent/20 dark:group-hover:bg-cyan-500/20
                      transition-colors duration-300"
                  >
                    <feature.icon className="size-6 text-accent dark:text-cyan-400" />
                  </motion.div>
                </div>
                
                <h3 className="font-display text-lg font-semibold 
                  text-text dark:text-white mb-1 mt-4">
                  {feature.title}
                </h3>
                
                <p className="font-body text-sm text-muted dark:text-slate-400">
                  {feature.description}
                </p>

                {/* Mini Demo */}
                <feature.demo />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
