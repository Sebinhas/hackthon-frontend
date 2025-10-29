import { ReactNode, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, Home, ChevronDown, User as UserIcon, Building, MapPin, Layers, HelpCircle } from 'lucide-react';
import { useAuthStore } from '@/core/store/authStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/shared/utils/cn';
import { useTour, TourStep } from '@/shared/hooks/useTour';
import logo from '@/assets/landing/Logo.png';
interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearAuth } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { startTour, shouldShowTour, stopTour } = useTour();

  // Establecer estado inicial basado en el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      // Solo ajustar en desktop si el usuario no ha establecido una preferencia
      if (window.innerWidth >= 1024) {
        // En desktop, por defecto está abierto (pero el usuario puede cerrarlo)
        const savedState = localStorage.getItem('sidebar-open');
        if (savedState === null) {
          setIsSidebarOpen(true);
        } else {
          setIsSidebarOpen(savedState === 'true');
        }
      } else {
        // En móvil, siempre cerrado
        setIsSidebarOpen(false);
      }
    };

    // Establecer estado inicial
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Guardar preferencia del usuario cuando cambia el estado
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      localStorage.setItem('sidebar-open', String(isSidebarOpen));
    }
  }, [isSidebarOpen]);

  // Cerrar sidebar en móvil cuando cambia la ruta
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const menuItems = [
    { icon: Home, label: 'Inicio', path: '/dashboard/home', tourId: 'tour-home', description: 'Aquí encontrarás un resumen general del sistema y estadísticas importantes' },
    { icon: Building, label: 'Fincas', path: '/dashboard/fincas', tourId: 'tour-fincas', description: 'Gestiona todas tus fincas: crea, edita y visualiza la información de cada una' },
    { icon: Layers, label: 'Lotes', path: '/dashboard/lotes', tourId: 'tour-lotes', description: 'Administra los lotes de tus fincas, visualiza coordenadas y gestiona la información detallada' },
    { icon: MapPin, label: 'Geodatos', path: '/dashboard/mapa', tourId: 'tour-geodatos', description: 'Visualiza tus fincas y lotes en mapas interactivos con información geográfica detallada' },
  ];

  const handleStartTour = () => {
    const steps = menuItems.map((item, index): TourStep => {
      let side: 'top' | 'right' | 'bottom' | 'left' = 'right';
      if (index === 0) {
        side = 'right';
      } else if (index === menuItems.length - 1) {
        side = 'left';
      } else {
        side = 'right';
      }

      return {
        element: `[data-tour="${item.tourId}"]`,
        popover: {
          title: item.label,
          description: item.description,
          side,
          align: 'start' as const,
        },
      };
    });

    // Agregar paso del botón de ayuda
    steps.push({
      element: '[data-tour="tour-help-button"]',
      popover: {
        title: '¿Necesitas ayuda?',
        description: 'Puedes iniciar este recorrido guiado en cualquier momento haciendo clic en este botón de ayuda',
        side: 'bottom' as const,
        align: 'start' as const,
      },
    });

    startTour(steps);
  };

  useEffect(() => {
    const checkAndStartTour = () => {
      if (shouldShowTour() && isSidebarOpen && window.innerWidth >= 1024) {
        const timer = setTimeout(() => {
          handleStartTour();
        }, 1000);
        return () => clearTimeout(timer);
      }
    };
    checkAndStartTour();
  }, []);

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200/80 backdrop-blur-sm">
        <div className="flex h-14 md:h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="h-8 w-8 md:h-9 md:w-9 text-neutral-700 hover:opacity-80"
              aria-label={isSidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isSidebarOpen ? <X className="h-4 w-4 md:h-5 md:w-5" /> : <Menu className="h-4 w-4 md:h-5 md:w-5" />}
            </Button>
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-2 transition-opacity hover:opacity-80"
            >

              <img src={logo} alt="Logo" className="w-10 h-10" />
              <span className="text-xl font-bold text-[#AA0F16]">AgroSyner</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="h-auto px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-neutral-100"
                  aria-label="Menú de usuario"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={cn(
                      "h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium transition-transform hover:scale-105",
                      getAvatarColor(user?.id || user?.email || '')
                    )}>
                      {getInitials(user?.firstName || user?.email || '')}
                    </div>
                    <div className="hidden md:flex items-center gap-1.5">
                      <span className="text-sm font-medium text-neutral-700">
                        {getFirstName(user)}
                      </span>
                      <ChevronDown className="h-4 w-4 text-neutral-500" />
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Mi cuenta</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user?.email || 'Usuario'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer focus:bg-neutral-100"
                  disabled
                >
                  <UserIcon className="h-4 w-4 text-neutral-500" />
                  <span className="text-neutral-600">Perfil (próximamente)</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer text-[#AA0F16] focus:text-[#AA0F16] focus:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex pt-14 md:pt-16">
        {/* Overlay para móvil */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar Desktop - Controlado por estado */}
        <aside
          className={cn(
            "hidden lg:block fixed left-0 top-14 md:top-16 w-64 bg-white border-r border-neutral-200/80 overflow-y-auto",
            "h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] z-40",
            "transition-transform duration-300 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = isActiveRoute(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  data-tour={item.tourId}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:opacity-80",
                    isActive
                      ? "bg-[#AA0F16] text-white shadow-sm"
                      : "text-neutral-700 hover:bg-neutral-50 hover:text-[#AA0F16]"
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors",
                    isActive ? "text-white" : "text-neutral-500"
                  )} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Sidebar Móvil - Drawer */}
        <aside
          className={cn(
            "lg:hidden fixed left-0 top-14 md:top-16 z-40 w-64 bg-white border-r border-neutral-200/80 overflow-y-auto",
            "h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)]",
            "transition-transform duration-300 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="p-3 sm:p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = isActiveRoute(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  data-tour={item.tourId}
                  onClick={() => {
                    setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:opacity-80",
                    isActive
                      ? "bg-[#AA0F16] text-white shadow-sm"
                      : "text-neutral-700 hover:bg-neutral-50 hover:text-[#AA0F16]"
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className={cn(
                    "h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 transition-colors",
                    isActive ? "text-white" : "text-neutral-500"
                  )} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 w-full min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out",
            // En desktop, el margin cambia según si el sidebar está abierto
            isSidebarOpen ? "lg:ml-64" : "lg:ml-0",
            // En móvil, no tiene margin
            "ml-0"
          )}
        >
          <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full relative">
            {children}
          </div>
        </main>
      </div>

      {/* Botón flotante de ayuda */}
      <Button
        data-tour="tour-help-button"
        onClick={handleStartTour}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-[#AA0F16] hover:bg-[#8B0C12] text-white shadow-lg hover:shadow-xl transition-all duration-200 z-40 flex items-center justify-center"
        aria-label="Iniciar recorrido guiado"
      >
        <HelpCircle className="h-6 w-6" />
      </Button>
    </div>
  );
}

function getFirstName(user: any): string {
  if (!user) return 'Usuario';
  if (user.firstName) return user.firstName.trim().split(' ')[0];
  if (user.email) return String(user.email).split('@')[0];
  return 'Usuario';
}

function getInitials(value: string): string {
  if (!value) return 'U';
  const first = value.trim()[0]?.toUpperCase() || 'U';
  return first;
}

function getAvatarColor(seed: string): string {
  const colors = [
    'bg-[#AA0F16]',
    'bg-[#8B0C12]',
    'bg-[#6D0910]',
    'bg-rose-700',
    'bg-rose-800',
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}
