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
  files?(ctx: GenContext): GeneratedFile[];
}
