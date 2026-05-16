import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../services/api';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const [pendingAds, setPendingAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingAds();
  }, []);

  const fetchPendingAds = async () => {
    try {
      const response = await api.get('/admin/ads/pending');
      setPendingAds(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Bekleyen ilanlar yüklenemedi. Admin yetkiniz olduğundan emin olun.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, title: string) => {
    try {
      await api.put(`/admin/ads/${id}/approve`);
      Alert.alert('Onaylandı', `${title} isimli ilan başarıyla yayına alındı!`);
      setPendingAds(pendingAds.filter(ad => ad._id !== id));
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'İlan onaylanırken bir sorun oluştu.');
    }
  };

  const handleReject = async (id: string, title: string) => {
    Alert.alert(
      'İlanı Reddet',
      `"${title}" isimli ilanı reddedip silmek istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Reddet ve Sil', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await api.delete(`/admin/ads/${id}`);
              setPendingAds(pendingAds.filter(ad => ad._id !== id));
            } catch (error) {
              console.error(error);
              Alert.alert('Hata', 'İlan silinirken bir sorun oluştu.');
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
        <Text style={styles.headerTitle}>Yönetici Paneli</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Onay Bekleyen İlanlar</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#D4AF37" style={{ marginTop: 40 }} />
        ) : pendingAds.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={60} color="#10b981" />
            <Text style={styles.emptyText}>Bekleyen ilan kalmadı, harika iş çıkardın!</Text>
          </View>
        ) : (
          pendingAds.map(ad => {
            const sellerName = ad.owner ? `${ad.owner.firstName} ${ad.owner.lastName}` : 'Bilinmeyen Satıcı';
            return (
              <View key={ad._id} style={styles.card}>
                <View style={styles.cardInfo}>
                  <Text style={styles.adTitle}>{ad.title}</Text>
                  <Text style={styles.adPrice}>{ad.price?.toLocaleString('tr-TR')} ₺</Text>
                  <Text style={styles.adUser}>Satıcı: {sellerName}</Text>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(ad._id, ad.title)}>
                    <Ionicons name="close" size={20} color="#ef4444" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(ad._id, ad.title)}>
                    <Ionicons name="checkmark" size={20} color="#1a1a1a" />
                    <Text style={styles.approveText}>Onayla</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1a1a1a', marginBottom: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  cardInfo: { marginBottom: 12 },
  adTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  adPrice: { fontSize: 16, color: '#D4AF37', fontWeight: '800', marginTop: 4 },
  adUser: { fontSize: 13, color: '#64748b', marginTop: 4 },
  actionButtons: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 },
  rejectButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  approveButton: { flexDirection: 'row', height: 44, borderRadius: 12, backgroundColor: '#D4AF37', alignItems: 'center', paddingHorizontal: 16 },
  approveText: { color: '#1a1a1a', fontWeight: '800', marginLeft: 8 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#64748b', fontSize: 16, marginTop: 16 }
});