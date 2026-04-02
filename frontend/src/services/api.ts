import axios from 'axios';

// Backend portumuz 9000 (app.js'te öyle görünüyor). Canlıya alınca VITE_API_URL çalışacak.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token'ı ekleyen uç (Furkan login işleminden sonra token'ı localStorage'a kaydetmeli)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`; // Furkan bu kısmı bağlayacak
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
