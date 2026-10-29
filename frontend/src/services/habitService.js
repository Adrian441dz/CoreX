import { supabase } from '../supabase';

export async function fetchHabits(userId) {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error al obtener hábitos:', error.message);
    return [];
  }
  return data;
}

export async function toggleHabit(habitId, completadoActual) {
  const { data, error } = await supabase
    .from('habits')
    .update({ completado_hoy: !completadoActual })
    .eq('id', habitId)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar hábito:', error.message);
    return null;
  }
  return data;
}