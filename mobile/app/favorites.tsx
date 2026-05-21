import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../services/api';

export default function FavoritesScreen() {
  const router = useRouter();
  const [favoriler, setFavoriler] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      setFavoriler(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Favoriler yüklenemedi. Lütfen giriş yaptığınızdan emin olun.');
    } finally {
      setLoading(false);
    }
  };

  const handleKaldir = (id: string, baslik: string) => {
    Alert.alert(
      'Favoriden Kaldır',
      `"${baslik}" ilanını favorilerinizden kaldırmak istiyor musunuz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Kaldır', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await api.delete(`/favorites/${id}`);
              setFavoriler(favoriler.filter(f => f._id !== id && f.listing?._id !== id));
            } catch (error) {
              console.error(error);
              Alert.alert('Hata', 'Favorilerden kaldırılamadı.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorilerim</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#D4AF37" style={{ marginTop: 40 }} />
        ) : favoriler.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={60} color="#cbd5e1" />
            <Text style={styles.emptyText}>Henüz favori ilanınız yok.</Text>
            <TouchableOpacity onPress={() => router.push('/')} style={styles.kesfetButton}>
              <Text style={styles.kesfetText}>İlanları Keşfet</Text>
            </TouchableOpacity>
          </View>
        ) : (
          favoriler.map(favori => {
            const listing = favori.listing || favori; // Fallback in case of different populate structure
            return (
              <TouchableOpacity key={favori._id} style={styles.card} onPress={() => router.push(`/listing/${listing._id}`)}>
                <View style={[styles.kategoriIcon, { backgroundColor: '#fdfbd4' }]}>
                  <Ionicons name="pricetag-outline" size={24} color="#D4AF37" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.baslik} numberOfLines={1}>{listing.title}</Text>
                  <Text style={styles.kategori}>{listing.category}</Text>
                  <Text style={styles.fiyat}>{listing.price?.toLocaleString('tr-TR')} ₺</Text>
                </View>
                <TouchableOpacity
                  style={styles.kaldir}
                  onPress={() => handleKaldir(favori._id, listing.title)}
                >
                  <Ionicons name="heart" size={24} color="#ef4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            )
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: Platform.OS === 'ios' ? 60 : 40, marginBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1a1a1a' },
  scrollContent: { padding: 20 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  kategoriIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  cardContent: { flex: 1 },
  baslik: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 2 },
  kategori: { fontSize: 13, color: '#64748b', marginBottom: 4 },
  fiyat: { fontSize: 15, fontWeight: '800', color: '#D4AF37' },
  kaldir: { padding: 8 },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#94a3b8', fontSize: 16, marginTop: 16, marginBottom: 24 },
  kesfetButton: { backgroundColor: '#1a1a1a', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  kesfetText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
});