import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

export default function Auth() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'login') {
      try {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        alert('Giriş Başarılı!');
        window.location.href = '/'; 
      } catch (err) {
        alert('Giriş Başarısız! Lütfen bilgilerinizi kontrol edin.');
      }
    } else {
      try {
        await api.post('/auth/register', { 
          firstName,
          lastName,
          email, 
          password, 
          phone
        });
        alert('Kayıt Başarılı! Şimdi giriş yapabilirsiniz.');
        setActiveTab('login');
      } catch (err) {
        alert('Kayıt sırasında bir hata oluştu!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 font-sans text-gray-900">
      <div className="cursor-pointer mb-8" onClick={() => window.location.href='/'}>
        <img src="/logo.png" alt="Sekondy Logo" className="h-12 md:h-16 object-contain" />
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
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

        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-black mb-6">
            {activeTab === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {activeTab === 'register' && (
              <div className="space-y-4">
                <div>
                  <input 
                    type="text" placeholder="First Name" required
                    value={firstName} onChange={e => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 outline-none transition-all"
                  />
                </div>
                <div>
                  <input 
                    type="text" placeholder="Last Name" required
                    value={lastName} onChange={e => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 outline-none transition-all"
                  />
                </div>
                <div>
                  <input 
                    type="tel" placeholder="Phone Number" required
                    value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 outline-none transition-all"
                  />
                </div>
              </div>
            )}
            
            <div>
              <input 
                type="email" placeholder="Email Address" required
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 outline-none transition-all"
              />
            </div>
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} placeholder="Password" required
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-[#D4AF37]/50 outline-none transition-all pr-12"
              />
              <button 
                type="button" onClick={() => setShowPassword(!showPassword)}
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
              <button type="submit" className="w-full bg-[#D4AF37] hover:bg-[#c19b2e] text-black font-bold py-3.5 rounded-lg transition-colors shadow-sm">
                {activeTab === 'login' ? 'Login' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}