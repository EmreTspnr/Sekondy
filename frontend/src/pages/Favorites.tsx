import React, { useState, useEffect } from 'react';
import { Heart, MapPin, ChevronRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get('/favorites');
        setFavorites(response.data);
      } catch (error) {
        console.error("Favoriler alınamadı", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  // Not: Backend'de /favorites/:id DELETE endpointi yoksa, Favori silme işlemini
  // ileride bir endpoint ekleyerek revize etmeliyiz. Şu an UI olarak hazırlıyoruz.
  const handleRemoveFavorite = async (e: React.MouseEvent, favId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if(window.confirm('Bu ilanı favorilerinizden çıkarmak istediğinize emin misiniz?')) {
      alert("Favorilerden çıkarma endpoint'i bağlandığında buradan silinecektir!");
      // mock UI delete
      setFavorites(favorites.filter(f => f._id !== favId));
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 w-full mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" /> Favorilerim
          </h1>
          <p className="text-sm text-gray-500 mt-1">Takip ettiğiniz ilanları buradan gözden geçirebilirsiniz.</p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500 font-medium">
          Datalar yükleniyor...
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium mb-4">Henüz favoriye eklediğiniz bir ilan bulunmuyor.</p>
          <Link to="/" className="text-[#D4AF37] font-bold hover:underline">Vitrine Dön</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((fav) => {
            const ad = fav.listing;
            if (!ad) return null; // İlan silinmiş ama favori tablosunda kalmışsa
            
            return (
              <div key={fav._id} onClick={() => window.location.href=`/ad/${ad._id}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow group cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img 
                    src={ad.photos?.[0] || 'https://via.placeholder.com/400x300?text=Gorsel+Yok'} 
                    alt={ad.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <button 
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-50 transition-colors shadow-sm z-10"
                    onClick={(e) => handleRemoveFavorite(e, fav._id)}
                  >
                    <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500" />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm text-[#D4AF37] px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
                    {ad.price}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#D4AF37] transition-colors">{ad.title}</h3>
                  <div className="flex items-center text-xs font-semibold text-gray-500 gap-1 mt-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{ad.location}</span>
                    <span className="ml-auto flex items-center"><ChevronRight className="w-4 h-4" /></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
