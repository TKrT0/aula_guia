'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { obtenerSugerencias } from '@/src/lib/supabase/queries';
import { useCarrera } from '@/src/contexts/CarreraContext';

interface SearchBarProps {
  onSearch: (term: string) => void;
  initialValue?: string;
}

export default function SearchBar({ onSearch, initialValue = '' }: SearchBarProps) {
  const [term, setTerm] = useState(initialValue);
  const [sugerencias, setSugerencias] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { carreraId } = useCarrera();

  // Mantenemos la lógica inteligente (debounce) - ahora con filtro de carrera
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (term.trim().length >= 2) {
        const results = await obtenerSugerencias(term, carreraId);
        setSugerencias(results || []);
        setShowSuggestions(true);
      } else {
        setSugerencias([]);
        setShowSuggestions(false);
      }
    };
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [term, carreraId]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); // wrapperRef es estable, no necesita estar en dependencias

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      setShowSuggestions(false);
      onSearch(term);
    }
  };

  const handleClear = () => {
    setTerm('');
  };

  return (
    <div ref={wrapperRef} className="w-full relative z-50">
      <form onSubmit={handleSubmit} className="relative w-full">
        <label className="relative flex items-center w-full h-14 sm:h-16 rounded-full shadow-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden group">
            
            {/* ÍCONO LUPA (Estilo original) */}
            <div className="pl-6 pr-3 text-slate-400 group-focus-within:text-primary transition-colors">
               {/* Usamos SVG directo para no depender de librerías de iconos externas si no quieres */}
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
            </div>

            <input 
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="peer h-full w-full bg-transparent text-slate-800 dark:text-white placeholder:text-slate-400 text-base sm:text-lg border-none focus:ring-0 px-0 outline-none" 
              placeholder="Profesor, materia o NRC..." 
            />

            {/* BOTÓN BUSCAR (Estilo original) */}
            <div className="pr-2 flex items-center gap-2">
              {term && (
                <button type="button" onClick={handleClear} className="p-2 text-slate-300 hover:text-red-400 transition-colors">
                  ✕
                </button>
              )}
              <button type="submit" className="h-10 sm:h-12 px-6 sm:px-8 bg-primary hover:bg-[#002a42] text-white rounded-full font-bold text-sm transition-colors shadow-md">
                Buscar
              </button>
            </div>
        </label>
      </form>

      {/* DROPDOWN DE SUGERENCIAS (Estilo Premium) */}
      {showSuggestions && sugerencias.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-3 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2">
            <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sugerencias rápidas</span>
            </div>
            
            {sugerencias.map((item, index) => (
              <div 
                key={index}
                onClick={() => router.push(`/profesor/${item.profesor_id}`)}
                className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group text-left border-b border-slate-50 dark:border-slate-700 last:border-none"
              >
                {/* ÍCONO DECORATIVO (Estilo original) */}
                <div className="size-10 rounded-full flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                    <span className="font-bold text-lg">
                        {item.profesor_nombre.charAt(0)}
                    </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">
                    {item.profesor_nombre}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    📚 {item.materia_nombre}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}