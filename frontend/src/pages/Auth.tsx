import React, { useState } from 'react';
import api from '../services/api';
import { Eye, EyeOff } from 'lucide-react'; // Eski tasarımda kullandığınız iconlar



export default function Auth() {
  // BURAYA ESKİ TASARIMDAKİ STATE'LERİ YAPIŞTIR (Örn: activeTab, showPassword)

  // Örnek Axios Login İsteği
  const handleLogin = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      alert("Giriş Başarılı!");
      // Gelen token'ı api.ts alsın diye local'e kaydediyoruz
      localStorage.setItem('token', response.data.token);
      window.location.href = '/'; // Anasayfaya at
    } catch (error) {
      console.error("Giriş hatası", error);
      alert("Giriş yapılamadı");
    }
  };

  // Örnek Axios Kayıt İsteği
  const handleRegister = async (userData) => {
    try {
      await api.post('/auth/register', userData);
      alert("Kayıt Başarılı, şimdi giriş yapabilirsiniz!");
    } catch (error) {
      console.error("Kayıt hatası", error);
    }
  };

  return (
    <div className="p-8 text-center bg-blue-50 border-2 border-blue-200 mt-10 max-w-lg mx-auto rounded-lg">
      <h1 className="text-2xl font-bold mb-4">GÖREVLİ: FURKAN SARIBAŞ</h1>
      <p>Bu sayfadaki tasarımı (AuthPage) <strong>EskiTasarim.tsx</strong> dosyasından kopyalayıp tam buraya yapıştırmalısın.</p>
    </div>
  );
}
