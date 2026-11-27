/**
 * Innesto "sito in due lingue" (solo Astro, sin Markdown ni SQL).
 *
 * La lengua principal es la del configurador al exportar; la segunda es la otra (ES ↔ IT).
 *  - routing: Astro i18n, `/` para la principal y `/<otra>/` para la segunda
 *    (src/pages/<otra>/index.astro lo genera el esqueleto Astro, con el selector de idioma);
 *  - src/data/siteContent.<otra>.json  contenido de la segunda lengua. Empieza como COPIA del
 *    principal: KADRE no traduce (la traducción automática es opcional y va al final del plan);
 *  - src/data/siteUi.<otra>.json  textos fijos (menú, formulario, pago): estos sí están traducidos.
 */
import { buildSiteUi } from '../skeletons/shared/siteConfig';
import { GeneratorModule } from '../types';

export const i18n: GeneratorModule = {
  id: 'i18n',
  enabled: (ctx) => ctx.i18n,
  readme: ({ isIt, locale, altLocale }) => {
    const main = locale.toUpperCase();
    const alt = altLocale.toUpperCase();
    return isIt
      ? `
## Sito in due lingue (${main} · ${alt})

Il sito esce in due lingue con il routing nativo di Astro: \`/\` per ${main} e \`/${altLocale}/\` per ${alt}, con un selettore di lingua nell’intestazione.

- **Testi fissi** (menu, modulo di contatto, pulsante di pagamento): già tradotti in \`src/data/siteConfig.json\` (${main}) e \`src/data/siteUi.${altLocale}.json\` (${alt}).
- **Contenuto** della seconda lingua: \`src/data/siteContent.${altLocale}.json\`. **Parte come copia del contenuto principale e va tradotto da te**: finché non lo fai, \`/${altLocale}/\` mostra gli stessi testi con menu e modulo già in ${alt}. Non cambiare gli \`id\` dei piani.
- Titolo e descrizione della pagina seguono il contenuto di ogni lingua.
- Struttura, colori, pagamenti, chiavi e analitica sono condivisi: si configurano una volta sola.

Non inclusi: traduzione automatica, rilevamento della lingua del browser, tag \`hreflang\`/sitemap, e più di due lingue.
`
      : `
## Sitio en dos idiomas (${main} · ${alt})

El sitio sale en dos idiomas con el enrutado nativo de Astro: \`/\` para ${main} y \`/${altLocale}/\` para ${alt}, con un selector de idioma en la cabecera.

- **Textos fijos** (menú, formulario de contacto, botón de pago): ya traducidos en \`src/data/siteConfig.json\` (${main}) y \`src/data/siteUi.${altLocale}.json\` (${alt}).
- **Contenido** del segundo idioma: \`src/data/siteContent.${altLocale}.json\`. **Empieza como copia del contenido principal y lo tienes que traducir tú**: mientras no lo hagas, \`/${altLocale}/\` muestra los mismos textos con el menú y el formulario ya en ${alt}. No cambies los \`id\` de los planes.
- El título y la descripción de la página siguen el contenido de cada idioma.
- Estructura, colores, pagos, claves y analítica se comparten: se configuran una sola vez.

No incluidos: traducción automática, detección del idioma del navegador, etiquetas \`hreflang\`/sitemap y más de dos idiomas.
`;
  },
  files: (ctx) => [
    {
      path: `src/data/siteContent.${ctx.altLocale}.json`,
      language: 'json',
      description: ctx.isIt
        ? 'Contenuto della seconda lingua: parte come copia di quello principale, da tradurre.'
        : 'Contenido del segundo idioma: empieza como copia del principal, para traducir.',
      content: JSON.stringify(ctx.exportedContent, null, 2),
    },
    {
      path: `src/data/siteUi.${ctx.altLocale}.json`,
      language: 'json',
      description: ctx.isIt
        ? 'Testi fissi dell’interfaccia nella seconda lingua (menu, modulo, pagamento).'
        : 'Textos fijos de la interfaz en el segundo idioma (menú, formulario, pago).',
      content: JSON.stringify(buildSiteUi(ctx.altLocale, ctx.payments && ctx.hasBackend), null, 2),
    },
  ],
};
