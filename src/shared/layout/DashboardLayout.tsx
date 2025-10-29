import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, Home, Users, Upload, ChevronDown, User as UserIcon, Building, Layers } from 'lucide-react';
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
    { icon: Upload, label: 'Subir CSV', path: '/dashboard/upload-file' },
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 fixed w-full z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <Link to="/dashboard" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-primary-600">Plant Template</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-2">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(user?.id || user?.email || '')}`}>
                        {getInitials(user?.firstName || user?.email || '')}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">{getFirstName(user)}</span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    Perfil (próximamente)
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2 text-red-600" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {isSidebarOpen && (
          <aside className="w-64 bg-white border-r border-gray-200 fixed h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActiveRoute(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>
        )}

        <main
          className={`flex-1 p-8 ${
            isSidebarOpen ? 'ml-64' : 'ml-0'
          } transition-all duration-300`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
function getFirstName(user: any): string {
  if (!user) return '';
  if (user.firstName) return user.firstName.trim().split(' ')[0];
  if (user.email) return String(user.email).split('@')[0];
  return '';
}

function getInitials(value: string): string {
  if (!value) return '';
  const first = value.trim()[0]?.toUpperCase() || '';
  return first;
}

function getAvatarColor(seed: string): string {
  const colors = [
    'bg-[#AA0F16]',
    'bg-rose-600',
    'bg-amber-600',
    'bg-emerald-600',
    'bg-sky-600',
    'bg-indigo-600',
    'bg-fuchsia-600',
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

