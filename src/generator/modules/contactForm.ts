/**
 * Innesto "modulo di contatto con invio reale".
 *
 *  - Sito statico (nessun server proprio): il form invia a Web3Forms, un servizio
 *    esterno gratuito (250 invii/mese). La access key è pubblica per costruzione e
 *    vive in src/data/siteConfig.json (campo contactProvider.accessKey).
 *  - Sito con server (Express o Astro ibrido): /api/contact valida, scarta i bot e
 *    invia un'email con Resend (gratuito: 100/giorno, 3.000/mese). La chiave è un
 *    SEGRETO e arriva solo da variabili d'ambiente, mai dal codice.
 *
 * Senza configurazione il server risponde 503 (non finge di aver inviato).
 */
import { GenContext, GeneratorModule } from '../types';

export const hasContactForm = (ctx: GenContext) => ctx.answers.integrations.includes('contact-form');

/** Variabili d'ambiente dell'invio email (le stesse per Express e Astro). */
export const CONTACT_ENV_VARS = ['RESEND_API_KEY', 'CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL'];

/** Validazione + invio: file condiviso da server/index.ts (Express) e dagli endpoint Astro. */
function contactEmailSource({ isIt }: GenContext): string {
  const t = (it: string, es: string) => (isIt ? it : es);
  return `export interface ContactData {
  name: string;
  email: string;
  message: string;
}

export type ParsedContact =
  | { ok: false; error: string }
  | { ok: true; spam: boolean; data: ContactData };

const EMAIL = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

const clean = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

/** ${t('Valida il corpo della richiesta. Un campo "botcheck" pieno indica un bot.', 'Valida el cuerpo de la petición. Un campo "botcheck" relleno indica un bot.')} */
export function parseContact(body: unknown): ParsedContact {
  const b = (body ?? {}) as Record<string, unknown>;
  const name = clean(b.name, 120);
  const email = clean(b.email, 200);
  const message = clean(b.message, 5000);
  if (!name || !email) return { ok: false, error: '${t('Nome ed email sono obbligatori.', 'Nombre y correo son obligatorios.')}' };
  if (!EMAIL.test(email)) return { ok: false, error: '${t('Email non valida.', 'Correo no válido.')}' };
  return { ok: true, spam: clean(b.botcheck, 10) !== '', data: { name, email, message } };
}

export type SendResult = 'sent' | 'unconfigured' | 'failed';

/** ${t('Invia il messaggio con Resend. La chiave arriva solo da variabili d’ambiente.', 'Envía el mensaje con Resend. La clave llega solo desde variables de entorno.')} */
export async function sendContactEmail(
  env: Record<string, string | undefined>,
  data: ContactData
): Promise<SendResult> {
  const apiKey = env.RESEND_API_KEY;
  const to = env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return 'unconfigured';

  // ${t('onboarding@resend.dev è il mittente di prova di Resend: consegna solo al proprietario dell’account.', 'onboarding@resend.dev es el remitente de prueba de Resend: solo entrega al propietario de la cuenta.')}
  const from = env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';
  const oneLine = (s: string) => s.replace(/[\\r\\n]+/g, ' ');
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: \`Bearer \${apiKey}\`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: \`${t('Nuovo messaggio da', 'Nuevo mensaje de')} \${oneLine(data.name)}\`,
        text: \`${t('Nome', 'Nombre')}: \${oneLine(data.name)}\\nEmail: \${data.email}\\n\\n\${data.message}\`,
      }),
    });
    return res.ok ? 'sent' : 'failed';
  } catch {
    return 'failed';
  }
}
`;
}

const envLines = ({ isIt }: GenContext) => `
# ${isIt ? 'Invio del modulo di contatto con Resend (https://resend.com)' : 'Envío del formulario de contacto con Resend (https://resend.com)'}
RESEND_API_KEY=
CONTACT_TO_EMAIL=
# ${isIt ? 'Mittente: con dominio verificato su Resend; vuoto = onboarding@resend.dev (solo prova)' : 'Remitente: con dominio verificado en Resend; vacío = onboarding@resend.dev (solo prueba)'}
CONTACT_FROM_EMAIL=
`;

