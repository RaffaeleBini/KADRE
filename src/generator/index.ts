/** API pubblica del generatore di repository di KADRE. */
export { generateRepositoryFiles, MODULES } from './compose';
export { getExportScriptFilename, sanitizeRepoSlug, slugify } from './context';
export type { CodeGenerationInput } from './types';
export { downloadRepositoryZip } from './zip';
