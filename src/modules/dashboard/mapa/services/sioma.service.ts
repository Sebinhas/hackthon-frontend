import axios from 'axios';
import { ValidationCompleteData } from '@/modules/uploadFile/types/uploadFile.types';
import { transformarCsvValidado, generarCsvString } from '@/modules/uploadFile/utils/csvGenerator';
import { uploadFileService } from '@/modules/uploadFile/services/uploadFile.service';

export interface SiomaResponse {
  status: string;
  message: string;
  data?: {
    spots_inserted: number;
    plantas_inserted: number;
    lotes_updated: number[];
    polygons_generated: number;
    lineas_triggered: string;
    finca_id: number;
    total_rows_csv: number;
  };
}

/**
 * URL base de la API de Sioma
 * Si el endpoint de Sioma es diferente a la API principal, actualizar esta constante
 * o configurar la variable de entorno VITE_SIOMA_API_URL
 */
const SIOMA_API_BASE_URL = import.meta.env.VITE_SIOMA_API_URL || 'https://plantizador.sioma.dev/api/v1';

export const siomaService = {
  /**
   * Envía datos validados del CSV a la API de Sioma
   * Genera el CSV procesado igual que el download y lo envía como form-data con key="file"
   * @param datosValidados - Datos validados del CSV con fincaId y csvRows
   * @returns Respuesta de la API de Sioma
   */
  enviarDatosASioma: async (datosValidados: ValidationCompleteData): Promise<SiomaResponse> => {
    try {
      // 1. Obtener todos los lotes para el mapeo (igual que en handleDownloadCsv)
      const todosLosLotes = await uploadFileService.obtenerLotesCompletos();
      
      // 2. Filtrar lotes por fincaId
      const lotesDeLaFinca = todosLosLotes.filter((lote) => lote.fincaId === datosValidados.fincaId);
      
      // 3. Transformar datos del CSV (igual que en handleDownloadCsv)
      const datosTransformados = transformarCsvValidado(
        datosValidados.csvRows,
        lotesDeLaFinca,
        datosValidados.fincaId
      );
      
      // 4. Generar el contenido CSV como string (igual que en handleDownloadCsv)
      const csvContent = generarCsvString(datosTransformados);
      
      // 5. Crear un Blob desde el string CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // 6. Crear un File desde el Blob
      const nombreArchivo = `Spots.csv`;
      const archivoCsv = new File([blob], nombreArchivo, { type: 'text/csv;charset=utf-8;' });
      
      // 7. Crear FormData y agregar el archivo con la key "file"
      const formData = new FormData();
      formData.append('file', archivoCsv);
      
      // 8. Crear instancia de axios para Sioma con configuración personalizada
      // Sioma requiere un header Authorization específico con una API key
      const siomaApi = axios.create({
        baseURL: SIOMA_API_BASE_URL,
        headers: {
          Authorization: '0nzS3GyaVyC2lXijWfqedA==',
          // No establecer Content-Type manualmente, axios lo hará automáticamente para FormData
        },
      });
      
      // 9. Enviar el archivo como form-data
      const response = await siomaApi.post<SiomaResponse>('/spots/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error al enviar datos a Sioma:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al enviar datos a Sioma';
      throw new Error(errorMessage);
    }
  },
};
