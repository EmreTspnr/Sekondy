import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../services/api';

export default function ChatScreen() {
  const { partnerId } = useLocalSearchParams();
  const router = useRouter();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState<string>('Sohbet');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Polling for new messages
    return () => clearInterval(interval);
  }, [partnerId]);

  const fetchData = async () => {
    try {
      // 1. Kendi profilimizi alalım
      const profileRes = await api.get('/profile');
      const myId = profileRes.data._id;
      if (!currentUserId) setCurrentUserId(myId);

      // 2. Tüm mesajları alalım (Backend'de sadece /messages var, mecburen hepsini çekip filtreliyoruz)
      const msgRes = await api.get('/messages');
      const allMsgs = msgRes.data;

      // 3. Sadece bu partnerle olan mesajları filtrele
      const chatMsgs = allMsgs.filter((m: any) => {
        const isPartnerSender = m.sender?._id === partnerId;
        const isPartnerReceiver = m.receiver?._id === partnerId;
        return isPartnerSender || isPartnerReceiver;
      });

      // 4. Partnerin adını bulalım
      if (chatMsgs.length > 0) {
        const firstMsg = chatMsgs[0];
        const partnerObj = firstMsg.sender?._id === partnerId ? firstMsg.sender : firstMsg.receiver;
        if (partnerObj) {
          setPartnerName(`${partnerObj.firstName || ''} ${partnerObj.lastName || ''}`.trim() || 'İsimsiz');
        }
      }

      setMessages(chatMsgs);

      // Okunmamış mesajları okundu işaretle (Hata almamak için try-catch)
      const unreadMsgs = chatMsgs.filter((m: any) => !m.isRead && m.receiver?._id === myId);
      for (const m of unreadMsgs) {
        try {
          await api.put(`/messages/${m._id}/read`);
        } catch(e) {}
      }

    } catch (error) {
      console.error('Mesajlar alınırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    
    // Optimistic UI Update (Anında ekranda göster)
    const tempMsg = {
      _id: Math.random().toString(),
      sender: { _id: currentUserId },
      receiver: { _id: partnerId },
      content: messageText,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    
    setMessages(prev => [...prev, tempMsg]);
    setNewMessage('');

    try {
      await api.post('/messages', {
        receiverId: partnerId,
        content: messageText
      });
      // Arka planda gerçek veriyi çek
      fetchData();
    } catch (error: any) {
      // Hata olursa mesajı sil ve uyarı ver
      setMessages(prev => prev.filter(m => m._id !== tempMsg._id));
      console.error('Mesaj gönderilemedi', error.response?.data || error);
      Alert.alert('Hata', 'Mesaj gönderilemedi: ' + (error.response?.data?.mesaj || error.message));
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.sender?._id === currentUserId;
    const date = new Date(item.createdAt);
    const timeString = `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;

    return (
      <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
        <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
          {item.content}
        </Text>
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, isMe ? styles.myTimeText : styles.theirTimeText]}>{timeString}</Text>
          {isMe && (
            <Ionicons 
              name={item.isRead ? "checkmark-done" : "checkmark"} 
              size={14} 
              color={item.isRead ? "#fff" : "rgba(255,255,255,0.6)"} 
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{partnerName.charAt(0)}</Text>
          </View>
          <Text style={styles.headerTitle}>{partnerName}</Text>
        </View>
        <View style={styles.backButton} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4AF37" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mesaj yazın..."
          placeholderTextColor="#94a3b8"
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]} 
          onPress={handleSend}
          disabled={!newMessage.trim()}
        >
          <Ionicons name="send" size={20} color={newMessage.trim() ? "#fff" : "#94a3b8"} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    paddingBottom: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fdfbd4', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#D4AF37', textTransform: 'uppercase' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  chatList: { padding: 16, paddingBottom: 20 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 12 },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#D4AF37', borderBottomRightRadius: 4 },
  theirMessage: { alignSelf: 'flex-start', backgroundColor: '#ffffff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#e2e8f0' },
  messageText: { fontSize: 15, lineHeight: 22 },
  myMessageText: { color: '#ffffff' },
  theirMessageText: { color: '#334155' },
  timeContainer: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginTop: 4 },
  timeText: { fontSize: 10 },
  myTimeText: { color: 'rgba(255,255,255,0.8)' },
  theirTimeText: { color: '#94a3b8' },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingBottom: Platform.OS === 'ios' ? 30 : 16
  },
  input: { 
    flex: 1, 
    backgroundColor: '#f1f5f9', 
    borderRadius: 20, 
    paddingHorizontal: 16, 
    paddingVertical: 10,
    paddingTop: 12,
    fontSize: 15,
    maxHeight: 100,
    color: '#1a1a1a'
  },
  sendButton: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: '#D4AF37', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginLeft: 12 
  },
  sendButtonDisabled: { backgroundColor: '#e2e8f0' }
});
