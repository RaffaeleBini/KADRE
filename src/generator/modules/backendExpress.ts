import { GeneratorModule } from '../types';
import { hasContactForm } from './contactForm';

/** Server Express con /api/contact e servizio della build in produzione. */
export const backendExpress: GeneratorModule = {
  id: 'backend-express',
  enabled: (ctx) => ctx.hasBackend && ctx.skeleton === 'vite-react',
  dependencies: {
    express: '^4.21.2',
    dotenv: '^17.2.3',
    // `npm start` esegue il server con tsx: deve esserci anche in produzione
    tsx: '^4.19.3',
  },
  devDependencies: {
    '@types/express': '^4.17.21',
    '@types/node': '^22.14.0',
  },
  scripts: {
    dev: 'tsx server/index.ts',
    build: 'vite build',
    start: 'NODE_ENV=production tsx server/index.ts',
  },
  tsInclude: ['server'],
  files: (ctx) => {
    const { isIt } = ctx;
    const realEmail = hasContactForm(ctx);
    const checkout = ctx.payments;
    // este módulo solo está activo con el esqueleto Vite, así que hasDatabase = stack Express + PostgreSQL
    const db = ctx.hasDatabase;
    const contactRoute = realEmail && db
      ? `app.post('/api/contact', async (req, res) => {
  const parsed = parseContact(req.body);
  if (!parsed.ok) return res.status(400).json({ error: parsed.error });
  // ${isIt ? 'Campo trappola riempito: si risponde "ok" senza salvare né inviare nulla.' : 'Campo trampa relleno: se responde "ok" sin guardar ni enviar nada.'}
  if (parsed.spam) return res.status(201).json({ received: true });
  // ${isIt ? 'Si salva nel database e si invia l’email: basta che una delle due vada a buon fine.' : 'Se guarda en la base de datos y se envía el correo: basta con que una de las dos funcione.'}
  const [saved, sent] = await Promise.all([saveContact(process.env, parsed.data), sendContactEmail(process.env, parsed.data)]);
  if (saved === 'saved' || sent === 'sent') {
    if (saved === 'failed' || sent === 'failed') console.warn('[${isIt ? 'Contatto' : 'Contacto'}] ${isIt ? 'una delle due destinazioni è fallita' : 'uno de los dos destinos falló'}', { saved, sent });
    return res.status(201).json({ received: true });
  }
  if (saved === 'unconfigured' && sent === 'unconfigured') {
    return res.status(503).json({ error: '${isIt ? 'Né database né email sono configurati (vedi README).' : 'Ni la base de datos ni el correo están configurados (ver README).'}' });
  }
  return res.status(502).json({ error: '${isIt ? 'Non è stato possibile salvare né inviare il messaggio.' : 'No se pudo guardar ni enviar el mensaje.'}' });
});`
      : db
      ? `app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body ?? {};
  if (typeof name !== 'string' || typeof email !== 'string' || !name.trim() || !email.trim()) {
    return res.status(400).json({ error: '${isIt ? 'Nome ed email sono obbligatori.' : 'Nombre y correo son obligatorios.'}' });
  }
  const saved = await saveContact(process.env, {
    name: name.trim(),
    email: email.trim(),
    message: typeof message === 'string' ? message : '',
  });
  if (saved === 'unconfigured') {
    return res.status(503).json({ error: '${isIt ? 'Database non configurato (vedi README).' : 'Base de datos no configurada (ver README).'}' });
  }
  if (saved === 'failed') return res.status(502).json({ error: '${isIt ? 'Non è stato possibile salvare il messaggio.' : 'No se pudo guardar el mensaje.'}' });
  return res.status(201).json({ received: true });
});`
      : realEmail
      ? `app.post('/api/contact', async (req, res) => {
  const parsed = parseContact(req.body);
  if (!parsed.ok) return res.status(400).json({ error: parsed.error });
  // ${isIt ? 'Campo trappola riempito: si risponde "ok" senza inviare nulla.' : 'Campo trampa relleno: se responde "ok" sin enviar nada.'}
  if (parsed.spam) return res.status(201).json({ received: true });
  const result = await sendContactEmail(process.env, parsed.data);
  if (result === 'unconfigured') {
    return res.status(503).json({ error: '${isIt ? 'Invio email non configurato (vedi README).' : 'Envío de correo no configurado (ver README).'}' });
  }
  if (result === 'failed') return res.status(502).json({ error: '${isIt ? 'Il servizio email non ha accettato il messaggio.' : 'El servicio de correo no aceptó el mensaje.'}' });
  return res.status(201).json({ received: true });
});`
      : `app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body ?? {};
  if (!name || !email) {
    return res.status(400).json({ error: '${isIt ? 'Nome ed email sono obbligatori.' : 'Nombre y correo son obligatorios.'}' });
  }
  console.info('[${isIt ? 'Contatto ricevuto' : 'Contacto recibido'}]', { name, email, length: String(message || '').length });
  return res.status(201).json({ received: true });
});`;
    const catalogRoute = db
      ? `

// ${isIt ? 'Endpoint d’esempio: legge catalog_items (il sito mostra ancora il catalogo di siteContent.json).' : 'Endpoint de ejemplo: lee catalog_items (el sitio aún muestra el catálogo de siteContent.json).'}
app.get('/api/catalog', async (_req, res) => {
  const result = await listCatalog(process.env);
  if (result.ok) return res.json({ items: result.items });
  if (result.reason === 'unconfigured') {
    return res.status(503).json({ error: '${isIt ? 'Database non configurato (vedi README).' : 'Base de datos no configurada (ver README).'}' });
  }
  return res.status(502).json({ error: '${isIt ? 'Lettura del catalogo non riuscita (hai eseguito npm run db:init?).' : 'Lectura del catálogo fallida (¿has ejecutado npm run db:init?).'}' });
});`
      : '';
    const checkoutRoute = checkout
      ? `

const prices = ((config as { payments?: { prices?: PlanPrices } }).payments?.prices ?? {}) as PlanPrices;

app.post('/api/checkout', async (req, res) => {
  // ${isIt ? 'SITE_URL fissa l’indirizzo pubblico; altrimenti si ricava dalla richiesta.' : 'SITE_URL fija la dirección pública; si no, se deduce de la petición.'}
  const proto = req.get('x-forwarded-proto') ?? req.protocol;
  const siteUrl = (process.env.SITE_URL || \`\${proto}://\${req.get('host')}\`).replace(/\\/$/, '');
  const result = await createCheckoutSession(process.env.STRIPE_SECRET_KEY, prices, req.body?.planId, siteUrl);
  if (result.ok) return res.json({ url: result.url });
  if (result.reason === 'unconfigured') {
    return res.status(503).json({ error: '${isIt ? 'Pagamenti non configurati (vedi README).' : 'Pagos no configurados (ver README).'}' });
  }
  if (result.reason === 'unknown-plan') {
    return res.status(400).json({ error: '${isIt ? 'Piano non acquistabile.' : 'Plan no disponible para compra.'}' });
  }
  return res.status(502).json({ error: '${isIt ? 'Stripe non ha creato la sessione di pagamento.' : 'Stripe no creó la sesión de pago.'}' });
});`
      : '';
    return [
      {
      path: 'server/index.ts',
      language: 'typescript',
      description: isIt
        ? 'Server Express con endpoint /api/contact e servizio statico.'
        : 'Servidor Express con endpoint /api/contact y servicio de aplicación.',
      content: `import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';${checkout ? "\nimport config from '../src/data/siteConfig.json';\nimport { createCheckoutSession, type PlanPrices } from './stripeCheckout';" : ''}${realEmail ? "\nimport { parseContact, sendContactEmail } from './contactEmail';" : ''}${db ? "\nimport { listCatalog, saveContact } from './db';" : ''}${ctx.auth ? "\nimport { registerAuthRoutes } from './auth';" : ''}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

${ctx.auth ? 'registerAuthRoutes(app);\n\n' : ''}${contactRoute}${catalogRoute}${checkoutRoute}

if (process.env.NODE_ENV === 'production') {
  const distDir = path.resolve(__dirname, '../dist');
  app.use(express.static(distDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(\`${isIt ? 'Server attivo su' : 'Servidor activo en'} http://localhost:\${PORT}\`);
});
`,
      },
    ];
  },
};
