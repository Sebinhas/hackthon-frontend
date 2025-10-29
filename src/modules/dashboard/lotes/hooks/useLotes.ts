import { useQuery } from '@tanstack/react-query';
import { lotesService } from '../services/lotes.service';

export const useObtenerLotes = () => {
  return useQuery({
    queryKey: ['lotes'],
    queryFn: () => lotesService.obtenerLotes(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useObtenerCoordenadas = (loteId: number | null) => {
  return useQuery({
    queryKey: ['coordenadas', loteId],
    queryFn: () => lotesService.obtenerCoordenadas(loteId!),
    enabled: !!loteId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useLotesPage = () => {
  const { data: lotes = [], isLoading } = useObtenerLotes();

  return {
    lotes,
    isLoading,
  };
};

