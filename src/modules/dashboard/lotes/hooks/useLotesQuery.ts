import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getLotes,
  getLoteById,
  createLote,
  updateLote,
  deleteLote,
  getLotesEstadisticas
} from '../services/lotesService';
import type { CreateLoteDto, UpdateLoteDto, LotesFiltros } from '@/modules/dashboard/lotes/types/lotes.types';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const lotesKeys = {
  all: ['lotes'] as const,
  lists: () => [...lotesKeys.all, 'list'] as const,
  list: (filtros?: LotesFiltros) => [...lotesKeys.lists(), filtros] as const,
  details: () => [...lotesKeys.all, 'detail'] as const,
  detail: (id: string) => [...lotesKeys.details(), id] as const,
  estadisticas: () => [...lotesKeys.all, 'estadisticas'] as const,
};

// ============================================================================
// HOOKS DE QUERIES
// ============================================================================

/**
 * Hook para obtener lista de lotes con filtros
 */
export const useLotes = (filtros?: LotesFiltros) => {
  return useQuery({
    queryKey: lotesKeys.list(filtros),
    queryFn: () => getLotes(filtros),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

/**
 * Hook para obtener un lote específico por ID
 */
export const useLote = (id: string) => {
  return useQuery({
    queryKey: lotesKeys.detail(id),
    queryFn: () => getLoteById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook para obtener estadísticas de lotes
 */
export const useLotesEstadisticas = () => {
  return useQuery({
    queryKey: lotesKeys.estadisticas(),
    queryFn: getLotesEstadisticas,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};

// ============================================================================
// HOOKS DE MUTATIONS
// ============================================================================

/**
 * Hook para crear un nuevo lote
 */
export const useCreateLote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lotesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: lotesKeys.estadisticas() });

      toast( '✅ Lote creado'
      );
    },
    onError: (error: Error) => {
      toast( '❌ Error al crear lote'
      );
    },
  });
};

/**
 * Hook para actualizar un lote existente
 */
export const useUpdateLote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLote,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: lotesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: lotesKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: lotesKeys.estadisticas() });

      toast( '✅ Lote actualizado'
      );
    },
    onError: (error: Error) => {
      toast( '❌ Error al actualizar lote'
      );
    },
  });
};

/**
 * Hook para eliminar un lote
 */
export const useDeleteLote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lotesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: lotesKeys.estadisticas() });

      toast('✅ Lote eliminado'
      );
    },
    onError: (error: Error) => {
      toast( '❌ Error al eliminar lote'
      );
    },
  });
};

/**
 * Hook para actualizar el estado de un lote rápidamente
 */
export const useUpdateEstadoLote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: any }) =>
      updateLote({ id, estado }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lotesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: lotesKeys.estadisticas() });

      toast( '✅ Estado actualizado'
      );
    },
    onError: (error: Error) => {
      toast( '❌ Error'
      );
    },
  });
};

