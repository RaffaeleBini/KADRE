/**
 * File comuni a tutti gli scheletri: componenti del sito, dati JSON e CSS.
 * Vite-React e Astro differiscono solo nel "guscio" (entry point, config, build).
 */
import { GeneratedFile } from '../../../types/builder';
import type { PaymentsConfig } from '../../../site-template/site/types';
import { GenContext } from '../../types';
import { buildSiteConfig, siteCssVars } from './siteConfig';

/** Metadati della pagina, uguali in index.html (Vite) e index.astro (Astro). */
export function pageHead(ctx: GenContext) {
  const { content, graphicStyle } = ctx;
  return {
    title: `${content.brandName} — ${content.tagline}`,
    description: content.heroSubheadline.replace(/"/g, '&quot;'),
    fontsHref: `https://fonts.googleapis.com/css2?family=${graphicStyle.googleFontsQuery}&display=swap`,
  };
}

export function indexCssFile(ctx: GenContext): GeneratedFile {
  const { isIt, graphicStyle, colorPattern } = ctx;
  const cssVars = Object.entries(siteCssVars(graphicStyle, colorPattern))
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');
  return {
    path: 'src/index.css',
    language: 'css',
    description: isIt
      ? 'Token di colore, tipografia e geometria dello stile scelto.'
      : 'Tokens de color, tipografía y geometría del estilo gráfico elegido.',
    content: `@import "tailwindcss";

:root {
${cssVars}
}

html {
  scroll-behavior: smooth;
  background-color: var(--color-bg);
  color: var(--color-text);
}
`,
  };
}

/** Pagos de Stripe: enlaces vacíos (estático) o price IDs vacíos (servidor), por plan. */
function paymentsConfig(ctx: GenContext): PaymentsConfig | undefined {
  if (!ctx.payments) return undefined;
  const plans = ctx.exportedContent.pricingPlans;
  return ctx.hasBackend
    ? {
        type: 'checkout',
        prices: Object.fromEntries(plans.map((p) => [p.id, { priceId: '', mode: 'payment' as const }])),
      }
    : { type: 'links', links: Object.fromEntries(plans.map((p) => [p.id, ''])) };
}

export function siteDataFiles(ctx: GenContext): GeneratedFile[] {
  const { isIt, locale, template, sections, exportedContent } = ctx;
  const siteConfig = buildSiteConfig({
    locale,
    template,
    sections,
    hasBackendApi: ctx.hasBackend,
    // sin servidor propio, el envío real pasa por un servicio externo
    contactProvider:
      !ctx.hasBackend && ctx.answers.integrations.includes('contact-form')
        ? { type: 'web3forms', accessKey: '' }
        : undefined,
    payments: paymentsConfig(ctx),
  });
  return [
    {
      path: 'src/data/siteContent.json',
      language: 'json',
      description: isIt
        ? 'Contenuti disaccoppiati modificabili senza toccare i componenti.'
        : 'Contenidos desacoplados editables sin modificar componentes.',
      // con Markdown las FAQ viven en src/content/faqs/, no aquí
      content: JSON.stringify(ctx.markdown ? { ...exportedContent, faqs: [] } : exportedContent, null, 2),
    },
    {
      path: 'src/data/siteConfig.json',
      language: 'json',
      description: isIt
        ? 'Struttura del sito: ordine delle sezioni, layout e testi dell’interfaccia.'
        : 'Estructura del sitio: orden de secciones, diseño y textos de la interfaz.',
      content: JSON.stringify(siteConfig, null, 2),
    },
  ];
}

/**
 * Componenti del sito: file .tsx veri in src/site-template/site/,
 * copiati tali e quali. Sono gli stessi che l'anteprima di KADRE renderizza.
 */
const SITE_SOURCES = import.meta.glob('../../../site-template/site/**/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export function siteComponentFiles(ctx: GenContext): GeneratedFile[] {
  return Object.keys(SITE_SOURCES)
    .sort()
    .map((key) => {
      const relative = key.split('/site-template/')[1];
      return {
        path: `src/${relative}`,
        language: 'typescript' as const,
        description: ctx.isIt
          ? 'Componente del sito, identico a quello mostrato nell’anteprima di KADRE.'
          : 'Componente del sitio, idéntico al que muestra la vista previa de KADRE.',
        content: SITE_SOURCES[key],
      };
    });
}
