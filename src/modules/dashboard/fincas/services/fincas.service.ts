import { api } from '@/core/api/useConfigApi';
import { Finca, FincasResponse } from '../types/fincas.types';

export const fincasService = {
  obtenerFincas: async (): Promise<Finca[]> => {
    try {
      const response = await api.get<FincasResponse>('/api/v1/fincas');
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener fincas');
    }
  },
};

