import { mockService } from '@/shared/mocks/mockService';
import { Lote, CreateLoteDto, UpdateLoteDto, LotePayload } from '../types/lotes.types';

// Simular delay de red
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const obtenerLotes = async () => {
  try {
    await delay();
    const lotes = await mockService.obtenerLotes();
    return lotes.map(lote => ({
      ...lote,
      fecha_creacion: new Date(lote.fecha_creacion),
      fecha_ultima_modificacion: lote.fecha_ultima_modificacion ? new Date(lote.fecha_ultima_modificacion) : undefined,
      fecha_ultima_actividad: lote.fecha_ultima_actividad ? new Date(lote.fecha_ultima_actividad) : undefined
    }));
  } catch (error: any) {
    throw error.message || 'Error al obtener lotes';
  }
};

export const obtenerLote = async (id: string) => {
  try {
    await delay();
    const lote = await mockService.obtenerLote(id);
    return {
      ...lote,
      fecha_creacion: new Date(lote.fecha_creacion),
      fecha_ultima_modificacion: lote.fecha_ultima_modificacion ? new Date(lote.fecha_ultima_modificacion) : undefined,
      fecha_ultima_actividad: lote.fecha_ultima_actividad ? new Date(lote.fecha_ultima_actividad) : undefined
    };
  } catch (error: any) {
    throw error.message || 'Error al obtener el lote';
  }
};

export const crearLote = async (payload: LotePayload) => {
  try {
    await delay();
    const lote = await mockService.crearLote(payload);
    return {
      ...lote,
      fecha_creacion: new Date(lote.fecha_creacion),
      fecha_ultima_modificacion: lote.fecha_ultima_modificacion ? new Date(lote.fecha_ultima_modificacion) : undefined,
      fecha_ultima_actividad: lote.fecha_ultima_actividad ? new Date(lote.fecha_ultima_actividad) : undefined
    };
  } catch (error: any) {
    throw error.message || 'Error al crear el lote';
  }
};

export const actualizarLote = async (id: string, payload: Partial<LotePayload>) => {
  try {
    await delay();
    const lote = await mockService.actualizarLote(id, payload as LotePayload);
    return {
      ...lote,
      fecha_creacion: new Date(lote.fecha_creacion),
      fecha_ultima_modificacion: lote.fecha_ultima_modificacion ? new Date(lote.fecha_ultima_modificacion) : undefined,
      fecha_ultima_actividad: lote.fecha_ultima_actividad ? new Date(lote.fecha_ultima_actividad) : undefined
    };
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Error al actualizar el lote';
  }
};

export const eliminarLote = async (id: string) => {
  try {
    await delay();
    await mockService.eliminarLote(id);
  } catch (error: any) {
    throw error.message || 'Error al eliminar el lote';
  }
};

