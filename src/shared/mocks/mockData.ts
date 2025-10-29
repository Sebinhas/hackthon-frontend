import { LoteMock, Finca as LoteFinca, Planta, EstadoLote, Linea } from '@/modules/dashboard/mapa/types/lotes.types';
import { CsvFile, CsvPreviewData } from '@/modules/uploadFile/types/uploadFile.types';


// Mock de Lotes - Campo Alegre, Apartadó, Antioquia
export const mockLotes: LoteMock[] = [
  // Lotes de Finca Campo Alegre (finca_id: 2362)
  {
    id_local: "1",
    id_remoto: 33958,
    codigo: "LOTE-001",
    nombre: "Lote Principal - Campo Alegre",
    descripcion: "Lote principal de la finca",
    finca_id: 2362,
    finca_externa_id: 2362,
    coordenadas_geojson: {
      type: "Polygon",
      coordinates: [[
        [-76.633485, 7.863594],
        [-76.633485, 7.863794],
        [-76.633285, 7.863794],
        [-76.633285, 7.863594],
        [-76.633485, 7.863594]
      ]]
    },
    area_hectareas: 2.5,
    perimetro_metros: 1200,
    altitud_msnm: 50,
    cultivo: { id: "cultivo-1", nombre: "Plátano", tipo_cultivo_id: 2 },
    estado: EstadoLote.EN_CRECIMIENTO,
    actividades: { ultima_fecha: "2024-01-15", proxima: "Fertilización" },
    suelo: { tipo: "FRANCO", ph: 6.5, topografia: "PLANO" },
    infraestructura: { sistema_riego: "GOTEO", tiene_cerca: true, tiene_sombra: false, acceso_vehicular: true },
    referencia_externa: { grupo: "Campo Alegre", sigla: "CA-001", tipo_sujeto_id: 3, fuente: "API externa" },
    metadatos: { fecha_creacion: "2024-01-01", fecha_ultima_modificacion: "2024-01-15", notas: "Lote en excelente estado", timestamp_sincronizacion: "2025-10-28T00:00:00Z" }
  },
  {
    id_local: "2",
    id_remoto: 33959,
    codigo: "LOTE-002",
    nombre: "Lote Triangular - Campo Alegre",
    descripcion: "Lote con forma triangular",
    finca_id: 2362,
    finca_externa_id: 2362,
    coordenadas_geojson: {
      type: "Polygon",
      coordinates: [[
        [-76.633200, 7.863500],
        [-76.633400, 7.863500],
        [-76.633300, 7.863700],
        [-76.633200, 7.863500]
      ]]
    },
    area_hectareas: 1.2,
    perimetro_metros: 800,
    altitud_msnm: 52,
    cultivo: { id: "cultivo-1", nombre: "Plátano", tipo_cultivo_id: 2 },
    estado: EstadoLote.EN_COSECHA,
    actividades: { ultima_fecha: "2024-01-20", proxima: "Cosecha" },
    suelo: { tipo: "ARENOSO", ph: 6.8, topografia: "ONDULADO" },
    infraestructura: { sistema_riego: "ASPERSION", tiene_cerca: true, tiene_sombra: true, acceso_vehicular: true },
    referencia_externa: { grupo: "Campo Alegre", sigla: "CA-002", tipo_sujeto_id: 3, fuente: "API externa" },
    metadatos: { fecha_creacion: "2024-01-05", fecha_ultima_modificacion: "2024-01-20", notas: "Lote con excelente producción", timestamp_sincronizacion: "2025-10-28T00:00:00Z" }
  },
  {
    id_local: "3",
    id_remoto: 33960,
    codigo: "LOTE-003",
    nombre: "Lote Irregular - Campo Alegre",
    descripcion: "Lote con forma irregular",
    finca_id: 2362,
    finca_externa_id: 2362,
    coordenadas_geojson: {
      type: "Polygon",
      coordinates: [[
        [-76.633600, 7.863400],
        [-76.633500, 7.863400],
        [-76.633450, 7.863550],
        [-76.633550, 7.863650],
        [-76.633700, 7.863600],
        [-76.633600, 7.863400]
      ]]
    },
    area_hectareas: 1.8,
    perimetro_metros: 950,
    altitud_msnm: 48,
    cultivo: { id: "cultivo-1", nombre: "Plátano", tipo_cultivo_id: 2 },
    estado: EstadoLote.EN_MANTENIMIENTO,
    actividades: { ultima_fecha: "2024-01-18", proxima: "Preparación de suelo" },
    suelo: { tipo: "LIMOSO", ph: 6.2, topografia: "ONDULADO" },
    infraestructura: { sistema_riego: "GRAVEDAD", tiene_cerca: false, tiene_sombra: false, acceso_vehicular: false },
    referencia_externa: { grupo: "Campo Alegre", sigla: "CA-003", tipo_sujeto_id: 3, fuente: "API externa" },
    metadatos: { fecha_creacion: "2024-01-10", fecha_ultima_modificacion: "2024-01-18", notas: "Lote en proceso de renovación", timestamp_sincronizacion: "2025-10-28T00:00:00Z" }
  },
  {
    id_local: "4",
    id_remoto: 33961,
    codigo: "LOTE-004",
    nombre: "Lote Largo - Campo Alegre",
    descripcion: "Lote rectangular alargado",
    finca_id: 2362,
    finca_externa_id: 2362,
    coordenadas_geojson: {
      type: "Polygon",
      coordinates: [[
        [-76.633100, 7.863200],
        [-76.632800, 7.863200],
        [-76.632800, 7.863300],
        [-76.633100, 7.863300],
        [-76.633100, 7.863200]
      ]]
    },
    area_hectareas: 2.1,
    perimetro_metros: 1000,
    altitud_msnm: 55,
    cultivo: { id: "cultivo-1", nombre: "Plátano", tipo_cultivo_id: 2 },
    estado: EstadoLote.INACTIVO,
    actividades: { ultima_fecha: "2024-01-12", proxima: "Reactivación" },
    suelo: { tipo: "FRANCO", ph: 6.3, topografia: "PLANO" },
    infraestructura: { sistema_riego: "GOTEO", tiene_cerca: true, tiene_sombra: false, acceso_vehicular: true },
    referencia_externa: { grupo: "Campo Alegre", sigla: "CA-004", tipo_sujeto_id: 3, fuente: "API externa" },
    metadatos: { fecha_creacion: "2024-01-08", fecha_ultima_modificacion: "2024-01-12", notas: "Lote temporalmente inactivo", timestamp_sincronizacion: "2025-10-28T00:00:00Z" }
  },
  {
    id_local: "5",
    id_remoto: 33962,
    codigo: "LOTE-005",
    nombre: "Lote Pentagonal - Campo Alegre",
    descripcion: "Lote con forma pentagonal",
    finca_id: 2362,
    finca_externa_id: 2362,
    coordenadas_geojson: {
      type: "Polygon",
      coordinates: [[
        [-76.633800, 7.863300],
        [-76.633700, 7.863200],
        [-76.633600, 7.863250],
        [-76.633650, 7.863400],
        [-76.633750, 7.863350],
        [-76.633800, 7.863300]
      ]]
    },
    area_hectareas: 1.5,
    perimetro_metros: 750,
    altitud_msnm: 45,
    cultivo: { id: "cultivo-1", nombre: "Plátano", tipo_cultivo_id: 2 },
    estado: EstadoLote.EN_CRECIMIENTO,
    actividades: { ultima_fecha: "2024-01-15", proxima: "Fertilización" },
    suelo: { tipo: "ARENOSO", ph: 6.7, topografia: "ONDULADO" },
    infraestructura: { sistema_riego: "ASPERSION", tiene_cerca: true, tiene_sombra: true, acceso_vehicular: true },
    referencia_externa: { grupo: "Campo Alegre", sigla: "CA-005", tipo_sujeto_id: 3, fuente: "API externa" },
    metadatos: { fecha_creacion: "2024-01-01", fecha_ultima_modificacion: "2024-01-15", notas: "Lote en excelente estado", timestamp_sincronizacion: "2025-10-28T00:00:00Z" }
  }
];

