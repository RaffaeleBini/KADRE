/**
 * Innesto "área de administración" (solo React + Express + PostgreSQL).
 *
 * Un solo administrador que entra en /admin y lee los mensajes del formulario de contacto
 * guardados en la base de datos. No hay registro de usuarios ni recuperación de contraseña.
 *
 *  - server/auth.ts         scrypt (crypto de Node), sesión en cookie firmada con HMAC-SHA256,
 *                           rutas /api/auth/* y /api/admin/messages, límite de intentos
 *  - server/createAdmin.ts  `npm run admin:create -- correo`: crea el administrador (contraseña por prompt)
 *  - src/admin/Admin.tsx    la página /admin (login + lista de mensajes)
 *
 * Sin dependencias nuevas. SESSION_SECRET solo viene del entorno; sin él, el login responde 503.
 */
import { GenContext, GeneratorModule } from '../types';
import { backendExpress } from './backendExpress';

function authSource({ isIt }: GenContext): string {
  const t = (it: string, es: string) => (isIt ? it : es);
  return `import crypto from 'node:crypto';
import { promisify } from 'node:util';
import type { Express, Request, Response } from 'express';
import { findUser, listContacts, type UserRow } from './db';

const scrypt = promisify(crypto.scrypt) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

const COOKIE = 'session';
const SESSION_SECONDS = 60 * 60 * 8;
const MAX_FAILURES = 10;
const WINDOW_MS = 15 * 60 * 1000;

/** ${t('Hash con salt casuale (scrypt). Formato: scrypt$salt$hash, in esadecimale.', 'Hash con sal aleatoria (scrypt). Formato: scrypt$sal$hash, en hexadecimal.')} */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const key = await scrypt(password, salt, 64);
  return 'scrypt$' + salt.toString('hex') + '$' + key.toString('hex');
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, saltHex, keyHex] = stored.split('$');
  if (scheme !== 'scrypt' || !saltHex || !keyHex) return false;
  const expected = Buffer.from(keyHex, 'hex');
  const actual = await scrypt(password, Buffer.from(saltHex, 'hex'), expected.length);
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

// ${t('Con un’email inesistente si verifica comunque una password: così la risposta non rivela se l’utente esiste.', 'Con un correo inexistente se verifica igualmente una contraseña: así la respuesta no revela si el usuario existe.')}
const DUMMY_HASH = 'scrypt$' + '00'.repeat(16) + '$' + '00'.repeat(64);

const sign = (secret: string, body: string) => crypto.createHmac('sha256', secret).update(body).digest('base64url');

function createToken(secret: string, uid: number): string {
  const body = Buffer.from(JSON.stringify({ uid, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })).toString('base64url');
  return body + '.' + sign(secret, body);
}

/** ${t('Id utente se il token è autentico e non scaduto, altrimenti null.', 'Id de usuario si el token es auténtico y no ha caducado; si no, null.')} */
function readToken(secret: string, token: string): number | null {
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  const given = Buffer.from(signature);
  const expected = Buffer.from(sign(secret, body));
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as { uid?: unknown; exp?: unknown };
    if (typeof data.uid !== 'number' || typeof data.exp !== 'number') return null;
    return data.exp > Math.floor(Date.now() / 1000) ? data.uid : null;
  } catch {
    return null;
  }
}

function cookieValue(req: Request, name: string): string {
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return '';
}

function setSessionCookie(req: Request, res: Response, value: string, maxAge: number) {
  const secure = req.secure || req.get('x-forwarded-proto') === 'https';
  res.setHeader('Set-Cookie', COOKIE + '=' + value + '; HttpOnly; SameSite=Lax; Path=/; Max-Age=' + maxAge + (secure ? '; Secure' : ''));
}

// ${t('Limite di tentativi falliti per IP, in memoria (si azzera al riavvio).', 'Límite de intentos fallidos por IP, en memoria (se reinicia al arrancar).')}
const failures = new Map<string, { count: number; resetAt: number }>();

function isLimited(ip: string): boolean {
  const entry = failures.get(ip);
  if (!entry) return false;
  if (entry.resetAt < Date.now()) {
    failures.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

function registerFailure(ip: string) {
  const now = Date.now();
  if (failures.size > 1000) for (const [key, entry] of failures) if (entry.resetAt < now) failures.delete(key);
  const entry = failures.get(ip);
  if (!entry || entry.resetAt < now) failures.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  else entry.count++;
}

type Admin = { ok: true; user: UserRow } | { ok: false; status: number; error: string };

/** ${t('Amministratore della sessione: ricontrolla l’utente nel database a ogni richiesta, così togliere il ruolo revoca anche le sessioni già emesse.', 'Administrador de la sesión: vuelve a comprobar el usuario en la base de datos en cada petición, así quitar el rol revoca también las sesiones ya emitidas.')} */
async function currentAdmin(req: Request): Promise<Admin> {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) return { ok: false, status: 503, error: '${t('Accesso non configurato (vedi README).', 'Acceso no configurado (ver README).')}' };
  const uid = readToken(secret, cookieValue(req, COOKIE));
  if (uid === null) return { ok: false, status: 401, error: '${t('Sessione non valida.', 'Sesión no válida.')}' };
  const found = await findUser(process.env, { id: uid });
  if (!found.ok) return { ok: false, status: found.reason === 'unconfigured' ? 503 : 502, error: '${t('Database non disponibile.', 'Base de datos no disponible.')}' };
  if (!found.user || found.user.role !== 'admin') return { ok: false, status: 401, error: '${t('Sessione non valida.', 'Sesión no válida.')}' };
  return { ok: true, user: found.user };
}

export function registerAuthRoutes(app: Express) {
  // ${t('Dietro il proxy dell’hosting (1 salto) l’IP reale arriva in X-Forwarded-For.', 'Detrás del proxy del hosting (1 salto) la IP real llega en X-Forwarded-For.')}
  app.set('trust proxy', 1);
  app.use(['/api/auth', '/api/admin'], (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  app.post('/api/auth/login', async (req, res) => {
    const secret = process.env.SESSION_SECRET;
    if (!secret || secret.length < 32) return res.status(503).json({ error: '${t('Accesso non configurato (vedi README).', 'Acceso no configurado (ver README).')}' });
    // ${t('Solo JSON: un modulo di un altro sito non può inviarlo senza preflight CORS (difesa CSRF).', 'Solo JSON: un formulario de otro sitio no puede enviarlo sin preflight CORS (defensa CSRF).')}
    if (!req.is('application/json')) return res.status(415).json({ error: '${t('Serve application/json.', 'Se requiere application/json.')}' });
    const ip = req.ip ?? 'unknown';
    if (isLimited(ip)) return res.status(429).json({ error: '${t('Troppi tentativi: riprova tra qualche minuto.', 'Demasiados intentos: inténtalo de nuevo en unos minutos.')}' });

    const { email, password } = (req.body ?? {}) as { email?: unknown; password?: unknown };
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password || email.length > 255 || password.length > 200) {
      return res.status(400).json({ error: '${t('Email e password sono obbligatorie.', 'Correo y contraseña son obligatorios.')}' });
    }
    const found = await findUser(process.env, { email: email.trim().toLowerCase() });
    if (!found.ok) return res.status(found.reason === 'unconfigured' ? 503 : 502).json({ error: '${t('Database non disponibile.', 'Base de datos no disponible.')}' });

    const valid = await verifyPassword(password, found.user?.passwordHash ?? DUMMY_HASH);
    if (!found.user || !valid || found.user.role !== 'admin') {
      registerFailure(ip);
      return res.status(401).json({ error: '${t('Credenziali non valide.', 'Credenciales no válidas.')}' });
    }
    failures.delete(ip);
    setSessionCookie(req, res, createToken(secret, found.user.id), SESSION_SECONDS);
    return res.json({ ok: true, email: found.user.email });
  });

  app.post('/api/auth/logout', (req, res) => {
    setSessionCookie(req, res, '', 0);
    res.json({ ok: true });
  });

  app.get('/api/auth/me', async (req, res) => {
    const admin = await currentAdmin(req);
    if (!admin.ok) return res.status(admin.status).json({ error: admin.error });
    return res.json({ email: admin.user.email });
  });

  app.get('/api/admin/messages', async (req, res) => {
    const admin = await currentAdmin(req);
    if (!admin.ok) return res.status(admin.status).json({ error: admin.error });
    const result = await listContacts(process.env);
    if (!result.ok) return res.status(result.reason === 'unconfigured' ? 503 : 502).json({ error: '${t('Lettura dei messaggi non riuscita.', 'Lectura de los mensajes fallida.')}' });
    return res.json({ messages: result.messages });
  });
}
`;
}

