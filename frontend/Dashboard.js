import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { supabase } from './supabase';

export default function Dashboard({ session }) {
  const [profile, setProfile] = useState({ current_level: 1, total_xp: 0, streak_days: 0 });

  useEffect(() => {
    if (session) fetchProfile();
  }, [session]);

  async function fetchProfile() {
    const { data, error } = await supabase
      .from('profiles')
      .select('current_level, total_xp, streak_days')
      .eq('id', session.user.id)
      .single();
    
    if (data) setProfile(data);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nivel {profile.current_level}</Text>
      <Text style={styles.stats}>XP Total: {profile.total_xp}</Text>
      <Text style={styles.stats}>Racha Activa: 🔥 {profile.streak_days} días</Text>
      
      {/* Barra de progreso visual (placeholder 50%) */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '50%' }]} />
      </View>

      <Button title="Cerrar Sesión" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  stats: { fontSize: 18, marginBottom: 5 },
  progressBar: { width: '80%', height: 20, backgroundColor: '#e0e0e0', borderRadius: 10, marginVertical: 20 },
  progressFill: { height: '100%', backgroundColor: '#4caf50', borderRadius: 10 },
});