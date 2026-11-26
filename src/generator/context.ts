import { Locale } from '../i18n/translations';
import { SiteContent } from '../types/builder';
import { CodeGenerationInput, GenContext } from './types';

/** Testo → slug per URL e nomi di repo: "Café Técnico" → "cafe-tecnico" (accenti tolti, non persi). */
export function slugify(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function sanitizeRepoSlug(raw: string, locale: Locale): string {
  return slugify(raw) || (locale === 'it' ? 'mio-sito-web' : 'mi-web-automatizada');
}

export function getExportScriptFilename(locale: Locale): string {
  return locale === 'it' ? 'esporta-github.sh' : 'exportar-github.sh';
}

/** Riscrive i percorsi delle immagini verso i file che lo ZIP mette in public/assets/. */
function toExportedContent(content: SiteContent, isIt: boolean): SiteContent {
  return {
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
}

export function buildContext(input: CodeGenerationInput): GenContext {
  const { locale, content, github, stack } = input;
  const isIt = locale === 'it';
  return {
    ...input,
    isIt,
    repoSlug: sanitizeRepoSlug(github.repoName || content.brandName, locale),
    ghUser: (github.username || (isIt ? 'tuo-utente' : 'tu-usuario')).trim(),
    branch: (github.branch || 'main').trim(),
    scriptFilename: getExportScriptFilename(locale),
    exportedContent: toExportedContent(content, isIt),
    hasBackend: stack.includesBackend,
    hasDatabase: stack.includesDatabase,
  };
}
