/**
 * Innesto pagamenti con Stripe, sui piani della sezione "Piani".
 *
 *  - Sito statico: ogni piano può avere un **Payment Link** di Stripe (si crea nella
 *    dashboard, senza codice). Il link va in siteConfig.json → payments.links.<piano>.
 *    Un piano senza link continua a portare al modulo di contatto.
 *  - Sito con server: POST /api/checkout crea una sessione di **Stripe Checkout**
 *    con il price ID del piano (siteConfig.json → payments.prices.<piano>) e
 *    restituisce l'URL dove mandare il cliente. Usa `fetch` verso l'API REST di
 *    Stripe: nessuna dipendenza. La chiave segreta arriva solo da STRIPE_SECRET_KEY.
 *
 * Costo: Stripe non ha canone ma trattiene una commissione su ogni transazione.
 * Non si generano webhook: la conferma e la ricevuta le gestisce Stripe.
 */
import { GenContext, GeneratorModule } from '../types';

export const hasPayments = (ctx: GenContext) => ctx.payments;
const serverPayments = (ctx: GenContext) => ctx.payments && ctx.hasBackend;

/** Variabili d'ambiente del checkout (le legge astro:env sui siti Astro). */
export const PAYMENT_ENV_VARS = ['STRIPE_SECRET_KEY', 'SITE_URL'];

/** Creazione della sessione di Checkout: file condiviso da Express e dagli endpoint Astro. */
export function stripeCheckoutSource({ isIt }: GenContext): string {
  const t = (it: string, es: string) => (isIt ? it : es);
  return `export type PlanPrices = Record<string, { priceId: string; mode: string }>;

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; reason: 'unconfigured' | 'unknown-plan' | 'failed' };

/**
 * ${t('Crea una sessione di Stripe Checkout per un piano. Solo i piani con price ID in', 'Crea una sesión de Stripe Checkout para un plan. Solo los planes con price ID en')}
 * ${t('siteConfig.json possono essere acquistati: il cliente non sceglie mai il prezzo.', 'siteConfig.json se pueden comprar: el cliente nunca elige el precio.')}
 */
export async function createCheckoutSession(
  secretKey: string | undefined,
  prices: PlanPrices,
  planId: unknown,
  siteUrl: string
): Promise<CheckoutResult> {
  if (!secretKey) return { ok: false, reason: 'unconfigured' };
  const plan = typeof planId === 'string' && Object.hasOwn(prices, planId) ? prices[planId] : undefined;
  if (!plan?.priceId) return { ok: false, reason: 'unknown-plan' };

  const body = new URLSearchParams({
    mode: plan.mode === 'subscription' ? 'subscription' : 'payment',
    'line_items[0][price]': plan.priceId,
    'line_items[0][quantity]': '1',
    success_url: \`\${siteUrl}/?checkout=success\`,
    cancel_url: \`\${siteUrl}/#pricing\`,
  });
  try {
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: \`Bearer \${secretKey}\`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const data = (await res.json().catch(() => null)) as { url?: string } | null;
    return res.ok && data?.url ? { ok: true, url: data.url } : { ok: false, reason: 'failed' };
  } catch {
    return { ok: false, reason: 'failed' };
  }
}
`;
}

const envLines = ({ isIt }: GenContext) => `
# ${isIt ? 'Pagamenti con Stripe (https://dashboard.stripe.com/apikeys): usa sk_test_… per provare' : 'Pagos con Stripe (https://dashboard.stripe.com/apikeys): usa sk_test_… para probar'}
STRIPE_SECRET_KEY=
# ${isIt ? 'URL pubblico del sito (es. https://tuodominio.com). Vuoto = si ricava dalla richiesta' : 'URL pública del sitio (p. ej. https://tudominio.com). Vacío = se deduce de la petición'}
SITE_URL=
`;

