'use client'

import { signInWithGoogle } from '@/src/lib/services/authService'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, RefreshCw, AlertTriangle, Download, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface LoginPromptProps {
  redirectTo?: string
}

export default function LoginPrompt({ redirectTo = '/horario' }: LoginPromptProps) {
  const handleGoogleLogin = async () => {
    await signInWithGoogle(redirectTo)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="rounded-2xl shadow-xl p-8 max-w-md w-full bg-white dark:bg-[#0F1C2E] border-slate-200 dark:border-slate-800">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="size-20 bg-gradient-to-br from-[#003A5C] to-[#00507A] dark:from-[#00BCD4] dark:to-[#2B8CEE] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Calendar className="size-10 text-white" />
            </motion.div>
            <h1 className="font-display text-2xl font-bold mb-2 text-slate-800 dark:text-white">
              Simulador de Horarios
            </h1>
            <p className="font-body text-slate-500 dark:text-slate-400">
              Crea y organiza tu horario perfecto. Guarda tus configuraciones y accede desde cualquier dispositivo.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            {[
              { icon: RefreshCw, color: 'emerald', title: 'Sincronización automática', desc: 'Accede a tu horario desde cualquier dispositivo' },
              { icon: AlertTriangle, color: 'amber', title: 'Detección de conflictos', desc: 'Te avisamos si hay choques de horario' },
              { icon: Download, color: 'blue', title: 'Exporta tu horario', desc: 'Descarga tu horario en imagen o PDF' },
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className={`w-8 h-8 bg-${feature.color}-100 dark:bg-${feature.color}-500/20 rounded-lg flex items-center justify-center shrink-0`}>
                  <feature.icon className={`size-4 text-${feature.color}-600`} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Login Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full h-12 gap-3 rounded-xl border-2 group"
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
              <span className="font-semibold">
                Continuar con Google
              </span>
            </Button>
          </motion.div>

          {/* Back Link */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-6"
          >
            <Link 
              href="/" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="size-4" />
              Volver al inicio
            </Link>
          </motion.div>

          {/* Privacy Note */}
          <p className="text-[10px] text-muted-foreground text-center mt-6">
            Solo usamos tu cuenta para guardar tu horario. No compartimos tu información.
          </p>
        </Card>
      </motion.div>
    </div>
  )
}
