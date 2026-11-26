/**
 * Matrice di compatibilità: UNICA fonte di verità su ciò che il generatore sa
 * produrre davvero. Il configuratore la usa per abilitare/disabilitare opzioni
 * (con una spiegazione), i test per sapere quali combinazioni verificare.
 *
 * Regola: un'opzione è "available" solo se esiste codice che la genera ed è
 * coperta da `npm run verify:exports`. Quando una fase del piano aggiunge una
 * capacità, si aggiorna QUI (e i test ne verificano subito le combinazioni).
 */
import { Locale } from '../i18n/translations';
import {
  ArchitectureMode,
  DatabaseNeed,
  DeployPlatform,
  DiscoveryAnswers,
  IntegrationOption,
  RenderingStrategy,
} from '../types/builder';

type Msg = Record<Locale, string>;

export type Availability =
  | { status: 'available' }
  /** previsto in una fase successiva del piano: mostrato ma non selezionabile */
  | { status: 'planned'; reason: Msg }
  /** esiste, ma non con le altre scelte attuali */
  | { status: 'incompatible'; reason: Msg };

const AVAILABLE: Availability = { status: 'available' };

export function reasonText(a: Availability, locale: Locale): string | null {
  return a.status === 'available' ? null : a.reason[locale];
}

// ── Stack realmente generati ────────────────────────────────────────────────

export type StackId =
  | 'static-vite-react'
  | 'hybrid-node-api'
  | 'fullstack-sql-platform'
  | 'astro-static'
  | 'astro-hybrid';

export type SkeletonId = 'vite-react' | 'astro';

interface StackProfile {
  skeleton: SkeletonId;
  rendering: RenderingStrategy;
  backend: boolean;
  database: boolean;
  platforms: DeployPlatform[];
}

const STATIC_HOSTS: DeployPlatform[] = ['github-pages', 'vercel', 'netlify', 'cloudflare'];

// L'ordine conta per i test: le combinazioni verificate seguono quest'ordine
// (aggiungere i nuovi stack in fondo lascia stabili gli snapshot esistenti).
export const STACK_PROFILES: Record<StackId, StackProfile> = {
  'static-vite-react': { skeleton: 'vite-react', rendering: 'spa-dynamic', backend: false, database: false, platforms: STATIC_HOSTS },
  'hybrid-node-api': { skeleton: 'vite-react', rendering: 'spa-dynamic', backend: true, database: false, platforms: ['node-server'] },
  'fullstack-sql-platform': { skeleton: 'vite-react', rendering: 'spa-dynamic', backend: true, database: true, platforms: ['node-server'] },
  'astro-static': { skeleton: 'astro', rendering: 'static-ssg', backend: false, database: false, platforms: STATIC_HOSTS },
  // pagina prerenderizzata + endpoint server; l'adapter dipende dalla piattaforma
  'astro-hybrid': {
    skeleton: 'astro',
    rendering: 'hybrid-ssr',
    backend: true,
    database: false,
    platforms: ['vercel', 'netlify', 'cloudflare', 'node-server'],
  },
};

export function skeletonFor(stackId: string): SkeletonId {
  return STACK_PROFILES[stackId as StackId]?.skeleton ?? 'vite-react';
}

export const ALL_PLATFORMS: DeployPlatform[] = [
  'github-pages',
  'vercel',
  'netlify',
  'cloudflare',
  'node-server',
];

/** Stack previsti (Fase 5), mostrati come "in arrivo" nell'elenco delle alternative. */
export const PLANNED_STACKS: { id: string; name: Msg; reason: Msg }[] = [];

// ── Opzioni del passo Discovery ─────────────────────────────────────────────

const SSG_NEEDS_STATIC: Availability = {
  status: 'incompatible',
  reason: {
    es: 'Con servidor elige «Híbrida»: la página se genera igualmente como HTML al compilar.',
    it: 'Con server scegli «Ibrida»: la pagina viene comunque generata come HTML in build.',
  },
};

