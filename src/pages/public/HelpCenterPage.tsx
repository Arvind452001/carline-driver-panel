import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  Wallet,
  Car,
  ShieldCheck,
  Smartphone,
  FileText,
  UserCheck,
  ChevronDown,
  PhoneCall,
  MessageSquare,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const helpCategories = [
  {
    id: 'earnings',
    icon: Wallet,
    title: 'Earnings & Payouts',
    desc: 'Instant cashouts, weekly bank direct deposits, bonus quests, and fare breakdowns.',
    count: '8 Articles',
  },
  {
    id: 'trips',
    icon: Smartphone,
    title: 'Trips & Navigation',
    desc: 'Accepting rides, upfront pricing, route navigation, cancellations, and surge heatmaps.',
    count: '12 Articles',
  },
  {
    id: 'account',
    icon: UserCheck,
    title: 'Account & Verification',
    desc: 'Updating documents, background check renewals, phone number/email changes.',
    count: '6 Articles',
  },
  {
    id: 'safety',
    icon: ShieldCheck,
    title: 'Safety & Incident Support',
    desc: 'In-app SOS emergency features, passenger reporting, insurance policies, accident claims.',
    count: '9 Articles',
  },
  {
    id: 'vehicle',
    icon: Car,
    title: 'Vehicle Standards & Inspection',
    desc: 'Approved vehicle models, annual inspections, maintenance discounts, and fleet requirements.',
    count: '7 Articles',
  },
  {
    id: 'legal',
    icon: FileText,
    title: 'Tax & Compliance',
    desc: '1099 tax summaries, expense tracking, local regulatory permits, and license renewals.',
    count: '5 Articles',
  },
];

const faqs: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'earnings',
    question: 'How do instant daily payouts work?',
    answer:
      'With Carline Instant Cashout, you can transfer your eligible trip earnings directly to your linked debit card or bank account up to 5 times per day. Funds arrive within minutes with 0% platform transfer fees.',
  },
  {
    id: 'faq-2',
    category: 'earnings',
    question: 'When do regular weekly direct deposits occur?',
    answer:
      'Weekly earnings cycles run from Monday 04:00 AM to the following Monday 03:59 AM. Deposits are automatically initiated every Tuesday morning and typically settle in your bank account by Wednesday or Thursday depending on your bank.',
  },
  {
    id: 'faq-3',
    category: 'trips',
    question: 'How are trip fares calculated?',
    answer:
      'Fare calculations are based on base pickup fare + per-mile rate + per-minute rate + active surge multiplier. Drivers receive full upfront visibility into trip distance, estimated earnings, and destination address prior to accepting any request.',
  },
  {
    id: 'faq-4',
    category: 'trips',
    question: 'What should I do if a rider is a no-show or cancels?',
    answer:
      'If you arrive at the designated pickup point and the rider does not appear within 5 minutes (or cancels after 2 minutes of dispatch), you receive a guaranteed cancellation fee directly credited to your driver account.',
  },
  {
    id: 'faq-5',
    category: 'safety',
    question: 'How does the in-app emergency SOS button work?',
    answer:
      'Tapping the Shield SOS icon on your driver active trip screen immediately alerts our 24/7 Critical Safety Response Team and shares your real-time GPS location with local 911 emergency services.',
  },
  {
    id: 'faq-6',
    category: 'vehicle',
    question: 'What are the vehicle age and condition requirements?',
    answer:
      'Vehicles must generally be 15 years old or newer, possess 4 doors with independent passenger access, have working AC/heating, pass an annual safety inspection, and have valid commercial or personal insurance.',
  },
  {
    id: 'faq-7',
    category: 'account',
    question: 'How do I update an expired driver license or insurance document?',
    answer:
      'Navigate to Driver Manager > Documents in your portal, select the expiring document, and upload a clear photo of your renewed physical card. Verification is automated and processed within 2 to 4 hours.',
  },
  {
    id: 'faq-8',
    category: 'safety',
    question: 'Are drivers covered by commercial insurance during trips?',
    answer:
      'Yes. From the moment you accept a ride until the passenger exits the vehicle, Carline provides $1,000,000 commercial auto liability insurance, contingent comprehensive/collision coverage, and uninsured motorist protection.',
  },
];

export function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white text-slate-800 min-h-screen pt-20">
      {/* Hero Header with Live Search */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#080D1A] via-[#0d1527] to-[#162238] text-white py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#FF5B26_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF5B26]/15 border border-[#FF5B26]/30 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Driver Support Center</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            How can we help you today?
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Find answers to common questions regarding driver payouts, ride dispatching, safety policies, and account settings.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, e.g. 'instant payout', 'cancellation fee', 'insurance'..."
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-white text-slate-900 placeholder:text-slate-400 rounded-2xl shadow-2xl outline-none focus:ring-4 focus:ring-[#FF5B26]/30 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Browse by Topic
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Select a topic to explore comprehensive guides and troubleshooting steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpCategories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                className={`p-6 rounded-3xl border text-left transition-all duration-200 flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'border-[#FF5B26] bg-orange-50/60 shadow-lg shadow-orange-500/10'
                    : 'border-slate-200/80 bg-white hover:border-orange-300 hover:shadow-md'
                }`}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100/70 text-[#FF5B26] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{cat.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{cat.desc}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="font-semibold text-slate-400">{cat.count}</span>
                  <span className="text-[#FF5B26] font-bold flex items-center gap-1">
                    {isSelected ? 'Showing Articles' : 'Explore'} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-slate-50 py-16 border-y border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-100/70 text-[#FF5B26] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Quick Answers ({filteredFaqs.length})
              </h2>
            </div>

            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold text-[#FF5B26] hover:underline self-start"
              >
                Show All Categories
              </button>
            )}
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 transition"
                  >
                    <span className="text-sm font-bold text-slate-900">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#FF5B26]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredFaqs.length === 0 && (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-900">No matching help articles found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try searching for different keywords or contact our 24/7 support team below.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Direct Contact & Support Channels */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Still need assistance?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Our dedicated driver support specialists are available 24 hours a day, 7 days a week.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5B26]">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">In-App Live Chat</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect instantly with a live support representative directly from your driver dashboard.
              </p>
            </div>
            <Link
              to="/support"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-[#FF5B26] hover:bg-[#E04815] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition"
            >
              <span>Open Driver Support</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5B26]">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">24/7 Driver Hotline</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Call our dedicated driver emergency and operational hotline anytime for immediate voice support.
              </p>
            </div>
            <a
              href="tel:+18005552277"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>+1 (800) 555-CARS</span>
            </a>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5B26]">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Email Support</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Send us detailed inquiries or document attachments. We guarantee a response within 2 hours.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
            >
              <span>Submit Contact Form</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
