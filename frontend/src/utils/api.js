// API URL Konfiguration
const API_URL = import.meta.env.VITE_API_URL || '';

// Axios Instanz mit Basis-URL
import axios from 'axios';

const api = axios.create({
  baseURL: API_URL,
});

// Request Interceptor für Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api; 