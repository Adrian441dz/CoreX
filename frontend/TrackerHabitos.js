import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { supabase } from './supabase';

export default function TrackerHabitos({ session }) {
  const [habitos, setHabitos] = useState([]);

  useEffect(() => {
    if (session) cargarHabitos();
  }, [session]);

  async function cargarHabitos() {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('profile_id', session.user.id);
    
    if (data) setHabitos(data);
  }

  async function completarHabito(id, rachaActual) {
    const { error } = await supabase
      .from('habits')
      .update({ 
        current_streak: rachaActual + 1, 
        last_completed: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      // Reutilizamos tu RPC seguro para dar 5 XP por hábito
      await supabase.rpc('sumar_xp', { usuario_id: session.user.id, cantidad_xp: 5 });
      cargarHabitos();
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={habitos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.streak}>🔥 Racha: {item.current_streak} días</Text>
            <Button title="Completar Hoy" onPress={() => completarHabito(item.id, item.current_streak)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: { padding: 15, backgroundColor: '#f9f9f9', marginBottom: 10, borderRadius: 8 },
  title: { fontSize: 18, fontWeight: 'bold' },
  streak: { color: '#ff5722', marginVertical: 5 }
});