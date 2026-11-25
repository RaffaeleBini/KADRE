import { GeneratedFile } from '../../types/builder';
import { GenContext, GeneratorModule } from '../types';

/** .env.example: variabile di base + righe dichiarate dagli innesti attivi. */
export function envExampleFile(ctx: GenContext, modules: GeneratorModule[]): GeneratedFile {
  const { isIt } = ctx;
  const extra = modules.map((m) => m.envExample?.(ctx) ?? '').join('');
  return {
    path: '.env.example',
    language: 'text',
    description: isIt
      ? 'Modello di variabili d’ambiente senza segreti.'
      : 'Plantilla de variables de entorno sin secretos.',
    content: `# ${isIt ? 'Porta del server locale' : 'Puerto del servidor local'}
PORT=3000
${extra}`,
  };
}
