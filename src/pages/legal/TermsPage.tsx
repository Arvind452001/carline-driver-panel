import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Shield,
  Scale,
  Car,
  Wallet,
  AlertTriangle,
  UserCheck,
  Ban,
  Clock,
  ArrowLeft,
  Search,
  Printer,
  Share2,
  Mail,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const termsSections = [
  {
    id: 'acceptance',
    icon: Scale,
    title: '1. Acceptance of Terms & Relationship',
    content: `These Terms and Conditions ("Terms", "Agreement") constitute a legally binding agreement between you ("Driver", "Partner", "you") and Carline Mobility Technologies Inc. ("Carline", "we", "us", or "our").

By registering an account, submitting documentation, accessing the Driver Portal, or accepting ride dispatches through the Carline driver platform, you acknowledge and agree that you have read, understood, and accept full legal responsibility under these Terms.

You acknowledge that your relationship with Carline is solely that of an independent contractor and not an employee, agent, joint venturer, or partner. Nothing in this Agreement creates an employer-employee relationship under federal, state, or municipal law. You maintain absolute discretion over when, where, and for how long you log into the platform to provide transportation services.`,
  },
  {
    id: 'eligibility',
    icon: UserCheck,
    title: '2. Driver Eligibility & Background Screening',
    content: `To register and maintain an active driver account on Carline, you must meet and continuously satisfy all of the following requirements:
• Be at least 21 years of age with a minimum of one (1) year of licensed driving experience in the jurisdiction of operation (or three years if under age 23).
• Possess a valid, unexpired driver's license appropriate for passenger transportation in your state or province.
• Maintain a clean driving record free of major moving violations, reckless driving, or DUIs within the past seven (7) years.
• Successfully pass continuous multi-jurisdictional criminal history background checks and national sex offender registry screenings.
• Maintain authorized legal status to work as an independent contractor within your region.`,
  },
  {
    id: 'vehicle-standards',
    icon: Car,
    title: '3. Vehicle Standards & Inspection',
    content: `All vehicles used by drivers to provide transportation services must comply with Carline vehicle standards:
• Must be an approved make and model, generally 15 model years old or newer.
• Must possess four (4) independently opening passenger doors and seating for at least four (4) passengers excluding the driver.
• Must maintain valid vehicle registration, state inspection certification, and roadworthiness compliance.
• Must be equipped with functional air conditioning, heating, seatbelts for all passenger seating positions, and clean interior/exterior condition.
• You are solely responsible for all maintenance, fuel, tolls, detailing, and operating expenses incurred during vehicle use.`,
  },
  {
    id: 'fares-payouts',
    icon: Wallet,
    title: '4. Fares, Commissions & Payouts',
    content: `• Fare Calculation: Fares for trips are calculated according to the transparent pricing matrix consisting of base fare + elapsed trip time + travel distance + dynamic surge multiplier + applicable tolls and taxes.
• Platform Commission: Carline retains a transparent platform service fee as displayed on each trip summary before or upon ride completion.
• Tips: 100% of tips provided by riders are disbursed directly to the driver with zero platform deduction.
• Instant Cashouts: Eligible drivers may request immediate payout transfers to a linked debit card or bank account subject to banking network processing times.
• Fare Adjustments & Fraud: Carline reserves the right to review and adjust trip fares in instances of GPS malfunction, fraudulent route inflation, driver no-shows, or rider billing disputes.`,
  },
  {
    id: 'driver-conduct',
    icon: Shield,
    title: '5. Driver Conduct & Community Guidelines',
    content: `Drivers are expected to uphold the highest standard of professionalism, courtesy, and safety:
• Zero Tolerance for Drugs & Alcohol: Operating a vehicle or providing transportation while impaired by alcohol, narcotics, or prescription medication impairing motor skills is strictly prohibited and results in immediate permanent deactivation.
• Anti-Discrimination Policy: Carline strictly prohibits discrimination against riders or fellow drivers based on race, religion, national origin, disability, sexual orientation, gender identity, marital status, or age.
• Service Animals: Drivers are legally required to transport recognized service animals accompanying passengers in accordance with the Americans with Disabilities Act (ADA) and applicable local laws without additional charges.
• Weapons & Firearms: Carrying firearms or dangerous weapons inside vehicles while active on duty is prohibited to the extent permissible under local law.`,
  },
  {
    id: 'insurance',
    icon: FileText,
    title: '6. Commercial Insurance Coverage',
    content: `Carline maintains commercial auto liability insurance policies on behalf of drivers during active platform sessions:
• Period 1 (App Online / Waiting for Dispatch): Contingent third-party liability coverage up to statutory minimum limits.
• Period 2 (En Route to Pickup) & Period 3 (Passenger Onboard): Up to $1,000,000 in primary commercial auto liability insurance, along with contingent collision and comprehensive coverage (subject to applicable policy deductibles).
• You remain obligated to maintain your personal automobile liability insurance required by state and provincial motor vehicle statutes.`,
  },
  {
    id: 'cancellations',
    icon: AlertTriangle,
    title: '7. Trip Cancellations & Reliability',
    content: `While you are under no obligation to accept any specific trip request, accepting a trip and subsequently canceling without valid safety or mechanical cause undermines platform reliability.
• Driver-Initiated Cancellations: Repeated or chronic cancellations after accepting trips may trigger automated quality reviews and temporary dispatch restrictions.
• Rider No-Shows: If a rider fails to arrive at the verified pickup location within five (5) minutes of your arrival notification, you may cancel the ride and receive the standardized cancellation fee.`,
  },
  {
    id: 'deactivation',
    icon: Ban,
    title: '8. Account Deactivation & Appeals',
    content: `Carline reserves the right to temporarily suspend or permanently deactivate any driver account for:
• Safety violations, physical altercations, or credible reports of unsafe driving behavior.
• Maintaining a driver rating that falls consistently below the regional minimum threshold.
• Submitting fraudulent or altered identification, insurance, or vehicle documentation.
• Attempting to solicit off-platform cash transactions or manipulate GPS/dispatch mechanisms.

Drivers subject to non-safety administrative deactivations may request an internal appeal review via the Driver Portal within fourteen (14) days of notice.`,
  },
  {
    id: 'liability',
    icon: Scale,
    title: '9. Limitation of Liability & Indemnification',
    content: `To the maximum extent permitted by applicable law, Carline and its officers, directors, employees, and affiliates shall not be liable for any indirect, incidental, special, exemplary, punitive, or consequential damages arising out of or in connection with the use of the platform.

You agree to indemnify, defend, and hold harmless Carline against any claims, losses, liabilities, and expenses (including legal fees) arising from your breach of this Agreement, violation of traffic regulations, or third-party claims resulting from your transportation services.`,
  },
  {
    id: 'disputes',
    icon: FileText,
    title: '10. Dispute Resolution & Mandatory Arbitration',
    content: `Except where prohibited by law, you and Carline agree that any dispute, claim, or controversy arising out of or relating to this Agreement or platform use shall be settled by binding individual arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules, rather than in court. You agree to waive any right to participate in a class-action lawsuit or class-wide arbitration against Carline.`,
  },
  {
    id: 'modifications',
    icon: Clock,
    title: '11. Modifications & Updates to Terms',
    content: `Carline may modify or update these Terms periodically to incorporate operational improvements or legal compliance requirements. Significant modifications will be communicated via the Driver Portal or email at least seven (7) days prior to taking effect. Your continued use of the platform after updates take effect signifies your binding acceptance.`,
  },
  {
    id: 'contact',
    icon: Mail,
    title: '12. Legal Contact & Notices',
    content: `Formal legal notices and inquiries regarding these Terms and Conditions should be directed to our Legal Department at:
Carline Mobility Technologies Inc.
Attn: Legal Affairs & Compliance
450 Lexington Ave, Suite 1800, New York, NY 10017
Email: legal@carline.com`,
  },
];

