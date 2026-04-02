import React, { useState } from 'react';
import api from '../services/api';

/* ==========================================
   GÖREVLİ: EMRE TAŞPINAR
   GÖREV KAPSAMI: Yeni İlan Ekleme ve Fotoğraf Yükleme (Cloudinary)
   ==========================================
*/

export default function PostAd() {
  const [formData, setFormData] = useState({ title: '', price: '', desc: '' });
  const [imageFile, setImageFile] = useState(null);

  // Form submit olduğunda önce Cloudinary'e, dönen id ile mongodb'ye eklenecek
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Backend'e ilanı oluştur komutu verilir
      const adResponse = await api.post('/ads', formData);
      const adId = adResponse.data._id; // Yeni oluşan ilanın mongo db ID'si

      // 2. Resim varsa cloudinary'ye yollayıp linkini mongo'ya update atarız
      if(imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('photo', imageFile); // 'photo' ismi app.js'te multer'dan gelmeli
        await api.post(`/ads/${adId}/photos`, formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      alert("İlan mükemmel şekilde eklendi!");
    } catch (error) {
      console.error("Hata", error);
    }
  };

  return (
    <div className="p-8 text-center bg-yellow-50 border-2 border-yellow-200 mt-10 max-w-lg mx-auto rounded-lg">
      <h1 className="text-2xl font-bold mb-4">GÖREVLİ: EMRE TAŞPINAR</h1>
      <p>Yeni İlan açma sayfası ve formları buraya gelecek. Cloudinary örneği üstteki kodda gömülüdür.</p>
    </div>
  );
}
