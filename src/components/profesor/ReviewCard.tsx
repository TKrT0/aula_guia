import React from 'react';

interface ReviewProps {
  resena: {
    puntuación_general: number;
    dificultad: number;
    comentario: string;
    apoyo: number;
    puntualidad: number;
    es_anonimo: boolean;
    created_at: string;
  };
}

export default function ReviewCard({ resena }: ReviewProps) {
  // Función auxiliar para renderizar estrellitas simples
  const renderStars = (count: number) => "⭐".repeat(Math.round(count));
  
  // Formatear fecha
  const fecha = new Date(resena.created_at).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">
            {resena.es_anonimo ? "Estudiante Anónimo" : "Usuario Verificado"}
          </h3>
          <p className="text-xs text-slate-400">{fecha}</p>
        </div>
        <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold flex gap-1">
          {resena.puntuación_general} <span>★</span>
        </div>
      </div>

      <p className="text-slate-600 text-sm leading-relaxed mb-4">
        "{resena.comentario || "Sin comentario escrito."}"
      </p>

      {/* Tags de métricas específicas */}
      <div className="flex gap-2 flex-wrap">
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
    </div>
  );
}