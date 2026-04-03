import React, { useState, useEffect } from 'react';
import { Mail, Search, Trash2, CheckCheck, Eye } from 'lucide-react';
import api from '../services/api';

export default function Messages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleMarkAsRead = async (msgId: string) => {
    try {
      await api.put(`/messages/${msgId}/read`);
      setMessages(messages.map(m => m._id === msgId ? { ...m, isRead: true } : m));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadMessages = messages.filter(m => !m.isRead);
    for (const msg of unreadMessages) {
      try {
        await api.put(`/messages/${msg._id}/read`);
      } catch {}
    }
    setMessages(messages.map(m => ({ ...m, isRead: true })));
  };

  const unreadCount = messages.filter(m => !m.isRead).length;
  const filteredMessages = messages.filter(m => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const senderName = m.sender ? `${m.sender.firstName} ${m.sender.lastName}`.toLowerCase() : '';
    return senderName.includes(term) || m.content?.toLowerCase().includes(term) || m.listing?.title?.toLowerCase().includes(term);
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-2">
            <Mail className="w-6 h-6" /> Gelen Kutusu
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount} yeni</span>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-1">İlanlarınızla ilgili satıcı ve alıcı mesajlarını yönetin.</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 text-sm font-bold text-[#D4AF37] hover:text-[#c19b2e] transition-colors whitespace-nowrap"
            >
              <CheckCheck className="w-4 h-4" /> Tümünü Okundu İşaretle
            </button>
          )}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Mesajlarda ara..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-black outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredMessages.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">{messages.length === 0 ? 'Şu an hiç mesajınız yok.' : 'Arama sonucu bulunamadı.'}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredMessages.map(msg => {
              const senderName = msg.sender ? `${msg.sender.firstName} ${msg.sender.lastName}` : 'Bilinmeyen Kullanıcı';
              const listingTitle = msg.listing?.title || 'Bilinmeyen İlan';
              const date = new Date(msg.createdAt).toLocaleDateString('tr-TR');

              return (
              <div 
                key={msg._id} 
                className={`flex items-start gap-4 p-5 hover:bg-gray-50 transition-colors ${!msg.isRead ? 'bg-blue-50/40 border-l-4 border-l-blue-500' : ''}`}
              >
                {/* Avatar + Okunmadı Noktası */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center font-bold text-gray-500">
                    {senderName.charAt(0)}
                  </div>
                  {!msg.isRead && (
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`font-bold ${!msg.isRead ? 'text-black' : 'text-gray-600'}`}>{senderName}</h3>
                    <span className="text-xs text-gray-500 font-medium">{date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-500 mb-1">{listingTitle}</h4>
                  <p className={`text-sm truncate ${!msg.isRead ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
                    {msg.content}
                  </p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {!msg.isRead && (
                    <button 
                      onClick={() => handleMarkAsRead(msg._id)}
                      className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Okundu İşaretle"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  )}
                  {msg.isRead && (
                    <span className="p-2 text-green-400" title="Okundu">
                      <CheckCheck className="w-5 h-5" />
                    </span>
                  )}
                  <button 
                    onClick={() => handleDeleteMessage(msg._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Mesajı Sil"
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