import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

// Varsayılan backend adresi (lokal test için emulator ip veya bilgisayar ip'si)
const API_URL = 'http://10.0.2.2:5000/api'; 

export default function AddListingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    location: ''
  });

  const handlePublish = async () => {
    if (!formData.title || !formData.price || !formData.category || !formData.description || !formData.location) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      // Not: Bu aşamada JWT auth gereklidir, test için sahte token veya bypass gerekebilir.
      // RabbitMQ tetikleyicisini çalıştıracak endpoint:
      /* 
      const response = await axios.post(`${API_URL}/ads`, formData, {
        headers: { Authorization: `Bearer BURAYA_TOKEN_GELECEK` }
      });
      */
      
      // Şimdilik sadece UI tasarımı yapıldı ve API isteği simüle ediliyor:
      setTimeout(() => {
        Alert.alert('Başarılı', 'İlanınız başarıyla eklendi ve onaya gönderildi!');
        router.back();
        setLoading(false);
      }, 1500);

    } catch (error) {
      Alert.alert('Hata', 'İlan eklenirken bir sorun oluştu.');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Yeni İlan Ekle</Text>
          <View style={styles.backButton} />
        </View>

        <Text style={styles.subtitle}>İlanınızın detaylarını girerek hemen satışa başlayın.</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>İlan Başlığı</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="pricetag-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Örn: Temiz iPhone 13" 
              placeholderTextColor="#94a3b8"
              value={formData.title}
              onChangeText={(text) => setFormData({...formData, title: text})}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Fiyat (TL)</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="cash-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="0.00" 
              keyboardType="numeric"
              placeholderTextColor="#94a3b8"
              value={formData.price}
              onChangeText={(text) => setFormData({...formData, price: text})}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Kategori</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="grid-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Örn: Elektronik" 
              placeholderTextColor="#94a3b8"
              value={formData.category}
              onChangeText={(text) => setFormData({...formData, category: text})}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Konum</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Örn: Kadıköy, İstanbul" 
              placeholderTextColor="#94a3b8"
              value={formData.location}
              onChangeText={(text) => setFormData({...formData, location: text})}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Açıklama</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <TextInput 
              style={styles.textArea} 
              placeholder="Ürününüzün durumunu, özelliklerini ve diğer detaylarını anlatın..." 
              placeholderTextColor="#94a3b8"
              multiline={true}
              numberOfLines={4}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.publishButton, loading && styles.publishButtonDisabled]} 
          onPress={handlePublish}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.publishButtonText}>Yayınlanıyor...</Text>
          ) : (
            <>
              <Text style={styles.publishButtonText}>İlanı Yayınla</Text>
              <Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" style={{marginLeft: 8}} />
            </>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 30,
    lineHeight: 22,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  textAreaContainer: {
    height: 120,
    alignItems: 'flex-start',
    paddingVertical: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#0f172a',
  },
  textArea: {
    flex: 1,
    width: '100%',
    height: '100%',
    fontSize: 16,
    color: '#0f172a',
    textAlignVertical: 'top',
  },
  publishButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    borderRadius: 16,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  publishButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
  },
  publishButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  }
});
