import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const KATEGORILER = [
  { id: '1', isim: 'Elektronik', ikon: 'phone-portrait-outline', renk: '#6366f1' },
  { id: '2', isim: 'Ev & Yasam', ikon: 'home-outline', renk: '#10b981' },
  { id: '3', isim: 'Giyim', ikon: 'shirt-outline', renk: '#f59e0b' },
  { id: '4', isim: 'Arac', ikon: 'car-outline', renk: '#ef4444' },
  { id: '5', isim: 'Kitap', ikon: 'book-outline', renk: '#8b5cf6' },
  { id: '6', isim: 'Spor', ikon: 'football-outline', renk: '#06b6d4' },
];

export default function CategoriesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kategoriler</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {KATEGORILER.map(kategori => (
            <TouchableOpacity key={kategori.id} style={styles.card}>
              <View style={[styles.iconContainer, { backgroundColor: kategori.renk + '20' }]}>
                <Ionicons name={kategori.ikon as any} size={32} color={kategori.renk} />
              </View>
              <Text style={styles.kategoriAdi}>{kategori.isim}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginBottom: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  iconContainer: { width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  kategoriAdi: { fontSize: 15, fontWeight: '600', color: '#0f172a', textAlign: 'center' },
});