import { Outlet } from 'react-router-dom';
import DashboardLayout from '@/shared/layout/DashboardLayout';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

