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

  // Segreti del servidor (p. ej. la clave de Resend): astro:env los lee en runtime en cualquier adapter
  const envSchema = assembled.astroEnv.length
    ? `\n  env: {\n    schema: {\n${assembled.astroEnv
        .map((v) => `      ${v}: envField.string({ context: 'server', access: 'secret', optional: true }),`)
        .join('\n')}\n    },\n  },`
    : '';

  // Sitio en dos idiomas: el enrutado nativo de Astro (/ para el principal, /<otro>/ para el segundo)
  const i18nConfig = ctx.i18n
    ? `\n  i18n: {\n    defaultLocale: '${locale}',\n    locales: ['${locale}', '${ctx.altLocale}'],\n    routing: { prefixDefaultLocale: false },\n  },`
    : '';

  const astroConfig = `import { defineConfig${assembled.astroEnv.length ? ', envField' : ''} } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';${adapterImport}

export default defineConfig({${siteAndBase}${adapterLine}${envSchema}${i18nConfig}
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

  // Con Markdown, las FAQ salen de src/content/faqs/*.md (Astro las convierte a HTML al compilar)
  const markdownImport = ctx.markdown ? "\nimport { getCollection } from 'astro:content';" : '';
  const siteContentDecl = ctx.markdown
    ? `// ${isIt ? 'Le FAQ stanno in src/content/faqs/*.md, ordinate per nome del file.' : 'Las FAQ están en src/content/faqs/*.md, ordenadas por nombre de archivo.'}
const faqEntries = (await getCollection('faqs')).sort((a, b) => a.id.localeCompare(b.id));
const siteContent: SiteContent = {
  ...content,
  faqs: faqEntries.map((entry) => ({
    id: entry.id,
    question: entry.data.question,
    answer: entry.body ?? '',
    answerHtml: entry.rendered?.html,
  })),
};`
    : 'const siteContent: SiteContent = content;';

  /**
   * Página del sitio. Con dos idiomas se genera dos veces con el mismo modelo: la principal en
   * src/pages/index.astro y la segunda en src/pages/<otro>/index.astro (una carpeta más abajo).
   */
  const pageSource = (variant: 'main' | 'alt'): string => {
    const alt = variant === 'alt';
    const up = alt ? '../../' : '../';
    const pageLang = alt ? ctx.altLocale : locale;
    const scripts = assembled.clientImports.map((m) => `\n    <script>import '${alt ? '../.' : '.'}${m}';</script>`).join('');

    let extraImports = markdownImport;
    let body = `// ${isIt ? 'Il contenuto viene verificato contro SiteContent dal compilatore (npm run check).' : 'El compilador comprueba el contenido contra SiteContent (npm run check).'}
${siteContentDecl}
const siteConfig = config as SiteConfig;`;
    let contentFile = 'siteContent.json';
    let titleTag = `<title>${head.title}</title>
    <meta name="description" content="${head.description}" />`;

    if (ctx.i18n) {
      const alt2 = ctx.altLocale;
      const languages = [locale, alt2]
        .map((code) => `  { code: '${code}', label: '${code.toUpperCase()}', href: getRelativeLocaleUrl('${code}'), current: ${code === pageLang} },`)
        .join('\n');
      contentFile = alt ? `siteContent.${alt2}.json` : 'siteContent.json';
      extraImports = `${alt ? `\nimport ui from '${up}data/siteUi.${alt2}.json';` : ''}\nimport { getRelativeLocaleUrl } from 'astro:i18n';`;
      body = `// ${isIt ? 'Il compilatore verifica il contenuto contro SiteContent (npm run check).' : 'El compilador comprueba el contenido contra SiteContent (npm run check).'}
// ${isIt ? 'Selettore di lingua: getRelativeLocaleUrl tiene conto di base (GitHub Pages).' : 'Selector de idioma: getRelativeLocaleUrl tiene en cuenta base (GitHub Pages).'}
const languages = [
${languages}
];
${
  alt
    ? `// ${isIt ? 'Le immagini stanno in public/assets/: da /' + alt2 + '/ il percorso relativo ./assets/ non funziona e si riscrive con la base del sito.' : 'Las imágenes están en public/assets/: desde /' + alt2 + '/ la ruta relativa ./assets/ no sirve y se reescribe con la base del sitio.'}
const assets = import.meta.env.BASE_URL.replace(/\\/$/, '') + '/assets/';
const siteContent = JSON.parse(JSON.stringify(content).replaceAll('./assets/', assets)) as SiteContent;
const siteConfig: SiteConfig = { ...(config as SiteConfig), ui: ui as SiteUi, languages };`
    : `const siteContent: SiteContent = content;
const siteConfig: SiteConfig = { ...(config as SiteConfig), languages };`
}
// ${isIt ? 'Titolo e descrizione seguono il contenuto di ogni lingua.' : 'El título y la descripción siguen el contenido de cada idioma.'}
const title = siteContent.brandName + ' — ' + siteContent.tagline;
const description = siteContent.heroSubheadline;`;
      titleTag = `<title>{title}</title>
    <meta name="description" content={description} />`;
    }

    return `---
import '${up}index.css';
import config from '${up}data/siteConfig.json';
import content from '${up}data/${contentFile}';
import { Site } from '${up}site/Site';
import type { SiteConfig, SiteContent${ctx.i18n && alt ? ', SiteUi' : ''} } from '${up}site/types';${extraImports}

${body}
---

<!doctype html>
<html lang="${pageLang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${titleTag}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="${head.fontsHref}" rel="stylesheet" />${scripts}
  </head>
  <body>
    <!-- ${isIt ? 'HTML generato in build; client:load rende interattivi FAQ e modulo.' : 'HTML generado al compilar; client:load hace interactivos las FAQ y el formulario.'} -->
    <Site client:load content={siteContent} config={siteConfig} />
  </body>
</html>
`;
  };
  const indexAstro = pageSource('main');

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
    ...(ctx.i18n
      ? [
          {
            path: `src/pages/${ctx.altLocale}/index.astro`,
            language: 'html' as const,
            description: isIt
              ? 'Pagina nella seconda lingua: stesso modello, contenuto e testi dell’altra lingua.'
              : 'Página en el segundo idioma: mismo modelo, contenido y textos del otro idioma.',
            content: pageSource('alt'),
          },
        ]
      : []),
    indexCssFile(ctx),
    ...siteDataFiles(ctx),
    ...siteComponentFiles(ctx),
  ];
}
