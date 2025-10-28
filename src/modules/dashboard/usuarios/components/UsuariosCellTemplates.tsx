import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Usuario } from '../types/usuarios.types';

interface ActionsCellProps {
  usuario: Usuario;
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: string) => void;
}

export function ActionsCell({ usuario, onEdit, onDelete }: ActionsCellProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          •••
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(usuario)}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(usuario.id)}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function StatusCell({ status }: { status: 'active' | 'inactive' }) {
  const isActive = status === 'active';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
      }`}
    >
      {isActive ? 'Activo' : 'Inactivo'}
    </span>
  );
}

export function RoleCell({ role }: { role: 'admin' | 'user' | 'editor' }) {
  const roleConfig = {
    admin: { label: 'Administrador', color: 'bg-purple-100 text-purple-800' },
    user: { label: 'Usuario', color: 'bg-blue-100 text-blue-800' },
    editor: { label: 'Editor', color: 'bg-yellow-100 text-yellow-800' },
  };

  const config = roleConfig[role];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
}

export function AvatarCell({ usuario }: { usuario: Usuario }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-medium text-primary">
        {usuario.name.charAt(0).toUpperCase()}
      </div>
      <div>
        <div className="font-medium">{usuario.name}</div>
        <div className="text-sm text-muted-foreground">{usuario.email}</div>
      </div>
    </div>
  );
}

