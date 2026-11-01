import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import { supabase } from '../supabase';
import { completeMission } from '../services/missionService';

export default function TrashScreen() {
  const [pensamientos, setPensamientos] = useState('');

  async function handleDestroy() {
  if (pensamientos.trim() === '') return;

  // Zero Data Retention: Obtenemos usuario, sumamos XP y borramos texto.
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('xp_total').eq('id', user.id).single();
    await completeMission(user.id, 10, profile?.xp_total || 0);
  }

  setPensamientos(''); // Se limpia de RAM al instante
  Keyboard.dismiss();
  Alert.alert('Liberado', 'Pensamientos destruidos permanentemente. +10 XP ganados.');
}
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Basurero Emocional</Text>
      <Text style={styles.subtitle}>Escribe lo que te frustra. Al aceptar, desaparecerá para siempre.</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Hoy me sentí estancado porque..."
        placeholderTextColor="#71717a"
        value={pensamientos}
        onChangeText={setPensamientos}
        multiline
        textAlignVertical="top"
      />

      <TouchableOpacity style={styles.btn} onPress={handleDestroy}>
        <Text style={styles.btnText}>Destruir Pensamientos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  header: { color: '#ef4444', fontSize: 24, fontWeight: '900', marginBottom: 8 },
  subtitle: { color: '#a1a1aa', fontSize: 14, marginBottom: 20 },
  input: { flex: 1, backgroundColor: '#1e1e1e', color: '#fff', borderRadius: 12, padding: 16, fontSize: 16, borderWidth: 1, borderColor: '#2a2a2a', marginBottom: 20 },
  btn: { backgroundColor: '#ef4444', paddingVertical: 16, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});