function createAdminSource({ isIt }: GenContext): string {
  const t = (it: string, es: string) => (isIt ? it : es);
  return `/**
 * ${t('Crea l’amministratore (o ne cambia la password):', 'Crea el administrador (o cambia su contraseña):')}
 *
 *   npm run admin:create -- ${t('tu@email.com', 'tu@correo.com')}
 *
 * ${t('La password si chiede da terminale (non compare né resta nella cronologia). In automatico si può passare con ADMIN_PASSWORD.', 'La contraseña se pide por terminal (no se ve ni queda en el historial). En automático se puede pasar con ADMIN_PASSWORD.')}
 */
import 'dotenv/config';
import readline from 'node:readline';
import { hashPassword } from './auth';
import { closeDb, saveAdmin } from './db';

function askPassword(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: Boolean(process.stdin.isTTY) });
    // ${t('Oscura quello che si digita (readline non ha un’opzione pubblica per farlo).', 'Oculta lo que se escribe (readline no tiene una opción pública para ello).')}
    const muted = rl as unknown as { _writeToOutput: (text: string) => void };
    const original = muted._writeToOutput.bind(rl);
    muted._writeToOutput = (text) => {
      if (text.startsWith(question)) original(text);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write('\\n');
      resolve(answer);
    });
  });
}

async function main() {
  const email = (process.argv[2] ?? '').trim().toLowerCase();
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
    console.error('${t('Uso: npm run admin:create -- tu@email.com', 'Uso: npm run admin:create -- tu@correo.com')}');
    process.exit(1);
  }
  const password = process.env.ADMIN_PASSWORD ?? (await askPassword('${t('Password (min. 10 caratteri): ', 'Contraseña (mín. 10 caracteres): ')}'));
  if (password.length < 10 || password.length > 200) {
    console.error('${t('La password deve avere tra 10 e 200 caratteri.', 'La contraseña debe tener entre 10 y 200 caracteres.')}');
    process.exit(1);
  }
  const result = await saveAdmin(process.env, email, await hashPassword(password));
  await closeDb();
  if (result === 'unconfigured') {
    console.error('${t('Manca DATABASE_URL: configurala in .env ed esegui prima npm run db:init.', 'Falta DATABASE_URL: configúrala en .env y ejecuta antes npm run db:init.')}');
    process.exit(1);
  }
  if (result === 'failed') {
    console.error('${t('Non è stato possibile salvare l’amministratore (hai eseguito npm run db:init?).', 'No se pudo guardar el administrador (¿has ejecutado npm run db:init?).')}');
    process.exit(1);
  }
  console.log('${t('Amministratore pronto:', 'Administrador listo:')}', email);
}

main();
`;
}

