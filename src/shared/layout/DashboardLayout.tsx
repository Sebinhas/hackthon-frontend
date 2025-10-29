import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, Home, Users, Upload, ChevronDown, User as UserIcon, Building, MapPin, Layers } from 'lucide-react';
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

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearAuth } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const menuItems = [
    { icon: Home, label: 'Inicio', path: '/dashboard/home' },
    { icon: Users, label: 'Usuarios', path: '/dashboard/usuarios' },
    { icon: Building, label: 'Fincas', path: '/dashboard/fincas' },
    { icon: Layers, label: 'Lotes', path: '/dashboard/lotes' },
    { icon: MapPin, label: 'Mapa', path: '/dashboard/mapa' },
    { icon: Upload, label: 'Subir CSV', path: '/dashboard/upload-file' },
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="h-9 w-9 text-neutral-700  hover:opacity-80"
              aria-label={isSidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-2 transition-opacity hover:opacity-80"
            >
              <span className="text-xl font-semibold tracking-tight text-[#AA0F16]">
                Plant Template
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="h-auto px-3 py-2 hover:bg-neutral-100"
                  aria-label="Menú de usuario"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-medium transition-transform hover:scale-105",
                      getAvatarColor(user?.id || user?.email || '')
                    )}>
                      {getInitials(user?.firstName || user?.email || '')}
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5">
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
                    <p className="text-xs leading-none text-muted-foreground">
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

      <div className="flex pt-16">
        <aside
          className={cn(
            "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-neutral-200/80 transition-transform duration-300 ease-in-out overflow-y-auto",
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
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:opacity-80",
                    isActive
                      ? "bg-[#AA0F16] text-white shadow-sm"
                      : "text-neutral-700 hover:text-[#AA0F16]"
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

        <main
          className={cn(
            "flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out",
            isSidebarOpen ? "ml-64" : "ml-0"
          )}
        >
          <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
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
