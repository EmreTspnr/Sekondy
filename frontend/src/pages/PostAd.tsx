import React, { useState } from 'react';
import { UploadCloud, X, MapPin } from 'lucide-react';
import api from '../services/api';

const CATEGORIES = ['Tümü', 'Vasıta', 'Emlak', 'Elektronik', 'Moda', 'Ev & Bahçe'];

export default function PostAd() {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setImages([...images, `https://picsum.photos/seed/${Math.random()}/400/300`]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/ads', {
        title, price, description, category, location, type: 'For Sale'
      });
      alert("İlanın yayına alındı! (Şu an bekliyor durumuna düştü)");
      window.location.href = '/';
    } catch (err) {
      alert("İlan yüklenirken hata oluştu!");
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 w-full mt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">Yeni İlan Ekle</h1>
        <button onClick={() => window.location.href='/'} className="text-sm text-gray-500 hover:text-black font-medium">İptal Et</button>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <form className="p-6 md:p-8 space-y-6" onSubmit={handleSubmit}>
          
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-black border-b border-gray-100 pb-2">Temel Bilgiler</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İlan Başlığı <span className="text-red-500">*</span></label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Örn: iPhone 14 Pro Max 256GB" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat ($) <span className="text-red-500">*</span></label>
                <input type="number" required value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori <span className="text-red-500">*</span></label>
                <select required value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all appearance-none">
                  <option value="">Bir kategori seçin</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-5 pt-4">
            <h2 className="text-lg font-bold text-black border-b border-gray-100 pb-2">Detaylar</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama <span className="text-red-500">*</span></label>
              <textarea rows={5} required value={description} onChange={e => setDescription(e.target.value)} placeholder="Ürünün özelliklerini detaylıca yazın..." className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all resize-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Konum <span className="text-red-500">*</span></label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input type="text" required value={location} onChange={e => setLocation(e.target.value)} placeholder="Şehir veya Mahalle" className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all" />
              </div>
            </div>
          </div>

          <div className="space-y-5 pt-4">
            <h2 className="text-lg font-bold text-black border-b border-gray-100 pb-2">Görseller</h2>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Fotoğraflar</label>
              <div onDragOver={e => e.preventDefault()} onDrop={handleDrop} onClick={() => setImages([...images, `https://picsum.photos/seed/${Math.random()}/400/300`])} className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 hover:border-[#D4AF37] transition-colors cursor-pointer">
                <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700">Yüklemek için tıklayın veya sürükleyin</p>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={e => { e.stopPropagation(); setImages(images.filter((_, i) => i !== idx)); }} className="absolute top-2 right-2 p-1 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <button type="submit" className="bg-[#D4AF37] hover:bg-[#c19b2e] text-black font-bold py-3 px-8 rounded-lg transition-colors shadow-md">İlanı Yayınla</button>
          </div>
        </form>
      </div>
    </main>
  );
}
