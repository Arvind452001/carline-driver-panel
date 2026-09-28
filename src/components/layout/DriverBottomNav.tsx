import { NavLink } from 'react-router-dom';
import { Home, MapPin, DollarSign, User, Power } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/trips', label: 'Trips', icon: MapPin },
  { path: '/earnings', label: 'Earnings', icon: DollarSign },
  { path: '/profile', label: 'Profile', icon: User },
];

export function DriverBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-40">
      <div className="flex justify-around items-center h-16">
        {items.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => cn('bottom-nav-link', isActive && 'bottom-nav-link-active')}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
        <button className="bottom-nav-link text-primary-500">
          <Power className="w-5 h-5" />
          <span>Go Online</span>
        </button>
      </div>
    </nav>
  );
}