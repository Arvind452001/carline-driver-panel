import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '@/components/layout/PublicNavbar';

export function AuthLayout() {
  return (
    <div className="min-h-screen w-full relative overflow-x-hidden flex flex-col justify-between">
      <PublicNavbar />
      <div className="w-full flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}