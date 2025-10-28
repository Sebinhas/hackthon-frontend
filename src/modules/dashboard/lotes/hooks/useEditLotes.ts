import { useNavigate } from 'react-router-dom';
import { useObtenerLote, useActualizarLote } from './useLotes';

export const useEditLotesPage = (id: string) => {
  const navigate = useNavigate();
  const { data: lote, isLoading: isLoadingLote } = useObtenerLote(id);
  const actualizarLote = useActualizarLote();

  const handleSubmit = (data: any) => {
    actualizarLote.mutate(
      { id, payload: data },
      {
        onSuccess: () => {
          navigate('/dashboard/lotes');
        },
      }
    );
  };

  const handleCancel = () => {
    navigate('/dashboard/lotes');
  };

  return {
    lote,
    isLoadingLote,
    handleSubmit,
    handleCancel,
    isUpdating: actualizarLote.isPending,
  };
};

