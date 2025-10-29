import { api } from '@/core/api/useConfigApi';
import { Lote, LotesResponse } from '../types/lotes.types';

export const lotesService = {
  obtenerLotes: async (fincaId?: number): Promise<Lote[]> => {
    try {
      const response = await api.get<LotesResponse>('/api/v1/lotes');
      // Filtrar lotes por fincaId
      
      if(fincaId){
      return response.data.data.filter((lote: Lote) => lote.fincaId === fincaId);
      }

      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener lotes');
    }
  },
};

