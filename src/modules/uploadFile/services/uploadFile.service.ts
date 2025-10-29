import { api } from '@/core/api/useConfigApi';
import { CsvFile, CsvUploadResponse, CsvPreviewData, Finca } from '../types/uploadFile.types';

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
      const response = await api.get<Finca[]>('/fincas');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener lotes válidos');
    }
  },
};
