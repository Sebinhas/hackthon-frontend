import { useNavigate } from 'react-router-dom';
import { useObtenerUsuario, useActualizarUsuario } from './useUsuarios';

export const useEditUsuariosPage = (id: string) => {
  const navigate = useNavigate();
  const { data: usuario, isLoading: isLoadingUsuario } = useObtenerUsuario(id);
  const actualizarUsuario = useActualizarUsuario();

  const handleSubmit = (data: any) => {
    const { password, confirmPassword, ...payload } = data;
    
    actualizarUsuario.mutate(
      { id, payload },
      {
        onSuccess: () => {
          navigate('/dashboard/usuarios');
        },
      }
    );
  };

  const handleCancel = () => {
    navigate('/dashboard/usuarios');
  };

  return {
    usuario,
    isLoadingUsuario,
    handleSubmit,
    handleCancel,
    isUpdating: actualizarUsuario.isPending,
  };
};

