import { GeneratedFile } from '../../types/builder';
import { GenContext, GeneratorModule } from '../types';

export function gitignoreFile(ctx: GenContext, modules: GeneratorModule[] = []): GeneratedFile {
  const { isIt, skeleton } = ctx;
  // Astro genera tipi e cache in .astro/ (si ricreano a ogni build)
  const astroLine = skeleton === 'astro' ? '.astro\n' : '';
  // cartelle generate dagli adapter (es. .vercel, .netlify, .wrangler)
  const moduleLines = modules.flatMap((m) => m.gitignore ?? []).map((l) => `${l}\n`).join('');
  return {
    path: '.gitignore',
    language: 'text',
    description: isIt
      ? 'Esclusioni standard per Node.js, build e file di ambiente.'
      : 'Exclusiones estándar para Node.js, compilación y archivos de entorno.',
    content: `node_modules
dist
${astroLine}${moduleLines}.env
.env.local
.DS_Store
*.log
`,
  };
}
