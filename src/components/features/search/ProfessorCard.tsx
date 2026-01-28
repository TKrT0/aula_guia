import Link from 'next/link';

interface ProfessorCardProps {
  id: string;
  nombre: string;
  facultad: string;
  rating: number | null;
  dificultad: number | null;
  recomendacion?: number | null;
  nrc?: string | null;
}

// Funciones extraídas fuera del componente para evitar recrearlas en cada render
const getIniciales = (name: string) => 
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

const renderEstrellas = (calificacion: number) => {
  const estrellasActivas = Math.round(calificacion);
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((index) => (
        <span 
          key={index} 
          className={`text-lg ${index <= estrellasActivas ? 'text-yellow-400' : 'text-slate-200'}`}
        >
          ★
        </span>
      ))}
      <span className="text-xs text-slate-400 font-bold ml-1 pt-1">
        {calificacion || 0}
      </span>
    </div>
  );
};

export default function ProfessorCard({ 
  id,
  nombre, 
  facultad, 
  rating, 
  dificultad, 
  recomendacion,
  nrc 
}: ProfessorCardProps) {
  return (
    <Link 
      href={`/profesor/${id}`}
      className="block w-full bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:border-primary/30 transition-all group"
    >
      {/* Avatar e Info Principal */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold">
          {getIniciales(nombre)}
        </div>
        <div className="overflow-hidden">
          <h3 className="font-bold text-slate-800 dark:text-white truncate group-hover:text-primary transition-colors">
            {nombre}
          </h3>
          <p className="text-xs text-slate-500 truncate">{facultad}</p>
          {nrc && (
            <p className="text-[10px] text-slate-400 mt-0.5">NRC: {nrc}</p>
          )}
        </div>
      </div>

      {/* Métricas Compactas */}
      <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-50 dark:border-slate-700">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Calificación</p>
          <div className="text-sm font-black text-slate-700 dark:text-slate-200">
            {rating != null ? renderEstrellas(rating) : <span className="text-slate-400">N/A</span>}
          </div>
        </div>
        <div className="text-center border-x border-slate-50 dark:border-slate-700">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Dificultad</p>
          <p className="text-sm font-black text-slate-700 dark:text-slate-200">
            {dificultad != null ? dificultad : 'N/A'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Rec.</p>
          <p className="text-sm font-black text-slate-700 dark:text-slate-200">
            {recomendacion != null ? `${recomendacion}%` : 'N/A'}
          </p>
        </div>
      </div>
      
      <div className="w-full mt-4 py-2 bg-slate-50 dark:bg-slate-700/50 group-hover:bg-primary group-hover:text-white text-primary text-xs font-bold rounded-xl transition-all text-center">
        Ver perfil completo
      </div>
    </Link>
  );
}