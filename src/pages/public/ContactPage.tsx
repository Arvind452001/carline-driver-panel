import { useState } from 'react';
import {
  Mail,
  PhoneCall,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building,
  Sparkles,
  Headphones,
  HelpCircle,
} from 'lucide-react';

const contactCards = [
  {
    icon: Headphones,
    title: 'Driver Support Desk',
    desc: 'For active ride assistance, earnings inquiries, and account verification help.',
    contact: 'support@carline.com',
    actionText: 'Email Support',
    actionHref: 'mailto:support@carline.com',
  },
  {
    icon: PhoneCall,
    title: '24/7 Driver Hotline',
    desc: 'Immediate phone support for urgent on-road questions and incident reports.',
    contact: '+1 (800) 555-CARS',
    actionText: 'Call Hotline',
    actionHref: 'tel:+18005552277',
  },
  {
    icon: Building,
    title: 'Corporate Headquarters',
    desc: 'Carline Mobility Technologies Inc., Driver Relations & Operations Center.',
    contact: '450 Lexington Ave, Suite 1800, New York, NY 10017',
    actionText: 'Get Directions',
    actionHref: 'https://maps.google.com',
  },
];

const hubs = [
  { city: 'New York Metro', address: '450 Lexington Ave, Fl 18, NY', hours: 'Mon - Fri: 8am - 6pm' },
  { city: 'Los Angeles Hub', address: '1200 Wilshire Blvd, Suite 400, CA', hours: 'Mon - Sat: 9am - 7pm' },
  { city: 'Chicago Central', address: '300 N LaSalle Dr, Chicago, IL', hours: 'Mon - Fri: 8am - 5pm' },
  { city: 'Austin Tech Hub', address: '500 W 2nd St, Austin, TX', hours: 'Mon - Fri: 9am - 6pm' },
];

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'Driver Support & Account',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        topic: 'Driver Support & Account',
        message: '',
      });
    }, 4000);
  };

  return (
    <div className="bg-white text-slate-800 min-h-screen pt-20">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#080D1A] via-[#0d1527] to-[#162238] text-white py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#FF5B26_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF5B26]/15 border border-[#FF5B26]/30 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>Contact & Support</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            We are Here to <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5B26] via-orange-400 to-amber-300">
              Support You 24/7
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Have questions about onboarding, daily payouts, or platform features? Reach out to our dedicated support agents anytime.
          </p>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5B26]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
                  <p className="text-xs font-semibold text-slate-900 pt-1 break-words">{card.contact}</p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <a
                    href={card.actionHref}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5B26] hover:underline"
                  >
                    <span>{card.actionText}</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form & Hubs Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-lg p-6 sm:p-10 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-50 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Send Us a Message</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Get in Touch with our Team
              </h2>
              <p className="text-xs text-slate-500">
                Fill out the form below and a representative will respond within 2 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl flex items-center gap-4 animate-fade-in">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                <div className="text-xs sm:text-sm">
                  <h4 className="font-bold">Message sent successfully!</h4>
                  <p className="text-emerald-700 mt-1">
                    Thank you for reaching out. Ticket reference ID #{Math.floor(100000 + Math.random() * 900000)} has been created for your inquiry.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-[#FF5B26] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="driver@example.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-[#FF5B26] transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-[#FF5B26] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Inquiry Subject
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-[#FF5B26] transition"
                    >
                      <option>Driver Support & Account</option>
                      <option>Earnings & Daily Payouts</option>
                      <option>Vehicle Document Verification</option>
                      <option>Safety & Incident Reporting</option>
                      <option>Media & Press Inquiry</option>
                      <option>Partnership & Fleet Management</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Message / Detailed Question
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your question or request in detail..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-[#FF5B26] transition"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#FF5B26] hover:bg-[#E04815] text-white text-xs font-bold shadow-md shadow-orange-500/25 transition hover:scale-105"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Regional Hubs & In-Person Support */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-100/70 text-[#FF5B26] text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>In-Person Assistance</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Driver Support Hubs
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Need face-to-face assistance with vehicle inspections or document onboarding? Visit our regional driver centers.
              </p>

              <div className="space-y-3 pt-2">
                {hubs.map((hub, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs space-y-1.5"
                  >
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FF5B26]" />
                      {hub.city}
                    </div>
                    <div className="text-[11px] text-slate-600 pl-3.5">{hub.address}</div>
                    <div className="text-[10px] text-slate-400 pl-3.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {hub.hours}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* In-App Support Callout */}
            <div className="bg-gradient-to-br from-[#080D1A] to-slate-900 rounded-3xl p-6 text-white space-y-3 shadow-lg">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#FF5B26]" />
                Are you an active registered driver?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Log in to your Driver Portal to open real-time live chat tickets with direct priority dispatch routing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