function adminPageSource({ isIt }: GenContext): string {
  const t = (it: string, es: string) => (isIt ? it : es);
  return `import { useEffect, useState, type FormEvent } from 'react';

interface Message {
  id: number;
  name: string;
  email: string;
  message: string | null;
  createdAt: string;
}

type State =
  | { kind: 'loading' }
  | { kind: 'login'; error?: string }
  | { kind: 'panel'; email: string; messages: Message[]; error?: string };

const T = {
  title: '${t('Area di amministrazione', 'Área de administración')}',
  email: '${t('Email', 'Correo electrónico')}',
  password: '${t('Password', 'Contraseña')}',
  enter: '${t('Entra', 'Entrar')}',
  entering: '${t('Accesso…', 'Entrando…')}',
  logout: '${t('Esci', 'Salir')}',
  back: '${t('← Torna al sito', '← Volver al sitio')}',
  messages: '${t('Messaggi ricevuti', 'Mensajes recibidos')}',
  empty: '${t('Ancora nessun messaggio.', 'Todavía no hay mensajes.')}',
  date: '${t('Data', 'Fecha')}',
  name: '${t('Nome', 'Nombre')}',
  message: '${t('Messaggio', 'Mensaje')}',
  badLogin: '${t('Credenziali non valide.', 'Credenciales no válidas.')}',
  tooMany: '${t('Troppi tentativi: riprova tra qualche minuto.', 'Demasiados intentos: inténtalo de nuevo en unos minutos.')}',
  notConfigured: '${t('Accesso non configurato sul server (vedi README).', 'Acceso no configurado en el servidor (ver README).')}',
  failed: '${t('Non è stato possibile completare l’operazione. Riprova.', 'No se pudo completar la operación. Inténtalo de nuevo.')}',
};

const field = 'w-full px-4 py-3 text-sm bg-transparent border';
const border = { borderColor: 'var(--color-border)', borderRadius: 'var(--radius-btn)' };

export default function Admin() {
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // ${t('Pagina privata: non va indicizzata.', 'Página privada: no debe indexarse.')}
    document.title = T.title;
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  async function loadPanel(email: string) {
    const res = await fetch('/api/admin/messages');
    // ${t('Si legge sempre il corpo: una risposta non consumata tiene occupata la connessione.', 'Siempre se lee el cuerpo: una respuesta sin consumir mantiene ocupada la conexión.')}
    const data = (await res.json().catch(() => null)) as { messages?: Message[] } | null;
    if (res.status === 401) return setState({ kind: 'login' });
    if (!res.ok || !data?.messages) return setState({ kind: 'panel', email, messages: [], error: T.failed });
    setState({ kind: 'panel', email, messages: data.messages });
  }

  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (res) => {
        const data = (await res.json().catch(() => null)) as { email?: string } | null;
        if (res.ok && data?.email) return loadPanel(data.email);
        setState(res.status === 503 ? { kind: 'login', error: T.notConfigured } : { kind: 'login' });
      })
      .catch(() => setState({ kind: 'login', error: T.failed }));
  }, []);

  async function login(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = (await res.json().catch(() => null)) as { email?: string } | null;
      if (res.ok && data?.email) {
        setForm({ email: '', password: '' });
        return await loadPanel(data.email);
      }
      const error = res.status === 401 ? T.badLogin : res.status === 429 ? T.tooMany : res.status === 503 ? T.notConfigured : T.failed;
      setState({ kind: 'login', error });
    } catch {
      setState({ kind: 'login', error: T.failed });
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
      .then((res) => res.text())
      .catch(() => {});
    setState({ kind: 'login' });
  }

  return (
    <div className="min-h-screen px-6 py-10" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{T.title}</h1>
          <a href="/" className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{T.back}</a>
        </header>

        {state.kind === 'login' ? (
          <form onSubmit={login} className="max-w-sm space-y-4 p-6 border" style={{ ...border, backgroundColor: 'var(--color-surface)' }}>
            <input type="email" required autoComplete="username" aria-label={T.email} placeholder={T.email} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} style={border} />
            <input type="password" required autoComplete="current-password" aria-label={T.password} placeholder={T.password} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={field} style={border} />
            <button type="submit" disabled={busy} className="px-5 py-3 text-sm font-semibold disabled:opacity-60" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)', borderRadius: 'var(--radius-btn)' }}>
              {busy ? T.entering : T.enter}
            </button>
            {state.error ? <p role="alert" className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{state.error}</p> : null}
          </form>
        ) : null}

        {state.kind === 'panel' ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">{T.messages} ({state.messages.length})</h2>
              <div className="flex items-center gap-4 text-sm">
                <span style={{ color: 'var(--color-text-muted)' }}>{state.email}</span>
                <button type="button" onClick={logout} className="px-3 py-1.5 border" style={border}>{T.logout}</button>
              </div>
            </div>
            {state.error ? <p role="alert" className="text-sm">{state.error}</p> : null}
            {state.messages.length === 0 && !state.error ? (
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{T.empty}</p>
            ) : (
              <ul className="space-y-3">
                {state.messages.map((m) => (
                  <li key={m.id} className="p-4 border space-y-1" style={{ ...border, backgroundColor: 'var(--color-surface)' }}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                      <span><strong>{m.name}</strong> · <a href={'mailto:' + m.email}>{m.email}</a></span>
                      <time dateTime={m.createdAt} style={{ color: 'var(--color-text-muted)' }}>{new Date(m.createdAt).toLocaleString('${isIt ? 'it' : 'es'}')}</time>
                    </div>
                    <p className="text-sm whitespace-pre-wrap break-words">{m.message || '—'}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : null}
      </div>
    </div>
  );
}
`;
}

