/**
 * Verifica che ogni sito esportato da KADRE si installi, superi il controllo dei
 * tipi e compili.
 *
 *   npm run verify:exports                          32 combinazioni strutturali
 *   VERIFY_FULL=1 npm run verify:exports            prodotto completo (lento)
 *   VERIFY_FILTER=it__ npm run verify:exports       solo le combinazioni il cui id contiene "it__"
 *
 * Esegue con Vitest (config: vitest.verify.config.ts), non con `npm test`.
 *
 * Per ogni combinazione: genera i file → li scrive in una cartella di lavoro →
 * `tsc --noEmit` (tsconfig strict generato) → `vite build` → `bash -n` sullo script
 * di esportazione → per gli stack con server, avvio reale con `npm start`. `npm install` si esegue una sola volta per ogni package.json
 * distinto: le cartelle in .cache/verify-exports/ si riusano tra un'esecuzione e l'altra.
 */
import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vitest';
import { ExportCombo, fullCombos, generate, structuralCombos } from './exportMatrix';

const ROOT = path.resolve(__dirname, '..');
const CACHE = path.join(ROOT, '.cache', 'verify-exports');
const REPORT = path.join(CACHE, 'report.json');
const KEEP = new Set(['node_modules', 'package-lock.json', 'package.json']);

const full = process.env.VERIFY_FULL === '1';
const filter = process.env.VERIFY_FILTER;

type Step = 'install' | 'typecheck' | 'build' | 'script' | 'server';

interface Result {
  id: string;
  ok: boolean;
  /** passi falliti, ciascuno col suo estratto d'errore */
  failures: { step: Step; error: string }[];
  ms: number;
}

function run(cmd: string, cmdArgs: string[], cwd: string): { ok: boolean; out: string } {
  const r = spawnSync(cmd, cmdArgs, { cwd, encoding: 'utf8', env: { ...process.env, CI: '1' } });
  return { ok: r.status === 0, out: `${r.stdout ?? ''}${r.stderr ?? ''}`.trim() };
}

function firstLines(text: string, n = 12): string {
  return text
    .split('\n')
    .filter((l) => l.trim() && !l.includes('allow-scripts'))
    .slice(0, n)
    .join('\n');
}

function workdirFor(pkgJson: string): { dir: string; installed: boolean } {
  // chiave di cache: solo ciò che cambia l'installazione (non il nome del pacchetto)
  const { dependencies, devDependencies } = JSON.parse(pkgJson);
  const hash = createHash('sha256')
    .update(JSON.stringify({ dependencies, devDependencies }))
    .digest('hex')
    .slice(0, 10);
  const dir = path.join(CACHE, `deps-${hash}`);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'package.json'), pkgJson);
  return { dir, installed: fs.existsSync(path.join(dir, 'node_modules', '.bin', 'vite')) };
}

function cleanGenerated(dir: string) {
  for (const entry of fs.readdirSync(dir)) {
    if (!KEEP.has(entry)) fs.rmSync(path.join(dir, entry), { recursive: true, force: true });
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Prova di avvio per gli stack con server: `npm start` come farebbe un hosting
 * Node, poi /api/health, la home page servita dalla build e /api/contact.
 */
async function smokeServer(dir: string, port: number, realEmail: boolean, payments: boolean): Promise<string | null> {
  const child = spawn('npm', ['start'], {
    cwd: dir,
    // sin claves de Resend: el servidor debe reconocer que no está configurado
    env: { ...process.env, PORT: String(port), RESEND_API_KEY: '', CONTACT_TO_EMAIL: '', STRIPE_SECRET_KEY: '' },
    detached: true, // gruppo di processi proprio: si chiude anche il figlio di npm
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let log = '';
  child.stdout?.on('data', (d) => (log += d));
  child.stderr?.on('data', (d) => (log += d));
  const base = `http://127.0.0.1:${port}`;
  try {
    let up = false;
    for (let i = 0; i < 60 && !up; i++) {
      await sleep(250);
      up = await fetch(`${base}/api/health`).then((r) => r.ok, () => false);
    }
    if (!up) return `il server non risponde su /api/health\n${firstLines(log)}`;

    const home = await fetch(`${base}/`);
    const html = await home.text();
    // SPA: <div id="root"> vuoto; Astro: HTML prerenderizzato con <main id="top">
    if (!home.ok || !(html.includes('id="root"') || html.includes('id="top"')))
      return `GET / → ${home.status}, la pagina non viene servita`;

    const post = (body: object) =>
      fetch(`${base}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    const ok = await post({ name: 'Test', email: 'test@example.com', message: 'hola' });
    // con envío real y sin configurar, el servidor NO debe fingir haber enviado: 503
    const expected = realEmail ? 503 : 201;
    if (ok.status !== expected) return `POST /api/contact valido → ${ok.status} (atteso ${expected})`;
    const bad = await post({ message: 'senza nome' });
    if (bad.status !== 400) return `POST /api/contact incompleto → ${bad.status} (atteso 400)`;
    if (payments) {
      const checkout = await fetch(`${base}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: 'cualquiera' }),
      });
      // sin STRIPE_SECRET_KEY el servidor debe decir que no está configurado, no inventar una sesión
      if (checkout.status !== 503) return `POST /api/checkout senza chiave → ${checkout.status} (atteso 503)`;
    }
    if (realEmail) {
      const badEmail = await post({ name: 'Test', email: 'no-es-un-correo' });
      if (badEmail.status !== 400) return `POST /api/contact email non valida → ${badEmail.status} (atteso 400)`;
      const bot = await post({ name: 'Bot', email: 'bot@example.com', botcheck: 'x' });
      if (bot.status !== 201) return `POST /api/contact con trappola anti-bot → ${bot.status} (atteso 201)`;
    }
    return null;
  } finally {
    try {
      process.kill(-child.pid!, 'SIGTERM');
    } catch {
      // già terminato
    }
  }
}

