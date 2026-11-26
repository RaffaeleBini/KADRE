import type { SiteContent } from '../types';
import { cardStyle, SectionHeading } from './SectionHeading';

export function Testimonials({ content }: { content: SiteContent }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-(--space-section)">
      <SectionHeading title={content.testimonialsHeading} />
      <div className="grid gap-6 @3xl:grid-cols-2">
        {content.testimonials.map((t) => (
          <blockquote key={t.id} className="p-8 space-y-5" style={cardStyle}>
            <p className="text-base leading-relaxed">“{t.quote}”</p>
            <footer className="text-sm">
              <strong className="font-semibold">{t.author}</strong>
              <span style={{ color: 'var(--color-text-muted)' }}>
                {' '}· {t.role}, {t.organization}
              </span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
