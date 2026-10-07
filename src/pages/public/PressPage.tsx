import { useState } from 'react';
import {
  Newspaper,
  Download,
  Mail,
  Calendar,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  FileBadge,
  Image as ImageIcon,
  Building,
  Send,
} from 'lucide-react';

const pressReleases = [
  {
    id: 'pr-1',
    date: 'September 15, 2026',
    category: 'Expansion',
    title: 'Carline Expands Driver Operations Across 30 New Metropolitan Areas',
    summary:
      'Following record-setting driver satisfaction metrics, Carline announces its rapid nationwide expansion, introducing instant zero-fee daily payouts to over 20,000 newly onboarded drivers.',
    readTime: '3 min read',
  },
  {
    id: 'pr-2',
    date: 'August 02, 2026',
    category: 'Product Innovation',
    title: 'Carline Launches Intelligent Surge Match 2.0 with Real-Time Safety Dispatch',
    summary:
      'The new platform algorithm combines dynamic route prediction with enhanced in-ride emergency response times, cutting average driver idle time by 34%.',
    readTime: '4 min read',
  },
  {
    id: 'pr-3',
    date: 'June 18, 2026',
    category: 'Corporate Social Responsibility',
    title: 'Carline Introduces $5M Driver Fuel Subsidy & Green Vehicle Incentive Fund',
    summary:
      'In response to shifting economic factors, Carline commits five million dollars in direct fuel credits and EV charging rebates for all full-time partner drivers.',
    readTime: '3 min read',
  },
  {
    id: 'pr-4',
    date: 'April 10, 2026',
    category: 'Partnership',
    title: 'Carline Partners with Leading Global Insurers to Expand Comprehensive Driver Coverage',
    summary:
      'Drivers now receive enhanced commercial auto liability, accidental injury protection, and 24/7 roadside assistance on all active trips at zero cost.',
    readTime: '5 min read',
  },
];

const mediaAssets = [
  {
    title: 'Official Brand Assets & Logos',
    type: 'Vector SVG, PNG, EPS (Dark/Light)',
    size: '14.2 MB',
    icon: ImageIcon,
  },
  {
    title: 'Executive Leadership Bios & Headshots',
    type: 'High-Res TIFF & PDF',
    size: '28.5 MB',
    icon: Building,
  },
  {
    title: 'Carline 2026 Platform Factsheet',
    type: 'PDF Document',
    size: '2.1 MB',
    icon: FileBadge,
  },
];

export function PressPage() {
  const [inquirySent, setInquirySent] = useState(false);
  const [outlet, setOutlet] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setOutlet('');
      setEmail('');
      setMessage('');
    }, 3000);
  };

  return (
    <div className="bg-white text-slate-800 min-h-screen pt-20">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#080D1A] via-[#0d1527] to-[#162238] text-white py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#FF5B26_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF5B26]/15 border border-[#FF5B26]/30 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Newsroom & Media Relations</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Press, News & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5B26] via-orange-400 to-amber-300">
              Media Kit
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Stay up to date with the latest announcements, platform milestones, executive news, and brand resources from the Carline team.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="#press-releases"
              className="inline-flex items-center gap-2 bg-[#FF5B26] hover:bg-[#E04815] text-white px-7 py-3 rounded-full text-sm font-bold shadow-lg shadow-orange-500/25 transition-all hover:scale-105"
            >
              <span>Latest Releases</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="#media-kit"
              className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-full text-sm font-semibold border border-slate-700 transition"
            >
              <span>Download Media Kit</span>
            </a>
          </div>
        </div>
      </div>

      {/* Press Releases Section */}
      <div id="press-releases" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-50 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Announcements</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Recent Press Releases
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            For media inquiries, reach our communications team at <span className="font-semibold text-slate-800">press@carline.com</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pressReleases.map((pr) => (
            <article
              key={pr.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full font-bold bg-orange-50 text-[#FF5B26] border border-orange-100">
                    {pr.category}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {pr.date}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {pr.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pr.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">{pr.readTime}</span>
                <span className="inline-flex items-center gap-1 font-bold text-[#FF5B26] hover:underline cursor-pointer">
                  Read Full Article <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Media Kit Downloads */}
      <div id="media-kit" className="bg-slate-50 py-20 border-y border-slate-200/80 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-100/70 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
              <Download className="w-3.5 h-3.5" />
              <span>Brand Resources</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Media Kit & Brand Assets
            </h2>
            <p className="text-sm text-slate-600">
              Download high-resolution logos, brand guidelines, leadership photos, and product screenshots for editorial use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mediaAssets.map((asset, idx) => {
              const Icon = asset.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5B26]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{asset.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{asset.type}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs font-mono text-slate-400">{asset.size}</span>
                    <button
                      onClick={() => alert(`Downloading ${asset.title}...`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#FF5B26] text-white text-xs font-semibold transition shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Press Inquiry Contact Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-10 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-50 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5" />
              <span>Media Relations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Submit a Press or Interview Request
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Are you a journalist, editor, or podcast host? Our PR team typically responds within 4 business hours.
            </p>
          </div>

          {inquirySent ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div className="text-sm">
                <p className="font-bold">Thank you for reaching out!</p>
                <p className="text-emerald-700 mt-0.5">
                  Our communications team will review your inquiry and follow up promptly.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePressSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Publication / Media Outlet
                  </label>
                  <input
                    type="text"
                    required
                    value={outlet}
                    onChange={(e) => setOutlet(e.target.value)}
                    placeholder="e.g. TechCrunch, Bloomberg, Forbes"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-[#FF5B26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Press Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="journalist@media.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-[#FF5B26]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Inquiry Details / Interview Scope / Deadline
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your story topic, intended publication date, and any specific questions..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-[#FF5B26]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF5B26] hover:bg-[#E04815] text-white text-xs font-bold shadow-md shadow-orange-500/25 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Media Inquiry</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
