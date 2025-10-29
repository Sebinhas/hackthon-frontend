import { useMemo } from 'react';
import { useObtenerFincas } from '@/modules/dashboard/fincas/hooks/useFincas';
import { useObtenerLotes } from '@/modules/dashboard/lotes/hooks/useLotes';

export interface EstadisticasFincas {
  total: number;
  porGrupo: Array<{ grupo: string; cantidad: number }>;
  porMoneda: Array<{ moneda: string; cantidad: number }>;
}

export interface EstadisticasLotes {
  total: number;
  porFinca: Array<{ fincaId: number; cantidad: number; nombreFinca?: string }>;
  porTipoCultivo: Array<{ tipoCultivoId: number; cantidad: number }>;
  porTipoSujeto: Array<{ tipoSujetoId: number; cantidad: number }>;
}

export const useHomeStats = () => {
  const { data: fincas = [], isLoading: isLoadingFincas } = useObtenerFincas();
  const { data: lotes = [], isLoading: isLoadingLotes } = useObtenerLotes();

  const estadisticasFincas = useMemo<EstadisticasFincas>(() => {
    const porGrupo = fincas.reduce((acc, finca) => {
      const existente = acc.find((item) => item.grupo === finca.grupo);
      if (existente) {
        existente.cantidad += 1;
      } else {
        acc.push({ grupo: finca.grupo, cantidad: 1 });
      }
      return acc;
    }, [] as Array<{ grupo: string; cantidad: number }>);

    const porMoneda = fincas.reduce((acc, finca) => {
      const existente = acc.find((item) => item.moneda === finca.moneda);
      if (existente) {
        existente.cantidad += 1;
      } else {
        acc.push({ moneda: finca.moneda, cantidad: 1 });
      }
      return acc;
    }, [] as Array<{ moneda: string; cantidad: number }>);

    return {
      total: fincas.length,
      porGrupo: porGrupo.sort((a, b) => b.cantidad - a.cantidad),
      porMoneda: porMoneda.sort((a, b) => b.cantidad - a.cantidad),
    };
  }, [fincas]);

  const estadisticasLotes = useMemo<EstadisticasLotes>(() => {
    const porFinca = lotes.reduce((acc, lote) => {
      const existente = acc.find((item) => item.fincaId === lote.fincaId);
      if (existente) {
        existente.cantidad += 1;
      } else {
        const finca = fincas.find((f) => f.keyValue === lote.fincaId);
        acc.push({
          fincaId: lote.fincaId,
          cantidad: 1,
          nombreFinca: finca?.nombre || `Finca ${lote.fincaId}`,
        });
      }
      return acc;
    }, [] as Array<{ fincaId: number; cantidad: number; nombreFinca?: string }>);

    const porTipoCultivo = lotes.reduce((acc, lote) => {
      const existente = acc.find((item) => item.tipoCultivoId === lote.tipoCultivoId);
      if (existente) {
        existente.cantidad += 1;
      } else {
        acc.push({ tipoCultivoId: lote.tipoCultivoId, cantidad: 1 });
      }
      return acc;
    }, [] as Array<{ tipoCultivoId: number; cantidad: number }>);

    const porTipoSujeto = lotes.reduce((acc, lote) => {
      const existente = acc.find((item) => item.tipoSujetoId === lote.tipoSujetoId);
      if (existente) {
        existente.cantidad += 1;
      } else {
        acc.push({ tipoSujetoId: lote.tipoSujetoId, cantidad: 1 });
      }
      return acc;
    }, [] as Array<{ tipoSujetoId: number; cantidad: number }>);

    return {
      total: lotes.length,
      porFinca: porFinca.sort((a, b) => b.cantidad - a.cantidad).slice(0, 10),
      porTipoCultivo: porTipoCultivo.sort((a, b) => b.cantidad - a.cantidad),
      porTipoSujeto: porTipoSujeto.sort((a, b) => b.cantidad - a.cantidad),
    };
  }, [lotes, fincas]);

  return {
    estadisticasFincas,
    estadisticasLotes,
    isLoading: isLoadingFincas || isLoadingLotes,
  };
};

