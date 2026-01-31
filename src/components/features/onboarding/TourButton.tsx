'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { HelpCircle, X, Play } from 'lucide-react'
import { 
  hasCompletedTour, 
  startScheduleTour, 
  startSearchTour,
  resetTours
} from '@/src/lib/onboarding/tourConfig'

interface TourButtonProps {
  tourType: 'schedule' | 'search'
  showInitialPrompt?: boolean
}

export function TourButton({ tourType, showInitialPrompt = true }: TourButtonProps) {
  const [showPrompt, setShowPrompt] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Show prompt for first-time users after a delay
    if (showInitialPrompt && !hasCompletedTour(tourType)) {
      const timer = setTimeout(() => setShowPrompt(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [tourType, showInitialPrompt])

  const handleStartTour = () => {
    setShowPrompt(false)
    if (tourType === 'schedule') {
      startScheduleTour()
    } else {
      startSearchTour()
    }
  }

  if (!mounted) return null

  return (
    <>
      {/* Floating help button */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleStartTour}
        className="rounded-full"
        title="Ver tutorial"
      >
        <HelpCircle className="size-4" />
      </Button>

      {/* Initial prompt for new users */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-20 right-4 z-50 max-w-xs"
          >
            <div className="bg-background border rounded-lg shadow-xl p-4">
              <button
                onClick={() => setShowPrompt(false)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
              
              <div className="flex items-start gap-3 pr-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <HelpCircle className="size-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">
                    ¿Primera vez aquí?
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Te mostramos cómo usar esta sección en menos de 30 segundos.
                  </p>
                  <Button
                    size="sm"
                    onClick={handleStartTour}
                    className="gap-1.5"
                  >
                    <Play className="size-3" />
                    Ver tutorial
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Component to reset tours (for testing/settings)
export function ResetToursButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        resetTours()
        window.location.reload()
      }}
    >
      Reiniciar tutoriales
    </Button>
  )
}
