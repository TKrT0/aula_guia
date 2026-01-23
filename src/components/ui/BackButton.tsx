'use client'; 

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()} 
      className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6 transition-colors font-medium group"
    >
      <span className="group-hover:-translate-x-1 transition-transform">←</span> 
      Volver
    </button>
  );
}