import { supabase } from '../supabase';

export async function completeMission(userId, xpReward, currentXp, currentLevel) {
  const newXp = currentXp + xpReward;
  // Cada nivel requiere 100 XP base multiplicada por el nivel actual
  const xpNeededForNextLevel = currentLevel * 100; 
  
  let newLevel = currentLevel;
  let finalXp = newXp;

  if (newXp >= xpNeededForNextLevel) {
    newLevel += 1;
    finalXp = newXp - xpNeededForNextLevel; // Sobrante para el siguiente nivel
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ xp_total: finalXp, nivel_actual: newLevel })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar XP:', error.message);
    return null;
  }

  return data;
}