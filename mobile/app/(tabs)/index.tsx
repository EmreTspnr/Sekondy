import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, Dimensions, Platform, ActivityIndicator, Modal, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

const { width } = Dimensions.get('window');

const CATEGORIES = ['Tümü', 'Vasıta', 'Emlak', 'Elektronik', 'Moda', 'Ev & Bahçe'];

export default function HomeScreen() {
  const router = useRouter();
  
  const [ads, setAds] = useState<any[]>([]);
  const [category, setCategory] = useState('Tümü');
  const [search, setSearch] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadHistory();
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    const adminStatus = await AsyncStorage.getItem('isAdmin');
    setIsLoggedIn(!!token);
    setIsAdmin(adminStatus === 'true');
  };

  useFocusEffect(
    useCallback(() => {
      checkLoginStatus();
    }, [])
  );

  const loadHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem('searchHistory');
      if (saved) setSearchHistory(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  };

  const saveToHistory = async (term: string) => {
    try {
      const updated = [term, ...searchHistory.filter(h => h !== term)].slice(0, 8);
      setSearchHistory(updated);
      await AsyncStorage.setItem('searchHistory', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const removeFromHistory = async (term: string) => {
    try {
      const updated = searchHistory.filter(h => h !== term);
      setSearchHistory(updated);
      await AsyncStorage.setItem('searchHistory', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAds = useCallback(async () => {
    if (search.trim()) return;
    setLoading(true);
    console.log('[DEBUG] fetchAds başladı');
    try {
      let endpoint = '/ads/showcase';
      if (category !== 'Tümü') {
        endpoint = `/ads/category/${category}`;
      }
      console.log(`[DEBUG] api.get isteği atılıyor: ${endpoint}`);
      const response = await api.get(endpoint);
      console.log('[DEBUG] api.get cevabı geldi!', response.data?.length);
      setAds(response.data.length ? response.data : []);
    } catch (error: any) {
      console.error("[DEBUG] İlanlar gelmedi hatası:", error?.message || error);
      setAds([]);
    } finally {
      console.log('[DEBUG] fetchAds finally bloğu çalıştı, loading false yapılıyor');
      setLoading(false);
      setRefreshing(false);
    }
  }, [category, search]);

  useFocusEffect(
    useCallback(() => {
      fetchAds();
    }, [fetchAds])
  );

  const handleSearch = async (term?: string) => {
    const q = (term || search).trim();
    if (!q) return;
    
    saveToHistory(q);
    setShowHistory(false);
    if (term) setSearch(term);
    
    setLoading(true);
    try {
      const response = await api.get(`/ads/search?q=${encodeURIComponent(q)}`);
      setAds(response.data);
    } catch (error) {
      console.error('Arama hatası:', error);
      setAds([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAds();
  }, [fetchAds]);

  const toggleFavorite = async (adId: string) => {
    try {
      await api.post('/favorites', { listingId: adId });
      Alert.alert('Başarılı', 'Favorilere eklendi!');
    } catch {
      Alert.alert('Hata', 'Giriş yapmanız gerekli veya ilan zaten favorilerinizde!');
    }
  };

  const handleSaveSearch = async () => {
    try {
      await api.post('/saved-searches', {
        keyword: search.trim(),
        category: category !== 'Tümü' ? category : ''
      });
      Alert.alert('Başarılı', 'Arama kriteri kaydedildi! Profil sayfanızdan yönetebilirsiniz.');
    } catch {
      Alert.alert('Hata', 'Arama kaydedilemedi. Giriş yaptığınızdan emin olun.');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('isAdmin');
      setMenuVisible(false);
      setIsLoggedIn(false);
      setIsAdmin(false);
      router.push('/login');
    } catch (e) {
      console.error(e);
    }
  };

  const navigateMenu = (route: string) => {
    setMenuVisible(false);
    if (route === '/') return;
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      
      {/* Top Mini Bar */}
      <View style={styles.topMiniBar}>
        <View style={styles.contactInfo}>
          <Ionicons name="call" size={12} color="#D4AF37" />
          <Text style={styles.topBarText}>+90 555 123 4567</Text>
          <Ionicons name="mail" size={12} color="#D4AF37" style={{ marginLeft: 15 }} />
          <Text style={styles.topBarText}>
            {isLoggedIn ? 'ikinci.el.krallariii@gmail.com' : 'Giriş Yapılmadı'}
          </Text>
        </View>
      </View>

      {/* Main Header */}
      <View style={styles.mainHeader}>
        <Text style={styles.logoText}>SEKONDY</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.newAdBtn} onPress={() => router.push('/add-listing')}>
            <Text style={styles.newAdText}>YENİ İLAN YÜKLE</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.hamburgerBtn}>
            <Ionicons name="menu" size={32} color="#1a1a1a" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Hamburger Menu Modal */}
      <Modal visible={menuVisible} animationType="fade" transparent={true} onRequestClose={() => setMenuVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.logoText}>SEKONDY</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <Ionicons name="close" size={32} color="#1a1a1a" />
              </TouchableOpacity>
            </View>
            <View style={styles.menuItems}>
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateMenu('/')}>
                <Text style={styles.menuText}>VİTRİN</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateMenu('/my-ads')}>
                <Text style={styles.menuText}>İLANLARIM</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateMenu('/favorites')}>
                <Text style={styles.menuText}>FAVORİLER</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateMenu('/messages')}>
                <Text style={styles.menuText}>MESAJLAR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateMenu('/profile')}>
                <Text style={styles.menuText}>PROFİL</Text>
              </TouchableOpacity>
              
              {isAdmin && (
                <TouchableOpacity style={styles.menuItem} onPress={() => navigateMenu('/admin-dashboard')}>
                  <Text style={[styles.menuText, { color: '#D4AF37' }]}>YÖNETİCİ PANELİ</Text>
                </TouchableOpacity>
              )}
              
              {isLoggedIn ? (
                <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0, marginTop: 20 }]} onPress={handleLogout}>
                  <Text style={[styles.menuText, { color: '#ef4444' }]}>ÇIKIŞ YAP</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0, marginTop: 20 }]} onPress={() => navigateMenu('/login')}>
                  <Text style={[styles.menuText, { color: '#10b981' }]}>GİRİŞ YAP</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />}
      >
        
        {/* Banner / Arama */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>
            Aradığın her şey <Text style={styles.goldText}>Sekondy'de.</Text>
          </Text>
          <Text style={styles.bannerSubtitle}>
            İkinci el araba, telefon, bilgisayar ve daha fazlası binlerce ilan arasından seni bekliyor.
          </Text>
          
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrap}>
              <Ionicons name="search" size={20} color="#9ca3af" />
              <TextInput
                style={styles.searchInput}
                placeholder="Ne arıyorsunuz? (Örn: iphone)"
                placeholderTextColor="#9ca3af"
                value={search}
                onChangeText={setSearch}
                onSubmitEditing={() => handleSearch()}
                onFocus={() => { if (searchHistory.length > 0) setShowHistory(true); }}
              />
            </View>
            <TouchableOpacity style={styles.searchBtn} onPress={() => handleSearch()}>
              <Text style={styles.searchBtnText}>Araştır</Text>
            </TouchableOpacity>
          </View>
          
          {/* Arama Geçmişi */}
          {showHistory && searchHistory.length > 0 && (
            <View style={styles.historyDropdown}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>SON ARAMALAR</Text>
                <TouchableOpacity onPress={() => setShowHistory(false)}>
                  <Ionicons name="close" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>
              {searchHistory.map((term, i) => (
                <View key={i} style={styles.historyItem}>
                  <TouchableOpacity style={styles.historyTextWrap} onPress={() => handleSearch(term)}>
                    <Ionicons name="time-outline" size={16} color="#d1d5db" />
                    <Text style={styles.historyText}>{term}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeFromHistory(term)} style={styles.historyRemoveBtn}>
                    <Ionicons name="close-circle" size={16} color="#d1d5db" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Kategoriler */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setCategory(cat)}
              style={[
                styles.categoryPill, 
                category === cat ? styles.categoryPillActive : styles.categoryPillInactive
              ]}
            >
              <Text style={[
                styles.categoryText, 
                category === cat ? styles.categoryTextActive : styles.categoryTextInactive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Başlık ve Filtre */}
        <View style={styles.sectionHeader}>
          <View style={styles.titleWrap}>
            <View style={styles.titleLine} />
            <Text style={styles.sectionTitle}>
              {category === 'Tümü' ? 'Vitrin İlanları' : `${category} İlanları`}
            </Text>
          </View>
          
          {(search.trim() !== '' || category !== 'Tümü') && (
            <View style={{ alignItems: 'flex-end' }}>
              <TouchableOpacity style={styles.saveSearchBtn} onPress={handleSaveSearch}>
                <Ionicons name="bookmark" size={16} color="#D4AF37" />
                <Text style={styles.saveSearchText}>Aramayı Kaydet</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 10, color: '#9ca3af', marginTop: 2, marginRight: 2 }}>
                Yeni ilanlarda bildirim al
              </Text>
            </View>
          )}
        </View>

        {/* İlan Grid */}
        {loading ? (
          <ActivityIndicator size="large" color="#D4AF37" style={{ marginTop: 40 }} />
        ) : ads.length === 0 ? (
          <Text style={styles.emptyText}>İlan bulunamadı.</Text>
        ) : (
          <View style={styles.gridContainer}>
            {ads.map(ad => (
              <TouchableOpacity 
                key={ad._id} 
                style={styles.productCard}
                onPress={() => router.push(`/listing/${ad._id}`)}
                activeOpacity={0.9}
              >
                <View style={styles.imageWrap}>
                  <Image 
                    source={{ uri: ad.photos?.[0] || 'https://via.placeholder.com/400x300?text=Gorsel+Yok' }} 
                    style={styles.productImg} 
                  />
                  <TouchableOpacity 
                    style={styles.heartBtn}
                    onPress={() => toggleFavorite(ad._id)}
                  >
                    <Ionicons name="heart" size={20} color="#6b7280" />
                  </TouchableOpacity>
                  <View style={styles.priceTag}>
                    <Text style={styles.priceText}>{ad.price?.toLocaleString('tr-TR')} ₺</Text>
                  </View>
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

  // Top Bar
  topMiniBar: { backgroundColor: '#1a1a1a', paddingTop: Platform.OS === 'ios' ? 50 : 30, paddingBottom: 8, paddingHorizontal: 20 },
  contactInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  topBarText: { color: '#fff', fontSize: 11, marginLeft: 6, fontWeight: '600' },
  
  // Main Header
  mainHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', zIndex: 50 },
  logoText: { fontSize: 24, fontWeight: '900', color: '#D4AF37', letterSpacing: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  newAdBtn: { backgroundColor: '#1a1a1a', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  newAdText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  hamburgerBtn: { padding: 4 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-start', alignItems: 'flex-end' },
  modalContent: { width: '75%', height: '100%', backgroundColor: '#fff', padding: 24, paddingTop: Platform.OS === 'ios' ? 60 : 40, shadowColor: '#000', shadowOffset: { width: -5, height: 0 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
  menuItems: { gap: 8 },
  menuItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  menuText: { fontSize: 16, fontWeight: '800', color: '#1a1a1a', letterSpacing: 1 },

  // Banner
  banner: { 
    backgroundColor: '#1a1a1a', 
    paddingTop: 30, 
    paddingBottom: 40, 
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
    zIndex: 10
  },
  bannerTitle: { fontSize: 32, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 12 },
  goldText: { color: '#D4AF37' },
  bannerSubtitle: { fontSize: 14, color: '#9ca3af', textAlign: 'center', marginBottom: 24, paddingHorizontal: 10 },
  
  // Search
  searchContainer: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 30, padding: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  searchInputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  searchInput: { flex: 1, height: 40, marginLeft: 8, fontSize: 14, color: '#111827' },
  searchBtn: { backgroundColor: '#D4AF37', borderRadius: 24, paddingVertical: 12, paddingHorizontal: 20, justifyContent: 'center' },
  searchBtnText: { color: '#111827', fontWeight: '800', fontSize: 14 },
  
  // History Dropdown
  historyDropdown: { position: 'absolute', top: '105%', left: 20, right: 20, backgroundColor: '#fff', borderRadius: 16, padding: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10, zIndex: 100 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', marginBottom: 4 },
  historyTitle: { fontSize: 11, fontWeight: '800', color: '#9ca3af' },
  historyItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 8 },
  historyTextWrap: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  historyText: { fontSize: 14, color: '#374151', marginLeft: 10, fontWeight: '500' },
  historyRemoveBtn: { padding: 4 },
  
  // Categories
  categoriesScroll: { paddingHorizontal: 16, marginTop: 24, paddingBottom: 10 },
  categoryPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 30, borderWidth: 2, marginRight: 10 },
  categoryPillActive: { backgroundColor: '#1a1a1a', borderColor: '#1a1a1a' },
  categoryPillInactive: { backgroundColor: '#fff', borderColor: '#e5e7eb' },
  categoryText: { fontSize: 14, fontWeight: '700' },
  categoryTextActive: { color: '#fff' },
  categoryTextInactive: { color: '#374151' },
  
  // Section Header
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 16, marginBottom: 16 },
  titleWrap: { flexDirection: 'row', alignItems: 'center' },
  titleLine: { width: 4, height: 20, backgroundColor: '#D4AF37', borderRadius: 4, marginRight: 10 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  saveSearchBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  saveSearchText: { fontSize: 13, fontWeight: '700', color: '#D4AF37' },
  
  // Grid
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, justifyContent: 'space-between' },
  productCard: { width: (width - 44) / 2, backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  imageWrap: { width: '100%', aspectRatio: 4/3, backgroundColor: '#f3f4f6' },
  productImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  heartBtn: { position: 'absolute', top: 10, right: 10, width: 32, height: 32, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  priceTag: { position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(26,26,26,0.85)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  priceText: { color: '#D4AF37', fontWeight: '800', fontSize: 13 },
  productInfo: { padding: 12 },
  productTitle: { fontSize: 13, fontWeight: '700', color: '#111827', height: 36, lineHeight: 18 },
  productFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  locationText: { fontSize: 11, color: '#6b7280', fontWeight: '600', marginLeft: 4, flex: 1 },
  
  emptyText: { textAlign: 'center', color: '#6b7280', marginTop: 40, fontSize: 14 }
});
