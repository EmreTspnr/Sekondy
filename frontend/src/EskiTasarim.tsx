/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, Heart, MapPin, User, PlusCircle, Menu, 
  Share2, MessageCircle, Phone, ShieldCheck, Flag, 
  ChevronRight, ChevronLeft, Eye, EyeOff, X,
  UploadCloud, Trash2, Edit, Image as ImageIcon, AlertCircle, CheckCircle2, MoreVertical,
  Bell, BellOff, SlidersHorizontal, ArrowDownUp, Clock, Send, Inbox, Mail, MailOpen,
  Users, UserPlus, UserMinus, Check, Star
} from 'lucide-react';

// --- MOCK DATA ---
const CATEGORIES = ['Real Estate', 'Vehicles', 'Electronics', 'Home & Garden', 'Fashion & Accessories', 'Sports & Leisure', 'Photography', 'Services', 'Spare Parts', 'Pets & Animals'];

const SHOWCASE_ADS = [
  { id: 1, title: '2019 BMW 320i M Sport - Low Mileage, Excellent Condition', price: '$32,500', location: 'Los Angeles, CA', image: 'https://picsum.photos/seed/bmw/400/300', isFavorite: false },
  { id: 2, title: 'iPhone 14 Pro Max 256GB Deep Purple - Unlocked', price: '$850', location: 'New York, NY', image: 'https://picsum.photos/seed/iphone/400/300', isFavorite: true },
  { id: 3, title: 'Modern 2BR Apartment with Sea View in Downtown', price: '$2,400/mo', location: 'Miami, FL', image: 'https://picsum.photos/seed/apartment/400/300', isFavorite: false },
  { id: 4, title: 'Sony A7III Mirrorless Camera Body Only', price: '$1,200', location: 'Austin, TX', image: 'https://picsum.photos/seed/camera/400/300', isFavorite: false },
];

const AD_DETAIL = {
  id: 1,
  title: '2019 BMW 320i M Sport - Low Mileage, Excellent Condition',
  price: '$32,500',
  location: 'Los Angeles, CA',
  datePosted: 'Oct 24, 2023',
  views: 1240,
  description: 'Selling my beloved BMW 320i M Sport. The car is in pristine condition, always garage-kept, and fully serviced at the official BMW dealership. No accidents, clean title in hand. Comes with premium sound system, leather seats, and the M Sport package which includes upgraded suspension and aerodynamics. Selling because I am upgrading to an SUV for the family.',
  images: [
    'https://picsum.photos/seed/bmw1/800/600',
    'https://picsum.photos/seed/bmw2/800/600',
    'https://picsum.photos/seed/bmw3/800/600',
    'https://picsum.photos/seed/bmw4/800/600',
    'https://picsum.photos/seed/bmw5/800/600',
  ],
  specs: {
    'Brand': 'BMW',
    'Series': '3 Series',
    'Model': '320i M Sport',
    'Year': '2019',
    'Mileage': '45,000 mi',
    'Transmission': 'Automatic',
    'Fuel Type': 'Gasoline',
    'Body Type': 'Sedan',
    'Color': 'Alpine White',
    'Engine Capacity': '1998 cc',
    'Drivetrain': 'RWD'
  },
  seller: {
    id: 'seller_1',
    name: 'Michael T.',
    memberSince: 'January 2021',
    phone: '+1 (555) 987-6543',
    avatar: 'https://picsum.photos/seed/user/100/100',
    listingsCount: 12,
    rating: 4.8
  }
};

// --- COMPONENTS ---