export function TermsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredSections = termsSections.filter(
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
                <Scale className="w-3.5 h-3.5 text-[#FF5B26]" />
                Driver Agreement & Legal
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Terms & Conditions
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Please review these Terms and Conditions carefully. They define driver rights, independent contractor obligations, payout procedures, safety standards, and dispute resolutions.
              </p>
            </div>

            <div className="flex md:flex-col items-start md:items-end gap-2 text-xs text-slate-400 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 shrink-0">
              <span className="flex items-center gap-1.5 text-slate-200 font-medium">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                Last Updated
              </span>
              <span className="font-mono text-slate-300 font-semibold">September 29, 2026</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold mt-1">
                Version 3.2 Active
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
              placeholder="Search legal clauses..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#FF5B26] focus:ring-2 focus:ring-orange-500/10 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 self-end sm:self-center">
            <span>Viewing {filteredSections.length} clauses</span>
            <span className="text-gray-300">•</span>
            <Link
              to="/privacy-policy"
              className="font-semibold text-[#FF5B26] hover:underline"
            >
              View Privacy Policy →
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
              {termsSections.map((sec, idx) => (
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

            {/* Help & Contact Support Footer Card */}
            <div className="rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Have questions about our driver terms?</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Our legal compliance and driver relations team is happy to assist you with contract inquiries.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/contact"
                  className="px-4 py-2 rounded-xl bg-[#FF5B26] hover:bg-[#e04815] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
                >
                  Contact Legal Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;