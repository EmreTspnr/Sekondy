import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const [pendingAds, setPendingAds] = useState([
    { id: '1', title: 'iPhone 13 Pro', price: '32.000 TL', user: 'Ahmet Y.' },
    { id: '2', title: 'IKEA Çalışma Masası', price: '850 TL', user: 'Zeynep K.' }
  ]);

  const handleApprove = (id: string, title: string) => {
    // Burada backend RabbitMQ onay servisine istek atılacak
    Alert.alert('Onaylandı', `${title} isimli ilan başarıyla yayına alındı!`);
    setPendingAds(pendingAds.filter(ad => ad.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yönetici Paneli</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Onay Bekleyen İlanlar</Text>

        {pendingAds.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={60} color="#10b981" />
            <Text style={styles.emptyText}>Bekleyen ilan kalmadı, harika iş çıkardın!</Text>
          </View>
        ) : (
          pendingAds.map(ad => (
            <View key={ad.id} style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.adTitle}>{ad.title}</Text>
                <Text style={styles.adPrice}>{ad.price}</Text>
                <Text style={styles.adUser}>Satıcı: {ad.user}</Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.rejectButton}>
                  <Ionicons name="close" size={20} color="#ef4444" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(ad.id, ad.title)}>
                  <Ionicons name="checkmark" size={20} color="#ffffff" />
                  <Text style={styles.approveText}>Onayla</Text>
                </TouchableOpacity>
              </View>
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
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  cardInfo: { marginBottom: 12 },
  adTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  adPrice: { fontSize: 16, color: '#6366f1', fontWeight: '600', marginTop: 4 },
  adUser: { fontSize: 13, color: '#64748b', marginTop: 4 },
  actionButtons: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 },
  rejectButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  approveButton: { flexDirection: 'row', height: 44, borderRadius: 12, backgroundColor: '#10b981', alignItems: 'center', paddingHorizontal: 16 },
  approveText: { color: '#ffffff', fontWeight: '700', marginLeft: 8 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#64748b', fontSize: 16, marginTop: 16 }
});