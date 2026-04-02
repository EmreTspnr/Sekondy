import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Heart, MessageCircle, AlertCircle, Share2 } from 'lucide-react';
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
        console.error("Detay çekilemedi");
        // Demo amaçlı sahte veri
        setAdInfo({
          _id: adId,
          title: '(Mock Data) 2019 BMW 320i M Sport - Kusursuz Temizlikte',
          price: '$32,500',
          location: 'Çankaya, Ankara',
          description: 'Araç sıfır ayarındadır. Kapalı garajda muhafaza edilmiştir. Tüm bakımları yetkili serviste yapılmış olup, tramer kaydı bulunmamaktadır. Alıcısına şimdiden hayırlı olsun.',
          seller: { name: 'Ahmet Yılmaz', phone: '0555 123 4567', rating: 4.8 },
          images: [
            'https://picsum.photos/800/500?random=11',
            'https://picsum.photos/800/500?random=12'
          ],
          attributes: { Marka: 'BMW', Seri: '3 Serisi', Model: '320i', Yıl: '2019', Kilometre: '45.000 km' }
        });
      }
    };
    if (adId) fetchDetail();
  }, [adId]);

  if (!adInfo) return <div className="text-center py-20 text-xl font-bold">Yükleniyor...</div>;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sol Taraf - Fotoğraf ve Detaylar */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="aspect-[16/9] w-full bg-black flex items-center justify-center">
              <img src={adInfo.images?.[0] || adInfo.image} className="w-full h-full object-contain" alt={adInfo.title} />
            </div>
            {/* Küçük resimler vb. eklenebilir */}
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

        {/* Sağ Taraf - Fiyat ve Satıcı Bilgileri */}
        <aside className="w-full lg:w-96 flex-shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xl sticky top-6">
            <h1 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{adInfo.title}</h1>
            <div className="text-4xl font-black text-[#D4AF37] mb-6">{adInfo.price}</div>

            <div className="flex gap-3 mb-6">
              <button 
                onClick={() => api.post(`/messages/${adInfo._id}`)}
                className="flex-1 bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" /> Mesaj At
              </button>
              <button className="p-3.5 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:text-red-500 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3 text-gray-600 font-medium">
                <MapPin className="w-5 h-5 text-gray-400" />
                {adInfo.location}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Satıcı Bilgileri</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#D4AF37] text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md">
                  {adInfo.seller?.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <div className="font-bold text-lg text-black">{adInfo.seller?.name || 'Satıcı'}</div>
                  <div className="text-sm text-gray-500">{adInfo.seller?.phone || 'Gizli Numara'}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between text-sm">
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-black font-semibold">
                <Share2 className="w-4 h-4" /> Paylaş
              </button>
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 font-semibold">
                <AlertCircle className="w-4 h-4" /> İlanı Bildir
              </button>
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
}