const commission = (isIt: boolean) =>
  isIt
    ? 'Stripe non ha canone ma trattiene una **commissione su ogni transazione** (vedi https://stripe.com/pricing).'
    : 'Stripe no tiene cuota fija pero retiene una **comisión por cada transacción** (ver https://stripe.com/pricing).';

export const paymentsStaticLinks: GeneratorModule = {
  id: 'payments-links',
  enabled: (ctx) => hasPayments(ctx) && !ctx.hasBackend,
  readme: ({ isIt }) =>
    isIt
      ? `
## Pagamenti (Stripe Payment Links)

I piani possono avere un pulsante di pagamento senza server né codice. ${commission(true)}

1. Nella dashboard di Stripe crea un **prodotto** con il suo prezzo e poi un **Payment Link** (Prodotti → Payment Links). Usa prima la modalità di prova.
2. Copia l’URL (\`https://buy.stripe.com/...\`) e incollalo in \`src/data/siteConfig.json\`, in \`payments.links\`, nel campo del piano corrispondente.
3. Pubblica di nuovo il sito. Un piano con il link vuoto continua a portare al modulo di contatto (utile per i piani “su misura”).

I Payment Link sono pubblici per costruzione. Pagamenti, ricevute ed email al cliente li gestisce Stripe: non c’è nessun codice di ordini da mantenere.
`
      : `
## Pagos (Stripe Payment Links)

Los planes pueden tener un botón de pago sin servidor ni código. ${commission(false)}

1. En el panel de Stripe crea un **producto** con su precio y luego un **Payment Link** (Productos → Payment Links). Usa primero el modo de prueba.
2. Copia la URL (\`https://buy.stripe.com/...\`) y pégala en \`src/data/siteConfig.json\`, en \`payments.links\`, en el campo del plan correspondiente.
3. Vuelve a publicar el sitio. Un plan con el enlace vacío sigue llevando al formulario de contacto (útil para planes «a medida»).

Los Payment Links son públicos por diseño. Cobros, recibos y correos al cliente los gestiona Stripe: no hay código de pedidos que mantener.
`,
};

const checkoutReadme = ({ isIt }: GenContext) =>
  isIt
    ? `
## Pagamenti (Stripe Checkout)

Il pulsante di ogni piano chiama \`POST /api/checkout\`, che crea una sessione di Stripe Checkout e porta il cliente alla pagina di pagamento di Stripe. ${commission(true)}

1. Nella dashboard di Stripe crea un prodotto e un **prezzo** per ogni piano (modalità di prova per cominciare) e copia il **price ID** (\`price_...\`).
2. Incollalo in \`src/data/siteConfig.json\`, in \`payments.prices\`, nel campo \`priceId\` del piano. Per i prezzi ricorrenti imposta anche \`"mode": "subscription"\`. Un piano senza price ID continua a portare al modulo di contatto.
3. Imposta \`STRIPE_SECRET_KEY\` (chiave segreta, \`sk_test_…\` per provare) nelle variabili d’ambiente: in locale in \`.env\`, sull’hosting nelle sue impostazioni. Facoltativa \`SITE_URL\`, l’indirizzo pubblico del sito.

Finché la chiave manca, \`/api/checkout\` risponde **503**. Il cliente sceglie solo il piano: prezzo e importo arrivano sempre dal server.

**Non incluso:** webhook e gestione degli ordini. Stripe invia ricevute e mostra i pagamenti nella dashboard; se ti serve automatizzare altro (consegna, accessi) va aggiunto a parte.
`
    : `
## Pagos (Stripe Checkout)

El botón de cada plan llama a \`POST /api/checkout\`, que crea una sesión de Stripe Checkout y lleva al cliente a la página de pago de Stripe. ${commission(false)}

1. En el panel de Stripe crea un producto y un **precio** por cada plan (empieza en modo de prueba) y copia el **price ID** (\`price_...\`).
2. Pégalo en \`src/data/siteConfig.json\`, en \`payments.prices\`, en el campo \`priceId\` del plan. Para precios recurrentes pon también \`"mode": "subscription"\`. Un plan sin price ID sigue llevando al formulario de contacto.
3. Define \`STRIPE_SECRET_KEY\` (clave secreta, \`sk_test_…\` para probar) en las variables de entorno: en local en \`.env\`, en el hosting en sus ajustes. Opcional \`SITE_URL\`, la dirección pública del sitio.

Mientras falte la clave, \`/api/checkout\` responde **503**. El cliente solo elige el plan: el precio y el importe siempre vienen del servidor.

**No incluido:** webhooks y gestión de pedidos. Stripe envía los recibos y muestra los cobros en su panel; si necesitas automatizar algo más (entrega, accesos) hay que añadirlo aparte.
`;

