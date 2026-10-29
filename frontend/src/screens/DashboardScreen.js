import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { supabase } from '../supabase';
import { fetchUserProfile } from '../services/userService';
import { fetchHabits, toggleHabit } from '../services/habitService';

export default function DashboardScreen() {
  const [profile, setProfile] = useState(null);
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    const user = (await supabase.auth.getUser()).data.user;
    if (user) {
      const userProfile = await fetchUserProfile(user.id);
      const userHabits = await fetchHabits(user.id);
      setProfile(userProfile);
      setHabits(userHabits);
    }
  }

  return (
    <ScrollView style={styles.container}>
      {profile && (
        <View style={styles.card}>
          <Text style={styles.title}>Nivel {profile.nivel_actual}</Text>
          <Text style={styles.subtitle}>XP Total: {profile.xp_total} | Racha: {profile.racha_dias} días</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Tus Hábitos Diarios</Text>
      {habits.map((habit) => (
        <TouchableOpacity 
          key={habit.id} 
          style={[styles.habitCard, habit.completado_hoy && styles.completed]}
          onPress={async () => {
            await toggleHabit(habit.id, habit.completado_hoy);
            loadUserData();
          }}
        >
          <Text style={styles.habitText}>{habit.titulo}</Text>
          <Text style={styles.status}>{habit.completado_hoy ? 'Completado' : 'Pendiente'}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  card: { backgroundColor: '#1e1e1e', padding: 20, borderRadius: 12, marginBottom: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#888', fontSize: 14, marginTop: 4 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  habitCard: { backgroundColor: '#1e1e1e', padding: 16, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  completed: { borderColor: '#4ade80', borderWidth: 1 },
  habitText: { color: '#fff', fontSize: 16 },
  status: { color: '#888', fontSize: 12 }
});