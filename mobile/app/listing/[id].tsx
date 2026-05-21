import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Platform,
  Dimensions,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const { width } = Dimensions.get('window'); 

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchFavoriteStatus = async () => {
        try {
          // Check if token exists before trying to fetch favorites
          const AsyncStorage = require('@react-native-async-storage/async-storage').default;
          const token = await AsyncStorage.getItem('token');
          if (!token) return;

          const response = await api.get('/favorites');
          const isFav = response.data.some((f: any) => f.listing && f.listing._id === id);
          setIsFavorite(isFav);
        } catch (error: any) {
          if (error.response?.status !== 403) {
            console.error("Favori durumu getirilemedi:", error);
          }
        }
      };
      
      const fetchListingDetail = async () => {
        try {
          const response = await api.get(`/ads/${id}`);
          setListing(response.data);
        } catch (error: any) {
          if (error.response?.status === 404) {
             Alert.alert('Hata', 'İlan bulunamadı veya yayından kaldırılmış olabilir.');
             router.back();
          } else {
             console.error("İlan getirilirken hata:", error);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchListingDetail();
      fetchFavoriteStatus();
    }, [id])
  );

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        setIsFavorite(false);
        await api.delete(`/favorites/listing/${id}`);
        Alert.alert('Başarılı', 'İlan favorilerinizden çıkarıldı!');
      } else {
        setIsFavorite(true);
        await api.post('/favorites', { listingId: listing._id });
        Alert.alert('Başarılı', 'İlan favorilerinize eklendi!');
      }
    } catch (error) {
      // Geri al
      setIsFavorite(!isFavorite);
      Alert.alert('Hata', 'İşlem sırasında bir hata oluştu veya giriş yapmadınız.');
    }
  };

  const handleSendMessage = () => {
    const sellerId = listing.owner?._id || listing.seller?._id;
    if (!sellerId) {
      Alert.alert('Hata', 'Satıcı bilgisi bulunamadı.');
      return;
    }
    // Yeni chat ekranına yönlendir
    router.push(`/chat/${sellerId}`);
  };

  const handleFollow = async () => {
    try {
      const sellerId = listing.owner?._id || listing.seller?._id;
      if (!sellerId) return Alert.alert('Hata', 'Satıcı bilgisi bulunamadı.');
      await api.post(`/users/${sellerId}/follow`);
      Alert.alert('Başarılı', 'Satıcıyı takip etmeye başladınız!');
    } catch (error) {
      Alert.alert('Bilgi', 'Zaten takip ediyorsunuz veya giriş yapmanız gerekli.');
    }
  };

  const handleReport = () => {
    if (!listing) return;
    router.push({ pathname: '/report-ad', params: { id: listing._id } });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text style={styles.loadingText}>İlan detayları yükleniyor...</Text>
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text style={styles.loadingText}>İlan bulunamadı!</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* Resim Alanı */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: listing.photos && listing.photos.length > 0 ? listing.photos[0] : 'https://via.placeholder.com/600x400' }} 
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.floatingBackButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.floatingFavButton} onPress={handleFavorite}>
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "#ef4444" : "#1e293b"} />
          </TouchableOpacity>
        </View>

        {/* Detaylar */}
        <View style={styles.detailsContainer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{listing.price?.toLocaleString('tr-TR')} TL</Text>
            {listing.condition && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{listing.condition}</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.title}>{listing.title}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="location" size={18} color="#64748b" />
            <Text style={styles.infoText}>{listing.location || 'Konum Belirtilmemiş'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="grid" size={18} color="#64748b" />
            <Text style={styles.infoText}>{listing.category || 'Kategori Yok'}</Text>
          </View>

          <View style={styles.divider} />

          {/* İlan Özellikleri (Attributes) */}
          {listing.attributes && Object.keys(listing.attributes).length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Özellikler</Text>
              <View style={styles.attributesGrid}>
                {Object.entries(listing.attributes).map(([key, val]) => (
                  <View key={key} style={styles.attributeItem}>
                    <Text style={styles.attributeKey}>{key}</Text>
                    <Text style={styles.attributeValue} numberOfLines={1}>{String(val)}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.divider} />
            </View>
          )}

          <Text style={styles.sectionTitle}>İlan Açıklaması</Text>
          <Text style={styles.description}>{listing.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Satıcı Bilgileri</Text>
          <View style={styles.sellerCard}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerAvatarText}>
                {(listing.owner?.firstName?.[0] || 'S')}{(listing.owner?.lastName?.[0] || '')}
              </Text>
            </View>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>
                {listing.owner?.firstName} {listing.owner?.lastName}
              </Text>
              <Text style={styles.sellerStatus}>{listing.owner?.phone || 'Gizli Numara'}</Text>
            </View>
            <TouchableOpacity style={styles.messageButton} onPress={handleSendMessage}>
              <Ionicons name="chatbubbles" size={20} color="#D4AF37" />
            </TouchableOpacity>
          </View>

          {/* Satıcıyı Takip Et */}
          <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
            <Ionicons name="person-add-outline" size={18} color="#D4AF37" />
            <Text style={styles.followButtonText}>Satıcıyı Takip Et</Text>
          </TouchableOpacity>

          {/* Şikayet Et */}
          <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
            <Ionicons name="flag-outline" size={16} color="#94a3b8" />
            <Text style={styles.reportButtonText}>İlanı Şikayet Et</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#64748b', fontWeight: '500' },
  imageContainer: { width: width, height: width * 0.85, position: 'relative' },
  image: { width: '100%', height: '100%' },
  floatingBackButton: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 30, left: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.9)', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  floatingFavButton: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 30, right: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.9)', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  detailsContainer: { padding: 24, backgroundColor: '#ffffff', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, paddingBottom: 120 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  price: { fontSize: 28, fontWeight: '900', color: '#D4AF37' },
  badge: { backgroundColor: '#fdfbd4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeText: { color: '#D4AF37', fontWeight: '800', fontSize: 12 },
  title: { fontSize: 22, fontWeight: '800', color: '#1a1a1a', marginBottom: 16, lineHeight: 30 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  infoText: { marginLeft: 8, fontSize: 15, color: '#64748b', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1a1a1a', marginBottom: 16 },
  
  attributesGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 },
  attributeItem: { width: '50%', paddingHorizontal: 8, marginBottom: 16 },
  attributeKey: { fontSize: 13, color: '#94a3b8', fontWeight: '600', marginBottom: 4 },
  attributeValue: { fontSize: 15, color: '#1a1a1a', fontWeight: '700' },

  description: { fontSize: 15, color: '#475569', lineHeight: 24 },
  
  sellerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9' },
  sellerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#fdfbd4', alignItems: 'center', justifyContent: 'center' },
  sellerAvatarText: { fontSize: 18, fontWeight: '800', color: '#D4AF37' },
  sellerInfo: { flex: 1, marginLeft: 16 },
  sellerName: { fontSize: 16, fontWeight: '800', color: '#1a1a1a' },
  sellerStatus: { fontSize: 13, color: '#64748b', fontWeight: '500', marginTop: 2 },
  messageButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  
  followButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, marginTop: 16, borderRadius: 12, borderWidth: 2, borderColor: '#D4AF37' },
  followButtonText: { color: '#D4AF37', fontWeight: '800', fontSize: 15, marginLeft: 8 },

  reportButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, paddingVertical: 8 },
  reportButtonText: { color: '#94a3b8', fontWeight: '600', fontSize: 14, marginLeft: 6 },
  
  backButton: { marginTop: 20, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#e2e8f0', borderRadius: 8 },
  backButtonText: { fontWeight: '600', color: '#475569' }
});
