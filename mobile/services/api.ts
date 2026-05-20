import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// İnternetteki canlı sunucuya bağlanır (Eğer .env tanımlanmadıysa)
// Yerel test için proje dizinine .env dosyası açıp EXPO_PUBLIC_API_URL=http://<pc-ip>:5000/v1 yazabilirsiniz
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.sekondy.com/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Her istekte token ekle
api.interceptors.request.use(
  async (config) => {
    console.log(`[DEBUG API] Interceptor başladı: ${config.url}`);
    try {
      const token = await AsyncStorage.getItem('token');
      console.log(`[DEBUG API] Token alındı: ${token ? 'Var' : 'Yok'}`);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('[DEBUG API] AsyncStorage hatası:', e);
    }
    console.log(`[DEBUG API] Interceptor tamamlandı, istek gidiyor`);
    return config;
  },
  (error) => {
    console.error('[DEBUG API] Interceptor hatası:', error);
    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
