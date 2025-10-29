import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { obtenerLotes, obtenerLote, crearLote, actualizarLote, eliminarLote } from '../services/lotes.service';
import { LotePayload } from '../types/lotes.types';

export const useObtenerLotes = () => {
  return useQuery({
    queryKey: ['lotes'],
    queryFn: () => obtenerLotes(),
  });
};

export const useObtenerLote = (id: string) => {
  return useQuery({
    queryKey: ['lotes', id],
    queryFn: () => obtenerLote(id),
    enabled: !!id,
  });
};

export const useCrearLote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LotePayload) => crearLote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
      toast.success('Lote creado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useActualizarLote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<LotePayload> }) =>
      actualizarLote(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
      toast.success('Lote actualizado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useEliminarLote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eliminarLote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
      toast.success('Lote eliminado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

