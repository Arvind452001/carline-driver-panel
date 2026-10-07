import { Link } from 'react-router-dom';
import {
  Car,
  Shield,
  Award,
  Users,
  TrendingUp,
  Globe2,
  Clock,
  Sparkles,
  ArrowRight,
  Target,
  Compass,
  HeartHandshake,
} from 'lucide-react';

const stats = [
  { label: 'Active Drivers', value: '45,000+', icon: Users },
  { label: 'Cities Covered', value: '120+', icon: Globe2 },
  { label: 'Completed Rides', value: '15M+', icon: Car },
  { label: 'Driver Satisfaction', value: '98.6%', icon: Award },
];

const values = [
  {
    icon: Users,
    title: 'Driver-First Culture',
    description:
      'We believe drivers are the foundation of our platform. Every feature, policy, and payout model is built to maximize driver earnings and respect.',
  },
  {
    icon: Shield,
    title: 'Safety & Transparency',
    description:
      'Zero hidden fees, transparent fare breakdowns, 24/7 in-app emergency assistance, and end-to-end trip verification for complete peace of mind.',
  },
  {
    icon: TrendingUp,
    title: 'Empowering Growth',
    description:
      'From dynamic surge bonuses to fuel discounts, health coverage options, and daily instant payouts, we build the tools to scale your income.',
  },
  {
    icon: HeartHandshake,
    title: 'Fair & Sustainable',
    description:
      'We charge industry-lowest platform commission rates, keeping more hard-earned cash directly in the pockets of our partner drivers.',
  },
];

const team = [
  {
    name: 'Marcus Vance',
    role: 'Co-Founder & CEO',
    bio: 'Former mobility executive with 14+ years scaling urban transport networks and driver advocacy programs across North America.',
  },
  {
    name: 'Elena Rostova',
    role: 'Chief Technology Officer',
    bio: 'Pioneer in real-time dispatch algorithms, geospatial routing, and low-latency driver app architectures.',
  },
  {
    name: 'Devon Sterling',
    role: 'Head of Driver Operations',
    bio: 'Passionate driver advocate focused on fair compensation models, safety protocols, and 24/7 driver support response times.',
  },
  {
    name: 'Amina Al-Mansoor',
    role: 'VP of Safety & Compliance',
    bio: 'Ex-regulatory safety director driving rigorous background checks, SOS response networks, and insurance partnerships.',
  },
];

const milestones = [
  { year: '2021', title: 'Platform Inception', desc: 'Carline launched with 500 initial drivers in our first pilot metropolitan area.' },
  { year: '2023', title: 'Instant Daily Payouts', desc: 'Introduced 0% fee instant driver payout system and real-time live trip analytics.' },
  { year: '2025', title: 'National Expansion', desc: 'Crossed 100+ cities and over 10 million safe completed rides across the country.' },
  { year: '2026', title: 'Driver 2.0 Ecosystem', desc: 'Rolled out intelligent surge matching, dedicated driver hubs, and fuel rewards programs.' },
];

export function AboutPage() {
  return (
    <div className="bg-white text-slate-800 min-h-screen pt-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#080D1A] via-[#0d1527] to-[#162238] text-white py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#FF5B26_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF5B26]/15 border border-[#FF5B26]/30 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Mission & Vision</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Building the World’s Most <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5B26] via-orange-400 to-amber-300">
              Driver-Centric Platform
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            At Carline, we are redefining modern ride-hailing. We believe that when drivers are treated fairly, provided with industry-leading pay, and backed by robust safety systems, passengers receive a world-class experience.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-[#FF5B26] hover:bg-[#E04815] text-white px-7 py-3 rounded-full text-sm font-bold shadow-lg shadow-orange-500/25 transition-all hover:scale-105"
            >
              <span>Drive With Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-full text-sm font-semibold border border-slate-700 transition"
            >
              <span>How It Works</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-orange-50/50 transition">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-[#FF5B26] shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mission & Purpose */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-50 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>Who We Are</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Transforming mobility by putting the driver in the driver’s seat.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Traditional rideshare platforms often treat drivers as line items. Carline was founded with a radically different thesis: drivers are independent micro-entrepreneurs who deserve predictable payouts, honest algorithms, and real human support.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Whether you are driving full-time or earning supplementary income on weekends, our intelligent dispatch system optimizes your fuel consumption, reduces idle waiting times, and guarantees rapid settlements.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#FF5B26] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Total Flexibility</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Work whenever you want without minimum hour penalties.</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <Compass className="w-5 h-5 text-[#FF5B26] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Smart Navigation</h4>
                  <p className="text-xs text-slate-500 mt-0.5">High-demand heatmaps and optimal routes in real-time.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-orange-200 transition-all duration-300 space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5B26]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{v.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-slate-50 py-20 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-100/70 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Our Journey</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Milestones that shaped our growth
            </h2>
            <p className="text-sm text-slate-600">
              From our humble start to powering millions of journeys every month.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative space-y-3"
              >
                <div className="text-2xl font-black text-[#FF5B26]">{m.year}</div>
                <h3 className="text-base font-bold text-slate-900">{m.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership Team */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-50 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Leadership</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Backed by passionate industry leaders
          </h2>
          <p className="text-sm text-slate-600">
            Engineers, mobility operators, and safety specialists dedicated to driver success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#080D1A] to-slate-800 text-white flex items-center justify-center font-bold text-lg shadow-md">
                {member.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                <p className="text-xs font-semibold text-[#FF5B26]">{member.role}</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Join CTA Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl bg-gradient-to-br from-[#080D1A] via-slate-900 to-[#1e293b] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black">
              Ready to take control of your earnings?
            </h2>
            <p className="text-slate-300 text-sm">
              Sign up today and get approved within 24 hours. Start earning with industry-best payout rates.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-[#FF5B26] hover:bg-[#E04815] text-white px-7 py-3 rounded-full text-sm font-bold shadow-lg shadow-orange-500/25 transition hover:scale-105"
            >
              <span>Apply to Drive</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/15 transition"
            >
              <span>Contact Team</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
