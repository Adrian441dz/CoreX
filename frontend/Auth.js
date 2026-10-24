import React, { useState } from 'react';
import { Alert, View, TextInput, Button, StyleSheet } from 'react-native';
import { supabase } from './supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert('Error', error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Éxito', 'Cuenta creada y sesión iniciada correctamente.');
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        // Limpiamos el espacio invisible directamente al teclear
        onChangeText={(text) => setEmail(text.trim())}
        value={email}
        placeholder="correo@ejemplo.com"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
        placeholder="Contraseña"
        autoCapitalize="none"
      />
      <View style={styles.verticallySpaced}>
        <Button title="Iniciar Sesión" disabled={loading} onPress={signInWithEmail} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Registrarse" disabled={loading} onPress={signUpWithEmail} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  verticallySpaced: { paddingTop: 4, paddingBottom: 4, alignSelf: 'stretch' },
  input: { backgroundColor: '#f0f0f0', padding: 10, marginBottom: 10, borderRadius: 5 },
});