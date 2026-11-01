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

export async function toggleHabit(habitId, completadoActual, rachaActual = 0, ultimaFecha = null) {
  const hoy = new Date().toISOString().split('T')[0];
  let nuevaRacha = rachaActual;
  
  if (!completadoActual) {
    // Marcar como completado hoy
    const ayer = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    nuevaRacha = (ultimaFecha === ayer) ? rachaActual + 1 : 1;
  } else {
    // Desmarcar (revertir racha)
    nuevaRacha = Math.max(0, rachaActual - 1);
  }

  const { data, error } = await supabase
    .from('habits')
    .update({ 
      completado_hoy: !completadoActual,
      racha_actual: nuevaRacha,
      ultima_fecha_completado: !completadoActual ? hoy : null
    })
    .eq('id', habitId)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar hábito:', error.message);
    return null;
  }
  return data;
}