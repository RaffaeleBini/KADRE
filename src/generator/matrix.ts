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

export type StackId = 'static-vite-react' | 'hybrid-node-api' | 'fullstack-sql-platform';

interface StackProfile {
  backend: boolean;
  database: boolean;
  platforms: DeployPlatform[];
}

export const STACK_PROFILES: Record<StackId, StackProfile> = {
  'static-vite-react': {
    backend: false,
    database: false,
    platforms: ['github-pages', 'vercel', 'netlify', 'cloudflare'],
  },
  'hybrid-node-api': { backend: true, database: false, platforms: ['node-server'] },
  'fullstack-sql-platform': { backend: true, database: true, platforms: ['node-server'] },
};

export const ALL_PLATFORMS: DeployPlatform[] = [
  'github-pages',
  'vercel',
  'netlify',
  'cloudflare',
  'node-server',
];

/** Stack previsti (Fase 5), mostrati come "in arrivo" nell'elenco delle alternative. */
export const PLANNED_STACKS: { id: string; name: Msg; reason: Msg }[] = [
  {
    id: 'astro-static',
    name: { es: 'Astro (estático SSG real)', it: 'Astro (statico SSG reale)' },
    reason: {
      es: 'HTML generado en la compilación, ideal para SEO.',
      it: 'HTML generato in compilazione, ideale per la SEO.',
    },
  },
  {
    id: 'astro-hybrid',
    name: { es: 'Astro híbrido (páginas + endpoints de servidor)', it: 'Astro ibrido (pagine + endpoint server)' },
    reason: {
      es: 'Servidor en Vercel, Netlify o Cloudflare sin mantener un proceso Node.',
      it: 'Server su Vercel, Netlify o Cloudflare senza mantenere un processo Node.',
    },
  },
];

// ── Opzioni del passo Discovery ─────────────────────────────────────────────

const ASTRO_SOON: Msg = {
  es: 'Llegará con Astro. Hoy KADRE genera una SPA (React + Vite).',
  it: 'Arriverà con Astro. Oggi KADRE genera una SPA (React + Vite).',
};

const RENDERING: Record<RenderingStrategy, Availability> = {
  'spa-dynamic': AVAILABLE,
  'static-ssg': { status: 'planned', reason: ASTRO_SOON },
  'hybrid-ssr': { status: 'planned', reason: ASTRO_SOON },
};

const DATABASE: Record<DatabaseNeed, Availability> = {
  none: AVAILABLE,
  'sql-relational': AVAILABLE,
  'markdown-cms': {
    status: 'planned',
    reason: {
      es: 'Contenidos en archivos Markdown, con Astro.',
      it: 'Contenuti in file Markdown, con Astro.',
    },
  },
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
  'contact-form': {
    status: 'planned',
    reason: {
      es: 'El envío real llegará como integración. Hoy el formulario de la sección Contacto es demostrativo en sitios estáticos y llega a /api/contact con servidor Express.',
      it: 'L’invio reale arriverà come integrazione. Oggi il modulo della sezione Contatti è dimostrativo nei siti statici e arriva a /api/contact con server Express.',
    },
  },
  payments: { status: 'planned', reason: INTEGRATION_SOON },
  analytics: { status: 'planned', reason: INTEGRATION_SOON },
  i18n: { status: 'planned', reason: INTEGRATION_SOON },
  auth: { status: 'planned', reason: INTEGRATION_SOON },
};

/** Disponibilità di ogni opzione del passo Discovery, date le altre risposte. */
export const discoveryAvailability = {
  architectureMode: (v: ArchitectureMode, _answers?: DiscoveryAnswers) => ARCHITECTURE[v],
  databaseNeed: (v: DatabaseNeed, answers?: DiscoveryAnswers) => {
    if (DATABASE[v].status !== 'available') return DATABASE[v];
    if (v === 'sql-relational' && answers?.architectureMode === 'frontend-only') return SQL_NEEDS_SERVER;
    return AVAILABLE;
  },
  renderingStrategy: (v: RenderingStrategy, _answers?: DiscoveryAnswers) => RENDERING[v],
  integration: (v: IntegrationOption, _answers?: DiscoveryAnswers) => INTEGRATIONS[v],
};

// ── Piattaforme di deploy ───────────────────────────────────────────────────

export function platformAvailability(stackId: string, platform: DeployPlatform): Availability {
  const profile = STACK_PROFILES[stackId as StackId];
  if (!profile || profile.platforms.includes(platform)) return AVAILABLE;
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
  if (a.architectureMode !== 'frontend-only') return 'hybrid-node-api';
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
  return {
    ...withArch,
    renderingStrategy: ok(RENDERING[answers.renderingStrategy]) ? answers.renderingStrategy : 'spa-dynamic',
    databaseNeed:
      answers.databaseNeed in DATABASE && ok(discoveryAvailability.databaseNeed(answers.databaseNeed, withArch))
        ? answers.databaseNeed
        : 'none',
    integrations: answers.integrations.filter((i) => ok(INTEGRATIONS[i])),
  };
}
