import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  DollarSign,
  MapPin,
  Clock,
  Star,
  Receipt,
  User,
  HelpCircle,
  Bell,
  Settings,
  LogOut,
  X,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.webp';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/driver-manager', label: 'Driver Manager', icon: Users },
  { path: '/earnings', label: 'Today Earnings', icon: DollarSign },
  { path: '/trips', label: 'Trips', icon: MapPin },
  { path: '/online-hours', label: 'Online Hours', icon: Clock },
  { path: '/rating', label: 'Rating', icon: Star },
  { path: '/transactions', label: 'Transactions', icon: Receipt },
];

const bottomItems = [
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/support', label: 'Support', icon: HelpCircle },
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function DriverSidebar({ isOpen, onClose }: SidebarProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 w-64 select-none shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Header Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="Carline Logo" className="h-8 w-auto object-contain" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block leading-tight">
              Driver Portal
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100">
        <div className="px-3 pb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Main Menu
          </span>
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 outline-none focus:outline-none ring-0',
                isActive
                  ? 'bg-orange-50 text-[#FF5B26] font-semibold border-r-2 border-[#FF5B26] shadow-sm shadow-orange-500/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-[#FF5B26]' : 'text-gray-400 group-hover:text-gray-600'
                  )}
                  strokeWidth={isActive ? 2.3 : 2}
                />
                <span className="truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Secondary section */}
        <div className="border-t border-gray-100 my-4 pt-4">
          <div className="px-3 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Account & Support
            </span>
          </div>

          {bottomItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 outline-none focus:outline-none ring-0',
                  isActive
                    ? 'bg-orange-50 text-[#FF5B26] font-semibold border-r-2 border-[#FF5B26] shadow-sm shadow-orange-500/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-[#FF5B26]' : 'text-gray-400 group-hover:text-gray-600'
                    )}
                    strokeWidth={isActive ? 2.3 : 2}
                  />
                  <span className="truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Legal & Logout */}
        <div className="border-t border-gray-100 pt-3 space-y-1">
          <NavLink
            to="/privacy-policy"
            onClick={onClose}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
          >
            <span>Privacy Policy</span>
          </NavLink>
          <NavLink
            to="/terms"
            onClick={onClose}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
          >
            <span>Terms & Conditions</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Driver Mini Card at bottom */}
      <div className="p-3 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-gray-100 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-orange-100 text-[#FF5B26] flex items-center justify-center font-bold text-xs">
            {(user?.name || 'D').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gray-900 truncate">
              {user?.name || 'Carline Driver'}
            </p>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified Driver
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop permanent sidebar */}
      <aside className="hidden md:block fixed inset-y-0 left-0 z-30">{content}</aside>

      {/* Mobile overlay sidebar */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs animate-fadeIn" onClick={onClose}>
          <div className="absolute left-0 top-0 h-full animate-slideInLeft" onClick={(e) => e.stopPropagation()}>
            {content}
          </div>
        </div>
      )}
    </>
  );
}