import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Lock,
  Eye,
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
  Smartphone,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { getPrivacyPolicy, LegalDocumentResponse } from '@/services/legalService';

const fallbackSections = [
  {
    id: 'intro',
    icon: Shield,
    title: '1. Introduction & Overview',
    content: `Carline ("we", "our", or "us") is dedicated to protecting the privacy and personal data of our drivers, partners, and passengers. This Privacy Policy outlines our standards, practices, and procedures regarding the collection, use, processing, and safeguarding of information when you access or use the Carline Driver Portal and mobile applications.`,
  },
  {
    id: 'data-collected',
    icon: Database,
    title: '2. Information We Collect',
    content: `To facilitate seamless driver registration, verification, dispatching, and payments, we collect information including:
• Identity Information: Full legal name, date of birth, driver's license details, government ID, profile photographs.
• Vehicle & Document Information: Vehicle registration, insurance certificate, permit papers, roadworthiness checks.
• Geolocation Data: Real-time precise GPS coordinates, route tracking, speed, heading, and trip trajectories while the Driver app is on duty or executing a ride.
• Financial Information: Bank account numbers, payout details, transaction records, and tax identification.
• Device & Usage Data: IP address, device model, operating system, app logs, and network connection status.`,
  },
  {
    id: 'data-use',
    icon: Eye,
    title: '3. How We Use Your Information',
    content: `We process driver information for the following legitimate business purposes:
• Driver Verification & Onboarding: Validating driver credentials, background verification, and regulatory compliance.
• Ride Dispatch & Matching: Routing ride requests based on vehicle type, location, and driver availability.
• Live Navigation & Safety: Calculating ETAs, displaying optimal pickup/drop routes, and emergency incident assistance.
• Earnings & Payment Processing: Calculating fares, processing driver payouts, cash collections, and incentive rewards.
• Customer Support & Dispute Resolution: Resolving rider queries, ride disputes, and platform enhancements.`,
  },
  {
    id: 'location-tracking',
    icon: Smartphone,
    title: '4. Location Tracking & Background Permissions',
    content: `The Carline Driver application requires continuous access to precise location data while you are on duty (online) and during active trips. This allows our dispatch algorithm to offer nearby rides, calculate accurate trip fares, and provide passengers with live driver tracking. Location tracking automatically ceases when you toggle your duty status to Offline.`,
  },
  {
    id: 'data-sharing',
    icon: Globe,
    title: '5. Data Sharing & Third-Party Disclosures',
    content: `We do not sell driver data to third parties. We share information only with:
• Passengers: Your first name, photo, vehicle make, model, registration number, rating, and live location during an active trip.
• Payment Gateways & Banking Partners: To disburse earnings and settle trip transactions securely.
• Legal & Regulatory Authorities: When mandated by law, court orders, or for the protection of driver/passenger safety.`,
  },
  {
    id: 'data-security',
    icon: Lock,
    title: '6. Data Security & Storage',
    content: `We employ bank-grade encryption protocols (TLS/SSL in transit, AES-256 at rest) and strict access controls. All sensitive documents and credentials are encrypted and stored in SOC-2 compliant cloud infrastructure. Regular audits are conducted to prevent unauthorized access or data breaches.`,
  },
  {
    id: 'driver-rights',
    icon: CheckCircle2,
    title: '7. Your Privacy Rights & Choices',
    content: `As a registered driver, you have the right to:
• Access and inspect the personal data we hold about your profile and trips.
• Request correction of incomplete or outdated personal information.
• Request deletion of your account and data, subject to statutory record-retention requirements.
• Manage communication and notification preferences in the Settings section.`,
  },
  {
    id: 'retention',
    icon: Clock,
    title: '8. Data Retention Policy',
    content: `We retain personal and ride data for as long as your driver account remains active and for an additional period as required by financial, tax, and transport regulatory laws. When data is no longer necessary, it is securely purged or anonymized.`,
  },
  {
    id: 'contact',
    icon: Mail,
    title: '9. Contact Privacy Office',
    content: `For questions, data requests, or concerns regarding this policy, please contact our Data Protection Officer at privacy@carline.com or via the in-app Support ticket system.`,
  },
];

export function PrivacyPolicyPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [docData, setDocData] = useState<LegalDocumentResponse | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const res = await getPrivacyPolicy();
        if (isMounted && res) {
          if (typeof res === 'string') {
            setDocData({ content: res });
          } else {
            setDocData(res);
          }
        }
      } catch (err) {
        console.error('Failed to load privacy policy from API:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Format sections from API or fallback
  const parsedSections = (() => {
    if (docData?.sections && Array.isArray(docData.sections) && docData.sections.length > 0) {
      return docData.sections.map((sec, idx) => ({
        id: `sec-${idx}`,
        icon: fallbackSections[idx % fallbackSections.length]?.icon || FileText,
        title: sec.title || sec.heading || `Section ${idx + 1}`,
        content: sec.content || sec.body || (Array.isArray(sec.items) ? sec.items.join('\n') : ''),
      }));
    }
    return fallbackSections;
  })();

  // Filter based on search query
  const filteredSections = parsedSections.filter(
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

  const lastUpdated =
    docData?.lastUpdated ||
    docData?.updatedAt ||
    docData?.effectiveDate ||
    'September 29, 2026';

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 pt-24">
      {/* Top Banner Header */}
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-slate-900 to-[#1e293b] text-white p-8 sm:p-10 shadow-xl shadow-slate-900/10 mb-8 border border-slate-800">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-[#FF5B26] border border-orange-500/30 text-xs font-bold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-[#FF5B26]" />
                Driver Privacy & Trust
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {docData?.title || 'Privacy Policy'}
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                We are committed to maintaining the highest standards of data security, transparent location usage, and protecting your confidential driver information.
              </p>
            </div>

            <div className="flex md:flex-col items-start md:items-end gap-2 text-xs text-slate-400 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 shrink-0">
              <span className="flex items-center gap-1.5 text-slate-200 font-medium">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                Last Updated
              </span>
              <span className="font-mono text-slate-300 font-semibold">{lastUpdated}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold mt-1">
                Version {docData?.version || '2.4 Active'}
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
              placeholder="Search privacy clauses..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#FF5B26] focus:ring-2 focus:ring-orange-500/10 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 self-end sm:self-center">
            <span>Viewing {filteredSections.length} clauses</span>
            <span className="text-gray-300">•</span>
            <Link
              to="/terms"
              className="font-semibold text-[#FF5B26] hover:underline"
            >
              View Terms & Conditions →
            </Link>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#FF5B26] animate-spin mx-auto" />
            <p className="text-sm font-medium text-gray-500">Loading privacy policy data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar quick links on desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-20 bg-white rounded-2xl border border-gray-100 p-4 shadow-xs space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 px-2 pb-2">
                  Table of Contents
                </p>
                {parsedSections.map((sec, idx) => (
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

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Direct HTML or Content string if provided by backend */}
              {docData?.content && !docData?.sections && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-xs">
                  <div
                    className="prose prose-slate max-w-none text-sm leading-relaxed text-gray-700 whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: docData.content }}
                  />
                </div>
              )}

              {/* Categorized Sections */}
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

              {/* Help & Contact Support Footer Card */}
              <div className="rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Have questions about your data?</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Our compliance and driver support team is available 24/7 to resolve queries.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to="/support"
                    className="px-4 py-2 rounded-xl bg-[#FF5B26] hover:bg-[#e04815] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
                  >
                    Open Support Ticket
                  </Link>
                  <a
                    href="mailto:privacy@carline.com"
                    className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-colors"
                  >
                    Email DPO
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;