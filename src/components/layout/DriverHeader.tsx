import { Menu, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
  userName: string;
  userAvatar?: string;
  notificationCount: number;
}

export function DriverHeader({
  onMenuClick,
  userName,
  userAvatar,
  notificationCount,
}: HeaderProps) {
  const isOnline = localStorage.getItem('driver_is_online') === 'true';

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
              Good Day, {userName}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  isOnline
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                  }`}
                />
                {isOnline ? 'Duty Online' : 'Duty Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/notifications"
            className="relative p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute 1.5 top-1.5 -right-0.5 w-4 h-4 bg-[#FF5B26] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors"
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-orange-500/20"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF5B26] flex items-center justify-center font-bold text-xs ring-2 ring-orange-500/20">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[100px]">
                {userName}
              </p>
              <p className="text-[10px] text-gray-400 font-medium leading-tight">
                Profile
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}