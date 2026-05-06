import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SavedSearchesScreen() {
    const router = useRouter();
    const [searches, setSearches] = useState([
        { id: '1', keyword: 'iPhone 13', category: 'Elektronik', bildirim: true },
        { id: '2', keyword: 'IKEA Masa', category: 'Ev & Yasam', bildirim: false },
        { id: '3', keyword: 'Dag Bisikleti', category: 'Spor', bildirim: true },
    ]);

    const toggleBildirim = (id: string) => {
        setSearches(searches.map(s => s.id === id ? { ...s, bildirim: !s.bildirim } : s));
    };

    const handleSil = (id: string, keyword: string) => {
        Alert.alert(
            'Aramayi Sil',
            `"${keyword}" aramasini listenden kaldirmak istiyor musun?`,
            [
                { text: 'Iptal', style: 'cancel' },
                { text: 'Sil', style: 'destructive', onPress: () => setSearches(searches.filter(s => s.id !== id)) }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Kayitli Aramalarim</Text>
                <View style={styles.backButton} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {searches.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={60} color="#cbd5e1" />
                        <Text style={styles.emptyText}>Henuz kayitli aramaniz yok.</Text>
                    </View>
                ) : (
                    searches.map(search => (
                        <View key={search.id} style={styles.card}>
                            <View style={styles.cardLeft}>
                                <View style={styles.searchIconWrapper}>
                                    <Ionicons name="search" size={20} color="#6366f1" />
                                </View>
                                <View>
                                    <Text style={styles.keyword}>{search.keyword}</Text>
                                    <Text style={styles.category}>{search.category}</Text>
                                </View>
                            </View>
                            <View style={styles.cardRight}>
                                <Switch
                                    value={search.bildirim}
                                    onValueChange={() => toggleBildirim(search.id)}
                                    trackColor={{ false: '#e2e8f0', true: '#a5b4fc' }}
                                    thumbColor={search.bildirim ? '#6366f1' : '#94a3b8'}
                                />
                                <TouchableOpacity onPress={() => handleSil(search.id, search.keyword)} style={styles.deleteButton}>
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
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
    scrollContent: { padding: 20 },
    card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
    cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    searchIconWrapper: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    keyword: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
    category: { fontSize: 13, color: '#64748b', marginTop: 2 },
    cardRight: { flexDirection: 'row', alignItems: 'center' },
    deleteButton: { marginLeft: 12, width: 36, height: 36, borderRadius: 10, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center' },
    emptyContainer: { alignItems: 'center', marginTop: 80 },
    emptyText: { color: '#94a3b8', fontSize: 16, marginTop: 16 },
});