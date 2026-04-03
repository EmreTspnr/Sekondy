import React, { useState, useEffect } from 'react';
import { Search, Heart, MapPin, SlidersHorizontal, ChevronRight } from 'lucide-react';
import api from '../services/api';

const CATEGORIES = ['Tümü', 'Vasıta', 'Emlak', 'Elektronik', 'Moda', 'Ev & Bahçe'];

export default function Home() {
  const [ads, setAds] = useState<any[]>([]);
  const [category, setCategory] = useState('Tümü');
  const [search, setSearch] = useState('');

  
  useEffect(() => {
    const fetchAds = async () => {
      try {
        let endpoint = '/ads/showcase';
        if (category !== 'Tümü') {
          endpoint = `/ads/category/${category}`;
        }
        const response = await api.get(endpoint);
        setAds(response.data.length ? response.data : []);
      } catch (error) {
        console.error("İlanlar gelmedi:", error);
        setAds([]);
      }
    };
    fetchAds();
  }, [category]);

  const toggleFavorite = async (adId: string) => {
    try {
      await api.post(`/favorites/${adId}`);
      alert('Favorilere eklendi!');
    } catch {
      alert('Giriş yapmanız gerekli!');
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 w-full">
      {/* Banner / Arama */}
      <div className="bg-[#1a1a1a] rounded-2xl p-8 mb-10 text-center shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">Aradığın her şey <span className="text-[#D4AF37]">Sekondy'de.</span></h1>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">İkinci el araba, telefon, bilgisayar ve daha fazlası binlerce ilan arasından seni bekliyor.</p>
          
          <div className="max-w-3xl mx-auto bg-white rounded-full p-2 flex items-center shadow-xl">
            <div className="flex-1 flex items-center pl-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Ne arıyorsunuz? (Örn: iphone, bmw)" 
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border-none outline-none text-black font-medium placeholder-gray-400"
              />
            </div>
            <button className="bg-[#D4AF37] hover:bg-[#c19b2e] text-black font-bold py-3 px-8 rounded-full transition-colors whitespace-nowrap">
              Araştır
            </button>
          </div>
        </div>
      </div>

      {/* Kategoriler */}
      <div className="flex overflow-x-auto gap-4 mb-10 pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button 
            key={cat} onClick={() => setCategory(cat)}
            className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-colors border-2 ${
              category === cat 
                ? 'bg-black text-white border-black' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-black'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Başlık ve Filtre */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black border-l-4 border-[#D4AF37] pl-3">
          {category === 'Tümü' ? 'Vitrin İlanları' : `${category} İlanları`}
        </h2>
        <button className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black">
          <SlidersHorizontal className="w-4 h-4" /> Filtrele
        </button>
      </div>

      {/* İlan Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ads.filter(a => a.title.toLowerCase().includes(search.toLowerCase())).map(ad => (
          <div key={ad._id} onClick={() => window.location.href=`/ad/${ad._id}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow group cursor-pointer">
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
              <img src={ad.photos?.[0] || 'https://via.placeholder.com/400x300?text=Gorsel+Yok'} alt={ad.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <button 
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm z-10"
                onClick={(e) => { e.stopPropagation(); toggleFavorite(ad._id); }}
              >
                <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
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
        ))}
      </div>
    </main>
  );
}