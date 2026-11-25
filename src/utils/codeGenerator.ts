import JSZip from 'jszip';
import { Locale } from '../i18n/translations';
import {
  ColorPatternPreset,
  DiscoveryAnswers,
  GeneratedFile,
  GithubExportConfig,
  GraphicStylePreset,
  SectionConfig,
  SiteContent,
  StackRecommendation,
  TemplateDefinition,
} from '../types/builder';

export interface CodeGenerationInput {
  locale: Locale;
  answers: DiscoveryAnswers;
  stack: StackRecommendation;
  template: TemplateDefinition;
  sections: SectionConfig[];
  graphicStyle: GraphicStylePreset;
  colorPattern: ColorPatternPreset;
  content: SiteContent;
  github: GithubExportConfig;
}

function sanitizeRepoSlug(raw: string, locale: Locale): string {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cleaned || (locale === 'it' ? 'mio-sito-web' : 'mi-web-automatizada');
}

function getDeployWorkflowYaml(
  config: GithubExportConfig,
  stack: StackRecommendation,
  locale: Locale
): string {
  const branch = config.branch || 'main';
  const isIt = locale === 'it';
  if (config.deployPlatform === 'github-pages' && !stack.includesBackend) {
    return `name: ${isIt ? 'Deploy su GitHub Pages' : 'Desplegar en GitHub Pages'}

on:
  push:
    branches: ["${branch}"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: ${isIt ? 'Scarica codice' : 'Descargar código'}
        uses: actions/checkout@v4
      - name: ${isIt ? 'Configura Node.js' : 'Configurar Node.js'}
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - name: ${isIt ? 'Installa dipendenze' : 'Instalar dependencias'}
        run: npm ci
      - name: ${isIt ? 'Compila applicazione' : 'Compilar aplicación'}
        run: npm run build
      - name: ${isIt ? 'Carica artefatto statico' : 'Subir artefacto estático'}
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: ${isIt ? 'Pubblica su GitHub Pages' : 'Publicar en GitHub Pages'}
        id: deployment
        uses: actions/deploy-pages@v4
`;
  }

  return `name: ${isIt ? 'Integrazione e verifica continua' : 'Integración y verificación continua'}

on:
  push:
    branches: ["${branch}"]
  pull_request:
    branches: ["${branch}"]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - name: ${isIt ? 'Scarica codice' : 'Descargar código'}
        uses: actions/checkout@v4
      - name: ${isIt ? 'Configura Node.js' : 'Configurar Node.js'}
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - name: ${isIt ? 'Installa dipendenze' : 'Instalar dependencias'}
        run: npm ci
      - name: ${isIt ? 'Verifica TypeScript e build' : 'Verificar TypeScript y compilación'}
        run: npm run build
`;
}

