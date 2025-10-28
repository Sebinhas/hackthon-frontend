import { api } from '@/core/api/useConfigApi';
import { Finca, FincaPayload, FincasResponse } from '../types/fincas.types';

export const fincasService = {
  obtenerFincas: async (): Promise<Finca[]> => {
    try {
      const response = await api.get<FincasResponse>('/api/v1/fincas');
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener fincas');
    }
  },

  obtenerFinca: async (id: number): Promise<Finca> => {
    try {
      const response = await api.get<Finca>(`/api/v1/fincas/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener finca');
    }
  },

  crearFinca: async (payload: FincaPayload): Promise<Finca> => {
    try {
      const response = await api.post<Finca>('/api/v1/fincas', payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear finca');
    }
  },

  actualizarFinca: async (id: number, payload: Partial<FincaPayload>): Promise<Finca> => {
    try {
      const response = await api.patch<Finca>(`/api/v1/fincas/${id}`, payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar finca');
    }
  },

  eliminarFinca: async (id: number): Promise<void> => {
    try {
      await api.delete(`/api/v1/fincas/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar finca');
    }
  },
};

