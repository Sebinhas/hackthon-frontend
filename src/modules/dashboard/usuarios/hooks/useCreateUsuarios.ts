import { useNavigate } from 'react-router-dom';
import { useCrearUsuario } from './useUsuarios';

export const useCreateUsuariosPage = () => {
  const navigate = useNavigate();
  const crearUsuario = useCrearUsuario();

  const handleSubmit = (data: any) => {
    const { confirmPassword, ...payload } = data;
    crearUsuario.mutate(payload, {
      onSuccess: () => {
        navigate('/dashboard/usuarios');
      },
    });
  };

  const handleCancel = () => {
    navigate('/dashboard/usuarios');
  };

  return {
    handleSubmit,
    handleCancel,
    isLoading: crearUsuario.isPending,
  };
};