// Mock de Fincas (LoteFinca type from lotes module)
// Mock de Fincas - Solo Campo Alegre, Apartadó
export const mockFincas: LoteFinca[] = [
  {
    key: 'finca_id',
    grupo: 'Campo_Alegre',
    sigla: 'CA',
    moneda: 'COP',
    nombre: 'Campo Alegre - Apartadó',
    pago_dia: 45000,
    key_value: 2362,
    tipo_sujeto_id: 1,
    tipo_cultivo_id: 2,
    lote_id: '1',
  }
];


export const mockLineas: Linea[] = [
  { id: 1, nombre: 'Línea 1', descripcion: 'Línea 1', finca_id: 2362, coordenadas: [{ lat: 7.863620, lng: -76.633450 }, { lat: 7.863640, lng: -76.633450 }, { lat: 7.863660, lng: -76.633450 }, { lat: 7.863680, lng: -76.633450 }, { lat: 7.863700, lng: -76.633450 }, { lat: 7.863720, lng: -76.633450 }] },
  { id: 2, nombre: 'Línea 2', descripcion: 'Línea 2', finca_id: 2362, coordenadas: [{ lat: 7.863650, lng: -76.633430 }, { lat: 7.863650, lng: -76.633410 }, { lat: 7.863650, lng: -76.633390 }, { lat: 7.863650, lng: -76.633370 }, { lat: 7.863650, lng: -76.633350 }, { lat: 7.863650, lng: -76.633330 }] },
  { id: 3, nombre: 'Línea 3', descripcion: 'Línea 3', finca_id: 2362, coordenadas: [{ lat: 7.863590, lng: -76.633380 }, { lat: 7.863610, lng: -76.633370 }, { lat: 7.863630, lng: -76.633360 }, { lat: 7.863650, lng: -76.633350 }, { lat: 7.863670, lng: -76.633340 }, { lat: 7.863690, lng: -76.633330 }] },
];
// Mock de Plantas (spots cargados desde CSV) - Campo Alegre, Apartadó
// Estos representan spots que YA tienen datos importados
// Las líneas pueden ir en cualquier dirección (horizontal, vertical, diagonal)
export const mockPlantas: Planta[] = [
  // Lote 1 - Campo Alegre (finca_id: 2362) - Múltiples líneas con spots vacíos y plantados
  // Línea 1 - Horizontal (Norte-Sur, lat varía, lng constante)
  { nombre_spot: 'L1L1S1', lat: 7.863620, lng: -76.633450, lote_id: 1, linea: 1, posicion: 1, nombre_planta: 'L1L1P1', finca_id: 2362, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'L1L1S2', lat: 7.863640, lng: -76.633450, lote_id: 1, linea: 1, posicion: 2, nombre_planta: 'L1L1P2', finca_id: 2362, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'L1L1S3', lat: 7.863660, lng: -76.633450, lote_id: 1, linea: 1, posicion: 3, nombre_planta: 'L1L1P3', finca_id: 2362, estado: EstadoLote.EN_COSECHA, cargado: true },
  { nombre_spot: 'L1L1S4', lat: 7.863680, lng: -76.633450, lote_id: 1, linea: 1, posicion: 4, nombre_planta: 'L1L1P4', finca_id: 2362, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'L1L1S5', lat: 7.863700, lng: -76.633450, lote_id: 1, linea: 1, posicion: 5, nombre_planta: 'L1L1P5', finca_id: 2362, estado: EstadoLote.EN_CRECIMIENTO, cargado: false }, // Vacío
  { nombre_spot: 'L1L1S6', lat: 7.863720, lng: -76.633450, lote_id: 1, linea: 1, posicion: 6, nombre_planta: 'L1L1P6', finca_id: 2362, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },

  // Línea 2 - Vertical (Este-Oeste, lng varía, lat constante)
  { nombre_spot: 'L1L2S1', lat: 7.863650, lng: -76.633430, lote_id: 1, linea: 2, posicion: 1, nombre_planta: 'L1L2P1', finca_id: 2362, estado: EstadoLote.EN_COSECHA, cargado: true },
  { nombre_spot: 'L1L2S2', lat: 7.863650, lng: -76.633410, lote_id: 1, linea: 2, posicion: 2, nombre_planta: 'L1L2P2', finca_id: 2362, estado: EstadoLote.EN_COSECHA, cargado: true },
  { nombre_spot: 'L1L2S3', lat: 7.863650, lng: -76.633390, lote_id: 1, linea: 2, posicion: 3, nombre_planta: 'L1L2P3', finca_id: 2362, estado: EstadoLote.EN_COSECHA, cargado: false }, // Vacío
  { nombre_spot: 'L1L2S4', lat: 7.863650, lng: -76.633370, lote_id: 1, linea: 2, posicion: 4, nombre_planta: 'L1L2P4', finca_id: 2362, estado: EstadoLote.EN_COSECHA, cargado: true },
  { nombre_spot: 'L1L2S5', lat: 7.863650, lng: -76.633350, lote_id: 1, linea: 2, posicion: 5, nombre_planta: 'L1L2P5', finca_id: 2362, estado: EstadoLote.EN_COSECHA, cargado: true },
  { nombre_spot: 'L1L2S6', lat: 7.863650, lng: -76.633330, lote_id: 1, linea: 2, posicion: 6, nombre_planta: 'L1L2P6', finca_id: 2362, estado: EstadoLote.EN_COSECHA, cargado: false }, // Vacío

  // Línea 3 - Diagonal (Noroeste-Sureste, ambas coordenadas varían)
  { nombre_spot: 'L1L3S1', lat: 7.863590, lng: -76.633380, lote_id: 1, linea: 3, posicion: 1, nombre_planta: 'L1L3P1', finca_id: 2362, estado: EstadoLote.EN_MANTENIMIENTO, cargado: true },
  { nombre_spot: 'L1L3S2', lat: 7.863610, lng: -76.633370, lote_id: 1, linea: 3, posicion: 2, nombre_planta: 'L1L3P2', finca_id: 2362, estado: EstadoLote.EN_MANTENIMIENTO, cargado: false }, // Vacío
  { nombre_spot: 'L1L3S3', lat: 7.863630, lng: -76.633360, lote_id: 1, linea: 3, posicion: 3, nombre_planta: 'L1L3P3', finca_id: 2362, estado: EstadoLote.EN_MANTENIMIENTO, cargado: true },
  { nombre_spot: 'L1L3S4', lat: 7.863650, lng: -76.633350, lote_id: 1, linea: 3, posicion: 4, nombre_planta: 'L1L3P4', finca_id: 2362, estado: EstadoLote.EN_MANTENIMIENTO, cargado: true },
  { nombre_spot: 'L1L3S5', lat: 7.863670, lng: -76.633340, lote_id: 1, linea: 3, posicion: 5, nombre_planta: 'L1L3P5', finca_id: 2362, estado: EstadoLote.EN_MANTENIMIENTO, cargado: false }, // Vacío
  { nombre_spot: 'L1L3S6', lat: 7.863690, lng: -76.633330, lote_id: 1, linea: 3, posicion: 6, nombre_planta: 'L1L3P6', finca_id: 2362, estado: EstadoLote.EN_MANTENIMIENTO, cargado: true },

  // Lote 2 - Campo Alegre (finca_id: 2362) - Líneas más cortas
  // Línea 1 - Diagonal (Suroeste-Noreste)
  { nombre_spot: 'L2L1S1', lat: 7.863530, lng: -76.633220, lote_id: 2, linea: 1, posicion: 1, nombre_planta: 'L2L1P1', finca_id: 2362, estado: EstadoLote.EN_COSECHA, cargado: true },
  { nombre_spot: 'L2L1S2', lat: 7.863570, lng: -76.633210, lote_id: 2, linea: 1, posicion: 2, nombre_planta: 'L2L1P2', finca_id: 2362, estado: EstadoLote.EN_COSECHA, cargado: false }, // Vacío
  { nombre_spot: 'L2L1S3', lat: 7.863610, lng: -76.633200, lote_id: 2, linea: 1, posicion: 3, nombre_planta: 'L2L1P3', finca_id: 2362, estado: EstadoLote.EN_COSECHA, cargado: true },
  { nombre_spot: 'L2L1S4', lat: 7.863650, lng: -76.633190, lote_id: 2, linea: 1, posicion: 4, nombre_planta: 'L2L1P4', finca_id: 2362, estado: EstadoLote.EN_COSECHA, cargado: true },

  // Línea 2 - Vertical (Norte-Sur)
  { nombre_spot: 'L2L2S1', lat: 7.863540, lng: -76.633160, lote_id: 2, linea: 2, posicion: 1, nombre_planta: 'L2L2P1', finca_id: 2362, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'L2L2S2', lat: 7.863580, lng: -76.633160, lote_id: 2, linea: 2, posicion: 2, nombre_planta: 'L2L2P2', finca_id: 2362, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'L2L2S3', lat: 7.863620, lng: -76.633160, lote_id: 2, linea: 2, posicion: 3, nombre_planta: 'L2L2P3', finca_id: 2362, estado: EstadoLote.EN_CRECIMIENTO, cargado: false }, // Vacío
  { nombre_spot: 'L2L2S4', lat: 7.863660, lng: -76.633160, lote_id: 2, linea: 2, posicion: 4, nombre_planta: 'L2L2P4', finca_id: 2362, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },

  // Lote 3 - Campo Alegre (finca_id: 2362) - Patrón irregular
  // Línea 1 - Horizontal (Este-Oeste)
  { nombre_spot: 'L3L1S1', lat: 7.863480, lng: -76.633520, lote_id: 3, linea: 1, posicion: 1, nombre_planta: 'L3L1P1', finca_id: 2362, estado: EstadoLote.EN_MANTENIMIENTO, cargado: true },
  { nombre_spot: 'L3L1S2', lat: 7.863530, lng: -76.633520, lote_id: 3, linea: 1, posicion: 2, nombre_planta: 'L3L1P2', finca_id: 2362, estado: EstadoLote.EN_MANTENIMIENTO, cargado: false }, // Vacío
  { nombre_spot: 'L3L1S3', lat: 7.863580, lng: -76.633520, lote_id: 3, linea: 1, posicion: 3, nombre_planta: 'L3L1P3', finca_id: 2362, estado: EstadoLote.EN_MANTENIMIENTO, cargado: true },

  // Línea 2 - Vertical (Sur-Norte)
  { nombre_spot: 'L3L2S1', lat: 7.863480, lng: -76.633470, lote_id: 3, linea: 2, posicion: 1, nombre_planta: 'L3L2P1', finca_id: 2362, estado: EstadoLote.EN_MANTENIMIENTO, cargado: true },
  { nombre_spot: 'L3L2S2', lat: 7.863480, lng: -76.633450, lote_id: 3, linea: 2, posicion: 2, nombre_planta: 'L3L2P2', finca_id: 2362, estado: EstadoLote.EN_MANTENIMIENTO, cargado: true },
  { nombre_spot: 'L3L2S3', lat: 7.863480, lng: -76.633430, lote_id: 3, linea: 2, posicion: 3, nombre_planta: 'L3L2P3', finca_id: 2362, estado: EstadoLote.EN_MANTENIMIENTO, cargado: false }, // Vacío

  // Lote 4 - Campo Alegre (finca_id: 2362) - Lotes inactivos con algunos spots
  // Línea 1 - Diagonal (Sureste-Noroeste)
  { nombre_spot: 'L4L1S1', lat: 7.863220, lng: -76.632920, lote_id: 4, linea: 1, posicion: 1, nombre_planta: 'L4L1P1', finca_id: 2362, estado: EstadoLote.INACTIVO, cargado: false }, // Vacío
  { nombre_spot: 'L4L1S2', lat: 7.863270, lng: -76.632910, lote_id: 4, linea: 1, posicion: 2, nombre_planta: 'L4L1P2', finca_id: 2362, estado: EstadoLote.INACTIVO, cargado: false }, // Vacío
  { nombre_spot: 'L4L1S3', lat: 7.863320, lng: -76.632900, lote_id: 4, linea: 1, posicion: 3, nombre_planta: 'L4L1P3', finca_id: 2362, estado: EstadoLote.INACTIVO, cargado: true },

  // Línea 2 - Horizontal (Oeste-Este)
  { nombre_spot: 'L4L2S1', lat: 7.863240, lng: -76.632870, lote_id: 4, linea: 2, posicion: 1, nombre_planta: 'L4L2P1', finca_id: 2362, estado: EstadoLote.INACTIVO, cargado: false }, // Vacío
  { nombre_spot: 'L4L2S2', lat: 7.863280, lng: -76.632870, lote_id: 4, linea: 2, posicion: 2, nombre_planta: 'L4L2P2', finca_id: 2362, estado: EstadoLote.INACTIVO, cargado: true },
  { nombre_spot: 'L4L2S3', lat: 7.863320, lng: -76.632870, lote_id: 4, linea: 2, posicion: 3, nombre_planta: 'L4L2P3', finca_id: 2362, estado: EstadoLote.INACTIVO, cargado: false }, // Vacío

  // Lote 5 - Campo Alegre (finca_id: 2362) - Patrón denso
  // Línea 1 - Horizontal (Sur-Norte)
  { nombre_spot: 'L5L1S1', lat: 7.863330, lng: -76.633620, lote_id: 5, linea: 1, posicion: 1, nombre_planta: 'L5L1P1', finca_id: 2362, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'L5L1S2', lat: 7.863380, lng: -76.633620, lote_id: 5, linea: 1, posicion: 2, nombre_planta: 'L5L1P2', finca_id: 2362, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'L5L1S3', lat: 7.863430, lng: -76.633620, lote_id: 5, linea: 1, posicion: 3, nombre_planta: 'L5L1P3', finca_id: 2362, estado: EstadoLote.EN_CRECIMIENTO, cargado: false }, // Vacío
  { nombre_spot: 'L5L1S4', lat: 7.863480, lng: -76.633620, lote_id: 5, linea: 1, posicion: 4, nombre_planta: 'L5L1P4', finca_id: 2362, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'L5L1S5', lat: 7.863530, lng: -76.633620, lote_id: 5, linea: 1, posicion: 5, nombre_planta: 'L5L1P5', finca_id: 2362, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },

  // Línea 2 - Diagonal (Noroeste-Sureste)
  { nombre_spot: 'L5L2S1', lat: 7.863330, lng: -76.633570, lote_id: 5, linea: 2, posicion: 1, nombre_planta: 'L5L2P1', finca_id: 2362, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'L5L2S2', lat: 7.863380, lng: -76.633560, lote_id: 5, linea: 2, posicion: 2, nombre_planta: 'L5L2P2', finca_id: 2362, estado: EstadoLote.EN_CRECIMIENTO, cargado: false }, // Vacío
  { nombre_spot: 'L5L2S3', lat: 7.863430, lng: -76.633550, lote_id: 5, linea: 2, posicion: 3, nombre_planta: 'L5L2P3', finca_id: 2362, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'L5L2S4', lat: 7.863480, lng: -76.633540, lote_id: 5, linea: 2, posicion: 4, nombre_planta: 'L5L2P4', finca_id: 2362, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'L5L2S5', lat: 7.863530, lng: -76.633530, lote_id: 5, linea: 2, posicion: 5, nombre_planta: 'L5L2P5', finca_id: 2362, estado: EstadoLote.EN_CRECIMIENTO, cargado: false }, // Vacío
];

