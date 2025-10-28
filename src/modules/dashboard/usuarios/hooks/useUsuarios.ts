import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usuariosService } from '../services/usuarios.service';
import { Usuario, UsuarioPayload } from '../types/usuarios.types';
import {
  ActionsCell,
  StatusCell,
  RoleCell,
  AvatarCell,
} from '../components/UsuariosCellTemplates';

// Hooks React Query Base
export const useObtenerUsuarios = () => {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: () => usuariosService.obtenerUsuarios(),
  });
};

export const useObtenerUsuario = (id: string) => {
  return useQuery({
    queryKey: ['usuarios', id],
    queryFn: () => usuariosService.obtenerUsuario(id),
    enabled: !!id,
  });
};

export const useCrearUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UsuarioPayload) => usuariosService.crearUsuario(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Usuario creado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useActualizarUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<UsuarioPayload> }) =>
      usuariosService.actualizarUsuario(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Usuario actualizado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useEliminarUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usuariosService.eliminarUsuario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Usuario eliminado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Hook de Página Principal (Lista)
export const useUsuariosPage = () => {
  const navigate = useNavigate();
  const { data: usuarios = [], isLoading } = useObtenerUsuarios();
  const eliminarUsuario = useEliminarUsuario();
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<string | null>(null);

  const handleEdit = (usuario: Usuario) => {
    navigate(`/dashboard/usuarios/edit/${usuario.id}`);
  };

  const handleDeleteConfirm = () => {
    if (usuarioAEliminar) {
      eliminarUsuario.mutate(usuarioAEliminar);
      setUsuarioAEliminar(null);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Usuario',
      render: (usuario: Usuario) => AvatarCell({ usuario }),
    },
    {
      key: 'role',
      header: 'Rol',
      render: (usuario: Usuario) => RoleCell({ role: usuario.role }),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (usuario: Usuario) => StatusCell({ status: usuario.status }),
    },
    {
      key: 'createdAt',
      header: 'Fecha de Registro',
      render: (usuario: Usuario) =>
        new Date(usuario.createdAt).toLocaleDateString('es-ES'),
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (usuario: Usuario) =>
        ActionsCell({
          usuario,
          onEdit: handleEdit,
          onDelete: setUsuarioAEliminar,
        }),
    },
  ];

  return {
    usuarios,
    isLoading,
    columns,
    usuarioAEliminar,
    setUsuarioAEliminar,
    handleDeleteConfirm,
    isDeleting: eliminarUsuario.isPending,
    navigate,
  };
};


