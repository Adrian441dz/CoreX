import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { supabase } from './supabase';

export default function MisionesIRL({ session }) {
  const [misiones, setMisiones] = useState([]);

  useEffect(() => {
    cargarMisiones();
  }, []);

  async function cargarMisiones() {
    const { data, error } = await supabase
      .from('catalog_items')
      .select('*')
      .eq('type', 'mission');
    
    if (data) setMisiones(data);
  }

  async function completarMision(mision) {
    // 1. Registrar progreso histórico
    const { error: progressError } = await supabase
      .from('user_progress')
      .insert([{ profile_id: session.user.id, item_id: mision.id }]);

    if (progressError) {
      Alert.alert('Error', progressError.message);
      return;
    }

    // 2. Sumar XP de forma segura en el servidor
    await supabase.rpc('sumar_xp', { 
      usuario_id: session.user.id, 
      cantidad_xp: mision.xp_reward 
    });

    Alert.alert('¡Victoria!', `Reto superado. Has ganado ${mision.xp_reward} XP. 🚀`);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={misiones}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.content}</Text>
            <Text style={styles.xp}>⭐ {item.xp_reward} XP</Text>
            <Button title="Completar" onPress={() => completarMision(item)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: { padding: 15, backgroundColor: '#e3f2fd', marginBottom: 10, borderRadius: 8 },
  title: { fontSize: 18, fontWeight: 'bold' },
  description: { marginVertical: 5 },
  xp: { color: '#1565c0', fontWeight: 'bold', marginBottom: 10 }
});