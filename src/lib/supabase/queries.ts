import { createClient } from '@/src/lib/supabase/client';

// Función Principal de Búsqueda (Grid) - Con filtro de carrera opcional
export const buscarProfesoresYMaterias = async (termino: string, carreraId?: string | null) => {
  const supabase = createClient();
  
  let query = supabase
    .from('vista_buscador')
    .select('*')
    .or(`materia_nombre.ilike.%${termino}%,profesor_nombre.ilike.%${termino}%,nrc.ilike.%${termino}%`);
  
  // Filtrar por carrera si está seleccionada
  if (carreraId) {
    query = query.eq('carrera_id', carreraId);
  }
  
  const { data, error } = await query.limit(50);

  if (error) {
    return [];
  }
  return data;
};

// Función de Sugerencias (SearchBar) - Con filtro de carrera opcional
export const obtenerSugerencias = async (termino: string, carreraId?: string | null) => {
  // Validación rápida
  if (!termino || termino.length < 2) return [];

  const supabase = createClient();

  let query = supabase
    .from('vista_buscador')
    .select('materia_nombre, profesor_nombre, materia_id, profesor_id, nrc, carrera_id')
    .or(`materia_nombre.ilike.%${termino}%,profesor_nombre.ilike.%${termino}%,nrc.ilike.%${termino}%`);
  
  // Filtrar por carrera si está seleccionada
  if (carreraId) {
    query = query.eq('carrera_id', carreraId);
  }

  const { data, error } = await query.limit(8);

  if (error) {
    return [];
  }

  return data || [];
};