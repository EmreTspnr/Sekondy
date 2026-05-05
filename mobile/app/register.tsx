import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
    const router = useRouter();

    const handleRegister = () => {
        // API entegrasyonu buraya gelecek
        Alert.alert('Başarılı', 'Kayıt işlemi tamamlandı!');
        router.replace('/login');
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#1e293b" />
                </TouchableOpacity>

                <Text style={styles.title}>Aramıza Katılın</Text>
                <Text style={styles.subtitle}>İkinci el dünyasına adım atmak için hemen hesabınızı oluşturun.</Text>

                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#94a3b8" style={styles.icon} />
                    <TextInput style={styles.input} placeholder="Adınız Soyadınız" placeholderTextColor="#94a3b8" />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="call-outline" size={20} color="#94a3b8" style={styles.icon} />
                    <TextInput style={styles.input} placeholder="Telefon Numaranız" keyboardType="phone-pad" placeholderTextColor="#94a3b8" />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.icon} />
                    <TextInput style={styles.input} placeholder="E-posta Adresiniz" keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#94a3b8" />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.icon} />
                    <TextInput style={styles.input} placeholder="Şifreniz" secureTextEntry placeholderTextColor="#94a3b8" />
                </View>

                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Hesap Oluştur</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },
    scrollContent: { padding: 24, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
    backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    title: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
    subtitle: { fontSize: 15, color: '#64748b', marginBottom: 32, lineHeight: 22 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16, height: 56, marginBottom: 16 },
    icon: { marginRight: 12 },
    input: { flex: 1, fontSize: 16, color: '#0f172a' },
    registerButton: { backgroundColor: '#6366f1', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
    registerButtonText: { color: '#ffffff', fontSize: 18, fontWeight: '700' }
});