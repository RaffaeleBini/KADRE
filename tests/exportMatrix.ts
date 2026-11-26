/**
 * Combinazioni di esportazione da verificare, condivise da:
 *  - tests/exports.snapshot.test.ts  (snapshot dei file generati + invarianti)
 *  - tests/exports.verify.ts         (install + typecheck + build di ogni sito)
 *
 * Le combinazioni STRUTTURALI derivano dalla matrice di compatibilità
 * (src/generator/matrix.ts): ogni stack × ogni piattaforma che quello stack
 * supporta × lingua. Si verifica quindi esattamente ciò che il configuratore offre.
 * Le dimensioni di CONTENUTO (template, tipo di progetto, stile, palette, sezioni)
 * ruotano sulle combinazioni strutturali, così ogni valore è provato almeno una volta.
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
import { CodeGenerationInput, generateRepositoryFiles } from '../src/generator';
import { STACK_PROFILES, StackId } from '../src/generator/matrix';
import { Locale } from '../src/i18n/translations';
import { DeployPlatform, DiscoveryAnswers, GeneratedFile, ProjectType } from '../src/types/builder';

export const LOCALES: Locale[] = ['es', 'it'];
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
  stackId: StackId;
  platform: DeployPlatform;
  templateIndex: number;
  projectType: ProjectType;
  styleIndex: number;
  colorIndex: number;
  allSections: boolean;
}

/** Coppie (stack, piattaforma) che il configuratore offre. */
export function offeredStackPlatforms(): { stackId: StackId; platform: DeployPlatform }[] {
  return (Object.keys(STACK_PROFILES) as StackId[]).flatMap((stackId) =>
    STACK_PROFILES[stackId].platforms.map((platform) => ({ stackId, platform }))
  );
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
    c.allSections ? 'allsec' : 'defsec',
  ].join('__');
}

/** Combinazioni strutturali offerte, con le dimensioni di contenuto a rotazione. */
export function structuralCombos(): ExportCombo[] {
  const nStyles = getGraphicStyles('es').length;
  const nColors = getColorPatterns('es').length;
  const nTemplates = getTemplates('es').length;
  const combos: ExportCombo[] = [];
  let i = 0;
  for (const { stackId, platform } of offeredStackPlatforms()) {
    for (const locale of LOCALES) {
      const base = {
        locale,
        stackId,
        platform,
        templateIndex: i % nTemplates,
        projectType: PROJECT_TYPES[i % PROJECT_TYPES.length],
        styleIndex: i % nStyles,
        colorIndex: i % nColors,
        allSections: i % 3 === 0,
      };
      combos.push({ ...base, id: makeId(base) });
      i++;
    }
  }
  return combos;
}

/** Combinazioni offerte × tutti i template (lento: solo in locale, VERIFY_FULL=1). */
export function fullCombos(): ExportCombo[] {
  const nTemplates = getTemplates('es').length;
  const combos: ExportCombo[] = [];
  for (const { stackId, platform } of offeredStackPlatforms()) {
    for (const locale of LOCALES) {
      for (let t = 0; t < nTemplates; t++) {
        const base = {
          locale,
          stackId,
          platform,
          templateIndex: t,
          projectType: PROJECT_TYPES[t % PROJECT_TYPES.length],
          styleIndex: t % getGraphicStyles('es').length,
          colorIndex: t % getColorPatterns('es').length,
          allSections: t % 2 === 0,
        };
        combos.push({ ...base, id: makeId(base) });
      }
    }
  }
  return combos;
}

/** Sottoinsieme per gli snapshot: per ogni stack la prima piattaforma in ES e l'ultima in IT. */
export function snapshotCombos(): ExportCombo[] {
  const all = structuralCombos();
  return (Object.keys(STACK_PROFILES) as StackId[]).flatMap((stackId) => {
    const platforms = STACK_PROFILES[stackId].platforms;
    const pick = (platform: DeployPlatform, locale: Locale) =>
      all.find((c) => c.stackId === stackId && c.platform === platform && c.locale === locale)!;
    return [pick(platforms[0], 'es'), pick(platforms[platforms.length - 1], 'it')];
  });
}

/** Risposte del passo Discovery coerenti con lo stack (come le produrrebbe l'utente). */
function answersFor(stackId: StackId, projectType: ProjectType): DiscoveryAnswers {
  const profile = STACK_PROFILES[stackId];
  return {
    ...DEFAULT_DISCOVERY_ANSWERS,
    projectType,
    architectureMode: profile.backend ? 'light-api' : 'frontend-only',
    databaseNeed: profile.database ? 'sql-relational' : 'none',
  };
}

export function buildInput(c: ExportCombo): CodeGenerationInput {
  const stack = getAllStacks(c.locale).find((s) => s.id === c.stackId);
  if (!stack) throw new Error(`Stack sconosciuto: ${c.stackId}`);
  const template = getTemplates(c.locale)[c.templateIndex];
  const sections = buildSectionsForTemplate(template, c.locale).map((s) =>
    c.allSections ? { ...s, enabled: true } : s
  );
  return {
    locale: c.locale,
    answers: answersFor(c.stackId, c.projectType),
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
