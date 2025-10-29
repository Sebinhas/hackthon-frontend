import { mockFincasRaw, mockLotes, mockPlantas } from './mockData';
import { Lote, Finca, Planta, LotePayload } from '@/modules/dashboard/mapa/types/lotes.types';
import { generarSpotsParaLote } from '@/modules/dashboard/mapa/utils/spotGenerator';

// Simular delay de red
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const mockService = {
  // Servicios para Fincas
  obtenerFincas: async (): Promise<Finca[]> => {
    await delay();
    return mockFincasRaw.map(finca => ({
      ...finca,
      lote_id: '1' // Asociación temporal con el primer lote
    }));
  },

  obtenerFinca: async (id: number): Promise<Finca | undefined> => {
    await delay();
    const finca = mockFincasRaw.find(f => f.key_value === id);
    return finca ? { ...finca, lote_id: '1' } : undefined;
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
    return lotes.map(lote => ({
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
    await delay();
    
    // Obtener el lote correspondiente
    const lote = mockLotes.find(l => parseInt(l.id_local) === loteId);
    if (!lote) return [];
    
    // Obtener spots cargados (desde CSV) para este lote
    const spotsCargados = mockPlantas.filter(planta => planta.lote_id === loteId);
    
    // Convertir coordenadas del lote
    const coordenadasLote = lote.coordenadas_geojson.coordinates[0].map(coord => ({
      lat: coord[1],
      lng: coord[0]
    }));
    
    // Generar todos los spots (cargados y vacíos) para el lote
    const todosLosSpots = generarSpotsParaLote(
      loteId,
      lote.finca_id,
      coordenadasLote,
      undefined,
      spotsCargados
    );
    
    return todosLosSpots;
  },

  obtenerPlantasPorFinca: async (fincaId: number): Promise<Planta[]> => {
    await delay();
    return mockPlantas.filter(planta => planta.finca_id === fincaId);
  },

  obtenerPlanta: async (nombreSpot: string): Promise<Planta | undefined> => {
    await delay();
    return mockPlantas.find(planta => planta.nombre_spot === nombreSpot);
  }
};
