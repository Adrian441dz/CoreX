import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabsLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }} edges={['top']}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { 
            backgroundColor: '#1e1e1e', 
            borderTopColor: '#2a2a2a',
            height: 60,
            paddingBottom: 8,
            paddingTop: 6
          },
          tabBarActiveTintColor: '#4ade80',
          tabBarInactiveTintColor: '#71717a',
        }}
      >
        <Tabs.Screen 
          name="index" 
          options={{ 
            title: 'Inicio', 
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color as string} /> 
          }} 
        />
        <Tabs.Screen 
          name="habits" 
          options={{ 
            title: 'Hábitos', 
            tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color as string} /> 
          }} 
        />
        <Tabs.Screen 
          name="missions" 
          options={{ 
            title: 'Misiones', 
            tabBarIcon: ({ color }) => <Ionicons name="rocket" size={24} color={color as string} /> 
          }} 
        />
        <Tabs.Screen 
          name="lessons" 
          options={{ 
            title: 'Lecciones', 
            tabBarIcon: ({ color }) => <Ionicons name="book" size={24} color={color as string} /> 
          }} 
        />
        <Tabs.Screen 
          name="roleplay" 
          options={{ 
            title: 'Simulador', 
            tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={24} color={color as string} /> 
          }} 
        />
        <Tabs.Screen 
          name="trash" 
          options={{ 
            title: 'Desahogo', 
            tabBarIcon: ({ color }) => <Ionicons name="trash" size={24} color={color as string} /> 
          }} 
        />
      </Tabs>
    </SafeAreaView>
  );
}