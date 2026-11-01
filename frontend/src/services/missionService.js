import { supabase } from '../supabase';

export async function fetchMissions(userLevel = 1) {
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .lte('nivel_requerido', userLevel);

  if (error) {
    console.error('Error al cargar misiones:', error.message);
    return [];
  }
  return data;
}

export async function completeMission(userId, xpReward, currentXp) {
  // Validación estricta para evitar el error de sintaxis UUID "undefined"
  if (!userId) {
    console.error('Error: userId no proporcionado a completeMission');
    return null;
  }

  const newXp = (currentXp || 0) + xpReward;

  const { data, error } = await supabase
    .from('profiles')
    .update({ xp_total: newXp })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar perfil:', error.message);
    return null;
  }
  return data;
}