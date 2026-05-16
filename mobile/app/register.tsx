import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../services/api';

export default function RegisterScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !phone || !email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları eksiksiz doldurun.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        firstName,
        lastName,
        email: email.trim().toLowerCase(),
        password,
        phone
      });
      Alert.alert('Başarılı', 'Kayıt işlemi tamamlandı! Şimdi giriş yapabilirsiniz.');
      router.replace('/login');
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>

        <Text style={styles.title}>Aramıza Katılın</Text>
        <Text style={styles.subtitle}>İkinci el dünyasına adım atmak için hemen hesabınızı oluşturun.</Text>

        <View style={styles.inputGroup}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Ionicons name="person-outline" size={20} color="#94a3b8" style={styles.icon} />
            <TextInput 
              style={styles.input} placeholder="Adınız" placeholderTextColor="#94a3b8" 
              value={firstName} onChangeText={setFirstName}
            />
          </View>
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Ionicons name="person-outline" size={20} color="#94a3b8" style={styles.icon} />
            <TextInput 
              style={styles.input} placeholder="Soyadınız" placeholderTextColor="#94a3b8" 
              value={lastName} onChangeText={setLastName}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#94a3b8" style={styles.icon} />
          <TextInput 
            style={styles.input} placeholder="Telefon Numaranız" keyboardType="phone-pad" placeholderTextColor="#94a3b8" 
            value={phone} onChangeText={setPhone}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.icon} />
          <TextInput 
            style={styles.input} placeholder="E-posta Adresiniz" keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#94a3b8" 
            value={email} onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.icon} />
          <TextInput 
            style={styles.input} placeholder="Şifreniz" secureTextEntry placeholderTextColor="#94a3b8" 
            value={password} onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={[styles.registerButton, loading && styles.disabledButton]} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#1a1a1a" />
          ) : (
            <Text style={styles.registerButtonText}>Hesap Oluştur</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { padding: 24, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '900', color: '#1a1a1a', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#64748b', marginBottom: 32, lineHeight: 22 },
  inputGroup: { flexDirection: 'row', justifyContent: 'space-between' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16, height: 56, marginBottom: 16 },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#0f172a' },
  registerButton: { backgroundColor: '#D4AF37', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  disabledButton: { opacity: 0.7 },
  registerButtonText: { color: '#1a1a1a', fontSize: 18, fontWeight: '800' }
});
