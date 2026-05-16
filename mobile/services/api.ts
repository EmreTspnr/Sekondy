import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fiziksel cihaz testi ve emülatör için bilgisayarın yerel IP adresi ve doğru port
const API_URL = 'http://192.168.1.29:9000/v1';

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
    const token = await AsyncStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
export { API_URL };
