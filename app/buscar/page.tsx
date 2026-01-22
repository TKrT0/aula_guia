'use client';
import { useSearchParams } from 'next/navigation';
import Navbar from "@/src/components/layout/Navbar";

export default function BuscarPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q'); // Aquí se captura lo que clickeaste

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark">
      <Navbar />
      <main className="max-w-[1280px] mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-primary dark:text-white">
          Resultados para: <span className="text-accent">{query}</span>
        </h1>
        <p className="mt-4 text-slate-500">
          Próximamente: Aquí verás la ficha detallada y las estadísticas.
        </p>
      </main>
    </div>
  );
}