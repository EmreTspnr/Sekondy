import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import AdDetail from './pages/AdDetail';
import PostAd from './pages/PostAd';
import Messages from './pages/Messages';
import AdminDashboard from './pages/AdminDashboard';

/* NOT: Eski 86 KB'lık devasa kod "EskiTasarim.tsx" olarak kaydedildi. */

function App() {
  return (
    <BrowserRouter>
      {/* Geçici Basit Navbar - Sonraki tasarımlarda komponentlere taşınabilir */}
      <nav className="p-4 bg-gray-900 text-white flex flex-wrap gap-4 justify-center items-center shadow-md">
        <Link to="/" className="hover:text-yellow-400 font-bold px-3 py-1 rounded bg-gray-800">🏠 Vitrin (Sinan)</Link>
        <Link to="/auth" className="hover:text-yellow-400 font-bold px-3 py-1 rounded bg-gray-800">🔑 Giriş & Kayıt (Furkan)</Link>
        <Link to="/profile" className="hover:text-yellow-400 font-bold px-3 py-1 rounded bg-gray-800">👤 Profil (Furkan)</Link>
        <Link to="/ad/1" className="hover:text-yellow-400 font-bold px-3 py-1 rounded bg-gray-800">📄 İlan Detay (Emre)</Link>
        <Link to="/post-ad" className="hover:text-yellow-400 font-bold px-3 py-1 rounded bg-gray-800">➕ Yeni İlan (Emre)</Link>
        <Link to="/messages" className="hover:text-yellow-400 font-bold px-3 py-1 rounded bg-gray-800">✉️ Mesajlar (Ramize)</Link>
        <Link to="/admin" className="hover:text-yellow-400 font-bold px-3 py-1 rounded bg-gray-800">🛡️ Admin (Veysel)</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ad/:adId" element={<AdDetail />} />
        <Route path="/post-ad" element={<PostAd />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
