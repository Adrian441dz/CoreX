import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../supabase';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert('Error al iniciar sesión', error.message);
    setLoading(false);
  }

  async function handleRegister() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert('Error de registro', error.message);
    else Alert.alert('Registro exitoso', 'Revisa tu correo para verificar tu cuenta (si está habilitado), o inicia sesión directamente.');
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CoreX</Text>
      <Text style={styles.subtitle}>Sube de nivel en la vida real</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#71717a"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#71717a"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#4ade80" style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
            <Text style={styles.primaryBtnText}>Iniciar Sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={handleRegister}>
            <Text style={styles.secondaryBtnText}>Crear Cuenta</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', padding: 24 },
  title: { color: '#4ade80', fontSize: 42, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
  subtitle: { color: '#a1a1aa', fontSize: 16, textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#1e1e1e', color: '#fff', borderRadius: 10, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2a2a2a' },
  buttonContainer: { marginTop: 10 },
  primaryBtn: { backgroundColor: '#4ade80', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
  primaryBtnText: { color: '#121212', fontSize: 16, fontWeight: 'bold' },
  secondaryBtn: { backgroundColor: 'transparent', padding: 16, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#4ade80' },
  secondaryBtnText: { color: '#4ade80', fontSize: 16, fontWeight: 'bold' }
});