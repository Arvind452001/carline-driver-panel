import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { Footer } from '@/components/layout/Footer';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}