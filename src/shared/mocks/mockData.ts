import { LoteMock, Finca as LoteFinca, Planta, EstadoLote, Linea } from '@/modules/dashboard/mapa/types/lotes.types';
import { CsvFile, CsvPreviewData } from '@/modules/uploadFile/types/uploadFile.types';


// Mock de Lotes - Campo Alegre, Apartadó, Antioquia
export const mockLotes: LoteMock[] = [
  // Lote 33986 (84-MANCHIS) - Finca Palmita - Datos reales desde API
  {
    id_local: "1",
    id_remoto: 33986,
    codigo: "84-MANCHIS",
    nombre: "84-MANCHIS",
    descripcion: "Lote 84-MANCHIS de la finca Palmita",
    finca_id: 2372,
    finca_externa_id: 2372,
    coordenadas_geojson: {
      type: "Polygon",
      coordinates: [[
        [-73.631380000000, 3.854161000000],
        [-73.631213000000, 3.854062000000],
        [-73.630960000000, 3.853906000000],
        [-73.630773000000, 3.853776000000],
        [-73.630646000000, 3.853724000000],
        [-73.630534000000, 3.853674000000],
        [-73.630365000000, 3.853636000000],
        [-73.630274000000, 3.853604000000],
        [-73.630186000000, 3.853581000000],
        [-73.630087000000, 3.853564000000],
        [-73.629946000000, 3.853544000000],
        [-73.629796000000, 3.853535000000],
        [-73.629692000000, 3.853530000000],
        [-73.629613000000, 3.853532000000],
        [-73.629465000000, 3.853542000000],
        [-73.629365000000, 3.853541000000],
        [-73.629264000000, 3.853547000000],
        [-73.629118000000, 3.853552000000],
        [-73.628992000000, 3.853543000000],
        [-73.628801000000, 3.853530000000],
        [-73.628536000000, 3.853523000000],
        [-73.628755000000, 3.853149000000],
        [-73.629083000000, 3.852473000000],
        [-73.629393000000, 3.851881000000],
        [-73.629600000000, 3.851434000000],
        [-73.629720000000, 3.851180000000],
        [-73.632145000000, 3.852198000000],
        [-73.632172000000, 3.852185000000],
        [-73.632411000000, 3.852274000000],
        [-73.631536000000, 3.853739000000],
        [-73.631583000000, 3.853811000000],
        [-73.632054000000, 3.854086000000],
        [-73.632042000000, 3.854146000000],
        [-73.631952000000, 3.854454000000],
        [-73.631605000000, 3.854260000000],
        [-73.631344000000, 3.854704000000],
        [-73.631483000000, 3.854780000000],
        [-73.631889000000, 3.855045000000],
        [-73.631731000000, 3.855686000000],
        [-73.631590000000, 3.856147000000],
        [-73.631389000000, 3.856721000000],
        [-73.630247000000, 3.856260000000],
        [-73.630143000000, 3.856219000000],
        [-73.630009000000, 3.856156000000],
        [-73.629851000000, 3.856088000000],
        [-73.629583000000, 3.855990000000],
        [-73.629458000000, 3.855966000000],
        [-73.629374000000, 3.856020000000],
        [-73.629288000000, 3.856146000000],
        [-73.629222000000, 3.856262000000],
        [-73.629157000000, 3.856364000000],
        [-73.629091000000, 3.856418000000],
        [-73.629001000000, 3.856453000000],
        [-73.628909000000, 3.856456000000],
        [-73.628794000000, 3.856447000000],
        [-73.628676000000, 3.856449000000],
        [-73.628572000000, 3.856435000000],
        [-73.628414000000, 3.856428000000],
        [-73.628337000000, 3.856430000000],
        [-73.628242000000, 3.856435000000],
        [-73.628183000000, 3.855987000000],
        [-73.628131000000, 3.855600000000],
        [-73.628025000000, 3.855023000000],
        [-73.627983000000, 3.854661000000],
        [-73.628398000000, 3.853839000000],
        [-73.628810000000, 3.853870000000],
        [-73.629270000000, 3.853935000000],
        [-73.629785000000, 3.853919000000],
        [-73.630168000000, 3.853989000000],
        [-73.630589000000, 3.854220000000],
        [-73.630857000000, 3.854393000000],
        [-73.631160000000, 3.854524000000],
        [-73.631338000000, 3.854227000000],
        [-73.631380000000, 3.854161000000] // Cerrar polígono (primer punto repetido)
      ]]
    },
    area_hectareas: 0,
    perimetro_metros: 0,
    altitud_msnm: 0,
    cultivo: { id: "cultivo-1", nombre: "Plátano", tipo_cultivo_id: 2 },
    estado: EstadoLote.EN_CRECIMIENTO,
    actividades: { ultima_fecha: "2025-10-27", proxima: "Mantenimiento" },
    suelo: { tipo: "FRANCO", ph: 6.5, topografia: "PLANO" },
    infraestructura: { sistema_riego: "GOTEO", tiene_cerca: true, tiene_sombra: false, acceso_vehicular: true },
    referencia_externa: { grupo: "4 - Palmita", sigla: "4-PLM", tipo_sujeto_id: 3, fuente: "API externa" },
    metadatos: { fecha_creacion: "2025-10-27", fecha_ultima_modificacion: "2025-10-27", notas: "Lote con coordenadas reales", timestamp_sincronizacion: "2025-10-27T16:27:56Z" }
  },
  // Lotes adicionales de Finca Palmita (2372) - Sin coordenadas aún
  {
    id_local: "2",
    id_remoto: 33987,
    codigo: "85-CANDELARIA",
    nombre: "85-CANDELARIA",
    descripcion: "Lote 85-CANDELARIA de la finca Palmita",
    finca_id: 2372,
    finca_externa_id: 2372,
    coordenadas_geojson: {
      type: "Polygon",
      coordinates: [[]] // Sin coordenadas aún
    },
    area_hectareas: 0,
    perimetro_metros: 0,
    altitud_msnm: 0,
    cultivo: { id: "cultivo-1", nombre: "Plátano", tipo_cultivo_id: 2 },
    estado: EstadoLote.EN_CRECIMIENTO,
    actividades: { ultima_fecha: "2025-10-27", proxima: "Mantenimiento" },
    suelo: { tipo: "FRANCO", ph: 6.5, topografia: "PLANO" },
    infraestructura: { sistema_riego: "GOTEO", tiene_cerca: true, tiene_sombra: false, acceso_vehicular: true },
    referencia_externa: { grupo: "4 - Palmita", sigla: "4-PLM", tipo_sujeto_id: 3, fuente: "API externa" },
    metadatos: { fecha_creacion: "2025-10-27", fecha_ultima_modificacion: "2025-10-27", notas: "Lote sin coordenadas", timestamp_sincronizacion: "2025-10-27T00:00:00Z" }
  },
  {
    id_local: "3",
    id_remoto: 33988,
    codigo: "86-EMPERATRIZ",
    nombre: "86-EMPERATRIZ",
    descripcion: "Lote 86-EMPERATRIZ de la finca Palmita",
    finca_id: 2372,
    finca_externa_id: 2372,
    coordenadas_geojson: {
      type: "Polygon",
      coordinates: [[]]
    },
    area_hectareas: 0,
    perimetro_metros: 0,
    altitud_msnm: 0,
    cultivo: { id: "cultivo-1", nombre: "Plátano", tipo_cultivo_id: 2 },
    estado: EstadoLote.EN_CRECIMIENTO,
    actividades: { ultima_fecha: "2025-10-27", proxima: "Mantenimiento" },
    suelo: { tipo: "FRANCO", ph: 6.5, topografia: "PLANO" },
    infraestructura: { sistema_riego: "GOTEO", tiene_cerca: true, tiene_sombra: false, acceso_vehicular: true },
    referencia_externa: { grupo: "4 - Palmita", sigla: "4-PLM", tipo_sujeto_id: 3, fuente: "API externa" },
    metadatos: { fecha_creacion: "2025-10-27", fecha_ultima_modificacion: "2025-10-27", notas: "Lote sin coordenadas", timestamp_sincronizacion: "2025-10-27T00:00:00Z" }
  },
  {
    id_local: "4",
    id_remoto: 33989,
    codigo: "90-LOS TOROS",
    nombre: "90-LOS TOROS",
    descripcion: "Lote 90-LOS TOROS de la finca Palmita",
    finca_id: 2372,
    finca_externa_id: 2372,
    coordenadas_geojson: {
      type: "Polygon",
      coordinates: [[]]
    },
    area_hectareas: 0,
    perimetro_metros: 0,
    altitud_msnm: 0,
    cultivo: { id: "cultivo-1", nombre: "Plátano", tipo_cultivo_id: 2 },
    estado: EstadoLote.EN_CRECIMIENTO,
    actividades: { ultima_fecha: "2025-10-27", proxima: "Mantenimiento" },
    suelo: { tipo: "FRANCO", ph: 6.5, topografia: "PLANO" },
    infraestructura: { sistema_riego: "GOTEO", tiene_cerca: true, tiene_sombra: false, acceso_vehicular: true },
    referencia_externa: { grupo: "4 - Palmita", sigla: "4-PLM", tipo_sujeto_id: 3, fuente: "API externa" },
    metadatos: { fecha_creacion: "2025-10-27", fecha_ultima_modificacion: "2025-10-27", notas: "Lote sin coordenadas", timestamp_sincronizacion: "2025-10-27T00:00:00Z" }
  },
  {
    id_local: "5",
    id_remoto: 33990,
    codigo: "87-SABANAS",
    nombre: "87-SABANAS",
    descripcion: "Lote 87-SABANAS de la finca Palmita",
    finca_id: 2372,
    finca_externa_id: 2372,
    coordenadas_geojson: {
      type: "Polygon",
      coordinates: [[]]
    },
    area_hectareas: 0,
    perimetro_metros: 0,
    altitud_msnm: 0,
    cultivo: { id: "cultivo-1", nombre: "Plátano", tipo_cultivo_id: 2 },
    estado: EstadoLote.EN_CRECIMIENTO,
    actividades: { ultima_fecha: "2025-10-27", proxima: "Mantenimiento" },
    suelo: { tipo: "FRANCO", ph: 6.5, topografia: "PLANO" },
    infraestructura: { sistema_riego: "GOTEO", tiene_cerca: true, tiene_sombra: false, acceso_vehicular: true },
    referencia_externa: { grupo: "4 - Palmita", sigla: "4-PLM", tipo_sujeto_id: 3, fuente: "API externa" },
    metadatos: { fecha_creacion: "2025-10-27", fecha_ultima_modificacion: "2025-10-27", notas: "Lote sin coordenadas", timestamp_sincronizacion: "2025-10-27T00:00:00Z" }
  },
  {
    id_local: "6",
    id_remoto: 33991,
    codigo: "88-HORIZONTE",
    nombre: "88-HORIZONTE",
    descripcion: "Lote 88-HORIZONTE de la finca Palmita",
    finca_id: 2372,
    finca_externa_id: 2372,
    coordenadas_geojson: {
      type: "Polygon",
      coordinates: [[]]
    },
    area_hectareas: 0,
    perimetro_metros: 0,
    altitud_msnm: 0,
    cultivo: { id: "cultivo-1", nombre: "Plátano", tipo_cultivo_id: 2 },
    estado: EstadoLote.EN_CRECIMIENTO,
    actividades: { ultima_fecha: "2025-10-27", proxima: "Mantenimiento" },
    suelo: { tipo: "FRANCO", ph: 6.5, topografia: "PLANO" },
    infraestructura: { sistema_riego: "GOTEO", tiene_cerca: true, tiene_sombra: false, acceso_vehicular: true },
    referencia_externa: { grupo: "4 - Palmita", sigla: "4-PLM", tipo_sujeto_id: 3, fuente: "API externa" },
    metadatos: { fecha_creacion: "2025-10-27", fecha_ultima_modificacion: "2025-10-27", notas: "Lote sin coordenadas", timestamp_sincronizacion: "2025-10-27T00:00:00Z" }
  },
  {
    id_local: "7",
    id_remoto: 33992,
    codigo: "89-CORRAL",
    nombre: "89-CORRAL",
    descripcion: "Lote 89-CORRAL de la finca Palmita",
    finca_id: 2372,
    finca_externa_id: 2372,
    coordenadas_geojson: {
      type: "Polygon",
      coordinates: [[]]
    },
    area_hectareas: 0,
    perimetro_metros: 0,
    altitud_msnm: 0,
    cultivo: { id: "cultivo-1", nombre: "Plátano", tipo_cultivo_id: 2 },
    estado: EstadoLote.EN_CRECIMIENTO,
    actividades: { ultima_fecha: "2025-10-27", proxima: "Mantenimiento" },
    suelo: { tipo: "FRANCO", ph: 6.5, topografia: "PLANO" },
    infraestructura: { sistema_riego: "GOTEO", tiene_cerca: true, tiene_sombra: false, acceso_vehicular: true },
    referencia_externa: { grupo: "4 - Palmita", sigla: "4-PLM", tipo_sujeto_id: 3, fuente: "API externa" },
    metadatos: { fecha_creacion: "2025-10-27", fecha_ultima_modificacion: "2025-10-27", notas: "Lote sin coordenadas", timestamp_sincronizacion: "2025-10-27T00:00:00Z" }
  },
  // Lotes de Finca Camelias (2373)
  {
    id_local: "8",
    id_remoto: 34055,
    codigo: "28 A",
    nombre: "28 A",
    descripcion: "Lote 28 A de la finca Camelias",
    finca_id: 2373,
    finca_externa_id: 2373,
    coordenadas_geojson: {
      type: "Polygon",
      coordinates: [[]]
    },
    area_hectareas: 0,
    perimetro_metros: 0,
    altitud_msnm: 0,
    cultivo: { id: "cultivo-1", nombre: "Plátano", tipo_cultivo_id: 2 },
    estado: EstadoLote.EN_CRECIMIENTO,
    actividades: { ultima_fecha: "2025-10-27", proxima: "Mantenimiento" },
    suelo: { tipo: "FRANCO", ph: 6.5, topografia: "PLANO" },
    infraestructura: { sistema_riego: "GOTEO", tiene_cerca: true, tiene_sombra: false, acceso_vehicular: true },
    referencia_externa: { grupo: "4 - Camelias", sigla: "4-CAM", tipo_sujeto_id: 3, fuente: "API externa" },
    metadatos: { fecha_creacion: "2025-10-27", fecha_ultima_modificacion: "2025-10-27", notas: "Lote sin coordenadas", timestamp_sincronizacion: "2025-10-27T00:00:00Z" }
  },
  {
    id_local: "9",
    id_remoto: 34056,
    codigo: "28 B",
    nombre: "28 B",
    descripcion: "Lote 28 B de la finca Camelias",
    finca_id: 2373,
    finca_externa_id: 2373,
    coordenadas_geojson: {
      type: "Polygon",
      coordinates: [[]]
    },
    area_hectareas: 0,
    perimetro_metros: 0,
    altitud_msnm: 0,
    cultivo: { id: "cultivo-1", nombre: "Plátano", tipo_cultivo_id: 2 },
    estado: EstadoLote.EN_CRECIMIENTO,
    actividades: { ultima_fecha: "2025-10-27", proxima: "Mantenimiento" },
    suelo: { tipo: "FRANCO", ph: 6.5, topografia: "PLANO" },
    infraestructura: { sistema_riego: "GOTEO", tiene_cerca: true, tiene_sombra: false, acceso_vehicular: true },
    referencia_externa: { grupo: "4 - Camelias", sigla: "4-CAM", tipo_sujeto_id: 3, fuente: "API externa" },
    metadatos: { fecha_creacion: "2025-10-27", fecha_ultima_modificacion: "2025-10-27", notas: "Lote sin coordenadas", timestamp_sincronizacion: "2025-10-27T00:00:00Z" }
  },
  // Lotes de Finca Campiña (2374)
  {
    id_local: "10",
    id_remoto: 34028,
    codigo: "63-CERCA ELECTRICA",
    nombre: "63-CERCA ELECTRICA",
    descripcion: "Lote 63-CERCA ELECTRICA de la finca Campiña",
    finca_id: 2374,
    finca_externa_id: 2374,
    coordenadas_geojson: {
      type: "Polygon",
      coordinates: [[]]
    },
    area_hectareas: 0,
    perimetro_metros: 0,
    altitud_msnm: 0,
    cultivo: { id: "cultivo-1", nombre: "Plátano", tipo_cultivo_id: 2 },
    estado: EstadoLote.EN_CRECIMIENTO,
    actividades: { ultima_fecha: "2025-10-27", proxima: "Mantenimiento" },
    suelo: { tipo: "FRANCO", ph: 6.5, topografia: "PLANO" },
    infraestructura: { sistema_riego: "GOTEO", tiene_cerca: true, tiene_sombra: false, acceso_vehicular: true },
    referencia_externa: { grupo: "4 - Campiña", sigla: "4-CAP", tipo_sujeto_id: 3, fuente: "API externa" },
    metadatos: { fecha_creacion: "2025-10-27", fecha_ultima_modificacion: "2025-10-27", notas: "Lote sin coordenadas", timestamp_sincronizacion: "2025-10-27T00:00:00Z" }
  },
  {
    id_local: "11",
    id_remoto: 34029,
    codigo: "62-LA CEIBA",
    nombre: "62-LA CEIBA",
    descripcion: "Lote 62-LA CEIBA de la finca Campiña",
    finca_id: 2374,
    finca_externa_id: 2374,
    coordenadas_geojson: {
      type: "Polygon",
      coordinates: [[]]
    },
    area_hectareas: 0,
    perimetro_metros: 0,
    altitud_msnm: 0,
    cultivo: { id: "cultivo-1", nombre: "Plátano", tipo_cultivo_id: 2 },
    estado: EstadoLote.EN_CRECIMIENTO,
    actividades: { ultima_fecha: "2025-10-27", proxima: "Mantenimiento" },
    suelo: { tipo: "FRANCO", ph: 6.5, topografia: "PLANO" },
    infraestructura: { sistema_riego: "GOTEO", tiene_cerca: true, tiene_sombra: false, acceso_vehicular: true },
    referencia_externa: { grupo: "4 - Campiña", sigla: "4-CAP", tipo_sujeto_id: 3, fuente: "API externa" },
    metadatos: { fecha_creacion: "2025-10-27", fecha_ultima_modificacion: "2025-10-27", notas: "Lote sin coordenadas", timestamp_sincronizacion: "2025-10-27T00:00:00Z" }
  },
  {
    id_local: "12",
    id_remoto: 34030,
    codigo: "67-CASA ROJA",
    nombre: "67-CASA ROJA",
    descripcion: "Lote 67-CASA ROJA de la finca Campiña",
    finca_id: 2374,
    finca_externa_id: 2374,
    coordenadas_geojson: {
      type: "Polygon",
      coordinates: [[]]
    },
    area_hectareas: 0,
    perimetro_metros: 0,
    altitud_msnm: 0,
    cultivo: { id: "cultivo-1", nombre: "Plátano", tipo_cultivo_id: 2 },
    estado: EstadoLote.EN_CRECIMIENTO,
    actividades: { ultima_fecha: "2025-10-27", proxima: "Mantenimiento" },
    suelo: { tipo: "FRANCO", ph: 6.5, topografia: "PLANO" },
    infraestructura: { sistema_riego: "GOTEO", tiene_cerca: true, tiene_sombra: false, acceso_vehicular: true },
    referencia_externa: { grupo: "4 - Campiña", sigla: "4-CAP", tipo_sujeto_id: 3, fuente: "API externa" },
    metadatos: { fecha_creacion: "2025-10-27", fecha_ultima_modificacion: "2025-10-27", notas: "Lote sin coordenadas", timestamp_sincronizacion: "2025-10-27T00:00:00Z" }
  },
  {
    id_local: "13",
    id_remoto: 34031,
    codigo: "83 - EL MIRADOR",
    nombre: "83 - EL MIRADOR",
    descripcion: "Lote 83 - EL MIRADOR de la finca Campiña",
    finca_id: 2374,
    finca_externa_id: 2374,
    coordenadas_geojson: {
      type: "Polygon",
      coordinates: [[]]
    },
    area_hectareas: 0,
    perimetro_metros: 0,
    altitud_msnm: 0,
    cultivo: { id: "cultivo-1", nombre: "Plátano", tipo_cultivo_id: 2 },
    estado: EstadoLote.EN_CRECIMIENTO,
    actividades: { ultima_fecha: "2025-10-27", proxima: "Mantenimiento" },
    suelo: { tipo: "FRANCO", ph: 6.5, topografia: "PLANO" },
    infraestructura: { sistema_riego: "GOTEO", tiene_cerca: true, tiene_sombra: false, acceso_vehicular: true },
    referencia_externa: { grupo: "4 - Campiña", sigla: "4-CAP", tipo_sujeto_id: 3, fuente: "API externa" },
    metadatos: { fecha_creacion: "2025-10-27", fecha_ultima_modificacion: "2025-10-27", notas: "Lote sin coordenadas", timestamp_sincronizacion: "2025-10-27T00:00:00Z" }
  }
];

