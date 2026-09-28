import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: '1. How do I start driving with Carline?',
      a: 'Simply sign up, submit your documents, complete verification and start driving. The process is fast and completely online.',
    },
    {
      q: '2. What documents are required to apply?',
      a: 'You will need an active Driving License, Vehicle Registration Certificate (RC), commercial vehicle insurance, and a government ID proof (Aadhaar or Passport).',
    },
    {
      q: '3. How do driver payouts work?',
      a: 'Payouts are calculated transparently with direct instant transfers or scheduled weekly deposits straight to your registered bank account, with zero hidden platform charges.',
    },
    {
      q: '4. Can I choose my own working hours?',
      a: 'Yes, absolutely! You have full flexibility. Turn the driver app online whenever you wish to drive and turn it off whenever you want to take a break.',
    },
  ];

  return (
    <section id="faq" className="pt-8 pb-10 bg-[#FFF8F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEFE7] text-[#FF5B26] font-bold text-xs uppercase tracking-wider mb-3">
            HAVE ANY QUESTIONS?
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked{' '}
            <span className="text-[#FF5B26]">
              Questions
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-12 space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border-0 shadow-md shadow-slate-900/5 hover:shadow-lg overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left flex justify-between items-center font-bold text-slate-800 text-sm sm:text-base hover:text-[#FF5B26] transition"
                >
                  <span>{faq.q}</span>
                  <span className="w-6 h-6 rounded-full bg-[#FFEFE7] text-[#FF5B26] flex items-center justify-center shrink-0 ml-2">
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openFaq === idx ? 'transform rotate-180' : ''
                      }`}
                    />
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 pt-3 animate-fade-in bg-[#FFFAF7]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
