/**
 * Innesto analytics: Cloudflare Web Analytics.
 *
 * Perché questo provider: è gratuito, non usa cookie e funziona su QUALSIASI
 * hosting (non serve che il sito passi da Cloudflare). Vercel Analytics, invece,
 * funziona solo su Vercel e il piano gratuito è per uso non commerciale.
 *
 * Il token non è un segreto (finisce nell'HTML pubblico), quindi sta in un JSON
 * versionato e non in una variabile d'ambiente: stessa soluzione per Vite e Astro,
 * senza dipendere da come ciascuno espone le variabili al browser.
 * Finché il token è vuoto, il sito non carica nessuno script.
 */
import { GenContext, GeneratorModule } from '../types';

export const analytics: GeneratorModule = {
  id: 'analytics',
  enabled: (ctx) => ctx.answers.integrations.includes('analytics'),
  // caricato dall'entry point del browser (main.tsx per Vite, index.astro per Astro)
  clientImports: ['./analytics'],
  files: ({ isIt }: GenContext) => [
    {
      path: 'src/data/analytics.json',
      language: 'json',
      description: isIt
        ? 'Token di Cloudflare Web Analytics: incollalo qui per attivare le statistiche.'
        : 'Token de Cloudflare Web Analytics: pégalo aquí para activar las estadísticas.',
      content: JSON.stringify({ cloudflareToken: '' }, null, 2),
    },
    {
      path: 'src/analytics.ts',
      language: 'typescript',
      description: isIt
        ? 'Carica lo script di analytics solo se il token è configurato.'
        : 'Carga el script de analítica solo si el token está configurado.',
      content: `import analytics from './data/analytics.json';

// ${isIt ? 'Senza token non si carica nulla: il sito resta identico e senza tracciamento.' : 'Sin token no se carga nada: el sitio queda idéntico y sin seguimiento.'}
const token = analytics.cloudflareToken.trim();

if (token) {
  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  script.setAttribute('data-cf-beacon', JSON.stringify({ token }));
  document.head.appendChild(script);
}
`,
    },
  ],
  readme: ({ isIt }) =>
    isIt
      ? `
## Statistiche di visita (Cloudflare Web Analytics)

Il sito è predisposto per Cloudflare Web Analytics: gratuito, senza cookie e valido su qualsiasi hosting.

1. In Cloudflare apri **Analytics & Logs** → **Web Analytics** → **Add a site** (serve un account gratuito; non occorre spostare il dominio su Cloudflare).
2. Scegli l’impostazione manuale (**JS snippet**) e copia il valore \`token\` dello snippet.
3. Incollalo in \`src/data/analytics.json\`, nel campo \`cloudflareToken\`.
4. Pubblica di nuovo il sito. Finché il token è vuoto non viene caricato nessuno script.

Il token non è un segreto: compare comunque nell’HTML pubblico.
`
      : `
## Estadísticas de visitas (Cloudflare Web Analytics)

El sitio está preparado para Cloudflare Web Analytics: gratuito, sin cookies y válido en cualquier hosting.

1. En Cloudflare abre **Analytics & Logs** → **Web Analytics** → **Add a site** (hace falta una cuenta gratuita; no es necesario mover el dominio a Cloudflare).
2. Elige la configuración manual (**JS snippet**) y copia el valor \`token\` del fragmento.
3. Pégalo en \`src/data/analytics.json\`, en el campo \`cloudflareToken\`.
4. Vuelve a publicar el sitio. Mientras el token esté vacío no se carga ningún script.

El token no es un secreto: de todos modos aparece en el HTML público.
`,
};
