import { UserCheck, FileText, Car } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      step: 'Step 01',
      number: '01',
      title: 'Sign Up',
      desc: 'Create your account in a few minutes.',
      badgeBg: 'bg-[#FF5B26] text-white',
      icon: UserCheck,
    },
    {
      step: 'Step 02',
      number: '02',
      title: 'Documents',
      desc: 'Verify your details and vehicle documents.',
      badgeBg: 'bg-[#0EA5E9] text-white',
      icon: FileText,
    },
    {
      step: 'Step 03',
      number: '03',
      title: 'Start Driving',
      desc: 'Get approved and begin earning!',
      badgeBg: 'bg-[#6366F1] text-white',
      icon: Car,
    },
  ];

  return (
    <section id="how-it-works" className="pt-8 pb-12 bg-white text-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How It{' '}
            <span className="text-[#FF5B26]">
              Works
            </span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Start earning in 3 simple steps
          </p>
        </div>

        {/* 3 Step Flow with Connecting Line */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          {/* Horizontal connecting line */}
          <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-slate-200 -z-0" />

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center space-y-3">
              <div
                className={`w-14 h-14 rounded-full ${step.badgeBg} flex items-center justify-center font-black text-base shadow-lg`}
              >
                <step.icon className="w-6 h-6" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{step.step}</p>
              <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xs leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
