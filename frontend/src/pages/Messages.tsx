import React, { useState, useEffect } from 'react';
import api from '../services/api';



export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Mesajları çek
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get('/messages');
        setMessages(response.data);
      } catch (error) { }
    };
    fetchMessages();
  }, []);

  // Favorileri çek
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get('/favorites');
        setFavorites(response.data);
      } catch (error) { }
    };
    fetchFavorites();
  }, []);

  const handleDeleteMessage = async (msgId) => {
    try {
      await api.delete(`/messages/${msgId}`);
      // Lojik: messages.filter ile state'den de sil ki ekrandan gitsin
    } catch (error) { }
  };

  return (
    <div className="p-8 text-center bg-pink-50 border-2 border-pink-200 mt-10 max-w-lg mx-auto rounded-lg">
      <h1 className="text-2xl font-bold mb-4">GÖREVLİ: RAMİZE ELİF ERMİŞ</h1>
      <p>Mesajlarım Kutusu tasarımı ve Favori sayfalarının dizaynı senin sorumluluğunda.</p>
    </div>
  );
}
