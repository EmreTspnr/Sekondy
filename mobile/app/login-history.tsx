import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../services/api';

export default function LoginHistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/auth/history');
      setHistory(response.data.loginHistory || []);
    } catch (error) {
      console.error('Giriş geçmişi alınamadı', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR') + ' ' + date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giriş Geçmişi</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#1a1a1a" style={{ marginTop: 40 }} />
        ) : history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="time-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>Henüz giriş kaydı bulunmuyor.</Text>
          </View>
        ) : (
          history.slice(0, 15).map((entry, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.iconWrap}>
                <Ionicons name="desktop-outline" size={24} color="#6b7280" />
              </View>
              <View style={styles.infoWrap}>
                <Text style={styles.deviceText} numberOfLines={1}>{entry.device || 'Bilinmeyen Cihaz'}</Text>
                <Text style={styles.ipText}>{entry.ipAddress || '-'}</Text>
              </View>
              <Text style={styles.dateText}>{formatDate(entry.date)}</Text>
            </View>
          ))
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
  iconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  infoWrap: { flex: 1, marginRight: 12 },
  deviceText: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 4 },
  ipText: { fontSize: 12, color: '#6b7280', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  dateText: { fontSize: 12, color: '#9ca3af', fontWeight: '500' },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#6b7280', fontSize: 14, marginTop: 16 }
});
