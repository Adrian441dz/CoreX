import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { supabase } from '../../supabase'; 

import Auth from '../../Auth'; 
import Dashboard from '../../Dashboard';
import MisionesIRL from '../../MisionesIRL';
import TrackerHabitos from '../../TrackerHabitos';
import BasureroEmocional from '../../BasureroEmocional';

export default function CoreXApp() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1565c0" />
      </View>
    );
  }

  if (!session || !session.user) {
    return <Auth />;
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'Dashboard': return <Dashboard session={session} />;
      case 'Misiones': return <MisionesIRL session={session} />;
      case 'Habitos': return <TrackerHabitos session={session} />;
      case 'Basurero': return <BasureroEmocional session={session} />;
      default: return <Dashboard session={session} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>

      <View style={styles.navBar}>
        {['Dashboard', 'Misiones', 'Habitos', 'Basurero'].map((tabName) => (
          <TouchableOpacity 
            key={tabName} 
            onPress={() => setActiveTab(tabName)} 
            style={styles.navButton}
          >
            <Text style={[styles.navText, activeTab === tabName && styles.navTextActive]}>
              {tabName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1 },
  navBar: { 
    flexDirection: 'row', 
    backgroundColor: '#ffffff', 
    paddingVertical: 15, 
    borderTopWidth: 1, 
    borderColor: '#e0e0e0',
    justifyContent: 'space-around'
  },
  navButton: { alignItems: 'center', paddingHorizontal: 10 },
  navText: { color: '#9e9e9e', fontSize: 12, fontWeight: '600' },
  navTextActive: { color: '#1565c0', fontWeight: 'bold' }
});