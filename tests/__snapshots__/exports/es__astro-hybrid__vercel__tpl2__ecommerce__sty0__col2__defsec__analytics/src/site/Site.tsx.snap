import { Catalog } from './sections/Catalog';
import { Contact } from './sections/Contact';
import { Faq } from './sections/Faq';
import { Features } from './sections/Features';
import { Hero } from './sections/Hero';
import { Metrics } from './sections/Metrics';
import { Pricing } from './sections/Pricing';
import { Testimonials } from './sections/Testimonials';
import type { SectionType, SiteConfig, SiteContent } from './types';

/**
 * Sito a una pagina. Il layout risponde alla larghezza di questo contenitore
 * (container queries "@…:"), non della finestra: così funziona identico sia a
 * schermo intero sia dentro l'anteprima di KADRE.
 */
export function Site({ content, config }: { content: SiteContent; config: SiteConfig }) {
  const { sectionOrder, ui } = config;
  const has = (type: SectionType) => sectionOrder.includes(type);

  const navItems = [
    has('features') ? { id: 'features', label: ui.nav.features } : null,
    has('catalog') ? { id: 'catalog', label: ui.nav.catalog } : null,
    has('pricing') ? { id: 'pricing', label: ui.nav.pricing } : null,
    has('faq') ? { id: 'faq', label: ui.nav.faq } : null,
    has('contact') ? { id: 'contact', label: ui.nav.contact } : null,
  ].filter((item): item is { id: string; label: string } => item !== null);

  return (
    <div
      className="@container"
      style={{
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <header
        className="sticky top-0 z-30 border-b backdrop-blur-md"
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: 'color-mix(in srgb, var(--color-bg) 91%, transparent)',
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
          <a
            href="#top"
            className="flex items-center gap-3 text-lg font-bold tracking-tight whitespace-nowrap shrink-0"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {content.logoDataUrl ? (
              <img src={content.logoDataUrl} alt={content.brandName} className="h-7 w-7 object-contain" />
            ) : null}
            <span>{content.brandName}</span>
          </a>

          <nav className="hidden @3xl:flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={'#' + item.id}
                className="transition-opacity hover:opacity-100 whitespace-nowrap shrink-0"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            className="px-4 py-2 text-sm font-semibold whitespace-nowrap shrink-0 transition-opacity hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-accent-text)',
              borderRadius: 'var(--radius-btn)',
            }}
          >
            {content.heroCtaPrimary}
          </a>
        </div>
      </header>

      <main id="top">
        {sectionOrder.map((type) => {
          switch (type) {
            case 'hero':
              return <Hero key={type} content={content} layout={config.heroLayout} />;
            case 'metrics':
              return <Metrics key={type} content={content} />;
            case 'features':
              return <Features key={type} content={content} />;
            case 'catalog':
              return <Catalog key={type} content={content} />;
            case 'pricing':
              return <Pricing key={type} content={content} />;
            case 'testimonials':
              return <Testimonials key={type} content={content} />;
            case 'faq':
              return <Faq key={type} content={content} />;
            case 'contact':
              return (
                <Contact
                  key={type}
                  content={content}
                  ui={ui.form}
                  hasBackendApi={config.hasBackendApi}
                  provider={config.contactProvider}
                />
              );
          }
        })}
      </main>

      <footer className="border-t py-10" style={{ borderColor: 'var(--color-border)' }}>
        <div
          className="mx-auto flex max-w-6xl flex-col @2xl:flex-row items-center justify-between gap-4 px-6 text-xs"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <span>
            © {new Date().getFullYear()} {content.brandName} · {content.tagline}
          </span>
          <span>{content.footerNote}</span>
        </div>
      </footer>
    </div>
  );
}
