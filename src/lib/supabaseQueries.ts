import { createClient } from '@/src/utils/supabase/client';

// Función Principal de Búsqueda (Grid)
export const buscarProfesoresYMaterias = async (termino: string) => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('vista_buscador')
    .select('*')
    .or(`materia_nombre.ilike.%${termino}%,profesor_nombre.ilike.%${termino}%,nrc.ilike.%${termino}%`)
    .limit(20);

  if (error) {
    return [];
  }
  return data;
};

// Función de Sugerencias (SearchBar)
export const obtenerSugerencias = async (termino: string) => {
  // Validación rápida
  if (!termino || termino.length < 2) return [];

  const supabase = createClient();

  const { data, error } = await supabase
    .from('vista_buscador')
    .select('materia_nombre, profesor_nombre, materia_id, profesor_id')
    .or(`materia_nombre.ilike.%${termino}%,profesor_nombre.ilike.%${termino}%`)
    .limit(5);

  if (error) {
    return [];
  }

  return data || [];
};