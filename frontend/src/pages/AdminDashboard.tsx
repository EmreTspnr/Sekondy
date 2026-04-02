import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import api from '../services/api';

export default function AdminDashboard() {
    const [pendingAds, setPendingAds] = useState<any[]>([]);

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const response = await api.get('/admin/ads/pending');
                setPendingAds(response.data);
            } catch (error) {
                // Mock data
                setPendingAds([
                    { id: 101, title: '(Mock Data) PS5 Temiz', seller: 'Efe K.', price: '$450', reason: 'Yeni İlan' },
                    { id: 102, title: '(Mock Data) Şüpheli İlan', seller: 'UserX', price: '$10', reason: 'Şikayet Edildi' },
                ]);
            }
        };
        fetchPending();
    }, []);

    const handleApprove = async (id: number) => {
        try {
            await api.put(`/admin/ads/${id}/approve`);
            setPendingAds(pendingAds.filter(ad => ad.id !== id));
            alert('İlan Onaylandı!');
        } catch {
            setPendingAds(pendingAds.filter(ad => ad.id !== id));
            alert('İlan Onaylandı! (Demo)');
        }
    };

    const handleReject = async (id: number) => {
        try {
            await api.delete(`/admin/ads/${id}`);
            setPendingAds(pendingAds.filter(ad => ad.id !== id));
            alert('İlan Reddedildi ve Silindi!');
        } catch {
            setPendingAds(pendingAds.filter(ad => ad.id !== id));
            alert('İlan Reddedildi! (Demo)');
        }
    };

    return (
        <main className="max-w-6xl mx-auto px-4 py-8 w-full mt-5">
            <div className="flex items-center gap-3 mb-8 border-b pb-4">
                <Shield className="w-8 h-8 text-red-600" />
                <div>
                    <h1 className="text-2xl font-bold text-black">Admin Yönetim Paneli</h1>
                    <p className="text-sm text-gray-500">Sistemdeki şikayet edilen veya onay bekleyen ilanların kontrol noktası.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 font-bold text-gray-700 flex items-center justify-between">
                    <span>Bekleyen İşlemler ({pendingAds.length})</span>
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                </div>

                {pendingAds.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        Bekleyen hiçbir ilan/şikayet bulunmuyor.
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                            <th className="p-4 font-semibold text-gray-600">İlan Başlığı</th>
                            <th className="p-4 font-semibold text-gray-600">Satıcı</th>
                            <th className="p-4 font-semibold text-gray-600">Fiyat</th>
                            <th className="p-4 font-semibold text-gray-600">Durum/Sebep</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Aksiyonlar</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {pendingAds.map(ad => (
                            <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-bold text-gray-900">{ad.title}</td>
                                <td className="p-4 text-gray-600">{ad.seller}</td>
                                <td className="p-4 text-gray-600">{ad.price}</td>
                                <td className="p-4">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                      {ad.reason}
                    </span>
                                </td>
                                <td className="p-4 flex gap-2 justify-end">
                                    <button
                                        onClick={() => handleApprove(ad.id)}
                                        className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 font-bold text-sm transition-colors"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Onayla
                                    </button>
                                    <button
                                        onClick={() => handleReject(ad.id)}
                                        className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 font-bold text-sm transition-colors"
                                    >
                                        <XCircle className="w-4 h-4" /> Reddet
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </main>
    );
}