const serverReadme = ({ isIt }: GenContext) =>
  isIt
    ? `
## Invio del modulo di contatto (Resend)

\`/api/contact\` invia un’email a ogni messaggio ricevuto. Finché non è configurato risponde **503** e il sito mostra un errore: non finge di aver inviato.

1. Crea un account gratuito su https://resend.com (100 email al giorno, 3.000 al mese) e genera una **API key**.
2. Imposta le variabili \`RESEND_API_KEY\` (segreta) e \`CONTACT_TO_EMAIL\` (dove vuoi ricevere i messaggi). In locale copia \`.env.example\` in \`.env\`; sull’hosting aggiungile nelle impostazioni delle variabili d’ambiente.
3. Per provare basta il mittente di prova \`onboarding@resend.dev\`, che però consegna **solo all’email del tuo account Resend**. Per ricevere messaggi su un altro indirizzo verifica un dominio su Resend e imposta \`CONTACT_FROM_EMAIL\` (es. \`web@tuodominio.com\`).

La chiave non è mai nel codice né nel browser: legge solo il server.
`
    : `
## Envío del formulario de contacto (Resend)

\`/api/contact\` envía un correo por cada mensaje recibido. Mientras no esté configurado responde **503** y el sitio muestra un error: no finge haber enviado.

1. Crea una cuenta gratuita en https://resend.com (100 correos al día, 3.000 al mes) y genera una **API key**.
2. Define las variables \`RESEND_API_KEY\` (secreta) y \`CONTACT_TO_EMAIL\` (donde quieres recibir los mensajes). En local copia \`.env.example\` a \`.env\`; en el hosting añádelas en los ajustes de variables de entorno.
3. Para probar basta el remitente de prueba \`onboarding@resend.dev\`, que solo entrega **al correo de tu cuenta de Resend**. Para recibir en otra dirección verifica un dominio en Resend y define \`CONTACT_FROM_EMAIL\` (p. ej. \`web@tudominio.com\`).

La clave nunca está en el código ni en el navegador: solo la lee el servidor.
`;

export const contactEmailExpress: GeneratorModule = {
  id: 'contact-email-express',
  enabled: (ctx) => hasContactForm(ctx) && ctx.hasBackend && ctx.skeleton === 'vite-react',
  envExample: envLines,
  readme: serverReadme,
  files: (ctx) => [
    {
      path: 'server/contactEmail.ts',
      language: 'typescript',
      description: ctx.isIt
        ? 'Validazione del modulo di contatto e invio email con Resend.'
        : 'Validación del formulario de contacto y envío de correo con Resend.',
      content: contactEmailSource(ctx),
    },
  ],
};

export const contactEmailAstro: GeneratorModule = {
  id: 'contact-email-astro',
  enabled: (ctx) => hasContactForm(ctx) && ctx.hasBackend && ctx.skeleton === 'astro',
  // astro:env legge i segreti a runtime su qualunque adapter (Node, Vercel, Netlify, Workers)
  astroEnv: CONTACT_ENV_VARS,
  envExample: envLines,
  readme: serverReadme,
  files: (ctx) => [
    {
      path: 'src/lib/contactEmail.ts',
      language: 'typescript',
      description: ctx.isIt
        ? 'Validazione del modulo di contatto e invio email con Resend.'
        : 'Validación del formulario de contacto y envío de correo con Resend.',
      content: contactEmailSource(ctx),
    },
  ],
};

export const contactWeb3forms: GeneratorModule = {
  id: 'contact-web3forms',
  enabled: (ctx) => hasContactForm(ctx) && !ctx.hasBackend,
  readme: ({ isIt }) =>
    isIt
      ? `
## Invio del modulo di contatto (Web3Forms)

Il sito è statico e non ha un server: il modulo invia a **Web3Forms**, un servizio gratuito (250 messaggi al mese) che ti inoltra ogni messaggio per email. Finché la chiave è vuota il modulo mostra un errore invece di fingere di inviare.

1. Su https://web3forms.com inserisci la tua email e ricevi una **access key**.
2. Incollala in \`src/data/siteConfig.json\`, nel campo \`contactProvider.accessKey\`.
3. Pubblica di nuovo il sito e prova il modulo.

La access key è pubblica per costruzione (compare nel browser): serve solo a indicare a quale email recapitare i messaggi. Un campo nascosto e il filtro anti-bot del servizio riducono lo spam.
`
      : `
## Envío del formulario de contacto (Web3Forms)

El sitio es estático y no tiene servidor: el formulario envía a **Web3Forms**, un servicio gratuito (250 mensajes al mes) que te reenvía cada mensaje por correo. Mientras la clave esté vacía el formulario muestra un error en lugar de fingir que envía.

1. En https://web3forms.com introduce tu correo y recibe una **access key**.
2. Pégala en \`src/data/siteConfig.json\`, en el campo \`contactProvider.accessKey\`.
3. Vuelve a publicar el sitio y prueba el formulario.

La access key es pública por diseño (aparece en el navegador): solo indica a qué correo entregar los mensajes. Un campo oculto y el filtro antibots del servicio reducen el spam.
`,
};
