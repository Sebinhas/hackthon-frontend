import { api } from '@/core/api/useConfigApi';
import { mockService } from '@/shared/mocks/mockService';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '@/core/types/auth.types';

// Cambiar a true para usar datos mockeados
const USE_MOCK = true;

export const authServices = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    if (USE_MOCK) {
      return mockService.login(credentials);
    }

    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    if (USE_MOCK) {
      return mockService.register(credentials);
    }

    try {
      const response = await api.post<AuthResponse>('/auth/register', credentials);
      return response.data;
    } catch (error: any) {
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

