import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { supabase } from '../supabase';
import { fetchUserProfile } from '../services/userService';
import { fetchHabits, toggleHabit } from '../services/habitService';
import { completeMission } from '../services/missionService';

export default function DashboardScreen() {
  const [profile, setProfile] = useState(null);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // Estado agregado para el ID

  useEffect(() => {
    let profileChannel;

    async function initData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id); // Guardamos el ID del usuario

      const userProfile = await fetchUserProfile(user.id);
      const userHabits = await fetchHabits(user.id);
      
      setProfile(userProfile);
      setHabits(userHabits);
      setLoading(false);

      profileChannel = supabase
        .channel(`profile-${user.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
          (payload) => setProfile(payload.new)
        )
        .subscribe();
    }

    initData();

    return () => {
      if (profileChannel) supabase.removeChannel(profileChannel);
    };
  }, []);
  useFocusEffect(
    useCallback(() => {
      async function refreshData() {
        if (!userId) return;
        
        const userProfile = await fetchUserProfile(userId);
        const userHabits = await fetchHabits(userId); // <- Agregamos la recarga de hábitos
        
        setProfile(userProfile);
        setHabits(userHabits);
      }
      refreshData();
    }, [userId])
  );

  const handleToggleHabit = async (habit) => {
    if (habit.completado_hoy) {
      return Alert.alert('Completado', 'Ya cumpliste este hábito hoy. Vuelve mañana.');
    }
    const updated = await toggleHabit(
      habit.id, 
      habit.completado_hoy, 
      habit.racha_actual, 
      habit.ultima_fecha_completado
    );
    
    if (updated) {
      setHabits((prev) => prev.map((h) => (h.id === habit.id ? updated : h)));
      
      // La suma de XP se realiza aquí, donde habit y updated existen
      if (!habit.completado_hoy && updated.completado_hoy) {
        await completeMission(userId, 10, profile?.xp_total || 0);
      }
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert('Error', error.message);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#4ade80" />
      </View>
    );
  }

  const xpMeta = (profile?.nivel_actual || 1) * 100;
  const xpActual = profile?.xp_total || 0;
  const progresoPorcentaje = Math.min(100, Math.round((xpActual / xpMeta) * 100));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRowMaster}>
        <Text style={styles.screenTitle}>CoreX</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.headerRow}>
          <Text style={styles.levelBadge}>NIVEL {profile?.nivel_actual || 1}</Text>
          <Text style={styles.streakText}>🔥 {profile?.racha_dias || 0} días</Text>
        </View>

        <Text style={styles.xpText}>{xpActual} / {xpMeta} XP</Text>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${progresoPorcentaje}%` }]} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Hábitos Diarios</Text>
      {habits.length === 0 ? (
        <Text style={styles.emptyText}>No tienes hábitos configurados para hoy.</Text>
      ) : (
        habits.map((habit) => (
          <TouchableOpacity
            key={habit.id}
            style={[
              styles.habitItem, 
              habit.completado_hoy && styles.habitCompleted,
              habit.tipo === 'malo' && !habit.completado_hoy ? { borderColor: '#ef4444' } : {}
            ]}
            onPress={() => handleToggleHabit(habit)}
            activeOpacity={0.8}
          >
            <View style={styles.habitInfo}>
              <Text style={[styles.habitTitle, habit.completado_hoy && styles.textCompleted]}>
                {habit.titulo}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.habitMeta}>🔥 Racha: {habit.racha_actual || 0}</Text>
                <Text style={styles.habitMeta}> • </Text>
                <Text style={styles.habitMeta}>❤️ {habit.vidas_mes} Vidas</Text>
                <Text style={styles.habitMeta}> • </Text>
                <Text style={[styles.habitMeta, { color: habit.tipo === 'bueno' ? '#4ade80' : '#ef4444' }]}>
                  {habit.tipo.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={[styles.statusDot, habit.completado_hoy && styles.statusDotCompleted]} />
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  content: { padding: 16, paddingTop: 40 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  headerRowMaster: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  screenTitle: { color: '#4ade80', fontSize: 28, fontWeight: '900' },
  logoutBtn: { padding: 8, backgroundColor: '#1e1e1e', borderRadius: 8, borderWidth: 1, borderColor: '#ef4444' },
  logoutText: { color: '#ef4444', fontSize: 12, fontWeight: 'bold' },
  statsCard: { backgroundColor: '#1e1e1e', borderRadius: 12, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#2a2a2a' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  levelBadge: { color: '#4ade80', fontSize: 18, fontWeight: 'bold' },
  streakText: { color: '#fb923c', fontSize: 16, fontWeight: '600' },
  xpText: { color: '#a1a1aa', fontSize: 13, marginTop: 12, marginBottom: 6 },
  progressBarTrack: { height: 8, backgroundColor: '#2a2a2a', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#4ade80', borderRadius: 4 },
  sectionTitle: { color: '#f4f4f5', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  emptyText: { color: '#71717a', fontSize: 14, fontStyle: 'italic' },
  habitItem: { backgroundColor: '#1e1e1e', borderRadius: 10, padding: 16, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#2a2a2a' },
  habitCompleted: { borderColor: '#4ade80', backgroundColor: '#14291e' },
  habitInfo: { flex: 1 },
  habitTitle: { color: '#f4f4f5', fontSize: 15, fontWeight: '600' },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  habitMeta: { color: '#71717a', fontSize: 12, marginTop: 4 },
  textCompleted: { textDecorationLine: 'line-through', color: '#86efac' },
  statusDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#71717a' },
  statusDotCompleted: { backgroundColor: '#4ade80', borderColor: '#4ade80' }
});