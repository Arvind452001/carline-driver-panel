import loginTaxiImg from '@/assets/login.webp';
import { PhoneCall, ShieldCheck, UserCheck } from 'lucide-react';

export function LoginIllustration() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-1 sm:p-2 select-none relative">
      
      {/* Outer Glowing Orbital Rings Container */}
      <div className="relative w-full max-w-[390px] flex flex-col items-center justify-center">

        {/* Outer Circular Glowing Ring with Light Beads */}
        <div className="absolute w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[380px] lg:h-[380px] rounded-full border border-orange-400/35 pointer-events-none shadow-[0_0_20px_rgba(255,91,38,0.2)]">
          {/* Light Bead 1: Left (~9 o'clock) */}
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_#FF8C00,0_0_3px_#FFF] animate-pulse" />
          
          {/* Light Bead 2: Bottom-Right (~4 o'clock) */}
          <div className="absolute right-5 bottom-11 w-3 h-3 bg-white rounded-full shadow-[0_0_12px_#FF5B26,0_0_4px_#FFF] animate-pulse" />
        </div>

        {/* Secondary subtle orbital halo */}
        <div className="absolute w-[250px] h-[250px] sm:w-[320px] sm:h-[320px] lg:w-[350px] lg:h-[350px] rounded-full border border-orange-300/20 pointer-events-none" />

        {/* Top-Left Floating Badge: IVR Taxi System */}
        <div className="absolute -top-2 left-0 sm:-left-3 z-30 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-[0_8px_20px_-4px_rgba(0,0,0,0.18)] border border-white/80 flex items-center gap-2 transition-transform hover:scale-105 duration-200">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-orange-100/90 flex items-center justify-center text-[#FF5B26] shrink-0">
            <PhoneCall className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-900 leading-tight">IVR Taxi System</div>
            <div className="text-[8px] sm:text-[9px] text-slate-500 font-medium">24/7 Automated Dispatch</div>
          </div>
        </div>

        {/* Top-Right Floating Badge: Verified Fleet */}
        <div className="absolute -top-2 right-0 sm:-right-3 z-30 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-[0_8px_20px_-4px_rgba(0,0,0,0.18)] border border-white/80 flex items-center gap-2 transition-transform hover:scale-105 duration-200">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-100/90 flex items-center justify-center text-emerald-600 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-900 leading-tight">Verified Fleet</div>
            <div className="text-[8px] sm:text-[9px] text-slate-500 font-medium">Instant Ride Matching</div>
          </div>
        </div>

        {/* Central Pure White Spotlight Circle */}
        <div className="relative w-[230px] h-[230px] sm:w-[290px] sm:h-[290px] lg:w-[320px] lg:h-[320px] rounded-full bg-white shadow-[0_0_50px_rgba(255,255,255,0.75),0_15px_40px_rgba(0,0,0,0.35)] border-4 border-white/90 flex items-center justify-center my-3 overflow-visible group">
          
          {/* Spotlight subtle inner radial gradient */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white via-white to-slate-50/80 pointer-events-none" />

          {/* Yellow Taxi Image */}
          <img
            src={loginTaxiImg}
            alt="Taxi Fleet Driver"
            className="w-full max-w-[200px] sm:max-w-[270px] lg:max-w-[300px] object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.35)] relative z-10 transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>

        {/* Bottom Floating Pill: Active Drivers */}
        <div className="relative sm:absolute -bottom-1.5 z-30 bg-[#141C2B]/95 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full border border-slate-700/60 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.35)] flex items-center gap-2 whitespace-nowrap">
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <UserCheck className="w-3 h-3" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-100 tracking-tight">
            Active Drivers • Efficient Dispatch
          </span>
        </div>

      </div>
    </div>
  );
}
