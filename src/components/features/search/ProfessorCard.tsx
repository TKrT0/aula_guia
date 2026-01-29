'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, TrendingUp, ThumbsUp, ArrowRight, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ProfessorCardProps {
  id: string
  nombre: string
  facultad: string
  rating: number | null
  dificultad: number | null
  recomendacion?: number | null
  nrc?: string | null
  index?: number
}

const getIniciales = (name: string) => 
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

const getRatingColor = (rating: number) => {
  if (rating >= 4) return 'text-emerald-500'
  if (rating >= 3) return 'text-amber-500'
  return 'text-red-500'
}

const getDifficultyLabel = (diff: number) => {
  if (diff >= 4) return { label: 'Difícil', color: 'text-red-500 bg-red-50 dark:bg-red-500/10' }
  if (diff >= 3) return { label: 'Moderado', color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' }
  return { label: 'Fácil', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' }
}

export default function ProfessorCard({ 
  id,
  nombre, 
  facultad, 
  rating, 
  dificultad, 
  recomendacion,
  nrc,
  index = 0
}: ProfessorCardProps) {
  const diffInfo = dificultad != null ? getDifficultyLabel(dificultad) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link 
        href={`/profesor/${id}`}
        className="block w-full h-full"
      >
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.2 }}
          className="relative h-full bg-white dark:bg-[#0F1C2E] rounded-2xl p-5 
            border border-slate-200 dark:border-slate-800
            hover:border-[#00BCD4]/50 dark:hover:border-cyan-500/50
            hover:shadow-xl hover:shadow-cyan-500/5
            transition-all duration-300 group overflow-hidden"
        >
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 
            opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          
          <div className="relative z-10">
            {/* Header: Avatar + Info */}
            <div className="flex items-start gap-3 mb-4">
              <motion.div 
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
                className="size-12 rounded-xl bg-gradient-to-br from-[#003A5C] to-[#00507A] 
                  dark:from-cyan-500 dark:to-blue-500
                  flex items-center justify-center text-white font-display font-bold text-sm shrink-0
                  shadow-lg shadow-primary/20 dark:shadow-cyan-500/20"
              >
                {getIniciales(nombre)}
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-slate-800 dark:text-white 
                  truncate group-hover:text-[#00BCD4] dark:group-hover:text-cyan-400 
                  transition-colors text-sm leading-tight">
                  {nombre}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 flex items-center gap-1">
                  <BookOpen className="size-3 shrink-0" />
                  {facultad.replace('Materia: ', '')}
                </p>
                {nrc && (
                  <Badge variant="secondary" className="mt-1.5 text-[10px] px-1.5 py-0 font-mono">
                    NRC {nrc}
                  </Badge>
                )}
              </div>
            </div>

            {/* Rating Stars */}
            {rating != null && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className={`size-4 transition-colors ${
                        star <= Math.round(rating) 
                          ? 'text-amber-400 fill-amber-400' 
                          : 'text-slate-200 dark:text-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-sm font-bold ${getRatingColor(rating)}`}>
                  {rating.toFixed(1)}
                </span>
              </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {/* Dificultad */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                diffInfo?.color || 'bg-slate-50 dark:bg-slate-800'
              }`}>
                <TrendingUp className="size-4" />
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">
                    Dificultad
                  </p>
                  <p className="text-xs font-bold">
                    {diffInfo?.label || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Recomendación */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                recomendacion != null && recomendacion >= 70 
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : recomendacion != null && recomendacion >= 50
                    ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500'
              }`}>
                <ThumbsUp className="size-4" />
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">
                    Recomendado
                  </p>
                  <p className="text-xs font-bold">
                    {recomendacion != null ? `${recomendacion}%` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-center justify-center gap-2 w-full py-2.5 
                bg-slate-100 dark:bg-slate-800 
                group-hover:bg-[#003A5C] dark:group-hover:bg-cyan-500
                text-slate-600 dark:text-slate-300
                group-hover:text-white dark:group-hover:text-[#0B1220]
                text-xs font-semibold rounded-xl transition-all duration-300"
            >
              Ver perfil completo
              <ArrowRight className="size-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}