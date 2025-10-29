// ============================================================================
// TIPOS PARA MÓDULO DE LOTES AGRÍCOLAS
// ============================================================================

// Coordenadas GPS para delimitar lotes
export interface Coordenada {
  lat: number;
  lng: number;
}

// Interfaz para líneas
export interface Linea {
  id: number;
  nombre: string;
  descripcion: string;
  finca_id: number;
  coordenadas: Coordenada[];
}
// Estados posibles de un lote (sincronizado con backend)
export enum EstadoLote {
  EN_CRECIMIENTO = 'EN_CRECIMIENTO',
  EN_COSECHA = 'EN_COSECHA',
  EN_MANTENIMIENTO = 'EN_MANTENIMIENTO',
  INACTIVO = 'INACTIVO'
}

// Configuración de colores para cada estado
export const COLORES_ESTADO: Record<EstadoLote, { color: string; fillColor: string; label: string }> = {
  [EstadoLote.EN_CRECIMIENTO]: {
    color: '#22c55e',
    fillColor: '#22c55e80',
    label: 'En Crecimiento'
  },
  [EstadoLote.EN_COSECHA]: {
    color: '#f59e0b',
    fillColor: '#f59e0b80',
    label: 'En Cosecha'
  },
  [EstadoLote.EN_MANTENIMIENTO]: {
    color: '#f97316',
    fillColor: '#f9731680',
    label: 'En Mantenimiento'
  },
  [EstadoLote.INACTIVO]: {
    color: '#9ca3af',
    fillColor: '#9ca3af60',
    label: 'Inactivo'
  }
};

// Tipo de suelo (sincronizado con backend)
export enum TipoSuelo {
  ARCILLOSO = 'ARCILLOSO',
  ARENOSO = 'ARENOSO',
  LIMOSO = 'LIMOSO',
  FRANCO = 'FRANCO',
  HUMIFERO = 'HUMIFERO'
}

// Topografía del lote (sincronizado con backend)
export enum Topografia {
  PLANO = 'PLANO',
  ONDULADO = 'ONDULADO',
  MONTAÑOSO = 'MONTAÑOSO'
}

// Sistema de riego (sincronizado con backend)
export enum SistemaRiego {
  GOTEO = 'GOTEO',
  ASPERSION = 'ASPERSION',
  GRAVEDAD = 'GRAVEDAD',
  NINGUNO = 'NINGUNO'
}

// Interfaz principal de Lote
export interface Lote {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  finca_id: number;  // ID de la finca a la que pertenece
  
  // Ubicación y delimitación
  coordenadas: Coordenada[]; // Array de puntos que forman el polígono
  area_hectareas: number;
  perimetro_metros?: number;
  altitud_msnm?: number;
  
  // Cultivo asociado
  cultivo_id?: string;
  cultivo_nombre?: string;
  
  // Estado y operación
  estado: EstadoLote;
  fecha_ultima_actividad?: Date;
  proxima_actividad?: string;
  
  // Características del suelo y terreno
  tipo_suelo?: TipoSuelo;
  ph_suelo?: number;
  topografia?: Topografia;
  
  // Infraestructura
  sistema_riego?: SistemaRiego;
  tiene_cerca: boolean;
  tiene_sombra: boolean;
  acceso_vehicular: boolean;
  
  // Datos adicionales
  fecha_creacion: Date;
  fecha_ultima_modificacion?: Date;
  usuario_responsable_id?: string;
  notas?: string;
  
  // Imágenes y documentos
  imagenes?: string[];
  documentos?: string[];
}

// Interfaz para datos de lote desde mock (estructura original)
export interface LoteMock {
  id_local: string;
  id_remoto: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  finca_id: number;
  finca_externa_id: number;
  coordenadas_geojson: {
    type: "Polygon";
    coordinates: number[][][];
  };
  area_hectareas: number;
  perimetro_metros: number;
  altitud_msnm: number;
  cultivo: {
    id: string;
    nombre: string;
    tipo_cultivo_id: number;
  };
  estado: EstadoLote;
  actividades: {
    ultima_fecha: string;
    proxima: string;
  };
  suelo: {
    tipo: string;
    ph: number;
    topografia: string;
  };
  infraestructura: {
    sistema_riego: string;
    tiene_cerca: boolean;
    tiene_sombra: boolean;
    acceso_vehicular: boolean;
  };
  referencia_externa: {
    grupo: string;
    sigla: string;
    tipo_sujeto_id: number;
    fuente: string;
  };
  metadatos: {
    fecha_creacion: string;
    fecha_ultima_modificacion: string;
    notas: string;
    timestamp_sincronizacion: string;
  };
}

