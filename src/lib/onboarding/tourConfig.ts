import { driver, type DriveStep, type Config } from 'driver.js'
import 'driver.js/dist/driver.css'

const TOUR_STORAGE_KEY = 'aula_guia_tour_completed'

export function hasCompletedTour(tourId: string): boolean {
  if (typeof window === 'undefined') return true
  const completed = localStorage.getItem(TOUR_STORAGE_KEY)
  if (!completed) return false
  const tours = JSON.parse(completed) as string[]
  return tours.includes(tourId)
}

export function markTourCompleted(tourId: string): void {
  if (typeof window === 'undefined') return
  const completed = localStorage.getItem(TOUR_STORAGE_KEY)
  const tours = completed ? JSON.parse(completed) as string[] : []
  if (!tours.includes(tourId)) {
    tours.push(tourId)
    localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(tours))
  }
}

export function resetTours(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOUR_STORAGE_KEY)
}

const baseConfig: Partial<Config> = {
  showProgress: true,
  animate: true,
  smoothScroll: true,
  allowClose: true,
  overlayColor: 'rgba(150, 206, 180, 0.7)',
  popoverClass: 'aula-guia-popover',
  nextBtnText: 'Siguiente',
  prevBtnText: 'Anterior',
  doneBtnText: '¡Entendido!',
  progressText: '{{current}} de {{total}}',
}

// Tour para la página de horarios
export const scheduleSteps: DriveStep[] = [
  {
    element: '[data-tour="schedule-sidebar"]',
    popover: {
      title: '🔍 Buscar Materias',
      description: 'Aquí puedes buscar materias por nombre, NRC o profesor. Los resultados aparecerán debajo.',
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '[data-tour="schedule-grid"]',
    popover: {
      title: '📅 Tu Horario',
      description: 'Este es tu horario semanal. Las materias que agregues aparecerán aquí con colores distintivos.',
      side: 'left',
      align: 'center',
    },
  },
  {
    element: '[data-tour="schedule-credits"]',
    popover: {
      title: '📊 Créditos Totales',
      description: 'Aquí puedes ver cuántos créditos llevas acumulados en tu horario.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="schedule-export"]',
    popover: {
      title: '📤 Exportar Horario',
      description: 'Exporta tu horario como PDF, imagen o archivo de calendario (.ics) para Google Calendar.',
      side: 'bottom',
      align: 'end',
    },
  },
  {
    element: '[data-tour="schedule-manager"]',
    popover: {
      title: '📁 Gestionar Horarios',
      description: 'Puedes crear múltiples horarios para comparar diferentes opciones de materias.',
      side: 'bottom',
      align: 'end',
    },
  },
]

// Tour para la página de búsqueda
export const searchSteps: DriveStep[] = [
  {
    element: '[data-tour="search-input"]',
    popover: {
      title: '🔍 Buscar Profesores',
      description: 'Escribe el nombre del profesor o materia que buscas. La búsqueda es inteligente y tolerante a errores.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="search-filters"]',
    popover: {
      title: '🎯 Filtros',
      description: 'Filtra por carrera para ver solo las materias relevantes para ti.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="search-results"]',
    popover: {
      title: '📋 Resultados',
      description: 'Los resultados muestran rating, dificultad y reseñas. Haz clic para ver más detalles del profesor.',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '[data-tour="search-view-toggle"]',
    popover: {
      title: '🔄 Cambiar Vista',
      description: 'Alterna entre vista de cuadrícula y lista según tu preferencia.',
      side: 'bottom',
      align: 'end',
    },
  },
]

export function startScheduleTour(onComplete?: () => void): void {
  const driverObj = driver({
    ...baseConfig,
    steps: scheduleSteps,
    onDestroyStarted: () => {
      markTourCompleted('schedule')
      if (onComplete) onComplete()
      driverObj.destroy()
    },
  })

  driverObj.drive()
}

export function startSearchTour(onComplete?: () => void): void {
  const driverObj = driver({
    ...baseConfig,
    steps: searchSteps,
    onDestroyStarted: () => {
      markTourCompleted('search')
      if (onComplete) onComplete()
      driverObj.destroy()
    },
  })

  driverObj.drive()
}
