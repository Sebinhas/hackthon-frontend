import { useNavigate } from 'react-router-dom';
import { useCrearLote } from './useLotes';

export const useCreateLotesPage = () => {
  const navigate = useNavigate();
  const crearLote = useCrearLote();

  const handleSubmit = (data: any) => {
    crearLote.mutate(data, {
      onSuccess: () => {
        navigate('/dashboard/lotes');
      },
    });
  };

  const handleCancel = () => {
    navigate('/dashboard/lotes');
  };

  return {
    handleSubmit,
    handleCancel,
    isLoading: crearLote.isPending,
  };
};

