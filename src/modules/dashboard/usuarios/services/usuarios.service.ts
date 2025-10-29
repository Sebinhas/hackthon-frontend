import { api } from '@/core/api/useConfigApi';
import { Usuario, UsuarioPayload } from '../types/usuarios.types';

export const usuariosService = {
  obtenerUsuarios: async (): Promise<Usuario[]> => {
    try {
      const response = await api.get<Usuario[]>('/users');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuarios');
    }
  },

  obtenerUsuario: async (id: string): Promise<Usuario> => {
    try {
      const response = await api.get<Usuario>(`/users/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuario');
    }
  },

  crearUsuario: async (payload: UsuarioPayload): Promise<Usuario> => {
    try {
      const response = await api.post<Usuario>('/users', payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear usuario');
    }
  },

  actualizarUsuario: async (id: string, payload: Partial<UsuarioPayload>): Promise<Usuario> => {
    try {
      const response = await api.patch<Usuario>(`/users/${id}`, payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar usuario');
    }
  },

  eliminarUsuario: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar usuario');
    }
  },
};

