import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    Alert.alert('Giriş', 'Giriş başarılı!');
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.formContainer}>
        <View style={styles.logoContainer}>
          <Ionicons name="bag-handle" size={60} color="#6366f1" />
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

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Giriş Yap</Text>
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
  container: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center' },
  formContainer: { padding: 24, backgroundColor: '#ffffff', margin: 20, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginTop: 16 },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 8, textAlign: 'center' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 16, paddingHorizontal: 16, height: 56, marginBottom: 16 },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#0f172a' },
  loginButton: { backgroundColor: '#6366f1', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  loginButtonText: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#64748b', fontSize: 15 },
  registerText: { color: '#6366f1', fontSize: 15, fontWeight: '700', marginLeft: 8 }
});
