import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Loader2, ArrowRight, Shield } from 'lucide-react';
import AuthLayout from '@/shared/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useRegister from '../hooks/useRegister';

const registerSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido').min(1, 'Email requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const { handleRegister, isLoading } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: RegisterFormData) => {
    handleRegister(data);
  };

  return (
    <AuthLayout isLogin={false}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">Crear Cuenta</h2>
          <p className="text-neutral-600 text-sm">
            Completa tus datos para comenzar
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* First Name */}
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-neutral-700 flex items-center gap-2">
              <User className="h-4 w-4 text-neutral-500" />
              Nombre
            </label>
            <Input
              id="firstName"
              type="text"
              placeholder="Juan"
              className="h-12 transition-all duration-200 focus:border-[#AA0F16] focus:ring-2 focus:ring-[#AA0F16]/20"
              {...register('firstName')}
            />
            {errors.firstName && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-600 flex items-center gap-1"
              >
                {errors.firstName.message}
              </motion.p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-neutral-700 flex items-center gap-2">
              <User className="h-4 w-4 text-neutral-500" />
              Apellido
            </label>
            <Input
              id="lastName"
              type="text"
              placeholder="Pérez"
              className="h-12 transition-all duration-200 focus:border-[#AA0F16] focus:ring-2 focus:ring-[#AA0F16]/20"
              {...register('lastName')}
            />
            {errors.lastName && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-600 flex items-center gap-1"
              >
                {errors.lastName.message}
              </motion.p>
            )}
          </div>

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
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="h-12 transition-all duration-200 focus:border-[#AA0F16] focus:ring-2 focus:ring-[#AA0F16]/20"
              {...register('password')}
            />
            {errors.password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-600 flex items-center gap-1"
              >
                {errors.password.message}
              </motion.p>
            )}
            <p className="text-xs text-neutral-500 flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Mínimo 8 caracteres
            </p>
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
                Creando cuenta...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Crear cuenta
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

        {/* Link de inicio de sesión */}
        <div className="text-center">
          <p className="text-sm text-neutral-600">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/auth/login"
              className="font-semibold text-[#AA0F16] hover:text-[#8B0C12] transition-colors duration-200 inline-flex items-center gap-1"
            >
              Iniciar sesión
              <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  );
}

