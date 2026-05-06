import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ORNEK_MESAJLAR = [
  { id: '1', isim: 'Ahmet Yilmaz', mesaj: 'Urun hala satista mi?', tarih: '10:30', okundu: false },
  { id: '2', isim: 'Zeynep Kaya', mesaj: 'Fiyatta indirim olur mu?', tarih: 'Dun', okundu: true },
  { id: '3', isim: 'Mehmet Demir', mesaj: 'Kargo ile gonderiyor musunuz?', tarih: 'Pzt', okundu: true },
];

export default function MessagesScreen() {
  const router = useRouter();
  const [mesajlar, setMesajlar] = useState(ORNEK_MESAJLAR);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mesajlarim</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {mesajlar.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={60} color="#cbd5e1" />
            <Text style={styles.emptyText}>Henuz hic mesajiniz yok.</Text>
          </View>
        ) : (
          mesajlar.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, !item.okundu && styles.cardUnread]}
              onPress={() => setMesajlar(mesajlar.map(m => m.id === item.id ? { ...m, okundu: true } : m))}
            >
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{item.isim[0]}</Text>
              </View>
              <View style={styles.cardContent}>
                <View style={styles.cardTop}>
                  <Text style={[styles.isim, !item.okundu && styles.isimUnread]}>{item.isim}</Text>
                  <Text style={styles.tarih}>{item.tarih}</Text>
                </View>
                <Text style={[styles.mesajOnizleme, !item.okundu && styles.mesajUnread]} numberOfLines={1}>
                  {item.mesaj}
                </Text>
              </View>
              {!item.okundu && <View style={styles.unreadDot} />}
            </TouchableOpacity>
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
  cardUnread: { borderLeftWidth: 3, borderLeftColor: '#6366f1' },
  avatarContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 20, fontWeight: '700', color: '#6366f1' },
  cardContent: { flex: 1 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  isim: { fontSize: 16, fontWeight: '500', color: '#0f172a' },
  isimUnread: { fontWeight: '700' },
  tarih: { fontSize: 12, color: '#94a3b8' },
  mesajOnizleme: { fontSize: 14, color: '#64748b' },
  mesajUnread: { color: '#0f172a', fontWeight: '500' },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#6366f1', marginLeft: 8 },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#94a3b8', fontSize: 16, marginTop: 16 },
});