import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Dimensions, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../services/api';

const { width } = Dimensions.get('window');

export default function MyAdsScreen() {
  const router = useRouter();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyAds();
  }, []);

  const fetchMyAds = async () => {
    try {
      const response = await api.get('/my-ads');
      setAds(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'İlanlarınız alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('İlanı Sil', 'Bu ilanı silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/listings/${id}`);
            setAds(prevAds => prevAds.filter(ad => ad._id !== id));
            Alert.alert('Başarılı', 'İlan silindi.');
          } catch (e) {
            Alert.alert('Hata', 'İlan silinirken bir hata oluştu.');
          }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>İlanlarım</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#D4AF37" style={{ marginTop: 40 }} />
        ) : ads.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>Henüz hiç ilanınız bulunmuyor.</Text>
            <TouchableOpacity style={styles.newAdBtn} onPress={() => router.push('/add-listing')}>
              <Text style={styles.newAdText}>YENİ İLAN YÜKLE</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {ads.map(ad => (
              <TouchableOpacity key={ad._id} style={styles.productCard} onPress={() => router.push(`/listing/${ad._id}`)}>
                <View style={styles.imageWrap}>
                  <Image source={{ uri: ad.photos?.[0] || 'https://via.placeholder.com/400x300' }} style={styles.productImg} />
                  <View style={styles.priceTag}>
                    <Text style={styles.priceText}>{ad.price?.toLocaleString('tr-TR')} ₺</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.editBtn} 
                    onPress={(e) => {
                      e.stopPropagation();
                      router.push(`/edit-listing/${ad._id}`);
                    }}
                  >
                    <Ionicons name="pencil" size={16} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteBtn} 
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDelete(ad._id);
                    }}
                  >
                    <Ionicons name="trash" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productTitle} numberOfLines={2}>{ad.title}</Text>
                  <View style={styles.productFooter}>
                    <Ionicons name="location-sharp" size={14} color="#9ca3af" />
                    <Text style={styles.locationText} numberOfLines={1}>{ad.location}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1a1a1a' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, paddingTop: 20, justifyContent: 'space-between' },
  productCard: { width: (width - 44) / 2, backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#f3f4f6' },
  imageWrap: { width: '100%', aspectRatio: 4/3, backgroundColor: '#f3f4f6' },
  productImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  priceTag: { position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(26,26,26,0.85)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  priceText: { color: '#D4AF37', fontWeight: '800', fontSize: 13 },
  editBtn: { position: 'absolute', top: 10, right: 48, backgroundColor: 'rgba(26,26,26,0.85)', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  deleteBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(239,68,68,0.85)', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  productInfo: { padding: 12 },
  productTitle: { fontSize: 13, fontWeight: '700', color: '#111827', height: 36 },
  productFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  locationText: { fontSize: 11, color: '#6b7280', marginLeft: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyText: { color: '#6b7280', fontSize: 14, textAlign: 'center', marginTop: 16, marginBottom: 24 },
  newAdBtn: { backgroundColor: '#1a1a1a', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  newAdText: { color: '#fff', fontSize: 13, fontWeight: '800' }
});
