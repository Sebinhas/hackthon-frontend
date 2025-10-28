import { Usuario } from '@/modules/dashboard/usuarios/types/usuarios.types';
import { Lote, Finca as LoteFinca, Planta, EstadoLote, TipoSuelo, Topografia, SistemaRiego } from '@/modules/dashboard/lotes/types/lotes.types';
import { User, AuthResponse } from '@/core/types/auth.types';
import { CsvFile, CsvPreviewData } from '@/modules/uploadFile/types/uploadFile.types';

export const mockUsuarios: Usuario[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria@example.com',
    role: 'editor',
    status: 'active',
    createdAt: '2024-01-20T14:20:00Z',
    updatedAt: '2024-01-20T14:20:00Z',
  },
  {
    id: '3',
    name: 'Carlos López',
    email: 'carlos@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z',
  },
];

export const mockAuthUser: User = {
  id: '1',
  firstName: 'Admin',
  lastName: 'Demo',
  email: 'admin@demo.com',
  role: 'admin',
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

export const mockAuthResponse: AuthResponse = {
  status: 200,
  message: 'Login successful',
  data: {
    user: mockAuthUser,
    access_token: 'mock-token',
  },
};

// Mock de Lotes
export const mockLotes: Lote[] = [
  {
    id: '1',
    codigo: 'LOTE-001',
    nombre: 'Lote Norte',
    descripcion: 'Lote principal al norte de la finca',
    finca_id: 2372,
    coordenadas: [
      { lat: 4.6098, lng: -74.08175 },
      { lat: 4.6100, lng: -74.08175 },
      { lat: 4.6100, lng: -74.08185 },
      { lat: 4.6098, lng: -74.08185 },
    ],
    area_hectareas: 2.5,
    perimetro_metros: 1200,
    altitud_msnm: 2650,
    cultivo_id: 'cultivo-1',
    cultivo_nombre: 'Rosa',
    estado: EstadoLote.EN_CRECIMIENTO,
    fecha_ultima_actividad: new Date('2024-01-15'),
    proxima_actividad: 'Fertilización',
    tipo_suelo: TipoSuelo.FRANCO,
    ph_suelo: 6.5,
    topografia: Topografia.ONDULADO,
    sistema_riego: SistemaRiego.GOTEO,
    tiene_cerca: true,
    tiene_sombra: false,
    acceso_vehicular: true,
    fecha_creacion: new Date('2024-01-01'),
    fecha_ultima_modificacion: new Date('2024-01-15'),
    notas: 'Lote en excelente estado',
  },
  {
    id: '2',
    codigo: 'LOTE-002',
    nombre: 'Lote Sur',
    descripcion: 'Lote secundario al sur',
    finca_id: 2374,
    coordenadas: [
      { lat: 4.6095, lng: -74.08190 },
      { lat: 4.6097, lng: -74.08190 },
      { lat: 4.6097, lng: -74.08200 },
      { lat: 4.6095, lng: -74.08200 },
    ],
    area_hectareas: 1.8,
    perimetro_metros: 950,
    altitud_msnm: 2640,
    cultivo_id: 'cultivo-2',
    cultivo_nombre: 'Clavel',
    estado: EstadoLote.EN_COSECHA,
    fecha_ultima_actividad: new Date('2024-01-20'),
    proxima_actividad: 'Cosecha',
    tipo_suelo: TipoSuelo.ARCILLOSO,
    ph_suelo: 6.0,
    topografia: Topografia.PLANO,
    sistema_riego: SistemaRiego.ASPERSION,
    tiene_cerca: true,
    tiene_sombra: false,
    acceso_vehicular: true,
    fecha_creacion: new Date('2024-01-01'),
    fecha_ultima_modificacion: new Date('2024-01-20'),
    notas: 'Requiere atención en riego',
  },
];

// Mock de Fincas (LoteFinca type from lotes module)
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
    lote_id: '1', // Asociada al Lote Norte
  },
  {
    key: 'finca_id',
    grupo: 'Prueba_Fincas',
    sigla: 'PRB_F2',
    moneda: 'COP',
    nombre: '5 - El Rosal',
    pago_dia: 52000,
    key_value: 2373,
    tipo_sujeto_id: 1,
    tipo_cultivo_id: 2,
    lote_id: '1',
  },
  {
    key: 'finca_id',
    grupo: 'Prueba_Fincas',
    sigla: 'PRB_F3',
    moneda: 'COP',
    nombre: '6 - La Esperanza',
    pago_dia: 45000,
    key_value: 2374,
    tipo_sujeto_id: 1,
    tipo_cultivo_id: 2,
    lote_id: '2', // Asociada al Lote Sur
  },
];

// Mock de Plantas
export const mockPlantas: Planta[] = [
  // Plantas de la finca Palmita (finca_id: 2372)
  { nombre_spot: 'L29347L50S1', lat: 4.6098, lng: -74.08175, lote_id: 1, linea: 1, posicion: 1, nombre_planta: 'L29347L50P1', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO },
  { nombre_spot: 'L29347L50S2', lat: 4.6098, lng: -74.08180, lote_id: 1, linea: 1, posicion: 2, nombre_planta: 'L29347L50P2', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO },
  { nombre_spot: 'L29347L50S3', lat: 4.6098, lng: -74.08185, lote_id: 1, linea: 1, posicion: 3, nombre_planta: 'L29347L50P3', finca_id: 2372, estado: EstadoLote.EN_COSECHA },
  { nombre_spot: 'L29347L50S4', lat: 4.6099, lng: -74.08175, lote_id: 1, linea: 2, posicion: 1, nombre_planta: 'L29347L50P4', finca_id: 2372, estado: EstadoLote.EN_CRECIMIENTO },
  { nombre_spot: 'L29347L50S5', lat: 4.6099, lng: -74.08180, lote_id: 1, linea: 2, posicion: 2, nombre_planta: 'L29347L50P5', finca_id: 2372, estado: EstadoLote.EN_COSECHA },
  { nombre_spot: 'L29347L50S6', lat: 4.6099, lng: -74.08185, lote_id: 1, linea: 2, posicion: 3, nombre_planta: 'L29347L50P6', finca_id: 2372, estado: EstadoLote.EN_COSECHA },
  // Plantas de la finca El Rosal (finca_id: 2373)
  { nombre_spot: 'L29348L50S1', lat: 4.60995, lng: -74.08175, lote_id: 1, linea: 3, posicion: 1, nombre_planta: 'L29348L50P1', finca_id: 2373, estado: EstadoLote.EN_CRECIMIENTO },
  { nombre_spot: 'L29348L50S2', lat: 4.60995, lng: -74.08180, lote_id: 1, linea: 3, posicion: 2, nombre_planta: 'L29348L50P2', finca_id: 2373, estado: EstadoLote.EN_COSECHA },
  { nombre_spot: 'L29348L50S3', lat: 4.60995, lng: -74.08185, lote_id: 1, linea: 3, posicion: 3, nombre_planta: 'L29348L50P3', finca_id: 2373, estado: EstadoLote.EN_COSECHA },
  { nombre_spot: 'L29348L50S4', lat: 4.61000, lng: -74.08175, lote_id: 1, linea: 4, posicion: 1, nombre_planta: 'L29348L50P4', finca_id: 2373, estado: EstadoLote.EN_MANTENIMIENTO },
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


