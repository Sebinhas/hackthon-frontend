import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/shared/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useLogin from '../hooks/useLogin';

const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { handleLogin, isLoading } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: LoginFormData) => {
    handleLogin(data);
  };

  return (
    <AuthLayout isLogin={true}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">Iniciar Sesión</h2>
          <p className="text-neutral-600 text-sm">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-neutral-700 flex items-center gap-2">
              <Mail className="h-4 w-4 text-neutral-500" />
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="tu@ejemplo.com"
              className="h-12 transition-all duration-200 focus:border-[#AA0F16] focus:ring-2 focus:ring-[#AA0F16]/20"
              {...register('email')}
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-600 flex items-center gap-1"
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>

          {/* Contraseña */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-neutral-700 flex items-center gap-2">
              <Lock className="h-4 w-4 text-neutral-500" />
              Contraseña
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="h-12 pr-10 transition-all duration-200 focus:border-[#AA0F16] focus:ring-2 focus:ring-[#AA0F16]/20"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors duration-200 focus:outline-none focus:text-[#AA0F16]"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-600 flex items-center gap-1"
              >
                {errors.password.message}
              </motion.p>
            )}
          </div>

          {/* Olvidé mi contraseña */}
          <div className="flex justify-end">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-[#AA0F16] hover:text-[#8B0C12] transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Botón de envío */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#AA0F16] hover:bg-[#8B0C12] text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Iniciando sesión...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continuar
                <ArrowRight className="h-5 w-5" />
              </span>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-neutral-500">o</span>
          </div>
        </div>

        {/* Link de registro */}
        <div className="text-center">
          <p className="text-sm text-neutral-600">
            ¿No tienes cuenta?{' '}
            <Link
              to="/auth/register"
              className="font-semibold text-[#AA0F16] hover:text-[#8B0C12] transition-colors duration-200 inline-flex items-center gap-1"
            >
              Crear cuenta
              <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  );
}

