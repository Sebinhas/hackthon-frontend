import { Usuario, UsuarioPayload } from '@/modules/dashboard/usuarios/types/usuarios.types';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '@/core/types/auth.types';
import { CsvFile, CsvUploadResponse, CsvPreviewData, Finca } from '@/modules/uploadFile/types/uploadFile.types';
import { mockUsuarios, mockAuthResponse, mockCsvFiles, mockCsvPreview, mockFincasRaw } from './mockData';

// Simular delay de red
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Generar ID único
const generateId = () => Math.random().toString(36).substr(2, 9);

// Storage en memoria para los usuarios
let usuarios = [...mockUsuarios];

export const mockService = {
  // Auth
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay();
    
    if (credentials.email && credentials.password) {
      return mockAuthResponse;
    }
    
    throw new Error('Credenciales inválidas');
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    await delay();
    
    return {
      ...mockAuthResponse,
      data: {
        ...mockAuthResponse.data,
        user: {
          ...mockAuthResponse.data.user,
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          email: credentials.email,
        },
      },
    };
  },

  // Usuarios CRUD
  obtenerUsuarios: async (): Promise<Usuario[]> => {
    await delay(300);
    return [...usuarios];
  },

  obtenerUsuario: async (id: string): Promise<Usuario> => {
    await delay(300);
    const usuario = usuarios.find(u => u.id === id);
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    
    return usuario;
  },

  crearUsuario: async (payload: UsuarioPayload): Promise<Usuario> => {
    await delay(500);
    
    if (usuarios.some(u => u.email === payload.email)) {
      throw new Error('El email ya está en uso');
    }
    
    const nuevoUsuario: Usuario = {
      id: generateId(),
      name: payload.name,
      email: payload.email,
      role: payload.role,
      status: payload.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    usuarios.push(nuevoUsuario);
    return nuevoUsuario;
  },

  actualizarUsuario: async (id: string, payload: Partial<UsuarioPayload>): Promise<Usuario> => {
    await delay(500);
    
    const index = usuarios.findIndex(u => u.id === id);
    
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    if (payload.email && payload.email !== usuarios[index].email) {
      if (usuarios.some(u => u.email === payload.email && u.id !== id)) {
        throw new Error('El email ya está en uso');
      }
    }
    
    usuarios[index] = {
      ...usuarios[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    
    return usuarios[index];
  },

  eliminarUsuario: async (id: string): Promise<void> => {
    await delay(400);
    
    const index = usuarios.findIndex(u => u.id === id);
    
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    usuarios.splice(index, 1);
  },

  // Upload File CSV
  subirArchivoCsv: async (file: File, fincaId?: number): Promise<CsvUploadResponse> => {
    await delay(800);
    
    const nuevoArchivo: CsvFile = {
      id: generateId(),
      filename: file.name,
      size: file.size,
      uploadDate: new Date().toISOString(),
      status: 'completed',
      rowCount: Math.floor(Math.random() * 500) + 10,
    };
    
    mockCsvFiles.push(nuevoArchivo);
    
    return {
      id: nuevoArchivo.id,
      filename: nuevoArchivo.filename,
      status: nuevoArchivo.status,
      message: 'Archivo subido exitosamente',
    };
  },

  obtenerArchivosCsv: async (): Promise<CsvFile[]> => {
    await delay(300);
    return [...mockCsvFiles];
  },

  obtenerArchivoCsv: async (id: string): Promise<CsvFile> => {
    await delay(300);
    const archivo = mockCsvFiles.find(f => f.id === id);
    
    if (!archivo) {
      throw new Error('Archivo no encontrado');
    }
    
    return archivo;
  },

  obtenerPreviewArchivo: async (id: string): Promise<CsvPreviewData> => {
    await delay(400);
    
    if (id) {
      return mockCsvPreview;
    }
    
    throw new Error('Archivo no encontrado');
  },

  eliminarArchivoCsv: async (id: string): Promise<void> => {
    await delay(400);
    
    const index = mockCsvFiles.findIndex(f => f.id === id);
    
    if (index === -1) {
      throw new Error('Archivo no encontrado');
    }
    
    mockCsvFiles.splice(index, 1);
  },

  // Fincas
  obtenerFincas: async (): Promise<Finca[]> => {
    await delay(300);
    return mockFincasRaw.map((f) => ({
      key: f.key,
      grupo: f.grupo,
      sigla: f.sigla,
      moneda: f.moneda,
      nombre: f.nombre,
      pagoDia: f.pago_dia,
      keyValue: f.key_value,
      tipoSujetoId: f.tipo_sujeto_id,
      tipoCultivoId: f.tipo_cultivo_id,
    }));
  },

  // Lotes válidos por finca (mock simplificado)
  obtenerLotesValidosPorFinca: async (fincaId: number): Promise<string[]> => {
    await delay(300);
    
    // Mock: Retornar algunos lotes de ejemplo basados en fincaId
    // En producción esto vendría del backend
    const lotesPorFinca: Record<number, string[]> = {
      2362: ['LOTE-001', 'LOTE-002', 'LOTE-003'],
      2364: ['LOTE-004', 'LOTE-005'],
      2365: ['LOTE-006', 'LOTE-007', 'LOTE-008', 'LOTE-009'],
    };
    
    return lotesPorFinca[fincaId] || ['LOTE-DEFAULT'];
  },
};

