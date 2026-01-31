'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface KeyboardShortcutsOptions {
  onOpenSearch?: () => void
  onCloseModal?: () => void
  onNavigateHome?: () => void
  onNavigateSchedule?: () => void
  enabled?: boolean
}

export function useKeyboardShortcuts(options: KeyboardShortcutsOptions = {}) {
  const router = useRouter()
  const {
    onOpenSearch,
    onCloseModal,
    onNavigateHome,
    onNavigateSchedule,
    enabled = true
  } = options

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return

    // Ignore if user is typing in an input
    const target = event.target as HTMLElement
    const isInputFocused = 
      target.tagName === 'INPUT' || 
      target.tagName === 'TEXTAREA' || 
      target.isContentEditable

    // Ctrl/Cmd + K - Open search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault()
      if (onOpenSearch) {
        onOpenSearch()
      } else {
        router.push('/buscar')
      }
      return
    }

    // Escape - Close modal/drawer
    if (event.key === 'Escape') {
      if (onCloseModal) {
        onCloseModal()
      }
      return
    }

    // Don't process other shortcuts if typing
    if (isInputFocused) return

    // G then H - Go to Home (vim-style navigation)
    // G then S - Go to Schedule
    // These are handled differently - we track key sequences

    // Alt + H - Navigate to home
    if (event.altKey && event.key === 'h') {
      event.preventDefault()
      if (onNavigateHome) {
        onNavigateHome()
      } else {
        router.push('/')
      }
      return
    }

    // Alt + S - Navigate to schedule
    if (event.altKey && event.key === 's') {
      event.preventDefault()
      if (onNavigateSchedule) {
        onNavigateSchedule()
      } else {
        router.push('/horario')
      }
      return
    }

    // Alt + B - Navigate to search
    if (event.altKey && event.key === 'b') {
      event.preventDefault()
      router.push('/buscar')
      return
    }

  }, [enabled, onOpenSearch, onCloseModal, onNavigateHome, onNavigateSchedule, router])

  useEffect(() => {
    if (!enabled) return

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown, enabled])
}

// Hook for global shortcuts (used in layout)
export function useGlobalKeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + K - Quick search from anywhere
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        router.push('/buscar')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])
}
