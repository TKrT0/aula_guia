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
            appearance-none w-full sm:w-auto
            px-4 py-2.5 pr-10
            bg-white border-2 rounded-xl
            text-sm font-medium
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary/20
            ${carreraId 
              ? 'border-primary/30 text-slate-800' 
              : 'border-amber-400 text-amber-700 bg-amber-50'
            }
          `}
        >
          <option value="" disabled>
            ⚠️ Selecciona tu carrera
          </option>
          {carreras.map((carrera) => (
            <option key={carrera.id} value={carrera.id}>
              {carrera.nombre}
            </option>
          ))}
        </select>
        
        {/* Icono de dropdown */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {/* Badge de carrera seleccionada */}
      {carreraId && (
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          {carreraId}
        </span>
      )}
    </div>
  );
}
