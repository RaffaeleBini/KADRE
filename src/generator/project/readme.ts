import { GeneratedFile } from '../../types/builder';
import { GenContext } from '../types';

export function readmeFile(ctx: GenContext): GeneratedFile {
  const { isIt, content, stack, template, graphicStyle, colorPattern, repoSlug, branch, ghUser, scriptFilename, github } = ctx;
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
    ? `1. Su un hosting Node (Render, Railway…) crea un servizio web collegato a \`${ghUser}/${repoSlug}\`.\n2. Comando di build: \`npm install && npm run build\` · Comando di avvio: \`npm start\`.\n3. Il server ascolta sulla porta indicata dalla variabile \`PORT\` (la impostano i provider).${stack.includesDatabase ? '\n4. Aggiungi la variabile \`DATABASE_URL\` con la stringa di connessione PostgreSQL (es. Neon) ed esegui \`db/schema.sql\` sul database.' : ''}`
    : github.deployPlatform === 'github-pages'
    ? `1. Apri il repository su GitHub → **Settings** → **Pages**.\n2. In **Build and deployment / Source**, seleziona **GitHub Actions**.\n3. Il workflow \`.github/workflows/deploy.yml\` pubblicherà automaticamente il sito su \`https://${ghUser}.github.io/${repoSlug}/\`.`
    : `1. Accedi al tuo account **${github.deployPlatform.toUpperCase()}** e scegli **Import Git Repository**.\n2. Seleziona \`${ghUser}/${repoSlug}\`.\n3. Comando di build: \`npm run build\` · Cartella di output: \`dist\`.`
}
`
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
    ? `1. En un hosting Node (Render, Railway…) crea un servicio web conectado a \`${ghUser}/${repoSlug}\`.\n2. Comando de compilación: \`npm install && npm run build\` · Comando de arranque: \`npm start\`.\n3. El servidor escucha en el puerto de la variable \`PORT\` (la definen los proveedores).${stack.includesDatabase ? '\n4. Añade la variable \`DATABASE_URL\` con la cadena de conexión PostgreSQL (p. ej. Neon) y ejecuta \`db/schema.sql\` en la base de datos.' : ''}`
    : github.deployPlatform === 'github-pages'
    ? `1. Abre tu repositorio en GitHub → **Settings** → **Pages**.\n2. En **Build and deployment / Source**, selecciona **GitHub Actions**.\n3. El flujo \`.github/workflows/deploy.yml\` publicará automáticamente tu web en \`https://${ghUser}.github.io/${repoSlug}/\`.`
    : `1. Accede a tu cuenta de **${github.deployPlatform.toUpperCase()}** y elige **Import Git Repository**.\n2. Selecciona \`${ghUser}/${repoSlug}\`.\n3. Comando de compilación: \`npm run build\` · Directorio de salida: \`dist\`.`
}
`,
  };
}
