import { Car, Building2, Star, IndianRupee } from 'lucide-react';

export function StatsSection() {
  const stats = [
    { icon: Car, value: '50,000+', label: 'Rides Completed' },
    { icon: Building2, value: '25+', label: 'Cities Covered' },
    { icon: Star, value: '4.8/5', label: 'Driver Rating' },
    { icon: IndianRupee, value: '₹80,000+', label: 'Avg. Monthly Earnings' },
  ];

  return (
    <section className="relative -mt-10 sm:-mt-12 z-20 max-w-6xl mx-auto px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/8 border-0 grid grid-cols-2 lg:grid-cols-4 gap-6 items-center">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`flex items-center gap-3.5 ${
                idx !== stats.length - 1 ? 'lg:border-r lg:border-slate-100 lg:pr-4' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FFF1EB] text-[#FF5B26] flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight flex items-center gap-1">
                  <span>{item.value}</span>
                  {item.label === 'Driver Rating' && (
                    <Star className="w-4 h-4 fill-[#FF5B26] text-[#FF5B26] inline" />
                  )}
                </p>
                <p className="text-xs text-slate-500 font-medium">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
