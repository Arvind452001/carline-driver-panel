import { Link } from 'react-router-dom';
import heroBg from '@/assets/hero.webp';
import { ArrowUpRight, Play, Shield, Clock, Headphones } from 'lucide-react';
import driverRahul from '../../assets/driverRahul.webp';
import driverPriya from '../../assets/driverPriya.webp';
import driverReview1 from '../../assets/driverReview1.webp';



interface HeroSectionProps {
  onWatchVideo: () => void;
}

export function HeroSection({ onWatchVideo }: HeroSectionProps) {

  return (
    <section
      id="hero"
      className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] xl:min-h-[740px] pt-28 pb-20 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-32 flex items-center overflow-hidden bg-[#0A0D17] text-white"
    >
      {/* Background Image: pinned to the right edge so the driver & car are 100% visible and uncropped */}
      <img
        src={heroBg}
        alt="Carline Driver & Car"
        className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none select-none"
      />

      {/* Cinematic Gradient Overlays: guarantees sharp text contrast on left while keeping driver & car vibrant on right */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent lg:w-[60%] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/20 backdrop-blur-md text-xs font-semibold text-white/90 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FF5B26] animate-pulse"></span>
              <span>• Drive Today</span>
              <span className="text-white/60">• Earn Tomorrow</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-[1.12] text-white drop-shadow-md">
              Turn Your Driving <br />
              Time Into{' '}
              <span className="text-[#FF5B26]">
                Real Earnings
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-200 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed font-normal drop-shadow">
              Join thousands of professional drivers who are earning more with Carline. Drive on your own schedule and be your own boss.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-[#FF5B26] hover:bg-[#e04815] text-white px-7 py-3.5 rounded-full font-bold text-sm sm:text-base shadow-xl shadow-orange-600/40 hover:shadow-orange-600/60 hover:scale-105 transition-all duration-200"
              >
                <span>Apply Now</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <button
                onClick={onWatchVideo}
                className="inline-flex items-center gap-3 bg-white/15 hover:bg-white/25 border border-white/25 backdrop-blur-md text-white px-6 py-3.5 rounded-full font-semibold text-sm sm:text-base hover:scale-105 transition-all duration-200 group shadow-lg"
              >
                <div className="w-7 h-7 rounded-full bg-white text-[#FF5B26] flex items-center justify-center group-hover:scale-110 transition-transform shadow">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
                <span>Watch How It Works</span>
              </button>
            </div>

            {/* 3 Trust Features Under CTAs */}
            <div className="pt-6 border-t border-white/15 flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-slate-200">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
                <div className="w-5 h-5 rounded-full bg-[#FF5B26]/30 text-[#FF5B26] flex items-center justify-center shrink-0 border border-[#FF5B26]/50">
                  <Shield className="w-3 h-3" />
                </div>
                <span className="font-medium text-slate-200">Secure Payments</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
                <div className="w-5 h-5 rounded-full bg-[#FF5B26]/30 text-[#FF5B26] flex items-center justify-center shrink-0 border border-[#FF5B26]/50">
                  <Clock className="w-3 h-3" />
                </div>
                <span className="font-medium text-slate-200">Flexible Schedule</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
                <div className="w-5 h-5 rounded-full bg-[#FF5B26]/30 text-[#FF5B26] flex items-center justify-center shrink-0 border border-[#FF5B26]/50">
                  <Headphones className="w-3 h-3" />
                </div>
                <span className="font-medium text-slate-200">24/7 Driver Support</span>
              </div>
            </div>
          </div>

          {/* Right Hero: Floating Glass Card positioned over car front */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start items-center mt-6 lg:mt-0 lg:pl-4 xl:pl-8">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/25 p-5 rounded-3xl shadow-2xl flex items-center gap-5 text-left animate-fade-in hover:scale-105 transition-transform duration-300">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white leading-none">15,000+</p>
                <p className="text-xs text-slate-300 mt-1 font-medium">Active Drivers</p>
                <div className="flex -space-x-2 mt-2.5">
                  <img
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 object-cover"
                    src={driverRahul}
                    alt="Driver"
                  />
                  <img
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 object-cover"
                    src={driverPriya}
                    alt="Driver"
                  />
                  <img
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 object-cover"
                    src={driverReview1}
                    alt="Driver"
                  />
                </div>
              </div>
              <Link
                to="/signup"
                className="px-4 py-2 bg-[#FF5B26] hover:bg-[#e04815] text-white rounded-full text-xs font-bold transition shadow-md shadow-orange-500/25 hover:scale-105"
              >
                Join Them
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
