import { api } from '@/core/api/useConfigApi';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '@/core/types/auth.types';

// Cambiar a true para usar datos mockeados
const USE_MOCK = false;

export const authServices = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {


    try {
      const response = await api.post<AuthResponse>('/api/v1/auth/login', credentials);
      console.log('Login response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Error al iniciar sesión';
      throw new Error(errorMessage);
    }
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {


    try {
      const response = await api.post<AuthResponse>('/api/v1/auth/register', credentials);
      console.log('Register response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Error al registrarse');
    }
  },

  logout: async (): Promise<void> => {
    if (USE_MOCK) {
      return Promise.resolve();
    }

    try {
      await api.post('/auth/logout');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al cerrar sesión');
    }
  },
};