let nextPort = 4600;

async function verify(combo: ExportCombo): Promise<Result> {
  const t0 = Date.now();
  const files = generate(combo);
  const failures: Result['failures'] = [];
  const done = () => ({ id: combo.id, ok: failures.length === 0, failures, ms: Date.now() - t0 });

  const pkg = files.find((f) => f.path === 'package.json');
  if (!pkg) {
    failures.push({ step: 'install', error: 'package.json mancante' });
    return done();
  }

  const { dir, installed } = workdirFor(pkg.content);
  if (!installed) {
    process.stdout.write(`   npm install in ${path.relative(ROOT, dir)} … `);
    const inst = run('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error'], dir);
    console.log(inst.ok ? 'ok' : 'ERRORE');
    if (!inst.ok) {
      failures.push({ step: 'install', error: firstLines(inst.out) });
      return done(); // senza dipendenze non ha senso proseguire
    }
  }

  cleanGenerated(dir);
  for (const f of files) {
    const target = path.join(dir, f.path);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, f.content);
  }

  const bin = (name: string) => path.join(dir, 'node_modules', '.bin', name);

  // i passi sono indipendenti: li eseguo tutti per avere il quadro completo
  // Astro: `astro check` controlla anche i file .astro; altrimenti tsc sul tsconfig strict
  const scripts = JSON.parse(pkg.content).scripts ?? {};
  const tsc = scripts.check
    ? run('npm', ['run', 'check'], dir)
    : run(bin('tsc'), ['--noEmit', '-p', 'tsconfig.json'], dir);
  if (!tsc.ok) failures.push({ step: 'typecheck', error: firstLines(tsc.out.replace(/\x1b\[[0-9;]*m/g, ''), 20) });

  const build = run('npm', ['run', 'build'], dir);
  if (!build.ok) failures.push({ step: 'build', error: firstLines(build.out) });

  const script = files.find((f) => f.path.endsWith('.sh'));
  if (script) {
    const sh = run('bash', ['-n', script.path], dir);
    if (!sh.ok) failures.push({ step: 'script', error: firstLines(sh.out) });
  }

  // prova di avvio per ogni progetto avviabile con `npm start` (Express o Astro + adapter Node)
  if (scripts.start && build.ok) {
    const error = await smokeServer(dir, nextPort++, !!combo.contact, !!combo.payments);
    if (error) failures.push({ step: 'server', error });
  }

  return done();
}

async function main() {
  let combos = full ? fullCombos() : structuralCombos();
  if (filter) combos = combos.filter((c) => c.id.includes(filter));
  console.log(`Verifica di ${combos.length} combinazioni${full ? ' (--full)' : ''}${filter ? ` [filtro: ${filter}]` : ''}\n`);

  const results: Result[] = [];
  for (const [i, combo] of combos.entries()) {
    const r = await verify(combo);
    results.push(r);
    const tag = r.ok ? 'OK  ' : `FAIL (${r.failures.map((f) => f.step).join('+')})`;
    console.log(`${String(i + 1).padStart(3)}/${combos.length}  ${tag}  ${combo.id}  ${(r.ms / 1000).toFixed(1)}s`);
  }

  const failed = results.filter((r) => !r.ok);
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(REPORT, JSON.stringify(results, null, 2));

  console.log(`\nRisultato: ${results.length - failed.length}/${results.length} OK`);
  const steps: Step[] = ['install', 'typecheck', 'build', 'script', 'server'];
  for (const step of steps) {
    const n = results.filter((r) => r.failures.some((f) => f.step === step)).length;
    if (n) console.log(`  ${step}: ${n} falliti`);
  }
  if (failed.length) {
    // raggruppa per tipo di errore (codici TS senza numeri di riga) per non ripetere lo stesso problema 20 volte
    const groups = new Map<string, { ids: string[]; sample: string }>();
    for (const r of failed) {
      for (const f of r.failures) {
        const signature = `[${f.step}] ${[...new Set(f.error.match(/error TS\d+|Error: [^\n]{0,80}/g) ?? [f.error.slice(0, 120)])].sort().join(', ')}`;
        const g = groups.get(signature) ?? { ids: [], sample: f.error };
        g.ids.push(r.id);
        groups.set(signature, g);
      }
    }
    console.log(`\nErrori distinti: ${groups.size}`);
    for (const [signature, g] of groups) {
      console.log(`\n── ${signature} — ${g.ids.length} combinazioni, es. ${g.ids[0]}\n${g.sample}`);
    }
    console.log(`\nReport completo: ${path.relative(ROOT, REPORT)}`);
  }
  return failed.map((r) => r.id);
}

// Gira dentro Vitest perché il generatore usa import.meta.glob (funzione di Vite).
test('i siti esportati si installano, superano tsc, compilano e (con server) partono', async () => {
  expect(await main()).toEqual([]);
});
