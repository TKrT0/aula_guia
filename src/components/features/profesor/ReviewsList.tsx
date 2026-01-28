'use client';

import { useState } from 'react';
import ReviewCard from './ReviewCard';

type SortOption = 'recent' | 'rating_high' | 'rating_low' | 'most_helpful';

interface Resena {
  id: string;
  puntuacion_general: number;
  dificultad: number;
  comentario: string;
  apoyo: number;
  puntualidad: number;
  tags?: string[] | null;
  materia_nombre?: string | null;
  votos_utiles?: number | null;
  semestre?: string | null;
  modos_evaluacion?: string[] | null;
  es_anonimo: boolean;
  created_at: string;
}

interface ReviewsListProps {
  resenas: Resena[];
}

export default function ReviewsList({ resenas }: ReviewsListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Función para ordenar las reseñas
  const sortedResenas = [...resenas].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'rating_high':
        return b.puntuacion_general - a.puntuacion_general;
      case 'rating_low':
        return a.puntuacion_general - b.puntuacion_general;
      case 'most_helpful':
        return (b.votos_utiles || 0) - (a.votos_utiles || 0);
      default:
        return 0;
    }
  });

  return (
    <div>
      {/* Selector de ordenamiento */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-slate-500">{resenas.length} reseña(s)</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/50 outline-none"
        >
          <option value="recent">Más recientes</option>
          <option value="most_helpful">Más útiles</option>
          <option value="rating_high">Mayor puntuación</option>
          <option value="rating_low">Menor puntuación</option>
        </select>
      </div>

      {/* Lista de reseñas */}
      <div className="space-y-4">
        {sortedResenas.map((resena) => (
          <ReviewCard key={resena.id} resena={resena} />
        ))}
      </div>
    </div>
  );
}
