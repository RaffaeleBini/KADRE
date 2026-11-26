/**
 * Innesto "contenuti in Markdown" (solo Astro): le FAQ diventano una content
 * collection, un file .md per domanda (frontmatter `question`, corpo = risposta).
 * Chi modifica il sito scrive Markdown senza toccare JSON né codice; Astro lo
 * converte in HTML durante la build e lo passa al componente React del sito.
 *
 * Perché solo le FAQ: sono l'unico contenuto lungo e ripetibile del sito a una
 * pagina. Gli altri testi (titoli, prezzi, metriche) restano in siteContent.json.
 */
import { slugify } from '../context';
import { GenContext, GeneratorModule } from '../types';

const contentConfig = `import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Una FAQ = un archivo .md en src/content/faqs/ (el nombre fija el orden)
const faqs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faqs' }),
  schema: z.object({ question: z.string() }),
});

export const collections = { faqs };
`;

export const contentMarkdown: GeneratorModule = {
  id: 'content-markdown',
  enabled: (ctx) => ctx.markdown,
  files: (ctx: GenContext) => [
    {
      path: 'src/content.config.ts',
      language: 'typescript',
      description: ctx.isIt
        ? 'Definisce la collezione delle FAQ: un file Markdown per domanda.'
        : 'Define la colección de FAQ: un archivo Markdown por pregunta.',
      content: contentConfig,
    },
    ...ctx.exportedContent.faqs.map((faq, i) => ({
      path: `src/content/faqs/${String(i + 1).padStart(2, '0')}-${slugify(faq.id) || 'faq'}.md`,
      language: 'markdown' as const,
      description: ctx.isIt ? 'FAQ in Markdown: la risposta è il corpo del file.' : 'FAQ en Markdown: la respuesta es el cuerpo del archivo.',
      // JSON.stringify produce una cadena entre comillas válida también como YAML
      content: `---\nquestion: ${JSON.stringify(faq.question)}\n---\n\n${faq.answer.trim()}\n`,
    })),
  ],
  readme: ({ isIt }) =>
    isIt
      ? `
## Contenuti in Markdown

Le **FAQ** sono file Markdown in \`src/content/faqs/\`: uno per domanda, ordinati per nome del file.

\`\`\`markdown
---
question: "Quanto dura la consegna?"
---

Di solito **5 giorni lavorativi**. Per ordini urgenti [scrivici](#contact).
\`\`\`

- Per aggiungere una domanda, crea un nuovo file (es. \`06-resi.md\`); per toglierla, cancellalo.
- La risposta accetta Markdown: grassetto, elenchi, link.
- Tutto il resto del sito (titoli, prezzi, metriche…) resta in \`src/data/siteContent.json\`.
`
      : `
## Contenidos en Markdown

Las **FAQ** son archivos Markdown en \`src/content/faqs/\`: uno por pregunta, ordenados por nombre de archivo.

\`\`\`markdown
---
question: "¿Cuánto tarda la entrega?"
---

Normalmente **5 días laborables**. Para pedidos urgentes [escríbenos](#contact).
\`\`\`

- Para añadir una pregunta, crea un archivo nuevo (p. ej. \`06-devoluciones.md\`); para quitarla, bórralo.
- La respuesta admite Markdown: negrita, listas, enlaces.
- El resto del sitio (títulos, precios, métricas…) sigue en \`src/data/siteContent.json\`.
`,
};
