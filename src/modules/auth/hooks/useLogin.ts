import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '@/core/store/authStore';
import { authServices } from '../services/authServices';
import { LoginCredentials } from '@/core/types/auth.types';

export default function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authServices.login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success('¡Bienvenido!');
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al iniciar sesión');
    },
  });

  return {
    handleLogin: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}

