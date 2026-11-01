import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { supabase } from '../supabase';

export default function HabitConfigScreen() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [type, setType] = useState('bueno');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);
    
    const { data } = await supabase.from('habits').select('*').eq('user_id', user.id);
    if (data) setHabits(data);
  }

  async function handleAdd() {
    if (!newHabit.trim()) return;
    
    const { error } = await supabase.from('habits').insert([
      { user_id: userId, titulo: newHabit, tipo: type, vidas_mes: 3 }
    ]);
    
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setNewHabit('');
      loadData();
    }
  }

  async function handleDelete(id) {
    await supabase.from('habits').delete().eq('id', id);
    loadData();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tus Hábitos</Text>
      
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Ej: Beber agua / Fumar"
          placeholderTextColor="#71717a"
          value={newHabit}
          onChangeText={setNewHabit}
        />
        <View style={styles.typeToggle}>
          <TouchableOpacity 
            style={[styles.btnType, type === 'bueno' && styles.btnBueno]} 
            onPress={() => setType('bueno')}
          >
            <Text style={styles.btnText}>Adquirir</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.btnType, type === 'malo' && styles.btnMalo]} 
            onPress={() => setType('malo')}
          >
            <Text style={styles.btnText}>Erradicar</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.btnAdd} onPress={handleAdd}>
          <Text style={styles.btnText}>Crear Hábito</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.habitRow}>
            <View>
              <Text style={styles.habitTitle}>{item.titulo}</Text>
              <Text style={item.tipo === 'bueno' ? styles.tagBueno : styles.tagMalo}>
                {item.tipo.toUpperCase()} • {item.vidas_mes} Vidas
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  header: { color: '#4ade80', fontSize: 24, fontWeight: '900', marginBottom: 20 },
  inputArea: { marginBottom: 20, backgroundColor: '#1e1e1e', padding: 16, borderRadius: 12 },
  input: { backgroundColor: '#2a2a2a', color: '#fff', borderRadius: 8, padding: 12, marginBottom: 12 },
  typeToggle: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  btnType: { flex: 1, padding: 10, alignItems: 'center', backgroundColor: '#2a2a2a', borderRadius: 8, marginHorizontal: 4 },
  btnBueno: { backgroundColor: '#166534' },
  btnMalo: { backgroundColor: '#991b1b' },
  btnAdd: { backgroundColor: '#3b82f6', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  habitRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e1e1e', padding: 16, borderRadius: 8, marginBottom: 10 },
  habitTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  tagBueno: { color: '#4ade80', fontSize: 12, marginTop: 4 },
  tagMalo: { color: '#f87171', fontSize: 12, marginTop: 4 },
  deleteText: { color: '#ef4444', fontSize: 18, fontWeight: 'bold', padding: 10 }
});