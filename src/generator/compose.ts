/**
 * Assembla il repository esportato: scheletro + innesti attivi + file di progetto.
 *
 * L'ordine dei file e delle chiavi nel package.json è parte dell'output: gli
 * snapshot in tests/ lo verificano. Per aggiungere una capacità, si crea un
 * innesto in modules/ e lo si registra in MODULES, senza toccare lo scheletro.
 */
import { GeneratedFile } from '../types/builder';
import { buildContext } from './context';
import { analytics } from './modules/analytics';
import { backendExpress } from './modules/backendExpress';
import {
  astroAdapterCloudflare,
  astroAdapterNetlify,
  astroAdapterNode,
  astroAdapterVercel,
  astroEndpoints,
} from './modules/astroServer';
import { paymentsAstro, paymentsExpress, paymentsStaticLinks } from './modules/paymentsStripe';
import { contentMarkdown } from './modules/contentMarkdown';
import { contactEmailAstro, contactEmailExpress, contactWeb3forms } from './modules/contactForm';
import { databasePostgres } from './modules/databasePostgres';
import { i18n } from './modules/i18n';
import { deployWorkflowFile } from './project/deployWorkflow';
import { envExampleFile } from './project/envExample';
import { exportScriptFile } from './project/exportScript';
import { gitignoreFile } from './project/gitignore';
import { readmeFile } from './project/readme';
import { astroSkeleton } from './skeletons/astro';
import { viteReactSkeleton } from './skeletons/vite-react';
import type { SkeletonId } from './matrix';
import { CodeGenerationInput, GenContext, GeneratorModule, Skeleton } from './types';

const SKELETONS: Record<SkeletonId, Skeleton> = {
  'vite-react': viteReactSkeleton,
  astro: astroSkeleton,
};

/** Innesti registrati, nell'ordine in cui contribuiscono a dipendenze e file. */
export const MODULES: GeneratorModule[] = [
  backendExpress,
  databasePostgres,
  astroEndpoints,
  astroAdapterVercel,
  astroAdapterNetlify,
  astroAdapterCloudflare,
  astroAdapterNode,
  analytics,
  contactEmailExpress,
  contactEmailAstro,
  contactWeb3forms,
  contentMarkdown,
  paymentsStaticLinks,
  paymentsExpress,
  paymentsAstro,
  i18n,
];

function assemblePackageJson(ctx: GenContext, skeleton: Skeleton, modules: GeneratorModule[]): string {
  const dependencies = { ...skeleton.dependencies };
  const devDependencies = { ...skeleton.devDependencies };
  let scripts = skeleton.scripts;
  for (const m of modules) {
    Object.assign(dependencies, m.dependencies);
    Object.assign(devDependencies, m.devDependencies);
    if (m.scripts) scripts = m.scripts;
  }
  return JSON.stringify(
    {
      name: ctx.repoSlug,
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts,
      dependencies,
      devDependencies,
    },
    null,
    2
  );
}

export function generateRepositoryFiles(input: CodeGenerationInput): GeneratedFile[] {
  const ctx = buildContext(input);
  const skeleton = SKELETONS[ctx.skeleton];
  const modules = MODULES.filter((m) => m.enabled(ctx));

  const assembled = {
    packageJson: assemblePackageJson(ctx, skeleton, modules),
    tsInclude: [...skeleton.tsInclude, ...modules.flatMap((m) => m.tsInclude ?? [])],
    astroAdapter: modules.find((m) => m.astroAdapter)?.astroAdapter,
    astroEnv: modules.flatMap((m) => m.astroEnv ?? []),
    clientImports: modules.flatMap((m) => m.clientImports ?? []),
  };

  return [
    ...skeleton.files(ctx, assembled),
    ...modules.flatMap((m) => m.files?.(ctx) ?? []),
    deployWorkflowFile(ctx),
    gitignoreFile(ctx, modules),
    envExampleFile(ctx, modules),
    exportScriptFile(ctx),
    readmeFile(ctx, modules),
  ];
}
