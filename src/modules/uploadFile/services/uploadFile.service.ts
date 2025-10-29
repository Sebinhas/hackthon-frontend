import { api } from '@/core/api/useConfigApi';
import { mockService } from '@/shared/mocks/mockService';
import { CsvFile, CsvUploadResponse, CsvPreviewData, Finca, FincasResponse } from '../types/uploadFile.types';

// Cambiar a true para usar datos mockeados
const USE_MOCK = false;

export const uploadFileService = {
  subirArchivoCsv: async (file: File, fincaId?: number): Promise<CsvUploadResponse> => {
    if (USE_MOCK) {
      return mockService.subirArchivoCsv(file, fincaId);
    }

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
    if (USE_MOCK) {
      return mockService.obtenerArchivosCsv();
    }

    try {
      const response = await api.get<CsvFile[]>('/files');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener archivos');
    }
  },

  obtenerArchivoCsv: async (id: string): Promise<CsvFile> => {
    if (USE_MOCK) {
      return mockService.obtenerArchivoCsv(id);
    }

    try {
      const response = await api.get<CsvFile>(`/files/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener archivo');
    }
  },

  obtenerPreviewArchivo: async (id: string): Promise<CsvPreviewData> => {
    if (USE_MOCK) {
      return mockService.obtenerPreviewArchivo(id);
    }

    try {
      const response = await api.get<CsvPreviewData>(`/files/${id}/preview`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener preview del archivo');
    }
  },

  eliminarArchivoCsv: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      return mockService.eliminarArchivoCsv(id);
    }

    try {
      await api.delete(`/files/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar archivo');
    }
  },

  obtenerFincas: async (): Promise<Finca[]> => {
    if (USE_MOCK) {
      return mockService.obtenerFincas();
    }

    try {
      const response = await api.get<FincasResponse>('/fincas');
      
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

  obtenerLotesValidosPorFinca: async (fincaId: number): Promise<string[]> => {
    if (USE_MOCK) {
      return mockService.obtenerLotesValidosPorFinca(fincaId);
    }

    try {
      const response = await api.get<string[]>(`/fincas/${fincaId}/lotes-validos`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener lotes válidos');
    }
  },
};
