import { api } from '@/core/api/useConfigApi';
import { Coordenada } from '../types/lotes.types';

export interface CoordenadasResponse {
  status: number;
  message: string;
  data: Array<{
    punto_lote_id?: number;
    lote_id?: number;
    lat: string;
    lng: string;
    created_at?: string;
    updated_at?: string;
  }>;
}

export const coordenadasService = {
  obtenerCoordenadasPorLote: async (loteId: number | string): Promise<Coordenada[]> => {
    try {
      const response = await api.get<CoordenadasResponse>('/api/v1/coordenadas', {
        params: {
          lote: loteId,
        },
      });
      
      // Transformar respuesta a formato Coordenada[]
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data.map((punto) => ({
          lat: parseFloat(punto.lat),
          lng: parseFloat(punto.lng),
        }));
      }
      
      return [];
    } catch (error: any) {
      // Si el lote no tiene coordenadas, devolver array vacío en lugar de lanzar error
      if (error.response?.status === 404 || error.response?.status === 400) {
        console.warn(`No se encontraron coordenadas para el lote ${loteId}`);
        return [];
      }
      throw new Error(error.response?.data?.message || 'Error al obtener coordenadas');
    }
  },
};

