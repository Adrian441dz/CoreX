import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Keyboard } from 'react-native';
import { supabase } from './supabase';

export default function BasureroEmocional({ session }) {
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(false);

  async function procesarDesahogo() {
    if (!texto.trim()) return;
    setLoading(true);
    Keyboard.dismiss();

    // 1. Petición a Supabase ÚNICAMENTE para actualizar métricas (XP), sin enviar el string.
    // Nota: Requiere crear un RPC (Remote Procedure Call) en Supabase llamado 'sumar_xp'
    const { error } = await supabase.rpc('sumar_xp', {
      usuario_id: session.user.id,
      cantidad_xp: 15
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      // 2. Destrucción total en memoria volátil
      setTexto('');
      Alert.alert('Liberado', 'Tus pensamientos fueron destruidos. +15 XP ganados. 🌌');
    }
    
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Escribe lo que te frustra hoy. Nadie lo leerá, el sistema lo destruirá..."
        value={texto}
        onChangeText={setTexto}
        textAlignVertical="top"
      />
      <Button 
        title="Destruir y Liberar" 
        color="#d32f2f" 
        onPress={procesarDesahogo} 
        disabled={loading || !texto} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  input: { 
    height: 200, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 15, 
    marginBottom: 20,
    backgroundColor: '#fff'
  },
});