const HYBRID_NEEDS_SERVER: Availability = {
  status: 'incompatible',
  reason: {
    es: 'Necesita servidor: elige «Frontend + API ligera».',
    it: 'Richiede un server: scegli «Frontend + API server leggera».',
  },
};

const HYBRID_NO_SQL: Availability = {
  status: 'incompatible',
  reason: {
    es: 'Con base de datos SQL, hoy KADRE genera una SPA con servidor Express.',
    it: 'Con database SQL, oggi KADRE genera una SPA con server Express.',
  },
};

const MARKDOWN_NEEDS_ASTRO: Availability = {
  status: 'incompatible',
  reason: {
    es: 'Los contenidos en Markdown usan Astro: elige antes «Estático SSG» o «Híbrida» en el renderizado.',
    it: 'I contenuti in Markdown usano Astro: scegli prima «Statico SSG» o «Ibrida» nel rendering.',
  },
};

const SPA_NO_MARKDOWN: Availability = {
  status: 'incompatible',
  reason: {
    es: 'Con contenidos en Markdown el sitio se genera con Astro, no como SPA.',
    it: 'Con contenuti in Markdown il sito viene generato con Astro, non come SPA.',
  },
};

const RENDERING: Record<RenderingStrategy, Availability> = {
  'spa-dynamic': AVAILABLE,
  'static-ssg': AVAILABLE,
  'hybrid-ssr': AVAILABLE,
};

const DATABASE: Record<DatabaseNeed, Availability> = {
  none: AVAILABLE,
  'sql-relational': AVAILABLE,
  'markdown-cms': AVAILABLE,
};

const SQL_NEEDS_SERVER: Availability = {
  status: 'incompatible',
  reason: {
    es: 'Una base de datos SQL necesita servidor: elige «Frontend + API ligera».',
    it: 'Un database SQL richiede un server: scegli «Frontend + API server leggera».',
  },
};

const ARCHITECTURE: Record<ArchitectureMode, Availability> = {
  'frontend-only': AVAILABLE,
  'light-api': AVAILABLE,
  'full-backend': {
    status: 'planned',
    reason: {
      es: 'Llegará con el módulo de autenticación. Hoy generaría lo mismo que «API ligera».',
      it: 'Arriverà con il modulo di autenticazione. Oggi genererebbe lo stesso di «API leggera».',
    },
  },
};

const INTEGRATION_SOON: Msg = {
  es: 'Todavía no genera código.',
  it: 'Non genera ancora codice.',
};

const INTEGRATIONS: Record<IntegrationOption, Availability> = {
  'contact-form': AVAILABLE,
  payments: AVAILABLE,
  analytics: AVAILABLE,
  i18n: { status: 'planned', reason: INTEGRATION_SOON },
  auth: { status: 'planned', reason: INTEGRATION_SOON },
};

/** Disponibilità di ogni opzione del passo Discovery, date le altre risposte. */
export const discoveryAvailability = {
  architectureMode: (v: ArchitectureMode, _answers?: DiscoveryAnswers) => ARCHITECTURE[v],
  databaseNeed: (v: DatabaseNeed, answers?: DiscoveryAnswers) => {
    if (DATABASE[v].status !== 'available') return DATABASE[v];
    if (v === 'sql-relational' && answers?.architectureMode === 'frontend-only') return SQL_NEEDS_SERVER;
    if (v === 'markdown-cms' && answers?.renderingStrategy === 'spa-dynamic') return MARKDOWN_NEEDS_ASTRO;
    return AVAILABLE;
  },
  renderingStrategy: (v: RenderingStrategy, answers?: DiscoveryAnswers) => {
    if (RENDERING[v].status !== 'available') return RENDERING[v];
    if (!answers) return AVAILABLE;
    const server = answers.architectureMode !== 'frontend-only';
    if (v === 'spa-dynamic' && answers.databaseNeed === 'markdown-cms') return SPA_NO_MARKDOWN;
    if (v === 'static-ssg' && server) return SSG_NEEDS_STATIC;
    if (v === 'hybrid-ssr' && !server) return HYBRID_NEEDS_SERVER;
    if (v === 'hybrid-ssr' && answers.databaseNeed === 'sql-relational') return HYBRID_NO_SQL;
    return AVAILABLE;
  },
  integration: (v: IntegrationOption, _answers?: DiscoveryAnswers) => INTEGRATIONS[v],
};

