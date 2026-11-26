import { Locale } from '../../i18n/translations';
import { GeneratedFile, GithubExportConfig, StackRecommendation } from '../../types/builder';
import { GenContext } from '../types';

function getDeployWorkflowYaml(
  config: GithubExportConfig,
  stack: StackRecommendation,
  locale: Locale
): string {
  const branch = config.branch || 'main';
  const isIt = locale === 'it';
  if (config.deployPlatform === 'github-pages' && !stack.includesBackend) {
    return `name: ${isIt ? 'Deploy su GitHub Pages' : 'Desplegar en GitHub Pages'}

on:
  push:
    branches: ["${branch}"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: ${isIt ? 'Scarica codice' : 'Descargar código'}
        uses: actions/checkout@v7
      - name: ${isIt ? 'Configura Node.js' : 'Configurar Node.js'}
        uses: actions/setup-node@v7
        with:
          node-version: 24
      # ${isIt ? 'npm install (non npm ci): il progetto esportato non include package-lock.json' : 'npm install (no npm ci): el proyecto exportado no incluye package-lock.json'}
      - name: ${isIt ? 'Installa dipendenze' : 'Instalar dependencias'}
        run: npm install
      - name: ${isIt ? 'Compila applicazione' : 'Compilar aplicación'}
        run: npm run build
      - name: ${isIt ? 'Carica artefatto statico' : 'Subir artefacto estático'}
        uses: actions/upload-pages-artifact@v5
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: ${isIt ? 'Pubblica su GitHub Pages' : 'Publicar en GitHub Pages'}
        id: deployment
        uses: actions/deploy-pages@v5
`;
  }

  return `name: ${isIt ? 'Integrazione e verifica continua' : 'Integración y verificación continua'}

on:
  push:
    branches: ["${branch}"]
  pull_request:
    branches: ["${branch}"]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - name: ${isIt ? 'Scarica codice' : 'Descargar código'}
        uses: actions/checkout@v7
      - name: ${isIt ? 'Configura Node.js' : 'Configurar Node.js'}
        uses: actions/setup-node@v7
        with:
          node-version: 24
      # ${isIt ? 'npm install (non npm ci): il progetto esportato non include package-lock.json' : 'npm install (no npm ci): el proyecto exportado no incluye package-lock.json'}
      - name: ${isIt ? 'Installa dipendenze' : 'Instalar dependencias'}
        run: npm install
      - name: ${isIt ? 'Verifica TypeScript e build' : 'Verificar TypeScript y compilación'}
        run: npm run build
`;
}

export function deployWorkflowFile(ctx: GenContext): GeneratedFile {
  const { isIt, github, stack, locale } = ctx;
  return {
      path: '.github/workflows/deploy.yml',
      language: 'yaml',
      description: isIt
        ? 'Workflow automatico GitHub Actions per compilazione e deploy.'
        : 'Flujo automático de GitHub Actions para compilación y despliegue.',
      content: getDeployWorkflowYaml(github, stack, locale),
  };
}
