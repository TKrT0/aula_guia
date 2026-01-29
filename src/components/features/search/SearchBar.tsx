'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight, User, BookOpen, Sparkles, Loader2 } from 'lucide-react'
import { obtenerSugerencias } from '@/src/lib/supabase/queries'
import { useCarrera } from '@/src/contexts/CarreraContext'

interface SearchBarProps {
  onSearch: (term: string) => void
  initialValue?: string
  variant?: 'hero' | 'compact'
}

export default function SearchBar({ onSearch, initialValue = '', variant = 'hero' }: SearchBarProps) {
  const [term, setTerm] = useState(initialValue)
  const [sugerencias, setSugerencias] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { carreraId } = useCarrera()

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (term.trim().length >= 2) {
        setIsLoading(true)
        const results = await obtenerSugerencias(term, carreraId)
        setSugerencias(results || [])
        setShowSuggestions(true)
        setIsLoading(false)
      } else {
        setSugerencias([])
        setShowSuggestions(false)
      }
    }
    const timeoutId = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timeoutId)
  }, [term, carreraId])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setIsFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (term.trim()) {
      setShowSuggestions(false)
      onSearch(term)
    }
  }

  const handleClear = () => {
    setTerm('')
    inputRef.current?.focus()
  }

  const handleSuggestionClick = (profesorId: string) => {
    setShowSuggestions(false)
    router.push(`/profesor/${profesorId}`)
  }

  const isHero = variant === 'hero'

  return (
    <div ref={wrapperRef} className="w-full relative z-50">
      <motion.form 
        onSubmit={handleSubmit} 
        className="relative w-full"
        initial={false}
        animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className={`relative flex items-center w-full rounded-2xl 
          bg-white dark:bg-[#0F1C2E] 
          border-2 transition-all duration-300 overflow-hidden
          ${isFocused 
            ? 'border-[#00BCD4] shadow-xl shadow-cyan-500/10 dark:shadow-cyan-500/20' 
            : 'border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700'
          }
          ${isHero ? 'h-14 sm:h-16' : 'h-12'}
        `}>
          {/* Search Icon */}
          <div className={`flex items-center justify-center shrink-0 transition-colors duration-200
            ${isHero ? 'pl-5 pr-3' : 'pl-4 pr-2'}
            ${isFocused ? 'text-[#00BCD4]' : 'text-slate-400'}
          `}>
            {isLoading ? (
              <Loader2 className={`animate-spin ${isHero ? 'size-5' : 'size-4'}`} />
            ) : (
              <Search className={isHero ? 'size-5' : 'size-4'} />
            )}
          </div>

          {/* Input */}
          <input 
            ref={inputRef}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onFocus={() => {
              setIsFocused(true)
              if (sugerencias.length > 0) setShowSuggestions(true)
            }}
            className={`h-full w-full bg-transparent text-slate-800 dark:text-white 
              placeholder:text-slate-400 dark:placeholder:text-slate-500
              border-none focus:ring-0 px-0 outline-none font-body
              ${isHero ? 'text-base sm:text-lg' : 'text-sm'}
            `}
            placeholder="Buscar profesor, materia o NRC..." 
          />

          {/* Actions */}
          <div className={`flex items-center gap-1 shrink-0 ${isHero ? 'pr-2' : 'pr-1.5'}`}>
            {/* Clear button */}
            <AnimatePresence>
              {term && (
                <motion.button 
                  type="button" 
                  onClick={handleClear}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`flex items-center justify-center rounded-full
                    text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10
                    transition-colors
                    ${isHero ? 'size-8' : 'size-7'}
                  `}
                >
                  <X className={isHero ? 'size-4' : 'size-3.5'} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-center gap-2 font-semibold rounded-xl
                bg-[#003A5C] hover:bg-[#00507A] dark:bg-[#00BCD4] dark:hover:bg-[#00ACC1]
                text-white dark:text-[#0B1220]
                shadow-md hover:shadow-lg transition-all
                ${isHero ? 'h-10 sm:h-11 px-5 sm:px-6 text-sm' : 'h-8 px-4 text-xs'}
              `}
            >
              <span className="hidden sm:inline">Buscar</span>
              <ArrowRight className={isHero ? 'size-4' : 'size-3.5'} />
            </motion.button>
          </div>
        </div>
      </motion.form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && sugerencias.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full mt-2 
              bg-white dark:bg-[#0F1C2E] 
              rounded-2xl shadow-2xl 
              border border-slate-200 dark:border-slate-800 
              overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 
              border-b border-slate-100 dark:border-slate-800 
              flex items-center gap-2"
            >
              <Sparkles className="size-3.5 text-[#00BCD4]" />
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Sugerencias rápidas
              </span>
            </div>
            
            {/* Suggestions List */}
            <div className="max-h-[300px] overflow-y-auto">
              {sugerencias.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleSuggestionClick(item.profesor_id)}
                  className="flex items-center gap-3 px-4 py-3 
                    hover:bg-slate-50 dark:hover:bg-slate-800/50 
                    transition-colors cursor-pointer group 
                    border-b border-slate-100 dark:border-slate-800 last:border-none"
                >
                  {/* Avatar */}
                  <div className="size-10 rounded-xl 
                    bg-gradient-to-br from-[#003A5C] to-[#00507A] dark:from-cyan-500 dark:to-blue-500
                    flex items-center justify-center shrink-0
                    shadow-md group-hover:shadow-lg transition-shadow"
                  >
                    <span className="font-display font-bold text-sm text-white">
                      {item.profesor_nombre.charAt(0)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 dark:text-white 
                      truncate group-hover:text-[#00BCD4] dark:group-hover:text-cyan-400 transition-colors">
                      {item.profesor_nombre}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                      <BookOpen className="size-3 shrink-0" />
                      {item.materia_nombre}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="size-4 text-slate-300 dark:text-slate-600 
                    group-hover:text-[#00BCD4] dark:group-hover:text-cyan-400 
                    opacity-0 group-hover:opacity-100 
                    -translate-x-2 group-hover:translate-x-0
                    transition-all" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}