/**
 * Innesto "database SQL" (solo stack React + Express).
 *
 * PostgreSQL con `pg`, connessione solo da DATABASE_URL (mai dal codice). Il piano
 * gratuito di Neon basta per provarlo (1 GB per progetto, 100 CU-ore/mese).
 *
 *  - db/schema.sql      tabelle contacts / catalog / (con auth) users
 *  - server/db.ts       pool, salvataggio dei contatti, lettura del catalogo
 *  - server/dbInit.ts   `npm run db:init`: applica lo schema e carica il catalogo
 *  - /api/contact       salva ogni messaggio in contact_submissions (vedi backendExpress)
 *  - /api/catalog       endpoint d'esempio che legge catalog_items
 *
 * Senza DATABASE_URL le rotte rispondono 503: non fingono di aver salvato.
 */
import { GenContext, GeneratorModule } from '../types';
import { backendExpress } from './backendExpress';

/** Il sito generato usa il database solo con lo stack Express (l'Astro ibrido con SQL non è offerto). */
export const hasDatabase = (ctx: GenContext) => ctx.hasDatabase && ctx.skeleton === 'vite-react';

function dbSource({ isIt, auth }: GenContext): string {
  const t = (it: string, es: string) => (isIt ? it : es);
  const authBlock = auth
    ? `
export interface UserRow {
  id: number;
  email: string;
  passwordHash: string;
  role: string;
}

export type UserResult = { ok: true; user: UserRow | null } | { ok: false; reason: 'unconfigured' | 'failed' };

/** ${t('Cerca un utente per email o per id. Le query sono fisse: nessun dato dell’utente finisce nell’SQL.', 'Busca un usuario por correo o por id. Las consultas son fijas: ningún dato del usuario entra en el SQL.')} */
export async function findUser(env: Env, by: { email: string } | { id: number }): Promise<UserResult> {
  const db = getPool(env);
  if (!db) return { ok: false, reason: 'unconfigured' };
  const where = 'id' in by ? 'id = $1' : 'email = $1';
  try {
    const { rows } = await db.query<UserRow>(
      'SELECT id, email, password_hash AS "passwordHash", role FROM users WHERE ' + where + ' LIMIT 1',
      ['id' in by ? by.id : by.email]
    );
    return { ok: true, user: rows[0] ?? null };
  } catch (err) {
    console.error('[db] ${t('lettura utente non riuscita (hai eseguito npm run db:init?)', 'lectura de usuario fallida (¿has ejecutado npm run db:init?)')}:', (err as Error).message);
    return { ok: false, reason: 'failed' };
  }
}

/** ${t('Crea l’amministratore o ne aggiorna la password (npm run admin:create).', 'Crea el administrador o actualiza su contraseña (npm run admin:create).')} */
export async function saveAdmin(env: Env, email: string, passwordHash: string): Promise<SaveResult> {
  const db = getPool(env);
  if (!db) return 'unconfigured';
  try {
    await db.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'admin') ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin'",
      [email, passwordHash]
    );
    return 'saved';
  } catch (err) {
    console.error('[db] ${t('salvataggio amministratore non riuscito', 'no se pudo guardar el administrador')}:', (err as Error).message);
    return 'failed';
  }
}

export interface ContactRow {
  id: number;
  name: string;
  email: string;
  message: string | null;
  createdAt: string;
}

export type ContactsResult =
  | { ok: true; messages: ContactRow[] }
  | { ok: false; reason: 'unconfigured' | 'failed' };

/** ${t('Ultimi messaggi ricevuti dal modulo di contatto (i più recenti prima).', 'Últimos mensajes recibidos del formulario de contacto (los más recientes primero).')} */
export async function listContacts(env: Env, limit = 200): Promise<ContactsResult> {
  const db = getPool(env);
  if (!db) return { ok: false, reason: 'unconfigured' };
  try {
    const { rows } = await db.query<ContactRow>(
      'SELECT id, full_name AS name, email, message, created_at AS "createdAt" FROM contact_submissions ORDER BY created_at DESC, id DESC LIMIT $1',
      [limit]
    );
    return { ok: true, messages: rows };
  } catch (err) {
    console.error('[db] ${t('lettura dei messaggi non riuscita', 'lectura de los mensajes fallida')}:', (err as Error).message);
    return { ok: false, reason: 'failed' };
  }
}

/** ${t('Chiude il pool (serve agli script che devono terminare).', 'Cierra el pool (lo necesitan los scripts que deben terminar).')} */
export async function closeDb(): Promise<void> {
  await pool?.end();
  pool = undefined;
}
`
    : '';
  return `import pg from 'pg';

type Env = Record<string, string | undefined>;

let pool: pg.Pool | undefined;

/** ${t('Pool condiviso. null se DATABASE_URL non è impostata.', 'Pool compartido. null si DATABASE_URL no está definida.')} */
function getPool(env: Env): pg.Pool | null {
  const url = env.DATABASE_URL;
  if (!url) return null;
  if (!pool) {
    // ${t('Timeout breve: con il database spento si risponde 502 invece di restare appesi.', 'Timeout corto: con la base de datos apagada se responde 502 en lugar de quedar colgado.')}
    pool = new pg.Pool({ connectionString: url, max: 5, connectionTimeoutMillis: 5000 });
    pool.on('error', (err) => console.error('[db]', err.message));
  }
  return pool;
}

export interface ContactRecord {
  name: string;
  email: string;
  message: string;
}

export type SaveResult = 'saved' | 'unconfigured' | 'failed';

/** ${t('Salva un messaggio in contact_submissions. Le lunghezze rispettano le colonne dello schema.', 'Guarda un mensaje en contact_submissions. Las longitudes respetan las columnas del esquema.')} */
export async function saveContact(env: Env, data: ContactRecord): Promise<SaveResult> {
  const db = getPool(env);
  if (!db) return 'unconfigured';
  try {
    await db.query(
      'INSERT INTO contact_submissions (full_name, email, message) VALUES ($1, $2, $3)',
      [data.name.slice(0, 160), data.email.slice(0, 255), data.message.slice(0, 5000)]
    );
    return 'saved';
  } catch (err) {
    console.error('[db] ${t('salvataggio del contatto non riuscito', 'no se pudo guardar el contacto')}:', (err as Error).message);
    return 'failed';
  }
}

export interface CatalogRow {
  slug: string;
  title: string;
  category: string;
  priceLabel: string | null;
  description: string | null;
  imagePath: string | null;
}

export type CatalogResult =
  | { ok: true; items: CatalogRow[] }
  | { ok: false; reason: 'unconfigured' | 'failed' };

/** ${t('Legge le voci pubblicate del catalogo.', 'Lee las entradas publicadas del catálogo.')} */
export async function listCatalog(env: Env): Promise<CatalogResult> {
  const db = getPool(env);
  if (!db) return { ok: false, reason: 'unconfigured' };
  try {
    const { rows } = await db.query<CatalogRow>(
      'SELECT slug, title, category, price_label AS "priceLabel", description, image_path AS "imagePath" FROM catalog_items WHERE published ORDER BY id'
    );
    return { ok: true, items: rows };
  } catch (err) {
    console.error('[db] ${t('lettura del catalogo non riuscita (hai eseguito npm run db:init?)', 'lectura del catálogo fallida (¿has ejecutado npm run db:init?)')}:', (err as Error).message);
    return { ok: false, reason: 'failed' };
  }
}
${authBlock}`;
}

