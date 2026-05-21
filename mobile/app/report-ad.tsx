import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../services/api';

export default function ReportAdScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReport = async () => {
        if (!reason.trim()) {
            Alert.alert('Hata', 'Lütfen şikayet nedeninizi belirtin.');
            return;
        }

        if (!id) {
            Alert.alert('Hata', 'İlan bulunamadı.');
            return;
        }

        setLoading(true);
        try {
            await api.post(`/listings/${id}/reports`, { reason });
            Alert.alert('Teşekkürler', 'Şikayetiniz yöneticilere iletildi. İncelenecektir.');
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert('Hata', 'Şikayet gönderilirken bir sorun oluştu. Giriş yaptığınızdan emin olun.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="close" size={24} color="#1e293b" />
                    </TouchableOpacity>
                </View>

                <View style={styles.iconContainer}>
                    <Ionicons name="warning-outline" size={60} color="#f59e0b" />
                </View>

                <Text style={styles.title}>İlanı Şikayet Et</Text>
                <Text style={styles.subtitle}>Bu ilanın kurallarımızı ihlal ettiğini veya yanıltıcı olduğunu düşünüyorsanız lütfen bize bildirin.</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Şikayet nedeninizi detaylıca açıklayın..."
                        placeholderTextColor="#94a3b8"
                        multiline={true}
                        numberOfLines={6}
                        value={reason}
                        onChangeText={setReason}
                        textAlignVertical="top"
                    />
                </View>

                <TouchableOpacity style={styles.reportButton} onPress={handleReport} disabled={loading}>
                    <Ionicons name="flag-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                    <Text style={styles.reportButtonText}>{loading ? 'Gönderiliyor...' : 'Şikayeti Gönder'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },
    scrollContent: { padding: 24, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
    header: { marginBottom: 20 },
    backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
    iconContainer: { alignItems: 'center', marginBottom: 24 },
    title: { fontSize: 26, fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: 12 },
    subtitle: { fontSize: 15, color: '#64748b', textAlign: 'center', marginBottom: 32, lineHeight: 22 },
    inputContainer: { backgroundColor: '#f8fafc', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', padding: 16, height: 150, marginBottom: 24 },
    textArea: { flex: 1, fontSize: 16, color: '#0f172a' },
    reportButton: { flexDirection: 'row', backgroundColor: '#ef4444', borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', shadowColor: '#ef4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    reportButtonText: { color: '#ffffff', fontSize: 18, fontWeight: '700' }
});