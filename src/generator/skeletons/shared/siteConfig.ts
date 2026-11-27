/**
 * Dati che il sito generato riceve oltre al contenuto: struttura, testi fissi
 * dell'interfaccia e variabili CSS dello stile. Usati sia dal generatore (che
 * li scrive in siteConfig.json e index.css) sia dall'anteprima di KADRE (che li
 * passa direttamente ai componenti): un'unica fonte, nessuna divergenza.
 */
import { Locale } from '../../../i18n/translations';
import type { ContactProvider, PaymentsConfig, SiteConfig, SiteUi } from '../../../site-template/site/types';
import {
  ColorPatternPreset,
  GraphicStylePreset,
  SectionConfig,
  TemplateDefinition,
} from '../../../types/builder';

const SITE_UI: Record<Locale, SiteUi> = {
  es: {
    nav: {
      features: 'Capacidades',
      catalog: 'Selección',
      pricing: 'Planes',
      faq: 'Preguntas',
      contact: 'Contacto',
    },
    form: {
      name: 'Tu nombre',
      email: 'Correo electrónico',
      message: 'Cuéntanos sobre tu proyecto...',
      send: 'Enviar mensaje',
      sending: 'Enviando...',
      sent: 'Mensaje recibido correctamente.',
      error: 'No se pudo enviar. Inténtalo de nuevo.',
    },
  },
  it: {
    nav: {
      features: 'Capacità',
      catalog: 'Selezione',
      pricing: 'Piani',
      faq: 'Domande',
      contact: 'Contatti',
    },
    form: {
      name: 'Il tuo nome',
      email: 'Indirizzo email',
      message: 'Raccontaci il tuo progetto...',
      send: 'Invia messaggio',
      sending: 'Invio in corso...',
      sent: 'Messaggio ricevuto correttamente.',
      error: 'Invio non riuscito. Riprova.',
    },
  },
};

/** Textos del botón de pago con servidor (solo se añaden al config si hay checkout). */
const PAYMENT_UI: Record<Locale, NonNullable<SiteUi['payment']>> = {
  es: { redirecting: 'Redirigiendo al pago...', error: 'No se pudo iniciar el pago. Inténtalo de nuevo.' },
  it: { redirecting: 'Reindirizzamento al pagamento...', error: 'Impossibile avviare il pagamento. Riprova.' },
};

/** Textos fijos de la interfaz en un idioma; el de pago solo con checkout. */
export function buildSiteUi(locale: Locale, checkout: boolean): SiteUi {
  return checkout ? { ...SITE_UI[locale], payment: PAYMENT_UI[locale] } : SITE_UI[locale];
}

export function buildSiteConfig(params: {
  locale: Locale;
  template: TemplateDefinition;
  sections: SectionConfig[];
  hasBackendApi: boolean;
  contactProvider?: ContactProvider;
  payments?: PaymentsConfig;
}): SiteConfig {
  return {
    sectionOrder: params.sections.filter((s) => s.enabled).map((s) => s.type),
    heroLayout: params.template.heroLayout,
    hasBackendApi: params.hasBackendApi,
    ...(params.contactProvider ? { contactProvider: params.contactProvider } : {}),
    ...(params.payments ? { payments: params.payments } : {}),
    ui: buildSiteUi(params.locale, params.payments?.type === 'checkout'),
  };
}

/** Spaziatura verticale delle sezioni secondo la densità dello stile grafico. */
const SECTION_SPACING: Record<GraphicStylePreset['spacingDensity'], string> = {
  compact: '3.5rem',
  balanced: '5rem',
  airy: '6.5rem',
};

/** Variabili CSS del sito (scritte in :root nell'export, inline nell'anteprima). */
export function siteCssVars(
  graphicStyle: GraphicStylePreset,
  colorPattern: ColorPatternPreset
): Record<string, string> {
  return {
    '--font-display': graphicStyle.fontDisplay,
    '--font-body': graphicStyle.fontBody,
    '--color-bg': colorPattern.background,
    '--color-surface': colorPattern.surface,
    '--color-surface-alt': colorPattern.surfaceAlt,
    '--color-text': colorPattern.text,
    '--color-text-muted': colorPattern.textMuted,
    '--color-accent': colorPattern.accent,
    '--color-accent-text': colorPattern.accentText,
    '--color-border': colorPattern.border,
    '--radius-card': graphicStyle.borderRadius,
    '--radius-btn': graphicStyle.buttonRadius,
    '--border-w': graphicStyle.borderWidth,
    '--heading-tracking': graphicStyle.headingTracking,
    '--space-section': SECTION_SPACING[graphicStyle.spacingDensity],
  };
}
