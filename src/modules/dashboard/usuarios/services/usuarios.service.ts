import { api } from '@/core/api/useConfigApi';
import { mockService } from '@/shared/mocks/mockService';
import { Usuario, UsuarioPayload } from '../types/usuarios.types';

// Cambiar a true para usar datos mockeados
const USE_MOCK = true;

export const usuariosService = {
  obtenerUsuarios: async (): Promise<Usuario[]> => {
    if (USE_MOCK) {
      return mockService.obtenerUsuarios();
    }

    try {
      const response = await api.get<Usuario[]>('/users');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuarios');
    }
  },

  obtenerUsuario: async (id: string): Promise<Usuario> => {
    if (USE_MOCK) {
      return mockService.obtenerUsuario(id);
    }

    try {
      const response = await api.get<Usuario>(`/users/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuario');
    }
  },

  crearUsuario: async (payload: UsuarioPayload): Promise<Usuario> => {
    if (USE_MOCK) {
      return mockService.crearUsuario(payload);
    }

    try {
      const response = await api.post<Usuario>('/users', payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear usuario');
    }
  },

  actualizarUsuario: async (id: string, payload: Partial<UsuarioPayload>): Promise<Usuario> => {
    if (USE_MOCK) {
      return mockService.actualizarUsuario(id, payload);
    }

    try {
      const response = await api.patch<Usuario>(`/users/${id}`, payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar usuario');
    }
  },

  eliminarUsuario: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      return mockService.eliminarUsuario(id);
    }

    try {
      await api.delete(`/users/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar usuario');
    }
  },
};

