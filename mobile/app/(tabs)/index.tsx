import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../../services/api';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Elektronik', icon: 'laptop-outline', color: '#3b82f6' },
  { id: '2', name: 'Moda', icon: 'shirt-outline', color: '#ec4899' },
  { id: '3', name: 'Ev & Yaşam', icon: 'home-outline', color: '#f59e0b' },
  { id: '4', name: 'Araç', icon: 'car-sport-outline', color: '#10b981' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchListings = async () => {
    try {
      const response = await api.get('/listings/showcase');
      setListings(response.data);
    } catch (error) {
      console.error('İlanlar çekilirken hata:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchListings();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.brandName}>Sekondy</Text>
            <Text style={styles.tagline}>İkinci El Alışveriş Platformu</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push('/messages')}>
            <Ionicons name="notifications-outline" size={24} color="#ffffff" />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/explore')}>
          <Ionicons name="search" size={20} color="#64748b" />
          <Text style={styles.searchText}>Marka, ürün veya kategori ara...</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
      >
        {/* Categories */}
        <Text style={[styles.sectionTitle, { marginLeft: 20 }]}>Kategoriler</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryItem} onPress={() => router.push(`/categories?id=${cat.id}`)}>
              <View style={[styles.categoryIconWrap, { backgroundColor: cat.color + '15' }]}>
                <Ionicons name={cat.icon as any} size={28} color={cat.color} />
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Listings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Vitrin İlanları</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>İlanlar yükleniyor...</Text>
          </View>
        ) : listings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="bag-remove-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>Henüz vitrin ilanı bulunmuyor.</Text>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {listings.map((item: any) => (
              <TouchableOpacity 
                key={item._id} 
                style={styles.productCard}
                onPress={() => router.push(`/listing/${item._id}`)}
                activeOpacity={0.8}
              >
                <View style={styles.imageContainer}>
                  <Image 
                    source={{ uri: item.photos && item.photos.length > 0 ? item.photos[0] : 'https://via.placeholder.com/300?text=Gorsel+Yok' }} 
                    style={styles.productImage} 
                  />
                  <TouchableOpacity style={styles.favoriteBtn}>
                    <Ionicons name="heart-outline" size={20} color="#64748b" />
                  </TouchableOpacity>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productPrice}>{item.price?.toLocaleString('tr-TR')} ₺</Text>
                  <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
                  <View style={styles.productFooter}>
                    <Ionicons name="location-outline" size={12} color="#94a3b8" />
                    <Text style={styles.productLocation} numberOfLines={1}>{item.location}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  
  // Header
  header: { backgroundColor: '#6366f1', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 44, paddingBottom: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  brandName: { fontSize: 28, fontWeight: '800', color: '#ffffff' },
  tagline: { fontSize: 13, color: '#c7d2fe', marginTop: 2 },
  notificationBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 10, right: 12, width: 10, height: 10, borderRadius: 5, backgroundColor: '#ef4444', borderWidth: 2, borderColor: '#6366f1' },
  
  // Search Bar
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 16, paddingHorizontal: 16, height: 52, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  searchText: { flex: 1, fontSize: 15, color: '#94a3b8', marginLeft: 12 },
  
  // Content
  scrollContent: { paddingBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginTop: 24, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginTop: 24, marginBottom: 16 },
  seeAllText: { fontSize: 14, fontWeight: '600', color: '#6366f1' },
  
  // Categories
  categoriesScroll: { paddingHorizontal: 16, paddingBottom: 8 },
  categoryItem: { alignItems: 'center', marginHorizontal: 6, width: 80 },
  categoryIconWrap: { width: 64, height: 64, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  categoryName: { fontSize: 12, fontWeight: '600', color: '#475569', textAlign: 'center' },
  
  // Grid
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, justifyContent: 'space-between' },
  productCard: { width: (width - 48) / 2, backgroundColor: '#ffffff', borderRadius: 20, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  imageContainer: { width: '100%', height: 160, backgroundColor: '#f1f5f9', position: 'relative' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  favoriteBtn: { position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  productInfo: { padding: 14 },
  productPrice: { fontSize: 17, fontWeight: '800', color: '#6366f1', marginBottom: 6 },
  productTitle: { fontSize: 13, fontWeight: '600', color: '#334155', lineHeight: 18, height: 36 },
  productFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  productLocation: { fontSize: 11, color: '#94a3b8', marginLeft: 4, flex: 1 },
  
  // States
  loadingContainer: { padding: 40, alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#64748b' },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { marginTop: 12, fontSize: 14, color: '#94a3b8', textAlign: 'center' }
});
