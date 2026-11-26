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
import { skeletonFor } from '../src/generator/matrix';
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
        expect(f.content, f.path).not.toMatch(/\bundefined\b|\[object Object\]/);
      }

      // coerenza backend: server presente se e solo se lo script dev lo avvia
      const pkg = JSON.parse(byPath.get('package.json')!);
      const hasServer = byPath.has('server/index.ts');
      expect(String(pkg.scripts.dev).includes('server/index.ts')).toBe(hasServer);
    });
  }
});