function dbInitSource({ isIt }: GenContext): string {
  const t = (it: string, es: string) => (isIt ? it : es);
  return `/**
 * ${t('Prepara il database: applica db/schema.sql e carica il catalogo del sito.', 'Prepara la base de datos: aplica db/schema.sql y carga el catálogo del sitio.')}
 * ${t('Si può rieseguire senza rischi: le tabelle usano IF NOT EXISTS e il catalogo non duplica le voci.', 'Se puede repetir sin riesgo: las tablas usan IF NOT EXISTS y el catálogo no duplica entradas.')}
 *
 *   npm run db:init
 */
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import content from '../src/data/siteContent.json';

const here = path.dirname(fileURLToPath(import.meta.url));

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('${t('Falta DATABASE_URL: copia .env.example in .env e inserisci la stringa di connessione.', 'Falta DATABASE_URL: copia .env.example a .env e introduce la cadena de conexión.')}');
    process.exit(1);
  }

  const client = new pg.Client({ connectionString: url });
  await client.connect();
  try {
    await client.query(fs.readFileSync(path.resolve(here, '../db/schema.sql'), 'utf8'));

    const used = new Set<string>();
    let added = 0;
    for (const [i, item] of content.catalogItems.entries()) {
      let slug = slugify(item.title) || 'item-' + (i + 1);
      if (used.has(slug)) slug += '-' + (i + 1);
      used.add(slug);
      const res = await client.query(
        'INSERT INTO catalog_items (slug, title, category, price_label, description, image_path) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (slug) DO NOTHING',
        [slug, item.title, item.category, item.priceOrTag, item.description, item.imageUrl]
      );
      added += res.rowCount ?? 0;
    }
    console.log('${t('Schema applicato. Voci di catalogo aggiunte:', 'Esquema aplicado. Entradas de catálogo añadidas:')}', added);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('${t('db:init non riuscito', 'db:init fallido')}:', (err as Error).message);
  process.exit(1);
});
`;
}

