'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Keyboard, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ShortcutItem {
  keys: string[]
  description: string
}

const shortcuts: ShortcutItem[] = [
  { keys: ['Ctrl', 'K'], description: 'Abrir búsqueda rápida' },
  { keys: ['Esc'], description: 'Cerrar modal/drawer' },
  { keys: ['Alt', 'H'], description: 'Ir al inicio' },
  { keys: ['Alt', 'S'], description: 'Ir a horarios' },
  { keys: ['Alt', 'B'], description: 'Ir a búsqueda' },
]

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-shadow"
        title="Atajos de teclado"
      >
        <Keyboard className="size-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed bottom-20 right-4 z-50 w-80"
            >
              <Card className="p-4 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Keyboard className="size-4" />
                    Atajos de teclado
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="size-8"
                  >
                    <X className="size-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {shortcuts.map((shortcut, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0"
                    >
                      <span className="text-sm text-muted-foreground">
                        {shortcut.description}
                      </span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, kidx) => (
                          <kbd
                            key={kidx}
                            className="px-2 py-0.5 bg-muted rounded text-xs font-mono"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
