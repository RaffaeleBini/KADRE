/**
 * La matrice di compatibilità è la promessa del configuratore: questi test
 * verificano che sia coerente con gli stack reali e con sé stessa.
 */
import { describe, expect, it } from 'vitest';
import { getAllStacks, getDiscoveryOptions } from '../src/data/presets';
import {
  ALL_PLATFORMS,
  defaultPlatform,
  discoveryAvailability,
  normalizeAnswers,
  platformAvailability,
  recommendStackId,
  STACK_PROFILES,
} from '../src/generator/matrix';
import { DiscoveryAnswers } from '../src/types/builder';
import { offeredStackPlatforms, structuralCombos } from './exportMatrix';

const options = getDiscoveryOptions('es');

/** Tutte le combinazioni di risposte possibili (anche con opzioni non disponibili). */
function allAnswers(): DiscoveryAnswers[] {
  const out: DiscoveryAnswers[] = [];
  const integrationSets = [[], ...options.integrations.map((o) => [o.value])];
  for (const architectureMode of options.architectureMode.map((o) => o.value))
    for (const databaseNeed of options.databaseNeed.map((o) => o.value))
      for (const renderingStrategy of options.renderingStrategy.map((o) => o.value))
        for (const integrations of integrationSets)
          out.push({ projectType: 'landing', architectureMode, databaseNeed, renderingStrategy, integrations });
  return out;
}

const isAvailableAnswer = (a: DiscoveryAnswers) =>
  discoveryAvailability.architectureMode(a.architectureMode, a).status === 'available' &&
  discoveryAvailability.databaseNeed(a.databaseNeed, a).status === 'available' &&
  discoveryAvailability.renderingStrategy(a.renderingStrategy, a).status === 'available' &&
  a.integrations.every((i) => discoveryAvailability.integration(i, a).status === 'available');

describe('matrice di compatibilità', () => {
  it('ogni stack mostrato ha un profilo, e viceversa', () => {
    for (const locale of ['es', 'it'] as const) {
      expect(getAllStacks(locale).map((s) => s.id).sort()).toEqual(Object.keys(STACK_PROFILES).sort());
    }
  });

  it('i flag backend/database degli stack coincidono con il profilo', () => {
    for (const s of getAllStacks('es')) {
      const p = STACK_PROFILES[s.id as keyof typeof STACK_PROFILES];
      expect([s.includesBackend, s.includesDatabase]).toEqual([p.backend, p.database]);
    }
  });

  it('ogni stack ha almeno una piattaforma, e quella di default è disponibile', () => {
    for (const id of Object.keys(STACK_PROFILES)) {
      expect(platformAvailability(id, defaultPlatform(id)).status).toBe('available');
    }
  });

  it('gli stack con server non finiscono mai su un hosting solo statico', () => {
    for (const { stackId, platform } of offeredStackPlatforms()) {
      const p = STACK_PROFILES[stackId];
      if (p.backend) expect(platform).not.toBe('github-pages');
      // Express è un processo sempre acceso: solo un hosting Node può eseguirlo
      if (p.backend && p.skeleton === 'vite-react') expect(platform).toBe('node-server');
      // node-server ha senso solo se c'è qualcosa da eseguire
      if (platform === 'node-server') expect(p.backend).toBe(true);
    }
  });

  it('le combinazioni verificate sono esattamente quelle offerte', () => {
    const offered = new Set(
      ALL_PLATFORMS.flatMap((p) =>
        Object.keys(STACK_PROFILES)
          .filter((s) => platformAvailability(s, p).status === 'available')
          .map((s) => `${s}|${p}`)
      )
    );
    const verified = new Set(structuralCombos().map((c) => `${c.stackId}|${c.platform}`));
    expect([...verified].sort()).toEqual([...offered].sort());
  });

  it('normalizeAnswers produce solo opzioni disponibili ed è idempotente', () => {
    for (const a of allAnswers()) {
      const n = normalizeAnswers(a);
      expect(isAvailableAnswer(n)).toBe(true);
      expect(normalizeAnswers(n)).toEqual(n);
      if (isAvailableAnswer(a)) expect(n).toEqual(a);
    }
  });

  it('la raccomandazione è coerente con le risposte normalizzate', () => {
    for (const a of allAnswers()) {
      const n = normalizeAnswers(a);
      const p = STACK_PROFILES[recommendStackId(a)];
      expect(p.database).toBe(n.databaseNeed === 'sql-relational');
      expect(p.backend).toBe(n.architectureMode !== 'frontend-only');
      expect(p.rendering).toBe(n.renderingStrategy);
    }
  });
});

describe('sitio en dos idiomas (i18n)', () => {
  const base: DiscoveryAnswers = {
    projectType: 'landing',
    architectureMode: 'frontend-only',
    databaseNeed: 'none',
    renderingStrategy: 'static-ssg',
    integrations: [],
  };

  it('está disponible con Astro y se desactiva, con motivo, con SPA, Markdown o SQL', () => {
    expect(discoveryAvailability.integration('i18n', base).status).toBe('available');
    expect(discoveryAvailability.integration('i18n', { ...base, renderingStrategy: 'spa-dynamic' }).status).toBe('incompatible');
    expect(discoveryAvailability.integration('i18n', { ...base, databaseNeed: 'markdown-cms' }).status).toBe('incompatible');
    expect(discoveryAvailability.integration('i18n', { ...base, architectureMode: 'light-api', databaseNeed: 'sql-relational' }).status).toBe('incompatible');
  });

  it('la exclusión es simétrica: i18n también desactiva SPA, Markdown y SQL', () => {
    const withI18n = { ...base, architectureMode: 'light-api' as const, renderingStrategy: 'hybrid-ssr' as const, integrations: ['i18n' as const] };
    expect(discoveryAvailability.renderingStrategy('spa-dynamic', withI18n).status).toBe('incompatible');
    expect(discoveryAvailability.databaseNeed('markdown-cms', withI18n).status).toBe('incompatible');
    expect(discoveryAvailability.databaseNeed('sql-relational', withI18n).status).toBe('incompatible');
    expect(discoveryAvailability.renderingStrategy('hybrid-ssr', withI18n).status).toBe('available');
  });

  it('una borrador con i18n y SPA se normaliza sin i18n; con Astro se conserva', () => {
    expect(normalizeAnswers({ ...base, renderingStrategy: 'spa-dynamic', integrations: ['i18n'] }).integrations).toEqual([]);
    expect(normalizeAnswers({ ...base, integrations: ['i18n'] }).integrations).toEqual(['i18n']);
    expect(recommendStackId({ ...base, integrations: ['i18n'] })).toBe('astro-static');
  });
});
