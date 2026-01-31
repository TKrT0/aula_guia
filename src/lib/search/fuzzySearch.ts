import Fuse, { IFuseOptions } from 'fuse.js'

export interface SearchableItem {
  materia_id: string
  materia_nombre: string
  profesor_id: string
  profesor_nombre: string
  nrc: string
  carrera_id?: string
  carrera_nombre?: string
  rating_promedio?: number
  dificultad_promedio?: number
  recomendacion_pct?: number
}

// Configuración optimizada para búsqueda de profesores y materias
const fuseOptions: IFuseOptions<SearchableItem> = {
  keys: [
    { name: 'profesor_nombre', weight: 0.4 },
    { name: 'materia_nombre', weight: 0.4 },
    { name: 'nrc', weight: 0.2 },
  ],
  threshold: 0.4, // 0 = match exacto, 1 = match cualquier cosa
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true,
  ignoreLocation: true,
  useExtendedSearch: true,
}

let fuseInstance: Fuse<SearchableItem> | null = null
let cachedData: SearchableItem[] = []

// Inicializar o actualizar el índice de Fuse
export function initFuseIndex(data: SearchableItem[]) {
  cachedData = data
  fuseInstance = new Fuse(data, fuseOptions)
}

// Búsqueda fuzzy local (instantánea)
export function fuzzySearch(
  term: string,
  carreraId?: string | null,
  limit: number = 50
): SearchableItem[] {
  if (!fuseInstance || !term.trim()) {
    return carreraId 
      ? cachedData.filter(item => item.carrera_id === carreraId).slice(0, limit)
      : cachedData.slice(0, limit)
  }

  const results = fuseInstance.search(term)
  
  // Filtrar por carrera si está seleccionada
  let filtered = results.map(r => r.item)
  if (carreraId) {
    filtered = filtered.filter(item => item.carrera_id === carreraId)
  }

  return filtered.slice(0, limit)
}

// Obtener sugerencias fuzzy (para autocomplete)
export function fuzzySuggestions(
  term: string,
  carreraId?: string | null,
  limit: number = 8
): SearchableItem[] {
  return fuzzySearch(term, carreraId, limit)
}

// Verificar si el índice está inicializado
export function isFuseIndexReady(): boolean {
  return fuseInstance !== null && cachedData.length > 0
}

// Obtener el tamaño del cache
export function getCacheSize(): number {
  return cachedData.length
}
