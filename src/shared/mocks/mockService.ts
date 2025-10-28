import { Usuario, UsuarioPayload } from '@/modules/dashboard/usuarios/types/usuarios.types';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '@/core/types/auth.types';
import { CsvFile, CsvUploadResponse, CsvPreviewData } from '@/modules/uploadFile/types/uploadFile.types';
import { mockUsuarios, mockAuthResponse, mockCsvFiles, mockCsvPreview } from './mockData';

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
    
    // Cualquier email/password funciona en modo mock
    if (credentials.email && credentials.password) {
      return mockAuthResponse;
    }
    
    throw new Error('Credenciales inválidas');
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    await delay();
    
    // Simular registro exitoso
    return {
      ...mockAuthResponse,
      user: {
        ...mockAuthResponse.user,
        name: credentials.name,
        email: credentials.email,
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
    
    // Verificar si el email ya existe
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
    
    // Verificar email duplicado (si se está cambiando)
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
  subirArchivoCsv: async (file: File): Promise<CsvUploadResponse> => {
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
    
    // Simular preview de archivo
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
};

