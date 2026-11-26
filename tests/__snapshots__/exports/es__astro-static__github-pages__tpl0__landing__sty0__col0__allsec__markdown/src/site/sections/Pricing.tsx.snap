import { useState } from 'react';
import type { PaymentsConfig, SiteContent, SiteUi } from '../types';
import { SectionHeading } from './SectionHeading';

export function Pricing({
  content,
  payments,
  ui,
}: {
  content: SiteContent;
  payments?: PaymentsConfig;
  ui?: SiteUi['payment'];
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  // Sitio con servidor: /api/checkout crea la sesión de Stripe y devuelve su URL
  async function checkout(planId: string) {
    setBusy(planId);
    setFailed(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      const data = (await res.json().catch(() => null)) as { url?: string } | null;
      if (!res.ok || !data?.url) throw new Error(String(res.status));
      window.location.assign(data.url);
    } catch {
      setFailed(planId);
      setBusy(null);
    }
  }

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-(--space-section)">
      <SectionHeading title={content.pricingHeading} subtitle={content.pricingSubheading} />
      <div className="grid gap-6 @3xl:grid-cols-3">
        {content.pricingPlans.map((plan) => {
          // un plan sin enlace ni price ID sigue llevando a Contacto (p. ej. «a medida»)
          const link = payments?.type === 'links' ? payments.links[plan.id] : '';
          const canCheckout = payments?.type === 'checkout' && !!payments.prices[plan.id]?.priceId;
          const ctaClass = 'block w-full py-2.5 text-center text-sm font-semibold';
          const ctaStyle = {
            backgroundColor: plan.featured ? 'var(--color-accent)' : 'transparent',
            color: plan.featured ? 'var(--color-accent-text)' : 'var(--color-text)',
            border: plan.featured ? 'none' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius-btn)',
          };
          return (
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
              <div className="space-y-2">
                {canCheckout ? (
                  <button
                    type="button"
                    disabled={busy === plan.id}
                    onClick={() => checkout(plan.id)}
                    className={`${ctaClass} cursor-pointer`}
                    style={ctaStyle}
                  >
                    {busy === plan.id ? ui?.redirecting : plan.ctaLabel}
                  </button>
                ) : (
                  <a href={link || '#contact'} className={ctaClass} style={ctaStyle}>
                    {plan.ctaLabel}
                  </a>
                )}
                {failed === plan.id ? <p className="text-center text-xs text-red-500">{ui?.error}</p> : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
