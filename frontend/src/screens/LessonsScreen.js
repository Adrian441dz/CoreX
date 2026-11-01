import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { supabase } from '../supabase';
import LessonCard from '../components/LessonCard';
import { fetchLessons } from '../services/lessonService';
import { fetchUserProfile } from '../services/userService';
import { completeMission } from '../services/missionService';

export default function LessonsScreen() {
  const [lessons, setLessons] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const userProfile = await fetchUserProfile(user.id);
      setProfile(userProfile);
    }
    // Cargamos las lecciones incluso si probamos sin sesión activa aún
    const data = await fetchLessons();
    setLessons(data);
  }

  async function handleComplete(lesson) {
    if (!profile) {
      Alert.alert('Modo Demo', `Lección leída (+${lesson.xp_recompensa} XP). Inicia sesión para guardar tu progreso.`);
      return;
    }

    const updated = await completeMission(
      profile.id, 
      lesson.xp_recompensa, 
      profile.xp_total, 
      profile.nivel_actual
    );

    if (updated) {
      Alert.alert('¡Lección Completada!', `Has ganado +${lesson.xp_recompensa} XP.`);
      loadData();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Microlecciones</Text>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LessonCard 
            titulo={item.titulo} 
            categoria={item.categoria} 
            contenido={item.contenido} 
            xp={item.xp_recompensa} 
            onComplete={() => handleComplete(item)} 
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  header: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 16 }
});