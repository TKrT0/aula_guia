'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from "@/src/components/layout/Navbar";
import { buscarProfesoresYMaterias } from '@/src/lib/supabase/queries';
import ProfessorCard from '@/src/components/features/search/ProfessorCard';
import EmptyState from '@/src/components/ui/EmptyState';
import CarreraSelector from '@/src/components/ui/CarreraSelector';
import { useCarrera } from '@/src/contexts/CarreraContext';

export default function BuscarPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [resultados, setResultados] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const { carreraId, carreraNombre } = useCarrera();

  useEffect(() => {
    async function obtenerDatos() {
      setCargando(true);
      const data = await buscarProfesoresYMaterias(query, carreraId);
      setResultados(data);
      setCargando(false);
    }
    
    if (query) {
      obtenerDatos();
    }
  }, [query, carreraId]);

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark">
      <Navbar />
      
      <main className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Encabezado de resultados con selector de carrera */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Resultados para: <span className="text-primary italic">"{query}"</span>
            </h1>
            <p className="text-slate-500 mt-1">
              {cargando ? 'Buscando...' : `Se encontraron ${resultados.length} coincidencias`}
              {carreraNombre && <span className="text-primary font-medium"> en {carreraNombre}</span>}
            </p>
          </div>
          <CarreraSelector showLabel={false} />
        </div>

        {/* Grid de Tarjetas  */}
        {cargando ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">Buscando...</p>
          </div>
        ) : resultados.length === 0 ? (
          <div className="text-center py-20">
            <EmptyState termino={query} />
            {carreraId && (
              <p className="text-slate-400 mt-4 text-sm">
                Prueba seleccionando otra carrera o busca sin filtro
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resultados.map((item, index) => (
              <ProfessorCard
                key={item.materia_id || index}
                id={item.profesor_id}
                nombre={item.profesor_nombre || "Sin nombre"}
                facultad={`Materia: ${item.materia_nombre}`}
                rating={item.rating_promedio ?? null}
                dificultad={item.dificultad_promedio ?? null}
                recomendacion={item.recomendacion_pct ?? null}
                nrc={item.nrc ?? null}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
