import { Rocket, Shield, Clock, Headphones } from 'lucide-react';

export function BenefitsSection() {
  const benefits = [
    {
      icon: Rocket,
      iconBg: 'bg-[#F3E8FF] text-[#9333EA]',
      cardBorder: 'border-[#E9D5FF]',
      cardHover: 'hover:border-[#9333EA]/40 hover:shadow-purple-500/10',
      title: 'Quick Registration',
      desc: 'Sign up in minutes and start your journey immediately.',
    },
    {
      icon: Shield,
      iconBg: 'bg-[#DCFCE7] text-[#16A34A]',
      cardBorder: 'border-[#BBF7D0]',
      cardHover: 'hover:border-[#16A34A]/40 hover:shadow-emerald-500/10',
      title: 'Secure & Safe',
      desc: 'Your safety is our priority with verified riders and tracking.',
    },
    {
      icon: Clock,
      iconBg: 'bg-[#0284C7] text-white shadow-md shadow-blue-500/25',
      cardBorder: 'border-[#BAE6FD]',
      cardHover: 'hover:border-[#0284C7]/40 hover:shadow-blue-500/10',
      title: 'Flexible Hours',
      desc: 'Drive on your own terms. Set your own schedule.',
    },
    {
      icon: Headphones,
      iconBg: 'bg-[#FFEDD5] text-[#EA580C]',
      cardBorder: 'border-[#FED7AA]',
      cardHover: 'hover:border-[#EA580C]/40 hover:shadow-orange-500/10',
      title: '24/7 Support',
      desc: 'Our team is always available to assist you on the road.',
    },
  ];

  return (
    <section className="pt-8 pb-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEFE7] text-[#FF5B26] font-bold text-xs uppercase tracking-wider mb-3">
          WHY CHOOSE CARLINE
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Drive Better. Earn{' '}
          <span className="text-[#FF5B26]">
            More.
          </span>
        </h2>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto mt-2 mb-14">
          Everything you need to build a successful driving career.
        </p>

        {/* 4 Cards Grid with pastel tinted borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className={`bg-white p-7 sm:p-8 rounded-[28px] border-2 ${b.cardBorder} shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group ${b.cardHover}`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${b.iconBg} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{b.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