export const databasePostgres: GeneratorModule = {
  id: 'database-postgres',
  enabled: hasDatabase,
  dependencies: {
    pg: '^8.13.1',
  },
  devDependencies: {
    '@types/pg': '^8.11.10',
  },
  // sostituisce gli script dello scheletro: si ripetono quelli di Express e si aggiunge db:init
  scripts: {
    ...backendExpress.scripts,
    'db:init': 'tsx server/dbInit.ts',
  },
  envExample: ({ isIt }) =>
    `\n# ${isIt ? 'Stringa di connessione PostgreSQL (es. Neon, con ?sslmode=require)' : 'Cadena de conexión PostgreSQL (p. ej. Neon, con ?sslmode=require)'}\nDATABASE_URL="postgresql://${isIt ? 'utente:password' : 'usuario:clave'}@localhost:5432/${isIt ? 'mio_db' : 'mi_bd'}"\n`,
  readme: ({ isIt }) =>
    isIt
      ? `
## Database PostgreSQL

Il server salva i messaggi del modulo di contatto in \`contact_submissions\` ed espone \`GET /api/catalog\`, un endpoint d’esempio che legge \`catalog_items\`. Il sito non usa ancora \`/api/catalog\`: mostra il catalogo di \`src/data/siteContent.json\`; l’endpoint serve da modello per le tue query. Finché \`DATABASE_URL\` non è impostata le due rotte rispondono **503** e il modulo mostra un errore: non finge di aver salvato.

1. Crea un database PostgreSQL. Per iniziare basta il piano gratuito di **Neon** (https://neon.com: 1 GB per progetto e 100 ore di calcolo al mese; i limiti possono cambiare). Copia la stringa di connessione, che termina con \`?sslmode=require\`.
2. Copia \`.env.example\` in \`.env\` e incolla la stringa in \`DATABASE_URL\`. Sull’hosting aggiungila nelle variabili d’ambiente: è un segreto, non va nel codice né su GitHub.
3. Esegui \`npm run db:init\`: applica \`db/schema.sql\` e carica il catalogo del sito. Si può ripetere senza duplicare nulla.
4. Avvia il server e invia un messaggio dal modulo: lo trovi nella tabella \`contact_submissions\` (dal pannello SQL di Neon o con \`psql\`).

Non inclusi: migrazioni versionate, accesso in lettura ai messaggi dal sito e limite di richieste sulle rotte.
`
      : `
## Base de datos PostgreSQL

El servidor guarda los mensajes del formulario de contacto en \`contact_submissions\` y expone \`GET /api/catalog\`, un endpoint de ejemplo que lee \`catalog_items\`. El sitio aún no usa \`/api/catalog\`: muestra el catálogo de \`src/data/siteContent.json\`; el endpoint sirve de modelo para tus consultas. Mientras \`DATABASE_URL\` no esté definida las dos rutas responden **503** y el formulario muestra un error: no finge haber guardado.

1. Crea una base de datos PostgreSQL. Para empezar basta el plan gratuito de **Neon** (https://neon.com: 1 GB por proyecto y 100 horas de cómputo al mes; los límites pueden cambiar). Copia la cadena de conexión, que termina en \`?sslmode=require\`.
2. Copia \`.env.example\` a \`.env\` y pega la cadena en \`DATABASE_URL\`. En el hosting añádela en las variables de entorno: es un secreto, no va en el código ni en GitHub.
3. Ejecuta \`npm run db:init\`: aplica \`db/schema.sql\` y carga el catálogo del sitio. Se puede repetir sin duplicar nada.
4. Arranca el servidor y envía un mensaje desde el formulario: lo verás en la tabla \`contact_submissions\` (desde el panel SQL de Neon o con \`psql\`).

No incluidos: migraciones versionadas, lectura de los mensajes desde el sitio y límite de peticiones en las rutas.
`,
  files: (ctx) => {
    const { isIt, content, answers } = ctx;
    return [
      {
        path: 'db/schema.sql',
        language: 'sql',
        description: isIt
          ? 'Schema SQL iniziale per contatti, catalogo e utenti.'
          : 'Esquema SQL inicial para contactos, catálogo y usuarios.',
        content: `-- ${isIt ? 'Schema relazionale generato per' : 'Esquema relacional generado para'} ${content.brandName}
-- ${isIt ? 'Compatibile con PostgreSQL 15+' : 'Compatible con PostgreSQL 15+'}

CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS catalog_items (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(120) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(120) NOT NULL,
  price_label VARCHAR(80),
  description TEXT,
  image_path TEXT,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
${
  answers.integrations.includes('auth')
    ? `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(40) NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`
    : ''
}`,
      },
      {
        path: 'server/db.ts',
        language: 'typescript',
        description: isIt
          ? 'Connessione PostgreSQL: salva i contatti e legge il catalogo.'
          : 'Conexión PostgreSQL: guarda los contactos y lee el catálogo.',
        content: dbSource(ctx),
      },
      {
        path: 'server/dbInit.ts',
        language: 'typescript',
        description: isIt
          ? 'Script npm run db:init: applica lo schema e carica il catalogo.'
          : 'Script npm run db:init: aplica el esquema y carga el catálogo.',
        content: dbInitSource(ctx),
      },
    ];
  },
};
