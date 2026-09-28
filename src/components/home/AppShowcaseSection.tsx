import { Link } from 'react-router-dom';
import homePhoneImg from '@/assets/Home.webp';
import fareSummaryImg from '@/assets/Fare Summary.webp';
import {
  Map,
  MapPin,
  KeyRound,
  ArrowUpRight,
  Check,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export function AppShowcaseSection() {
  const features = [
    { title: 'Instant & Secure Payments' },
    { title: 'Work When You Want' },
    { title: 'Dedicated Support Team' },
    { title: 'Smart Navigation & Ride Matching' },
  ];

  return (
    <section className="relative pt-24 pb-20 bg-gradient-to-b from-[#FFF7F2] via-[#FFF9F5] to-[#FFFFFF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Dual Phone Showcase with Orbiting Floating Badges */}
          <div className="lg:col-span-6 relative flex items-center justify-center py-8 lg:py-6">
            
            {/* SVG Dashed Orbital Arrows */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-visible opacity-50"
              viewBox="0 0 500 500"
              fill="none"
            >
              {/* Top orbital dashed arc with arrow */}
              <path
                d="M 110 90 Q 250 10 390 170"
                stroke="#FF5B26"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <polygon
                points="390,170 384,160 394,162"
                fill="#FF5B26"
              />

              {/* Bottom orbital dashed arc with arrow */}
              <path
                d="M 390 380 Q 250 480 110 390"
                stroke="#FF5B26"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <polygon
                points="110,390 120,388 116,398"
                fill="#FF5B26"
              />
            </svg>

            {/* Central Phone Cluster Container */}
            <div className="relative flex items-center justify-center w-full max-w-[420px] sm:max-w-[480px]">
              
              {/* Floating Badge 1: Top-Left Analytics / Bar Chart */}
              <div className="absolute -top-3 -left-2 sm:-top-5 sm:-left-4 z-30 bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl p-2.5 sm:p-3 shadow-xl shadow-slate-200/70 hover:scale-105 transition-transform duration-300">
                <div className="flex items-end gap-1.5 h-7 sm:h-8 px-1">
                  <div className="w-1.5 sm:w-2 h-3.5 bg-amber-400 rounded-full" />
                  <div className="w-1.5 sm:w-2 h-5.5 bg-[#FF5B26] rounded-full" />
                  <div className="w-1.5 sm:w-2 h-4 bg-indigo-500 rounded-full" />
                  <div className="w-1.5 sm:w-2 h-7 bg-blue-500 rounded-full" />
                </div>
              </div>

              {/* Floating Badge 2: Mid-Left Map Pin */}
              <div className="absolute top-[42%] -left-3 sm:-left-6 z-30 bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl p-2.5 sm:p-3 shadow-xl shadow-slate-200/70 hover:scale-105 transition-transform duration-300">
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl border border-rose-100/60">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500/20" />
                </div>
              </div>

              {/* Floating Badge 3: Top-Center Purple Folded Map */}
              <div className="absolute -top-6 left-[48%] -translate-x-1/2 z-30 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-2xl p-2.5 sm:p-3 shadow-xl shadow-purple-500/30 text-white hover:scale-105 transition-transform duration-300">
                <Map className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              {/* Left Phone: Home Screen (tilted left) */}
              <div className="w-[52%] sm:w-[50%] max-w-[260px] transform -rotate-[7deg] hover:rotate-0 transition-transform duration-500 z-10 drop-shadow-2xl">
                <img
                  src={homePhoneImg}
                  alt="Carline Driver Home Dashboard"
                  className="w-full h-auto select-none pointer-events-none rounded-[32px]"
                />
              </div>

              {/* Right Phone: Fare Summary (tilted right) */}
              <div className="w-[52%] sm:w-[50%] max-w-[260px] -ml-10 sm:-ml-12 transform rotate-[5deg] hover:rotate-0 transition-transform duration-500 z-20 drop-shadow-2xl">
                <img
                  src={fareSummaryImg}
                  alt="Carline Fare Summary Screen"
                  className="w-full h-auto select-none pointer-events-none rounded-[32px]"
                />
              </div>

              {/* Floating Badge 4: Right Instant Payment Key Card */}
              <div className="absolute top-[52%] -right-2 sm:-right-6 z-30 bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl p-3 sm:p-3.5 shadow-xl shadow-slate-200/70 text-center flex flex-col items-center gap-1.5 hover:scale-105 transition-transform duration-300">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/25">
                  <KeyRound className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.2]" />
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-800">Instant</p>
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-800">Payment</p>
                </div>
              </div>

              {/* Floating Badge 5: Bottom-Left Earn More Badge */}
              <div className="absolute -bottom-4 left-1 sm:-bottom-6 sm:left-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-100 p-2.5 sm:p-3 flex items-center gap-2.5 z-30 hover:scale-105 transition-transform duration-300">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FFF1EB] text-[#FF5B26] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">Earn More,</p>
                  <p className="text-[9px] sm:text-[10px] font-medium text-slate-500">Drive Smart</p>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Section Header, Highlights & CTA */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEFE7] text-[#FF5B26] font-bold text-xs uppercase tracking-wider">
              WELCOME TO CARLINE
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
              Drive with a Platform <br />
              You Can{' '}
              <span className="text-[#FF5B26]">
                Trust
              </span>
            </h2>

            {/* Description */}
            <p className="text-slate-600 text-base leading-relaxed max-w-xl">
              Carline connects you with real customers, transparent payouts, and smart tools to help you earn more — every single day.
            </p>

            {/* Feature Checklist */}
            <div className="space-y-3.5 pt-2">
              {features.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3.5">
                  <div className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-[#FFEFE7] text-[#FF5B26] flex items-center justify-center shrink-0 shadow-sm">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="font-bold text-slate-800 text-sm sm:text-base">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-[#FF5B26] hover:bg-[#E04815] text-white px-7 py-3.5 rounded-full font-bold text-sm shadow-lg shadow-orange-500/25 hover:scale-105 transition-all duration-200"
              >
                <span>Apply to Drive</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
              
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3.5 py-2 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% Free to Join</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
