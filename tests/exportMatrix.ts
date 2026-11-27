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
import { DeployPlatform, DiscoveryAnswers, GeneratedFile, IntegrationOption, ProjectType } from '../src/types/builder';

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
  /** con la integración de analytics activada */
  analytics?: boolean;
  /** con la integración de formulario de contacto con envío real */
  contact?: boolean;
  /** FAQ en Markdown (solo stacks Astro) */
  markdown?: boolean;
  /** botones de pago de Stripe en los planes (la sección Planes está activa) */
  payments?: boolean;
  /** sitio en dos idiomas (solo stacks Astro) */
  i18n?: boolean;
  /** área /admin con inicio de sesión (solo el stack con PostgreSQL) */
  auth?: boolean;
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
    ...(c.analytics ? ['analytics'] : []),
    ...(c.contact ? ['contact'] : []),
    ...(c.markdown ? ['markdown'] : []),
    ...(c.payments ? ['payments'] : []),
    ...(c.i18n ? ['i18n'] : []),
    ...(c.auth ? ['auth'] : []),
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
  // Integrazioni: una variante per stack (prima piattaforma), alternando la lingua.
  // Sono in coda così gli id e gli snapshot delle combinazioni base restano stabili.
  (Object.keys(STACK_PROFILES) as StackId[]).forEach((stackId, k) => {
    const base = {
      locale: LOCALES[k % LOCALES.length],
      stackId,
      platform: STACK_PROFILES[stackId].platforms[0],
      templateIndex: (i + k) % nTemplates,
      projectType: PROJECT_TYPES[(i + k) % PROJECT_TYPES.length],
      styleIndex: (i + k) % nStyles,
      colorIndex: (i + k) % nColors,
      allSections: false,
      analytics: true,
    };
    combos.push({ ...base, id: makeId(base) });
  });
  // Formulario de contacto con envío real: una variante por stack y por cada plataforma de
  // los stacks con servidor (cada adapter de Astro lee los secretos a su manera).
  offeredStackPlatforms().forEach(({ stackId, platform }, k) => {
    if (!STACK_PROFILES[stackId].backend && platform !== STACK_PROFILES[stackId].platforms[0]) return;
    const base = {
      locale: LOCALES[(k + 1) % LOCALES.length],
      stackId,
      platform,
      templateIndex: (i + k + 1) % nTemplates,
      projectType: PROJECT_TYPES[(i + k + 1) % PROJECT_TYPES.length],
      styleIndex: (i + k + 1) % nStyles,
      colorIndex: (i + k + 1) % nColors,
      allSections: false,
      contact: true,
    };
    combos.push({ ...base, id: makeId(base) });
  });
  // Markdown: solo stacks Astro, en la primera plataforma de cada uno (+ Cloudflare, que compila distinto)
  offeredStackPlatforms().forEach(({ stackId, platform }, k) => {
    if (STACK_PROFILES[stackId].skeleton !== 'astro') return;
    if (platform !== STACK_PROFILES[stackId].platforms[0] && platform !== 'cloudflare') return;
    const base = {
      locale: LOCALES[k % LOCALES.length],
      stackId,
      platform,
      templateIndex: (i + k + 2) % nTemplates,
      projectType: PROJECT_TYPES[(i + k + 2) % PROJECT_TYPES.length],
      styleIndex: (i + k + 2) % nStyles,
      colorIndex: (i + k + 2) % nColors,
      allSections: true,
      markdown: true,
    };
    combos.push({ ...base, id: makeId(base) });
  });
  // Pagos con Stripe: una variante por stack (primera plataforma) y, en los híbridos, Node (smoke real).
  // La última combina TODAS las integraciones para probar que conviven (env, README, astro:env).
  offeredStackPlatforms().forEach(({ stackId, platform }, k) => {
    const first = platform === STACK_PROFILES[stackId].platforms[0];
    const hybridNode = stackId === 'astro-hybrid' && platform === 'node-server';
    if (!first && !hybridNode) return;
    const base = {
      locale: LOCALES[(k + 1) % LOCALES.length],
      stackId,
      platform,
      templateIndex: (i + k + 3) % nTemplates,
      projectType: PROJECT_TYPES[(i + k + 3) % PROJECT_TYPES.length],
      styleIndex: (i + k + 3) % nStyles,
      colorIndex: (i + k + 3) % nColors,
      allSections: true,
      payments: true,
      // integraciones combinadas en los híbridos con Node y en Express
      ...(hybridNode ? { analytics: true, contact: true, markdown: true } : {}),
      ...(stackId === 'hybrid-node-api' ? { analytics: true, contact: true } : {}),
    };
    combos.push({ ...base, id: makeId(base) });
  });
  // Dos idiomas: solo Astro, primera plataforma de cada stack (GitHub Pages prueba el `base`) y el híbrido
  // en Node con TODAS las integraciones, que además se sirve de verdad.
  offeredStackPlatforms().forEach(({ stackId, platform }, k) => {
    if (STACK_PROFILES[stackId].skeleton !== 'astro') return;
    const first = platform === STACK_PROFILES[stackId].platforms[0];
    const hybridNode = stackId === 'astro-hybrid' && platform === 'node-server';
    if (!first && !hybridNode) return;
    const base = {
      locale: LOCALES[k % LOCALES.length],
      stackId,
      platform,
      templateIndex: (i + k + 4) % nTemplates,
      projectType: PROJECT_TYPES[(i + k + 4) % PROJECT_TYPES.length],
      styleIndex: (i + k + 4) % nStyles,
      colorIndex: (i + k + 4) % nColors,
      allSections: true,
      i18n: true,
      ...(hybridNode ? { analytics: true, contact: true, payments: true } : {}),
    };
    combos.push({ ...base, id: makeId(base) });
  });
  // Área de administración: solo el stack React + Express + PostgreSQL. Una sola y otra con TODAS las integraciones.
  (['es', 'it'] as const).forEach((locale, k) => {
    const base = {
      locale,
      stackId: 'fullstack-sql-platform' as StackId,
      platform: 'node-server' as DeployPlatform,
      templateIndex: (i + k + 5) % nTemplates,
      projectType: PROJECT_TYPES[(i + k + 5) % PROJECT_TYPES.length],
      styleIndex: (i + k + 5) % nStyles,
      colorIndex: (i + k + 5) % nColors,
      allSections: true,
      auth: true,
      ...(k === 1 ? { analytics: true, contact: true, payments: true } : {}),
    };
    combos.push({ ...base, id: makeId(base) });
  });
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
  }).concat(all.filter((c) => c.analytics && ['static-vite-react', 'astro-hybrid'].includes(c.stackId)))
    .concat(all.filter((c) => c.contact && c.platform !== 'netlify' && c.platform !== 'cloudflare'))
    .concat(all.filter((c) => c.markdown && !c.payments && c.platform !== 'cloudflare'))
    .concat(all.filter((c) => c.payments && !c.i18n && ['static-vite-react', 'astro-hybrid', 'hybrid-node-api'].includes(c.stackId)))
    .concat(all.filter((c) => c.i18n))
    .concat(all.filter((c) => c.auth && !c.contact));
}

/** Risposte del passo Discovery coerenti con lo stack (come le produrrebbe l'utente). */
function answersFor(stackId: StackId, projectType: ProjectType, integrations: IntegrationOption[] = [], markdown = false): DiscoveryAnswers {
  const profile = STACK_PROFILES[stackId];
  return {
    ...DEFAULT_DISCOVERY_ANSWERS,
    projectType,
    architectureMode: profile.backend ? 'light-api' : 'frontend-only',
    databaseNeed: profile.database ? 'sql-relational' : 'none',
    integrations,
    ...(markdown ? { databaseNeed: 'markdown-cms' as const, renderingStrategy: profile.rendering } : {}),
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
    answers: answersFor(c.stackId, c.projectType, [
      ...(c.analytics ? (['analytics'] as const) : []),
      ...(c.contact ? (['contact-form'] as const) : []),
      ...(c.payments ? (['payments'] as const) : []),
      ...(c.i18n ? (['i18n'] as const) : []),
      ...(c.auth ? (['auth'] as const) : []),
    ], c.markdown),
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
