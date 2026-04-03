import React from 'react';
import { Phone, Mail, Clock, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth';
  };

  return (
    <header className="w-full flex flex-col font-sans border-b border-gray-100">
      {/* Top Bar - Dark */}
      <div className="bg-[#0a0a0a] text-gray-300 py-1.5 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors cursor-pointer">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" /> +90 555 123 4567
            </div>
            <div className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors cursor-pointer">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" /> info@sekondy.com
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Facebook className="w-4 h-4 hover:text-[#D4AF37] transition-colors cursor-pointer" />
            <Twitter className="w-4 h-4 hover:text-[#D4AF37] transition-colors cursor-pointer" />
            <Instagram className="w-4 h-4 hover:text-[#D4AF37] transition-colors cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Main Navigation - White */}
      <div className="bg-white px-4 py-4 md:py-5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Sekondy Logo" className="h-8 md:h-10 object-contain" />
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-bold text-gray-800">
            <Link to="/" className={`${isActive('/') ? 'text-[#D4AF37]' : 'hover:text-[#D4AF37]'} transition-colors`}>VİTRİN</Link>
            <Link to="/my-ads" className={`${isActive('/my-ads') ? 'text-[#D4AF37]' : 'hover:text-[#D4AF37]'} transition-colors`}>İLANLARIM</Link>
            <Link to="/messages" className={`${isActive('/messages') ? 'text-[#D4AF37]' : 'hover:text-[#D4AF37]'} transition-colors`}>MESAJLAR</Link>
            <Link to="/profile" className={`${isActive('/profile') ? 'text-[#D4AF37]' : 'hover:text-[#D4AF37]'} transition-colors`}>PROFİL</Link>
            <Link to="/admin" className={`${isActive('/admin') ? 'text-[#D4AF37]' : 'hover:text-[#D4AF37]'} transition-colors`}>YÖNETİM</Link>
            {!token ? (
              <Link to="/auth" className={`${isActive('/auth') ? 'text-[#D4AF37]' : 'hover:text-[#D4AF37]'} transition-colors`}>GİRİŞ YAP</Link>
            ) : (
              <button onClick={handleLogout} className="hover:text-red-500 font-bold transition-colors">ÇIKIŞ YAP</button>
            )}
          </nav>

          {/* Action Button */}
          <Link to="/post-ad" className="bg-black hover:bg-gray-800 text-white text-xs md:text-sm font-bold px-5 py-2.5 rounded transition-colors shadow">
            YENİ İLAN YÜKLE
          </Link>
        </div>
        
        {/* Mobile Nav (Simple flex wrap for very small screens) */}
        <nav className="md:hidden flex flex-wrap justify-center gap-4 mt-4 text-xs font-bold text-gray-800 border-t pt-3">
            <Link to="/">VİTRİN</Link>
            <Link to="/my-ads">İLANLARIM</Link>
            <Link to="/messages">MESAJLAR</Link>
            <Link to="/profile">PROFİL</Link>
            {!token ? (
              <Link to="/auth">GİRİŞ</Link>
            ) : (
              <button onClick={handleLogout} className="text-red-500 font-bold">ÇIKIŞ</button>
            )}
        </nav>
      </div>
    </header>
  );
}
