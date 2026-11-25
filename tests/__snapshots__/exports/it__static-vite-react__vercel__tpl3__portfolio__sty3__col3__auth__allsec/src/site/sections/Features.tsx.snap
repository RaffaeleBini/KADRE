import { SiteContent } from '../types';
import { cardStyle, SectionHeading } from './SectionHeading';

export function Features({ content }: { content: SiteContent }) {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-(--space-section)">
      <SectionHeading title={content.featuresHeading} subtitle={content.featuresSubheading} />
      <div className="grid gap-6 @3xl:grid-cols-3">
        {content.features.map((feat, idx) => (
          <article key={feat.id} className="p-6 space-y-3" style={cardStyle}>
            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <span className="tabular-nums">0{idx + 1}</span>
              <span>{feat.metric}</span>
            </div>
            <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
              {feat.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              {feat.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
