import { api } from '@/core/api/useConfigApi';
import { mockService } from '@/shared/mocks/mockService';
import { CsvFile, CsvUploadResponse, CsvPreviewData, Finca } from '../types/uploadFile.types';

// Cambiar a true para usar datos mockeados
const USE_MOCK = true;

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
      const response = await api.get<Finca[]>('/fincas');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener fincas');
    }
  },
};

