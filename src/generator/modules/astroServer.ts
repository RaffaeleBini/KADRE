/**
 * Innesti per i siti Astro con server (stack astro-hybrid):
 *  - astroEndpoints: /api/contact e /api/health, uguali su ogni piattaforma;
 *  - un adapter per piattaforma, che decide DOVE girano gli endpoint
 *    (funzione Vercel/Netlify, Worker Cloudflare o processo Node).
 * La pagina resta HTML prerenderizzato: solo i file con `prerender = false`
 * vengono eseguiti sul server.
 */
import { DeployPlatform } from '../../types/builder';
import { GenContext, GeneratorModule } from '../types';
import { CONTACT_ENV_VARS, hasContactForm } from './contactForm';

const astroWithServer = (ctx: GenContext) => ctx.skeleton === 'astro' && ctx.hasBackend;
const onPlatform = (platform: DeployPlatform) => (ctx: GenContext) =>
  astroWithServer(ctx) && ctx.github.deployPlatform === platform;

/** Script comuni dei progetti Astro (gli innesti che li sostituiscono partono da qui). */
const ASTRO_SCRIPTS = {
  dev: 'astro dev',
  build: 'astro build',
  preview: 'astro preview',
  check: 'astro check',
};

export const astroEndpoints: GeneratorModule = {
  id: 'astro-endpoints',
  enabled: astroWithServer,
  files: (ctx) => {
    const { isIt } = ctx;
    const realEmail = hasContactForm(ctx);
    const contactEndpoint = realEmail
      ? `import type { APIRoute } from 'astro';
import { ${CONTACT_ENV_VARS.join(', ')} } from 'astro:env/server';
import { parseContact, sendContactEmail } from '../../lib/contactEmail';

// ${isIt ? 'Eseguito sul server a ogni richiesta (non generato in build).' : 'Se ejecuta en el servidor en cada petición (no se genera al compilar).'}
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const parsed = parseContact(await request.json().catch(() => null));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  // ${isIt ? 'Campo trappola riempito: si risponde "ok" senza inviare nulla.' : 'Campo trampa relleno: se responde "ok" sin enviar nada.'}
  if (parsed.spam) return Response.json({ received: true }, { status: 201 });
  const result = await sendContactEmail({ ${CONTACT_ENV_VARS.join(', ')} }, parsed.data);
  if (result === 'unconfigured') {
    return Response.json({ error: '${isIt ? 'Invio email non configurato (vedi README).' : 'Envío de correo no configurado (ver README).'}' }, { status: 503 });
  }
  if (result === 'failed') {
    return Response.json({ error: '${isIt ? 'Il servizio email non ha accettato il messaggio.' : 'El servicio de correo no aceptó el mensaje.'}' }, { status: 502 });
  }
  return Response.json({ received: true }, { status: 201 });
};
`
      : null;
    return [
    {
      path: 'src/pages/api/contact.ts',
      language: 'typescript',
      description: isIt
        ? 'Endpoint server: riceve e valida il modulo di contatto.'
        : 'Endpoint de servidor: recibe y valida el formulario de contacto.',
      content: contactEndpoint ?? `import type { APIRoute } from 'astro';

// ${isIt ? 'Eseguito sul server a ogni richiesta (non generato in build).' : 'Se ejecuta en el servidor en cada petición (no se genera al compilar).'}
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  if (!name || !email) {
    return Response.json({ error: '${isIt ? 'Nome ed email sono obbligatori.' : 'Nombre y correo son obligatorios.'}' }, { status: 400 });
  }
  const message = typeof body?.message === 'string' ? body.message : '';
  // ${isIt ? 'Qui si collega l’invio reale (email, CRM…). Per ora il messaggio resta nei log.' : 'Aquí se conecta el envío real (email, CRM…). Por ahora el mensaje queda en los logs.'}
  console.info('[${isIt ? 'Contatto ricevuto' : 'Contacto recibido'}]', { name, email, length: message.length });
  return Response.json({ received: true }, { status: 201 });
};
`,
    },
    {
      path: 'src/pages/api/health.ts',
      language: 'typescript',
      description: isIt
        ? 'Endpoint di controllo: risponde se il server è attivo.'
        : 'Endpoint de control: responde si el servidor está activo.',
      content: `import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = () => Response.json({ ok: true, timestamp: new Date().toISOString() });
`,
    },
    ];
  },
};

export const astroAdapterVercel: GeneratorModule = {
  id: 'astro-adapter-vercel',
  enabled: onPlatform('vercel'),
  dependencies: { '@astrojs/vercel': '^11.0.0' },
  astroAdapter: { importLine: "import vercel from '@astrojs/vercel';", call: 'vercel()' },
  gitignore: ['.vercel'],
};

export const astroAdapterNetlify: GeneratorModule = {
  id: 'astro-adapter-netlify',
  enabled: onPlatform('netlify'),
  dependencies: { '@astrojs/netlify': '^8.2.0' },
  astroAdapter: { importLine: "import netlify from '@astrojs/netlify';", call: 'netlify()' },
  gitignore: ['.netlify'],
};

export const astroAdapterCloudflare: GeneratorModule = {
  id: 'astro-adapter-cloudflare',
  enabled: onPlatform('cloudflare'),
  dependencies: { '@astrojs/cloudflare': '^14.4.0' },
  // wrangler: compila e pubblica il Worker (peer dependency dell'adapter)
  devDependencies: { wrangler: '^4.125.0' },
  scripts: { ...ASTRO_SCRIPTS, deploy: 'astro build && wrangler deploy' },
  astroAdapter: { importLine: "import cloudflare from '@astrojs/cloudflare';", call: 'cloudflare()' },
  gitignore: ['.wrangler'],
};

export const astroAdapterNode: GeneratorModule = {
  id: 'astro-adapter-node',
  enabled: onPlatform('node-server'),
  dependencies: { '@astrojs/node': '^11.1.0' },
  // HOST=0.0.0.0: in un hosting il server deve accettare connessioni dall'esterno;
  // la porta arriva dalla variabile PORT impostata dal provider
  scripts: { ...ASTRO_SCRIPTS, start: 'HOST=0.0.0.0 node ./dist/server/entry.mjs' },
  astroAdapter: { importLine: "import node from '@astrojs/node';", call: "node({ mode: 'standalone' })" },
};
