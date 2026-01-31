'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service (e.g., Sentry)
    console.error('Global Error:', error)
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
          className="mx-auto mb-6 w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center"
        >
          <AlertTriangle className="size-10 text-destructive" />
        </motion.div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          ¡Algo salió mal!
        </h1>
        
        <p className="text-muted-foreground mb-6">
          Ha ocurrido un error inesperado. Por favor, intenta de nuevo o regresa al inicio.
        </p>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-6 p-4 bg-destructive/5 border border-destructive/20 rounded-lg text-left">
            <p className="text-sm font-mono text-destructive break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="default" className="gap-2">
            <RefreshCw className="size-4" />
            Intentar de nuevo
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
