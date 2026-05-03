import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, Flag, UserX, Trash2 } from 'lucide-react';
import api from '../services/api';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'pending' | 'reported'>('pending');
    const [pendingAds, setPendingAds] = useState<any[]>([]);
    const [reportedAds, setReportedAds] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setIsAuthorized(false);
                    setIsLoading(false);
                    return;
                }

                const [pendingRes, reportedRes] = await Promise.all([
                    api.get('/admin/ads/pending'),
                    api.get('/admin/reports')
                ]);
                setPendingAds(pendingRes.data);
                setReportedAds(reportedRes.data);
                setIsAuthorized(true);
            } catch (error: any) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    setIsAuthorized(false);
                } else {
                    console.error("Veriler getirilemedi:", error);
                    setIsAuthorized(true); 
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <main className="max-w-6xl mx-auto px-4 py-8 w-full mt-5 flex justify-center items-center h-64">
                <div className="text-gray-500 font-bold">Yükleniyor...</div>
            </main>
        );
    }

    if (!isAuthorized) {
        return (
            <main className="max-w-6xl mx-auto px-4 py-8 w-full mt-5">
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center flex flex-col items-center">
                    <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold text-red-700 mb-2">Yetkisiz Erişim</h1>
                    <p className="text-red-600 max-w-md">Bu sayfayı görüntülemek için yönetici yetkilerine sahip olmanız gerekmektedir.</p>
                    <a href="/" className="mt-8 inline-block bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors">
                        Ana Sayfaya Dön
                    </a>
                </div>
            </main>
        );
    }

    const handleApprove = async (id: string) => {
        try {
            await api.put(`/admin/ads/${id}/approve`);
            setPendingAds(pendingAds.filter(ad => ad._id !== id));
            alert('İlan Onaylandı!');
        } catch (error) {
            console.error(error);
            alert('İlan onaylanırken bir hata oluştu.');
        }
    };

    const handleReject = async (id: string) => {
        if (!window.confirm('Bu ilanı kalıcı olarak silmek istediğinize emin misiniz?')) return;
        try {
            await api.delete(`/admin/ads/${id}`);
            setPendingAds(pendingAds.filter(ad => ad._id !== id));
            alert('İlan Reddedildi ve Silindi!');
        } catch (error) {
            console.error(error);
            alert('İlan reddedilirken bir hata oluştu.');
        }
    };

    const handleDeleteReported = async (listingId: string, reportId: string) => {
        if (!window.confirm('Bu uygunsuz ilanı sistemden kalıcı olarak silmek istediğinize emin misiniz?')) return;
        try {
            await api.delete(`/admin/ads/${listingId}`);
            setReportedAds(reportedAds.filter(r => r._id !== reportId));
            alert('Uygunsuz ilan başarıyla silindi!');
        } catch (error) {
            console.error(error);
            alert('İlan silinirken hata oluştu.');
        }
    };

    const handleSuspendUser = async (userId: string) => {
        if (!window.confirm('Bu kullanıcının hesabını askıya almak istediğinize emin misiniz? Kullanıcı giriş yapamayacak.')) return;
        try {
            await api.put(`/admin/users/${userId}/suspend`);
            alert('Kullanıcı hesabı askıya alındı!');
        } catch (error) {
            console.error(error);
            alert('Kullanıcı askıya alınırken hata oluştu.');
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

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-colors ${
                        activeTab === 'pending'
                            ? 'bg-white text-black shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <span className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Onay Bekleyenler ({pendingAds.length})
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('reported')}
                    className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-colors ${
                        activeTab === 'reported'
                            ? 'bg-white text-black shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <span className="flex items-center gap-2">
                        <Flag className="w-4 h-4" />
                        Şikayet Edilenler ({reportedAds.length})
                    </span>
                </button>
            </div>

            {/* Pending Tab */}
            {activeTab === 'pending' && (
                <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                    {pendingAds.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            Bekleyen hiçbir ilan bulunmuyor.
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                                <th className="p-4 font-semibold text-gray-600">İlan Başlığı</th>
                                <th className="p-4 font-semibold text-gray-600">Fiyat</th>
                                <th className="p-4 font-semibold text-gray-600">Kategori</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Aksiyonlar</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {pendingAds.map(ad => (
                                <tr key={ad._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-gray-900">{ad.title}</td>
                                    <td className="p-4 text-gray-600">{ad.price}</td>
                                    <td className="p-4 text-gray-600">{ad.category}</td>
                                    <td className="p-4 flex gap-2 justify-end">
                                        <button
                                            onClick={() => handleApprove(ad._id)}
                                            className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 font-bold text-sm transition-colors"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Onayla
                                        </button>
                                        <button
                                            onClick={() => handleReject(ad._id)}
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
            )}

            {/* Reported Tab */}
            {activeTab === 'reported' && (
                <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                    {reportedAds.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <Flag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            Şikayet edilen ilan bulunmuyor.
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                                <th className="p-4 font-semibold text-gray-600">İlan</th>
                                <th className="p-4 font-semibold text-gray-600">Şikayet Nedeni</th>
                                <th className="p-4 font-semibold text-gray-600">Tarih</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Aksiyonlar</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {reportedAds.map(report => (
                                <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900">{report.listing?.title || 'Silinmiş İlan'}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{report.listing?.price} • {report.listing?.status}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold">
                                            {report.reason}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {new Date(report.createdAt).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2 justify-end">
                                            {report.listing && (
                                                <button
                                                    onClick={() => handleDeleteReported(report.listing._id, report._id)}
                                                    className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 font-bold text-sm transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" /> İlanı Sil
                                                </button>
                                            )}
                                            {report.reportedBy && (
                                                <button
                                                    onClick={() => handleSuspendUser(report.reportedBy)}
                                                    className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg hover:bg-orange-200 font-bold text-sm transition-colors"
                                                    title="Şikayet eden kullanıcıyı değil, ilan sahibini askıya al"
                                                >
                                                    <UserX className="w-4 h-4" /> Askıya Al
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </main>
    );
}