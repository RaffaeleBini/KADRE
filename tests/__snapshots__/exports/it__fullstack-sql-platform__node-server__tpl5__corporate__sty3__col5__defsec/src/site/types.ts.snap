// Tipi del sito generato. Questo file viene copiato tale e quale nel progetto esportato.

export type SectionType =
  | 'hero'
  | 'metrics'
  | 'features'
  | 'catalog'
  | 'pricing'
  | 'testimonials'
  | 'faq'
  | 'contact';

export type HeroLayout = 'split' | 'centered' | 'editorial';

export interface SiteContent {
  brandName: string;
  tagline: string;
  logoDataUrl: string | null;
  heroEyebrow: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroImageUrl: string;
  metrics: { id: string; value: string; label: string; context: string }[];
  featuresHeading: string;
  featuresSubheading: string;
  features: { id: string; title: string; description: string; metric: string }[];
  catalogHeading: string;
  catalogSubheading: string;
  catalogItems: {
    id: string;
    title: string;
    category: string;
    priceOrTag: string;
    description: string;
    imageUrl: string;
  }[];
  pricingHeading: string;
  pricingSubheading: string;
  pricingPlans: {
    id: string;
    name: string;
    audience: string;
    price: string;
    cadence: string;
    featured: boolean;
    features: string[];
    ctaLabel: string;
  }[];
  testimonialsHeading: string;
  testimonials: { id: string; quote: string; author: string; role: string; organization: string }[];
  faqHeading: string;
  /** answerHtml: respuesta ya convertida desde Markdown (la genera Astro en la compilación) */
  faqs: { id: string; question: string; answer: string; answerHtml?: string }[];
  contactHeading: string;
  contactSubheading: string;
  contactEmail: string;
  contactLocation: string;
  footerNote: string;
}

/** Testi fissi dell'interfaccia del sito (non modificabili dal contenuto). */
export interface SiteUi {
  nav: { features: string; catalog: string; pricing: string; faq: string; contact: string };
  form: {
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    sent: string;
    error: string;
  };
  /** solo con pagos de tipo checkout */
  payment?: { redirecting: string; error: string };
}

/** Servizio esterno che riceve il modulo nei siti statici. La chiave è pubblica per costruzione. */
export interface ContactProvider {
  type: 'web3forms';
  /** access key di Web3Forms; vuota finché il proprietario non la incolla */
  accessKey: string;
}

/**
 * Pagos con Stripe. Todo es público por diseño (enlaces y price IDs no son secretos):
 *  - links: sitio estático, un Payment Link de Stripe por plan (vacío = el botón lleva a Contacto);
 *  - checkout: sitio con servidor, /api/checkout crea una sesión de Stripe Checkout con el price ID.
 */
export type PaymentsConfig =
  | { type: 'links'; links: Record<string, string> }
  | { type: 'checkout'; prices: Record<string, { priceId: string; mode: 'payment' | 'subscription' }> };

/** Una versión del sitio en otro idioma (solo sitios en dos idiomas): enlace del selector de la cabecera. */
export interface SiteLanguage {
  /** código corto que se muestra, p. ej. "ES" */
  label: string;
  /** código BCP 47 para el atributo lang del enlace, p. ej. "es" */
  code: string;
  href: string;
  current: boolean;
}

/** Struttura del sito: quali sezioni, in che ordine, con quale layout. */
export interface SiteConfig {
  sectionOrder: SectionType[];
  heroLayout: HeroLayout;
  /** true se esiste /api/contact (stack con backend); altrimenti il form è solo dimostrativo */
  hasBackendApi: boolean;
  /** envío real en sitios estáticos (sin /api/contact): servicio externo con su clave pública */
  contactProvider?: ContactProvider;
  /** botones de pago de Stripe en la sección de planes */
  payments?: PaymentsConfig;
  /** selector de idioma en la cabecera; ausente en sitios de un solo idioma */
  languages?: SiteLanguage[];
  ui: SiteUi;
}
