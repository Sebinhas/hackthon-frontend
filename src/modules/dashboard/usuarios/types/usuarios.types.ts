export interface Usuario {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'editor';
  status: 'active' | 'inactive';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsuarioPayload {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user' | 'editor';
  status: 'active' | 'inactive';
}

export interface UsuarioFormData extends UsuarioPayload {
  confirmPassword?: string;
}