// Mock de archivos CSV
export let mockCsvFiles: CsvFile[] = [
  {
    id: '1',
    filename: 'clientes.csv',
    size: 245680,
    uploadDate: '2024-01-15T10:30:00Z',
    status: 'completed',
    rowCount: 150,
  },
  {
    id: '2',
    filename: 'productos.csv',
    size: 123456,
    uploadDate: '2024-01-20T14:20:00Z',
    status: 'processing',
    rowCount: 85,
  },
  {
    id: '3',
    filename: 'ventas.csv',
    size: 456789,
    uploadDate: '2024-02-01T09:15:00Z',
    status: 'completed',
    rowCount: 320,
  },
];

// Mock de preview de CSV
export const mockCsvPreview: CsvPreviewData = {
  headers: ['id', 'nombre', 'email', 'telefono', 'ciudad'],
  rows: [
    { id: '1', nombre: 'Juan Pérez', email: 'juan@example.com', telefono: '3001234567', ciudad: 'Bogotá' },
    { id: '2', nombre: 'María García', email: 'maria@example.com', telefono: '3002345678', ciudad: 'Medellín' },
    { id: '3', nombre: 'Carlos López', email: 'carlos@example.com', telefono: '3003456789', ciudad: 'Cali' },
    { id: '4', nombre: 'Ana Martínez', email: 'ana@example.com', telefono: '3004567890', ciudad: 'Barranquilla' },
  ],
  totalRows: 150,
};

// Mock de fincas (desde backend)
export const mockFincasRaw = [
  {
    key: 'finca_id',
    grupo: 'Prueba_Fincas',
    sigla: 'PRB_F',
    moneda: 'COP',
    nombre: '1 - Palmita',
    pago_dia: 47450,
    key_value: 2362,
    tipo_sujeto_id: 1,
    tipo_cultivo_id: 2,
  },
  {
    key: 'finca_id',
    grupo: 'Prueba_Fincas',
    sigla: 'PRB_F',
    moneda: 'COP',
    nombre: '1 - Camelias',
    pago_dia: 47450,
    key_value: 2364,
    tipo_sujeto_id: 1,
    tipo_cultivo_id: 2,
  },
  {
    key: 'finca_id',
    grupo: 'Prueba_Fincas',
    sigla: 'PRB_F',
    moneda: 'COP',
    nombre: '1 - Campiña',
    pago_dia: 47450,
    key_value: 2365,
    tipo_sujeto_id: 1,
    tipo_cultivo_id: 2,
  },
];


