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
import LotesListView from '@/modules/dashboard/lotes/pages/LotesListView';
import LoteCreateView from '@/modules/dashboard/lotes/pages/LoteCreateView';
import LoteDetailView from '@/modules/dashboard/lotes/pages/LoteDetailView';
import LoteEditView from '@/modules/dashboard/lotes/pages/LoteEditView';
import Fincas from '@/modules/dashboard/fincas/pages/Fincas';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import UploadFile from '@/modules/uploadFile/pages/UploadFile';

export default function AppRoutes() {
  const loadAuthFromStorage = useAuthStore((state: any) => state.loadAuthFromStorage);

  useEffect(() => {
    loadAuthFromStorage();
  }, [loadAuthFromStorage]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/auth/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      
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

        {/* Fincas */}
        <Route path="fincas" element={<Fincas />} />

        {/* Upload CSV */}
        <Route path="upload-file" element={<UploadFile />} />
        
        {/* Lotes */}
        <Route path="lotes" element={<LotesListView />} />
        <Route path="lotes/nuevo" element={<LoteCreateView />} />
        <Route path="lotes/:id" element={<LoteDetailView />} />
        <Route path="lotes/:id/editar" element={<LoteEditView />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

