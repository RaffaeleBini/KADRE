import { useState } from 'react';
import type { SiteContent } from '../types';
import { SectionHeading } from './SectionHeading';

export function Faq({ content }: { content: SiteContent }) {
  const [openId, setOpenId] = useState<string | null>(content.faqs[0]?.id ?? null);
  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-(--space-section)">
      <SectionHeading title={content.faqHeading} />
      <div className="divide-y border-y" style={{ borderColor: 'var(--color-border)' }}>
        {content.faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div key={faq.id} className="py-5" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between text-left font-semibold cursor-pointer"
              >
                <span>{faq.question}</span>
                <span className="ml-4 text-lg" style={{ color: 'var(--color-accent)' }}>
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen ? (
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {faq.answer}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
