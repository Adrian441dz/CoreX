import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'node_modules/react-native'; // Ajustar ruta de importación según estructura

export default function LessonCard({ titulo, categoria, xp, onComplete }) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.category}>{categoria.toUpperCase()}</Text>
        <Text style={styles.title}>{titulo}</Text>
        <Text style={styles.xp}>+{xp} XP</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onComplete}>
        <Text style={styles.buttonText}>Completar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1e1e1e', padding: 16, borderRadius: 12, marginVertical: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  category: { color: '#888', fontSize: 10, fontWeight: 'bold' },
  title: { color: '#fff', fontSize: 16, fontWeight: '600', marginVertical: 4 },
  xp: { color: '#4ade80', fontSize: 12, fontWeight: 'bold' },
  button: { backgroundColor: '#3b82f6', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});