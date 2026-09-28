import { Star, Play } from 'lucide-react';
import videoStoryThumb from '../../assets/videoStoryThumb.webp';
import driverRahul from '../../assets/driverRahul.webp';
import driverPriya from '../../assets/driverPriya.webp';

interface TestimonialsSectionProps {
  onWatchVideo: () => void;
}

export function TestimonialsSection({ onWatchVideo }: TestimonialsSectionProps) {

  return (
    <section className="pt-4 pb-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            What Our Drivers{' '}
            <span className="text-[#FF5B26]">
              Say
            </span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Real stories from real drivers who are growing with Carline.
          </p>
        </div>

        {/* 3-card Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch text-left">
          {/* Testimonial 1 */}
          <div className="relative bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-900/4 hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-500/20 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between md:h-[240px] overflow-hidden group">
            {/* Decorative Quote Mark */}
            <span className="absolute right-6 top-3 text-slate-100 text-7xl font-serif pointer-events-none select-none group-hover:text-orange-500/10 transition-colors duration-300">“</span>

            <div className="space-y-3 relative z-10">
              <div className="flex gap-1 text-[#FF5B26]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed italic pr-4">
                "Carline has changed my life! Flexible hours and great support team. I can earn more while spending time with my family."
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-4 relative z-10">
              <img
                src={driverRahul}
                alt="Rahul Sharma"
                className="w-11 h-11 rounded-full object-cover border-2 border-orange-200"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Rahul Sharma</h4>
                <p className="text-xs text-slate-400">Active Driver • 2 Years</p>
              </div>
            </div>
          </div>

          {/* Video Success Story (Center Featured) */}
          <div
            onClick={onWatchVideo}
            className="relative group rounded-3xl overflow-hidden shadow-xl cursor-pointer border border-slate-100 flex items-center justify-center bg-slate-900 md:h-[240px] hover:scale-[1.02] transition-transform duration-300"
          >
            <img
              src={videoStoryThumb}
              alt="Watch Success Story"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

            {/* Featured Badge */}
            <div className="absolute top-4 left-4 bg-[#FF5B26] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md z-10">
              Featured Partner
            </div>

            {/* Play Button & Label */}
            <div className="relative z-10 flex flex-col items-center gap-3 text-center p-4">
              <div className="w-14 h-14 rounded-full bg-[#FF5B26] text-white flex items-center justify-center shadow-lg shadow-orange-500/50 group-hover:scale-110 transition-transform duration-300 relative">
                <span className="absolute inset-0 rounded-full bg-[#FF5B26] animate-ping opacity-75"></span>
                <Play className="w-6 h-6 fill-current ml-1 relative z-10" />
              </div>
              <div>
                <p className="text-white font-bold text-base tracking-tight">Watch Success Story</p>
                <p className="text-slate-300 text-xs mt-0.5">Vikas Rawat (Driver Partner)</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="relative bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-900/4 hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-500/20 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between md:h-[240px] overflow-hidden group">
            {/* Decorative Quote Mark */}
            <span className="absolute right-6 top-3 text-slate-100 text-7xl font-serif pointer-events-none select-none group-hover:text-orange-500/10 transition-colors duration-300">“</span>

            <div className="space-y-3 relative z-10">
              <div className="flex gap-1 text-[#FF5B26]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed italic pr-4">
                "Payments are always on time and the app is super easy to use. Best decision I ever made!"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-4 relative z-10">
              <img
                src={driverPriya}
                alt="Priya Mehta"
                className="w-11 h-11 rounded-full object-cover border-2 border-orange-200"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Priya Mehta</h4>
                <p className="text-xs text-slate-400">Active Driver • 1.5 Years</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dots Indicator with Orange active dot */}
        <div className="flex justify-center gap-2 mt-8">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
          <span className="w-6 h-2.5 rounded-full bg-[#FF5B26]" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
        </div>
      </div>
    </section>
  );
}