export const paymentsExpress: GeneratorModule = {
  id: 'payments-express',
  enabled: (ctx) => serverPayments(ctx) && ctx.skeleton === 'vite-react',
  envExample: envLines,
  readme: checkoutReadme,
  files: (ctx) => [
    {
      path: 'server/stripeCheckout.ts',
      language: 'typescript',
      description: ctx.isIt
        ? 'Crea la sessione di Stripe Checkout per un piano (API REST, senza dipendenze).'
        : 'Crea la sesión de Stripe Checkout para un plan (API REST, sin dependencias).',
      content: stripeCheckoutSource(ctx),
    },
  ],
};

export const paymentsAstro: GeneratorModule = {
  id: 'payments-astro',
  enabled: (ctx) => serverPayments(ctx) && ctx.skeleton === 'astro',
  astroEnv: PAYMENT_ENV_VARS,
  envExample: envLines,
  readme: checkoutReadme,
  files: (ctx) => {
    const { isIt } = ctx;
    return [
      {
        path: 'src/lib/stripeCheckout.ts',
        language: 'typescript',
        description: isIt
          ? 'Crea la sessione di Stripe Checkout per un piano (API REST, senza dipendenze).'
          : 'Crea la sesión de Stripe Checkout para un plan (API REST, sin dependencias).',
        content: stripeCheckoutSource(ctx),
      },
      {
        path: 'src/pages/api/checkout.ts',
        language: 'typescript',
        description: isIt
          ? 'Endpoint server: avvia il pagamento di un piano con Stripe Checkout.'
          : 'Endpoint de servidor: inicia el pago de un plan con Stripe Checkout.',
        content: `import type { APIRoute } from 'astro';
import { SITE_URL, STRIPE_SECRET_KEY } from 'astro:env/server';
import config from '../../data/siteConfig.json';
import { createCheckoutSession, type PlanPrices } from '../../lib/stripeCheckout';

// ${isIt ? 'Eseguito sul server a ogni richiesta (non generato in build).' : 'Se ejecuta en el servidor en cada petición (no se genera al compilar).'}
export const prerender = false;

const prices = ((config as { payments?: { prices?: PlanPrices } }).payments?.prices ?? {}) as PlanPrices;

export const POST: APIRoute = async ({ request }) => {
  const body = (await request.json().catch(() => null)) as { planId?: unknown } | null;
  const siteUrl = (SITE_URL || new URL(request.url).origin).replace(/\\/$/, '');
  const result = await createCheckoutSession(STRIPE_SECRET_KEY, prices, body?.planId, siteUrl);
  if (result.ok) return Response.json({ url: result.url });
  if (result.reason === 'unconfigured') {
    return Response.json({ error: '${isIt ? 'Pagamenti non configurati (vedi README).' : 'Pagos no configurados (ver README).'}' }, { status: 503 });
  }
  if (result.reason === 'unknown-plan') {
    return Response.json({ error: '${isIt ? 'Piano non acquistabile.' : 'Plan no disponible para compra.'}' }, { status: 400 });
  }
  return Response.json({ error: '${isIt ? 'Stripe non ha creato la sessione di pagamento.' : 'Stripe no creó la sesión de pago.'}' }, { status: 502 });
};
`,
      },
    ];
  },
};
