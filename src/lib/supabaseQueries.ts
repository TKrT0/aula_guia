import { createClient } from '@/src/utils/client';

export const buscarProfesoresYMaterias = async (termino: string) => {
  const supabase = createClient();
  
  // Buscamos coincidencias en la tabla de materias o profesores
  // Usamos .ilike para que no importe si es mayúscula o minúscula
  const { data, error } = await supabase
    .from('materias')
    .select(`
      nombre,
      nrc,
      profesores (
        nombre
      )
    `)
    .or(`nombre.ilike.%${termino}%, nrc.ilike.%${termino}%`) // Busca por nombre de materia o NRC
    .limit(5);

  if (error) {
    console.error("Error buscando:", error);
    return [];
  }
  return data;
};