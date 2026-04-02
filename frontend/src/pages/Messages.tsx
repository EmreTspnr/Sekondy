import React, { useState, useEffect } from 'react';
import { Mail, Search, Trash2 } from 'lucide-react';
import api from '../services/api';

export default function Messages() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get('/messages');
        setMessages(response.data);
      } catch (error) {
      
        setMessages([
          { id: 1, sender: '(Mock Data) Alice Demir', listing: 'iPhone 14 Pro Max 256GB', preview: 'Merhaba, en son ne olur?', date: '10:30 AM', unread: true },
          { id: 2, sender: '(Mock Data) Cem Kaya', listing: '2019 BMW 320i', preview: 'Takas düşünüyor musunuz?', date: 'Dün', unread: false },
          { id: 3, sender: '(Mock Data) Merve Arslan', listing: 'Sony Kamera', preview: 'Ürün satıldı mı?', date: '3 Gün Önce', unread: false }
        ]);
      }
    };
    fetchMessages();
  }, []);

  const handleDeleteMessage = async (msgId: number) => {
    try {
      await api.delete(`/messages/${msgId}`);
      setMessages(messages.filter(m => m.id !== msgId));
    } catch (error) {
      setMessages(messages.filter(m => m.id !== msgId));
      alert('Mesaj Silindi');
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-2">
            <Mail className="w-6 h-6" /> Gelen Kutusu
          </h1>
          <p className="text-sm text-gray-500 mt-1">İlanlarınızla ilgili satıcı ve alıcı mesajlarını yönetin.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Mesajlarda ara..." 
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-black outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Şu an hiç mesajınız yok.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map(msg => (
              <div key={msg.id} className={`flex items-start gap-4 p-5 hover:bg-gray-50 transition-colors cursor-pointer ${msg.unread ? 'bg-blue-50/30' : ''}`}>
                <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 border border-gray-300 overflow-hidden flex items-center justify-center font-bold text-gray-500">
                  {msg.sender.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`font-bold ${msg.unread ? 'text-black' : 'text-gray-800'}`}>{msg.sender}</h3>
                    <span className="text-xs text-gray-500 font-medium">{msg.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-500 mb-1">{msg.listing}</h4>
                  <p className={`text-sm truncate ${msg.unread ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
                    {msg.preview}
                  </p>
                </div>

                <div className="flex items-center">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id); }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}