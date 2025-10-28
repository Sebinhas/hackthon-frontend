import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/core/store/authStore';
import Landing from '@/modules/landing/pages/Landing';
import Login from '@/modules/auth/pages/Login';
import Register from '@/modules/auth/pages/Register';
import Dashboard from '@/modules/dashboard/Dashboard';
import DashboardHome from '@/modules/dashboard/home/pages/Home';
import Usuarios from '@/modules/dashboard/usuarios/pages/Usuarios';
import CreateUsuarios from '@/modules/dashboard/usuarios/pages/CreateUsuarios';
import EditUsuarios from '@/modules/dashboard/usuarios/pages/EditUsuarios';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  const loadAuthFromStorage = useAuthStore((state: any) => state.loadAuthFromStorage);

  useEffect(() => {
    loadAuthFromStorage();
  }, [loadAuthFromStorage]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard/home" replace />} />
        <Route path="home" element={<DashboardHome />} />

        {/* Usuarios */}
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="usuarios/create" element={<CreateUsuarios />} />
        <Route path="usuarios/edit/:id" element={<EditUsuarios />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

