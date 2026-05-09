import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Profil yüklenemedi', error);
      Alert.alert('Hata', 'Profil bilgileri yüklenemedi. Lütfen giriş yaptığınızdan emin olun.');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      router.push('/login');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        {profile ? (
          <View style={styles.profileCard}>
            <View style={styles.avatarWrap}>
              <Ionicons name="person" size={40} color="#9ca3af" />
            </View>
            <Text style={styles.nameText}>{profile.name}</Text>
            <Text style={styles.emailText}>{profile.email}</Text>
          </View>
        ) : (
          <View style={[styles.profileCard, { alignItems: 'center' }]}>
            <Text style={styles.nameText}>Yükleniyor...</Text>
          </View>
        )}

        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/my-ads')}>
            <Ionicons name="list" size={20} color="#1a1a1a" />
            <Text style={styles.menuText}>İlanlarım</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/favorites')}>
            <Ionicons name="heart" size={20} color="#1a1a1a" />
            <Text style={styles.menuText}>Favorilerim</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/saved-searches')}>
            <Ionicons name="bookmark" size={20} color="#1a1a1a" />
            <Text style={styles.menuText}>Kayıtlı Aramalar</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>ÇIKIŞ YAP</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1a1a1a' },
  
  profileCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#f3f4f6' },
  avatarWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  nameText: { fontSize: 20, fontWeight: '800', color: '#1a1a1a', marginBottom: 4 },
  emailText: { fontSize: 14, color: '#6b7280' },
  
  menuGroup: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 24 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  menuText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#374151', marginLeft: 12 },
  
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fee2e2', borderRadius: 12, padding: 16 },
  logoutText: { color: '#ef4444', fontSize: 14, fontWeight: '800', marginLeft: 8, letterSpacing: 1 }
});
