import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import AdDetail from './pages/AdDetail';
import PostAd from './pages/PostAd';
import Messages from './pages/Messages';
import AdminDashboard from './pages/AdminDashboard';
import MyAds from './pages/MyAds';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/ad/:adId" element={<AdDetail />} />
            <Route path="/post-ad" element={<PostAd />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/my-ads" element={<MyAds />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
