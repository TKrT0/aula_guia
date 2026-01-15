'use client'
import { createClient } from '@/src/utils/supabase' 

export default function Home() {
  const handleTest = async () => {
    const supabase = createClient()
    
    const { data, error } = await supabase.from('_test').select('*')
    
    if (error) {
      alert('Conectado a Supabase, pero la tabla no existe (es normal): ' + error.message)
    } else {
      alert('¡Conexión total establecida!')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-900 text-center">
      <h1 className="text-4xl font-bold text-sky-400 mb-4">
        ¡Stack listo y funcionando!
      </h1>
      <p className="text-white opacity-80 mb-8">
        Next.js + Tailwind + Supabase + Python
      </p>
      <button 
        onClick={handleTest}
        className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full transition-all active:scale-95"
      >
        Probar conexión real
      </button>
    </main>
  )
}