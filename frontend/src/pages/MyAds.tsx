import React, { useState, useEffect } from 'react';
import { Package, Trash2, Edit3, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function MyAds() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyAds = async () => {
      try {
        const response = await api.get('/my-listings');
        setAds(response.data);
      } catch (error) {
        console.error("İlanlar alınamadı", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyAds();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bu ilanı kalıcı olarak silmek istediğinize emin misiniz?")) {
      try {
        await api.delete(`/listings/${id}`);
        setAds(ads.filter(ad => ad._id !== id));
        alert("İlan başarıyla silindi!");
      } catch (error) {
        alert("İlan silinirken bir hata oluştu.");
      }
    }
  };

  const handleEdit = async (ad: any) => {
    const title = window.prompt("Başlık:", ad.title);
    if (title === null) return;
    const price = window.prompt("Fiyat:", String(ad.price));
    if (price === null) return;
    const description = window.prompt("Açıklama:", ad.description);
    if (description === null) return;
    const location = window.prompt("Konum:", ad.location);
    if (location === null) return;

    try {
      const res = await api.put(`/listings/${ad._id}`, { 
        title: title || ad.title, 
        price: price || ad.price, 
        description: description || ad.description, 
        location: location || ad.location 
      });
      setAds(ads.map(a => a._id === ad._id ? res.data : a));
      alert("İlan güncellendi!");
    } catch (error) {
      alert("İlan güncellenirken bir hata oluştu.");
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 w-full mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-2">
            <Package className="w-6 h-6" /> İlanlarım
          </h1>
          <p className="text-sm text-gray-500 mt-1">Yayındaki ilanlarınızı görüntüleyin, düzenleyin veya kaldırın.</p>
        </div>
        <Link to="/post-ad" className="bg-[#D4AF37] hover:bg-[#c19b2e] text-black font-bold py-2.5 px-6 rounded-lg transition-colors whitespace-nowrap shadow">
          Yeni İlan Ver
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium">İlanlarınız yükleniyor...</div>
        ) : ads.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium mb-4">Henüz hiç ilan vermemişsiniz.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {ads.map(ad => (
              <div key={ad._id} className="flex flex-col sm:flex-row items-start sm:items-center p-5 hover:bg-gray-50 transition-colors gap-5">
                
                <div className="w-24 h-24 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                  <img 
                    src={ad.photos?.[0] || 'https://via.placeholder.com/150?text=Gorsel+Yok'} 
                    alt={ad.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-black text-lg mb-1 truncate">{ad.title}</h3>
                  <div className="text-[#D4AF37] font-black text-xl mb-1">{ad.price}</div>
                  <div className="flex gap-3 text-sm text-gray-500 font-medium">
                    <span>{ad.category}</span>
                    <span>•</span>
                    <span>{ad.location}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                  <Link to={`/ad/${ad._id}`} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:text-black hover:border-black transition-colors">
                    <Eye className="w-4 h-4" /> Görüntüle
                  </Link>
                  <button onClick={() => handleEdit(ad)} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:text-blue-500 hover:border-blue-500 transition-colors">
                    <Edit3 className="w-4 h-4" /> Düzenle
                  </button>
                  <button onClick={() => handleDelete(ad._id)} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 border border-red-200 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" /> Sil
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
