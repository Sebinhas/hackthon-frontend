import { useQuery } from '@tanstack/react-query';
import { fincasService } from '../services/fincas.service';

export const useObtenerFincas = () => {
  return useQuery({
    queryKey: ['fincas'],
    queryFn: () => fincasService.obtenerFincas(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFincasPage = () => {
  const { data: fincas = [], isLoading } = useObtenerFincas();

  return {
    fincas,
    isLoading,
  };
};

