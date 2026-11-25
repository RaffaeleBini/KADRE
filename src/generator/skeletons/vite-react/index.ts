import { GeneratedFile } from '../../../types/builder';
import { AssembledProject, GenContext, Skeleton } from '../../types';
import { buildSiteConfig, siteCssVars } from './siteConfig';

/** Scheletro React + Vite + Tailwind: SPA a una pagina con sezioni. */
export const viteReactSkeleton: Skeleton = {
  id: 'vite-react',
  dependencies: {
    react: '^19.0.1',
    'react-dom': '^19.0.1',
  },
  devDependencies: {
    '@tailwindcss/vite': '^4.1.0',
    '@types/react': '^19.0.0',
    '@types/react-dom': '^19.0.0',
    '@vitejs/plugin-react': '^4.3.4',
    tailwindcss: '^4.1.0',
    typescript: '^5.8.0',
    vite: '^6.2.0',
  },
  scripts: {
    dev: 'vite',
    build: 'vite build',
    preview: 'vite preview',
  },
  tsInclude: ['src'],
  files: viteReactFiles,
};

function viteReactFiles(ctx: GenContext, assembled: AssembledProject): GeneratedFile[] {
  const { isIt, locale, content, graphicStyle, colorPattern, github, stack, repoSlug, exportedContent, template, sections } = ctx;
  const packageJson = assembled.packageJson;

  const indexHtml = `<!doctype html>
<html lang="${locale}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${content.brandName} — ${content.tagline}</title>
    <meta name="description" content="${content.heroSubheadline.replace(/"/g, '&quot;')}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=${graphicStyle.googleFontsQuery}&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: ${github.deployPlatform === 'github-pages' && !stack.includesBackend ? `'/${repoSlug}/'` : `'/'`},
  plugins: [react(), tailwindcss()],
});
`;

  const tsconfigJson = JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        useDefineForClassFields: true,
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        isolatedModules: true,
        moduleDetection: 'force',
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
      },
      include: assembled.tsInclude,
    },
    null,
    2
  );

  const cssVars = Object.entries(siteCssVars(graphicStyle, colorPattern))
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');

  const indexCss = `@import "tailwindcss";

:root {
${cssVars}
}

html {
  scroll-behavior: smooth;
  background-color: var(--color-bg);
  color: var(--color-text);
}
`;

  const siteConfig = buildSiteConfig({ locale, template, sections, hasBackendApi: ctx.hasBackend });

  const appTsx = `import config from './data/siteConfig.json';
import content from './data/siteContent.json';
import { Site } from './site/Site';
import type { SiteConfig, SiteContent } from './site/types';

// ${isIt ? 'Il contenuto viene verificato contro SiteContent dal compilatore.' : 'El compilador comprueba el contenido contra SiteContent.'}
const siteContent: SiteContent = content;
// ${isIt ? 'Nel JSON i valori come "hero" sono stringhe generiche: il cast li restringe ai tipi del sito.' : 'En el JSON valores como "hero" son cadenas genéricas: el cast los restringe a los tipos del sitio.'}
const siteConfig = config as SiteConfig;

export default function App() {
  return <Site content={siteContent} config={siteConfig} />;
}
`;

  const mainTsx = `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;

  return [
    {
      path: 'index.html',
      language: 'html',
      description: isIt
        ? 'Documento radice con metadati SEO e font selezionati.'
        : 'Documento raíz con metadatos SEO y tipografías seleccionadas.',
      content: indexHtml,
    },
    {
      path: 'package.json',
      language: 'json',
      description: isIt
        ? 'Dipendenze e script configurati per lo stack scelto.'
        : 'Dependencias y scripts configurados para el stack elegido.',
      content: packageJson,
    },
    {
      path: 'vite.config.ts',
      language: 'typescript',
      description: isIt
        ? 'Configurazione di build Vite con base URL adattata al deploy.'
        : 'Configuración de compilación Vite con base URL adaptada al despliegue.',
      content: viteConfig,
    },
    {
      path: 'tsconfig.json',
      language: 'json',
      description: isIt ? 'Configurazione rigorosa di TypeScript.' : 'Configuración estricta de TypeScript.',
      content: tsconfigJson,
    },
    {
      path: 'src/main.tsx',
      language: 'typescript',
      description: isIt ? 'Punto di ingresso React.' : 'Punto de entrada React.',
      content: mainTsx,
    },
    {
      path: 'src/index.css',
      language: 'css',
      description: isIt
        ? 'Token di colore, tipografia e geometria dello stile scelto.'
        : 'Tokens de color, tipografía y geometría del estilo gráfico elegido.',
      content: indexCss,
    },
    {
      path: 'src/data/siteContent.json',
      language: 'json',
      description: isIt
        ? 'Contenuti disaccoppiati modificabili senza toccare i componenti.'
        : 'Contenidos desacoplados editables sin modificar componentes.',
      content: JSON.stringify(exportedContent, null, 2),
    },
    {
      path: 'src/data/siteConfig.json',
      language: 'json',
      description: isIt
        ? 'Struttura del sito: ordine delle sezioni, layout e testi dell’interfaccia.'
        : 'Estructura del sitio: orden de secciones, diseño y textos de la interfaz.',
      content: JSON.stringify(siteConfig, null, 2),
    },
    {
      path: 'src/App.tsx',
      language: 'typescript',
      description: isIt
        ? 'Punto di unione tra dati JSON e componenti del sito.'
        : 'Punto de unión entre los datos JSON y los componentes del sitio.',
      content: appTsx,
    },
    ...siteComponentFiles(isIt),
  ];
}

/**
 * Componenti del sito: file .tsx veri in src/site-template/vite-react/site/,
 * copiati tali e quali. Sono gli stessi che l'anteprima di KADRE renderizza.
 */
const SITE_SOURCES = import.meta.glob('../../../site-template/vite-react/site/**/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function siteComponentFiles(isIt: boolean): GeneratedFile[] {
  return Object.keys(SITE_SOURCES)
    .sort()
    .map((key) => {
      const relative = key.split('/site-template/vite-react/')[1];
      return {
        path: `src/${relative}`,
        language: 'typescript' as const,
        description: isIt
          ? 'Componente del sito, identico a quello mostrato nell’anteprima di KADRE.'
          : 'Componente del sitio, idéntico al que muestra la vista previa de KADRE.',
        content: SITE_SOURCES[key],
      };
    });
}
