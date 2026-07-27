'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Is AK Business OS only for restaurants?',
    answer: 'No. Restaurants are one launch category, but the platform is built for retail, hotels, salons, healthcare, warehouses, manufacturing, education, corporate teams, and service businesses.'
  },
  {
    question: 'How does the free trial work?',
    answer: 'You create a sandbox workspace, choose your industry, and explore the core operating modules for 14 days. The trial does not require a credit card.'
  },
  {
    question: 'Can I add custom modules or integrations?',
    answer: 'Yes. Marketplace extensions and custom integrations can connect messaging, payments, accounting, analytics, customer apps, and internal workflow tools.'
  },
  {
    question: 'Can my team use different roles and permissions?',
    answer: 'Yes. Owners, managers, cashiers, waiters, kitchen teams, support staff, and admins can each receive role-based access to the modules they need.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="landing-section">
      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="scroll-reveal text-center">
          <h2 className="text-3xl font-black tracking-tight text-[color:var(--landing-text)] sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm font-semibold leading-6 landing-muted">
            Clear answers for business owners planning a serious operating system rollout.
          </p>
        </div>

        <div className="scroll-reveal mt-10 space-y-4" data-reveal-delay="1">
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            return (
              <div key={faq.question} className="overflow-hidden rounded-2xl landing-card">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-sm font-black text-[color:var(--landing-text)]"
                  aria-expanded={open}
                >
                  <span>{faq.question}</span>
                  <ChevronDown size={17} className={`shrink-0 transition ${open ? 'rotate-180 text-blue-600' : 'landing-soft-text'}`} />
                </button>
                <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <p className="border-t border-[color:var(--landing-border)] px-5 py-5 text-sm font-semibold leading-7 landing-muted">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

