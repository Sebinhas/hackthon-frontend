import { useQuery } from '@tanstack/react-query';
import { mockService } from '@/shared/mocks/mockService';
import { Lote, EstadoLote } from '../types/lotes.types';
import { fincasService } from '@/modules/dashboard/fincas/services/fincas.service';
import { lotesService } from '../../lotes/services/lotes.service';
import { Lote as LoteBackend } from '../../lotes/types/lotes.types';
import { coordenadasService } from '../services/coordenadas.service';

// Hook para obtener todas las fincas
export const useObtenerFincas = () => {
  return useQuery({
    queryKey: ['fincas'],
    queryFn: () => fincasService.obtenerFincas(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Función para transformar Lote del backend al formato del mapa con coordenadas
const transformarLoteBackendAMapa = async (
  loteBackend: LoteBackend,
  coordenadas: { lat: number; lng: number }[] = []
): Promise<Lote> => {
  // Mapear campos del backend al formato esperado por el mapa
  return {
    id: loteBackend.id,
    codigo: loteBackend.key || loteBackend.id,
    nombre: loteBackend.nombre,
    descripcion: '',
    finca_id: loteBackend.fincaId,
    coordenadas: coordenadas, // Coordenadas obtenidas del servicio
    area_hectareas: 0, // Necesitarás agregar este campo cuando el backend lo provea
    perimetro_metros: undefined,
    altitud_msnm: undefined,
    cultivo_id: undefined,
    cultivo_nombre: undefined,
    estado: EstadoLote.EN_CRECIMIENTO, // Estado por defecto, ajustar según backend
    fecha_ultima_actividad: undefined,
    proxima_actividad: undefined,
    tipo_suelo: undefined,
    ph_suelo: undefined,
    topografia: undefined,
    sistema_riego: undefined,
    tiene_cerca: false,
    tiene_sombra: false,
    acceso_vehicular: false,
    fecha_creacion: new Date(),
    fecha_ultima_modificacion: undefined,
    usuario_responsable_id: undefined,
    notas: undefined,
    imagenes: undefined,
    documentos: undefined,
  };
};

// Hook para obtener lotes por finca
export const useObtenerLotesPorFinca = (fincaId: number | null) => {
  return useQuery({
    queryKey: ['lotes', 'finca', fincaId],
    queryFn: async () => {
      if (!fincaId) return [];
      
      // Llamar al servicio real de lotes
      const lotesBackend = await lotesService.obtenerLotes(fincaId);
      
      // Obtener coordenadas para cada lote de forma paralela
      // Usar Promise.allSettled para que si un lote no tiene coordenadas, no falle todo
      const lotesConCoordenadas = await Promise.allSettled(
        lotesBackend.map(async (loteBackend) => {
          try {
            // Intentar obtener coordenadas usando el ID del lote (número)
            const loteIdNumerico = parseInt(loteBackend.id);
            const coordenadas = !isNaN(loteIdNumerico)
              ? await coordenadasService.obtenerCoordenadasPorLote(loteIdNumerico)
              : await coordenadasService.obtenerCoordenadasPorLote(loteBackend.nombre);
            
            // Transformar lote con sus coordenadas
            return await transformarLoteBackendAMapa(loteBackend, coordenadas);
          } catch (error) {
            // Si falla al obtener coordenadas, crear el lote sin coordenadas
            console.warn(`No se pudieron cargar coordenadas para lote ${loteBackend.id}:`, error);
            return await transformarLoteBackendAMapa(loteBackend, []);
          }
        })
      );
      
      // Filtrar solo los lotes que se pudieron crear exitosamente
      const lotesTransformados: Lote[] = lotesConCoordenadas
        .filter((result) => result.status === 'fulfilled')
        .map((result) => (result as PromiseFulfilledResult<Lote>).value);
      
      return lotesTransformados;
    },
    enabled: !!fincaId, // Solo habilitado cuando hay finca seleccionada
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para obtener plantas/spots por lote
export const useObtenerPlantasPorLote = (loteId: string | null) => {
  return useQuery({
    queryKey: ['plantas', 'lote', loteId],
    queryFn: () => loteId ? mockService.obtenerPlantasPorLote(parseInt(loteId)) : Promise.resolve([]),
    enabled: !!loteId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Hook para obtener plantas/spots por finca
export const useObtenerPlantasPorFinca = (fincaId: number | null) => {
  return useQuery({
    queryKey: ['plantas', 'finca', fincaId],
    queryFn: () => fincaId ? mockService.obtenerPlantasPorFinca(fincaId) : Promise.resolve([]),
    enabled: !!fincaId,
    staleTime: 2 * 60 * 1000,
  });
};

// Hook para obtener líneas por lote
export const useObtenerLineasPorLote = (loteId: string | null) => {
  return useQuery({
    queryKey: ['lineas', 'lote', loteId],
    queryFn: () => loteId ? mockService.obtenerLineasPorLote(parseInt(loteId)) : Promise.resolve([]),
    enabled: !!loteId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
