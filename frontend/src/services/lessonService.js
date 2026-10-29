import { supabase } from '../supabase';

export async function fetchLessons() {
  const { data, error } = await supabase
    .from('lessons')
    .select('id, titulo, contenido, xp_recompensa, categoria');

  if (error) {
    console.error('Error al cargar lecciones:', error.message);
    return [];
  }

  return data;
}