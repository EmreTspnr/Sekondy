import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400 py-12 px-4 font-sans mt-auto border-t-[6px] border-[#D4AF37]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        
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

        {/* Sağ Sütun - Linkler */}
        <div className="md:border-l md:border-gray-800 md:pl-10 space-y-3">
          <h4 className="text-white font-bold tracking-widest text-sm mb-4">BAĞLANTILAR</h4>
          <ul className="space-y-3 text-sm font-semibold">
            <li><a href="/" className="hover:text-[#D4AF37] transition-colors">VİTRİN</a></li>
            <li><a href="/post-ad" className="hover:text-[#D4AF37] transition-colors">YENİ İLAN YÜKLE</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-800 text-xs font-semibold flex justify-center text-gray-500">
        <div>© 2026 Sekondy Inc. | Designed for the future of e-commerce.</div>
      </div>
    </footer>
  );
}
