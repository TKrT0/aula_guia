import Link from 'next/link'

interface Props {
  searchParams: Promise<{ message?: string }>
}

export default async function AuthErrorPage({ searchParams }: Props) {
  const params = await searchParams
  const errorMessage = params.message || 'Error desconocido'
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-red-500 text-3xl">error</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Error de Autenticación
        </h1>
        <p className="text-slate-600 mb-4">
          Hubo un problema al iniciar sesión. Por favor, intenta de nuevo.
        </p>
        <p className="text-xs text-red-500 bg-red-50 p-2 rounded mb-6 font-mono">
          {errorMessage}
        </p>
        <Link
          href="/horario"
          className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
        >
          Intentar de nuevo
        </Link>
      </div>
    </div>
  )
}
