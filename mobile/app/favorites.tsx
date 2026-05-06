import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ORNEK_FAVORILER = [
  { id: '1', baslik: 'iPhone 13 Pro 256GB', fiyat: '32.000 TL', kategori: 'Elektronik', renk: '#6366f1' },
  { id: '2', baslik: 'IKEA Calisma Masasi', fiyat: '850 TL', kategori: 'Ev & Yasam', renk: '#10b981' },
  { id: '3', baslik: 'Nike Air Max 270', fiyat: '2.400 TL', kategori: 'Giyim', renk: '#f59e0b' },
];

export default function FavoritesScreen() {
  const router = useRouter();
  const [favoriler, setFavoriler] = useState(ORNEK_FAVORILER);

  const handleKaldir = (id: string, baslik: string) => {
    Alert.alert(
      'Favoriden Kaldir',
      `"${baslik}" ilanini favorilerinizden kaldirmak istiyor musunuz?`,
      [
        { text: 'Iptal', style: 'cancel' },
        { text: 'Kaldir', style: 'destructive', onPress: () => setFavoriler(favoriler.filter(f => f.id !== id)) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorilerim</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {favoriler.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={60} color="#cbd5e1" />
            <Text style={styles.emptyText}>Henuz favori ilaniniz yok.</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.kesfetButton}>
              <Text style={styles.kesfetText}>Ilanlari Kesfet</Text>
            </TouchableOpacity>
          </View>
        ) : (
          favoriler.map(favori => (
            <View key={favori.id} style={styles.card}>
              <View style={[styles.kategoriIcon, { backgroundColor: favori.renk + '20' }]}>
                <Ionicons name="pricetag-outline" size={24} color={favori.renk} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.baslik} numberOfLines={1}>{favori.baslik}</Text>
                <Text style={styles.kategori}>{favori.kategori}</Text>
                <Text style={styles.fiyat}>{favori.fiyat}</Text>
              </View>
              <TouchableOpacity
                style={styles.kaldir}
                onPress={() => handleKaldir(favori.id, favori.baslik)}
              >
                <Ionicons name="heart" size={22} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: Platform.OS === 'ios' ? 60 : 40, marginBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  scrollContent: { padding: 20 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  kategoriIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  cardContent: { flex: 1 },
  baslik: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 2 },
  kategori: { fontSize: 13, color: '#64748b', marginBottom: 4 },
  fiyat: { fontSize: 15, fontWeight: '700', color: '#6366f1' },
  kaldir: { padding: 8 },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#94a3b8', fontSize: 16, marginTop: 16, marginBottom: 24 },
  kesfetButton: { backgroundColor: '#6366f1', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  kesfetText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
});