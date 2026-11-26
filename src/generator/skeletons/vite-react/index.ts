import { GeneratedFile } from '../../../types/builder';
import { AssembledProject, GenContext, Skeleton } from '../../types';
import { indexCssFile, pageHead, siteComponentFiles, siteDataFiles } from '../shared/siteFiles';

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
  const { isIt, locale, github, stack, repoSlug } = ctx;
  const head = pageHead(ctx);

  const indexHtml = `<!doctype html>
<html lang="${locale}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${head.title}</title>
    <meta name="description" content="${head.description}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="${head.fontsHref}" rel="stylesheet" />
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

  const clientImportLines = assembled.clientImports.map((m) => `\nimport '${m}';`).join('');
  const mainTsx = `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';${clientImportLines}

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
      content: assembled.packageJson,
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
    indexCssFile(ctx),
    ...siteDataFiles(ctx),
    {
      path: 'src/App.tsx',
      language: 'typescript',
      description: isIt
        ? 'Punto di unione tra dati JSON e componenti del sito.'
        : 'Punto de unión entre los datos JSON y los componentes del sitio.',
      content: appTsx,
    },
    ...siteComponentFiles(ctx),
  ];
}
