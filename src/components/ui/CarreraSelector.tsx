'use client';

import { useCarrera } from '@/src/contexts/CarreraContext';

interface CarreraSelectorProps {
  className?: string;
  showLabel?: boolean;
}

export default function CarreraSelector({ className = '', showLabel = true }: CarreraSelectorProps) {
  const { carreraId, carreras, setCarrera, isLoading } = useCarrera();

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-slate-200 rounded-lg h-11 w-64 ${className}`} />
    );
  }

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 ${className}`}>
      {showLabel && (
        <label className="text-sm font-medium text-slate-600 whitespace-nowrap">
          Mi Carrera:
        </label>
      )}
      <div className="relative w-full sm:w-auto">
        <select
          value={carreraId || ''}
          onChange={(e) => setCarrera(e.target.value)}
          className={`
            appearance-none w-full max-w-100
            px-3 py-2 pr-8
            bg-white dark:bg-[#0F1C2E] border-2 rounded-lg
            text-sm font-medium
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/20
            ${carreraId 
              ? 'border-[#00BCD4]/30 text-slate-800 dark:text-white' 
              : 'border-amber-400 text-amber-700 bg-amber-50'
            }
          `}
        >
          <option value="" disabled>
          Selecciona tu carrera
          </option>
          {carreras.map((carrera) => (
            <option key={carrera.id} value={carrera.id}>
              {carrera.nombre}
            </option>
          ))}
        </select>
        
        {/* Icono de dropdown */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {/* Badge de carrera seleccionada - más pequeño */}
      {carreraId && (
        <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 bg-[#00BCD4]/10 dark:bg-cyan-500/20 text-[#00BCD4] dark:text-cyan-400 rounded-full text-[10px] font-bold">
          <span className="w-1.5 h-1.5 bg-[#00BCD4] dark:bg-cyan-400 rounded-full animate-pulse" />
          {carreraId}
        </span>
      )}
    </div>
  );
}
