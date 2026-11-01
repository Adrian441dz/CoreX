import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../supabase';
import { completeMission } from '../services/missionService';

export default function MissionScreen() {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    loadMissions();
  }, []);

  async function loadMissions() {
    // Solo cargamos el catálogo de misiones. El perfil se consultará al hacer clic.
    const { data, error } = await supabase.from('missions').select('*');
    if (!error) setMissions(data);
  }

  async function handleComplete(mission) {
    // 1. Validar sesión exacta en el momento del clic
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Alert.alert('Error', 'Sesión expirada. Vuelve a iniciar sesión.');

    // 2. Obtener XP actual directamente de la base de datos (evita desincronización de estado)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('xp_total')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return Alert.alert('Error', 'Tu perfil aún no se genera en la base de datos.');
    }

    // 3. Procesar la recompensa
    const updated = await completeMission(user.id, mission.xp_recompensa, profile.xp_total);

    if (updated) {
      Alert.alert('¡Misión Superada!', `Has ganado +${mission.xp_recompensa} XP en la vida real.`);
    } else {
      Alert.alert('Error', 'No se pudo guardar el progreso.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Misiones IRL</Text>
      <Text style={styles.subtitle}>Lleva la teoría a la práctica hoy.</Text>
      
      <FlatList
        data={missions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{item.titulo}</Text>
              <Text style={styles.xp}>+{item.xp_recompensa} XP</Text>
            </View>
            <Text style={styles.description}>{item.descripcion}</Text>
            <TouchableOpacity style={styles.btn} onPress={() => handleComplete(item)}>
              <Text style={styles.btnText}>Marcar como Completada</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  header: { color: '#4ade80', fontSize: 24, fontWeight: '900' },
  subtitle: { color: '#a1a1aa', fontSize: 14, marginBottom: 20 },
  card: { backgroundColor: '#1e1e1e', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#2a2a2a' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  xp: { color: '#fb923c', fontSize: 14, fontWeight: 'bold' },
  description: { color: '#d4d4d8', fontSize: 14, marginBottom: 16, lineHeight: 20 },
  btn: { backgroundColor: '#3b82f6', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});