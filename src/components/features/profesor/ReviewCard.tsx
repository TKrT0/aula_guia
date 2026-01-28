'use client';

import { useState } from 'react';
import { votarResena } from '@/src/lib/services/professorService';

// Mapeo de tags a sus propiedades visuales
const TAG_CONFIG: Record<string, { label: string; emoji: string; color: string }> = {
  barco: { label: 'Barco', emoji: '🚢', color: 'bg-green-100 text-green-700' },
  estricto: { label: 'Estricto', emoji: '📏', color: 'bg-red-100 text-red-700' },
  explica_bien: { label: 'Explica bien', emoji: '✨', color: 'bg-blue-100 text-blue-700' },
  muchas_tareas: { label: 'Muchas tareas', emoji: '📚', color: 'bg-orange-100 text-orange-700' },
  puntual: { label: 'Puntual', emoji: '⏰', color: 'bg-purple-100 text-purple-700' },
  flexible: { label: 'Flexible', emoji: '🤝', color: 'bg-teal-100 text-teal-700' },
};

// Mapeo de modos de evaluación
const EVAL_CONFIG: Record<string, { label: string; emoji: string }> = {
  examenes: { label: 'Exámenes', emoji: '📝' },
  proyectos: { label: 'Proyectos', emoji: '💻' },
  tareas: { label: 'Tareas', emoji: '📋' },
  participacion: { label: 'Participación', emoji: '🙋' },
};

interface ReviewProps {
  resena: {
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
  };
}

export default function ReviewCard({ resena }: ReviewProps) {
  const [votosLocales, setVotosLocales] = useState(resena.votos_utiles || 0);
  const [voted, setVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  // Formatear fecha
  const fecha = new Date(resena.created_at).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleVote = async () => {
    if (voted || isVoting) return;
    
    setIsVoting(true);
    const result = await votarResena(resena.id);
    
    if (result.success) {
      setVotosLocales(result.newCount || votosLocales + 1);
      setVoted(true);
    }
    setIsVoting(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">
            {resena.es_anonimo ? "Estudiante Anónimo" : "Usuario Verificado"}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{fecha}</span>
            {resena.semestre && (
              <>
                <span>•</span>
                <span className="text-primary font-medium">{resena.semestre}</span>
              </>
            )}
          </div>
          {resena.materia_nombre && (
            <p className="text-xs text-primary font-medium mt-0.5">📚 {resena.materia_nombre}</p>
          )}
        </div>
        <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold flex gap-1">
          {resena.puntuacion_general} <span>★</span>
        </div>
      </div>

      {/* Tags del profesor (si existen) */}
      {resena.tags && resena.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {resena.tags.map((tagId) => {
            const tagConfig = TAG_CONFIG[tagId];
            if (!tagConfig) return null;
            return (
              <span 
                key={tagId}
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${tagConfig.color}`}
              >
                {tagConfig.emoji} {tagConfig.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Modos de evaluación */}
      {resena.modos_evaluacion && resena.modos_evaluacion.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {resena.modos_evaluacion.map((modoId) => {
            const evalConfig = EVAL_CONFIG[modoId];
            if (!evalConfig) return null;
            return (
              <span 
                key={modoId}
                className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
              >
                {evalConfig.emoji} {evalConfig.label}
              </span>
            );
          })}
        </div>
      )}

      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
        "{resena.comentario || "Sin comentario escrito."}"
      </p>

      {/* Tags de métricas específicas */}
      <div className="flex gap-2 flex-wrap mb-4">
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${resena.dificultad > 3 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          Dificultad: {resena.dificultad}/5
        </span>
        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium">
          Apoyo: {resena.apoyo}/5
        </span>
        <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-md text-xs font-medium">
          Puntualidad: {resena.puntualidad}/5
        </span>
      </div>

      {/* Botón de voto útil */}
      <div className="flex justify-end border-t border-slate-100 dark:border-slate-700 pt-3">
        <button
          onClick={handleVote}
          disabled={voted || isVoting}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            voted 
              ? 'bg-green-100 text-green-600 cursor-default' 
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
          }`}
        >
          <span>{voted ? '✓' : '👍'}</span>
          <span>{voted ? '¡Gracias!' : '¿Fue útil?'}</span>
          {votosLocales > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded text-xs">
              {votosLocales}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}