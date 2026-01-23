// src/lib/services/professorService.ts
import { createClient } from '@/src/utils/supabase/client'; // Verifica que esta ruta sea la correcta

export const getProfessorProfile = async (id: string) => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profesores')
    .select(`
      *,
      resenas (
        puntuacion_general,
        dificultad,
        apoyo,
        puntualidad,
        comentario,
        es_anonimo,
        created_at
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }
  const totalResenas = data.resenas?.length || 0;
  
  const rating = totalResenas 
    ? (data.resenas.reduce((acc: any, curr: any) => acc + curr.puntuacion_general, 0) / totalResenas).toFixed(1)
    : 0;

  const dificultad = totalResenas
    ? (data.resenas.reduce((acc: any, curr: any) => acc + curr.dificultad, 0) / totalResenas).toFixed(1)
    : 0;

  const recomendacionPct = totalResenas
    ? Math.round((data.resenas.filter((r: any) => r.puntuacion_general >= 4).length / totalResenas) * 100)
    : 0;

  return {
    ...data,
    stats: {
      rating,
      dificultad,
      recomendacionPct,
      totalResenas
    }
  };
};