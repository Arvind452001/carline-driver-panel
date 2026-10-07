import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Cookie,
  Lock,
  FileText,
  Clock,
  ArrowLeft,
  Search,
  Printer,
  Share2,
  Mail,
  CheckCircle2,
  AlertCircle,
  Database,
  SlidersHorizontal,
} from 'lucide-react';

const cookieSections = [
  {
    id: 'intro',
    icon: Cookie,
    title: '1. What Are Cookies & Tracking Technologies?',
    content: `Cookies are small text files placed on your device (computer, smartphone, or tablet) by websites and web applications you visit. They are widely used to make web portals work efficiently, remember your session and preferences, secure authentication tokens, and provide analytical reporting to improve system performance. In this Cookie Policy, we explain how Carline Mobility Technologies Inc. ("Carline", "we", "us") utilizes cookies and similar technologies on our Driver Portal and web services.`,
  },
  {
    id: 'types',
    icon: Database,
    title: '2. Categories of Cookies We Use',
    content: `We categorize cookies used across our platform into the following types:

• Strictly Necessary / Essential Cookies:
These cookies are mandatory for the operation of the Driver Portal. They include authentication session cookies, security tokens, load-balancing parameters, and CSRF protection tokens. Without these cookies, services like logging into your driver account, receiving ride dispatches, and processing payout requests cannot be provided.

• Performance & Analytical Cookies:
These cookies allow us to collect aggregated, anonymous data on how drivers interact with our platform—such as page load speeds, network latency, crash reports, and frequently visited pages. We use this information to optimize server infrastructure and eliminate platform bottlenecks.

• Functional & Preference Cookies:
These cookies enable our portal to remember your selected preferences, such as interface language, dark/light theme, map layer display options, and sound alert notification settings.

• Security & Anti-Fraud Cookies:
We deploy specialized risk-detection cookies to detect anomalous login patterns, bot activity, credential stuffing, and session hijacking attempts.`,
  },
  {
    id: 'third-party',
    icon: Lock,
    title: '3. Third-Party Integrations & Analytics',
    content: `Some cookies and scripts on our platform are set by verified third-party partners to support core functionality:
• Mapping & Geospatial Services: Real-time route rendering, traffic conditions, and reverse geocoding.
• Payment & Payout Gateways: Encrypted tokenization of bank account transfers and fraud screening.
• Infrastructure Monitoring: Real-time server telemetry and error logging to ensure 99.9% uptime.

We do not sell cookie data to third-party data brokers or behavioral advertising networks.`,
  },
  {
    id: 'control',
    icon: SlidersHorizontal,
    title: '4. How You Can Manage & Disable Cookies',
    content: `Most web browsers allow you to view, manage, and delete cookies through their settings preferences:
• Google Chrome: Settings > Privacy and Security > Third-Party Cookies
• Mozilla Firefox: Settings > Privacy & Security > Cookies and Site Data
• Apple Safari: Settings > Safari > Advanced > Block All Cookies
• Microsoft Edge: Settings > Cookies and site permissions > Manage and delete cookies

Please note: Because Strictly Necessary cookies are required for user authentication and trip dispatch security, disabling all cookies may prevent you from logging in or using the Carline Driver Portal.`,
  },
  {
    id: 'updates',
    icon: Clock,
    title: '5. Updates to This Cookie Policy',
    content: `We may periodically update this Cookie Policy to reflect changes in our technology stack, regulatory standards, or operational practices. Any modifications will be posted here with an updated revision date. We encourage you to review this page periodically to remain informed.`,
  },
  {
    id: 'contact',
    icon: Mail,
    title: '6. Contact Privacy & Compliance Office',
    content: `If you have questions or concerns regarding our use of cookies and tracking technologies, please contact our Data Protection Officer at privacy@carline.com or submit an inquiry through the in-app Support ticket desk.`,
  },
];

export function CookiePolicyPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredSections = cookieSections.filter(
    (sec) =>
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Navigation & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
            >
              {copied ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Share2 className="w-3.5 h-3.5 text-gray-500" />
              )}
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-gray-500" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#080D1A] via-slate-900 to-[#1e293b] text-white p-8 sm:p-10 shadow-xl shadow-slate-900/10 mb-8 border border-slate-800">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-[#FF5B26] border border-orange-500/30 text-xs font-bold uppercase tracking-wider">
                <Cookie className="w-3.5 h-3.5 text-[#FF5B26]" />
                Transparency & Control
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Cookie Policy
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Understand how Carline uses cookies and similar technologies to provide secure authentication, maintain session state, and deliver an optimal driver experience.
              </p>
            </div>

            <div className="flex md:flex-col items-start md:items-end gap-2 text-xs text-slate-400 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 shrink-0">
              <span className="flex items-center gap-1.5 text-slate-200 font-medium">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                Last Updated
              </span>
              <span className="font-mono text-slate-300 font-semibold">September 29, 2026</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold mt-1">
                Version 1.8 Active
              </span>
            </div>
          </div>
        </div>

        {/* Search and Navigation Bar */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-3 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cookie policy..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#FF5B26] focus:ring-2 focus:ring-orange-500/10 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 self-end sm:self-center">
            <span>Viewing {filteredSections.length} sections</span>
            <span className="text-gray-300">•</span>
            <Link
              to="/privacy-policy"
              className="font-semibold text-[#FF5B26] hover:underline"
            >
              Privacy Policy →
            </Link>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar quick links on desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 px-2 pb-2">
                Table of Contents
              </p>
              {cookieSections.map((sec, idx) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="block px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-[#FF5B26] hover:bg-orange-50 transition-colors truncate"
                >
                  {idx + 1}. {sec.title.replace(/^\d+\.\s*/, '')}
                </a>
              ))}
            </div>
          </div>

          {/* Categorized Sections */}
          <div className="lg:col-span-3 space-y-6">
            {filteredSections.map((section) => {
              const IconComponent = section.icon || FileText;
              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow scroll-mt-24"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-[#FF5B26]">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <h2 className="text-base sm:text-lg font-bold text-gray-900">
                        {section.title}
                      </h2>
                      <div className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}

            {filteredSections.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-800">No matching sections found</p>
                <p className="text-xs text-gray-500 mt-1">Try searching with a different term.</p>
              </div>
            )}

            {/* Support Card */}
            <div className="rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Questions about cookie preferences?</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Our privacy compliance team is available to assist you with data and cookie settings.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="mailto:privacy@carline.com"
                  className="px-4 py-2 rounded-xl bg-[#FF5B26] hover:bg-[#e04815] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
                >
                  Email Privacy Team
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