function generateSiteAppTsx(
  locale: Locale,
  template: TemplateDefinition,
  sections: SectionConfig[],
  graphicStyle: GraphicStylePreset,
  colorPattern: ColorPatternPreset,
  stack: StackRecommendation
): string {
  const isIt = locale === 'it';
  const enabledTypes = sections.filter((s) => s.enabled).map((s) => s.type);
  const sectionOrderLiteral = JSON.stringify(enabledTypes);

  return `import React, { useState } from 'react';
import content from './data/siteContent.json';

const SECTION_ORDER = ${sectionOrderLiteral} as const;
const HERO_LAYOUT = '${template.heroLayout}' as const;
const HAS_BACKEND_API = ${stack.includesBackend};

export default function App() {
  const [openFaqId, setOpenFaqId] = useState<string | null>(content.faqs[0]?.id ?? null);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim()) return;
    setFormStatus('sending');
    try {
      if (HAS_BACKEND_API) {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formState),
        });
        if (!res.ok) throw new Error('${isIt ? 'Errore di invio' : 'Error de envío'}');
      }
      setFormStatus('sent');
      setFormState({ name: '', email: '', message: '' });
    } catch {
      setFormStatus('error');
    }
  }

  const navItems = [
    SECTION_ORDER.includes('features') ? { id: 'features', label: '${isIt ? 'Capacità' : 'Capacidades'}' } : null,
    SECTION_ORDER.includes('catalog') ? { id: 'catalog', label: '${isIt ? 'Selezione' : 'Selección'}' } : null,
    SECTION_ORDER.includes('pricing') ? { id: 'pricing', label: '${isIt ? 'Piani' : 'Planes'}' } : null,
    SECTION_ORDER.includes('faq') ? { id: 'faq', label: '${isIt ? 'Domande' : 'Preguntas'}' } : null,
    SECTION_ORDER.includes('contact') ? { id: 'contact', label: '${isIt ? 'Contatti' : 'Contacto'}' } : null,
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <div
      className="min-h-screen"
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
          backgroundColor: '${colorPattern.background}e8',
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
          <a
            href="#top"
            className="flex items-center gap-3 text-lg font-bold tracking-tight whitespace-nowrap shrink-0"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {content.logoDataUrl ? (
              <img
                src={content.logoDataUrl}
                alt={content.brandName}
                className="h-7 w-7 object-contain"
              />
            ) : null}
            <span>{content.brandName}</span>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {navItems.slice(0, 5).map((item) => (
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
        {SECTION_ORDER.map((sectionType) => {
          if (sectionType === 'hero') {
            return (
              <section key="hero" className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
                <div
                  className={
                    HERO_LAYOUT === 'centered'
                      ? 'mx-auto max-w-3xl text-center space-y-8'
                      : 'grid gap-12 lg:grid-cols-12 items-stretch'
                  }
                >
                  <div className={HERO_LAYOUT === 'centered' ? 'space-y-6' : 'lg:col-span-6 flex flex-col justify-center space-y-6'}>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
                      {content.heroEyebrow}
                    </p>
                    <h1
                      className="text-4xl lg:text-5xl font-bold leading-tight [text-wrap:balance]"
                      style={{
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '${graphicStyle.headingTracking}',
                      }}
                    >
                      {content.heroHeadline}
                    </h1>
                    <p className="text-base lg:text-lg leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                      {content.heroSubheadline}
                    </p>
                    <div className={HERO_LAYOUT === 'centered' ? 'flex flex-wrap justify-center gap-4 pt-2' : 'flex flex-wrap gap-4 pt-2'}>
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
                        style={{
                          borderColor: 'var(--color-border)',
                          borderRadius: 'var(--radius-btn)',
                        }}
                      >
                        {content.heroCtaSecondary}
                      </a>
                    </div>
                  </div>

                  <div className={HERO_LAYOUT === 'centered' ? 'pt-6' : 'lg:col-span-6'}>
                    <div
                      className="overflow-hidden border h-full min-h-[300px]"
                      style={{
                        borderColor: 'var(--color-border)',
                        borderRadius: 'var(--radius-card)',
                        backgroundColor: 'var(--color-surface)',
                      }}
                    >
                      <img
                        src={content.heroImageUrl}
                        alt={content.brandName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          if (sectionType === 'metrics') {
            return (
              <section
                key="metrics"
                className="border-y"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
              >
                <div className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x" style={{ borderColor: 'var(--color-border)' }}>
                  {content.metrics.map((metric) => (
                    <div key={metric.id} className="p-6 lg:p-8 space-y-1">
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

          if (sectionType === 'features') {
            return (
              <section key="features" id="features" className="mx-auto max-w-6xl px-6 py-20">
                <div className="max-w-2xl space-y-3 mb-12">
                  <h2 className="text-3xl font-bold [text-wrap:balance]" style={{ fontFamily: 'var(--font-display)' }}>
                    {content.featuresHeading}
                  </h2>
                  <p style={{ color: 'var(--color-text-muted)' }}>{content.featuresSubheading}</p>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  {content.features.map((feat, idx) => (
                    <article
                      key={feat.id}
                      className="p-6 space-y-3"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        border: 'var(--border-w) solid var(--color-border)',
                        borderRadius: 'var(--radius-card)',
                      }}
                    >
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

          if (sectionType === 'catalog') {
            return (
              <section key="catalog" id="catalog" className="mx-auto max-w-6xl px-6 py-20">
                <div className="max-w-2xl space-y-3 mb-12">
                  <h2 className="text-3xl font-bold [text-wrap:balance]" style={{ fontFamily: 'var(--font-display)' }}>
                    {content.catalogHeading}
                  </h2>
                  <p style={{ color: 'var(--color-text-muted)' }}>{content.catalogSubheading}</p>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  {content.catalogItems.map((item) => (
                    <article
                      key={item.id}
                      className="overflow-hidden flex flex-col"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        border: 'var(--border-w) solid var(--color-border)',
                        borderRadius: 'var(--radius-card)',
                      }}
                    >
                      <div className="aspect-[16/10] overflow-hidden" style={{ backgroundColor: 'var(--color-surface-alt)' }}>
                        <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
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

          if (sectionType === 'pricing') {
            return (
              <section key="pricing" id="pricing" className="mx-auto max-w-6xl px-6 py-20">
                <div className="max-w-2xl space-y-3 mb-12">
                  <h2 className="text-3xl font-bold [text-wrap:balance]" style={{ fontFamily: 'var(--font-display)' }}>
                    {content.pricingHeading}
                  </h2>
                  <p style={{ color: 'var(--color-text-muted)' }}>{content.pricingSubheading}</p>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  {content.pricingPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="p-6 flex flex-col justify-between space-y-6"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        border: plan.featured
                          ? '2px solid var(--color-accent)'
                          : 'var(--border-w) solid var(--color-border)',
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

          if (sectionType === 'testimonials') {
            return (
              <section key="testimonials" className="mx-auto max-w-6xl px-6 py-20">
                <h2 className="text-3xl font-bold mb-10 [text-wrap:balance]" style={{ fontFamily: 'var(--font-display)' }}>
                  {content.testimonialsHeading}
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {content.testimonials.map((t) => (
                    <blockquote
                      key={t.id}
                      className="p-8 space-y-5"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        border: 'var(--border-w) solid var(--color-border)',
                        borderRadius: 'var(--radius-card)',
                      }}
                    >
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

          if (sectionType === 'faq') {
            return (
              <section key="faq" id="faq" className="mx-auto max-w-4xl px-6 py-20">
                <h2 className="text-3xl font-bold mb-10" style={{ fontFamily: 'var(--font-display)' }}>
                  {content.faqHeading}
                </h2>
                <div className="divide-y border-y" style={{ borderColor: 'var(--color-border)' }}>
                  {content.faqs.map((faq) => {
                    const isOpen = openFaqId === faq.id;
                    return (
                      <div key={faq.id} className="py-5">
                        <button
                          type="button"
                          onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                          className="flex w-full items-center justify-between text-left font-semibold"
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

          if (sectionType === 'contact') {
            return (
              <section key="contact" id="contact" className="mx-auto max-w-6xl px-6 py-20">
                <div
                  className="grid gap-10 p-8 lg:grid-cols-12 lg:p-12"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: 'var(--border-w) solid var(--color-border)',
                    borderRadius: 'var(--radius-card)',
                  }}
                >
                  <div className="lg:col-span-5 space-y-4">
                    <h2 className="text-3xl font-bold [text-wrap:balance]" style={{ fontFamily: 'var(--font-display)' }}>
                      {content.contactHeading}
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                      {content.contactSubheading}
                    </p>
                    <div className="pt-4 space-y-2 text-sm">
                      <div>{content.contactEmail}</div>
                      <div style={{ color: 'var(--color-text-muted)' }}>{content.contactLocation}</div>
                    </div>
                  </div>
                  <form onSubmit={handleContactSubmit} className="lg:col-span-7 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        required
                        placeholder="${isIt ? 'Il tuo nome' : 'Tu nombre'}"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-transparent border"
                        style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-btn)' }}
                      />
                      <input
                        type="email"
                        required
                        placeholder="${isIt ? 'Indirizzo email' : 'Correo electrónico'}"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-transparent border"
                        style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-btn)' }}
                      />
                    </div>
                    <textarea
                      rows={4}
                      placeholder="${isIt ? 'Raccontaci il tuo progetto...' : 'Cuéntanos sobre tu proyecto...'}"
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-4 py-3 text-sm bg-transparent border"
                      style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--radius-btn)' }}
                    />
                    <div className="flex items-center gap-4">
                      <button
                        type="submit"
                        disabled={formStatus === 'sending'}
                        className="px-6 py-3 text-sm font-semibold"
                        style={{
                          backgroundColor: 'var(--color-accent)',
                          color: 'var(--color-accent-text)',
                          borderRadius: 'var(--radius-btn)',
                        }}
                      >
                        {formStatus === 'sending'
                          ? '${isIt ? 'Invio in corso...' : 'Enviando...'}'
                          : '${isIt ? 'Invia messaggio' : 'Enviar mensaje'}'}
                      </button>
                      {formStatus === 'sent' ? (
                        <span className="text-sm" style={{ color: 'var(--color-accent)' }}>
                          ${isIt ? 'Messaggio ricevuto correttamente.' : 'Mensaje recibido correctamente.'}
                        </span>
                      ) : null}
                      {formStatus === 'error' ? (
                        <span className="text-sm text-red-500">
                          ${isIt ? 'Invio non riuscito. Riprova.' : 'No se pudo enviar. Inténtalo de nuevo.'}
                        </span>
                      ) : null}
                    </div>
                  </form>
                </div>
              </section>
            );
          }

          return null;
        })}
      </main>

      <footer className="border-t py-10" style={{ borderColor: 'var(--color-border)' }}>
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 px-6 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          <span>
            © {new Date().getFullYear()} {content.brandName} · {content.tagline}
          </span>
          <span>{content.footerNote}</span>
        </div>
      </footer>
    </div>
  );
}
`;
}

