import { mockFincas, mockLotes, mockPlantas, mockLineas } from './mockData';
import { Lote, Finca, Planta, LotePayload, Linea } from '@/modules/dashboard/mapa/types/lotes.types';

// Simular delay de red (reducido para mejor rendimiento)
const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms));

export const mockService = {
  // Servicios para Fincas
  obtenerFincas: async (): Promise<Finca[]> => {
    await delay();
    // Usar mockFincas directamente con las fincas reales
    return mockFincas;
  },

  obtenerFinca: async (id: number): Promise<Finca | undefined> => {
    await delay();
    return mockFincas.find(f => f.key_value === id);
  },

  // Servicios para Lotes
  obtenerLotes: async (): Promise<Lote[]> => {
    await delay();
    return mockLotes.map(lote => ({
      ...lote,
      id: lote.id_local,
      coordenadas: lote.coordenadas_geojson.coordinates[0].map(coord => ({
        lat: coord[1],
        lng: coord[0]
      })),
      fecha_creacion: new Date(lote.metadatos.fecha_creacion),
      fecha_ultima_modificacion: new Date(lote.metadatos.fecha_ultima_modificacion),
      fecha_ultima_actividad: lote.actividades.ultima_fecha ? new Date(lote.actividades.ultima_fecha) : undefined,
      proxima_actividad: lote.actividades.proxima,
      cultivo_id: lote.cultivo.id,
      cultivo_nombre: lote.cultivo.nombre,
      tipo_suelo: lote.suelo.tipo as any,
      ph_suelo: lote.suelo.ph,
      topografia: lote.suelo.topografia as any,
      sistema_riego: lote.infraestructura.sistema_riego as any,
      tiene_cerca: lote.infraestructura.tiene_cerca,
      tiene_sombra: lote.infraestructura.tiene_sombra,
      acceso_vehicular: lote.infraestructura.acceso_vehicular,
      notas: lote.metadatos.notas,
      usuario_responsable_id: undefined,
      imagenes: [],
      documentos: []
    }));
  },

  obtenerLote: async (id: string): Promise<Lote | undefined> => {
    await delay();
    const lote = mockLotes.find(l => l.id_local === id);
    if (!lote) return undefined;

    return {
      ...lote,
      id: lote.id_local,
      coordenadas: lote.coordenadas_geojson.coordinates[0].map(coord => ({
        lat: coord[1],
        lng: coord[0]
      })),
      fecha_creacion: new Date(lote.metadatos.fecha_creacion),
      fecha_ultima_modificacion: new Date(lote.metadatos.fecha_ultima_modificacion),
      fecha_ultima_actividad: lote.actividades.ultima_fecha ? new Date(lote.actividades.ultima_fecha) : undefined,
      proxima_actividad: lote.actividades.proxima,
      cultivo_id: lote.cultivo.id,
      cultivo_nombre: lote.cultivo.nombre,
      tipo_suelo: lote.suelo.tipo as any,
      ph_suelo: lote.suelo.ph,
      topografia: lote.suelo.topografia as any,
      sistema_riego: lote.infraestructura.sistema_riego as any,
      tiene_cerca: lote.infraestructura.tiene_cerca,
      tiene_sombra: lote.infraestructura.tiene_sombra,
      acceso_vehicular: lote.infraestructura.acceso_vehicular,
      notas: lote.metadatos.notas,
      usuario_responsable_id: undefined,
      imagenes: [],
      documentos: []
    };
  },

  obtenerLotesPorFinca: async (fincaId: number): Promise<Lote[]> => {
    await delay();
    const lotes = mockLotes.filter(lote => lote.finca_id === fincaId);
    return lotes
      .filter(lote => lote.coordenadas_geojson.coordinates[0] && lote.coordenadas_geojson.coordinates[0].length > 0) // Solo lotes con coordenadas
      .map(lote => ({
        ...lote,
        id: lote.id_local,
        coordenadas: lote.coordenadas_geojson.coordinates[0].map(coord => ({
          lat: coord[1],
          lng: coord[0]
        })),
        fecha_creacion: new Date(lote.metadatos.fecha_creacion),
        fecha_ultima_modificacion: new Date(lote.metadatos.fecha_ultima_modificacion),
        fecha_ultima_actividad: lote.actividades.ultima_fecha ? new Date(lote.actividades.ultima_fecha) : undefined,
        proxima_actividad: lote.actividades.proxima,
        cultivo_id: lote.cultivo.id,
        cultivo_nombre: lote.cultivo.nombre,
        tipo_suelo: lote.suelo.tipo as any,
        ph_suelo: lote.suelo.ph,
        topografia: lote.suelo.topografia as any,
        sistema_riego: lote.infraestructura.sistema_riego as any,
        tiene_cerca: lote.infraestructura.tiene_cerca,
        tiene_sombra: lote.infraestructura.tiene_sombra,
        acceso_vehicular: lote.infraestructura.acceso_vehicular,
        notas: lote.metadatos.notas,
        usuario_responsable_id: undefined,
        imagenes: [],
        documentos: []
      }));
  },

  crearLote: async (payload: LotePayload): Promise<Lote> => {
    await delay();
    const nuevoLote: Lote = {
      id: Date.now().toString(),
      codigo: payload.codigo,
      nombre: payload.nombre,
      descripcion: payload.descripcion,
      finca_id: 2372, // Valor por defecto
      coordenadas: payload.coordenadas,
      area_hectareas: payload.area_hectareas,
      perimetro_metros: payload.perimetro_metros,
      altitud_msnm: payload.altitud_msnm,
      cultivo_id: payload.cultivo_id,
      cultivo_nombre: undefined,
      estado: payload.estado,
      fecha_ultima_actividad: undefined,
      proxima_actividad: payload.notas,
      tipo_suelo: payload.tipo_suelo,
      ph_suelo: payload.ph_suelo,
      topografia: payload.topografia,
      sistema_riego: payload.sistema_riego,
      tiene_cerca: payload.tiene_cerca,
      tiene_sombra: payload.tiene_sombra,
      acceso_vehicular: payload.acceso_vehicular,
      fecha_creacion: new Date(),
      fecha_ultima_modificacion: undefined,
      usuario_responsable_id: undefined,
      notas: payload.notas,
      imagenes: [],
      documentos: []
    };
    return nuevoLote;
  },

  actualizarLote: async (id: string, payload: Partial<LotePayload>): Promise<Lote> => {
    await delay();
    const loteExistente = await mockService.obtenerLote(id);
    if (!loteExistente) throw new Error('Lote no encontrado');

    const loteActualizado: Lote = {
      ...loteExistente,
      ...payload,
      fecha_ultima_modificacion: new Date()
    };
    return loteActualizado;
  },

  eliminarLote: async (_id: string): Promise<void> => {
    await delay();
    // Simulación de eliminación
    return;
  },

  // Servicios para Plantas/Spots
  obtenerPlantas: async (): Promise<Planta[]> => {
    await delay();
    return mockPlantas;
  },

  obtenerPlantasPorLote: async (loteId: number): Promise<Planta[]> => {
    await delay(100); // Reducir delay de 300ms a 100ms
    
    // Solo devolver spots reales del lote (sin generar spots imaginarios)
    // Esto mejora significativamente el rendimiento
    const spotsReales = mockPlantas.filter(planta => planta.lote_id === loteId);
    
    return spotsReales;
  },

  obtenerPlantasPorFinca: async (fincaId: number): Promise<Planta[]> => {
    await delay();
    return mockPlantas.filter(planta => planta.finca_id === fincaId);
  },

  obtenerPlanta: async (nombreSpot: string): Promise<Planta | undefined> => {
    await delay();
    return mockPlantas.find(planta => planta.nombre_spot === nombreSpot);
  },

  // Servicios para Líneas
  obtenerLineas: async (): Promise<Linea[]> => {
    await delay();
    return mockLineas;
  },

  obtenerLineasPorLote: async (loteId: number): Promise<Linea[]> => {
    await delay();
    
    // Obtener todas las líneas únicas de los spots del lote
    const spotsDelLote = mockPlantas.filter(planta => planta.lote_id === loteId);
    const numerosLineaUnicos = [...new Set(spotsDelLote.map(spot => spot.linea))];
    
    // Crear un mapa de líneas por ID desde mockLineas
    const lineasPorId = mockLineas.reduce((acc, linea) => {
      // Verificar si esta línea tiene spots en el lote con el mismo número de línea
      const tieneSpotsEnLote = spotsDelLote.some(spot => spot.linea === linea.id);
      if (tieneSpotsEnLote) {
        acc[linea.id] = linea;
      }
      return acc;
    }, {} as Record<number, Linea>);
    
    // Para cada número de línea único, buscar o crear la línea
    return numerosLineaUnicos.map(numeroLinea => {
      // Buscar línea existente por ID coincidente
      const lineaExistente = lineasPorId[numeroLinea];
      
      // Si existe, retornarla; si no, crear una línea genérica basada en los spots
      if (lineaExistente) {
        return lineaExistente;
      }
      
      // Crear línea genérica a partir de los spots
      const spotsDeEstaLinea = spotsDelLote
        .filter(spot => spot.linea === numeroLinea)
        .sort((a, b) => a.posicion - b.posicion);
      
      // Usar las coordenadas de los spots para crear la línea
      const coordenadasLinea = spotsDeEstaLinea.map(spot => ({
        lat: spot.lat,
        lng: spot.lng
      }));
      
      return {
        id: numeroLinea, // Usar el número de línea como ID para mapeo
        nombre: `Línea ${numeroLinea}`,
        descripcion: `Línea ${numeroLinea} del lote`,
        finca_id: spotsDeEstaLinea[0]?.finca_id || 0,
        coordenadas: coordenadasLinea
      };
    });
  },

  obtenerLinea: async (id: number): Promise<Linea | undefined> => {
    await delay();
    return mockLineas.find(linea => linea.id === id);
  }
};
