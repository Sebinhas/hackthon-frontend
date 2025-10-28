import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Evita el warning de ngrok
  },
});

api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Marcar request de auth para evitar redirección en caso de error
  if (config.url?.includes('/auth/login') || config.url?.includes('/auth/register')) {
    config._isAuthRequest = true;
  }
  
  return config;
});

api.interceptors.response.use(
  (response: any) => {
    // Manejar respuesta de ngrok
    if (response.data) {
      return response;
    }
    return response;
  },
  (error: any) => {
    console.error('API Error:', error);
    
    // Solo redirigir si no es una petición de autenticación
    if (error.response?.status === 401 && !error.config?._isAuthRequest) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

