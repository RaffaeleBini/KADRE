import type { SiteContent } from '../types';
import { SectionHeading } from './SectionHeading';

export function Pricing({ content }: { content: SiteContent }) {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-(--space-section)">
      <SectionHeading title={content.pricingHeading} subtitle={content.pricingSubheading} />
      <div className="grid gap-6 @3xl:grid-cols-3">
        {content.pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className="p-6 flex flex-col justify-between space-y-6"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: plan.featured ? '2px solid var(--color-accent)' : 'var(--border-w) solid var(--color-border)',
              borderRadius: 'var(--radius-card)',
            }}
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                  {plan.name}
                </h3>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  {plan.audience}
                </p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold tabular-nums">{plan.price}</span>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {plan.cadence}
                </span>
              </div>
              <ul className="space-y-2 text-sm pt-2" style={{ color: 'var(--color-text-muted)' }}>
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span style={{ color: 'var(--color-accent)' }}>—</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <a
              href="#contact"
              className="block w-full py-2.5 text-center text-sm font-semibold"
              style={{
                backgroundColor: plan.featured ? 'var(--color-accent)' : 'transparent',
                color: plan.featured ? 'var(--color-accent-text)' : 'var(--color-text)',
                border: plan.featured ? 'none' : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-btn)',
              }}
            >
              {plan.ctaLabel}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
