import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  PhoneCall,
  Lock,
  Activity,
  AlertTriangle,
  FileCheck2,
  Users2,
  HeartHandshake,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const safetyPillars = [
  {
    icon: PhoneCall,
    title: 'In-App Emergency SOS Button',
    description:
      'With a single tap on the active ride screen, drivers can contact 911 emergency services and instantly alert our dedicated 24/7 Critical Incident Dispatch Team with live GPS telemetry.',
  },
  {
    icon: Activity,
    title: 'Real-Time Telemetry & Route Monitoring',
    description:
      'Our intelligent platform continuously monitors trip velocity, unexpected stops, and sudden route deviations to proactively verify driver and rider safety.',
  },
  {
    icon: Lock,
    title: 'Phone Number & Privacy Masking',
    description:
      'Personal contact numbers are never revealed. All in-app calls and messages between drivers and passengers use anonymized virtual proxy numbers.',
  },
  {
    icon: ShieldCheck,
    title: '$1,000,000 Commercial Insurance',
    description:
      'From the moment a trip request is accepted until the passenger exits the vehicle, comprehensive commercial auto liability and contingent collision protection are fully active.',
  },
  {
    icon: FileCheck2,
    title: 'Multi-Tier Background Screening',
    description:
      'Every driver undergoes rigorous criminal history checks, motor vehicle record evaluations, and ongoing real-time violation monitoring.',
  },
  {
    icon: Users2,
    title: 'Two-Way Rating & Accountability',
    description:
      'Drivers rate passengers after every trip. Passengers with repeated low ratings or inappropriate conduct are permanently deactivated from the Carline network.',
  },
];

const safetyTips = [
  {
    title: 'Verify Passenger Name & Destination',
    desc: 'Before beginning a trip, ask the passenger to confirm their name and destination to ensure you pick up the right rider.',
  },
  {
    title: 'Utilize a Phone Mount & Dashcam',
    desc: 'Always keep your device mounted at eye level. Dual-facing dashcams are supported and provide vital evidence in case of disputes.',
  },
  {
    title: 'Trust Your Instincts & Cancel Safely',
    desc: 'If a passenger makes you feel uncomfortable or unsafe prior to trip commencement, you have the right to cancel without penalty.',
  },
  {
    title: 'Take Rest Breaks & Stay Alert',
    desc: 'Our app enforces mandatory rest periods after extended driving hours to prevent driver fatigue and promote road safety.',
  },
];

export function SafetyPage() {
  return (
    <div className="bg-white text-slate-800 min-h-screen pt-20">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#080D1A] via-[#0d1527] to-[#162238] text-white py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#FF5B26_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF5B26]/15 border border-[#FF5B26]/30 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Safety & Trust Standards</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Your Safety is Our <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5B26] via-orange-400 to-amber-300">
              Highest Priority
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            We are committed to building the safest mobility network in the world. Discover the comprehensive technology, policies, and insurance protecting you on every trip.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-[#FF5B26] hover:bg-[#E04815] text-white px-7 py-3 rounded-full text-sm font-bold shadow-lg shadow-orange-500/25 transition-all hover:scale-105"
            >
              <span>Join Safe Network</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#pillars"
              className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-full text-sm font-semibold border border-slate-700 transition"
            >
              <span>Explore Safety Features</span>
            </a>
          </div>
        </div>
      </div>

      {/* Safety Pillars Grid */}
      <div id="pillars" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-50 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Core Protections</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            360-Degree Protection for Drivers
          </h2>
          <p className="text-sm text-slate-600">
            From vehicle verification to in-ride emergency response, we engineer peace of mind into every ride.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safetyPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-orange-200 transition-all duration-300 space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5B26]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{pillar.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insurance Protection Banner */}
      <div className="bg-slate-50 py-20 border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#080D1A] to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Commercial Auto Insurance</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black max-w-xl leading-tight">
                Full-Coverage Insurance for Peace of Mind
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Carline partners with leading commercial insurance underwriters to safeguard drivers from the moment you turn on the app to drop-off.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xl font-bold text-[#FF5B26]">$1,000,000</div>
                  <div className="text-xs text-slate-300 font-semibold mt-1">Third-Party Liability</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Active trip passenger protection</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xl font-bold text-[#FF5B26]">Comprehensive</div>
                  <div className="text-xs text-slate-300 font-semibold mt-1">Contingent Collision</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Physical vehicle damage coverage</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xl font-bold text-[#FF5B26]">Uninsured</div>
                  <div className="text-xs text-slate-300 font-semibold mt-1">Motorist Protection</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Hit-and-run driver coverage</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Guidelines for Drivers */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-50 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Best Practices</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Driver Safety Best Practices
          </h2>
          <p className="text-sm text-slate-600">
            Follow these essential guidelines to ensure smooth, secure, and highly rated trips every day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {safetyTips.map((tip, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-orange-200 transition space-y-2"
            >
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF5B26] text-xs flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                {tip.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 pl-8 leading-relaxed">
                {tip.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Hotline Banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl bg-amber-50 border border-amber-200/80 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">24/7 Driver Incident Line</h3>
              <p className="text-xs text-slate-600 mt-1">
                For active in-ride emergencies, our safety specialists are on standby around the clock.
              </p>
            </div>
          </div>
          <a
            href="tel:+18005552277"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-md shrink-0"
          >
            <PhoneCall className="w-4 h-4 text-[#FF5B26]" />
            <span>Call 24/7 Safety Desk</span>
          </a>
        </div>
      </div>
    </div>
  );
}
