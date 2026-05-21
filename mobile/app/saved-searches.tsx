import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../services/api';

export default function SavedSearchesScreen() {
    const router = useRouter();
    const [searches, setSearches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSearches();
    }, []);

    const fetchSearches = async () => {
        try {
            const response = await api.get('/saved-searches');
            setSearches(response.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Hata', 'Kayıtlı aramalar yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    const toggleBildirim = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setSearches(searches.map(s => s._id === id ? { ...s, notificationsEnabled: !currentStatus } : s));
        try {
            await api.put(`/saved-searches/${id}/notifications`, { notificationsEnabled: !currentStatus });
        } catch (error) {
            console.error(error);
            // Revert on failure
            setSearches(searches.map(s => s._id === id ? { ...s, notificationsEnabled: currentStatus } : s));
            Alert.alert('Hata', 'Bildirim ayarı güncellenemedi.');
        }
    };

    const handleSil = (id: string, keyword: string) => {
        Alert.alert(
            'Aramayı Sil',
            `"${keyword}" aramasını listenden kaldırmak istiyor musun?`,
            [
                { text: 'İptal', style: 'cancel' },
                { 
                    text: 'Sil', 
                    style: 'destructive', 
                    onPress: async () => {
                        try {
                            await api.delete(`/saved-searches/${id}`);
                            setSearches(searches.filter(s => s._id !== id));
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Hata', 'Arama silinemedi.');
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Kayıtlı Aramalarım</Text>
                <View style={styles.backButton} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {loading ? (
                    <ActivityIndicator size="large" color="#D4AF37" style={{ marginTop: 40 }} />
                ) : searches.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={60} color="#cbd5e1" />
                        <Text style={styles.emptyText}>Henüz kayıtlı aramanız yok.</Text>
                    </View>
                ) : (
                    searches.map(search => (
                        <View key={search._id} style={styles.card}>
                            <View style={styles.cardLeft}>
                                <View style={styles.searchIconWrapper}>
                                    <Ionicons name="search" size={20} color="#D4AF37" />
                                </View>
                                <View>
                                    <Text style={styles.keyword}>{search.query}</Text>
                                    {search.category && <Text style={styles.category}>{search.category}</Text>}
                                </View>
                            </View>
                            <View style={styles.cardRight}>
                                <Switch
                                    value={search.notificationsEnabled}
                                    onValueChange={() => toggleBildirim(search._id, search.notificationsEnabled)}
                                    trackColor={{ false: '#e2e8f0', true: '#fdfbd4' }}
                                    thumbColor={search.notificationsEnabled ? '#D4AF37' : '#94a3b8'}
                                />
                                <TouchableOpacity onPress={() => handleSil(search._id, search.query)} style={styles.deleteButton}>
                                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
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
    card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
    cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    searchIconWrapper: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fdfbd4', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    keyword: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
    category: { fontSize: 13, color: '#64748b', marginTop: 2 },
    cardRight: { flexDirection: 'row', alignItems: 'center' },
    deleteButton: { marginLeft: 12, width: 36, height: 36, borderRadius: 10, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center' },
    emptyContainer: { alignItems: 'center', marginTop: 80 },
    emptyText: { color: '#94a3b8', fontSize: 16, marginTop: 16 },
});