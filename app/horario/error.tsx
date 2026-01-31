'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Calendar, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function HorarioError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Horario Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="mx-auto mb-6 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
        >
          <Calendar className="size-10 text-primary" />
        </motion.div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          Error al cargar horarios
        </h1>
        
        <p className="text-muted-foreground mb-6">
          No pudimos cargar tu horario. Esto puede deberse a un problema de conexión o del servidor.
        </p>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-6 p-4 bg-destructive/5 border border-destructive/20 rounded-lg text-left">
            <p className="text-sm font-mono text-destructive break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="default" className="gap-2">
            <RefreshCw className="size-4" />
            Reintentar
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/">
              <Home className="size-4" />
              Ir al inicio
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
