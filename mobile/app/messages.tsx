import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../services/api';

export default function MessagesScreen() {
  const router = useRouter();
  const [mesajlar, setMesajlar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages');
      setMesajlar(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Mesajlar yüklenemedi. Lütfen giriş yaptığınızdan emin olun.');
    } finally {
      setLoading(false);
    }
  };

  const handleRead = async (id: string) => {
    // Mark as read locally first for fast UI response
    setMesajlar(mesajlar.map(m => m._id === id ? { ...m, isRead: true } : m));
    try {
      await api.put(`/messages/${id}/read`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/messages/${id}`);
      setMesajlar(mesajlar.filter(m => m._id !== id));
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Mesaj silinemedi.');
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('tr-TR') + ' ' + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mesajlarım</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#D4AF37" style={{ marginTop: 40 }} />
        ) : mesajlar.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={60} color="#cbd5e1" />
            <Text style={styles.emptyText}>Henüz hiç mesajınız yok.</Text>
          </View>
        ) : (
          mesajlar.map(item => {
            const senderName = item.sender?.firstName ? `${item.sender.firstName} ${item.sender.lastName || ''}` : 'Bilinmeyen Kullanıcı';
            return (
              <TouchableOpacity
                key={item._id}
                style={[styles.card, !item.isRead && styles.cardUnread]}
                onPress={() => handleRead(item._id)}
              >
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>{senderName.charAt(0)}</Text>
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.cardTop}>
                    <Text style={[styles.isim, !item.isRead && styles.isimUnread]}>{senderName}</Text>
                    <Text style={styles.tarih}>{formatDate(item.createdAt)}</Text>
                  </View>
                  <Text style={[styles.mesajOnizleme, !item.isRead && styles.mesajUnread]} numberOfLines={1}>
                    {item.content}
                  </Text>
                </View>
                {!item.isRead && <View style={styles.unreadDot} />}
                
                <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteButton}>
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                </TouchableOpacity>
              </TouchableOpacity>
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
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  cardUnread: { borderLeftWidth: 3, borderLeftColor: '#D4AF37' },
  avatarContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fdfbd4', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 20, fontWeight: '800', color: '#D4AF37', textTransform: 'uppercase' },
  cardContent: { flex: 1 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  isim: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  isimUnread: { fontWeight: '800' },
  tarih: { fontSize: 12, color: '#94a3b8' },
  mesajOnizleme: { fontSize: 14, color: '#64748b' },
  mesajUnread: { color: '#1a1a1a', fontWeight: '600' },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#D4AF37', marginLeft: 8 },
  deleteButton: { padding: 8, marginLeft: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#94a3b8', fontSize: 16, marginTop: 16 },
});