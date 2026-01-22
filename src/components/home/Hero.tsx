'use client';
import { useState, useEffect } from 'react';
import { buscarProfesoresYMaterias } from '@/src/lib/supabaseQueries';

export default function Hero() {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<any[]>([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 1) {
        const data = await buscarProfesoresYMaterias(query);
        setResultados(data);
      } else { setResultados([]); }
    }, 200);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <section className="relative w-full flex flex-col items-center pt-16 pb-20 px-4 sm:px-10 bg-gradient-to-b from-slate-50 to-white dark:from-background-dark dark:to-background-dark">
      {/* Decoración de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-100/50 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-[100px]"></div>
      </div>

      <div className="relative max-w-[860px] w-full flex flex-col items-center text-center gap-8 z-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-primary dark:text-white text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight">
            Elige a tus profesores con <span className="text-[#00bcd4]">datos reales</span>, no con rumores
          </h1>
          <h2 className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl font-normal max-w-2xl mx-auto">
            La plataforma de alumnos para alumnos de la BUAP que democratiza la información académica.
          </h2>
        </div>

        {/* Buscador y Dropdown */}
        <div className="relative w-full max-w-[640px] mt-4 z-50">
          <label className="relative flex items-center w-full h-14 sm:h-16 rounded-full shadow-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden group">
            <div className="pl-6 pr-3 text-slate-400 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined text-2xl">search</span>
            </div>
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="peer h-full w-full bg-transparent text-slate-800 dark:text-white placeholder:text-slate-400 text-base sm:text-lg border-none focus:ring-0 px-0 outline-none" 
              placeholder="Escribe el nombre de un profesor o materia..." 
            />
            <div className="pr-2">
              <button className="h-10 sm:h-12 px-6 sm:px-8 bg-primary hover:bg-[#002a42] text-white rounded-full font-bold text-sm transition-colors">
                Buscar
              </button>
            </div>
          </label>

          {/* Resultados Reales */}
          {resultados.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-3 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col">
              <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resultados Encontrados</span>
              </div>
              {resultados.map((res, i) => (
                <button 
                  key={i}
                  onClick={() => window.location.href = `/buscar?q=${encodeURIComponent(res.profesores?.nombre || res.nombre)}`}
                  className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group text-left border-b border-slate-50 dark:border-slate-700 last:border-none"
                >
                  <div className={`size-10 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${res.profesores ? 'bg-primary text-white' : 'bg-cyan-50 text-[#00bcd4]'}`}>
                    <span className="material-symbols-outlined text-xl">{res.profesores ? 'person' : 'menu_book'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">{res.nombre}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{res.profesores?.nombre || 'Materia'} • NRC: {res.nrc}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}