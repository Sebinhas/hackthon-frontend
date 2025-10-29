import { api } from '@/core/api/useConfigApi';
import { 
  Lote, 
  CreateLoteDto, 
  UpdateLoteDto, 
  LotesEstadisticas,
  Coordenada
} from '@/modules/dashboard/lotes/types/lotes.types';
import { mockLotes, mockFincas, mockPlantas } from '@/shared/mocks/mockData';
import { persistencia } from '@/shared/utils/persistence';

// Inicializar persistencia con datos mock
persistencia.init({
  lotes: mockLotes,
  fincas: mockFincas,
  plantas: mockPlantas,
});

// ============================================================================
// SERVICIOS - API REAL
// ============================================================================

// ============================================================================
// FUNCIONES EXPORTADAS (ALIASES PARA COMPATIBILIDAD)
// ============================================================================

export const lotesService = {
  // Obtener todos los lotes
  obtenerLotes: async (): Promise<Lote[]> => {
    // Usar persistencia local (mock)
    const saved = persistencia.getLotes();
    if (saved.length > 0) return saved;
    
    // Si no hay datos guardados, usar mock inicial
    return mockLotes;
  },

  // Obtener un lote por ID
  obtenerLotePorId: async (id: string): Promise<Lote> => {
    const lotes = persistencia.getLotes();
    const lote = lotes.find(l => l.id === id);
    if (lote) return lote;
    
    // Si no está en persistencia, buscar en mock
    const mockLote = mockLotes.find(l => l.id === id);
    if (mockLote) return mockLote;
    
    throw new Error('Lote no encontrado');
  },

  // Crear un lote
  crearLote: async (loteData: CreateLoteDto): Promise<Lote> => {
    // Usar persistencia local
    const nuevoLote: Lote = {
      ...loteData as any,
      id: Date.now().toString(),
      fecha_creacion: new Date(),
    };
    
    persistencia.saveLote(nuevoLote);
    return nuevoLote;
  },

  // Actualizar un lote
  actualizarLote: async (id: string, loteData: UpdateLoteDto): Promise<Lote> => {
    // Usar persistencia local
    const lotes = persistencia.getLotes();
    const loteActual = lotes.find(l => l.id === id);
    
    if (!loteActual) throw new Error('Lote no encontrado');
    
    const loteActualizado = {
      ...loteActual,
      ...loteData,
      fecha_ultima_modificacion: new Date(),
    };
    
    persistencia.saveLote(loteActualizado);
    return loteActualizado;
  },

  // Eliminar un lote
  eliminarLote: async (id: string): Promise<void> => {
    persistencia.deleteLote(id);
  },

  // Obtener estadísticas
  obtenerEstadisticas: async (): Promise<LotesEstadisticas> => {
    const lotes = persistencia.getLotes().length > 0 ? persistencia.getLotes() : mockLotes;
    const totalLotes = lotes.length;
    const totalHectareas = lotes.reduce((sum, l) => sum + (l.area_hectareas || 0), 0);
    
    return {
      total_lotes: totalLotes,
      total_hectareas: totalHectareas,
      por_estado: {
        EN_CRECIMIENTO: 0,
        EN_COSECHA: 0,
        EN_MANTENIMIENTO: 0,
        INACTIVO: 0,
      },
      area_promedio: totalLotes > 0 ? totalHectareas / totalLotes : 0,
      lotes_con_riego: 0,
      lotes_activos: 0,
    };
  }
};

// ============================================================================
// FUNCIONES DE UTILIDAD PARA COORDENADAS GPS
// ============================================================================

/**
 * Calcular área de un polígono en hectáreas usando la fórmula del área de Gauss
 */
export const calcularArea = (coordenadas: Coordenada[]): number => {
  if (coordenadas.length < 3) return 0;

  let area = 0;
  const n = coordenadas.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += coordenadas[i].lng * coordenadas[j].lat;
    area -= coordenadas[j].lng * coordenadas[i].lat;
  }

  area = Math.abs(area) / 2;

  // Convertir de grados cuadrados a hectáreas
  // 1 grado² ≈ 12364 km² a latitud 0 (aproximación)
  // Ajustar por latitud promedio
  const latPromedio = coordenadas.reduce((sum, c) => sum + c.lat, 0) / n;
  const factorLatitud = Math.cos((latPromedio * Math.PI) / 180);
  
  // 1 grado² ≈ 111.32 km * 111.32 km * cos(lat)
  const km2 = area * 111.32 * 111.32 * factorLatitud;
  
  // Convertir km² a hectáreas (1 km² = 100 ha)
  return parseFloat((km2 * 100).toFixed(2));
};

/**
 * Calcular perímetro de un polígono en metros usando la fórmula de Haversine
 */
export const calcularPerimetro = (coordenadas: Coordenada[]): number => {
  if (coordenadas.length < 2) return 0;

  let perimetro = 0;
  const R = 6371000; // Radio de la Tierra en metros

  for (let i = 0; i < coordenadas.length; i++) {
    const p1 = coordenadas[i];
    const p2 = coordenadas[(i + 1) % coordenadas.length];

    const lat1 = (p1.lat * Math.PI) / 180;
    const lat2 = (p2.lat * Math.PI) / 180;
    const deltaLat = ((p2.lat - p1.lat) * Math.PI) / 180;
    const deltaLng = ((p2.lng - p1.lng) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    perimetro += R * c;
  }

  return parseFloat(perimetro.toFixed(2));
};

// ============================================================================
// ALIASES PARA COMPATIBILIDAD CON HOOKS
// ============================================================================

export const getLotes = async (filtros?: any): Promise<Lote[]> => {
  // Por ahora ignora filtros, se pueden implementar después en el backend
  return lotesService.obtenerLotes();
};

export const getLoteById = async (id: string): Promise<Lote> => lotesService.obtenerLotePorId(id);
export const createLote = async (loteData: CreateLoteDto): Promise<Lote> => lotesService.crearLote(loteData);

// Wrapper para updateLote que acepta objeto {id, ...data}
export const updateLote = async (params: { id: string; [key: string]: any }): Promise<Lote> => {
  const { id, ...data } = params;
  return lotesService.actualizarLote(id, data as UpdateLoteDto);
};

export const deleteLote = lotesService.eliminarLote;
export const getLotesEstadisticas = lotesService.obtenerEstadisticas;

export default lotesService;
