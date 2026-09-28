import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import nightCarBanner from '../../assets/nightCarBanner.webp';


export function CtaBannerSection() {

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0B111E] via-[#10192C] to-[#0B111E] p-8 sm:p-12 text-white shadow-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Background Night Car Visual */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 opacity-35 pointer-events-none overflow-hidden">
          <img
            src={nightCarBanner}
            alt="Night Car"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#FF5B26]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 text-left relative z-10">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Ready to Start Your Journey with Carline?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Join thousands of happy drivers and take control of your earnings today.
          </p>
        </div>

        <Link
          to="/signup"
          className="inline-flex items-center gap-2 bg-[#FF5B26] hover:bg-[#e04815] text-white px-8 py-4 rounded-full font-bold text-sm shadow-xl shadow-orange-600/30 hover:scale-105 transition-all duration-200 shrink-0 relative z-10"
        >
          <span>Apply Now - It's Free</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
