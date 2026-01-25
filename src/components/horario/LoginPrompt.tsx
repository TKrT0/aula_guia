'use client'

import { signInWithGoogle } from '@/src/lib/services/authService'
import Link from 'next/link'

interface LoginPromptProps {
  redirectTo?: string
}

export default function LoginPrompt({ redirectTo = '/horario' }: LoginPromptProps) {
  const handleGoogleLogin = async () => {
    await signInWithGoogle(redirectTo)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-4xl">calendar_month</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Simulador de Horarios
          </h1>
          <p className="text-slate-600">
            Crea y organiza tu horario perfecto. Guarda tus configuraciones y accede desde cualquier dispositivo.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-emerald-600 text-lg">sync</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Sincronización automática</h3>
              <p className="text-xs text-slate-500">Accede a tu horario desde cualquier dispositivo</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-amber-600 text-lg">warning</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Detección de conflictos</h3>
              <p className="text-xs text-slate-500">Te avisamos si hay choques de horario</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-blue-600 text-lg">download</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Exporta tu horario</h3>
              <p className="text-xs text-slate-500">Descarga tu horario en imagen o PDF</p>
            </div>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 rounded-xl py-3 px-4 hover:border-slate-300 hover:bg-slate-50 transition-all group"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="font-semibold text-slate-700 group-hover:text-slate-900">
            Continuar con Google
          </span>
        </button>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-sm text-slate-500 hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Volver al inicio
          </Link>
        </div>

        {/* Privacy Note */}
        <p className="text-[10px] text-slate-400 text-center mt-6">
          Solo usamos tu cuenta para guardar tu horario. No compartimos tu información.
        </p>
      </div>
    </div>
  )
}