// Mock de Fincas (LoteFinca type from lotes module)
// Fincas reales desde API
export const mockFincas: LoteFinca[] = [
  {
    key: 'finca_id',
    grupo: 'Prueba_Fincas',
    sigla: 'PRB_F',
    moneda: 'COP',
    nombre: '4 - Palmita',
    pago_dia: 47450,
    key_value: 2372,
    tipo_sujeto_id: 1,
    tipo_cultivo_id: 2,
    lote_id: '33986',
  },
  {
    key: 'finca_id',
    grupo: 'Prueba_Fincas',
    sigla: 'PRB_F',
    moneda: 'COP',
    nombre: '4 - Camelias',
    pago_dia: 47450,
    key_value: 2373,
    tipo_sujeto_id: 1,
    tipo_cultivo_id: 2,
    lote_id: '34055',
  },
  {
    key: 'finca_id',
    grupo: 'Prueba_Fincas',
    sigla: 'PRB_F',
    moneda: 'COP',
    nombre: '4 - Campiña',
    pago_dia: 47450,
    key_value: 2374,
    tipo_sujeto_id: 1,
    tipo_cultivo_id: 2,
    lote_id: '34028',
  }
];


// Mock de Líneas - Coordenadas ajustadas para quedar dentro de cada lote
// Lote 1: lng: -76.633285 a -76.633485, lat: 7.863594 a 7.863794
export const mockLineas: Linea[] = [
  // Lote 1 - Línea 1 (Horizontal Norte-Sur)
  { 
    id: 1, 
    nombre: 'Línea 1 - Principal', 
    descripcion: 'Línea principal del lote', 
    finca_id: 2362, 
    coordenadas: [
      { lat: 7.863620, lng: -76.633400 },
      { lat: 7.863640, lng: -76.633400 },
      { lat: 7.863660, lng: -76.633400 },
      { lat: 7.863680, lng: -76.633400 },
      { lat: 7.863700, lng: -76.633400 },
      { lat: 7.863720, lng: -76.633400 }
    ] 
  },
  // Lote 1 - Línea 2 (Vertical Este-Oeste)
  { 
    id: 2, 
    nombre: 'Línea 2 - Transversal', 
    descripcion: 'Línea transversal', 
    finca_id: 2362, 
    coordenadas: [
      { lat: 7.863650, lng: -76.633430 },
      { lat: 7.863650, lng: -76.633410 },
      { lat: 7.863650, lng: -76.633390 },
      { lat: 7.863650, lng: -76.633370 },
      { lat: 7.863650, lng: -76.633350 },
      { lat: 7.863650, lng: -76.633330 }
    ] 
  },
  // Lote 1 - Línea 3 (Diagonal)
  { 
    id: 3, 
    nombre: 'Línea 3 - Diagonal', 
    descripcion: 'Línea diagonal', 
    finca_id: 2362, 
    coordenadas: [
      { lat: 7.863600, lng: -76.633450 },
      { lat: 7.863620, lng: -76.633440 },
      { lat: 7.863640, lng: -76.633430 },
      { lat: 7.863660, lng: -76.633420 },
      { lat: 7.863680, lng: -76.633410 },
      { lat: 7.863700, lng: -76.633400 }
    ] 
  },
  // Lote 2 - Línea 1 (usando id único pero se mapea por número de línea del spot)
  { 
    id: 10,  // ID único para evitar conflictos, se mapea usando lote_id + línea número
    nombre: 'Línea 1 - Lote 2', 
    descripcion: 'Línea principal Lote 2', 
    finca_id: 2362, 
    coordenadas: [
      { lat: 7.863530, lng: -76.633300 },
      { lat: 7.863570, lng: -76.633290 },
      { lat: 7.863610, lng: -76.633280 },
      { lat: 7.863640, lng: -76.633270 }
    ] 
  },
  // Lote 2 - Línea 2
  { 
    id: 11, 
    nombre: 'Línea 2 - Lote 2', 
    descripcion: 'Línea secundaria Lote 2', 
    finca_id: 2362, 
    coordenadas: [
      { lat: 7.863540, lng: -76.633250 },
      { lat: 7.863570, lng: -76.633250 },
      { lat: 7.863600, lng: -76.633250 },
      { lat: 7.863630, lng: -76.633250 }
    ] 
  },
];
// Mock de Plantas (spots) - Datos reales desde API
// Spots del Lote 33986 (84-MANCHIS) - Finca Palmita (2372)
// Coordenadas ajustadas para quedar dentro del polígono del lote 33986
// Usando coordenadas reales del polígono del lote distribuidos según patrón de spots
export const mockPlantas: Planta[] = [
  // Línea 101 - Ordenados por posicion ascendente
  { nombre_spot: 'S4401401', lat: 3.854524, lng: -73.631160, lote_id: 33986, linea: 101, posicion: 13, nombre_planta: 'P4401401', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'S4401402', lat: 3.854161, lng: -73.631380, lote_id: 33986, linea: 101, posicion: 14, nombre_planta: 'P4401402', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  
  // Línea 102 - Ordenados por posicion ascendente
  { nombre_spot: 'S4401610', lat: 3.854086, lng: -73.632042, lote_id: 33986, linea: 102, posicion: 12, nombre_planta: 'P4401610', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'S4401609', lat: 3.854393, lng: -73.630857, lote_id: 33986, linea: 102, posicion: 13, nombre_planta: 'P4401609', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'S4401403', lat: 3.854227, lng: -73.631338, lote_id: 33986, linea: 102, posicion: 14, nombre_planta: 'P4401403', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'S4401404', lat: 3.854062, lng: -73.631213, lote_id: 33986, linea: 102, posicion: 15, nombre_planta: 'P4401404', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  
  // Línea 103 - Ordenados por posicion ascendente
  { nombre_spot: 'S4401601', lat: 3.853811, lng: -73.631583, lote_id: 33986, linea: 103, posicion: 13, nombre_planta: 'P4401601', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'S4401600', lat: 3.853739, lng: -73.631536, lote_id: 33986, linea: 103, posicion: 14, nombre_planta: 'P4401600', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'S4401406', lat: 3.853906, lng: -73.630960, lote_id: 33986, linea: 103, posicion: 15, nombre_planta: 'P4401406', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  
  // Línea 104 - Ordenados por posicion ascendente
  { nombre_spot: 'S4401583', lat: 3.853935, lng: -73.629270, lote_id: 33986, linea: 104, posicion: 12, nombre_planta: 'P4401583', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'S4401581', lat: 3.854260, lng: -73.631605, lote_id: 33986, linea: 104, posicion: 13, nombre_planta: 'P4401581', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'S4401405', lat: 3.853776, lng: -73.630773, lote_id: 33986, linea: 104, posicion: 14, nombre_planta: 'P4401405', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  
  // Línea 105 - Ordenados por posicion ascendente
  { nombre_spot: 'S4401582', lat: 3.853839, lng: -73.628398, lote_id: 33986, linea: 105, posicion: 13, nombre_planta: 'P4401582', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'S4401411', lat: 3.854146, lng: -73.632042, lote_id: 33986, linea: 105, posicion: 14, nombre_planta: 'P4401411', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'S4401408', lat: 3.853724, lng: -73.630646, lote_id: 33986, linea: 105, posicion: 15, nombre_planta: 'P4401408', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  
  // Línea 106 - Ordenados por posicion ascendente
  { nombre_spot: 'S4401421', lat: 3.854661, lng: -73.627983, lote_id: 33986, linea: 106, posicion: 12, nombre_planta: 'P4401421', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'S4401410', lat: 3.853660, lng: -73.627983, lote_id: 33986, linea: 106, posicion: 13, nombre_planta: 'P4401410', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'S4401407', lat: 3.853674, lng: -73.630534, lote_id: 33986, linea: 106, posicion: 14, nombre_planta: 'P4401407', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  
  // Línea 107 - Ordenados por posicion ascendente
  { nombre_spot: 'S4401413', lat: 3.854661, lng: -73.627983, lote_id: 33986, linea: 107, posicion: 13, nombre_planta: 'P4401413', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  { nombre_spot: 'S4401409', lat: 3.853581, lng: -73.630186, lote_id: 33986, linea: 107, posicion: 14, nombre_planta: 'P4401409', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
  
  // Línea 108 - Ordenados por posicion ascendente
  { nombre_spot: 'S4401412', lat: 3.855600, lng: -73.628131, lote_id: 33986, linea: 108, posicion: 12, nombre_planta: 'P4401412', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO, cargado: true },
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

// Mock de fincas (legacy - mantener para compatibilidad, pero usar mockFincas)
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


