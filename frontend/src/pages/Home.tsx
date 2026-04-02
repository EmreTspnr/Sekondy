import React, { useState, useEffect } from 'react';
import api from '../services/api';



export default function Home() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const fetchShowcaseAds = async () => {
      try {
        // Vitrin ilanlarını getiren endpoint
        const response = await api.get('/ads/showcase');
        setAds(response.data);
      } catch (error) {
        console.error("İlanlar yüklenemedi", error);
      }
    };
    fetchShowcaseAds();
  }, []);

  // Kategori id'sine tıklandığında çalışacak fonksiyon
  const fetchByCategory = async (categoryId) => {
    try {
      const response = await api.get(`/ads/category/${categoryId}`);
      setAds(response.data);
    } catch (error) {
      console.error("Kategori hatası", error);
    }
  };

  return (
    <div className="p-8 text-center bg-green-50 border-2 border-green-200 mt-10 max-w-lg mx-auto rounded-lg">
      <h1 className="text-2xl font-bold mb-4">GÖREVLİ: SİNAN ECE</h1>
      <p>Burası giriş sayfası olacak. Arama çubuğu ve İlanları Listeleme işi sende.</p>
      <p className="text-sm mt-2"><strong>EskiTasarim.tsx</strong> içindeki `HomePage` ve `SearchBar` componentlerini buraya taşıyabilirsin.</p>
    </div>
  );
}
