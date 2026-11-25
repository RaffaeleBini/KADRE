/**
 * Matrice delle combinazioni di esportazione, condivisa da:
 *  - tests/exports.snapshot.test.ts  (snapshot dei file generati)
 *  - scripts/verify-exports.ts       (install + typecheck + build di ogni sito)
 *
 * Dimensioni STRUTTURALI (cambiano file e dipendenze): stack × piattaforma × lingua.
 * Dimensioni di CONTENUTO (cambiano solo valori/blocchi attivi): template, tipo di
 * progetto, stile, palette, auth, sezioni. Nella modalità di default queste ruotano
 * sulle combinazioni strutturali, così ogni valore è provato almeno una volta.
 */
import {
  buildSectionsForTemplate,
  DEFAULT_DISCOVERY_ANSWERS,
  getAllStacks,
  getColorPatterns,
  getGraphicStyles,
  getStarterContentForProject,
  getTemplates,
} from '../src/data/presets';
import { Locale } from '../src/i18n/translations';
import { DeployPlatform, GeneratedFile, ProjectType } from '../src/types/builder';
import { CodeGenerationInput, generateRepositoryFiles } from '../src/utils/codeGenerator';

export const LOCALES: Locale[] = ['es', 'it'];
export const PLATFORMS: DeployPlatform[] = ['github-pages', 'vercel', 'netlify', 'cloudflare'];
export const PROJECT_TYPES: ProjectType[] = [
  'landing',
  'saas',
  'ecommerce',
  'portfolio',
  'editorial',
  'corporate',
];

export interface ExportCombo {
  /** Identificatore leggibile e stabile, usato come nome di cartella/snapshot. */
  id: string;
  locale: Locale;
  stackId: string;
  platform: DeployPlatform;
  templateIndex: number;
  projectType: ProjectType;
  styleIndex: number;
  colorIndex: number;
  auth: boolean;
  allSections: boolean;
}

function stackIds(): string[] {
  return getAllStacks('es').map((s) => s.id);
}

function makeId(c: Omit<ExportCombo, 'id'>): string {
  return [
    c.locale,
    c.stackId,
    c.platform,
    `tpl${c.templateIndex}`,
    c.projectType,
    `sty${c.styleIndex}`,
    `col${c.colorIndex}`,
    c.auth ? 'auth' : 'noauth',
    c.allSections ? 'allsec' : 'defsec',
  ].join('__');
}

/** 32 combinazioni strutturali con le dimensioni di contenuto a rotazione. */
export function structuralCombos(): ExportCombo[] {
  const combos: ExportCombo[] = [];
  const nStyles = getGraphicStyles('es').length;
  const nColors = getColorPatterns('es').length;
  const nTemplates = getTemplates('es').length;
  let i = 0;
  for (const stackId of stackIds()) {
    for (const platform of PLATFORMS) {
      for (const locale of LOCALES) {
        const base = {
          locale,
          stackId,
          platform,
          templateIndex: i % nTemplates,
          projectType: PROJECT_TYPES[i % PROJECT_TYPES.length],
          styleIndex: i % nStyles,
          colorIndex: i % nColors,
          auth: i % 2 === 1,
          allSections: i % 3 === 0,
        };
        combos.push({ ...base, id: makeId(base) });
        i++;
      }
    }
  }
  return combos;
}

/** Prodotto cartesiano completo sulle dimensioni che toccano il codice (lento: solo in locale). */
export function fullCombos(): ExportCombo[] {
  const combos: ExportCombo[] = [];
  const nTemplates = getTemplates('es').length;
  for (const stackId of stackIds()) {
    for (const platform of PLATFORMS) {
      for (const locale of LOCALES) {
        for (let t = 0; t < nTemplates; t++) {
          for (const auth of [false, true]) {
            const base = {
              locale,
              stackId,
              platform,
              templateIndex: t,
              projectType: PROJECT_TYPES[t % PROJECT_TYPES.length],
              styleIndex: t % getGraphicStyles('es').length,
              colorIndex: t % getColorPatterns('es').length,
              auth,
              allSections: t % 2 === 0,
            };
            combos.push({ ...base, id: makeId(base) });
          }
        }
      }
    }
  }
  return combos;
}

/** Sottoinsieme piccolo e rappresentativo per gli snapshot (ogni stack, ogni piattaforma, entrambe le lingue). */
export function snapshotCombos(): ExportCombo[] {
  // 4 stack × 2 piattaforme (pages in ES, vercel in IT) → 8 combinazioni
  return structuralCombos().filter(
    (c) =>
      (c.platform === 'github-pages' && c.locale === 'es') ||
      (c.platform === 'vercel' && c.locale === 'it')
  );
}

export function buildInput(c: ExportCombo): CodeGenerationInput {
  const stack = getAllStacks(c.locale).find((s) => s.id === c.stackId);
  if (!stack) throw new Error(`Stack sconosciuto: ${c.stackId}`);
  const template = getTemplates(c.locale)[c.templateIndex];
  const sections = buildSectionsForTemplate(template, c.locale).map((s) =>
    c.allSections ? { ...s, enabled: true } : s
  );
  const integrations = DEFAULT_DISCOVERY_ANSWERS.integrations.filter((x) => x !== 'auth');
  return {
    locale: c.locale,
    answers: {
      ...DEFAULT_DISCOVERY_ANSWERS,
      projectType: c.projectType,
      integrations: c.auth ? [...integrations, 'auth'] : integrations,
    },
    stack,
    template,
    sections,
    graphicStyle: getGraphicStyles(c.locale)[c.styleIndex],
    colorPattern: getColorPatterns(c.locale)[c.colorIndex],
    content: getStarterContentForProject(c.projectType, c.locale),
    github: {
      username: 'kadre-test',
      repoName: '',
      visibility: 'public',
      branch: 'main',
      deployPlatform: c.platform,
    },
  };
}

export function generate(c: ExportCombo): GeneratedFile[] {
  return generateRepositoryFiles(buildInput(c));
}
