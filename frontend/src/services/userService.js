import { supabase } from '../supabase'; // Asegúrate de ajustar la ruta de importación

export async function fetchUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('xp_total, nivel_actual, racha_dias')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error al obtener perfil:', error.message);
    return null;
  }

  return data;
}