import { GeneratedFile } from '../../types/builder';
import { GenContext } from '../types';

export function gitignoreFile(ctx: GenContext): GeneratedFile {
  const { isIt } = ctx;
  return {
      path: '.gitignore',
      language: 'text',
      description: isIt
        ? 'Esclusioni standard per Node.js, Vite e file di ambiente.'
        : 'Exclusiones estándar para Node.js, Vite y archivos de entorno.',
      content: `node_modules
dist
.env
.env.local
.DS_Store
*.log
`,
  };
}
