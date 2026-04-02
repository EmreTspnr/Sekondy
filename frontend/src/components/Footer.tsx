import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400 py-12 px-4 font-sans mt-auto border-t-[6px] border-[#D4AF37]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
        
        {/* Sol Sütun - Hakkında */}
        <div className="space-y-4">
          <img src="/logo.png" alt="Sekondy Logo" className="h-8 md:h-10 object-contain mb-2 brightness-0 invert opacity-90" />
          <p className="text-sm leading-relaxed text-gray-400 text-balance">
            Sekondy, 2026 yılında kurulmuş yeni nesil bir ikinci el platformudur. 
            Güvenli, hızlı ve şeffaf bir e-ticaret deneyimi sunarak alıcı ve satıcıları 
            en modern altyapı ile bir araya getirmeyi hedefler. Öğrenci veya profesyonel, 
            aradığın her şey burada.
          </p>
        </div>

        {/* Orta Sütun - Linkler */}
        <div className="md:border-l md:border-gray-800 md:pl-10 space-y-3">
          <h4 className="text-white font-bold tracking-widest text-sm mb-4">BAĞLANTILAR</h4>
          <ul className="space-y-3 text-sm font-semibold">
            <li><a href="#" className="hover:text-[#D4AF37] transition-colors">VİTRİN</a></li>
            <li><a href="#" className="hover:text-[#D4AF37] transition-colors">YENİ İLAN YÜKLE</a></li>
            <li><a href="#" className="hover:text-[#D4AF37] transition-colors">KULLANIM KOŞULLARI</a></li>
            <li><a href="#" className="hover:text-[#D4AF37] transition-colors flex items-center gap-2">GİZLİLİK POLİTİKASI <span className="bg-[#D4AF37] text-black text-[10px] px-1.5 py-0.5 rounded font-black">YENİ</span></a></li>
            <li><a href="#" className="hover:text-[#D4AF37] transition-colors">YASAL UYARI</a></li>
          </ul>
        </div>

        {/* Sağ Sütun - Bülten */}
        <div className="space-y-4">
          <h4 className="text-[#D4AF37] font-bold text-sm tracking-widest mb-2 leading-snug">
            SEKONDY BÜLTENİNE KAYIT OLUN!
          </h4>
          <p className="text-sm font-medium text-gray-400 mb-4">
            Bilgilerinizi asla üçüncü şahıslarla paylaşmayız ve size spam göndermeyiz.
          </p>
          <form className="flex gap-2 h-10" onSubmit={e => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="E-posta adresiniz" 
              className="flex-1 bg-white px-3 text-black text-sm outline-none font-medium h-full"
            />
            <button 
              type="submit" 
              className="bg-[#D4AF37] hover:bg-[#c19b2e] text-black font-black px-6 h-full transition-colors flex-shrink-0"
            >
              KAYIT
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-800 text-xs font-semibold flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500">
        <div>© 2026 Sekondy Inc. | Designed for the future of e-commerce.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-300">TR</a>
          <a href="#" className="hover:text-gray-300">EN</a>
        </div>
      </div>
    </footer>
  );
}
