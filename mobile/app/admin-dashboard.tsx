import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'reported'>('pending');
  const [pendingAds, setPendingAds] = useState<any[]>([]);
  const [reportedAds, setReportedAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pendingRes, reportedRes] = await Promise.all([
        api.get('/admin/ads/pending'),
        api.get('/admin/reports')
      ]);
      setPendingAds(pendingRes.data);
      setReportedAds(reportedRes.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Veriler yüklenemedi. Admin yetkiniz olduğundan emin olun.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );


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

  const handleDeleteReported = async (listingId: string, reportId: string) => {
    Alert.alert(
      'İlanı Sil',
      'Bu uygunsuz ilanı sistemden kalıcı olarak silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/admin/ads/${listingId}`);
              setReportedAds(reportedAds.filter(r => r._id !== reportId));
              Alert.alert('Başarılı', 'Uygunsuz ilan silindi.');
            } catch (error) {
              console.error(error);
              Alert.alert('Hata', 'İlan silinirken hata oluştu.');
            }
          }
        }
      ]
    );
  };

  const handleSuspendUser = async (userId: string) => {
    Alert.alert(
      'Kullanıcıyı Askıya Al',
      'Bu kullanıcının hesabını askıya almak istediğinize emin misiniz? Kullanıcı bir daha giriş yapamayacak.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Askıya Al',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.put(`/admin/users/${userId}/suspend`);
              Alert.alert('Başarılı', 'Kullanıcı hesabı askıya alındı!');
            } catch (error) {
              console.error(error);
              Alert.alert('Hata', 'Kullanıcı askıya alınırken hata oluştu.');
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

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]} 
          onPress={() => { setActiveTab('pending'); fetchData(); }}
        >
          <Ionicons name="alert-circle-outline" size={18} color={activeTab === 'pending' ? '#1a1a1a' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>Onay Bekleyenler ({pendingAds.length})</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'reported' && styles.activeTab]} 
          onPress={() => { setActiveTab('reported'); fetchData(); }}
        >
          <Ionicons name="flag-outline" size={18} color={activeTab === 'reported' ? '#1a1a1a' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'reported' && styles.activeTabText]}>Şikayet Edilenler ({reportedAds.length})</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#D4AF37" style={{ marginTop: 40 }} />
        ) : activeTab === 'pending' ? (
          pendingAds.length === 0 ? (
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
          )
        ) : (
          reportedAds.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="flag-outline" size={60} color="#cbd5e1" />
              <Text style={styles.emptyText}>Şikayet edilen ilan bulunmuyor.</Text>
            </View>
          ) : (
            reportedAds.map(report => {
              const title = report.listing?.title || 'Silinmiş İlan';
              const price = report.listing?.price ? `${report.listing.price.toLocaleString('tr-TR')} ₺` : '';
              return (
                <View key={report._id} style={styles.card}>
                  <View style={styles.cardInfo}>
                    <View style={styles.reportReasonBadge}>
                      <Text style={styles.reportReasonText}>{report.reason}</Text>
                    </View>
                    <Text style={styles.adTitle}>{title}</Text>
                    <Text style={styles.adUser}>{price}</Text>
                    <Text style={styles.adUser}>Tarih: {new Date(report.createdAt).toLocaleDateString('tr-TR')}</Text>
                  </View>
                  <View style={styles.actionButtons}>
                    {report.listing && (
                      <TouchableOpacity style={[styles.rejectButton, { width: 'auto', paddingHorizontal: 12 }]} onPress={() => handleDeleteReported(report.listing._id, report._id)}>
                        <Ionicons name="trash-outline" size={18} color="#ef4444" />
                        <Text style={[styles.approveText, { color: '#ef4444' }]}>İlanı Sil</Text>
                      </TouchableOpacity>
                    )}
                    {report.reportedBy && (
                      <TouchableOpacity style={[styles.approveButton, { backgroundColor: '#ffedd5', marginLeft: 8 }]} onPress={() => handleSuspendUser(report.reportedBy)}>
                        <Ionicons name="person-remove-outline" size={18} color="#c2410c" />
                        <Text style={[styles.approveText, { color: '#c2410c' }]}>Askıya Al</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )
            })
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: Platform.OS === 'ios' ? 60 : 40, marginBottom: 10 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1a1a1a' },
  
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#D4AF37' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748b', marginLeft: 6 },
  activeTabText: { color: '#1a1a1a', fontWeight: '800' },

  scrollContent: { padding: 20 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  cardInfo: { marginBottom: 12 },
  adTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  adPrice: { fontSize: 16, color: '#D4AF37', fontWeight: '800', marginTop: 4 },
  adUser: { fontSize: 13, color: '#64748b', marginTop: 4 },
  
  reportReasonBadge: { alignSelf: 'flex-start', backgroundColor: '#fee2e2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
  reportReasonText: { color: '#ef4444', fontSize: 12, fontWeight: '800' },

  actionButtons: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 },
  rejectButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  approveButton: { flexDirection: 'row', height: 44, borderRadius: 12, backgroundColor: '#D4AF37', alignItems: 'center', paddingHorizontal: 16 },
  approveText: { color: '#1a1a1a', fontWeight: '800', marginLeft: 6 },
  
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#64748b', fontSize: 16, marginTop: 16 }
});