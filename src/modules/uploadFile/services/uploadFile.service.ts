import { api } from '@/core/api/useConfigApi';
import { CsvFile, CsvUploadResponse, CsvPreviewData, Finca, FincasResponse } from '../types/uploadFile.types';
import { LotesResponse, Lote } from '@/modules/dashboard/lotes/types/lotes.types';

export const uploadFileService = {
  subirArchivoCsv: async (file: File, fincaId?: number): Promise<CsvUploadResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (typeof fincaId === 'number') {
        formData.append('fincaId', String(fincaId));
      }

      const response = await api.post<CsvUploadResponse>('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al subir el archivo');
    }
  },

  obtenerArchivosCsv: async (): Promise<CsvFile[]> => {
    try {
      const response = await api.get<CsvFile[]>('/files');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener archivos');
    }
  },

  obtenerArchivoCsv: async (id: string): Promise<CsvFile> => {
    try {
      const response = await api.get<CsvFile>(`/files/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener archivo');
    }
  },

  obtenerPreviewArchivo: async (id: string): Promise<CsvPreviewData> => {
    try {
      const response = await api.get<CsvPreviewData>(`/files/${id}/preview`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener preview del archivo');
    }
  },

  eliminarArchivoCsv: async (id: string): Promise<void> => {
    try {
      await api.delete(`/files/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar archivo');
    }
  },

  obtenerFincas: async (): Promise<Finca[]> => {
    try {
      const response = await api.get<FincasResponse>('/api/v1/fincas');
      
      // El backend devuelve { status, message, data: Finca[] }
      if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      // Fallback si la estructura es diferente
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      throw new Error('Formato de respuesta de fincas inválido');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al obtener fincas';
      throw new Error(errorMessage);
    }
  },

  obtenerLotesCompletos: async (): Promise<Lote[]> => {
    try {
      const response = await api.get<LotesResponse>('/api/v1/lotes');
      
      // Extraer los lotes del formato de respuesta
      let todosLosLotes: Lote[] = [];
      
      if (response.data && 'data' in response.data && Array.isArray(response.data.data)) {
        todosLosLotes = response.data.data;
      } else if (Array.isArray(response.data)) {
        todosLosLotes = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        todosLosLotes = response.data.data;
      }
      
      return todosLosLotes;
    } catch (error: any) {
      console.error('Error en obtenerLotesCompletos:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al obtener lotes';
      throw new Error(errorMessage);
    }
  },

  obtenerLotesValidosPorFinca: async (fincaId: number): Promise<string[]> => {
    try {
      const response = await api.get<LotesResponse>('/api/v1/lotes');
      
      console.log('Respuesta completa de lotes:', response);
      console.log('Response.data:', response.data);
      
      // Extraer los lotes del formato de respuesta
      // Axios ya procesa la respuesta, así que response.data es el objeto directo
      let todosLosLotes: Lote[] = [];
      
      if (response.data && 'data' in response.data && Array.isArray(response.data.data)) {
        // Formato: { status, message, data: Lote[] }
        todosLosLotes = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Formato directo: Lote[]
        todosLosLotes = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Formato anidado adicional
        todosLosLotes = response.data.data;
      }
      
      console.log('Todos los lotes extraídos:', todosLosLotes);
      
      // Filtrar lotes por fincaId
      const lotesDeLaFinca = todosLosLotes.filter((lote: Lote) => lote.fincaId === fincaId);
      
      console.log(`Lotes filtrados por fincaId ${fincaId}:`, lotesDeLaFinca);
      
      // Retornar solo los nombres de los lotes para validar contra la columna "Lote" del CSV
      const lotesValidos = lotesDeLaFinca.map((lote: Lote) => lote.nombre);
      
      console.log('Lotes válidos (nombres):', lotesValidos);
      
      return lotesValidos;
    } catch (error: any) {
      console.error('Error en obtenerLotesValidosPorFinca:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || error.message || 'Error al obtener lotes válidos';
      throw new Error(errorMessage);
    }
  },
};
