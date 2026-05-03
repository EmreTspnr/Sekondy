import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Send, Check, CheckCheck, Trash2 } from 'lucide-react';
import api from '../services/api';

const WA_BG = "https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png";

export default function Messages() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Profil verisini çek
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/profile');
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Kullanıcı bilgisi alınamadı', error);
      }
    };
    fetchUser();
  }, []);

  // Mesajları çek
  const fetchMessages = async () => {
    if (!currentUser) return;
    try {
      const response = await api.get('/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Mesajlar alınırken hata oluştu', error);
    }
  };

  // Polling (5 saniyede bir otomatik güncelleme)
  useEffect(() => {
    if (currentUser) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  // Aktif sohbet değiştiğinde veya yeni mesaj geldiğinde en alta kaydır
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages, activeChatId]);

  // Mesajları kişilere göre grupla
  const chats = new Map<string, { partner: any, messages: any[], unreadCount: number }>();
  
  if (currentUser) {
    messages.forEach(msg => {
      let partner = null;
      // Gönderen ben isem karşı taraf receiver, değilse sender
      if (msg.sender?._id === currentUser._id) {
        partner = msg.receiver;
      } else {
        partner = msg.sender;
      }
      
      if (partner && partner._id) {
        const partnerId = partner._id;
        if (!chats.has(partnerId)) {
          chats.set(partnerId, { partner, messages: [], unreadCount: 0 });
        }
        
        const chat = chats.get(partnerId)!;
        chat.messages.push(msg);
        
        // Bana gelen okunmamış mesajları say
        if (!msg.isRead && msg.receiver?._id === currentUser._id) {
          chat.unreadCount += 1;
        }
      }
    });
  }

  // Sohbetleri son mesaj tarihine göre sırala
  const chatList = Array.from(chats.values()).sort((a, b) => {
    const lastA = a.messages[a.messages.length - 1];
    const lastB = b.messages[b.messages.length - 1];
    return new Date(lastB?.createdAt || 0).getTime() - new Date(lastA?.createdAt || 0).getTime();
  });

  const filteredChatList = chatList.filter(chat => {
    const partnerName = `${chat.partner.firstName} ${chat.partner.lastName}`.toLowerCase();
    return partnerName.includes(searchTerm.toLowerCase());
  });

  const activeChat = activeChatId ? chats.get(activeChatId) : null;

  // Sohbet Seçimi ve Okundu İşaretleme
  const handleChatSelect = async (partnerId: string) => {
    setActiveChatId(partnerId);
    const chat = chats.get(partnerId);
    if (chat) {
      const unreadMsgs = chat.messages.filter(m => !m.isRead && m.receiver?._id === currentUser._id);
      for (const m of unreadMsgs) {
        try {
          await api.put(`/messages/${m._id}/read`);
        } catch (e) {}
      }
      if (unreadMsgs.length > 0) fetchMessages();
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, partnerId: string) => {
    e.stopPropagation();
    if (!window.confirm("Bu sohbetteki tüm mesajları kalıcı olarak silmek istediğinize emin misiniz?")) return;

    const chat = chats.get(partnerId);
    if (!chat) return;

    try {
      // Backend'de toplu silme rotası olmadığından mesajlar tek tek Promise.all ile siliniyor.
      const promises = chat.messages.map(m => api.delete(`/messages/${m._id}`));
      await Promise.all(promises);
      
      if (activeChatId === partnerId) {
        setActiveChatId(null);
      }
      fetchMessages();
    } catch (error) {
      alert('Sohbet silinirken hata oluştu');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatId) return;

    try {
      await api.post('/messages', {
        receiverId: activeChatId,
        content: newMessage
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      alert('Mesaj gönderilemedi');
    }
  };

  if (!currentUser) {
    return <div className="h-[80vh] flex items-center justify-center text-gray-500">Yükleniyor...</div>;
  }

  return (
    <div className="h-[calc(100vh-80px)] w-full mx-auto max-w-7xl px-0 md:px-4 py-0 md:py-4 flex">
      <div className="flex w-full h-full bg-white md:rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* SOL TARAF: SOHBET LİSTESİ */}
        <div className={`${activeChatId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[380px] border-r border-gray-200 bg-white flex-shrink-0`}>
          {/* Sol Başlık */}
          <div className="h-16 px-4 bg-gray-100 flex items-center justify-between flex-shrink-0 border-b border-gray-200">
            <h1 className="font-bold text-gray-800 text-lg">Sohbetler</h1>
            <div className="flex gap-4 text-gray-500">
              <button><MoreVertical className="w-5 h-5" /></button>
            </div>
          </div>
          
          {/* Arama Kutusu */}
          <div className="p-2 bg-white border-b border-gray-100 flex-shrink-0">
            <div className="relative bg-gray-100 rounded-lg flex items-center px-3 h-9">
              <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Aratın veya yeni sohbet başlatın"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent outline-none px-4 text-sm text-gray-700"
              />
            </div>
          </div>

          {/* Kişi Listesi */}
          <div className="flex-1 overflow-y-auto">
            {filteredChatList.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-400">
                Hiç sohbet bulunamadı.
              </div>
            ) : (
              filteredChatList.map((chat) => {
                const partnerName = `${chat.partner.firstName || ''} ${chat.partner.lastName || ''}`.trim() || 'İsimsiz Kullanıcı';
                const lastMsg = chat.messages[chat.messages.length - 1];
                const date = new Date(lastMsg?.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
                const amISender = lastMsg?.sender?._id === currentUser._id;
                
                return (
                  <div 
                    key={chat.partner._id}
                    onClick={() => handleChatSelect(chat.partner._id)}
                    className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors border-b border-gray-50 ${activeChatId === chat.partner._id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden flex items-center justify-center font-bold text-gray-600 text-lg">
                      {partnerName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-semibold text-gray-800 text-base truncate">{partnerName}</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => handleDeleteChat(e, chat.partner._id)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-0.5"
                            title="Sohbeti Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <span className={`text-xs ${chat.unreadCount > 0 ? 'text-[#D4AF37] font-bold' : 'text-gray-500'}`}>{date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {amISender && (
                          <span className={`${lastMsg.isRead ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
                            <CheckCheck className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <p className="text-sm text-gray-500 truncate flex-1">{lastMsg?.content}</p>
                        {chat.unreadCount > 0 && (
                          <div className="w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                            {chat.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* SAĞ TARAF: SOHBET EKRANI */}
        <div className={`${!activeChatId ? 'hidden md:flex' : 'flex'} flex-col flex-1 bg-gray-50 relative`}>
          
          {activeChat ? (
            <>
              {/* Chat Başlığı */}
              <div className="h-16 px-4 bg-gray-100 flex items-center justify-between flex-shrink-0 relative z-10 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <button 
                    className="md:hidden p-1 mr-1 text-gray-500 hover:bg-gray-200 rounded"
                    onClick={() => setActiveChatId(null)}
                  >
                    ←
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">
                    {activeChat.partner.firstName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800">{activeChat.partner.firstName} {activeChat.partner.lastName}</h2>
                  </div>
                </div>
              </div>

              {/* Mesaj Bölgesi */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-16 md:px-[8%] py-4 relative z-10">
                <div className="flex flex-col gap-2 mb-2">
                  {/* Sistem Mesajı Tarih */}
                  <div className="flex justify-center mb-4">
                    <span className="bg-white/90 text-gray-500 text-xs px-3 py-1 rounded-md shadow-sm uppercase">Bugün</span>
                  </div>
                  
                  {activeChat.messages.map((msg, index) => {
                    const amISender = msg.sender?._id === currentUser._id;
                    const date = new Date(msg.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

                    return (
                      <div 
                        key={msg._id} 
                        className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${amISender ? 'self-end' : 'self-start'}`}
                      >
                        <div 
                          className={`relative px-3 pt-1.5 pb-2 rounded-lg shadow-sm ${amISender ? 'bg-[#D4AF37] text-white rounded-tr-sm' : 'bg-white border text-gray-800 border-gray-200 rounded-tl-sm'}`}
                        >
                          <span className="text-sm break-words leading-relaxed pr-8">
                            {msg.content}
                          </span>
                          <span className={`text-[10px] float-right mt-2 ml-3 flex items-center gap-1 ${amISender ? 'text-white/80' : 'text-gray-400'}`}>
                            {date}
                            {amISender && (
                              <CheckCheck className={`w-3.5 h-3.5 ${msg.isRead ? 'text-white' : 'text-white/50'}`} />
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Alt Mesaj Yazma Alanı */}
              <div className="h-16 px-4 bg-gray-100 flex items-center flex-shrink-0 relative z-10">
                <form onSubmit={handleSendMessage} className="w-full flex items-center">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Bir mesaj yazın"
                    className="flex-1 bg-white border border-gray-200 focus:border-[#D4AF37] h-10 px-4 rounded-lg outline-none text-sm transition-colors shadow-sm"
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className={`ml-3 p-2 rounded-lg flex-shrink-0 transition-colors ${newMessage.trim() ? 'bg-[#D4AF37] text-white hover:bg-[#c19b2e]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* Boş Durum (Sohbet Seçilmediğinde) */
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 relative z-10 p-8 border-b-[6px] border-[#D4AF37]">
              <div className="w-80 max-w-full">
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-2130362-1800926.png" alt="Empty" className="w-full opacity-60 mix-blend-multiply" />
              </div>
              <h2 className="text-3xl font-light text-gray-700 mt-8 mb-4">Sekondy Web</h2>
              <p className="text-gray-500 text-center text-sm md:max-w-[400px]">
                Mesaj göndermek veya almak için soldaki listeden bir sohbet seçin. Anlık olarak bilgilendirileceksiniz.
              </p>
              <div className="mt-8 text-xs text-gray-400 flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-300 rounded flex items-center justify-center"><Check className="w-2 h-2 text-white" /></div> 
                Uçtan uça korumalı
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}