// src/lib/services/professorService.ts
import { createClient } from '@/src/lib/supabase/client'; // Verifica que esta ruta sea la correcta

export const getProfessorProfile = async (id: string) => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('profesores')
    .select(`
      *,
      resenas (
        id,
        puntuacion_general,
        dificultad,
        apoyo,
        puntualidad,
        comentario,
        tags,
        materia_id,
        materia_nombre,
        votos_utiles,
        semestre,
        modos_evaluacion,
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

// Función para enviar una nueva reseña
interface ReviewData {
  puntuacion_general: number;
  dificultad: number;
  apoyo: number;
  puntualidad: number;
  comentario: string;
  tags: string[];
  materia_id?: string | null;
  materia_nombre?: string | null;
  semestre?: string | null;
  modos_evaluacion?: string[];
}

export const submitReview = async (profesorId: string, reviewData: ReviewData) => {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('resenas')
    .insert({
      profesor_id: profesorId,
      puntuacion_general: reviewData.puntuacion_general,
      dificultad: reviewData.dificultad,
      apoyo: reviewData.apoyo,
      puntualidad: reviewData.puntualidad,
      comentario: reviewData.comentario || null,
      tags: reviewData.tags.length > 0 ? reviewData.tags : null,
      materia_id: reviewData.materia_id || null,
      materia_nombre: reviewData.materia_nombre || null,
      semestre: reviewData.semestre || null,
      modos_evaluacion: reviewData.modos_evaluacion && reviewData.modos_evaluacion.length > 0 ? reviewData.modos_evaluacion : null,
      es_anonimo: true
    });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};

// Función para obtener las materias que imparte un profesor
export const getMateriasByProfesor = async (profesorId: string) => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('vista_buscador')
    .select('materia_id, materia_nombre')
    .eq('profesor_id', profesorId);

  if (error) {
    return [];
  }

  // Eliminar duplicados (un profesor puede aparecer varias veces con la misma materia)
  interface MateriaItem { materia_id: string; materia_nombre: string }
  const materiasUnicas = data?.reduce((acc: MateriaItem[], curr: MateriaItem) => {
    if (!acc.find(m => m.materia_id === curr.materia_id)) {
      acc.push(curr);
    }
    return acc;
  }, []) || [];

  return materiasUnicas;
};

// Función para votar una reseña como útil
export const votarResena = async (resenaId: string) => {
  const supabase = createClient();
  
  // Primero obtenemos el valor actual
  const { data: resena, error: fetchError } = await supabase
    .from('resenas')
    .select('votos_utiles')
    .eq('id', resenaId)
    .single();

  if (fetchError) {
    return { success: false, error: fetchError.message };
  }

  // Incrementamos el contador
  const { error } = await supabase
    .from('resenas')
    .update({ votos_utiles: (resena?.votos_utiles || 0) + 1 })
    .eq('id', resenaId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, newCount: (resena?.votos_utiles || 0) + 1 };
};