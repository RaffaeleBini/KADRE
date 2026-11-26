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
    const contactRoute = realEmail
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
import 'dotenv/config';${realEmail ? "\nimport { parseContact, sendContactEmail } from './contactEmail';" : ''}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

${contactRoute}

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
