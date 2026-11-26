import { GeneratedFile } from '../../types/builder';
import { GenContext } from '../types';

export function gitignoreFile(ctx: GenContext): GeneratedFile {
  const { isIt, skeleton } = ctx;
  // Astro genera tipi e cache in .astro/ (si ricreano a ogni build)
  const astroLine = skeleton === 'astro' ? '.astro\n' : '';
  return {
    path: '.gitignore',
    language: 'text',
    description: isIt
      ? 'Esclusioni standard per Node.js, build e file di ambiente.'
      : 'Exclusiones estándar para Node.js, compilación y archivos de entorno.',
    content: `node_modules
dist
${astroLine}.env
.env.local
.DS_Store
*.log
`,
  };
}
