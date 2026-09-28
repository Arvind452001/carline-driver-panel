import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Send, CheckCircle2 } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer id="contact" className="bg-[#080D1A] text-slate-300 pt-16 pb-8 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#FF5B26] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Carline
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Empowering drivers with flexible opportunities and reliable payments. Be your own boss and earn more on your terms.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { label: 'Facebook', icon: 'f', href: '#' },
                { label: 'Twitter', icon: '𝕏', href: '#' },
                { label: 'Instagram', icon: '📸', href: '#' },
                { label: 'LinkedIn', icon: 'in', href: '#' },
              ].map((s, idx) => (
                <a
                  key={idx}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-slate-800/90 hover:bg-[#FF5B26] text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition-all duration-200 hover:scale-110"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#hero" className="hover:text-[#FF5B26] transition">About Us</a></li>
              <li><Link to="/signup" className="hover:text-[#FF5B26] transition">Careers</Link></li>
              <li><a href="#how-it-works" className="hover:text-[#FF5B26] transition">How It Works</a></li>
              <li><a href="#contact" className="hover:text-[#FF5B26] transition">Press & Media</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#faq" className="hover:text-[#FF5B26] transition">Help Center</a></li>
              <li><a href="#requirements" className="hover:text-[#FF5B26] transition">Safety & Trust</a></li>
              <li><Link to="/terms" className="hover:text-[#FF5B26] transition">Terms & Conditions</Link></li>
              <li><a href="mailto:support@carline.com" className="hover:text-[#FF5B26] transition">support@carline.com</a></li>
            </ul>
          </div>

          {/* Subscribe to Newsletter */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider">Subscribe to our Newsletter</h4>
            <p className="text-xs text-slate-400">Get latest updates and opportunities directly to your inbox.</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF5B26] pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 bg-[#FF5B26] hover:bg-[#e04815] text-white rounded-lg transition flex items-center justify-center shadow-sm"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 animate-fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Thank you for subscribing!</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Carline. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-300 transition">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-slate-300 transition">Cookie Policy</Link>
            <span>•</span>
            <span className="text-slate-400">Made with <span className="text-red-500">❤️</span> for our drivers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}