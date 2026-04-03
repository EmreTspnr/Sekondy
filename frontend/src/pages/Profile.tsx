import React, { useState, useEffect } from 'react';
import { Shield, Monitor, UserCheck, Search, Bell, BellOff, X } from 'lucide-react';
import api from '../services/api';

export default function Profile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [followedSellers, setFollowedSellers] = useState<any[]>([]);
  const [savedSearches, setSavedSearches] = useState<any[]>([]);

  
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get('/profile');
        if(response.data) {
          setFirstName(response.data.firstName || '');
          setLastName(response.data.lastName || '');
          setPhone(response.data.phone || '');
          setEmail(response.data.email || '');
        }
      } catch (error) {
        console.error("Profil alınamadı", error);
      }
      try {
        const histRes = await api.get('/auth/history');
        setLoginHistory(histRes.data.loginHistory || []);
      } catch {}
      try {
        const followRes = await api.get('/follows');
        setFollowedSellers(followRes.data || []);
      } catch {}
      try {
        const searchRes = await api.get('/saved-searches');
        setSavedSearches(searchRes.data || []);
      } catch {}
    };
    loadProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/profile', { 
        firstName,
        lastName,
        phone 
      });
      alert('Profilin başarıyla güncellendi!');
    } catch (error) {
      alert('Profil güncellenirken bir hata oluştu');
    }
  };

  const handleDelete = async () => {
    if(window.confirm('Hesabını tamamen silmek istediğine emin misin? Bu işlem geri alınamaz.')) {
      try {
        await api.delete('/profile');
        alert('Hesabınız başarıyla silindi.');
        localStorage.removeItem('token');
        window.location.href = '/auth';
      } catch (error) {
        alert('Hesap silinirken hata oluştu.');
      }
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 w-full mt-10">
      <h1 className="text-2xl font-bold text-black mb-6">Profil Ayarları</h1>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Section 1: Personal Information */}
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-black mb-6">Kişisel Bilgiler</h2>
          
          <form className="space-y-5" onSubmit={handleUpdate}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-Posta Adresi</label>
              <input 
                type="text" 
                disabled 
                value={email || 'Geçici Email Yükleniyor...'} 
                className="w-full px-4 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-lg cursor-not-allowed"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adınız</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soyadınız</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon Numarası</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all"
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                className="bg-black text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          </form>
        </div>

        <hr className="border-gray-100" />

        {/* Section 2: Login History */}
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-500" /> Giriş Geçmişi
          </h2>
          {loginHistory.length === 0 ? (
            <p className="text-sm text-gray-500">Henüz giriş kaydı bulunmuyor.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="pb-2 font-semibold">Cihaz</th>
                    <th className="pb-2 font-semibold">IP Adresi</th>
                    <th className="pb-2 font-semibold">Tarih</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loginHistory.slice(0, 10).map((entry: any, i: number) => (
                    <tr key={i} className="text-gray-700">
                      <td className="py-2.5 flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-gray-400" />
                        <span className="truncate max-w-[200px]">{entry.device || 'Bilinmiyor'}</span>
                      </td>
                      <td className="py-2.5 font-mono text-xs">{entry.ipAddress || '-'}</td>
                      <td className="py-2.5">{entry.date ? new Date(entry.date).toLocaleDateString('tr-TR') : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <hr className="border-gray-100" />

        {/* Section 3: Followed Sellers */}
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#D4AF37]" /> Takip Edilen Satıcılar
          </h2>
          {followedSellers.length === 0 ? (
            <p className="text-sm text-gray-500">Henüz takip ettiğiniz satıcı bulunmuyor.</p>
          ) : (
            <div className="space-y-3">
              {followedSellers.map((f: any) => (
                <div key={f._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#D4AF37] text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {f.seller?.firstName?.charAt(0)}{f.seller?.lastName?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{f.seller?.firstName} {f.seller?.lastName}</div>
                      <div className="text-xs text-gray-500">{f.seller?.email}</div>
                    </div>
                  </div>
                  <button onClick={async () => {
                    await api.delete(`/users/${f.seller?._id}/follow`);
                    setFollowedSellers(followedSellers.filter(x => x._id !== f._id));
                  }} className="text-xs text-red-400 hover:text-red-600 font-bold">Takipten Çık</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <hr className="border-gray-100" />

        {/* Section 4: Saved Searches */}
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-500" /> Kayıtlı Aramalarım
          </h2>
          {savedSearches.length === 0 ? (
            <p className="text-sm text-gray-500">Kayıtlı aramanız bulunmuyor. Ana sayfada arama yaptıktan sonra kaydetme özelliğini kullanabilirsiniz.</p>
          ) : (
            <div className="space-y-3">
              {savedSearches.map((s: any) => (
                <div key={s._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-bold text-sm">{s.keyword || 'Tüm'} {s.category ? `• ${s.category}` : ''}</div>
                    <div className="text-xs text-gray-500">{s.location || 'Tüm Konumlar'} {s.minPrice || s.maxPrice ? `• ${s.minPrice || 0} - ${s.maxPrice || '∞'} TL` : ''}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={async () => {
                      const enabled = !s.notificationsEnabled;
                      await api.put(`/saved-searches/${s._id}/notifications`, { notificationsEnabled: enabled });
                      setSavedSearches(savedSearches.map(x => x._id === s._id ? {...x, notificationsEnabled: enabled} : x));
                    }} className={`p-1.5 rounded-lg transition-colors ${s.notificationsEnabled ? 'text-[#D4AF37] bg-yellow-50' : 'text-gray-400 hover:text-gray-600'}`} title={s.notificationsEnabled ? 'Bildirimi Kapat' : 'Bildirimi Aç'}>
                      {s.notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                    </button>
                    <button onClick={async () => {
                      await api.delete(`/saved-searches/${s._id}`);
                      setSavedSearches(savedSearches.filter(x => x._id !== s._id));
                    }} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <hr className="border-gray-100" />

        {/* Section 2: Danger Zone */}
        <div className="p-6 md:p-8 bg-gray-50/50">
          <h2 className="text-lg font-bold text-red-600 mb-2">Hesabı Sil</h2>
          <p className="text-sm text-gray-600 mb-5 max-w-2xl">
            Hesabınızı sildiğiniz zaman bu işlemin geri dönüşü yoktur. Tüm aktif ilanlarınız, favorileriniz ve mesajlarınız Sekondy sisteminden sonsuza dek silinir.
          </p>
          <button 
            type="button" 
            onClick={handleDelete}
            className="border-2 border-red-200 text-red-600 font-bold py-2.5 px-6 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
          >
            Hesabımı Tamamen Sil
          </button>
        </div>
      </div>
    </main>
  );
}