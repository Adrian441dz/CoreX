import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function LessonCard({ titulo, categoria, contenido, xp, onComplete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => setExpanded(!expanded)} 
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        <Text style={styles.category}>{categoria}</Text>
        <Text style={styles.xp}>+{xp} XP</Text>
      </View>
      <Text style={styles.title}>{titulo}</Text>
      
      {expanded && (
        <View style={styles.body}>
          <Text style={styles.content}>{contenido}</Text>
          <TouchableOpacity style={styles.btn} onPress={onComplete}>
            <Text style={styles.btnText}>Completar Lección</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1e1e1e', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#2a2a2a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  category: { color: '#3b82f6', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  xp: { color: '#4ade80', fontSize: 12, fontWeight: 'bold' },
  title: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  body: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#333', paddingTop: 12 },
  content: { color: '#d4d4d8', fontSize: 14, lineHeight: 20, marginBottom: 14 },
  btn: { backgroundColor: '#4ade80', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#121212', fontWeight: 'bold', fontSize: 13 }
});