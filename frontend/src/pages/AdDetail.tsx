import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';


export default function AdDetail() {
  const { adId } = useParams();
  const [adInfo, setAdInfo] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/ads/${adId}`);
        setAdInfo(response.data);
      } catch (error) {
        console.error("Detay çekilemedi", error);
      }
    };
    if (adId) fetchDetail();
  }, [adId]);

  return (
    <div className="p-8 text-center bg-yellow-50 border-2 border-yellow-200 mt-10 max-w-lg mx-auto rounded-lg">
      <h1 className="text-2xl font-bold mb-4">GÖREVLİ: EMRE TAŞPINAR</h1>
      <p>Buraya kullanıcının bir ilana tıkladığında açılacak koca sayfa (resim kaydırmalı vs.) gelecek.</p>
      <p className="text-sm mt-2"><strong>EskiTasarim.tsx</strong> içindeki `AdDetailPage` buraya cuk oturacaktır.</p>
    </div>
  );
}
