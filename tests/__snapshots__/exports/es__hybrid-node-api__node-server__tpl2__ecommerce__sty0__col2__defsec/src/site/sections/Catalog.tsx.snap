import { SiteImage } from '../SiteImage';
import type { SiteContent } from '../types';
import { cardStyle, SectionHeading } from './SectionHeading';

export function Catalog({ content }: { content: SiteContent }) {
  return (
    <section id="catalog" className="mx-auto max-w-6xl px-6 py-(--space-section)">
      <SectionHeading title={content.catalogHeading} subtitle={content.catalogSubheading} />
      <div className="grid gap-6 @2xl:grid-cols-2 @5xl:grid-cols-3">
        {content.catalogItems.map((item) => (
          <article key={item.id} className="overflow-hidden flex flex-col" style={cardStyle}>
            <div className="aspect-[16/10] overflow-hidden" style={{ backgroundColor: 'var(--color-surface-alt)' }}>
              <SiteImage src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  <span>{item.category}</span>
                  <span className="font-semibold tabular-nums" style={{ color: 'var(--color-accent)' }}>
                    {item.priceOrTag}
                  </span>
                </div>
                <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {item.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
