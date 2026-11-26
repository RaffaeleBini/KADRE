import type { SiteContent } from '../types';

export function Metrics({ content }: { content: SiteContent }) {
  return (
    <section
      className="border-y"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
    >
      <div
        className="mx-auto grid max-w-6xl grid-cols-2 @5xl:grid-cols-4 divide-y @5xl:divide-y-0 @5xl:divide-x"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {content.metrics.map((metric) => (
          <div key={metric.id} className="p-6 @5xl:p-8 space-y-1" style={{ borderColor: 'var(--color-border)' }}>
            <div
              className="text-3xl font-bold tabular-nums"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}
            >
              {metric.value}
            </div>
            <div className="text-sm font-semibold">{metric.label}</div>
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {metric.context}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