export function getExportScriptFilename(locale: Locale): string {
  return locale === 'it' ? 'esporta-github.sh' : 'exportar-github.sh';
}

export function generateRepositoryFiles(input: CodeGenerationInput): GeneratedFile[] {
  const { locale, answers, stack, template, sections, graphicStyle, colorPattern, content, github } =
    input;
  const isIt = locale === 'it';
  const repoSlug = sanitizeRepoSlug(github.repoName || content.brandName, locale);
  const ghUser = (github.username || (isIt ? 'tuo-utente' : 'tu-usuario')).trim();
  const branch = (github.branch || 'main').trim();
  const scriptFilename = getExportScriptFilename(locale);

  const exportedContent: SiteContent = {
    ...content,
    logoDataUrl: content.logoDataUrl?.startsWith('data:')
      ? './assets/logo-marca.png'
      : content.logoDataUrl,
    heroImageUrl: `./assets/${content.heroImageName || (isIt ? 'copertina.jpg' : 'portada.jpg')}`,
    catalogItems: content.catalogItems.map((item, idx) => ({
      ...item,
      imageUrl: `./assets/catalogo-${idx + 1}.jpg`,
    })),
  };

  const dependencies: Record<string, string> = {
    react: '^19.0.1',
    'react-dom': '^19.0.1',
  };
  if (stack.includesBackend) {
    dependencies.express = '^4.21.2';
    dependencies.dotenv = '^17.2.3';
  }
  if (stack.includesDatabase) {
    dependencies.pg = '^8.13.1';
  }

  const devDependencies: Record<string, string> = {
    '@tailwindcss/vite': '^4.1.0',
    '@types/react': '^19.0.0',
    '@types/react-dom': '^19.0.0',
    '@vitejs/plugin-react': '^4.3.4',
    tailwindcss: '^4.1.0',
    typescript: '^5.8.0',
    vite: '^6.2.0',
  };
  if (stack.includesBackend) {
    devDependencies['@types/express'] = '^4.17.21';
    devDependencies['@types/node'] = '^22.14.0';
    devDependencies.tsx = '^4.19.3';
  }

  const scripts: Record<string, string> = stack.includesBackend
    ? {
        dev: 'tsx server/index.ts',
        build: 'vite build',
        start: 'NODE_ENV=production tsx server/index.ts',
      }
    : {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
      };

  const packageJson = JSON.stringify(
    {
      name: repoSlug,
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts,
      dependencies,
      devDependencies,
    },
    null,
    2
  );

  const indexHtml = `<!doctype html>
<html lang="${locale}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${content.brandName} — ${content.tagline}</title>
    <meta name="description" content="${content.heroSubheadline.replace(/"/g, '&quot;')}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=${graphicStyle.googleFontsQuery}&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: ${github.deployPlatform === 'github-pages' && !stack.includesBackend ? `'/${repoSlug}/'` : `'/'`},
  plugins: [react(), tailwindcss()],
});
`;

  const tsconfigJson = JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        useDefineForClassFields: true,
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        isolatedModules: true,
        moduleDetection: 'force',
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
      },
      include: ['src', ...(stack.includesBackend ? ['server'] : [])],
    },
    null,
    2
  );

  const indexCss = `@import "tailwindcss";

:root {
  --font-display: ${graphicStyle.fontDisplay};
  --font-body: ${graphicStyle.fontBody};
  --color-bg: ${colorPattern.background};
  --color-surface: ${colorPattern.surface};
  --color-surface-alt: ${colorPattern.surfaceAlt};
  --color-text: ${colorPattern.text};
  --color-text-muted: ${colorPattern.textMuted};
  --color-accent: ${colorPattern.accent};
  --color-accent-text: ${colorPattern.accentText};
  --color-border: ${colorPattern.border};
  --radius-card: ${graphicStyle.borderRadius};
  --radius-btn: ${graphicStyle.buttonRadius};
  --border-w: ${graphicStyle.borderWidth};
}

html {
  scroll-behavior: smooth;
  background-color: var(--color-bg);
  color: var(--color-text);
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}
`;

  const mainTsx = `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;

  const files: GeneratedFile[] = [
    {
      path: 'index.html',
      language: 'html',
      description: isIt
        ? 'Documento radice con metadati SEO e font selezionati.'
        : 'Documento raíz con metadatos SEO y tipografías seleccionadas.',
      content: indexHtml,
    },
    {
      path: 'package.json',
      language: 'json',
      description: isIt
        ? 'Dipendenze e script configurati per lo stack scelto.'
        : 'Dependencias y scripts configurados para el stack elegido.',
      content: packageJson,
    },
    {
      path: 'vite.config.ts',
      language: 'typescript',
      description: isIt
        ? 'Configurazione di build Vite con base URL adattata al deploy.'
        : 'Configuración de compilación Vite con base URL adaptada al despliegue.',
      content: viteConfig,
    },
    {
      path: 'tsconfig.json',
      language: 'json',
      description: isIt ? 'Configurazione rigorosa di TypeScript.' : 'Configuración estricta de TypeScript.',
      content: tsconfigJson,
    },
    {
      path: 'src/main.tsx',
      language: 'typescript',
      description: isIt ? 'Punto di ingresso React.' : 'Punto de entrada React.',
      content: mainTsx,
    },
    {
      path: 'src/index.css',
      language: 'css',
      description: isIt
        ? 'Token di colore, tipografia e geometria dello stile scelto.'
        : 'Tokens de color, tipografía y geometría del estilo gráfico elegido.',
      content: indexCss,
    },
    {
      path: 'src/data/siteContent.json',
      language: 'json',
      description: isIt
        ? 'Contenuti disaccoppiati modificabili senza toccare i componenti.'
        : 'Contenidos desacoplados editables sin modificar componentes.',
      content: JSON.stringify(exportedContent, null, 2),
    },
    {
      path: 'src/App.tsx',
      language: 'typescript',
      description: isIt
        ? 'Applicazione React completa con tutte le sezioni attivate.'
        : 'Aplicación React completa con todas las secciones activadas.',
      content: generateSiteAppTsx(locale, template, sections, graphicStyle, colorPattern, stack),
    },
  ];

  if (stack.includesBackend) {
    files.push({
      path: 'server/index.ts',
      language: 'typescript',
      description: isIt
        ? 'Server Express con endpoint /api/contact e servizio statico.'
        : 'Servidor Express con endpoint /api/contact y servicio de aplicación.',
      content: `import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body ?? {};
  if (!name || !email) {
    return res.status(400).json({ error: '${isIt ? 'Nome ed email sono obbligatori.' : 'Nombre y correo son obligatorios.'}' });
  }
  console.info('[${isIt ? 'Contatto ricevuto' : 'Contacto recibido'}]', { name, email, length: String(message || '').length });
  return res.status(201).json({ received: true });
});

