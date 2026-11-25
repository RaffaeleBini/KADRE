import { GeneratorModule } from '../types';

/** Schema PostgreSQL iniziale e variabile DATABASE_URL. */
export const databasePostgres: GeneratorModule = {
  id: 'database-postgres',
  enabled: (ctx) => ctx.hasDatabase,
  dependencies: {
    pg: '^8.13.1',
  },
  envExample: ({ isIt }) =>
    `# ${isIt ? 'Stringa di connessione PostgreSQL' : 'Cadena de conexión PostgreSQL'}\nDATABASE_URL="postgresql://${isIt ? 'utente:password' : 'usuario:clave'}@localhost:5432/${isIt ? 'mio_db' : 'mi_bd'}"\n`,
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
    ];
  },
};