const SearchBar = ({ navigateTo, isMobile = false }: { navigateTo: (page: string) => void, isMobile?: boolean }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'iPhone 14 Pro Max',
    'BMW 3 Series Los Angeles',
    'Sony A7III'
  ]);

  const trendingCategories = [
    'Real Estate in Miami',
    'Used Cars under $10k'
  ];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, we would add to recent searches here
      if (!recentSearches.includes(searchQuery.trim())) {
        setRecentSearches([searchQuery.trim(), ...recentSearches].slice(0, 5));
      }
      setIsSearchFocused(false);
      navigateTo('category');
    }
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchQuery(term);
    setIsSearchFocused(false);
    navigateTo('category');
  };

  const handleClearRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    setRecentSearches(recentSearches.filter(s => s !== term));
  };

  return (
    <div className={`flex-1 max-w-3xl relative ${isMobile ? 'block' : 'hidden md:block mx-4'}`}>
      <form 
        onSubmit={handleSearchSubmit}
        className={`relative bg-gray-100 rounded-lg transition-all duration-200 ${isSearchFocused ? 'bg-white shadow-lg ring-1 ring-gray-200 rounded-b-none z-50' : ''}`}
      >
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for cars, phones, houses, and more..." 
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          className="w-full pl-10 pr-24 py-2.5 bg-transparent border-none outline-none text-sm"
        />
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <button 
          type="submit"
          className="absolute right-2 top-1.5 bg-black text-white px-4 py-1 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Search
        </button>
        
        {/* Recent Searches Dropdown */}
        {isSearchFocused && (
          <div className="absolute top-full left-0 w-full bg-white border border-gray-200 border-t-0 rounded-b-lg shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {recentSearches.length > 0 && (
              <div className="mb-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex justify-between items-center">
                  <span>Recent Searches</span>
                </div>
                {recentSearches.map((term, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleRecentSearchClick(term)}
                    className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Clock className="w-4 h-4 text-gray-400 group-hover:text-[#D4AF37] transition-colors" /> 
                      <span className="group-hover:text-black transition-colors">{term}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => handleClearRecentSearch(e, term)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      title="Remove from history"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="border-t border-gray-100 pt-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Trending Categories</div>
              {trendingCategories.map((cat, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleRecentSearchClick(cat)}
                  className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center gap-3 text-sm text-gray-700 group transition-colors"
                >
                  <Search className="w-4 h-4 text-gray-400 group-hover:text-[#D4AF37] transition-colors" /> 
                  <span className="group-hover:text-black transition-colors">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
      {/* Overlay to dim background when searching */}
      {isSearchFocused && (
        <div className="fixed inset-0 bg-black/20 z-40" style={{ top: isMobile ? '120px' : '64px' }} />
      )}
    </div>
  );
};

const Header = ({ navigateTo }: { navigateTo: (page: string) => void }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Universal Hamburger Icon (Left) */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-black hover:text-[#D4AF37] transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div 
            className="text-2xl md:text-3xl font-black tracking-tighter cursor-pointer"
            onClick={() => navigateTo('home')}
          >
            SEKOND<span className="text-[#D4AF37]">Y</span>
          </div>
        </div>
        
        {/* Desktop Search (Google-style) */}
        <SearchBar navigateTo={navigateTo} />

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-5">
          <button 
            onClick={() => navigateTo('favorites')}
            className="p-2 text-gray-600 hover:text-[#D4AF37] transition-colors relative"
            title="Favorites"
          >
            <Heart className="w-6 h-6" />
          </button>
          <button 
            onClick={() => navigateTo('messages')}
            className="p-2 text-gray-600 hover:text-[#D4AF37] transition-colors relative"
            title="Messages"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button 
            onClick={() => navigateTo('auth')}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#D4AF37] transition-colors ml-2"
          >
            <User className="w-5 h-5" /> Login
          </button>
          <button 
            onClick={() => navigateTo('post-ad')}
            className="bg-[#D4AF37] hover:bg-[#c19b2e] text-black font-bold py-2 px-5 rounded-lg flex items-center gap-2 transition-colors shadow-sm ml-2"
          >
            <PlusCircle className="w-5 h-5" /> 
            <span>Post Ad</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (Below Header) */}
      <div className="md:hidden border-t border-gray-100 bg-white p-3">
        <SearchBar navigateTo={navigateTo} isMobile={true} />
      </div>

      {/* Left Slide-out Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      >
        {/* Slide-over Panel (Left) */}
        <div 
          className={`absolute top-0 left-0 w-72 h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="text-xl font-black tracking-tighter">
              SEKOND<span className="text-[#D4AF37]">Y</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 -mr-2 text-gray-500 hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-2">
            <a href="#" onClick={(e) => { e.preventDefault(); setIsSidebarOpen(false); navigateTo('category'); }} className="block py-3 text-lg text-gray-800 font-medium hover:text-[#D4AF37] transition-colors border-b border-gray-50">
              Browse Categories
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); setIsSidebarOpen(false); navigateTo('saved-searches'); }} className="block py-3 text-lg text-gray-800 font-medium hover:text-[#D4AF37] transition-colors border-b border-gray-50">
              Saved Searches
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); setIsSidebarOpen(false); navigateTo('favorites'); }} className="block py-3 text-lg text-gray-800 font-medium hover:text-[#D4AF37] transition-colors border-b border-gray-50">
              Favorites
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); setIsSidebarOpen(false); navigateTo('messages'); }} className="block py-3 text-lg text-gray-800 font-medium hover:text-[#D4AF37] transition-colors border-b border-gray-50 flex items-center justify-between">
              <span>Messages</span>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">2</span>
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); setIsSidebarOpen(false); navigateTo('following-sellers'); }} className="block py-3 text-lg text-gray-800 font-medium hover:text-[#D4AF37] transition-colors border-b border-gray-50">
              Following Sellers
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); setIsSidebarOpen(false); navigateTo('my-listings'); }} className="block py-3 text-lg text-gray-800 font-medium hover:text-[#D4AF37] transition-colors border-b border-gray-50">
              Ilanlarim (My Listings)
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); setIsSidebarOpen(false); navigateTo('profile'); }} className="block py-3 text-lg text-gray-800 font-medium hover:text-[#D4AF37] transition-colors border-b border-gray-50">
              Profile
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

const HomePage = ({ navigateTo }: { navigateTo: (page: string) => void }) => {
  const [ads, setAds] = useState(SHOWCASE_ADS);

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setAds(ads.map(ad => ad.id === id ? { ...ad, isFavorite: !ad.isFavorite } : ad));
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
      <aside className="hidden md:block w-64 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sticky top-24">
          <h2 className="font-bold text-lg mb-4 text-black border-b border-gray-100 pb-2">Categories</h2>
          <ul className="space-y-1">
            {CATEGORIES.map(category => (
              <li key={category}>
                <a href="#" className="block px-2 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-md transition-colors">
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <div className="flex-1">
        <div className="flex justify-between items-end mb-4">
          <h2 className="font-bold text-xl md:text-2xl text-black">Showcase Ads</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {ads.map(ad => (
            <div 
              key={ad.id} 
              onClick={() => navigateTo('ad-detail')}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 relative group cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={ad.image} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                <button 
                  onClick={(e) => toggleFavorite(e, ad.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-sm transition-colors z-10"
                >
                  <Heart className={`w-5 h-5 ${ad.isFavorite ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-400 hover:text-red-500'}`} />
                </button>
              </div>
              <div className="p-3 flex flex-col flex-1">
                <div className="font-bold text-lg text-black mb-1">{ad.price}</div>
                <div className="text-sm text-gray-700 line-clamp-2 mb-3 flex-1 leading-snug">{ad.title}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-auto pt-2 border-t border-gray-50">
                  <MapPin className="w-3 h-3 flex-shrink-0" /> 
                  <span className="truncate">{ad.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

const AdDetailPage = ({ followedSellers = [], toggleFollowSeller = () => {} }: { followedSellers?: any[], toggleFollowSeller?: (seller: any) => void }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const isFollowing = followedSellers.some(s => s.id === AD_DETAIL.seller.id);

  const nextImage = () => setActiveImageIndex((prev) => (prev + 1) % AD_DETAIL.images.length);
  const prevImage = () => setActiveImageIndex((prev) => (prev - 1 + AD_DETAIL.images.length) % AD_DETAIL.images.length);

  // API Method: POST /messages
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    // Simulate API call
    setTimeout(() => {
      setMessageSent(true);
      setTimeout(() => {
        setShowMessageModal(false);
        setMessageSent(false);
        setMessageText('');
      }, 2000);
    }, 600);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
        <a href="#" className="hover:text-black">Home</a> <ChevronRight className="w-4 h-4" />
        <a href="#" className="hover:text-black">Vehicles</a> <ChevronRight className="w-4 h-4" />
        <a href="#" className="hover:text-black">Cars</a> <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium truncate">{AD_DETAIL.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* LEFT COLUMN: Gallery & Details */}
        <div className="flex-1 min-w-0">
          {/* Image Gallery (Req 8 & 10) */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="relative aspect-[4/3] sm:aspect-[16/9] bg-black flex items-center justify-center group">
              <img 
                src={AD_DETAIL.images[activeImageIndex]} 
                alt={`Ad image ${activeImageIndex + 1}`} 
                className="max-w-full max-h-full object-contain"
                referrerPolicy="no-referrer"
              />
              <button onClick={prevImage} className="absolute left-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft className="w-6 h-6 text-black" />
              </button>
              <button onClick={nextImage} className="absolute right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-6 h-6 text-black" />
              </button>
            </div>
            {/* Thumbnails */}
            <div className="flex overflow-x-auto gap-2 p-3 bg-gray-50 border-t border-gray-200">
              {AD_DETAIL.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-[#D4AF37] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Specifications Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
            <h3 className="text-xl font-bold text-black mb-4 border-b border-gray-100 pb-2">Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {Object.entries(AD_DETAIL.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between sm:justify-start sm:gap-4 border-b border-gray-50 pb-2">
                  <span className="text-gray-500 w-1/2">{key}</span>
                  <span className="text-black font-medium w-1/2 text-right sm:text-left">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
            <h3 className="text-xl font-bold text-black mb-4 border-b border-gray-100 pb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {AD_DETAIL.description}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Price, Actions, Seller Info */}
        <div className="w-full lg:w-[380px] flex-shrink-0 flex flex-col gap-4">
          
          {/* Price & Title Card (Req 10) */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h1 className="text-4xl font-black text-black mb-2">{AD_DETAIL.price}</h1>
            <h2 className="text-lg text-gray-800 font-medium leading-snug mb-4">{AD_DETAIL.title}</h2>
            
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-6 pb-4 border-b border-gray-100">
              <MapPin className="w-4 h-4" />
              <span>{AD_DETAIL.location}</span>
            </div>

            {/* Action Buttons (Req 20) */}
            <div className="flex gap-3">
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border font-semibold transition-colors ${isFavorite ? 'border-[#D4AF37] text-[#D4AF37] bg-yellow-50' : 'border-gray-300 text-gray-700 hover:border-black hover:text-black'}`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#D4AF37]' : ''}`} />
                {isFavorite ? 'Saved' : 'Favorite'}
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:border-black hover:text-black transition-colors">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
            
            <div className="flex justify-between text-xs text-gray-400 mt-4">
              <span>Ad ID: 987654321</span>
              <span>{AD_DETAIL.views} Views</span>
            </div>
          </div>

          {/* Seller Info Card (Req 19) */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-black mb-4">Seller Information</h3>
            <div className="flex items-center justify-between gap-2 mb-6">
              <div className="flex items-center gap-4">
                <img src={AD_DETAIL.seller.avatar} alt={AD_DETAIL.seller.name} className="w-16 h-16 rounded-full object-cover border border-gray-200" referrerPolicy="no-referrer" />
                <div>
                  <div className="font-bold text-lg text-black">{AD_DETAIL.seller.name}</div>
                  <div className="text-sm text-gray-500">Member since {AD_DETAIL.seller.memberSince}</div>
                </div>
              </div>
              <button 
                onClick={() => toggleFollowSeller(AD_DETAIL.seller)}
                className={`group font-bold py-1.5 px-4 rounded-lg text-sm transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 w-28 ${isFollowing ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200' : 'text-[#D4AF37] border-2 border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black'}`}
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="w-4 h-4 hidden group-hover:block" />
                    <Check className="w-4 h-4 group-hover:hidden" />
                    <span className="group-hover:hidden">Following</span>
                    <span className="hidden group-hover:inline">Unfollow</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Follow
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setShowMessageModal(true)}
                className="w-full bg-[#D4AF37] hover:bg-[#c19b2e] text-black font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle className="w-5 h-5" />
                Send Message
              </button>
              
              <button 
                onClick={() => setShowPhone(true)}
                className="w-full bg-white border-2 border-black text-black font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <Phone className="w-5 h-5" />
                {showPhone ? AD_DETAIL.seller.phone : 'Show Phone Number'}
              </button>
            </div>
          </div>

          {/* Safety Tips */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 text-black font-bold mb-2">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              Safety Tips
            </div>
            <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
              <li>Meet in a safe, public place.</li>
              <li>Don't pay in advance before seeing the item.</li>
              <li>Beware of unrealistic offers.</li>
            </ul>
          </div>

          {/* Report Ad (Req 25) */}
          <button className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors mt-2">
            <Flag className="w-4 h-4" />
            Report this ad
          </button>

        </div>
      </div>

      {/* Send Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Contact Seller</h3>
              <button 
                onClick={() => { setShowMessageModal(false); setMessageSent(false); setMessageText(''); }} 
                className="text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {messageSent ? (
              <div className="py-8 text-center animate-in fade-in slide-in-from-bottom-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h4>
                <p className="text-gray-500">The seller will get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage}>
                <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center gap-3">
                  <img src={AD_DETAIL.images[0]} alt="Ad thumbnail" className="w-12 h-12 rounded object-cover" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Regarding</p>
                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{AD_DETAIL.title}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                  <textarea 
                    required
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Hi, is this still available? I'm interested..."
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all min-h-[120px] resize-y"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowMessageModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={!messageText.trim()}
                    className="flex-1 px-4 py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#c19b2e] transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

const AuthPage = ({ navigateTo }: { navigateTo: (page: string) => void }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans text-gray-900">
      {/* Brand Logo */}
      <div 
        className="text-4xl font-black tracking-tighter cursor-pointer mb-8"
        onClick={() => navigateTo('home')}
      >
        SEKOND<span className="text-[#D4AF37]">Y</span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200">
          <button 
            className={`flex-1 py-4 text-center font-bold text-lg transition-colors ${activeTab === 'login' ? 'text-black border-b-2 border-[#D4AF37]' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button 
            className={`flex-1 py-4 text-center font-bold text-lg transition-colors ${activeTab === 'register' ? 'text-black border-b-2 border-[#D4AF37]' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-black mb-6">
            {activeTab === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {activeTab === 'register' && (
              <div className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 outline-none transition-all"
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 outline-none transition-all"
                  />
                </div>
                <div>
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 outline-none transition-all"
                  />
                </div>
              </div>
            )}
            
            <div>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 outline-none transition-all"
              />
            </div>
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 outline-none transition-all pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {activeTab === 'login' && (
              <div className="flex justify-start">
                <a href="#" className="text-sm font-semibold text-[#D4AF37] hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <div className="pt-2 space-y-3">
              <button className="w-full bg-[#D4AF37] hover:bg-[#c19b2e] text-black font-bold py-3.5 rounded-lg transition-colors shadow-sm">
                {activeTab === 'login' ? 'Login' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 w-full">
      <h1 className="text-2xl font-bold text-black mb-6">Profile Settings</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Section 1: Personal Information */}
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-black mb-6">Personal Information</h2>
          
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Username (Disabled) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input 
                type="text" 
                disabled 
                value="etaspinar677" 
                className="w-full px-4 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-lg cursor-not-allowed"
              />
            </div>
            
            {/* Name Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  type="text" 
                  defaultValue="Emre" 
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  type="text" 
                  defaultValue="Taşpınar" 
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                defaultValue="+1 (555) 123-4567" 
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all"
              />
            </div>

            {/* Full Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
              <textarea 
                rows={3} 
                defaultValue="123 Main St, Apt 4B&#10;Los Angeles, CA 90001" 
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all resize-none"
              ></textarea>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button 
                type="submit" 
                className="bg-black text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <hr className="border-gray-100" />

        {/* Section 2: Danger Zone */}
        <div className="p-6 md:p-8 bg-gray-50/50">
          <h2 className="text-lg font-bold text-red-600 mb-2">Delete Account</h2>
          <p className="text-sm text-gray-600 mb-5 max-w-2xl">
            Once you delete your account, there is no going back. Please be certain. All your active ads, saved searches, and messages will be permanently removed from the Sekondy platform.
          </p>
          <button 
            type="button" 
            className="border-2 border-red-200 text-red-600 font-bold py-2.5 px-6 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
          >
            Delete My Account
          </button>
        </div>
      </div>
    </main>
  );
};

// --- NEW COMPONENTS FOR LISTINGS ---

const PhotoUploader = () => {
  const [images, setImages] = useState<string[]>([]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setImages([...images, `https://picsum.photos/seed/${Math.random()}/400/300`]);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Photos</label>
      <div 
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 hover:border-[#D4AF37] transition-colors cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => setImages([...images, `https://picsum.photos/seed/${Math.random()}/400/300`])}
      >
        <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-700">Click or drag photos to upload</p>
        <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
              <img src={img} alt="preview" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); setImages(images.filter((_, i) => i !== idx)); }}
                className="absolute top-2 right-2 p-1 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PostAdPage = ({ navigateTo, isEdit = false }: { navigateTo: (page: string) => void, isEdit?: boolean }) => {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">{isEdit ? 'Edit Listing' : 'Post New Ad'}</h1>
        <button onClick={() => navigateTo('my-listings')} className="text-sm text-gray-500 hover:text-black font-medium">
          Cancel
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form className="p-6 md:p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); navigateTo('my-listings'); }}>
          
          {/* Basic Info */}
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-black border-b border-gray-100 pb-2">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Listing Title <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                placeholder="e.g. iPhone 14 Pro Max 256GB"
                defaultValue={isEdit ? '2019 BMW 320i M Sport' : ''}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  required
                  placeholder="0.00"
                  defaultValue={isEdit ? 32500 : undefined}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                <select 
                  defaultValue={isEdit ? 'Vehicles' : ''}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all appearance-none"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="listingType" defaultChecked className="text-[#D4AF37] focus:ring-[#D4AF37]" />
                    <span className="text-sm text-gray-700">For Sale</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="listingType" className="text-[#D4AF37] focus:ring-[#D4AF37]" />
                    <span className="text-sm text-gray-700">For Rent</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select 
                  defaultValue={isEdit ? 'Used - Good' : 'New'}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all appearance-none"
                >
                  <option value="New">New</option>
                  <option value="Used - Like New">Used - Like New</option>
                  <option value="Used - Good">Used - Good</option>
                  <option value="Used - Fair">Used - Fair</option>
                </select>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-5 pt-4">
            <h2 className="text-lg font-bold text-black border-b border-gray-100 pb-2">Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
              <textarea 
                rows={5} 
                required
                placeholder="Describe your item in detail..."
                defaultValue={isEdit ? 'Selling my beloved BMW 320i M Sport...' : ''}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  required
                  placeholder="City, Neighborhood or Zip Code"
                  defaultValue={isEdit ? 'Los Angeles, CA' : ''}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-5 pt-4">
            <h2 className="text-lg font-bold text-black border-b border-gray-100 pb-2">Media</h2>
            <PhotoUploader />
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => navigateTo('my-listings')}
              className="px-6 py-3 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-[#D4AF37] hover:bg-[#c19b2e] text-black font-bold py-3 px-8 rounded-lg transition-colors shadow-sm"
            >
              {isEdit ? 'Save Changes' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

const MY_ADS = [
  { id: 101, title: '2019 BMW 320i M Sport - Low Mileage', price: '$32,500', status: 'active', views: 1240, image: 'https://picsum.photos/seed/bmw/400/300', date: 'Oct 24, 2023' },
  { id: 102, title: 'Sony A7III Mirrorless Camera Body Only', price: '$1,200', status: 'sold', views: 845, image: 'https://picsum.photos/seed/camera/400/300', date: 'Sep 12, 2023' },
  { id: 103, title: 'Modern 2BR Apartment with Sea View', price: '$2,400/mo', status: 'inactive', views: 320, image: 'https://picsum.photos/seed/apartment/400/300', date: 'Nov 01, 2023' },
];

const MyListingsDashboard = ({ navigateTo }: { navigateTo: (page: string) => void }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setSelectedAd(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    // Perform delete logic here
    setDeleteModalOpen(false);
    setSelectedAd(null);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black">My Listings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your active and past advertisements.</p>
        </div>
        <button 
          onClick={() => navigateTo('post-ad')}
          className="bg-[#D4AF37] hover:bg-[#c19b2e] text-black font-bold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap"
        >
          <PlusCircle className="w-5 h-5" /> 
          Post New Ad
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-6">Listing Details</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-center">Stats</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <div className="divide-y divide-gray-100">
          {MY_ADS.map(ad => (
            <div key={ad.id} className="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
              {/* Mobile: Top row with image and details */}
              <div className="col-span-6 flex items-center gap-4 w-full">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                  <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 truncate">{ad.title}</h3>
                  <div className="text-sm font-semibold text-[#D4AF37] mt-1">{ad.price}</div>
                  <div className="text-xs text-gray-500 mt-1">Posted on {ad.date}</div>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2 flex justify-between md:justify-center items-center w-full md:w-auto">
                <span className="md:hidden text-xs font-medium text-gray-500">Status:</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  ad.status === 'active' ? 'bg-green-100 text-green-700' :
                  ad.status === 'sold' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                </span>
              </div>

              {/* Stats */}
              <div className="col-span-2 flex justify-between md:justify-center items-center w-full md:w-auto">
                <span className="md:hidden text-xs font-medium text-gray-500">Views:</span>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Eye className="w-4 h-4" /> {ad.views}
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-2 flex justify-end items-center gap-2 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-0 border-gray-100">
                <button 
                  onClick={() => navigateTo('edit-ad')}
                  className="p-2 text-gray-500 hover:text-black hover:bg-gray-200 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDeleteClick(ad.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Listing</h3>
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to delete this listing? This action cannot be undone and the ad will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

// --- SAVED SEARCHES & CATEGORY COMPONENTS ---

const SAVED_SEARCHES = [
  { id: 1, name: 'BMW 3 Series in LA', query: 'BMW 320i', location: 'Los Angeles, CA', filters: 'Year: 2018+, Price: < $35k', notifications: true },
  { id: 2, name: 'Downtown Apartments', query: '2BR Apartment', location: 'Miami, FL', filters: 'Rent, Price: < $3k/mo', notifications: false },
];

const SavedSearchesDashboard = ({ navigateTo }: { navigateTo: (page: string) => void }) => {
  const [searches, setSearches] = useState(SAVED_SEARCHES);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSearch, setSelectedSearch] = useState<number | null>(null);

  // API Method: PUT /saved-searches/{searchId}/notifications
  const toggleNotification = (id: number) => {
    setSearches(searches.map(s => s.id === id ? { ...s, notifications: !s.notifications } : s));
  };

  const handleDeleteClick = (id: number) => {
    setSelectedSearch(id);
    setDeleteModalOpen(true);
  };

  // API Method: DELETE /saved-searches/{searchId}
  const confirmDelete = () => {
    setSearches(searches.filter(s => s.id !== selectedSearch));
    setDeleteModalOpen(false);
    setSelectedSearch(null);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Saved Searches</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your saved searches and email notifications.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-5">Search Details</div>
          <div className="col-span-3">Filters</div>
          <div className="col-span-2 text-center">Notifications</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <div className="divide-y divide-gray-100">
          {searches.length === 0 ? (
            <div className="p-8 text-center text-gray-500">You have no saved searches.</div>
          ) : searches.map(search => (
            <div key={search.id} className="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
              <div className="col-span-5 w-full">
                <h3 className="text-base font-bold text-gray-900">{search.name}</h3>
                <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <Search className="w-3.5 h-3.5" /> {search.query}
                </div>
                <div className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {search.location}
                </div>
              </div>

              <div className="col-span-3 w-full md:w-auto mt-2 md:mt-0">
                <span className="md:hidden text-xs font-medium text-gray-500 block mb-1">Filters:</span>
                <span className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded-md">{search.filters}</span>
              </div>

              <div className="col-span-2 flex justify-between md:justify-center items-center w-full md:w-auto mt-3 md:mt-0">
                <span className="md:hidden text-xs font-medium text-gray-500">Notifications:</span>
                <button 
                  onClick={() => toggleNotification(search.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    search.notifications ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {search.notifications ? <><Bell className="w-3.5 h-3.5" /> On</> : <><BellOff className="w-3.5 h-3.5" /> Off</>}
                </button>
              </div>

              <div className="col-span-2 flex justify-end items-center gap-2 w-full md:w-auto mt-3 md:mt-0 pt-3 md:pt-0 border-t md:border-0 border-gray-100">
                <button 
                  onClick={() => navigateTo('category')}
                  className="p-2 text-gray-500 hover:text-black hover:bg-gray-200 rounded-lg transition-colors"
                  title="View Results"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDeleteClick(search.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Saved Search</h3>
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to delete this saved search? You will no longer receive notifications for it.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

const SaveSearchModal = ({ 
  isOpen, 
  onClose, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (name: string) => void;
}) => {
  const [searchName, setSearchName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchName.trim()) {
      onSave(searchName);
      setSearchName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Save Search</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Name</label>
            <input 
              type="text" 
              required
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="e.g., Cheap Cars in Miami"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">We'll notify you when new listings match this search.</p>
          </div>
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!searchName.trim()}
              className="flex-1 px-4 py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#c19b2e] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CategoryListingsPage = ({ navigateTo }: { navigateTo: (page: string) => void }) => {
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // API Method: POST /saved-searches
  const handleSaveSearch = (name: string) => {
    console.log(`Saving search: ${name}`);
    setSaveModalOpen(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 w-full">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span className="hover:text-black cursor-pointer" onClick={() => navigateTo('home')}>Home</span>
        <ChevronRight className="w-4 h-4" />
        <span className="hover:text-black cursor-pointer">Vehicles</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-black font-semibold">Cars</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </h3>
              <button className="text-xs text-[#D4AF37] font-semibold hover:underline">Clear</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#D4AF37] outline-none" />
                  <span className="text-gray-400">-</span>
                  <input type="number" placeholder="Max" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#D4AF37] outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <div className="space-y-2">
                  {['New', 'Used - Like New', 'Used - Good'].map(cond => (
                    <label key={cond} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-[#D4AF37] focus:ring-[#D4AF37]" />
                      <span className="text-sm text-gray-600">{cond}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Cars for Sale</h1>
              <p className="text-sm text-gray-500">Showing 1-24 of 1,240 results</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSaveModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-[#D4AF37] text-[#D4AF37] font-bold rounded-lg hover:bg-[#D4AF37] hover:text-black transition-colors text-sm"
              >
                <Heart className="w-4 h-4" /> Save Search
              </button>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                <ArrowDownUp className="w-4 h-4 text-gray-500" />
                <select className="bg-transparent text-sm font-medium text-gray-700 outline-none appearance-none pr-4">
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Success Toast */}
          {showSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium">Search saved successfully! We'll notify you of new matches.</p>
            </div>
          )}

          {/* Grid - API Method: GET /categories/{categoryId}/listings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SHOWCASE_ADS.map(ad => (
              <div key={ad.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer" onClick={() => navigateTo('ad-detail')}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={ad.image} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button 
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm z-10"
                    onClick={(e) => { e.stopPropagation(); /* toggle favorite */ }}
                  >
                    <Heart className={`w-5 h-5 ${ad.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-md text-sm font-bold">
                    {ad.price}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#D4AF37] transition-colors">{ad.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{ad.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Search Modal */}
      <SaveSearchModal 
        isOpen={saveModalOpen} 
        onClose={() => setSaveModalOpen(false)} 
        onSave={handleSaveSearch} 
      />
    </main>
  );
};

// --- FAVORITES & MESSAGES COMPONENTS ---

const FavoritesPage = ({ navigateTo }: { navigateTo: (page: string) => void }) => {
  // API Method: GET /favorites
  const favoriteAds = SHOWCASE_ADS.filter(ad => ad.isFavorite);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black flex items-center gap-2">
          <Heart className="w-6 h-6 fill-[#D4AF37] text-[#D4AF37]" /> My Favorites
        </h1>
        <p className="text-sm text-gray-500 mt-1">Listings you have saved for later.</p>
      </div>

      {favoriteAds.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">You haven't saved any listings to your favorites. Browse categories to find what you're looking for.</p>
          <button 
            onClick={() => navigateTo('category')}
            className="bg-black text-white font-bold py-2.5 px-6 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Browse Listings
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteAds.map(ad => (
            <div key={ad.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer" onClick={() => navigateTo('ad-detail')}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={ad.image} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button 
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm z-10"
                  onClick={(e) => { e.stopPropagation(); /* toggle favorite */ }}
                >
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                </button>
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-md text-sm font-bold">
                  {ad.price}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#D4AF37] transition-colors">{ad.title}</h3>
                <div className="flex items-center text-sm text-gray-500 gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{ad.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

const MOCK_MESSAGES = [
  { id: 1, sender: 'Alice Smith', avatar: 'https://picsum.photos/seed/alice/100/100', listing: 'iPhone 14 Pro Max 256GB', preview: 'Hi, is this still available? I can pick it up today.', date: '10:30 AM', unread: true },
  { id: 2, sender: 'Bob Jones', avatar: 'https://picsum.photos/seed/bob/100/100', listing: '2019 BMW 320i M Sport', preview: 'Would you be willing to negotiate on the price?', date: 'Yesterday', unread: true },
  { id: 3, sender: 'Sarah Connor', avatar: 'https://picsum.photos/seed/sarah/100/100', listing: 'Modern 2BR Apartment', preview: 'Thanks for the tour! I will send the application.', date: 'Oct 24', unread: false },
];

const MessagesInboxPage = ({ navigateTo }: { navigateTo: (page: string) => void }) => {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);

  // API Method: PUT /messages/{messageId}/read
  const markAsRead = (id: number) => {
    setMessages(messages.map(m => m.id === id ? { ...m, unread: false } : m));
  };

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSelectedMessage(id);
    setDeleteModalOpen(true);
  };

  // API Method: DELETE /messages/{messageId}
  const confirmDelete = () => {
    setMessages(messages.filter(m => m.id !== selectedMessage));
    setDeleteModalOpen(false);
    setSelectedMessage(null);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-2">
            <Inbox className="w-6 h-6" /> Inbox
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your conversations with buyers and sellers.</p>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search messages..." 
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all text-sm"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No messages</h3>
            <p className="text-gray-500">You don't have any conversations yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                onClick={() => markAsRead(msg.id)}
                className={`flex items-start gap-4 p-4 sm:p-5 cursor-pointer transition-colors hover:bg-gray-50 ${msg.unread ? 'bg-blue-50/30' : ''}`}
              >
                <div className="relative flex-shrink-0">
                  <img src={msg.avatar} alt={msg.sender} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                  {msg.unread && <span className="absolute top-0 right-0 w-3 h-3 bg-blue-500 border-2 border-white rounded-full"></span>}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-sm truncate pr-4 ${msg.unread ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                      {msg.sender}
                    </h4>
                    <span className={`text-xs whitespace-nowrap ${msg.unread ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
                      {msg.date}
                    </span>
                  </div>
                  
                  <div className="text-xs font-medium text-[#D4AF37] mb-1 truncate">
                    Regarding: {msg.listing}
                  </div>
                  
                  <p className={`text-sm truncate ${msg.unread ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                    {msg.preview}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <button 
                    onClick={(e) => handleDeleteClick(e, msg.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                    title="Delete Conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Message</h3>
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to delete this conversation? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

const FollowingSellersPage = ({ navigateTo, followedSellers, toggleFollowSeller }: { navigateTo: (page: string) => void, followedSellers: any[], toggleFollowSeller: (seller: any) => void }) => {
  const [unfollowModalOpen, setUnfollowModalOpen] = useState(false);
  const [sellerToUnfollow, setSellerToUnfollow] = useState<any>(null);

  const confirmUnfollow = () => {
    if (sellerToUnfollow) {
      toggleFollowSeller(sellerToUnfollow);
      setUnfollowModalOpen(false);
      setSellerToUnfollow(null);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black flex items-center gap-2">
          <Users className="w-6 h-6 text-[#D4AF37]" /> Following Sellers
        </h1>
        <p className="text-sm text-gray-500 mt-1">Keep track of your favorite sellers and their latest listings.</p>
      </div>

      {followedSellers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Not following anyone yet</h3>
          <p className="text-gray-500 mb-6">When you follow sellers, you'll see them listed here.</p>
          <button 
            onClick={() => navigateTo('home')}
            className="bg-black text-white font-bold py-2.5 px-6 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Browse Ads
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {followedSellers.map(seller => (
            <div key={seller.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img src={seller.avatar} alt={seller.name} className="w-16 h-16 rounded-full object-cover border border-gray-200" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 truncate">{seller.name}</h3>
                <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" /> {seller.rating || '4.8'}</span>
                  <span>•</span>
                  <span>{seller.listingsCount || '12'} Active Ads</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">Member since {seller.memberSince}</div>
              </div>
              <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                <button 
                  className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm text-center"
                >
                  View Profile
                </button>
                <button 
                  onClick={() => { setSellerToUnfollow(seller); setUnfollowModalOpen(true); }}
                  className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-sm text-center"
                >
                  Unfollow
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Unfollow Confirmation Modal */}
      {unfollowModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Unfollow Seller?</h3>
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to unfollow <strong>{sellerToUnfollow?.name}</strong>? You will no longer see them in your followed sellers list.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => { setUnfollowModalOpen(false); setSellerToUnfollow(null); }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmUnfollow}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Unfollow
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [followedSellers, setFollowedSellers] = useState<any[]>([]);

  const toggleFollowSeller = (seller: any) => {
    if (followedSellers.some(s => s.id === seller.id)) {
      setFollowedSellers(followedSellers.filter(s => s.id !== seller.id));
    } else {
      setFollowedSellers([...followedSellers, seller]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {currentRoute !== 'auth' && <Header navigateTo={setCurrentRoute} />}
      
      {currentRoute === 'home' && <HomePage navigateTo={setCurrentRoute} />}
      {currentRoute === 'ad-detail' && <AdDetailPage followedSellers={followedSellers} toggleFollowSeller={toggleFollowSeller} />}
      {currentRoute === 'auth' && <AuthPage navigateTo={setCurrentRoute} />}
      {currentRoute === 'profile' && <ProfilePage />}
      {currentRoute === 'post-ad' && <PostAdPage navigateTo={setCurrentRoute} isEdit={false} />}
      {currentRoute === 'edit-ad' && <PostAdPage navigateTo={setCurrentRoute} isEdit={true} />}
      {currentRoute === 'my-listings' && <MyListingsDashboard navigateTo={setCurrentRoute} />}
      {currentRoute === 'saved-searches' && <SavedSearchesDashboard navigateTo={setCurrentRoute} />}
      {currentRoute === 'category' && <CategoryListingsPage navigateTo={setCurrentRoute} />}
      {currentRoute === 'favorites' && <FavoritesPage navigateTo={setCurrentRoute} />}
      {currentRoute === 'messages' && <MessagesInboxPage navigateTo={setCurrentRoute} />}
      {currentRoute === 'following-sellers' && <FollowingSellersPage navigateTo={setCurrentRoute} followedSellers={followedSellers} toggleFollowSeller={toggleFollowSeller} />}
    </div>
  );
}
