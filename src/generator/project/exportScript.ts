import { GeneratedFile } from '../../types/builder';
import { GenContext } from '../types';

export function exportScriptFile(ctx: GenContext): GeneratedFile {
  const { isIt, scriptFilename, ghUser, repoSlug, branch, content } = ctx;
  return {
      path: scriptFilename,
      language: 'bash',
      description: isIt
        ? 'Script automatizzato per inizializzare Git e caricare il codice sul tuo repository.'
        : 'Script automatizado para inicializar Git y subir el código a tu repositorio.',
      content: `#!/usr/bin/env bash
set -e

REPO_URL="https://github.com/${ghUser}/${repoSlug}.git"
BRANCH="${branch}"

echo "${isIt ? 'Inizializzazione repository locale per' : 'Inicializando repositorio local para'} ${repoSlug}..."
git init
git add .
git commit -m "${isIt ? 'Versione iniziale generata per' : 'Versión inicial generada para'} ${content.brandName}"
git branch -M "$BRANCH"

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

echo "${isIt ? 'Caricamento codice su' : 'Subiendo código a'} $REPO_URL (${branch})..."
git push -u origin "$BRANCH"
echo "${isIt ? 'Esportazione completata correttamente.' : 'Exportación completada correctamente.'}"
`,
  };
}
