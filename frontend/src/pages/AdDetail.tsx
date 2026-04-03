import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Heart, MessageCircle, AlertCircle, Share2, UserPlus, Flag } from 'lucide-react';
import api from '../services/api';

export default function AdDetail() {
  const { adId } = useParams();
  const [adInfo, setAdInfo] = useState<any>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/ads/${adId}`);
        setAdInfo(response.data);
      } catch (error) {
        setAdInfo({
          _id: adId,
          title: '(Mock Data) 2019 BMW 320i M Sport - Kusursuz Temizlikte',
          price: '$32,500',
          location: 'Çankaya, Ankara',
          description: 'Araç sıfır ayarındadır. Tramer kaydı bulunmamaktadır.',
          seller: { name: 'Ahmet Yılmaz', phone: '0555 123 4567', rating: 4.8 },
          photos: ['https://picsum.photos/800/500?random=11'],
          attributes: { Marka: 'BMW', Seri: '3 Serisi', Model: '320i', Yıl: '2019', Kilometre: '45.000 km' }
        });
      }
    };
    if (adId) fetchDetail();
  }, [adId]);

  if (!adInfo) return <div className="text-center py-20">Yükleniyor...</div>;

  const handleFavorite = async () => {
    try {
      await api.post('/favorites', { listingId: adInfo._id || adId });
      alert('Favorilere eklendi!');
    } catch {
      alert('Giriş yapmanız gerekli veya ilan zaten favorilerinizde!');
    }
  };

  const handleSendMessage = async () => {
    const content = window.prompt("Mesajınızı yazın:");
    if (!content) return;
    try {
      const receiverId = (typeof adInfo.owner === 'object' ? adInfo.owner?._id : adInfo.owner) || 'MOCK_ID';
      await api.post('/messages', { receiverId, content, listingId: adInfo._id || adId });
      alert('Mesajınız başarıyla iletildi!');
    } catch {
      alert('Mesaj gönderilirken hata oluştu. Giriş yaptığınızdan emin olun veya kendi ilanınıza mesaj atmadığınızı kontrol edin.');
    }
  };

  const handleFollow = async () => {
    try {
      const sellerId = typeof adInfo.owner === 'object' ? adInfo.owner?._id : adInfo.owner;
      if (!sellerId) return alert('Satıcı bilgisi bulunamadı.');
      await api.post(`/users/${sellerId}/follow`);
      alert('Satıcı başarıyla takip edildi!');
    } catch {
      alert('Zaten takip ediyorsunuz veya giriş yapmanız gerekli.');
    }
  };

  const handleReport = async () => {
    const reason = window.prompt('Şikayet nedeninizi yazın:');
    if (!reason) return;
    try {
      await api.post('/reports', { listingId: adInfo._id || adId, reason });
      alert('Şikayet başarıyla iletildi. Teşekkürler!');
    } catch {
      alert('Şikayet gönderilirken hata oluştu.');
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="aspect-[16/9] w-full bg-black flex items-center justify-center">
              <img src={adInfo.photos?.[0] || 'https://via.placeholder.com/800x500?text=Gorsel+Yok'} className="w-full h-full object-contain" alt={adInfo.title} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4 border-b pb-2">İlan Açıklaması</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{adInfo.description}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4 border-b pb-2">Özellikler</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              {adInfo.attributes && Object.entries(adInfo.attributes).map(([key, val]) => (
                <div key={key} className="flex flex-col border-b border-gray-100 pb-2">
                  <span className="text-gray-500 font-medium">{key}</span>
                  <span className="text-black font-bold mt-1">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="w-full lg:w-96 flex-shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xl sticky top-6">
            <h1 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{adInfo.title}</h1>
            <div className="text-4xl font-black text-[#D4AF37] mb-6">{adInfo.price}</div>

            <div className="flex gap-3 mb-6">
              <button onClick={handleSendMessage} className="flex-1 bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" /> Mesaj At
              </button>
              <button onClick={handleFavorite} className="p-3.5 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:text-red-500 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Satıcı Bilgileri</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#D4AF37] text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md">
                  {adInfo.owner ? `${adInfo.owner.firstName?.charAt(0)}${adInfo.owner.lastName?.charAt(0) || ''}` : (adInfo.seller?.name?.charAt(0) || 'S')}
                </div>
                <div>
                  <div className="font-bold text-lg text-black">{adInfo.owner ? `${adInfo.owner.firstName} ${adInfo.owner.lastName}` : (adInfo.seller?.name || 'Satıcı')}</div>
                  <div className="text-sm text-gray-500">{adInfo.owner?.phone || adInfo.seller?.phone || 'Gizli Numara'}</div>
                </div>
              </div>
              <button onClick={handleFollow} className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border-2 border-[#D4AF37] text-[#D4AF37] font-bold rounded-xl hover:bg-[#D4AF37] hover:text-black transition-colors text-sm">
                <UserPlus className="w-4 h-4" /> Satıcıyı Takip Et
              </button>
            </div>

            <button onClick={handleReport} className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 text-gray-400 hover:text-red-500 text-sm font-medium transition-colors">
              <Flag className="w-4 h-4" /> İlanı Şikayet Et
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
