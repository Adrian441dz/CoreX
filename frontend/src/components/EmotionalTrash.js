import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function EmotionalTrash() {
  const [text, setText] = useState('');

  const handlePurge = () => {
    if (!text.trim()) return;

    // Eliminación absoluta de la memoria local
    setText('');
    Alert.alert('Liberado', 'Tus pensamientos han sido disipados del sistema de forma permanente.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Basurero Emocional</Text>
      <Text style={styles.subtitle}>Escribe lo que te agobia. Al aceptar, desaparecerá para siempre.</Text>
      
      <TextInput
        style={styles.input}
        multiline
        placeholder="Escribe aquí sin filtro..."
        placeholderTextColor="#666"
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity style={styles.button} onPress={handlePurge}>
        <Text style={styles.buttonText}>Aceptar y Destruir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#121212', flex: 1, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { color: '#888', fontSize: 14, textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: '#1e1e1e', color: '#fff', padding: 16, borderRadius: 12, height: 150, textAlignVertical: 'top', marginBottom: 20 },
  button: { backgroundColor: '#ef4444', padding: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});