// ── Piattaforme di deploy ───────────────────────────────────────────────────

export function platformAvailability(stackId: string, platform: DeployPlatform): Availability {
  const profile = STACK_PROFILES[stackId as StackId];
  if (!profile || profile.platforms.includes(platform)) return AVAILABLE;
  if (profile.backend && profile.skeleton === 'astro') {
    return {
      status: 'incompatible',
      reason: {
        es: 'GitHub Pages solo sirve archivos estáticos: el endpoint /api/contact necesita servidor.',
        it: 'GitHub Pages serve solo file statici: l’endpoint /api/contact richiede un server.',
      },
    };
  }
  if (profile.backend) {
    return {
      status: 'incompatible',
      reason: {
        es: 'Este stack incluye un servidor Express: necesita un host Node siempre activo.',
        it: 'Questo stack include un server Express: serve un host Node sempre attivo.',
      },
    };
  }
  return {
    status: 'incompatible',
    reason: {
      es: 'Solo para proyectos con servidor: este sitio es estático.',
      it: 'Solo per progetti con server: questo sito è statico.',
    },
  };
}

export function defaultPlatform(stackId: string): DeployPlatform {
  return STACK_PROFILES[stackId as StackId]?.platforms[0] ?? 'github-pages';
}

// ── Raccomandazione e normalizzazione ───────────────────────────────────────

/** Stack che il generatore produce per queste risposte (solo opzioni disponibili). */
export function recommendStackId(answers: DiscoveryAnswers): StackId {
  const a = normalizeAnswers(answers);
  if (a.databaseNeed === 'sql-relational') return 'fullstack-sql-platform';
  if (a.architectureMode !== 'frontend-only') {
    return a.renderingStrategy === 'hybrid-ssr' ? 'astro-hybrid' : 'hybrid-node-api';
  }
  if (a.renderingStrategy === 'static-ssg') return 'astro-static';
  return 'static-vite-react';
}

/**
 * Riporta le risposte entro ciò che è disponibile. Serve per le bozze salvate
 * prima della Fase 4, che possono contenere opzioni oggi "in arrivo".
 */
export function normalizeAnswers(answers: DiscoveryAnswers): DiscoveryAnswers {
  const ok = (a: Availability | undefined) => a?.status === 'available';
  const architectureMode: ArchitectureMode = ok(ARCHITECTURE[answers.architectureMode])
    ? answers.architectureMode
    : 'light-api';
  const withArch = { ...answers, architectureMode };
  const databaseNeed: DatabaseNeed =
    answers.databaseNeed in DATABASE && ok(discoveryAvailability.databaseNeed(answers.databaseNeed, withArch))
      ? answers.databaseNeed
      : 'none';
  const withDb = { ...withArch, databaseNeed };
  const renderingStrategy: RenderingStrategy =
    answers.renderingStrategy in RENDERING &&
    ok(discoveryAvailability.renderingStrategy(answers.renderingStrategy, withDb))
      ? answers.renderingStrategy
      : 'spa-dynamic';
  return {
    ...withDb,
    renderingStrategy,
    // Markdown necesita Astro: si el renderizado quedó en SPA, se vuelve a «ninguna»
    databaseNeed: databaseNeed === 'markdown-cms' && renderingStrategy === 'spa-dynamic' ? 'none' : databaseNeed,
    integrations: answers.integrations.filter((i) => ok(INTEGRATIONS[i])),
  };
}
