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
        console.error('Mesajlar alınırken hata oluştu', error);
      }
    };
    fetchMessages();
  }, []);

  const handleDeleteMessage = async (msgId: string) => {
    if(!window.confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/messages/${msgId}`);
      setMessages(messages.filter(m => m._id !== msgId));
    } catch (error) {
      alert('Mesaj Silinemedi');
    }
  };

  const handleMarkAsRead = async (msgId: string, isRead: boolean) => {
    if(isRead) return;
    try {
      await api.put(`/messages/${msgId}/read`);
      setMessages(messages.map(m => m._id === msgId ? { ...m, isRead: true } : m));
    } catch (error) {
      console.error(error);
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
            {messages.map(msg => {
              const senderName = msg.sender ? `${msg.sender.firstName} ${msg.sender.lastName}` : 'Bilinmeyen Kullanıcı';
              const listingTitle = msg.listing?.title || 'Bilinmeyen İlan';
              const date = new Date(msg.createdAt).toLocaleDateString('tr-TR');

              return (
              <div 
                key={msg._id} 
                onClick={() => handleMarkAsRead(msg._id, msg.isRead)}
                className={`flex items-start gap-4 p-5 hover:bg-gray-50 transition-colors cursor-pointer ${!msg.isRead ? 'bg-blue-50/30' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 border border-gray-300 overflow-hidden flex items-center justify-center font-bold text-gray-500">
                  {senderName.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`font-bold ${!msg.isRead ? 'text-black' : 'text-gray-800'}`}>{senderName}</h3>
                    <span className="text-xs text-gray-500 font-medium">{date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-500 mb-1">{listingTitle}</h4>
                  <p className={`text-sm truncate ${!msg.isRead ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
                    {msg.content}
                  </p>
                </div>

                <div className="flex items-center">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg._id); }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </main>
  );
}