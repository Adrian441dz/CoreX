import { supabase } from '../supabase'; // Asegúrate de ajustar la ruta de importación

export async function fetchUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error al obtener perfil:', error.message);
    return null;
  }

  if (!data) {
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({ id: userId, xp_total: 0, nivel_actual: 1, racha_dias: 0 })
      .select()
      .maybeSingle();

    if (insertError) {
      console.error('Error al crear perfil inicial:', insertError.message);
      return null;
    }

    return newProfile;
  }

  return data;
}