import { SiteImage } from '../SiteImage';
import type { HeroLayout, SiteContent } from '../types';

export function Hero({ content, layout }: { content: SiteContent; layout: HeroLayout }) {
  const centered = layout === 'centered';
  return (
    <section className="mx-auto max-w-6xl px-6 py-(--space-section)">
      <div
        className={
          centered
            ? 'mx-auto max-w-3xl text-center space-y-8'
            : 'grid gap-12 @5xl:grid-cols-12 items-stretch'
        }
      >
        <div className={centered ? 'space-y-6' : '@5xl:col-span-6 flex flex-col justify-center space-y-6'}>
          <p className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
            {content.heroEyebrow}
          </p>
          <h1
            className="text-4xl @5xl:text-5xl font-bold leading-tight [text-wrap:balance]"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: 'var(--heading-tracking)' }}
          >
            {content.heroHeadline}
          </h1>
          <p className="text-base @5xl:text-lg leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            {content.heroSubheadline}
          </p>
          <div className={centered ? 'flex flex-wrap justify-center gap-4 pt-2' : 'flex flex-wrap gap-4 pt-2'}>
            <a
              href="#contact"
              className="px-6 py-3 text-sm font-semibold whitespace-nowrap"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-accent-text)',
                borderRadius: 'var(--radius-btn)',
              }}
            >
              {content.heroCtaPrimary}
            </a>
            <a
              href="#features"
              className="px-6 py-3 text-sm font-semibold border whitespace-nowrap"
              style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-btn)' }}
            >
              {content.heroCtaSecondary}
            </a>
          </div>
        </div>

        <div className={centered ? 'pt-6' : '@5xl:col-span-6'}>
          <div
            className="overflow-hidden border h-full min-h-[300px]"
            style={{
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--radius-card)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            <SiteImage src={content.heroImageUrl} alt={content.brandName} className="h-full w-full min-h-[300px] object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
