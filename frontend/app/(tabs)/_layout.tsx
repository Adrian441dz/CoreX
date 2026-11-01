import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#1e1e1e', borderTopColor: '#2a2a2a' },
        tabBarActiveTintColor: '#4ade80',
        tabBarInactiveTintColor: '#71717a',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color as string} /> }} />
      <Tabs.Screen 
  name="habits" 
  options={{ 
    title: 'Habitos', 
    tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color as string} /> 
  }} 
/>
      
      <Tabs.Screen name="missions" options={{ title: 'Misiones', tabBarIcon: ({ color }) => <Ionicons name="rocket" size={24} color={color as string} /> }} />
      <Tabs.Screen name="lessons" options={{ title: 'Lecciones', tabBarIcon: ({ color }) => <Ionicons name="book" size={24} color={color as string} /> }} />
      <Tabs.Screen 
  name="roleplay" 
  options={{ 
    title: 'Simulador', 
    tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={24} color={color as string} /> 
  }} 
/>
      <Tabs.Screen name="trash" options={{ title: 'Desahogo', tabBarIcon: ({ color }) => <Ionicons name="trash" size={24} color={color as string} /> }} />
    </Tabs>
  );
}