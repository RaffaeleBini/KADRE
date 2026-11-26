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

  it('nessuna piattaforma offerta a uno stack con server serve solo file statici', () => {
    for (const { stackId, platform } of offeredStackPlatforms()) {
      if (STACK_PROFILES[stackId].backend) expect(platform).toBe('node-server');
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
