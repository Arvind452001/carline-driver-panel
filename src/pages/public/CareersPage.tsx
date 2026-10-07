import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Clock,
  Sparkles,
  Search,
  CheckCircle2,
  DollarSign,
  Heart,
  Laptop,
  GraduationCap,
  ShieldCheck,
  Send,
  X,
} from 'lucide-react';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
}

const jobListings: JobPosition[] = [
  {
    id: 'job-1',
    title: 'Senior Driver Operations Manager',
    department: 'Operations',
    location: 'New York, NY (Hybrid)',
    type: 'Full-Time',
    experience: '4+ Years',
    description:
      'Lead our regional driver onboarding, compliance, and retention strategies. Partner directly with driver fleets to resolve pain points and optimize engagement.',
    requirements: [
      'Experience in urban transport, logistics, or fleet operations',
      'Strong analytical capabilities with SQL and dashboard reporting',
      'Proven track record managing driver support workflows and SLAs',
    ],
  },
  {
    id: 'job-2',
    title: 'Lead Dispatch & Routing Engineer',
    department: 'Engineering',
    location: 'Remote (US/Canada)',
    type: 'Full-Time',
    experience: '5+ Years',
    description:
      'Architect real-time algorithms for low-latency driver matching, dynamic surge pricing, and live route optimization using Node.js, Go, and Redis.',
    requirements: [
      'Deep expertise in distributed systems, WebSockets, and geospatial indexing',
      'Experience building high-throughput real-time APIs',
      'Familiarity with mapping APIs and routing engines',
    ],
  },
  {
    id: 'job-3',
    title: '24/7 Driver Safety & Emergency Specialist',
    department: 'Safety & Trust',
    location: 'Austin, TX (On-site / Shift)',
    type: 'Full-Time',
    experience: '2+ Years',
    description:
      'Serve on our frontline critical incident team, handling in-ride emergency alerts, SOS dispatches, accident reports, and law enforcement liaison.',
    requirements: [
      'Experience in emergency dispatch, crisis resolution, or rideshare trust & safety',
      'Calm, empathetic, and rapid decision-making under pressure',
      'Willingness to work rotating shift schedules (including nights/weekends)',
    ],
  },
  {
    id: 'job-4',
    title: 'Driver Support Tier-2 Team Lead',
    department: 'Customer Support',
    location: 'Remote (Global)',
    type: 'Full-Time',
    experience: '3+ Years',
    description:
      'Manage a global team of driver support representatives resolving complex payout disputes, document re-verifications, and platform technical issues.',
    requirements: [
      'Demonstrated leadership in high-volume customer/driver support teams',
      'Strong familiarity with ticketing platforms and CRM tools',
      'Obsession with customer satisfaction and resolution speed',
    ],
  },
  {
    id: 'job-5',
    title: 'Senior Product Designer (Mobile)',
    department: 'Product & Design',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-Time',
    experience: '4+ Years',
    description:
      'Design clean, high-visibility, ergonomic mobile interfaces for drivers on the road. Focus on glanceability, night-mode UX, and frictionless navigation.',
    requirements: [
      'Strong portfolio demonstrating mobile-first UI/UX for iOS and Android',
      'Experience in in-vehicle ergonomics or map-centric app design',
      'Expertise with Figma, design systems, and rapid user testing',
    ],
  },
  {
    id: 'job-6',
    title: 'Driver Community & Growth Ambassador',
    department: 'Marketing & Community',
    location: 'Chicago, IL (Field)',
    type: 'Full-Time',
    experience: '2+ Years',
    description:
      'Organize driver appreciation events, manage airport hub support tables, and champion driver feedback to platform leadership.',
    requirements: [
      'High emotional intelligence and community-building mindset',
      'Comfortable conducting in-person presentations and driver workshops',
      'Self-starter with strong organizational skills',
    ],
  },
];

const perks = [
  {
    icon: DollarSign,
    title: 'Competitive Compensation',
    desc: 'Top-of-market base salary, annual performance bonuses, and equity options in a hyper-growth company.',
  },
  {
    icon: Heart,
    title: 'Health & Wellness',
    desc: 'Comprehensive medical, dental, vision, and mental health coverage for you and your family.',
  },
  {
    icon: Laptop,
    title: 'Flexible & Remote-Friendly',
    desc: 'Work from where you thrive, with generous home-office stipends and high-end hardware provided.',
  },
  {
    icon: GraduationCap,
    title: 'Learning & Development',
    desc: 'Annual $2,500 learning budget for conferences, courses, books, and professional certifications.',
  },
  {
    icon: ShieldCheck,
    title: 'Generous Paid Time Off',
    desc: 'Unlimited flexible PTO, paid parental leave, and company-wide recharge days throughout the year.',
  },
  {
    icon: Sparkles,
    title: 'Driver Ride Credits',
    desc: 'Monthly ride credits for you and your family, plus exclusive vehicle maintenance discounts.',
  },
];

