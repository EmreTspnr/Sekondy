import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const EKIPLER = [
  {
    isim: 'Emre Taspinar',
    rol: 'Takim Lideri & Ilan Yonetimi',
    renk: '#6366f1',
    ikon: 'code-slash-outline',
    ekranlar: [
      { baslik: 'Ilan Ekle', hedef: '/add-listing', ikon: 'add-circle-outline' },
      { baslik: 'Ilan Detay', hedef: '/listing/123', ikon: 'document-text-outline' },
    ],
  },
  {
    isim: 'Furkan Saribas',
    rol: 'Kimlik Dogrulama & Oturum',
    renk: '#10b981',
    ikon: 'shield-checkmark-outline',
    ekranlar: [
      { baslik: 'Giris Yap', hedef: '/login', ikon: 'log-in-outline' },
      { baslik: 'Kayit Ol', hedef: '/register', ikon: 'person-add-outline' },
    ],
  },
  {
    isim: 'Veysel Emir Hartavi',
    rol: 'Yonetici Paneli & Moderasyon',
    renk: '#f59e0b',
    ikon: 'settings-outline',
    ekranlar: [
      { baslik: 'Admin Paneli', hedef: '/admin-dashboard', ikon: 'shield-outline' },
      { baslik: 'Ilan Sikayet', hedef: '/report-ad', ikon: 'flag-outline' },
    ],
  },
  {
    isim: 'Sinan Ece',
    rol: 'Kesif & Arama Sistemi',
    renk: '#06b6d4',
    ikon: 'search-outline',
    ekranlar: [
      { baslik: 'Kategoriler', hedef: '/categories', ikon: 'grid-outline' },
      { baslik: 'Kayitli Aramalar', hedef: '/saved-searches', ikon: 'bookmark-outline' },
    ],
  },
  {
    isim: 'Ramize Elif Ermis',
    rol: 'Mesajlasma & Favoriler',
    renk: '#ec4899',
    ikon: 'heart-outline',
    ekranlar: [
      { baslik: 'Mesajlar', hedef: '/messages', ikon: 'chatbubbles-outline' },
      { baslik: 'Favoriler', hedef: '/favorites', ikon: 'heart-outline' },
    ],
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Sekondy</Text>
            <Text style={styles.headerSubtitle}>Ikinci El Alis-Veris Platformu</Text>
          </View>
          <View style={styles.logoBadge}>
            <Ionicons name="bag-handle" size={28} color="#ffffff" />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Gelistirici</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>10</Text>
            <Text style={styles.statLabel}>Ekran</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>30</Text>
            <Text style={styles.statLabel}>API Endpoint</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Ekip & Moduller</Text>

        {EKIPLER.map((uye, index) => (
          <View key={index} style={styles.card}>
            {/* Uye Baslik */}
            <View style={styles.cardHeader}>
              <View style={[styles.uyeAvatar, { backgroundColor: uye.renk + '20' }]}>  
                <Ionicons name={uye.ikon as any} size={22} color={uye.renk} />
              </View>
              <View style={styles.uyeInfo}>
                <Text style={styles.uyeIsim}>{uye.isim}</Text>
                <Text style={styles.uyeRol}>{uye.rol}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: uye.renk + '20' }]}>
                <Ionicons name="checkmark-circle" size={14} color={uye.renk} />
                <Text style={[styles.badgeText, { color: uye.renk }]}>Tamam</Text>
              </View>
            </View>

            {/* Butonlar */}
            <View style={styles.buttonRow}>
              {uye.ekranlar.map((ekran, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.screenButton, { borderColor: uye.renk + '40' }]}
                  onPress={() => router.push(ekran.hedef as any)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.screenIconWrap, { backgroundColor: uye.renk + '15' }]}>
                    <Ionicons name={ekran.ikon as any} size={20} color={uye.renk} />
                  </View>
                  <Text style={styles.screenText}>{ekran.baslik}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Teknoloji Bandi */}
        <View style={styles.techSection}>
          <Text style={styles.techTitle}>Kullanilan Teknolojiler</Text>
          <View style={styles.techRow}>
            {['Node.js', 'MongoDB', 'Redis', 'RabbitMQ', 'Docker', 'React Native'].map((tech, i) => (
              <View key={i} style={styles.techChip}>
                <Text style={styles.techChipText}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  // Header
  header: { backgroundColor: '#6366f1', paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 60 : 44, paddingBottom: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#ffffff' },
  headerSubtitle: { fontSize: 14, color: '#c7d2fe', marginTop: 4 },
  logoBadge: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },

  // Stats
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 16, alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: '800', color: '#ffffff' },
  statLabel: { fontSize: 12, color: '#c7d2fe', marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' },

  // Content
  scrollContent: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 16, marginTop: 4 },

  // Card
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 18, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  uyeAvatar: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  uyeInfo: { flex: 1 },
  uyeIsim: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  uyeRol: { fontSize: 13, color: '#64748b', marginTop: 2 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '600', marginLeft: 4 },

  // Buttons
  buttonRow: { gap: 8 },
  screenButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, padding: 12 },
  screenIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  screenText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#0f172a' },

  // Tech
  techSection: { marginTop: 8, backgroundColor: '#ffffff', borderRadius: 20, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  techTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  techRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  techChip: { backgroundColor: '#f1f5f9', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  techChipText: { fontSize: 13, fontWeight: '600', color: '#475569' },
});
