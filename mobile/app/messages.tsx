import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../services/api';

export default function MessagesScreen() {
  const router = useRouter();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserAndMessages();
  }, []);

  const fetchUserAndMessages = async () => {
    try {
      const response = await api.get('/profile');
      setCurrentUserId(response.data._id);
      
      const msgResponse = await api.get('/messages');
      const allMessages = msgResponse.data;
      
      // Mesajları kişilere göre grupla
      const chatMap = new Map<string, { partner: any, messages: any[], unreadCount: number }>();
      
      allMessages.forEach((msg: any) => {
        let partner = null;
        if (msg.sender?._id === response.data._id) {
          partner = msg.receiver;
        } else {
          partner = msg.sender;
        }
        
        if (partner && partner._id) {
          if (!chatMap.has(partner._id)) {
            chatMap.set(partner._id, { partner, messages: [], unreadCount: 0 });
          }
          const chat = chatMap.get(partner._id)!;
          chat.messages.push(msg);
          
          if (!msg.isRead && msg.receiver?._id === response.data._id) {
            chat.unreadCount += 1;
          }
        }
      });
      
      const chatList = Array.from(chatMap.values()).sort((a, b) => {
        const lastA = a.messages[a.messages.length - 1];
        const lastB = b.messages[b.messages.length - 1];
        return new Date(lastB?.createdAt || 0).getTime() - new Date(lastA?.createdAt || 0).getTime();
      });
      
      setChats(chatList);
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Mesajlar yüklenemedi. Lütfen giriş yaptığınızdan emin olun.');
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = (partnerId: string) => {
    router.push(`/chat/${partnerId}`);
  };

  const handleDelete = async (partnerId: string) => {
    Alert.alert(
      'Sohbeti Sil',
      'Bu sohbeti silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sil', style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/messages/partner/${partnerId}`);
            setChats(chats.filter(c => c.partner._id !== partnerId));
          } catch (error) {
            Alert.alert('Hata', 'Sohbet silinemedi.');
          }
        }}
      ]
    );
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
        ) : chats.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={60} color="#cbd5e1" />
            <Text style={styles.emptyText}>Henüz hiç mesajınız yok.</Text>
          </View>
        ) : (
          chats.map(chat => {
            const partnerName = chat.partner?.firstName ? `${chat.partner.firstName} ${chat.partner.lastName || ''}` : 'Bilinmeyen Kullanıcı';
            const lastMsg = chat.messages[chat.messages.length - 1];
            
            return (
              <TouchableOpacity
                key={chat.partner._id}
                style={[styles.card, chat.unreadCount > 0 && styles.cardUnread]}
                onPress={() => handleChatSelect(chat.partner._id)}
              >
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>{partnerName.charAt(0)}</Text>
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.cardTop}>
                    <Text style={[styles.isim, chat.unreadCount > 0 && styles.isimUnread]}>{partnerName}</Text>
                    <Text style={styles.tarih}>{formatDate(lastMsg.createdAt)}</Text>
                  </View>
                  <Text style={[styles.mesajOnizleme, chat.unreadCount > 0 && styles.mesajUnread]} numberOfLines={1}>
                    {lastMsg.sender?._id === currentUserId ? 'Siz: ' : ''}{lastMsg.content}
                  </Text>
                </View>
                {chat.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{chat.unreadCount}</Text>
                  </View>
                )}
                
                <TouchableOpacity onPress={() => handleDelete(chat.partner._id)} style={styles.deleteButton}>
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
  unreadBadge: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#D4AF37', alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  unreadBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  deleteButton: { padding: 8, marginLeft: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#94a3b8', fontSize: 16, marginTop: 16 },
});