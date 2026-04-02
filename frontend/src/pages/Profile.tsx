import React, { useState, useEffect } from 'react';
import api from '../services/api';



export default function Profile() {
  const [profile, setProfile] = useState(null);

  // Sayfa ilk açıldığında profil bilgilerini çeker
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setProfile(response.data);
      } catch (error) {
        console.error("Profil alınamadı", error);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (updatedData) => {
    try {
      await api.put('/profile', updatedData);
      alert("Profil güncellendi.");
    } catch (error) {
      console.error("Hata oluştu", error);
    }
  };

  return (
    <div className="p-8 text-center bg-blue-50 border-2 border-blue-200 mt-10 max-w-lg mx-auto rounded-lg">
      <h1 className="text-2xl font-bold mb-4">GÖREVLİ: FURKAN SARIBAŞ</h1>
      <p>Buraya profil yönetimi sayfası gelecek. Eski koddan kopyalayabilirsin.</p>
    </div>
  );
}