if (process.env.NODE_ENV === 'production') {
  const distDir = path.resolve(__dirname, '../dist');
  app.use(express.static(distDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(\`${isIt ? 'Server attivo su' : 'Servidor activo en'} http://localhost:\${PORT}\`);
});
`,
    });
  }

  if (stack.includesDatabase) {
    files.push({
      path: 'db/schema.sql',
      language: 'sql',
      description: isIt
        ? 'Schema SQL iniziale per contatti, catalogo e utenti.'
        : 'Esquema SQL inicial para contactos, catálogo y usuarios.',
      content: `-- ${isIt ? 'Schema relazionale generato per' : 'Esquema relacional generado para'} ${content.brandName}
-- ${isIt ? 'Compatibile con PostgreSQL 15+' : 'Compatible con PostgreSQL 15+'}

CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS catalog_items (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(120) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(120) NOT NULL,
  price_label VARCHAR(80),
  description TEXT,
  image_path TEXT,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
${
  answers.integrations.includes('auth')
    ? `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(40) NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`
    : ''
}`,
    });
  }

  files.push(
    {
      path: '.github/workflows/deploy.yml',
      language: 'yaml',
      description: isIt
        ? 'Workflow automatico GitHub Actions per compilazione e deploy.'
        : 'Flujo automático de GitHub Actions para compilación y despliegue.',
      content: getDeployWorkflowYaml(github, stack, locale),
    },
    {
      path: '.gitignore',
      language: 'text',
      description: isIt
        ? 'Esclusioni standard per Node.js, Vite e file di ambiente.'
        : 'Exclusiones estándar para Node.js, Vite y archivos de entorno.',
      content: `node_modules
dist
.env
.env.local
.DS_Store
*.log
`,
    },
    {
      path: '.env.example',
      language: 'text',
      description: isIt
        ? 'Modello di variabili d’ambiente senza segreti.'
        : 'Plantilla de variables de entorno sin secretos.',
      content: `# ${isIt ? 'Porta del server locale' : 'Puerto del servidor local'}
PORT=3000
${
  stack.includesDatabase
    ? `# ${isIt ? 'Stringa di connessione PostgreSQL' : 'Cadena de conexión PostgreSQL'}\nDATABASE_URL="postgresql://${isIt ? 'utente:password' : 'usuario:clave'}@localhost:5432/${isIt ? 'mio_db' : 'mi_bd'}"\n`
    : ''
}`,
    },
    {
      path: scriptFilename,
      language: 'bash',
      description: isIt
        ? 'Script automatizzato per inizializzare Git e caricare il codice sul tuo repository.'
        : 'Script automatizado para inicializar Git y subir el código a tu repositorio.',
      content: `#!/usr/bin/env bash
set -e

REPO_URL="https://github.com/${ghUser}/${repoSlug}.git"
BRANCH="${branch}"

echo "${isIt ? 'Inizializzazione repository locale per' : 'Inicializando repositorio local para'} ${repoSlug}..."
git init
git add .
git commit -m "${isIt ? 'Versione iniziale generata per' : 'Versión inicial generada para'} ${content.brandName}"
git branch -M "$BRANCH"

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

echo "${isIt ? 'Caricamento codice su' : 'Subiendo código a'} $REPO_URL (${branch})..."
git push -u origin "$BRANCH"
echo "${isIt ? 'Esportazione completata correttamente.' : 'Exportación completada correctamente.'}"
`,
    },
    {
      path: 'README.md',
      language: 'markdown',
      description: isIt
        ? 'Documentazione passo dopo passo per installazione, GitHub e deploy.'
        : 'Documentación paso a paso de instalación, exportación a GitHub y despliegue.',
      content: isIt
        ? `# ${content.brandName}

${content.tagline}

## Architettura tecnica selezionata

- **Stack**: ${stack.name}
- **Frontend**: ${stack.frontend}
- **Backend**: ${stack.backend}
- **Database**: ${stack.database}
- **Modello**: ${template.name}
- **Stile grafico**: ${graphicStyle.name} · ${colorPattern.name}

## Avvio in locale

\`\`\`bash
npm install
npm run dev
\`\`\`

## Esportazione su GitHub passo dopo passo

1. Crea un repository vuoto chiamato \`${repoSlug}\` su https://github.com/new (senza README né .gitignore).
2. Esegui questi comandi dentro la cartella del progetto:

\`\`\`bash
git init
git add .
git commit -m "Versione iniziale di ${content.brandName}"
git branch -M ${branch}
git remote add origin https://github.com/${ghUser}/${repoSlug}.git
git push -u origin ${branch}
\`\`\`

In alternativa puoi avviare lo script automatizzato incluso:

\`\`\`bash
chmod +x ${scriptFilename}
./${scriptFilename}
\`\`\`

## Pubblicazione (${github.deployPlatform})

${
  github.deployPlatform === 'github-pages'
    ? `1. Apri il repository su GitHub → **Settings** → **Pages**.\n2. In **Build and deployment / Source**, seleziona **GitHub Actions**.\n3. Il workflow \`.github/workflows/deploy.yml\` pubblicherà automaticamente il sito su \`https://${ghUser}.github.io/${repoSlug}/\`.`
    : `1. Accedi al tuo account **${github.deployPlatform.toUpperCase()}** e scegli **Import Git Repository**.\n2. Seleziona \`${ghUser}/${repoSlug}\`.\n3. Comando di build: \`npm run build\` · Cartella di output: \`dist\`.`
}
`
        : `# ${content.brandName}

${content.tagline}

## Arquitectura técnica seleccionada

- **Stack**: ${stack.name}
- **Frontend**: ${stack.frontend}
- **Backend**: ${stack.backend}
- **Base de datos**: ${stack.database}
- **Plantilla**: ${template.name}
- **Estilo gráfico**: ${graphicStyle.name} · ${colorPattern.name}

## Ejecución local

\`\`\`bash
npm install
npm run dev
\`\`\`

## Exportar a GitHub paso a paso

1. Crea un repositorio vacío llamado \`${repoSlug}\` en https://github.com/new (sin README ni .gitignore).
2. Ejecuta los siguientes comandos dentro de esta carpeta:

\`\`\`bash
git init
git add .
git commit -m "Versión inicial de ${content.brandName}"
git branch -M ${branch}
git remote add origin https://github.com/${ghUser}/${repoSlug}.git
git push -u origin ${branch}
\`\`\`

También puedes ejecutar el script automatizado incluido:

\`\`\`bash
chmod +x ${scriptFilename}
./${scriptFilename}
\`\`\`

## Despliegue (${github.deployPlatform})

${
  github.deployPlatform === 'github-pages'
    ? `1. Abre tu repositorio en GitHub → **Settings** → **Pages**.\n2. En **Build and deployment / Source**, selecciona **GitHub Actions**.\n3. El flujo \`.github/workflows/deploy.yml\` publicará automáticamente tu web en \`https://${ghUser}.github.io/${repoSlug}/\`.`
    : `1. Accede a tu cuenta de **${github.deployPlatform.toUpperCase()}** y elige **Import Git Repository**.\n2. Selecciona \`${ghUser}/${repoSlug}\`.\n3. Comando de compilación: \`npm run build\` · Directorio de salida: \`dist\`.`
}
`,
    }
  );

  return files;
}

async function fetchImageAsBlob(url: string): Promise<Blob | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.blob();
  } catch {
    return null;
  }
}

export async function downloadRepositoryZip(
  files: GeneratedFile[],
  content: SiteContent,
  repoName: string,
  locale: Locale = 'es'
): Promise<void> {
  const zip = new JSZip();
  const slug = sanitizeRepoSlug(repoName || content.brandName, locale);

  for (const file of files) {
    zip.file(file.path, file.content);
  }

  const heroBlob = await fetchImageAsBlob(content.heroImageUrl);
  if (heroBlob) {
    zip.file(
      `public/assets/${content.heroImageName || (locale === 'it' ? 'copertina.jpg' : 'portada.jpg')}`,
      heroBlob
    );
  }

  if (content.logoDataUrl) {
    const logoBlob = await fetchImageAsBlob(content.logoDataUrl);
    if (logoBlob) {
      zip.file('public/assets/logo-marca.png', logoBlob);
    }
  }

  for (let i = 0; i < content.catalogItems.length; i++) {
    const item = content.catalogItems[i];
    if (item.imageUrl) {
      const itemBlob = await fetchImageAsBlob(item.imageUrl);
      if (itemBlob) {
        zip.file(`public/assets/catalogo-${i + 1}.jpg`, itemBlob);
      }
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `${slug}-github-repo.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}
