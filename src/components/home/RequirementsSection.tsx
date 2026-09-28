import heroBg from '@/assets/hero.webp';
import { CreditCard, Car, UserCheck, Shield, Camera, Clock } from 'lucide-react';
import videoStoryThumb from '../../assets/videoStoryThumb.webp';

export function RequirementsSection() {
  const requirements = [
    {
      icon: CreditCard,
      iconBg: 'bg-[#FFEDD5] text-[#EA580C]',
      title: 'Valid Driving License',
      desc: 'Must be active and valid in your region.',
    },
    {
      icon: Car,
      iconBg: 'bg-[#E0F2FE] text-[#0284C7]',
      title: 'Vehicle Documents',
      desc: 'RC, insurance and fitness certificate.',
    },
    {
      icon: UserCheck,
      iconBg: 'bg-[#DCFCE7] text-[#16A34A]',
      title: 'Identity Verification',
      desc: 'Aadhaar, passport or government ID.',
    },
    {
      icon: Shield,
      iconBg: 'bg-[#FFE4E6] text-[#E11D48]',
      title: 'Background Check',
      desc: 'Quick verification process for safety.',
    },
    {
      icon: Camera,
      iconBg: 'bg-[#F3E8FF] text-[#9333EA]',
      title: 'Profile Photo',
      desc: 'Clear and recent photograph.',
    },
    {
      icon: Clock,
      iconBg: 'bg-[#FEF3C7] text-[#D97706]',
      title: 'Availability',
      desc: 'Commit to flexible working hours.',
    },
  ];

  return (
    <section id="requirements" className="py-3 sm:py-4 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFF8F4] rounded-3xl sm:rounded-[32px] px-6 py-6 sm:px-8 sm:py-7 lg:px-10 lg:py-7 border border-orange-100/60 shadow-sm">
          {/* Section Header */}
          <div className="text-center max-w-xl mx-auto mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#FFEFE7] text-[#FF5B26] font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-1.5">
              APPLICATION REQUIREMENTS
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Simple Requirements to Get Started
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Just a few documents and you're ready to drive with Carline.
            </p>
          </div>

          {/* 3x2 Grid on left + Driver in Car Photo on right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
            {/* 6 Requirements Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
              {requirements.map((req, idx) => {
                const Icon = req.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border-0 shadow-sm shadow-orange-950/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-start gap-2.5"
                  >
                    <div className={`w-9 h-9 rounded-lg ${req.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-[13px] leading-tight">{req.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{req.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Driver in Car Photo with Floating Verification Badge */}
            <div className="lg:col-span-4 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[240px] sm:max-w-[260px] h-[160px] sm:h-[180px] rounded-2xl overflow-hidden shadow-lg bg-slate-900 group">
                <img
                  src={videoStoryThumb}
                  alt="Carline Driver In Car"
                  onError={(e) => {
                    e.currentTarget.src = heroBg;
                    e.currentTarget.style.objectPosition = '88% 15%';
                    e.currentTarget.style.transform = 'scale(1.3)';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Floating Verification Badge */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-slate-100 text-left">
                  <p className="text-[10px] text-slate-500 font-medium leading-none">Get Verified in</p>
                  <p className="text-[11px] sm:text-xs font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                    <span className="text-[#FF5B26]">Less than 24 Hours</span>
                    <span className="text-amber-500">⚡</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
