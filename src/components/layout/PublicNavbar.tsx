import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import logo from '@/assets/logo.webp';

const navLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#requirements', label: 'Requirements' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
];

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);

    if (location.pathname === '/') {
      if (href === '#hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // If currently on another page (e.g. /login), navigate to home first
      if (href === '#hero') {
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate(`/${href}`);
        setTimeout(() => {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
    }
  };

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 pointer-events-none transition-all duration-300">
      <nav
        className={`max-w-6xl mx-auto bg-white backdrop-blur-md rounded-full shadow-xl shadow-black/10 border-0 px-4 sm:px-6 py-2.5 flex items-center justify-between pointer-events-auto transition-all duration-300 ${
          scrolled ? 'shadow-2xl shadow-black/15 py-2' : ''
        }`}
      >
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src={logo} alt="Logo" className="h-8 sm:h-9 w-auto object-contain" />
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center space-x-7 lg:space-x-8">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              className="text-slate-700 hover:text-[#FF5B26] transition-colors text-sm font-medium cursor-pointer"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <Link
            to="/login"
            className="text-slate-700 hover:text-slate-900 px-4 py-1.5 text-sm font-semibold rounded-full hover:bg-slate-100 transition-all duration-200"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 bg-[#FF5B26] hover:bg-[#e04815] text-white px-4.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm font-bold shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 transition-all duration-200"
          >
            <span>Apply Now</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden mt-2 max-w-sm mx-auto bg-white rounded-3xl border-0 p-5 space-y-3 shadow-2xl pointer-events-auto animate-fade-in">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#FF5B26] hover:bg-orange-50 rounded-xl transition cursor-pointer"
            >
              {label}
            </a>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2 text-slate-800 font-semibold hover:bg-slate-50 border border-slate-200 rounded-full text-sm"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 bg-[#FF5B26] text-white font-bold rounded-full shadow-md text-sm"
            >
              Apply Now ➔
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}