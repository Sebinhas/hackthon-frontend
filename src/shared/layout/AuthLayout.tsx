import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import fondoAuth from '../../assets/auth/fondo_auth.webp';

interface AuthLayoutProps {
  children: ReactNode;
  isLogin?: boolean;
}

export default function AuthLayout({ children, isLogin = false }: AuthLayoutProps) {
  const location = useLocation();
  const isLoginPage = isLogin || location.pathname.includes('/login');

  return (
    <div className="min-h-screen flex">
      {/* Imagen de fondo - Solo visible en desktop */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-[#AA0F16] to-[#8B0C12]">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${fondoAuth})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
          }}
        />
        
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#AA0F16]/100 to-[#8B0C12]/50" />
        
        {/* Contenido de bienvenida */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-4">
              {isLoginPage ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
            </h1>
            <p className="text-lg opacity-95 mb-8">
              {isLoginPage
                ? 'Accede a tu cuenta para continuar con tu trabajo'
                : 'Únete a nosotros y comienza tu viaje hoy'}
            </p>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <div className="h-1 w-12 bg-white rounded-full" />
              <span>Seguro y confiable</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Panel del formulario */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-28 bg-neutral-50">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Logo y navegación */}
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-lg bg-[#AA0F16] flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-xl font-bold text-neutral-900">Plant Template</span>
            </Link>
          </div>

          {/* Formulario */}
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
            {children}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-600">
              © 2024 Plant Template. Todos los derechos reservados.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

