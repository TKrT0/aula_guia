'use client';

import { useState } from 'react';
import type { HorarioMateria, ConflictInfo } from '@/src/lib/services/scheduleService';

interface ScheduleGridMobileProps {
  materias: HorarioMateria[];
  conflicts: ConflictInfo[];
  onMateriaClick?: (materia: HorarioMateria) => void;
}

const DIAS = [
  { key: 'lunes', label: 'Lun' },
  { key: 'martes', label: 'Mar' },
  { key: 'miercoles', label: 'Mié' },
  { key: 'jueves', label: 'Jue' },
  { key: 'viernes', label: 'Vie' },
  { key: 'sabado', label: 'Sáb' },
];

// Paleta de colores para materias
const PALETTE = [
  { bg: '#E3F2FD', border: '#2196F3', text: '#1565C0' },
  { bg: '#E8F5E9', border: '#4CAF50', text: '#2E7D32' },
  { bg: '#FFEBEE', border: '#EF5350', text: '#C62828' },
  { bg: '#F3E5F5', border: '#AB47BC', text: '#7B1FA2' },
  { bg: '#FFF3E0', border: '#FFA726', text: '#EF6C00' },
  { bg: '#FCE4EC', border: '#EC407A', text: '#AD1457' },
  { bg: '#E0F7FA', border: '#26C6DA', text: '#00838F' },
  { bg: '#FFF8E1', border: '#FFCA28', text: '#FF6F00' },
];

const getColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash % PALETTE.length)];
};

export default function ScheduleGridMobile({
  materias,
  conflicts,
  onMateriaClick,
}: ScheduleGridMobileProps) {
  const [selectedDay, setSelectedDay] = useState('lunes');

  // Filtrar bloques del día seleccionado
  const bloquesDelDia = materias.flatMap((materia) => {
    if (!materia.bloques) return [];
    
    return materia.bloques
      .filter((bloque) => {
        const diaNorm = bloque.dia
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        return diaNorm === selectedDay;
      })
      .map((bloque) => ({
        materia,
        bloque,
        hasConflict: conflicts.some(
          (c) =>
            (c.materia1.id === materia.id || c.materia2.id === materia.id) &&
            c.dia.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === selectedDay
        ),
      }));
  });

    // DEDUPE defensivo: evita tarjetas repetidas
  const bloquesUnique = Array.from(
    new Map(
      bloquesDelDia.map((x) => {
        const key = [
          x.materia.nrc,
          x.bloque.dia,
          x.bloque.hora_inicio,
          x.bloque.hora_fin,
          x.bloque.salon ?? '',
          x.bloque.edificio ?? '',
        ].join('|');
        return [key, x] as const;
      })
    ).values()
  );


  // Ordenar por hora de inicio
  const bloquesSorted = bloquesUnique.sort((a, b) => {
    const timeA = a.bloque.hora_inicio.split(':').map(Number);
    const timeB = b.bloque.hora_inicio.split(':').map(Number);
    return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
  });

  return (
    <div id="schedule-export-area" className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Selector de días */}
      <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-10 px-2 py-3">
        <div className="flex gap-1">
          {DIAS.map((dia) => {
            const isSelected = selectedDay === dia.key;
            const hasClasses = materias.some((m) =>
              m.bloques?.some(
                (b) =>
                  b.dia
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '') === dia.key
              )
            );

            return (
              <button
                key={dia.key}
                onClick={() => setSelectedDay(dia.key)}
                className={`
                  flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all
                  ${isSelected
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }
                  ${hasClasses && !isSelected ? 'ring-2 ring-primary/30' : ''}
                `}
              >
                {dia.label}
                {hasClasses && !isSelected && (
                  <span className="block w-1.5 h-1.5 bg-primary rounded-full mx-auto mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de clases */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {bloquesSorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-slate-500">
            <span className="material-symbols-outlined text-5xl mb-2">event_available</span>
            <p className="text-sm font-medium">Sin clases este día</p>
            <p className="text-xs">¡Disfruta tu tiempo libre! 🎉</p>
          </div>
        ) : (
          bloquesSorted.map((item, idx) => {
            const theme = getColor(item.materia.materia_nombre);
            
            return (
              <div
                key={`${item.materia.nrc}-${item.bloque.id}`}

                onClick={() => onMateriaClick?.(item.materia)}
                className={`
                  relative overflow-hidden rounded-2xl p-4 cursor-pointer
                  transition-all active:scale-[0.98]
                  ${item.hasConflict ? 'ring-2 ring-red-500' : ''}
                `}
                style={{
                  backgroundColor: theme.bg,
                  borderLeft: `4px solid ${theme.border}`,
                }}
              >
                {/* Indicador de conflicto */}
                {item.hasConflict && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">warning</span>
                    Conflicto
                  </div>
                )}

                {/* Hora */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-lg font-bold"
                    style={{ color: theme.text }}
                  >
                    {item.bloque.hora_inicio}
                  </span>
                  <span className="text-slate-400">→</span>
                  <span className="text-sm text-slate-500">
                    {item.bloque.hora_fin}
                  </span>
                </div>

                {/* Nombre de materia */}
                <h3
                  className="font-bold text-base mb-2 leading-tight"
                  style={{ color: theme.text }}
                >
                  {item.materia.materia_nombre}
                </h3>

                {/* Info adicional */}
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-1" style={{ color: theme.text }}>
                    <span className="material-symbols-outlined text-sm">person</span>
                    <span>{item.materia.profesor_nombre?.split(' ').slice(0, 2).join(' ')}</span>
                  </div>

                  {item.bloque.salon && (
                    <div className="flex items-center gap-1" style={{ color: theme.text }}>
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      <span>{item.bloque.salon}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-slate-500">
                    <span className="material-symbols-outlined text-sm">tag</span>
                    <span>{item.materia.nrc}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
