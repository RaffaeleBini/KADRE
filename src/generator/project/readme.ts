import { GeneratedFile } from '../../types/builder';
import { GenContext, GeneratorModule } from '../types';

export function readmeFile(ctx: GenContext, modules: GeneratorModule[] = []): GeneratedFile {
  const { isIt, content, stack, template, graphicStyle, colorPattern, repoSlug, branch, ghUser, scriptFilename, github } = ctx;
  // Astro con server: l'adapter decide il formato; Vercel/Netlify riconoscono Astro, Cloudflare usa un Worker
  const moduleSections = modules.map((m) => m.readme?.(ctx) ?? '').join('');
  const astroServer = ctx.skeleton === 'astro' && ctx.hasBackend;
  // Cosas que se descubrieron desplegando de verdad: el repositorio nuevo no aparece si la app de GitHub
  // del hosting tiene el acceso limitado, y en Vercel las variables solo se aplican a los despliegues nuevos
  const hostName = github.deployPlatform === 'vercel' ? 'Vercel' : github.deployPlatform === 'netlify' ? 'Netlify' : github.deployPlatform === 'cloudflare' ? 'Cloudflare' : '';
  const hostNoteIt = hostName
    ? `\n\n> Se il repository non compare nell’elenco di **Import Git Repository**, l’app di ${hostName} ha l’accesso limitato ai repository scelti: su GitHub apri **Settings → Applications → ${hostName} → Configure** e aggiungilo in **Repository access**.${github.deployPlatform === 'vercel' ? '\n>\n> Su Vercel le variabili d’ambiente si applicano **solo ai nuovi deploy**: dopo averne aggiunta o cambiata una, rifai il deploy (Deployments → ⋯ → Redeploy).' : ''}`
    : '';
  const hostNoteEs = hostName
    ? `\n\n> Si el repositorio no aparece en la lista de **Import Git Repository**, la app de ${hostName} tiene el acceso limitado a los repositorios elegidos: en GitHub abre **Settings → Applications → ${hostName} → Configure** y añádelo en **Repository access**.${github.deployPlatform === 'vercel' ? '\n>\n> En Vercel las variables de entorno se aplican **solo a los despliegues nuevos**: tras añadir o cambiar una, vuelve a desplegar (Deployments → ⋯ → Redeploy).' : ''}`
    : '';
  return {
      path: 'README.md',
      language: 'markdown',
      description: isIt
        ? 'Documentazione passo dopo passo per installazione, GitHub e deploy.'
        : 'Documentación paso a paso de instalación, exportación a GitHub y despliegue.',
      content: isIt
        ? `# ${content.brandName}

${content.tagline}

## Architettura tecnica selezionata

- **Stack**: ${stack.name}
- **Frontend**: ${stack.frontend}
- **Backend**: ${stack.backend}
- **Database**: ${stack.database}
- **Modello**: ${template.name}
- **Stile grafico**: ${graphicStyle.name} · ${colorPattern.name}

## Avvio in locale

\`\`\`bash
npm install
npm run dev
\`\`\`

## Esportazione su GitHub passo dopo passo

1. Crea un repository vuoto chiamato \`${repoSlug}\` su https://github.com/new (senza README né .gitignore).
2. Esegui questi comandi dentro la cartella del progetto:

\`\`\`bash
git init
git add .
git commit -m "Versione iniziale di ${content.brandName}"
git branch -M ${branch}
git remote add origin https://github.com/${ghUser}/${repoSlug}.git
git push -u origin ${branch}
\`\`\`

In alternativa puoi avviare lo script automatizzato incluso:

\`\`\`bash
chmod +x ${scriptFilename}
./${scriptFilename}
\`\`\`

## Pubblicazione (${github.deployPlatform})

${
  github.deployPlatform === 'node-server'
    ? `1. Su un hosting Node (Render, Railway…) crea un servizio web collegato a \`${ghUser}/${repoSlug}\`.\n2. Comando di build: \`npm install && npm run build\` · Comando di avvio: \`npm start\`.\n3. Il server ascolta sulla porta indicata dalla variabile \`PORT\` (la impostano i provider).${stack.includesDatabase ? '\n4. Aggiungi la variabile \`DATABASE_URL\` con la stringa di connessione PostgreSQL (es. Neon) ed esegui \`npm run db:init\` (vedi la sezione Database PostgreSQL).' : ''}`
    : github.deployPlatform === 'github-pages'
    ? `1. Apri il repository su GitHub → **Settings** → **Pages**.\n2. In **Build and deployment / Source**, seleziona **GitHub Actions**.\n3. Il workflow \`.github/workflows/deploy.yml\` pubblicherà automaticamente il sito su \`https://${ghUser}.github.io/${repoSlug}/\`.`
    : astroServer && github.deployPlatform === 'cloudflare'
    ? `1. Su Cloudflare apri **Workers & Pages** → **Create** → **Import a repository** e scegli \`${ghUser}/${repoSlug}\`.\n2. Comando di build: \`npm run build\` · Comando di deploy: \`npx wrangler deploy\`.\n3. In alternativa, dal tuo computer: \`npm run deploy\` (richiede \`npx wrangler login\`).`
    : astroServer
    ? `1. Accedi al tuo account **${github.deployPlatform.toUpperCase()}** e scegli **Import Git Repository**.\n2. Seleziona \`${ghUser}/${repoSlug}\`: Astro viene riconosciuto in automatico (build \`npm run build\`), e l’adapter pubblica la pagina e l’endpoint \`/api/contact\`.`
    : `1. Accedi al tuo account **${github.deployPlatform.toUpperCase()}** e scegli **Import Git Repository**.\n2. Seleziona \`${ghUser}/${repoSlug}\`.\n3. Comando di build: \`npm run build\` · Cartella di output: \`dist\`.`
}
${hostNoteIt}
${moduleSections}`
        : `# ${content.brandName}

${content.tagline}

## Arquitectura técnica seleccionada

- **Stack**: ${stack.name}
- **Frontend**: ${stack.frontend}
- **Backend**: ${stack.backend}
- **Base de datos**: ${stack.database}
- **Plantilla**: ${template.name}
- **Estilo gráfico**: ${graphicStyle.name} · ${colorPattern.name}

## Ejecución local

\`\`\`bash
npm install
npm run dev
\`\`\`

## Exportar a GitHub paso a paso

1. Crea un repositorio vacío llamado \`${repoSlug}\` en https://github.com/new (sin README ni .gitignore).
2. Ejecuta los siguientes comandos dentro de esta carpeta:

\`\`\`bash
git init
git add .
git commit -m "Versión inicial de ${content.brandName}"
git branch -M ${branch}
git remote add origin https://github.com/${ghUser}/${repoSlug}.git
git push -u origin ${branch}
\`\`\`

También puedes ejecutar el script automatizado incluido:

\`\`\`bash
chmod +x ${scriptFilename}
./${scriptFilename}
\`\`\`

## Despliegue (${github.deployPlatform})

${
  github.deployPlatform === 'node-server'
    ? `1. En un hosting Node (Render, Railway…) crea un servicio web conectado a \`${ghUser}/${repoSlug}\`.\n2. Comando de compilación: \`npm install && npm run build\` · Comando de arranque: \`npm start\`.\n3. El servidor escucha en el puerto de la variable \`PORT\` (la definen los proveedores).${stack.includesDatabase ? '\n4. Añade la variable \`DATABASE_URL\` con la cadena de conexión PostgreSQL (p. ej. Neon) y ejecuta \`npm run db:init\` (ver la sección Base de datos PostgreSQL).' : ''}`
    : github.deployPlatform === 'github-pages'
    ? `1. Abre tu repositorio en GitHub → **Settings** → **Pages**.\n2. En **Build and deployment / Source**, selecciona **GitHub Actions**.\n3. El flujo \`.github/workflows/deploy.yml\` publicará automáticamente tu web en \`https://${ghUser}.github.io/${repoSlug}/\`.`
    : astroServer && github.deployPlatform === 'cloudflare'
    ? `1. En Cloudflare abre **Workers & Pages** → **Create** → **Import a repository** y elige \`${ghUser}/${repoSlug}\`.\n2. Comando de compilación: \`npm run build\` · Comando de despliegue: \`npx wrangler deploy\`.\n3. También desde tu equipo: \`npm run deploy\` (requiere \`npx wrangler login\`).`
    : astroServer
    ? `1. Accede a tu cuenta de **${github.deployPlatform.toUpperCase()}** y elige **Import Git Repository**.\n2. Selecciona \`${ghUser}/${repoSlug}\`: Astro se detecta automáticamente (compilación \`npm run build\`) y el adaptador publica la página y el endpoint \`/api/contact\`.`
    : `1. Accede a tu cuenta de **${github.deployPlatform.toUpperCase()}** y elige **Import Git Repository**.\n2. Selecciona \`${ghUser}/${repoSlug}\`.\n3. Comando de compilación: \`npm run build\` · Directorio de salida: \`dist\`.`
}
${hostNoteEs}
${moduleSections}`,
  };
}
