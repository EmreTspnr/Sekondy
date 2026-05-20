import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../../services/api';

const CATEGORIES = ['Vasıta', 'Emlak', 'Elektronik', 'Moda', 'Ev & Bahçe'];

export default function EditListingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (id) fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await api.get(`/listings/${id}`);
      const ad = response.data;
      setTitle(ad.title || '');
      setPrice(ad.price?.toString() || '');
      setCategory(ad.category || '');
      setDescription(ad.description || '');
      setLocation(ad.location || '');
    } catch (error) {
      Alert.alert('Hata', 'İlan bilgileri alınamadı.');
      router.back();
    } finally {
      setFetching(false);
    }
  };

  const handleUpdate = async () => {
    if (!title || !price || !category || !description || !location) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      await api.put(`/listings/${id}`, {
        title,
        price: Number(price),
        category,
        description,
        location,
        listingType: 'For Sale'
      });
      
      Alert.alert('Başarılı', 'İlanınız başarıyla güncellendi!');
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'İlan güncellenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#f8fafc' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>İlanı Düzenle</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {fetching ? (
          <ActivityIndicator size="large" color="#D4AF37" style={{ marginTop: 40 }} />
        ) : (
          <>
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

            <TouchableOpacity style={[styles.publishButton, loading && styles.publishButtonDisabled]} onPress={handleUpdate} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#1a1a1a" />
              ) : (
                <Text style={styles.publishButtonText}>Değişiklikleri Kaydet</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 15, backgroundColor: '#f8fafc' },
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
  
  publishButton: { backgroundColor: '#D4AF37', borderRadius: 16, height: 60, alignItems: 'center', justifyContent: 'center', marginTop: 10, shadowColor: '#D4AF37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  publishButtonDisabled: { opacity: 0.7 },
  publishButtonText: { color: '#1a1a1a', fontSize: 18, fontWeight: '800' }
});
