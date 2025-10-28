import { Usuario } from '@/modules/dashboard/usuarios/types/usuarios.types';
import { User, AuthResponse } from '@/core/types/auth.types';

// Mock de usuarios
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
  {
    id: '4',
    name: 'Ana Martínez',
    email: 'ana@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: '2024-02-10T16:45:00Z',
    updatedAt: '2024-02-10T16:45:00Z',
  },
  {
    id: '5',
    name: 'Pedro Sánchez',
    email: 'pedro@example.com',
    role: 'editor',
    status: 'active',
    createdAt: '2024-02-15T11:30:00Z',
    updatedAt: '2024-02-15T11:30:00Z',
  },
];

// Mock de usuario autenticado
export const mockAuthUser: User = {
  id: '1',
  name: 'Admin Demo',
  email: 'admin@demo.com',
  role: 'admin',
  createdAt: '2024-01-01T00:00:00Z',
};

// Mock de respuesta de autenticación
export const mockAuthResponse: AuthResponse = {
  token: 'mock-jwt-token-123456789',
  user: mockAuthUser,
};


