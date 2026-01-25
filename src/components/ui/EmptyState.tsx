import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  termino: string;
}

export default function EmptyState({ termino }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icono visual (puedes usar un emoji o un SVG) */}
      <div className="text-6xl mb-6 opacity-80">
        🔍
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-2">
        No encontramos nada para "{termino}"
      </h3>
      
      <p className="text-slate-500 max-w-md mx-auto mb-8">
        Tal vez la materia está escrita diferente o el profesor aún no ha sido registrado.
      </p>

      {/* Llamada a la acción (CTA) - Próximamente */}
      {/* 
      <div className="flex gap-4 justify-center">
        <button className="px-4 py-2 bg-primary text-white rounded-xl shadow-md hover:shadow-lg hover:bg-primary/90 transition-all text-sm font-bold">
          + Agregar materia nueva
        </button>
      </div>
      */}
    </div>
  );
}