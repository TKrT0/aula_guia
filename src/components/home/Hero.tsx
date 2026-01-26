'use client';

import React from 'react';
import Navbar from '../layout/Navbar'; 
import SearchBar from '../search/SearchBar'; 
import CarreraSelector from '../ui/CarreraSelector';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();

  // Función simple: Cuando el SearchBar nos dé un término, cambiamos de página
  const manejarBusqueda = (termino: string) => {
    router.push(`/buscar?q=${encodeURIComponent(termino)}`);
  };

  return (
    <section className="relative w-full flex flex-col items-center pt-16 pb-20 px-4 sm:px-10 bg-gradient-to-b from-slate-50 to-white dark:from-background-dark dark:to-background-dark">
      
      {/* 1. DECORACIÓN DE FONDO */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-100/50 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-[100px]"></div>
      </div>

      {/* 2. CONTENIDO PRINCIPAL */}
      <div className="relative max-w-[860px] w-full flex flex-col items-center text-center gap-8 z-10 mt-10">
        
        {/* Textos */}
        <div className="flex flex-col gap-4">
          <h1 className="text-primary dark:text-white text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight">
            Elige a tus profesores con <span className="text-[#00bcd4]">datos reales</span>, no con rumores
          </h1>
          <h2 className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl font-normal max-w-2xl mx-auto">
            La plataforma de alumnos para alumnos de la BUAP que democratiza la información académica.
          </h2>
        </div>

        {/* 3. SELECTOR DE CARRERA - Nuevo */}
        <div className="w-full flex justify-center">
          <CarreraSelector showLabel={true} />
        </div>

        {/* 4. BARRA DE BÚSQUEDA */}
        <div className="w-full max-w-[640px] z-50">
          <SearchBar onSearch={manejarBusqueda} />
        </div>

      </div>
    </section>
  );
}
