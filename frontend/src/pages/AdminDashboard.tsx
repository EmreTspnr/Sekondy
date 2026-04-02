import React, { useState, useEffect } from 'react';
import api from '../services/api';

/* ==========================================
   GÖREVLİ: VEYSEL EMİR HARTAVİ
   GÖREV KAPSAMI: Şikayetler, İlan Onayı, Askıya Alma (Admin Dashboards)
   ==========================================
*/

export default function AdminDashboard() {
  const [pendingAds, setPendingAds] = useState([]);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const response = await api.get('/admin/ads/pending');
        setPendingAds(response.data);
      } catch (error) {}
    };
    fetchPending();
  }, []);

  // İlan Onaylama Metodu
  const handleApprove = async (adId) => {
    try {
      await api.put(`/admin/ads/${adId}/approve`);
      alert("İlan onaylandı!");
    } catch (error) {}
  };

  // İlan Silme Metodu
  const handleDeleteAd = async (adId) => {
    try {
      await api.delete(`/admin/ads/${adId}`);
      alert("Uygunsuz İlan tamamen silindi!");
    } catch (error) {}
  };

  return (
    <div className="p-8 text-center bg-purple-50 border-2 border-purple-200 mt-10 max-w-lg mx-auto rounded-lg">
      <h1 className="text-2xl font-bold mb-4">GÖREVLİ: VEYSEL EMİR HARTAVİ</h1>
      <p>Burası site yöneticisinin (Admin) gireceği ve gelen ilanları onaylayacağı kontrol paneli sayfası.</p>
      <p>Lütfen buraya havalı bir tablo ve "Onayla" ile "Reddet" butonları tasarla.</p>
    </div>
  );
}