export function CareersPage() {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeJobModal, setActiveJobModal] = useState<JobPosition | null>(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantResume, setApplicantResume] = useState('');

  const departments = ['All', 'Operations', 'Engineering', 'Safety & Trust', 'Customer Support', 'Product & Design', 'Marketing & Community'];

  const filteredJobs = jobListings.filter((job) => {
    const matchesDept = selectedDept === 'All' || job.department === selectedDept;
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationSubmitted(true);
    setTimeout(() => {
      setApplicationSubmitted(false);
      setActiveJobModal(null);
      setApplicantName('');
      setApplicantEmail('');
      setApplicantResume('');
    }, 2500);
  };

  return (
    <div className="bg-white text-slate-800 min-h-screen pt-20">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#080D1A] via-[#0d1527] to-[#162238] text-white py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#FF5B26_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF5B26]/15 border border-[#FF5B26]/30 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            <span>We are Hiring</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Help Us Shape the <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5B26] via-orange-400 to-amber-300">
              Future of Driver Mobility
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Join an ambitious, mission-driven team building fair compensation, intelligent dispatch technology, and unparalleled support for thousands of partner drivers.
          </p>
          <div className="pt-2">
            <a
              href="#open-roles"
              className="inline-flex items-center gap-2 bg-[#FF5B26] hover:bg-[#E04815] text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-lg shadow-orange-500/25 transition-all hover:scale-105"
            >
              <span>Explore Open Positions</span>
              <Sparkles className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Perks & Benefits Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-50 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5" />
            <span>Why Join Carline</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Perks built for your life & career
          </h2>
          <p className="text-sm text-slate-600">
            We offer holistic benefits designed to empower your professional development and personal wellbeing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-orange-200 transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5B26]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Open Roles Section */}
      <div id="open-roles" className="bg-slate-50 py-20 border-y border-slate-200/80 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-100/70 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Available Opportunities</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Current Openings ({filteredJobs.length})
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs by title, skill..."
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-[#FF5B26] shadow-xs"
              />
            </div>
          </div>

          {/* Department Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedDept === dept
                    ? 'bg-[#FF5B26] text-white shadow-md shadow-orange-500/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Jobs List Grid */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md hover:border-orange-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-[#FF5B26] border border-orange-100">
                      {job.department}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                      {job.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Exp: {job.experience}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <button
                    onClick={() => setActiveJobModal(job)}
                    className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-[#FF5B26] hover:bg-[#E04815] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition hover:scale-105"
                  >
                    View & Apply
                  </button>
                </div>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
                <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No jobs found in this category</h3>
                <p className="text-xs text-slate-500">
                  Try adjusting your filter or search terms to see other opportunities.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Driver Opportunity Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-[#080D1A] via-slate-900 to-[#1e293b] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
              Looking to Drive?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Become a Carline Partner Driver
            </h2>
            <p className="text-slate-300 text-sm">
              If you want to drive with us on your own schedule with weekly and daily payouts, start your driver onboarding application now.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-[#FF5B26] hover:bg-[#E04815] text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-lg shadow-orange-500/25 transition hover:scale-105"
            >
              <span>Driver Registration</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Job Details & Apply Modal */}
      {activeJobModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-[#FF5B26] uppercase tracking-wider">
                  {activeJobModal.department}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {activeJobModal.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {activeJobModal.location}
                  </span>
                  <span>•</span>
                  <span>{activeJobModal.type}</span>
                  <span>•</span>
                  <span>Exp: {activeJobModal.experience}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveJobModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">About the Role:</h4>
                <p>{activeJobModal.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Key Qualifications:</h4>
                <ul className="space-y-1.5 list-disc list-inside">
                  {activeJobModal.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Application Form */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Submit Your Application</h4>

              {applicationSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold">Application received successfully!</p>
                    <p className="text-emerald-700 mt-0.5">
                      Our hiring team will review your profile and reach out within 3 business days.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Full Legal Name
                      </label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#FF5B26]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="sarah@example.com"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#FF5B26]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      LinkedIn Profile / Portfolio Link
                    </label>
                    <input
                      type="url"
                      required
                      value={applicantResume}
                      onChange={(e) => setApplicantResume(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#FF5B26]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveJobModal(null)}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-semibold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#FF5B26] hover:bg-[#E04815] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Application</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
