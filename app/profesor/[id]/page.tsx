import { getProfessorProfile } from '@/src/lib/services/professorService';
import ReviewCard from '@/src/components/profesor/ReviewCard';
import Navbar from '@/src/components/layout/Navbar';
import Link from 'next/link';
import BackButton from '@/src/components/ui/BackButton';

// Esta función es especial de Next.js para páginas dinámicas (Server Components)
export default async function ProfesorDetalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const perfil = await getProfessorProfile(id);

if (!perfil) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Profesor no encontrado</h2>
          <p className="text-slate-500 mb-4">El ID {id} no existe en la base de datos.</p>
          <BackButton />
        </div>
      </div>
    );
  }

  const { stats } = perfil; 

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Botón Volver */}
        <BackButton />

        {/* TARJETA DE PERFIL */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            
            {/* Avatar */}
            <div className="w-24 h-24 bg-primary text-white rounded-2xl flex items-center justify-center text-3xl font-bold">
              {perfil.nombre.charAt(0)}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-800">{perfil.nombre}</h1>
              <p className="text-slate-500 text-lg">{perfil.facultad}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase">
                  {perfil.metodo || "Método Mixto"}
                </span>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-3xl font-black text-slate-800">{stats.rating}</p>
                <p className="text-xs text-slate-400 uppercase font-bold">Calificación</p>
              </div>
              <div className="w-px bg-slate-200 h-12"></div>
              <div>
                <p className="text-3xl font-black text-slate-800">{stats.dificultad}</p>
                <p className="text-xs text-slate-400 uppercase font-bold">Dificultad</p>
              </div>
            </div>

            {/* --- ESTADÍSTICAS DEL BACKEND --- */}
            {/* Aquí es donde brilla tu nueva función */}
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-3xl font-black text-slate-800">{stats.rating}</p>
                <p className="text-xs text-slate-400 uppercase font-bold">Calificación</p>
              </div>
              <div className="w-px bg-slate-200 h-12"></div>
              <div>
                <p className="text-3xl font-black text-slate-800">{stats.dificultad}</p>
                <p className="text-xs text-slate-400 uppercase font-bold">Dificultad</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECCIÓN DE RESEÑAS (Próximamente) --- */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Opiniones de estudiantes ({stats.totalResenas})
          </h2>

          {/* LÓGICA DE RENDERIZADO */}
          {perfil.resenas && perfil.resenas.length > 0 ? (
            <div className="space-y-4">
              {perfil.resenas.map((resena: any, index: number) => (
                <ReviewCard key={index} resena={resena} />
              ))}
            </div>
          ) : (
            <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-400 mb-2">Este profesor aún no tiene reseñas.</p>
              <p className="text-sm text-primary font-medium">¡Sé el primero en opinar!</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}