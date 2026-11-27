/**
 * Snapshot dei repository generati da KADRE.
 *
 * Ogni file generato viene confrontato con una copia salvata in
 * tests/__snapshots__/exports/<combinazione>/<percorso>. Qualunque modifica
 * all'output del generatore fa fallire il test e appare come diff leggibile.
 *
 * Per accettare una modifica voluta:  npm run test -- -u
 */
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { skeletonFor, STACK_PROFILES } from '../src/generator/matrix';
import { generate, snapshotCombos, structuralCombos } from './exportMatrix';

const SNAP_DIR = path.join(__dirname, '__snapshots__', 'exports');

describe('file generati (snapshot)', () => {
  for (const combo of snapshotCombos()) {
    it(combo.id, async () => {
      const files = generate(combo);
      // elenco dei percorsi: rileva file aggiunti o spariti
      await expect(files.map((f) => f.path).join('\n') + '\n').toMatchFileSnapshot(
        path.join(SNAP_DIR, combo.id, '_files.txt')
      );
      for (const file of files) {
        await expect(file.content).toMatchFileSnapshot(
          path.join(SNAP_DIR, combo.id, `${file.path}.snap`)
        );
      }
    });
  }
});

describe('invarianti su tutte le combinazioni strutturali', () => {
  for (const combo of structuralCombos()) {
    it(combo.id, () => {
      const files = generate(combo);
      const byPath = new Map(files.map((f) => [f.path, f.content]));

      // nessun percorso duplicato
      expect(byPath.size).toBe(files.length);

      // i JSON generati sono validi
      for (const f of files.filter((x) => x.language === 'json')) {
        expect(() => JSON.parse(f.content), f.path).not.toThrow();
      }

      // file di base sempre presenti (comuni + specifici dello scheletro)
      const skeletonFiles =
        skeletonFor(combo.stackId) === 'astro'
          ? ['astro.config.mjs', 'src/pages/index.astro']
          : ['index.html', 'vite.config.ts', 'src/App.tsx', 'src/main.tsx'];
      const common = ['package.json', 'tsconfig.json', 'README.md', 'src/index.css', 'src/site/Site.tsx'];
      for (const required of [...common, ...skeletonFiles]) {
        expect(byPath.has(required), required).toBe(true);
      }

      // nessun placeholder del template rimasto non sostituito
      for (const f of files) {
        // contactEmail.ts, stripeCheckout.ts y db.ts usan "string | undefined" como tipo legítimo: solo se busca [object Object]
        const placeholder = /(contactEmail|stripeCheckout|db)\.ts$/.test(f.path) ? /\[object Object\]/ : /\bundefined\b|\[object Object\]/;
        expect(f.content, f.path).not.toMatch(placeholder);
      }

      // l'innesto analytics c'è se e solo se richiesto, ed è collegato all'entry point
      const entry = skeletonFor(combo.stackId) === 'astro' ? 'src/pages/index.astro' : 'src/main.tsx';
      expect(byPath.has('src/analytics.ts'), 'src/analytics.ts').toBe(!!combo.analytics);
      expect(byPath.has('src/data/analytics.json'), 'analytics.json').toBe(!!combo.analytics);
      expect(/analytics'/.test(byPath.get(entry)!), `${entry} importa analytics`).toBe(!!combo.analytics);

      // Markdown: colección de FAQ + un .md por pregunta; el JSON ya no las contiene
      const faqFiles = [...byPath.keys()].filter((k) => /^src\/content\/faqs\/\d\d-.+\.md$/.test(k));
      expect(byPath.has('src/content.config.ts'), 'content.config.ts').toBe(!!combo.markdown);
      expect(faqFiles.length > 0, 'FAQ .md').toBe(!!combo.markdown);
      expect(JSON.parse(byPath.get('src/data/siteContent.json')!).faqs.length === 0, 'faqs vacías en JSON').toBe(!!combo.markdown);
      if (combo.markdown) expect(byPath.get('src/pages/index.astro')).toContain("getCollection('faqs')");

      // pagos: configuración por plan (enlaces o price IDs) y endpoint/ruta solo con servidor
      const cfg = JSON.parse(byPath.get('src/data/siteConfig.json')!);
      const expectedPayments = !combo.payments ? undefined : STACK_PROFILES[combo.stackId].backend ? 'checkout' : 'links';
      expect(cfg.payments?.type, 'payments en siteConfig').toBe(expectedPayments);
      const checkoutFile = skeletonFor(combo.stackId) === 'astro' ? 'src/lib/stripeCheckout.ts' : 'server/stripeCheckout.ts';
      expect(byPath.has(checkoutFile), checkoutFile).toBe(expectedPayments === 'checkout');
      if (expectedPayments) {
        const plans = Object.keys(cfg.payments.links ?? cfg.payments.prices);
        expect(plans.length, 'un plan por cada plan del contenido').toBeGreaterThan(0);
      }

      // base de datos SQL: db.ts, db:init y esquema solo con el stack Express + PostgreSQL
      const sql = STACK_PROFILES[combo.stackId].database;
      for (const f of ['server/db.ts', 'server/dbInit.ts', 'db/schema.sql']) expect(byPath.has(f), f).toBe(sql);
      expect(Boolean(JSON.parse(byPath.get('package.json')!).scripts['db:init']), 'script db:init').toBe(sql);
      expect(byPath.get('.env.example')!.includes('DATABASE_URL='), 'DATABASE_URL en .env.example').toBe(sql);
      if (sql) {
        const server = byPath.get('server/index.ts')!;
        expect(server).toContain("from './db'");
        expect(server).toContain('/api/catalog');
        expect(server).toContain('saveContact');
      }

      // dos idiomas: segunda página, contenido y textos del otro idioma solo con i18n
      const alt = combo.locale === 'es' ? 'it' : 'es';
      const i18nFiles = [`src/pages/${alt}/index.astro`, `src/data/siteContent.${alt}.json`, `src/data/siteUi.${alt}.json`];
      for (const f of i18nFiles) expect(byPath.has(f), f).toBe(!!combo.i18n);
      expect(byPath.get('astro.config.mjs')?.includes('i18n:') ?? false, 'i18n en astro.config').toBe(!!combo.i18n);
      if (combo.i18n) {
        const main = byPath.get('src/pages/index.astro')!;
        const second = byPath.get(`src/pages/${alt}/index.astro`)!;
        expect(main).toContain(`<html lang="${combo.locale}">`);
        expect(second).toContain(`<html lang="${alt}">`);
        expect(second).toContain("'../../index.css'");
        expect(second).toContain("replaceAll('./assets/'"); // desde /<otro>/ las rutas relativas se romperían
        // los textos fijos del segundo idioma están realmente traducidos, no copiados
        const navMain = JSON.parse(byPath.get('src/data/siteConfig.json')!).ui.nav;
        const navAlt = JSON.parse(byPath.get(`src/data/siteUi.${alt}.json`)!).nav;
        expect(navAlt.contact).not.toBe(navMain.contact);
        // los planes conservan sus id: los pagos se enlazan por id
        const idsOf = (file: string) => JSON.parse(byPath.get(file)!).pricingPlans.map((p: { id: string }) => p.id);
        expect(idsOf(`src/data/siteContent.${alt}.json`)).toEqual(idsOf('src/data/siteContent.json'));
      }

      // coerenza backend: server presente se e solo se lo script dev lo avvia
      const pkg = JSON.parse(byPath.get('package.json')!);
      const hasServer = byPath.has('server/index.ts');
      expect(String(pkg.scripts.dev).includes('server/index.ts')).toBe(hasServer);
    });
  }
});
