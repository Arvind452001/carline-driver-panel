import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Navigation2,
  Wallet,
  Car,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  Sparkles,
  Award,
  CircleDollarSign,
  PhoneCall,
  Flame,
} from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: FileCheck2,
    title: 'Easy Online Sign-up',
    description:
      'Submit your driver license, vehicle registration, and insurance. The registration takes under 5 minutes right from your phone or computer.',
    highlight: 'Instant document upload & fast approval within 24h',
  },
  {
    step: '02',
    icon: Car,
    title: 'Vehicle & Background Verification',
    description:
      'Our automated safety verification verifies your credentials and background quickly to ensure a trusted ecosystem for drivers and riders.',
    highlight: 'Zero upfront registration or application fees',
  },
  {
    step: '03',
    icon: Navigation2,
    title: 'Go Online & Accept Rides',
    description:
      'Toggle duty status to online. View nearby requests with upfront trip destinations, passenger ratings, and exact earnings before accepting.',
    highlight: 'Upfront fare & destination visibility',
  },
  {
    step: '04',
    icon: Wallet,
    title: 'Get Paid Instantly',
    description:
      'Track your earnings in real-time. Cash out your earnings instantly to your bank account or receive automatic weekly deposits without deductions.',
    highlight: 'Instant daily cash-out available 24/7',
  },
];

const features = [
  {
    icon: Flame,
    title: 'Real-Time Surge Heatmaps',
    description: 'See live high-demand pickup zones with guaranteed multiplier rates to maximize your earnings per hour.',
  },
  {
    icon: CircleDollarSign,
    title: 'Lowest Platform Commission',
    description: 'Keep up to 88% of every ride fare. Transparent breakdowns with no hidden technology surcharges.',
  },
  {
    icon: ShieldCheck,
    title: 'Driver Safety Guarantee',
    description: 'In-app emergency SOS button, 24/7 live safety dispatch monitoring, and continuous trip GPS tracking.',
  },
  {
    icon: Zap,
    title: 'Smart Consecutive Trip Streaks',
    description: 'Unlock daily cash bonuses by completing consecutive trips during morning and evening rush hours.',
  },
  {
    icon: Clock,
    title: '100% Flexible Schedule',
    description: 'No minimum hours or mandatory shifts. Drive 2 hours a week or 40 hours a week—you are in total control.',
  },
  {
    icon: PhoneCall,
    title: '24/7 Priority Driver Support',
    description: 'Dedicated phone and chat support agents ready to assist with app questions, route issues, or fare adjustments.',
  },
];

export function HowItWorksPage() {
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(30);
  const [cityTier, setCityTier] = useState<number>(32); // Average $/hr

  const estimatedWeeklyEarnings = hoursPerWeek * cityTier;
  const estimatedMonthlyEarnings = estimatedWeeklyEarnings * 4.3;

  return (
    <div className="bg-white text-slate-800 min-h-screen pt-20">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#080D1A] via-[#0d1527] to-[#162238] text-white py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#FF5B26_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF5B26]/15 border border-[#FF5B26]/30 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Driver Guide & Workflow</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            How Driving with <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5B26] via-orange-400 to-amber-300">
              Carline Works
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            From easy application to hitting the road and cashing out daily. Experience the most transparent and rewarding driver platform in the market.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-[#FF5B26] hover:bg-[#E04815] text-white px-7 py-3 rounded-full text-sm font-bold shadow-lg shadow-orange-500/25 transition-all hover:scale-105"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#calculator"
              className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-full text-sm font-semibold border border-slate-700 transition"
            >
              <span>Calculate Earnings</span>
            </a>
          </div>
        </div>
      </div>

      {/* 4 Step Process Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-50 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Start earning in 4 straightforward steps
          </h2>
          <p className="text-sm text-slate-600">
            We made onboarding fast and seamless so you can get on the road and start generating income without delay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col justify-between space-y-6 relative group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5B26] group-hover:bg-[#FF5B26] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-200 group-hover:text-[#FF5B26]/30 transition">
                      {item.step}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B26]" />
                  <span>{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Earnings Calculator */}
      <div id="calculator" className="bg-slate-50 py-20 border-y border-slate-200/80 scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-100/70 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
              <CircleDollarSign className="w-3.5 h-3.5" />
              <span>Earnings Calculator</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Estimate your monthly potential
            </h2>
            <p className="text-sm text-slate-600">
              Adjust your estimated weekly driving hours and rate tier to see realistic earnings projections.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Controls */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-900">
                    Driving Hours Per Week
                  </label>
                  <span className="text-base font-extrabold text-[#FF5B26]">
                    {hoursPerWeek} hrs / week
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#FF5B26]"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Part-time (5 hrs)</span>
                  <span>Full-time (40 hrs)</span>
                  <span>Power Driver (60 hrs)</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-900 mb-2 block">
                  Market Zone / Fleet Tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Standard City', rate: 26 },
                    { label: 'Metro Core', rate: 32 },
                    { label: 'Airport & Premium', rate: 42 },
                  ].map((tier, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCityTier(tier.rate)}
                      className={`p-3 rounded-xl text-center border text-xs font-bold transition ${
                        cityTier === tier.rate
                          ? 'border-[#FF5B26] bg-orange-50 text-[#FF5B26]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div>{tier.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">${tier.rate}/hr avg</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-500 leading-relaxed">
                * Earnings estimates based on historical average fare data, peak surge incentives, and passenger tips. Actual payout depends on exact hours driven and location.
              </div>
            </div>

            {/* Projection Display Card */}
            <div className="bg-gradient-to-br from-[#080D1A] to-slate-900 rounded-2xl p-8 text-white space-y-6 shadow-lg">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Estimated Weekly Earnings
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                  ${estimatedWeeklyEarnings.toLocaleString()}{' '}
                  <span className="text-xs font-semibold text-slate-400">/ week</span>
                </div>
              </div>

              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Estimated Monthly Income
                </span>
                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF5B26] via-orange-400 to-amber-300 mt-1">
                  ${Math.round(estimatedMonthlyEarnings).toLocaleString()}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Includes tips, quest bonuses, and zero-fee instant daily cash-outs.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/signup"
                  className="w-full block text-center bg-[#FF5B26] hover:bg-[#E04815] text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-orange-500/25 transition hover:scale-105"
                >
                  Start Earning with Carline
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Advantage Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-50 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Driver Advantages</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Engineered for maximum driver satisfaction
          </h2>
          <p className="text-sm text-slate-600">
            We build state-of-the-art dispatch and safety tools so you can focus on the road with total confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-orange-200 transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5B26]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Footer Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl bg-gradient-to-br from-[#080D1A] via-slate-900 to-[#1e293b] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black">
              Ready to begin your journey?
            </h2>
            <p className="text-slate-300 text-sm">
              Complete your online registration in 5 minutes and get approved within 24 hours.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-[#FF5B26] hover:bg-[#E04815] text-white px-7 py-3.5 rounded-full text-sm font-bold shadow-lg shadow-orange-500/25 transition hover:scale-105"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
