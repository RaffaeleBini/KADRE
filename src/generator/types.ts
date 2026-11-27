import { Locale } from '../i18n/translations';
import type { SkeletonId } from './matrix';
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

/** Tutto ciò che l'utente ha scelto nel configuratore. */
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

/** Input + valori derivati, calcolati una sola volta e condivisi da tutti i pezzi. */
export interface GenContext extends CodeGenerationInput {
  isIt: boolean;
  repoSlug: string;
  ghUser: string;
  branch: string;
  scriptFilename: string;
  /** contenuto con i percorsi delle immagini riscritti verso public/assets/ */
  exportedContent: SiteContent;
  hasBackend: boolean;
  hasDatabase: boolean;
  /** scheletro scelto dalla matrice in base allo stack */
  skeleton: SkeletonId;
  /** FAQ en archivos Markdown (content collections de Astro) en lugar de siteContent.json */
  markdown: boolean;
  /** botones de pago de Stripe en la sección de planes (necesita la sección activa) */
  payments: boolean;
  /** sitio en dos idiomas (solo Astro): páginas / y /<altLocale>/ con selector de idioma */
  i18n: boolean;
  /** el otro idioma: si el sitio está en español, italiano, y viceversa */
  altLocale: Locale;
  /** área /admin con inicio de sesión para leer los mensajes (solo React + Express + PostgreSQL) */
  auth: boolean;
}

/**
 * Uno "scheletro" è la base del progetto generato (framework + struttura).
 * Oggi: vite-react (SPA) e astro (statico SSG), scelti dalla matrice.
 */
export interface Skeleton {
  id: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
  /** cartelle incluse nel tsconfig generato */
  tsInclude: string[];
  files(ctx: GenContext, assembled: AssembledProject): GeneratedFile[];
}

/** Valori che dipendono dall'insieme di scheletro + innesti attivi. */
export interface AssembledProject {
  packageJson: string;
  tsInclude: string[];
  /** adapter Astro dichiarato da un innesto (solo siti Astro con server) */
  astroAdapter?: AstroAdapter;
  /** moduli di src/ da importare nell'entry point del browser (es. './analytics') */
  clientImports: string[];
  /** variabili d'ambiente segrete dichiarate nello schema astro:env */
  astroEnv: string[];
}

/** Come registrare un adapter in astro.config.mjs. */
export interface AstroAdapter {
  importLine: string;
  call: string;
}

/**
 * Un "innesto" aggiunge una capacità al progetto (backend, database, …).
 * Dichiara cosa porta con sé; compose.ts lo integra.
 */
export interface GeneratorModule {
  id: string;
  enabled(ctx: GenContext): boolean;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  /** se presente, sostituisce gli script dello scheletro */
  scripts?: Record<string, string>;
  tsInclude?: string[];
  /** adapter Astro portato da questo innesto */
  astroAdapter?: AstroAdapter;
  /** voci aggiunte a .gitignore (es. cartelle generate dall'adapter) */
  gitignore?: string[];
  /** righe aggiunte in coda a .env.example */
  envExample?(ctx: GenContext): string;
  /** moduli di src/ eseguiti nel browser all'avvio, importati dall'entry point dello scheletro */
  clientImports?: string[];
  /** variabili del server che Astro legge a runtime con astro:env (segreti opzionali) */
  astroEnv?: string[];
  /** sezione Markdown aggiunta in coda al README */
  readme?(ctx: GenContext): string;
  files?(ctx: GenContext): GeneratedFile[];
}
