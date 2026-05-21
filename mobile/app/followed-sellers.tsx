import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../services/api';

export default function FollowedSellersScreen() {
  const router = useRouter();
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const response = await api.get('/follows');
      setSellers(response.data || []);
    } catch (error) {
      console.error('Takip edilenler alınamadı', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchSellers();
  }, []);

  const handleUnfollow = async (sellerId: string) => {
    Alert.alert('Emin misin?', 'Bu satıcıyı takipten çıkmak istediğine emin misin?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Takipten Çık', style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/users/${sellerId}/follow`);
            setSellers(prev => prev.filter(f => f.seller?._id !== sellerId));
          } catch (error) {
            Alert.alert('Hata', 'Takipten çıkılamadı.');
          }
      } }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Takip Edilen Satıcılar</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#1a1a1a" style={{ marginTop: 40 }} />
        ) : sellers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>Henüz takip ettiğiniz bir satıcı yok.</Text>
          </View>
        ) : (
          sellers.map((follow, index) => {
            const seller = follow.seller;
            if (!seller) return null;
            return (
              <View key={index} style={styles.card}>
                <View style={styles.avatarWrap}>
                  <Text style={styles.avatarText}>
                    {seller.firstName?.charAt(0) || 'U'}
                    {seller.lastName?.charAt(0) || ''}
                  </Text>
                </View>
                <View style={styles.infoWrap}>
                  <Text style={styles.nameText} numberOfLines={1}>{seller.firstName} {seller.lastName}</Text>
                  <Text style={styles.emailText}>{seller.email}</Text>
                </View>
                <TouchableOpacity style={styles.unfollowBtn} onPress={() => handleUnfollow(seller._id)}>
                  <Text style={styles.unfollowText}>Takipten Çık</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1a1a1a' },
  content: { padding: 20 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f3f4f6' },
  avatarWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#D4AF37', fontWeight: 'bold', fontSize: 16 },
  infoWrap: { flex: 1, marginRight: 12 },
  nameText: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 4 },
  emailText: { fontSize: 12, color: '#6b7280' },
  unfollowBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#fef2f2', borderRadius: 8 },
  unfollowText: { color: '#ef4444', fontSize: 12, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#6b7280', fontSize: 14, marginTop: 16 }
});
