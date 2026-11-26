import { GeneratedFile } from '../../../types/builder';
import { AssembledProject, GenContext, Skeleton } from '../../types';
import { indexCssFile, pageHead, siteComponentFiles, siteDataFiles } from '../shared/siteFiles';

/**
 * Scheletro Astro statico (SSG): la pagina viene scritta come HTML completo in
 * fase di build. I componenti React del sito (gli stessi dell'anteprima di KADRE)
 * vengono pre-renderizzati e poi "idratati" nel browser per FAQ e modulo.
 */
export const astroSkeleton: Skeleton = {
  id: 'astro',
  dependencies: {
    astro: '^7.4.0',
    '@astrojs/react': '^7.1.0',
    react: '^19.0.1',
    'react-dom': '^19.0.1',
    '@tailwindcss/vite': '^4.1.0',
    tailwindcss: '^4.1.0',
  },
  devDependencies: {
    '@astrojs/check': '^0.9.12',
    '@types/react': '^19.0.0',
    '@types/react-dom': '^19.0.0',
    typescript: '^5.8.0',
  },
  scripts: {
    dev: 'astro dev',
    build: 'astro build',
    preview: 'astro preview',
    check: 'astro check',
  },
  tsInclude: [],
  files: astroFiles,
};

function astroFiles(ctx: GenContext, assembled: AssembledProject): GeneratedFile[] {
  const { isIt, locale, github, repoSlug, ghUser } = ctx;
  const head = pageHead(ctx);
  const onPages = github.deployPlatform === 'github-pages';

  // Su GitHub Pages il sito vive in https://utente.github.io/repo/: Astro deve saperlo
  const siteAndBase = onPages
    ? `\n  site: 'https://${ghUser}.github.io',\n  base: '/${repoSlug}',`
    : '';

  // Con server: l'adapter della piattaforma esegue gli endpoint con prerender = false
  const adapter = assembled.astroAdapter;
  const adapterImport = adapter ? `\n${adapter.importLine}` : '';
  const adapterLine = adapter ? `\n  adapter: ${adapter.call},` : '';

  const astroConfig = `import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';${adapterImport}

export default defineConfig({${siteAndBase}${adapterLine}
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
`;

  const tsconfigJson = JSON.stringify(
    {
      extends: 'astro/tsconfigs/strict',
      include: ['.astro/types.d.ts', '**/*'],
      exclude: ['dist'],
      compilerOptions: { jsx: 'react-jsx', jsxImportSource: 'react' },
    },
    null,
    2
  );

  // Astro agrupa estos scripts como módulos del navegador (src/pages → ../)
  const clientScripts = assembled.clientImports
    .map((m) => `\n    <script>import '.${m}';</script>`)
    .join('');

  const indexAstro = `---
import '../index.css';
import config from '../data/siteConfig.json';
import content from '../data/siteContent.json';
import { Site } from '../site/Site';
import type { SiteConfig, SiteContent } from '../site/types';

// ${isIt ? 'Il contenuto viene verificato contro SiteContent dal compilatore (npm run check).' : 'El compilador comprueba el contenido contra SiteContent (npm run check).'}
const siteContent: SiteContent = content;
const siteConfig = config as SiteConfig;
---

<!doctype html>
<html lang="${locale}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${head.title}</title>
    <meta name="description" content="${head.description}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="${head.fontsHref}" rel="stylesheet" />${clientScripts}
  </head>
  <body>
    <!-- ${isIt ? 'HTML generato in build; client:load rende interattivi FAQ e modulo.' : 'HTML generado al compilar; client:load hace interactivos las FAQ y el formulario.'} -->
    <Site client:load content={siteContent} config={siteConfig} />
  </body>
</html>
`;

  return [
    {
      path: 'package.json',
      language: 'json',
      description: isIt
        ? 'Dipendenze e script configurati per lo stack scelto.'
        : 'Dependencias y scripts configurados para el stack elegido.',
      content: assembled.packageJson,
    },
    {
      path: 'astro.config.mjs',
      language: 'typescript',
      description: isIt
        ? 'Configurazione di Astro: integrazione React, Tailwind e percorso di pubblicazione.'
        : 'Configuración de Astro: integración React, Tailwind y ruta de publicación.',
      content: astroConfig,
    },
    {
      path: 'tsconfig.json',
      language: 'json',
      description: isIt ? 'Configurazione rigorosa di TypeScript per Astro.' : 'Configuración estricta de TypeScript para Astro.',
      content: tsconfigJson,
    },
    {
      path: '.nvmrc',
      language: 'text',
      description: isIt
        ? 'Versione di Node richiesta da Astro (la leggono Netlify e Cloudflare).'
        : 'Versión de Node que requiere Astro (la leen Netlify y Cloudflare).',
      content: '24\n',
    },
    {
      path: 'src/pages/index.astro',
      language: 'html',
      description: isIt
        ? 'Pagina unica: metadati, font e componente del sito pre-renderizzato.'
        : 'Página única: metadatos, tipografías y componente del sitio prerenderizado.',
      content: indexAstro,
    },
    indexCssFile(ctx),
    ...siteDataFiles(ctx),
    ...siteComponentFiles(ctx),
  ];
}
