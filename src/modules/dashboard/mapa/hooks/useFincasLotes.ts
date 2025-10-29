import { useQuery } from '@tanstack/react-query';
import { mockService } from '@/shared/mocks/mockService';
import { Finca, Lote } from '../types/lotes.types';

// Hook para obtener todas las fincas
export const useObtenerFincas = () => {
  return useQuery({
    queryKey: ['fincas'],
    queryFn: () => mockService.obtenerFincas(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obtener lotes por finca
export const useObtenerLotesPorFinca = (fincaId: number | null) => {
  return useQuery({
    queryKey: ['lotes', 'finca', fincaId],
    queryFn: () => fincaId ? mockService.obtenerLotesPorFinca(fincaId) : Promise.resolve([]),
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
