import { getProfessorProfile } from '@/src/lib/services/professorService'
import ReviewsList from '@/src/components/features/profesor/ReviewsList'
import CalificarButton from '@/src/components/features/profesor/CalificarButton'
import Navbar from '@/src/components/layout/Navbar'
import BackButton from '@/src/components/ui/BackButton'

export default async function ProfesorDetalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const perfil = await getProfessorProfile(id)

  if (!perfil) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-slate-800 dark:text-white">
            Profesor no encontrado
          </h2>
          <p className="font-body text-slate-500 dark:text-slate-400 mb-4">
            El ID {id} no existe en la base de datos.
          </p>
          <BackButton />
        </div>
      </div>
    )
  }

  const { stats } = perfil

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220]">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <BackButton />

        {/* TARJETA DE PERFIL */}
        <div className="bg-white dark:bg-[#0F1C2E] rounded-2xl p-6 sm:p-8 
          shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            
            {/* Avatar */}
            <div className="size-20 sm:size-24 bg-gradient-to-br from-[#003A5C] to-[#00507A] 
              dark:from-[#00BCD4] dark:to-[#2B8CEE]
              text-white rounded-2xl flex items-center justify-center 
              text-2xl sm:text-3xl font-display font-bold
              shadow-lg shadow-[#003A5C]/20 dark:shadow-cyan-500/20">
              {perfil.nombre.charAt(0)}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">
                {perfil.nombre}
              </h1>
              <p className="font-body text-slate-500 dark:text-slate-400 text-base sm:text-lg">
                {perfil.facultad}
              </p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                <span className="px-3 py-1 bg-[#00BCD4]/10 dark:bg-cyan-500/20 
                  text-[#00BCD4] dark:text-cyan-400 
                  rounded-full text-xs font-semibold uppercase">
                  {perfil.metodo || "Método Mixto"}
                </span>
              </div>
              <div className="mt-4">
                <CalificarButton profesorId={id} profesorNombre={perfil.nombre} />
              </div>
            </div>

            {/* Estadísticas */}
            <div className="flex gap-6 text-center">
              <div>
                <p className="font-display text-2xl sm:text-3xl font-black text-[#00BCD4]">
                  {stats.rating}
                </p>
                <p className="font-body text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                  Calificación
                </p>
              </div>
              <div className="w-px bg-slate-200 dark:bg-slate-700 h-12"></div>
              <div>
                <p className="font-display text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
                  {stats.dificultad}
                </p>
                <p className="font-body text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                  Dificultad
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN DE RESEÑAS */}
        <div className="mt-8">
          <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white mb-4">
            Opiniones de estudiantes ({stats.totalResenas})
          </h2>

          {perfil.resenas && perfil.resenas.length > 0 ? (
            <ReviewsList resenas={perfil.resenas} />
          ) : (
            <div className="p-10 text-center bg-white dark:bg-[#0F1C2E] rounded-2xl 
              border border-dashed border-slate-300 dark:border-slate-700">
              <p className="font-body text-slate-400 dark:text-slate-500 mb-2">
                Este profesor aún no tiene reseñas.
              </p>
              <p className="font-body text-sm text-[#00BCD4] font-medium">
                ¡Sé el primero en opinar!
              </p>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}