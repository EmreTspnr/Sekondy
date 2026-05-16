import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen e-posta ve şifrenizi girin.');
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email: email.trim().toLowerCase(), password });
      await AsyncStorage.setItem('token', res.data.token);
      router.replace('/(tabs)');
    } catch (err) {
      console.error(err);
      Alert.alert('Giriş Başarısız', 'E-posta veya şifre hatalı. Lütfen kontrol edip tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.formContainer}>
        <View style={styles.logoContainer}>
          <Ionicons name="bag-handle" size={60} color="#D4AF37" />
          <Text style={styles.title}>Sekondy'ye Hoşgeldiniz</Text>
          <Text style={styles.subtitle}>Hesabınıza giriş yaparak alışverişe devam edin.</Text>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.icon} />
          <TextInput 
            style={styles.input} placeholder="E-posta Adresiniz" placeholderTextColor="#94a3b8"
            keyboardType="email-address" autoCapitalize="none"
            value={email} onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.icon} />
          <TextInput 
            style={styles.input} placeholder="Şifreniz" placeholderTextColor="#94a3b8"
            secureTextEntry
            value={password} onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={[styles.loginButton, loading && styles.loginButtonDisabled]} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.loginButtonText}>Giriş Yap</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Hesabınız yok mu?</Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.registerText}>Kayıt Ol</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a', justifyContent: 'center' },
  formContainer: { padding: 24, backgroundColor: '#ffffff', margin: 20, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 24, fontWeight: '900', color: '#1a1a1a', marginTop: 16 },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 8, textAlign: 'center' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 16, paddingHorizontal: 16, height: 56, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#0f172a' },
  loginButton: { backgroundColor: '#D4AF37', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  loginButtonDisabled: { opacity: 0.7 },
  loginButtonText: { color: '#1a1a1a', fontSize: 18, fontWeight: '800' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#64748b', fontSize: 15 },
  registerText: { color: '#D4AF37', fontSize: 15, fontWeight: '800', marginLeft: 8 }
});