// DTO para crear lote
export interface CreateLoteDto {
  codigo: string;
  nombre: string;
  descripcion?: string;
  coordenadas: Coordenada[];
  area_hectareas: number;
  perimetro_metros?: number;
  altitud_msnm?: number;
  cultivo_id?: string;
  estado: EstadoLote;
  tipo_suelo?: TipoSuelo;
  ph_suelo?: number;
  topografia?: Topografia;
  sistema_riego?: SistemaRiego;
  tiene_cerca: boolean;
  tiene_sombra: boolean;
  acceso_vehicular: boolean;
  notas?: string;
}

// DTO para actualizar lote
export interface UpdateLoteDto extends Partial<CreateLoteDto> {}

// Filtros para búsqueda de lotes
export interface LotesFiltros {
  estado?: EstadoLote;
  cultivo_id?: string;
  area_min?: number;
  area_max?: number;
  tipo_suelo?: TipoSuelo;
  sistema_riego?: SistemaRiego;
  busqueda?: string;
}

// Estadísticas de lotes
export interface LotesEstadisticas {
  total_lotes: number;
  total_hectareas: number;
  por_estado: Record<EstadoLote, number>;
  area_promedio: number;
  lotes_con_riego: number;
  lotes_activos: number;
}

// Vista del mapa
export interface MapaConfig {
  centro: Coordenada;
  zoom: number;
  mostrar_etiquetas: boolean;
  tipo_mapa: 'satellite' | 'streets' | 'hybrid';
}

// Evento de cambio de coordenadas
export interface CoordenadaEvento {
  lote_id: string;
  coordenadas: Coordenada[];
  accion: 'agregar' | 'actualizar' | 'eliminar';
}

// Opciones para el selector de lotes
export interface LoteOption {
  value: string;
  label: string;
  area: number;
  estado: EstadoLote;
  cultivo?: string;
}

// Payload para Lotes
export interface LotePayload {
  codigo: string;
  nombre: string;
  descripcion?: string;
  coordenadas: Coordenada[];
  area_hectareas: number;
  perimetro_metros?: number;
  altitud_msnm?: number;
  cultivo_id?: string;
  estado: EstadoLote;
  tipo_suelo?: TipoSuelo;
  ph_suelo?: number;
  topografia?: Topografia;
  sistema_riego?: SistemaRiego;
  tiene_cerca: boolean;
  tiene_sombra: boolean;
  acceso_vehicular: boolean;
  notas?: string;
}

// Interfaz de Finca
export interface Finca {
  key: string;  // "finca_id"
  grupo: string;
  sigla: string;
  moneda: string;
  nombre: string;
  pago_dia: number;
  key_value: number;  // finca_id
  tipo_sujeto_id: number;
  tipo_cultivo_id: number;
  lote_id: string;  // Asociación con el lote
}

// Interfaz de Planta/Spot
export interface Planta {
  nombre_spot: string;  // "L29347L50S1"
  lat: number;
  lng: number;
  lote_id: number;
  linea: number;
  posicion: number;
  nombre_planta: string;  // "L29347L50P54"
  finca_id: number;
  estado?: EstadoLote;
  cargado?: boolean;  // true si fue importado desde CSV, false si es spot vacío
  coordenadas_poligono?: Coordenada[];  // Coordenadas del polígono del spot
}

// Configuración de tamaño de spots (polígonos)
export interface SpotConfig {
  ancho_metros: number;  // Ancho del spot en metros
  alto_metros: number;   // Alto del spot en metros
  espaciado_metros: number;  // Espaciado entre spots
}

// Configuración por defecto para spots
export const SPOT_CONFIG_DEFAULT: SpotConfig = {
  ancho_metros: 1.5,  // 1.5 metros de ancho
  alto_metros: 1.5,   // 1.5 metros de alto
  espaciado_metros: 0.5  // 0.5 metros de separación
};

// Colores para spots según si están cargados o no
export const COLORES_SPOT = {
  CARGADO: {
    fill: '#22c55e',  // Verde para spots con datos
    stroke: '#16a34a',
    opacity: 0.7
  },
  VACIO: {
    fill: '#9ca3af',  // Gris para spots vacíos
    stroke: '#6b7280',
    opacity: 0.4
  }
};

