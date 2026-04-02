import React, { useState } from 'react';
import api from '../services/api';

export default function PostAd() {
  const [formData, setFormData] = useState({ title: '', price: '', desc: '' });
  const [imageFile, setImageFile] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const adResponse = await api.post('/ads', formData);
      const adId = adResponse.data._id;


      if (imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('photo', imageFile);
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