export const authAdmin: GeneratorModule = {
  id: 'auth-admin',
  enabled: (ctx) => ctx.auth,
  // sustituye los scripts del esqueleto: se repiten los de Express y db:init, y se añade admin:create
  scripts: {
    ...backendExpress.scripts,
    'db:init': 'tsx server/dbInit.ts',
    'admin:create': 'tsx server/createAdmin.ts',
  },
  envExample: ({ isIt }) =>
    `\n# ${isIt ? 'Firma delle sessioni dell’area /admin: almeno 32 caratteri casuali. Generala con:' : 'Firma de las sesiones del área /admin: al menos 32 caracteres aleatorios. Genérala con:'}\n#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"\nSESSION_SECRET=\n`,
  readme: ({ isIt }) =>
    isIt
      ? `
## Area di amministrazione (/admin)

\`/admin\` mostra i messaggi del modulo di contatto salvati nel database, dopo un login. C’è **un solo amministratore** e nessuna registrazione. Finché \`SESSION_SECRET\` non è impostata il login risponde **503**.

1. Imposta \`SESSION_SECRET\` (almeno 32 caratteri casuali, vedi \`.env.example\`) in \`.env\` e nelle variabili d’ambiente dell’hosting. È un segreto: chi lo conosce può falsificare le sessioni.
2. Assicurati di aver eseguito \`npm run db:init\`, poi crea l’amministratore: \`npm run admin:create -- tu@email.com\`. La password (almeno 10 caratteri) si digita nel terminale e non viene mostrata. Rieseguendo il comando se ne cambia la password.
3. Apri \`/admin\` ed entra.

Come è protetta: password con \`scrypt\` (salt casuale), sessione in un cookie \`HttpOnly; SameSite=Lax\` (\`Secure\` su HTTPS) firmato con HMAC-SHA256 e valido 8 ore, utente ricontrollato nel database a ogni richiesta, solo JSON sulle rotte di login (difesa CSRF), 10 tentativi falliti ogni 15 minuti per IP (in memoria: si azzera al riavvio; dietro il proxy dell’hosting si usa l’IP reale con \`trust proxy\` a 1 salto). Usa HTTPS in produzione.

Non inclusi: recupero password, più amministratori o ruoli, autenticazione a due fattori, registro degli accessi, eliminazione dei messaggi dal pannello.
`
      : `
## Área de administración (/admin)

\`/admin\` muestra los mensajes del formulario de contacto guardados en la base de datos, tras iniciar sesión. Hay **un solo administrador** y no hay registro. Mientras \`SESSION_SECRET\` no esté definida el inicio de sesión responde **503**.

1. Define \`SESSION_SECRET\` (al menos 32 caracteres aleatorios, ver \`.env.example\`) en \`.env\` y en las variables de entorno del hosting. Es un secreto: quien lo conozca puede falsificar sesiones.
2. Asegúrate de haber ejecutado \`npm run db:init\` y crea el administrador: \`npm run admin:create -- tu@correo.com\`. La contraseña (mínimo 10 caracteres) se escribe en el terminal y no se muestra. Volviendo a ejecutar el comando se cambia la contraseña.
3. Abre \`/admin\` y entra.

Cómo está protegida: contraseña con \`scrypt\` (sal aleatoria), sesión en una cookie \`HttpOnly; SameSite=Lax\` (\`Secure\` en HTTPS) firmada con HMAC-SHA256 y válida 8 horas, usuario revalidado en la base de datos en cada petición, solo JSON en las rutas de login (defensa CSRF), 10 intentos fallidos cada 15 minutos por IP (en memoria: se reinicia al arrancar; tras el proxy del hosting se usa la IP real con \`trust proxy\` a 1 salto). Usa HTTPS en producción.

No incluidos: recuperar contraseña, varios administradores o roles, autenticación en dos pasos, registro de accesos, borrar mensajes desde el panel.
`,
  files: (ctx) => [
    {
      path: 'server/auth.ts',
      language: 'typescript',
      description: ctx.isIt
        ? 'Login dell’amministratore: scrypt, sessione firmata e rotte /api/auth e /api/admin.'
        : 'Acceso del administrador: scrypt, sesión firmada y rutas /api/auth y /api/admin.',
      content: authSource(ctx),
    },
    {
      path: 'server/createAdmin.ts',
      language: 'typescript',
      description: ctx.isIt
        ? 'Script npm run admin:create: crea l’amministratore chiedendo la password.'
        : 'Script npm run admin:create: crea el administrador pidiendo la contraseña.',
      content: createAdminSource(ctx),
    },
    {
      path: 'src/admin/Admin.tsx',
      language: 'typescript',
      description: ctx.isIt
        ? 'Pagina /admin: login e elenco dei messaggi di contatto.'
        : 'Página /admin: inicio de sesión y lista de mensajes de contacto.',
      content: adminPageSource(ctx),
    },
  ],
};
