import { api } from '@/core/api/useConfigApi';
import { ValidationCompleteData } from '@/modules/uploadFile/types/uploadFile.types';

export interface SiomaResponse {
  status: number;
  message: string;
  data?: any;
}

export const siomaService = {
  /**
   * Envía datos validados del CSV a la API de Sioma
   * @param datosValidados - Datos validados del CSV con fincaId y csvRows
   * @returns Respuesta de la API de Sioma
   * 
   * TODO: Actualizar con el endpoint y formato correcto según documentación de Sioma
   * La documentación técnica con el formato exacto será entregada posteriormente
   */
  enviarDatosASioma: async (datosValidados: ValidationCompleteData): Promise<SiomaResponse> => {
    try {
      // TODO: Reemplazar '/api/v1/sioma/spots' con el endpoint correcto
      // TODO: Ajustar el payload según el formato esperado por Sioma
      const response = await api.post<SiomaResponse>('/api/v1/sioma/spots', {
        finca_id: datosValidados.fincaId,
        spots: datosValidados.csvRows.map(row => ({
          lote: row.Lote,
          linea: parseInt(row.Linea),
          palma: parseInt(row.Palma),
          latitud: parseFloat(row.Latitud),
          longitud: parseFloat(row.Longitud),
        })),
      });
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al enviar datos a Sioma';
      throw new Error(errorMessage);
    }
  },
};

