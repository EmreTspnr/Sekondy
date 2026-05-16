import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';

const CATEGORIES = ['Vasıta', 'Emlak', 'Elektronik', 'Moda', 'Ev & Bahçe'];

export default function AddListingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.8,
    });

    if (!result.canceled) {
      const selected = result.assets.map(asset => asset.uri);
      setImages([...images, ...selected].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!title || !price || !category || !description || !location) {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Ad
      const adResponse = await api.post('/ads', {
        title,
        price: Number(price),
        category,
        description,
        location,
        listingType: 'For Sale'
      });
      
      const adId = adResponse.data._id;

      // 2. Upload Photos if exist
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((uri, index) => {
          const filename = uri.split('/').pop() || `image${index}.jpg`;
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image`;
          
          formData.append('photos', {
            uri,
            name: filename,
            type
          } as any);
        });

        await api.post(`/ads/${adId}/photos`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      Alert.alert('Başarılı', 'İlanınız yayına alındı! (Şu an onay bekliyor)');
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'İlan yüklenirken bir sorun oluştu. Giriş yaptığınızdan emin olun.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Yeni İlan Ekle</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>İlan Başlığı <Text style={styles.required}>*</Text></Text>
          <View style={styles.inputContainer}>
            <Ionicons name="pricetag-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Örn: Temiz iPhone 14 Pro" placeholderTextColor="#94a3b8" value={title} onChangeText={setTitle} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Fiyat (TL) <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputContainer}>
              <Ionicons name="cash-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="0" keyboardType="numeric" placeholderTextColor="#94a3b8" value={price} onChangeText={setPrice} />
            </View>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Kategori <Text style={styles.required}>*</Text></Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity key={cat} onPress={() => setCategory(cat)} style={[styles.categoryPill, category === cat && styles.categoryPillActive]}>
                <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Konum <Text style={styles.required}>*</Text></Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Örn: Kadıköy, İstanbul" placeholderTextColor="#94a3b8" value={location} onChangeText={setLocation} />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Açıklama <Text style={styles.required}>*</Text></Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <TextInput style={styles.textArea} placeholder="Ürününüzün durumunu detaylıca anlatın..." placeholderTextColor="#94a3b8" multiline numberOfLines={4} value={description} onChangeText={setDescription} />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Fotoğraflar (Maks 5)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            <TouchableOpacity style={styles.imageAddBtn} onPress={pickImage}>
              <Ionicons name="camera" size={32} color="#94a3b8" />
              <Text style={styles.imageAddText}>Ekle</Text>
            </TouchableOpacity>
            {images.map((uri, index) => (
              <View key={index} style={styles.imagePreviewWrap}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(index)}>
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity style={[styles.publishButton, loading && styles.publishButtonDisabled]} onPress={handlePublish} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#1a1a1a" />
          ) : (
            <Text style={styles.publishButtonText}>İlanı Yayınla</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { padding: 20, paddingBottom: 40, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1a1a1a' },
  formGroup: { marginBottom: 20 },
  row: { flexDirection: 'row' },
  label: { fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 8, marginLeft: 4 },
  required: { color: '#ef4444' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16, height: 56 },
  textAreaContainer: { height: 120, alignItems: 'flex-start', paddingVertical: 16 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, height: '100%', fontSize: 16, color: '#0f172a' },
  textArea: { flex: 1, width: '100%', height: '100%', fontSize: 16, color: '#0f172a', textAlignVertical: 'top' },
  
  categoryScroll: { paddingVertical: 4 },
  categoryPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 30, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', marginRight: 10 },
  categoryPillActive: { backgroundColor: '#D4AF37', borderColor: '#D4AF37' },
  categoryText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  categoryTextActive: { color: '#1a1a1a', fontWeight: '800' },
  
  imageScroll: { flexDirection: 'row', marginTop: 8 },
  imageAddBtn: { width: 80, height: 80, borderRadius: 16, backgroundColor: '#f1f5f9', borderStyle: 'dashed', borderWidth: 2, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  imageAddText: { fontSize: 12, fontWeight: '600', color: '#94a3b8', marginTop: 4 },
  imagePreviewWrap: { width: 80, height: 80, borderRadius: 16, marginRight: 12, overflow: 'hidden' },
  imagePreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  removeImageBtn: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },

  publishButton: { backgroundColor: '#D4AF37', borderRadius: 16, height: 60, alignItems: 'center', justifyContent: 'center', marginTop: 10, shadowColor: '#D4AF37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  publishButtonDisabled: { opacity: 0.7 },
  publishButtonText: { color: '#1a1a1a', fontSize: 18, fontWeight: '800' }
});
