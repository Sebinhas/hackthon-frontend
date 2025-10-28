import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '@/core/store/authStore';
import { authServices } from '../services/authServices';
import { RegisterCredentials } from '@/core/types/auth.types';

export default function useRegister() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) => authServices.register(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success('¡Registro exitoso!');
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al registrarse');
    },
  });

  return {
    handleRegister: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}

