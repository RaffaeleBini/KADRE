import { Locale } from '../i18n/translations';
import {
  ColorPatternPreset,
  DiscoveryAnswers,
  GraphicStylePreset,
  ProjectType,
  SectionConfig,
  SectionType,
  SiteContent,
  StackRecommendation,
  TemplateDefinition,
} from '../types/builder';

export const GENERATED_ASSETS = {
  welcomeHero: './src/assets/images/welcome_hud_blueprint_1795589158893.jpg',
  productHardware: './src/assets/images/template_product_hardware_1795589159630.jpg',
  studioArchitecture: './src/assets/images/template_studio_architecture_1795589158717.jpg',
  workspaceSaas: './src/assets/images/template_workspace_saas_1795589160802.jpg',
} as const;

export function getCuratedGallery(locale: Locale) {
  if (locale === 'it') {
    return [
      {
        id: 'product-hardware',
        label: 'Hardware e Design Industriale',
        url: GENERATED_ASSETS.productHardware,
        filename: 'hardware-studio.jpg',
      },
      {
        id: 'studio-architecture',
        label: 'Architettura e Studio',
        url: GENERATED_ASSETS.studioArchitecture,
        filename: 'architettura-studio.jpg',
      },
      {
        id: 'workspace-saas',
        label: 'Ingegneria e Prodotto Digitale',
        url: GENERATED_ASSETS.workspaceSaas,
        filename: 'spazio-ingegneria.jpg',
      },
      {
        id: 'hud-blueprint',
        label: 'Console Tecnica HUD',
        url: GENERATED_ASSETS.welcomeHero,
        filename: 'console-tecnica.jpg',
      },
    ];
  }
  return [
    {
      id: 'product-hardware',
      label: 'Hardware y Diseño Industrial',
      url: GENERATED_ASSETS.productHardware,
      filename: 'hardware-estudio.jpg',
    },
    {
      id: 'studio-architecture',
      label: 'Arquitectura y Estudio',
      url: GENERATED_ASSETS.studioArchitecture,
      filename: 'arquitectura-estudio.jpg',
    },
    {
      id: 'workspace-saas',
      label: 'Ingeniería y Producto Digital',
      url: GENERATED_ASSETS.workspaceSaas,
      filename: 'espacio-ingenieria.jpg',
    },
    {
      id: 'hud-blueprint',
      label: 'Consola Técnica HUD',
      url: GENERATED_ASSETS.welcomeHero,
      filename: 'consola-tecnica.jpg',
    },
  ];
}

export const DEFAULT_DISCOVERY_ANSWERS: DiscoveryAnswers = {
  projectType: 'landing',
  architectureMode: 'frontend-only',
  databaseNeed: 'none',
  renderingStrategy: 'static-ssg',
  integrations: ['contact-form'],
};

export interface QuestionOption<T extends string> {
  value: T;
  title: string;
  description: string;
  technicalHint: string;
}

export function getDiscoveryOptions(locale: Locale): {
  projectType: QuestionOption<DiscoveryAnswers['projectType']>[];
  architectureMode: QuestionOption<DiscoveryAnswers['architectureMode']>[];
  databaseNeed: QuestionOption<DiscoveryAnswers['databaseNeed']>[];
  renderingStrategy: QuestionOption<DiscoveryAnswers['renderingStrategy']>[];
  integrations: QuestionOption<DiscoveryAnswers['integrations'][number]>[];
} {
  if (locale === 'it') {
    return {
      projectType: [
        {
          value: 'landing',
          title: 'Landing commerciale o lancio',
          description:
            'Presenta un prodotto, servizio o campagna con focus diretto su conversione e acquisizione contatti.',
          technicalHint: 'Alta velocità iniziale · SEO ottimizzata',
        },
        {
          value: 'saas',
          title: 'Applicazione web o piattaforma SaaS',
          description:
            'Prodotto digitale interattivo con piani di abbonamento, demo funzionale e accesso clienti.',
          technicalHint: 'Componenti modulari · Stato interattivo',
        },
        {
          value: 'ecommerce',
          title: 'Catalogo prodotti o negozio',
          description:
            'Vetrina strutturata per mostrare referenze, specifiche tecniche, prezzi e richieste d’ordine.',
          technicalHint: 'Catalogo filtrabile · Pronto per pagamenti',
        },
        {
          value: 'portfolio',
          title: 'Portfolio di studio o architettura',
          description:
            'Esposizione visiva ad alta precisione per progetti, casi studio e credenziali professionali.',
          technicalHint: 'Focus visivo · Caricamento progressivo media',
        },
        {
          value: 'corporate',
          title: 'Sito aziendale B2B',
          description:
            'Sito istituzionale per aziende industriali, società di consulenza o studi tecnici con metriche e team.',
          technicalHint: 'Struttura chiara · Credibilità direzionale',
        },
        {
          value: 'editorial',
          title: 'Portale editoriale o documentazione',
          description:
            'Pubblicazione ordinata per articoli tecnici, guide, report annuali o knowledge base.',
          technicalHint: 'Lettura confortevole · Contenuti in Markdown/JSON',
        },
      ],
      architectureMode: [
        {
          value: 'frontend-only',
          title: 'Solo Frontend (senza server proprio)',
          description:
            'L’intero sito gira nel browser. Manutenzione minima e hosting gratuito su CDN o GitHub Pages.',
          technicalHint: 'Zero costi server · Massima velocità',
        },
        {
          value: 'light-api',
          title: 'Frontend + API server leggera',
          description:
            'Aggiunge endpoint lato server per gestire moduli di contatto, webhook, invio email o integrazioni sicure.',
          technicalHint: 'Node.js / Express o Serverless Functions',
        },
        {
          value: 'full-backend',
          title: 'Backend completo e logica di business',
          description:
            'Server dedicato con autenticazione, sessioni utente, area riservata e permessi avanzati.',
          technicalHint: 'Express + API REST · Controllo completo',
        },
      ],
      databaseNeed: [
        {
          value: 'none',
          title: 'Senza database (file locali)',
          description:
            'Testi e configurazioni risiedono in file JSON direttamente dentro il repository GitHub.',
          technicalHint: 'Versionato in Git · Nessuna dipendenza esterna',
        },
        {
          value: 'markdown-cms',
          title: 'Contenuti strutturati / CMS leggero',
          description:
            'Ideale per aggiornare articoli, schede catalogo o casi studio senza modificare il codice.',
          technicalHint: 'JSON / Markdown strutturato',
        },
        {
          value: 'sql-relational',
          title: 'Database relazionale (SQL)',
          description:
            'Archivia contatti, ordini, utenti o inventario con integrità referenziale e query strutturate.',
          technicalHint: 'PostgreSQL o SQLite con schema SQL',
        },
        {
          value: 'nosql-realtime',
          title: 'Database documentale / tempo reale',
          description:
            'Pensato per dati flessibili, collaborazione istantanea o sincronizzazione multi-dispositivo.',
          technicalHint: 'Collezioni JSON · Scalabilità orizzontale',
        },
      ],
      renderingStrategy: [
        {
          value: 'static-ssg',
          title: 'Statica generata (SSG)',
          description:
            'Compila in file HTML, CSS e JS pronti per essere serviti istantaneamente da qualsiasi CDN globale.',
          technicalHint: 'Ideale per GitHub Pages, Netlify o Cloudflare',
        },
        {
          value: 'spa-dynamic',
          title: 'Dinamica interattiva (SPA)',
          description:
            'Navigazione fluida senza ricaricamenti, ideale per interfacce ricche, filtri dal vivo e pannelli.',
          technicalHint: 'React + TypeScript + Vite',
        },
        {
          value: 'hybrid-ssr',
          title: 'Ibrida con server (SSR + API)',
          description:
            'Combina pagine veloci per i motori di ricerca con rotte dinamiche collegate al server in tempo reale.',
          technicalHint: 'Node.js + Rendering controllato',
        },
      ],
      integrations: [
        {
          value: 'contact-form',
          title: 'Modulo di contatto',
          description: 'Raccolta diretta di richieste con validazione e invio strutturato.',
          technicalHint: 'Validazione client/server',
        },
        {
          value: 'payments',
          title: 'Pagamenti online',
          description: 'Struttura predisposta per listini, piani tariffari e flusso di acquisto.',
          technicalHint: 'Webhook e checkout pronti',
        },
        {
          value: 'auth',
          title: 'Accesso utenti',
          description: 'Schema pronto per registrazione, login e aree riservate.',
          technicalHint: 'Rotte protette e sessioni',
        },
        {
          value: 'analytics',
          title: 'Analitica rispettosa',
          description: 'Eventi essenziali di conversione e metriche senza script invasivi.',
          technicalHint: 'Leggero · Conforme GDPR',
        },
        {
          value: 'i18n',
          title: 'Struttura multilingua',
          description: 'Dizionario separato dei testi pronto per aggiungere altre lingue.',
          technicalHint: 'Contenuti disaccoppiati in JSON',
        },
      ],
    };
  }

  return {
    projectType: [
      {
        value: 'landing',
        title: 'Landing comercial o lanzamiento',
        description:
          'Presenta un producto, servicio o campaña con enfoque directo a conversión y captación de contactos.',
        technicalHint: 'Alta velocidad inicial · SEO optimizado',
      },
      {
        value: 'saas',
        title: 'Aplicación web o plataforma SaaS',
        description:
          'Producto digital interactivo con planes de suscripción, demostración funcional y acceso de clientes.',
        technicalHint: 'Componentes modulares · Estado interactivo',
      },
      {
        value: 'ecommerce',
        title: 'Catálogo de productos o tienda',
        description:
          'Escaparate estructurado para mostrar referencias, especificaciones técnicas, precios y pedidos.',
        technicalHint: 'Catálogo filtrable · Preparado para pagos',
      },
      {
        value: 'portfolio',
        title: 'Portfolio de estudio o arquitectura',
        description:
          'Muestrario visual de alta precisión para obras, casos de estudio y credenciales profesionales.',
        technicalHint: 'Foco visual · Carga progresiva de medios',
      },
      {
        value: 'corporate',
        title: 'Web corporativa B2B',
        description:
          'Sitio institucional para empresa industrial, consultora o firma técnica con métricas y equipo.',
        technicalHint: 'Estructura clara · Confianza ejecutiva',
      },
      {
        value: 'editorial',
        title: 'Portal editorial o documentación',
        description:
          'Publicación estructurada para artículos técnicos, guías, informes anuales o base de conocimiento.',
        technicalHint: 'Lectura prolongada · Contenidos en Markdown/JSON',
      },
    ],
    architectureMode: [
      {
        value: 'frontend-only',
        title: 'Solo Frontend (sin servidor propio)',
        description:
          'Toda la web se ejecuta en el navegador. Mantenimiento mínimo y alojamiento gratuito en CDN o GitHub Pages.',
        technicalHint: 'Coste cero de servidor · Máxima velocidad',
      },
      {
        value: 'light-api',
        title: 'Frontend + API ligera de servidor',
        description:
          'Añade endpoints de servidor para procesar formularios, webhooks, envíos de correo o integraciones seguras.',
        technicalHint: 'Node.js / Express o Serverless Functions',
      },
      {
        value: 'full-backend',
        title: 'Backend completo y lógica de negocio',
        description:
          'Servidor dedicado con autenticación, sesiones de usuario, panel privado y reglas de acceso avanzadas.',
        technicalHint: 'Express + API REST · Control total',
      },
    ],
    databaseNeed: [
      {
        value: 'none',
        title: 'Sin base de datos (archivos locales)',
        description:
          'Los textos y configuraciones viven en archivos JSON dentro del propio repositorio de GitHub.',
        technicalHint: 'Versionado en Git · Sin dependencias externas',
      },
      {
        value: 'markdown-cms',
        title: 'Contenidos estructurados / CMS ligero',
        description:
          'Ideal para actualizar artículos, fichas de catálogo o casos de estudio sin tocar código.',
        technicalHint: 'JSON / Markdown estructurado',
      },
      {
        value: 'sql-relational',
        title: 'Base de datos relacional (SQL)',
        description:
          'Almacena contactos, pedidos, usuarios o inventario con integridad referencial y consultas complejas.',
        technicalHint: 'PostgreSQL o SQLite con esquema SQL',
      },
      {
        value: 'nosql-realtime',
        title: 'Base de datos documental / tiempo real',
        description:
          'Pensada para datos flexibles, colaboración instantánea o sincronización multi-dispositivo.',
        technicalHint: 'Colecciones JSON · Escalado horizontal',
      },
    ],
    renderingStrategy: [
      {
        value: 'static-ssg',
        title: 'Estática generada (SSG)',
        description:
          'Se compila en archivos HTML, CSS y JS listos para servirse al instante desde cualquier red global.',
        technicalHint: 'Ideal para GitHub Pages, Netlify o Cloudflare',
      },
      {
        value: 'spa-dynamic',
        title: 'Dinámica interactiva (SPA)',
        description:
          'Navegación fluida sin recargas, ideal para interfaces ricas, filtros en vivo y paneles de control.',
        technicalHint: 'React + TypeScript + Vite',
      },
      {
        value: 'hybrid-ssr',
        title: 'Híbrida con servidor (SSR + API)',
        description:
          'Combina páginas rápidas para buscadores con rutas dinámicas conectadas al servidor en tiempo real.',
        technicalHint: 'Node.js + Renderizado controlado',
      },
    ],
    integrations: [
      {
        value: 'contact-form',
        title: 'Formulario de contacto',
        description: 'Captación directa de consultas con validación y envío estructurado.',
        technicalHint: 'Validación cliente/servidor',
      },
      {
        value: 'payments',
        title: 'Pasarela de pagos',
        description: 'Preparación de estructura de precios, planes y flujo de contratación.',
        technicalHint: 'Webhook y checkout preparado',
      },
      {
        value: 'auth',
        title: 'Acceso de usuarios',
        description: 'Esquema preparado para registro, inicio de sesión y áreas privadas.',
        technicalHint: 'Rutas protegidas y sesiones',
      },
      {
        value: 'analytics',
        title: 'Analítica respetuosa',
        description: 'Eventos básicos de conversión y métricas de uso sin scripts invasivos.',
        technicalHint: 'Ligero · Compatible con RGPD',
      },
      {
        value: 'i18n',
        title: 'Estructura multi-idioma',
        description: 'Diccionario separado de textos listo para añadir inglés u otros idiomas.',
        technicalHint: 'Contenido desacoplado en JSON',
      },
    ],
  };
}

export function getAllStacks(locale: Locale): StackRecommendation[] {
  if (locale === 'it') {
    return [
      {
        id: 'static-vite-react',
        name: 'React + Vite + Tailwind (Statico SSG)',
        category: 'Frontend Statico ad Alte Prestazioni',
        summary:
          'Compilazione ultraveloce in file statici con React 19, TypeScript e Tailwind CSS. Zero gestione server e deploy diretto su GitHub Pages.',
        frontend: 'React 19 + TypeScript + Vite',
        backend: 'Non necessario (100% client)',
        database: 'File JSON versionati in Git',
        styling: 'Tailwind CSS v4 + Token CSS',
        deployTargets: ['GitHub Pages', 'Vercel', 'Netlify', 'Cloudflare Pages'],
        includesBackend: false,
        includesDatabase: false,
        rationale: [
          'Azzera i costi di server e garantisce tempi di caricamento inferiori a 1 secondo.',
          'Contenuti separati in src/data/siteContent.json per aggiornare testi senza toccare il layout.',
          'Workflow GitHub Actions preconfigurato per pubblicare automaticamente ad ogni git push.',
        ],
        estimatedBuildTime: '~12 s',
        complexity: 'Bassa',
      },
      {
        id: 'spa-interactive-studio',
        name: 'React SPA + Livello Dati Modulare',
        category: 'Applicazione Web Dinamica (Frontend)',
        summary:
          'Architettura SPA ottimizzata per cataloghi interattivi, filtri in tempo reale ed esperienze ricche nel browser senza complessità server.',
        frontend: 'React 19 + TypeScript + Vite',
        backend: 'Integrazione esterna via API / Webhook',
        database: 'Catalogo JSON strutturato / Headless CMS',
        styling: 'Tailwind CSS v4 + Design System',
        deployTargets: ['Vercel', 'Netlify', 'GitHub Pages', 'Cloudflare Pages'],
        includesBackend: false,
        includesDatabase: false,
        rationale: [
          'Transizioni immediate tra le sezioni e filtri locali senza ricaricare la pagina.',
          'Struttura pronta per collegare qualsiasi CMS esterno o gateway di pagamento.',
          'Deploy gratuito e immediato dal tuo repository GitHub.',
        ],
        estimatedBuildTime: '~16 s',
        complexity: 'Bassa',
      },
      {
        id: 'hybrid-node-api',
        name: 'React + Express API (Full-Stack Leggero)',
        category: 'Frontend + Server API Node.js',
        summary:
          'Unisce un’interfaccia React moderna a un server Express in TypeScript per gestire moduli di contatto, invii e logica sicura lato server.',
        frontend: 'React 19 + TypeScript + Vite',
        backend: 'Node.js + Express (API REST su /api)',
        database: 'Archiviazione leggera / Variabili d’ambiente',
        styling: 'Tailwind CSS v4 + Token CSS',
        deployTargets: ['Vercel', 'Render', 'Railway', 'Cloud Run'],
        includesBackend: true,
        includesDatabase: false,
        rationale: [
          'Protegge le chiavi private ed elabora i moduli di contatto sul server (/api/contact).',
          'Un unico repository GitHub contiene sia il frontend che l’API.',
          'Pronto per crescere verso integrazioni esterne o pagamenti senza riscrivere la base.',
        ],
        estimatedBuildTime: '~24 s',
        complexity: 'Media',
      },
      {
        id: 'fullstack-sql-platform',
        name: 'React + Express + Schema SQL (Full-Stack Completo)',
        category: 'Piattaforma Full-Stack con Database',
        summary:
          'Soluzione completa per la produzione con interfaccia React, API REST Express e schema relazionale SQL pronto per PostgreSQL o SQLite.',
        frontend: 'React 19 + TypeScript + Vite',
        backend: 'Node.js + Express + Rotte API strutturate',
        database: 'PostgreSQL / SQLite (db/schema.sql incluso)',
        styling: 'Tailwind CSS v4 + Token CSS',
        deployTargets: ['Vercel + Neon/Supabase', 'Railway', 'Render', 'Cloud Run'],
        includesBackend: true,
        includesDatabase: true,
        rationale: [
          'Include schema SQL normalizzato per contatti, utenti e catalogo persistente.',
          'Separa in modo pulito presentazione, logica API e livello di persistenza.',
          'Pronto per autenticazione reale, pagamenti e scalabilità in produzione.',
        ],
        estimatedBuildTime: '~32 s',
        complexity: 'Avanzata',
      },
    ];
  }

  return [
    {
      id: 'static-vite-react',
      name: 'React + Vite + Tailwind (Estático SSG)',
      category: 'Frontend Estático de Alto Rendimiento',
      summary:
        'Compilación ultrarrápida a archivos estáticos con React 19, TypeScript y Tailwind CSS. Cero mantenimiento de servidor y despliegue directo en GitHub Pages.',
      frontend: 'React 19 + TypeScript + Vite',
      backend: 'No requerido (100% cliente)',
      database: 'Archivos JSON versionados en Git',
      styling: 'Tailwind CSS v4 + Tokens CSS',
      deployTargets: ['GitHub Pages', 'Vercel', 'Netlify', 'Cloudflare Pages'],
      includesBackend: false,
      includesDatabase: false,
      rationale: [
        'Elimina costes de servidor y garantiza tiempos de carga por debajo de 1 segundo.',
        'Contenido separado en src/data/siteContent.json para actualizar textos sin romper diseño.',
        'Flujo de GitHub Actions preconfigurado para publicar automáticamente con cada git push.',
      ],
      estimatedBuildTime: '~12 s',
      complexity: 'Baja',
    },
    {
      id: 'spa-interactive-studio',
      name: 'React SPA + Capa de Datos Modular',
      category: 'Aplicación Web Dinámica (Frontend)',
      summary:
        'Arquitectura SPA optimizada para catálogos interactivos, filtros en tiempo real y experiencias ricas en navegador sin fricción operativa.',
      frontend: 'React 19 + TypeScript + Vite',
      backend: 'Integración externa vía API / Webhooks',
      database: 'Catálogo estructurado JSON / Headless CMS',
      styling: 'Tailwind CSS v4 + Sistema de Diseño',
      deployTargets: ['Vercel', 'Netlify', 'GitHub Pages', 'Cloudflare Pages'],
      includesBackend: false,
      includesDatabase: false,
      rationale: [
        'Transiciones inmediatas entre secciones y filtros locales sin recargar la página.',
        'Estructura preparada para conectar cualquier CMS externo o API de pagos.',
        'Despliegue gratuito e instantáneo desde tu repositorio de GitHub.',
      ],
      estimatedBuildTime: '~16 s',
      complexity: 'Baja',
    },
    {
      id: 'hybrid-node-api',
      name: 'React + Express API (Full-Stack Ligero)',
      category: 'Frontend + Servidor API Node.js',
      summary:
        'Combina una interfaz React moderna con un servidor Express en TypeScript para gestionar formularios, envíos y lógica segura en servidor.',
      frontend: 'React 19 + TypeScript + Vite',
      backend: 'Node.js + Express (API REST en /api)',
      database: 'Almacenamiento ligero / Variables de entorno',
      styling: 'Tailwind CSS v4 + Tokens CSS',
      deployTargets: ['Vercel', 'Render', 'Railway', 'Cloud Run'],
      includesBackend: true,
      includesDatabase: false,
      rationale: [
        'Protege claves privadas y procesa formularios de contacto desde el servidor (/api/contact).',
        'Un único repositorio de GitHub contiene tanto el frontend como la API.',
        'Listo para crecer hacia integraciones externas o pagos sin rehacer la base.',
      ],
      estimatedBuildTime: '~24 s',
      complexity: 'Media',
    },
    {
      id: 'fullstack-sql-platform',
      name: 'React + Express + Esquema SQL (Full-Stack Completo)',
      category: 'Plataforma Full-Stack con Base de Datos',
      summary:
        'Solución completa de producción con interfaz React, API REST en Express y esquema relacional SQL listo para PostgreSQL o SQLite.',
      frontend: 'React 19 + TypeScript + Vite',
      backend: 'Node.js + Express + Rutas API estructuradas',
      database: 'PostgreSQL / SQLite (db/schema.sql incluido)',
      styling: 'Tailwind CSS v4 + Tokens CSS',
      deployTargets: ['Vercel + Neon/Supabase', 'Railway', 'Render', 'Cloud Run'],
      includesBackend: true,
      includesDatabase: true,
      rationale: [
        'Incluye esquema SQL normalizado para leads, usuarios y catálogo persistente.',
        'Separa limpiamente capas de presentación, API de negocio y persistencia.',
        'Preparado para autenticación real, pagos y escalado en producción.',
      ],
      estimatedBuildTime: '~32 s',
      complexity: 'Avanzada',
    },
  ];
}

export function computeStackRecommendation(
  answers: DiscoveryAnswers,
  locale: Locale = 'es'
): StackRecommendation {
  const stacks = getAllStacks(locale);
  const needsDatabase =
    answers.databaseNeed === 'sql-relational' || answers.databaseNeed === 'nosql-realtime';
  const needsFullBackend =
    answers.architectureMode === 'full-backend' ||
    answers.integrations.includes('auth') ||
    answers.integrations.includes('payments');
  const needsLightBackend =
    answers.architectureMode === 'light-api' || answers.renderingStrategy === 'hybrid-ssr';

  if (needsDatabase || (needsFullBackend && answers.databaseNeed !== 'none')) {
    return stacks[3];
  }
  if (needsFullBackend || needsLightBackend) {
    return stacks[2];
  }
  if (
    answers.renderingStrategy === 'spa-dynamic' ||
    answers.projectType === 'saas' ||
    answers.projectType === 'ecommerce'
  ) {
    return stacks[1];
  }
  return stacks[0];
}

export function getSectionsCatalog(locale: Locale): Omit<SectionConfig, 'enabled'>[] {
  if (locale === 'it') {
    return [
      {
        id: 'hero',
        type: 'hero',
        label: 'Copertina principale (Hero)',
        description: 'Titolo principale, proposta di valore, immagine in evidenza e call to action.',
        required: true,
      },
      {
        id: 'metrics',
        type: 'metrics',
        label: 'Fascia indicatori chiave',
        description: 'Metriche quantitative concrete a supporto della tua proposta.',
      },
      {
        id: 'features',
        type: 'features',
        label: 'Capacità e proposta di valore',
        description: 'Blocco strutturato con 3 pilastri tecnici o vantaggi distintivi.',
      },
      {
        id: 'catalog',
        type: 'catalog',
        label: 'Catalogo, opere o casi studio',
        description: 'Galleria visiva di prodotti, progetti o soluzioni con specifiche.',
      },
      {
        id: 'pricing',
        type: 'pricing',
        label: 'Piani e tariffe',
        description: 'Confronto trasparente dei piani con funzionalità e pulsante di scelta.',
      },
      {
        id: 'testimonials',
        type: 'testimonials',
        label: 'Testimonianze verificate',
        description: 'Citazioni reali con nome, ruolo e azienda dei tuoi clienti.',
      },
      {
        id: 'faq',
        type: 'faq',
        label: 'Domande frequenti (FAQ)',
        description: 'Fisarmonica interattiva per chiarire dubbi tecnici o commerciali.',
      },
      {
        id: 'contact',
        type: 'contact',
        label: 'Contatto e invito finale',
        description: 'Modulo interattivo e recapiti diretti per raccogliere richieste.',
      },
    ];
  }

  return [
    {
      id: 'hero',
      type: 'hero',
      label: 'Portada principal (Hero)',
      description: 'Titular principal, propuesta de valor, imagen destacada y llamadas a la acción.',
      required: true,
    },
    {
      id: 'metrics',
      type: 'metrics',
      label: 'Franja de métricas clave',
      description: 'Indicadores cuantitativos concretos que respaldan tu propuesta.',
    },
    {
      id: 'features',
      type: 'features',
      label: 'Capacidades y propuesta de valor',
      description: 'Bloque estructurado de 3 pilares técnicos o ventajas diferenciadoras.',
    },
    {
      id: 'catalog',
      type: 'catalog',
      label: 'Catálogo, obras o casos de estudio',
      description: 'Galería visual de productos, proyectos o soluciones con especificaciones.',
    },
    {
      id: 'pricing',
      type: 'pricing',
      label: 'Planes y tarifas',
      description: 'Comparativa transparente de planes con características y botón de selección.',
    },
    {
      id: 'testimonials',
      type: 'testimonials',
      label: 'Testimonios verificados',
      description: 'Citas reales con nombre, cargo y organización de tus clientes.',
    },
    {
      id: 'faq',
      type: 'faq',
      label: 'Preguntas frecuentes (FAQ)',
      description: 'Acordeón interactivo para resolver objeciones técnicas o comerciales.',
    },
    {
      id: 'contact',
      type: 'contact',
      label: 'Contacto y llamada final',
      description: 'Formulario interactivo y datos directos para captar clientes o consultas.',
    },
  ];
}

export function getTemplates(locale: Locale): TemplateDefinition[] {
  if (locale === 'it') {
    return [
      {
        id: 'apex-launch',
        name: 'Lancio di Prodotto',
        category: 'Landing Commerciale',
        description:
          'Copertina asimmetrica a due colonne con foto prodotto, metriche immediate, pilastri chiave e conversione diretta.',
        bestFor: ['landing', 'ecommerce'],
        heroLayout: 'split',
        previewImage: GENERATED_ASSETS.productHardware,
        defaultSections: ['hero', 'metrics', 'features', 'catalog', 'faq', 'contact'],
        highlights: ['Copertina divisa 60/40', 'Blocco specifiche', 'Modulo integrato'],
      },
      {
        id: 'console-saas',
        name: 'Piattaforma SaaS Modulare',
        category: 'Software e Prodotto Digitale',
        description:
          'Struttura pensata per prodotti digitali con confronto piani, architettura delle funzionalità e riprova sociale.',
        bestFor: ['saas', 'landing'],
        heroLayout: 'centered',
        previewImage: GENERATED_ASSETS.workspaceSaas,
        defaultSections: ['hero', 'metrics', 'features', 'pricing', 'testimonials', 'faq', 'contact'],
        highlights: ['Matrice piani e tariffe', 'Casi cliente', 'Flusso di registrazione'],
      },
      {
        id: 'atelier-portfolio',
        name: 'Studio e Architettura',
        category: 'Portfolio Professionale',
        description:
          'Composizione editoriale pulita in cui fotografia di progetto e rigore tipografico guidano il racconto.',
        bestFor: ['portfolio', 'corporate'],
        heroLayout: 'editorial',
        previewImage: GENERATED_ASSETS.studioArchitecture,
        defaultSections: ['hero', 'catalog', 'features', 'testimonials', 'contact'],
        highlights: ['Galleria opere in evidenza', 'Narrativa visiva pulita', 'Contatto diretto'],
      },
      {
        id: 'grid-catalog',
        name: 'Catalogo Tecnico e Commercio',
        category: 'E-Commerce / Vetrina',
        description:
          'Progettata per esporre linee di prodotto con categorie, prezzi chiari, specifiche e richiesta ordine.',
        bestFor: ['ecommerce', 'corporate'],
        heroLayout: 'split',
        previewImage: GENERATED_ASSETS.productHardware,
        defaultSections: ['hero', 'catalog', 'features', 'pricing', 'faq', 'contact'],
        highlights: ['Schede prodotto chiare', 'Prezzi tabellari', 'Sezione garanzie'],
      },
      {
        id: 'corporate-b2b',
        name: 'Aziendale Industriale B2B',
        category: 'Istituzionale e Consulenza',
        description:
          'Presentazione solida per studi di ingegneria, società di consulenza o imprese industriali con indicatori concreti.',
        bestFor: ['corporate', 'landing'],
        heroLayout: 'split',
        previewImage: GENERATED_ASSETS.studioArchitecture,
        defaultSections: ['hero', 'metrics', 'features', 'testimonials', 'contact'],
        highlights: ['Indicatori di risultato', 'Proposta direzionale', 'Credenziali B2B'],
      },
      {
        id: 'editorial-press',
        name: 'Editoriale e Documentazione',
        category: 'Pubblicazione e Conoscenza',
        description:
          'Ritmo tipografico equilibrato pensato per report tecnici, saggi, guide o portali di documentazione.',
        bestFor: ['editorial', 'portfolio'],
        heroLayout: 'editorial',
        previewImage: GENERATED_ASSETS.workspaceSaas,
        defaultSections: ['hero', 'features', 'catalog', 'faq', 'contact'],
        highlights: ['Lettura ad alta chiarezza', 'Indice pubblicazioni', 'Domande frequenti'],
      },
    ];
  }

  return [
    {
      id: 'apex-launch',
      name: 'Lanzamiento de Producto',
      category: 'Landing Comercial',
      description:
        'Portada asimétrica en dos columnas con fotografía de producto, métricas inmediatas, pilares clave y conversión directa.',
      bestFor: ['landing', 'ecommerce'],
      heroLayout: 'split',
      previewImage: GENERATED_ASSETS.productHardware,
      defaultSections: ['hero', 'metrics', 'features', 'catalog', 'faq', 'contact'],
      highlights: ['Portada dividida 60/40', 'Bloque de especificaciones', 'Formulario integrado'],
    },
    {
      id: 'console-saas',
      name: 'Plataforma SaaS Modular',
      category: 'Software y Producto Digital',
      description:
        'Estructura orientada a productos digitales con comparativa de planes, arquitectura de funcionalidades y prueba social.',
      bestFor: ['saas', 'landing'],
      heroLayout: 'centered',
      previewImage: GENERATED_ASSETS.workspaceSaas,
      defaultSections: ['hero', 'metrics', 'features', 'pricing', 'testimonials', 'faq', 'contact'],
      highlights: ['Matriz de planes y tarifas', 'Casos de clientes', 'Flujo de registro'],
    },
    {
      id: 'atelier-portfolio',
      name: 'Estudio y Arquitectura',
      category: 'Portfolio Profesional',
      description:
        'Composición editorial limpia donde la fotografía de proyectos y la precisión tipográfica toman el protagonismo.',
      bestFor: ['portfolio', 'corporate'],
      heroLayout: 'editorial',
      previewImage: GENERATED_ASSETS.studioArchitecture,
      defaultSections: ['hero', 'catalog', 'features', 'testimonials', 'contact'],
      highlights: ['Galería de obras destacada', 'Narrativa visual limpia', 'Contacto directo'],
    },
    {
      id: 'grid-catalog',
      name: 'Catálogo Técnico y Comercio',
      category: 'E-Commerce / Escaparate',
      description:
        'Diseñada para exhibir líneas de productos con categorías, precios visibles, especificaciones y solicitud de pedido.',
      bestFor: ['ecommerce', 'corporate'],
      heroLayout: 'split',
      previewImage: GENERATED_ASSETS.productHardware,
      defaultSections: ['hero', 'catalog', 'features', 'pricing', 'faq', 'contact'],
      highlights: ['Fichas de producto claras', 'Precios tabulares', 'Sección de garantías'],
    },
    {
      id: 'corporate-b2b',
      name: 'Corporativa Industrial B2B',
      category: 'Institucional y Consultoría',
      description:
        'Presentación sólida para firmas de ingeniería, consultoras o empresas industriales con indicadores de resultados.',
      bestFor: ['corporate', 'landing'],
      heroLayout: 'split',
      previewImage: GENERATED_ASSETS.studioArchitecture,
      defaultSections: ['hero', 'metrics', 'features', 'testimonials', 'contact'],
      highlights: ['Indicadores de rendimiento', 'Propuesta ejecutiva', 'Credenciales B2B'],
    },
    {
      id: 'editorial-press',
      name: 'Editorial y Documentación',
      category: 'Publicación y Conocimiento',
      description:
        'Ritmo tipográfico sereno pensado para informes técnicos, artículos largos, guías o portales de conocimiento.',
      bestFor: ['editorial', 'portfolio'],
      heroLayout: 'editorial',
      previewImage: GENERATED_ASSETS.workspaceSaas,
      defaultSections: ['hero', 'features', 'catalog', 'faq', 'contact'],
      highlights: ['Lectura de alta claridad', 'Índice de entregas', 'Preguntas frecuentes'],
    },
  ];
}

export function buildSectionsForTemplate(
  template: TemplateDefinition,
  locale: Locale = 'es'
): SectionConfig[] {
  const catalog = getSectionsCatalog(locale);
  const activeSet = new Set<SectionType>(template.defaultSections);
  const orderedActive: SectionConfig[] = template.defaultSections
    .map((type) => {
      const def = catalog.find((item) => item.type === type);
      return def ? { ...def, enabled: true } : null;
    })
    .filter((item): item is SectionConfig => item !== null);

  const inactive: SectionConfig[] = catalog
    .filter((item) => !activeSet.has(item.type))
    .map((item) => ({ ...item, enabled: false }));

  return [...orderedActive, ...inactive];
}

export function localizeSections(sections: SectionConfig[], locale: Locale): SectionConfig[] {
  const catalog = getSectionsCatalog(locale);
  return sections.map((sec) => {
    const match = catalog.find((item) => item.id === sec.id);
    if (!match) return sec;
    return {
      ...sec,
      label: match.label,
      description: match.description,
    };
  });
}

export function getGraphicStyles(locale: Locale): GraphicStylePreset[] {
  if (locale === 'it') {
    return [
      {
        id: 'industrial-hud',
        name: 'Industriale Tecnico',
        description:
          'Bordi netti, geometria lineare e alto contrasto ispirato alla strumentazione ingegneristica.',
        fontDisplay: "'Archivo', sans-serif",
        fontBody: "'DM Sans', sans-serif",
        googleFontsQuery: 'Archivo:wght@500;600;700&family=DM+Sans:wght@400;500;600;700',
        borderRadius: '2px',
        buttonRadius: '2px',
        borderWidth: '1px',
        surfaceElevation: 'framed',
        spacingDensity: 'balanced',
        headingTracking: '-0.02em',
      },
      {
        id: 'swiss-editorial',
        name: 'Editoriale Svizzero',
        description:
          'Titoli con grazie contemporanee, ampi margini e rigore tipografico classico.',
        fontDisplay: "'Fraunces', Georgia, serif",
        fontBody: "'DM Sans', sans-serif",
        googleFontsQuery: 'Fraunces:opsz,wght@9..144,600;9..144,700&family=DM+Sans:wght@400;500;600',
        borderRadius: '4px',
        buttonRadius: '4px',
        borderWidth: '1px',
        surfaceElevation: 'hairline',
        spacingDensity: 'airy',
        headingTracking: '-0.025em',
      },
      {
        id: 'minimal-modern',
        name: 'Minimalista Moderno',
        description:
          'Superfici pulite, raggi morbidi ed equilibrio essenziale tra immagini e testo.',
        fontDisplay: "'Plus Jakarta Sans', sans-serif",
        fontBody: "'DM Sans', sans-serif",
        googleFontsQuery: 'Plus+Jakarta+Sans:wght@500;600;700&family=DM+Sans:wght@400;500;600',
        borderRadius: '10px',
        buttonRadius: '8px',
        borderWidth: '1px',
        surfaceElevation: 'hairline',
        spacingDensity: 'balanced',
        headingTracking: '-0.02em',
      },
      {
        id: 'architectural-solid',
        name: 'Architettonico Solido',
        description:
          'Linee marcate da 2px, angoli retti a 0px e volumi decisi privi di ornamenti.',
        fontDisplay: "'Archivo', sans-serif",
        fontBody: "'Plus Jakarta Sans', sans-serif",
        googleFontsQuery: 'Archivo:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600',
        borderRadius: '0px',
        buttonRadius: '0px',
        borderWidth: '2px',
        surfaceElevation: 'framed',
        spacingDensity: 'compact',
        headingTracking: '-0.03em',
      },
    ];
  }

  return [
    {
      id: 'industrial-hud',
      name: 'Industrial Técnico',
      description:
        'Bordes precisos, geometría recta y contraste alto inspirado en instrumental de ingeniería.',
      fontDisplay: "'Archivo', sans-serif",
      fontBody: "'DM Sans', sans-serif",
      googleFontsQuery: 'Archivo:wght@500;600;700&family=DM+Sans:wght@400;500;600;700',
      borderRadius: '2px',
      buttonRadius: '2px',
      borderWidth: '1px',
      surfaceElevation: 'framed',
      spacingDensity: 'balanced',
      headingTracking: '-0.02em',
    },
    {
      id: 'swiss-editorial',
      name: 'Editorial Suizo',
      description:
        'Titulares con serifa contemporánea, amplios márgenes y rigor tipográfico clásico.',
      fontDisplay: "'Fraunces', Georgia, serif",
      fontBody: "'DM Sans', sans-serif",
      googleFontsQuery: 'Fraunces:opsz,wght@9..144,600;9..144,700&family=DM+Sans:wght@400;500;600',
      borderRadius: '4px',
      buttonRadius: '4px',
      borderWidth: '1px',
      surfaceElevation: 'hairline',
      spacingDensity: 'airy',
      headingTracking: '-0.025em',
    },
    {
      id: 'minimal-modern',
      name: 'Minimalista Moderno',
      description:
        'Superficies serenas, radios suaves y equilibrio limpio entre imagen y texto.',
      fontDisplay: "'Plus Jakarta Sans', sans-serif",
      fontBody: "'DM Sans', sans-serif",
      googleFontsQuery: 'Plus+Jakarta+Sans:wght@500;600;700&family=DM+Sans:wght@400;500;600',
      borderRadius: '10px',
      buttonRadius: '8px',
      borderWidth: '1px',
      surfaceElevation: 'hairline',
      spacingDensity: 'balanced',
      headingTracking: '-0.02em',
    },
    {
      id: 'architectural-solid',
      name: 'Arquitectónico Sólido',
      description:
        'Trazos definidos de 2px, vértices rectos a 0px y bloques contundentes sin ornamentos.',
      fontDisplay: "'Archivo', sans-serif",
      fontBody: "'Plus Jakarta Sans', sans-serif",
      googleFontsQuery: 'Archivo:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600',
      borderRadius: '0px',
      buttonRadius: '0px',
      borderWidth: '2px',
      surfaceElevation: 'framed',
      spacingDensity: 'compact',
      headingTracking: '-0.03em',
    },
  ];
}

export function getColorPatterns(locale: Locale): ColorPatternPreset[] {
  if (locale === 'it') {
    return [
      {
        id: 'obsidian-yellow',
        name: 'Ossidiana e Giallo Industriale',
        description: 'Sfondo scuro tecnico con testo bianco e accenti ad alta leggibilità.',
        mode: 'dark',
        background: '#0A0B0D',
        surface: '#12151B',
        surfaceAlt: '#191D26',
        text: '#F5F7FA',
        textMuted: '#9BA4B5',
        accent: '#F5C400',
        accentText: '#0A0B0D',
        border: '#272D39',
      },
      {
        id: 'graphite-copper',
        name: 'Grafite e Ambra Rame',
        description: 'Scuro caldo da officina meccanica con riflessi ramati e lettura riposante.',
        mode: 'dark',
        background: '#11100E',
        surface: '#1A1815',
        surfaceAlt: '#24211D',
        text: '#F5F2EB',
        textMuted: '#ABA396',
        accent: '#E07A38',
        accentText: '#11100E',
        border: '#322E28',
      },
      {
        id: 'navy-ice',
        name: 'Ardesia Profonda e Blu Precisione',
        description: 'Estetica tecnologica sobria per software B2B e piattaforme dati.',
        mode: 'dark',
        background: '#0B111C',
        surface: '#121A2B',
        surfaceAlt: '#1A253D',
        text: '#F1F5F9',
        textMuted: '#94A3B8',
        accent: '#38BDF8',
        accentText: '#082032',
        border: '#23324D',
      },
      {
        id: 'technical-paper',
        name: 'Carta Tecnica e Grafite',
        description: 'Modalità chiara architettonica con accento giallo industriale calibrato.',
        mode: 'light',
        background: '#F4F5F7',
        surface: '#FFFFFF',
        surfaceAlt: '#EAECEF',
        text: '#111318',
        textMuted: '#4F5969',
        accent: '#F5C400',
        accentText: '#0A0B0D',
        border: '#D4D9E2',
      },
      {
        id: 'editorial-ivory',
        name: 'Avorio Editoriale e Borgogna',
        description: 'Contrasto caldo da rivista stampata, ideale per studi e architettura.',
        mode: 'light',
        background: '#F7F5F0',
        surface: '#FFFFFF',
        surfaceAlt: '#EFECE4',
        text: '#191715',
        textMuted: '#5B564E',
        accent: '#8C2D2D',
        accentText: '#FFFFFF',
        border: '#DDD7CC',
      },
      {
        id: 'pure-blueprint',
        name: 'Bianco Puro e Blu Ingegneria',
        description: 'Chiarezza aziendale immediata con contrasto elevato e linee sottili.',
        mode: 'light',
        background: '#FFFFFF',
        surface: '#F8FAFC',
        surfaceAlt: '#EEF2F6',
        text: '#0F172A',
        textMuted: '#475569',
        accent: '#1D4ED8',
        accentText: '#FFFFFF',
        border: '#CBD5E1',
      },
    ];
  }

  return [
    {
      id: 'obsidian-yellow',
      name: 'Obsidiana y Amarillo Industrial',
      description: 'Fondo oscuro técnico con tipografía blanca y acentos de alta visibilidad.',
      mode: 'dark',
      background: '#0A0B0D',
      surface: '#12151B',
      surfaceAlt: '#191D26',
      text: '#F5F7FA',
      textMuted: '#9BA4B5',
      accent: '#F5C400',
      accentText: '#0A0B0D',
      border: '#272D39',
    },
    {
      id: 'graphite-copper',
      name: 'Grafito y Ámbar Cobre',
      description: 'Oscuro cálido de taller mecánico con reflejos cobrizos y lectura descansada.',
      mode: 'dark',
      background: '#11100E',
      surface: '#1A1815',
      surfaceAlt: '#24211D',
      text: '#F5F2EB',
      textMuted: '#ABA396',
      accent: '#E07A38',
      accentText: '#11100E',
      border: '#322E28',
    },
    {
      id: 'navy-ice',
      name: 'Pizarra Profunda y Azul Precisión',
      description: 'Estética tecnológica sobria para software B2B y plataformas de datos.',
      mode: 'dark',
      background: '#0B111C',
      surface: '#121A2B',
      surfaceAlt: '#1A253D',
      text: '#F1F5F9',
      textMuted: '#94A3B8',
      accent: '#38BDF8',
      accentText: '#082032',
      border: '#23324D',
    },
    {
      id: 'technical-paper',
      name: 'Papel Técnico y Grafito',
      description: 'Modo claro arquitectónico con acento amarillo industrial calibrado.',
      mode: 'light',
      background: '#F4F5F7',
      surface: '#FFFFFF',
      surfaceAlt: '#EAECEF',
      text: '#111318',
      textMuted: '#4F5969',
      accent: '#F5C400',
      accentText: '#0A0B0D',
      border: '#D4D9E2',
    },
    {
      id: 'editorial-ivory',
      name: 'Marfil Editorial y Borgoña',
      description: 'Contraste cálido de revista impresa, ideal para estudios, arquitectura y cultura.',
      mode: 'light',
      background: '#F7F5F0',
      surface: '#FFFFFF',
      surfaceAlt: '#EFECE4',
      text: '#191715',
      textMuted: '#5B564E',
      accent: '#8C2D2D',
      accentText: '#FFFFFF',
      border: '#DDD7CC',
    },
    {
      id: 'pure-blueprint',
      name: 'Blanco Puro y Azul Ingeniería',
      description: 'Claridad corporativa inmediata con contraste elevado y líneas finas.',
      mode: 'light',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      surfaceAlt: '#EEF2F6',
      text: '#0F172A',
      textMuted: '#475569',
      accent: '#1D4ED8',
      accentText: '#FFFFFF',
      border: '#CBD5E1',
    },
  ];
}

export function getStarterContentForProject(
  projectType: ProjectType,
  locale: Locale = 'es'
): SiteContent {
  if (locale === 'it') {
    const baseIt: Record<ProjectType, Partial<SiteContent>> = {
      landing: {
        brandName: 'Vektor Audio',
        tagline: 'Ingegneria acustica da scrivania',
        heroEyebrow: 'Serie Professionale 2026',
        heroHeadline: 'Controllo acustico di precisione ricavato dal pieno in alluminio',
        heroSubheadline:
          'Un controller tattile modulare progettato per studi di missaggio e creativi che richiedono risposta immediata, calibrazione pulita e latenza zero.',
        heroCtaPrimary: 'Richiedi unità',
        heroCtaSecondary: 'Vedi specifiche',
        heroImageUrl: GENERATED_ASSETS.productHardware,
        heroImageName: 'hardware-studio.jpg',
      },
      saas: {
        brandName: 'Metrika Ops',
        tagline: 'Controllo operativo per team di ingegneria',
        heroEyebrow: 'Piattaforma Cloud',
        heroHeadline: 'Coordina rilasci, incidenti e metriche da un unico pannello',
        heroSubheadline:
          'Centralizza i flussi operativi del tuo team tecnico con tracciabilità completa, avvisi chiari e report pronti per la direzione.',
        heroCtaPrimary: 'Prova gratis 14 giorni',
        heroCtaSecondary: 'Prenota una demo',
        heroImageUrl: GENERATED_ASSETS.workspaceSaas,
        heroImageName: 'spazio-ingegneria.jpg',
      },
      ecommerce: {
        brandName: 'Officina Nord',
        tagline: 'Strumenti e arredo tecnico',
        heroEyebrow: 'Collezione Permanente',
        heroHeadline: 'Oggetti funzionali costruiti per durare decenni',
        heroSubheadline:
          'Ogni pezzo nasce in piccole serie con alluminio anodizzato, acciaio spazzolato e componenti riparabili con garanzia diretta di officina.',
        heroCtaPrimary: 'Esplora catalogo',
        heroCtaSecondary: 'Info spedizioni',
        heroImageUrl: GENERATED_ASSETS.productHardware,
        heroImageName: 'hardware-studio.jpg',
      },
      portfolio: {
        brandName: 'Studio Bini & Associati',
        tagline: 'Architettura contemporanea e spazi culturali',
        heroEyebrow: 'Milano · Madrid',
        heroHeadline: 'Architettura in cemento a vista, luce naturale e proporzione serena',
        heroSubheadline:
          'Progettiamo padiglioni culturali, studi creativi e residenze sostenibili con approccio costruttivo onesto e rigore strutturale.',
        heroCtaPrimary: 'Avvia progetto',
        heroCtaSecondary: 'Opere selezionate',
        heroImageUrl: GENERATED_ASSETS.studioArchitecture,
        heroImageName: 'architettura-studio.jpg',
      },
      corporate: {
        brandName: 'Italia Precisione Industriale',
        tagline: 'Automazione e manifattura avanzata',
        heroEyebrow: 'Certificazione ISO 9001',
        heroHeadline: 'Soluzioni di ingegneria industriale per linee ad alta esigenza',
        heroSubheadline:
          'Affianchiamo i produttori europei nella digitalizzazione di impianto, controllo metrologico e manutenzione predittiva con risultati misurabili.',
        heroCtaPrimary: 'Richiedi diagnosi',
        heroCtaSecondary: 'Scopri le capacità',
        heroImageUrl: GENERATED_ASSETS.studioArchitecture,
        heroImageName: 'architettura-studio.jpg',
      },
      editorial: {
        brandName: 'Quaderno Tecnico',
        tagline: 'Saggi su sistemi, software e design industriale',
        heroEyebrow: 'Edizione Trimestrale',
        heroHeadline: 'Ricerca chiara su architetture web, interfacce e mestiere digitale',
        heroSubheadline:
          'Articoli approfonditi, guide pratiche e casi documentati senza rumore pubblicitario, scritti da ingegneri e designer sul campo.',
        heroCtaPrimary: 'Iscriviti all’edizione',
        heroCtaSecondary: 'Leggi gli ultimi numeri',
        heroImageUrl: GENERATED_ASSETS.workspaceSaas,
        heroImageName: 'spazio-ingegneria.jpg',
      },
    };

    const spec = baseIt[projectType];
    return {
      brandName: spec.brandName ?? 'Vektor Studio',
      tagline: spec.tagline ?? 'Design e ingegneria digitale',
      logoDataUrl: null,
      heroEyebrow: spec.heroEyebrow ?? 'Edizione 2026',
      heroHeadline:
        spec.heroHeadline ?? 'Costruisci esperienze digitali chiare, veloci e durevoli',
      heroSubheadline:
        spec.heroSubheadline ??
        'Architettura moderna ottimizzata per prestazioni reali, manutenzione semplice e deploy continuo.',
      heroCtaPrimary: spec.heroCtaPrimary ?? 'Inizia ora',
      heroCtaSecondary: spec.heroCtaSecondary ?? 'Scopri di più',
      heroImageUrl: spec.heroImageUrl ?? GENERATED_ASSETS.productHardware,
      heroImageName: spec.heroImageName ?? 'copertina.jpg',
      metrics: [
        {
          id: 'm1',
          value: '99,98%',
          label: 'Disponibilità verificata',
          context: 'Ultimi 12 mesi in produzione',
        },
        {
          id: 'm2',
          value: '< 0,6 s',
          label: 'Tempo di caricamento',
          context: 'Misurato su rete mobile 4G',
        },
        {
          id: 'm3',
          value: '+140',
          label: 'Progetti pubblicati',
          context: 'Team in Europa e America Latina',
        },
        {
          id: 'm4',
          value: '5 anni',
          label: 'Garanzia e supporto diretto',
          context: 'Manutenzione evolutiva inclusa',
        },
      ],
      featuresHeading: 'Progettato con rigore tecnico dall’inizio alla fine',
      featuresSubheading:
        'Ogni scelta strutturale riduce l’attrito, accelera la consegna e garantisce un’esperienza impeccabile su ogni schermo.',
      features: [
        {
          id: 'f1',
          title: 'Architettura modulare senza debito tecnico',
          description:
            'Componenti puliti e tipizzati che permettono di aggiungere pagine o servizi esterni senza riscrivere la base.',
          metric: '100% TypeScript',
        },
        {
          id: 'f2',
          title: 'Prestazioni ottimizzate per i motori di ricerca',
          description:
            'HTML5 semantico, caricamento efficiente delle risorse e gerarchia visiva calibrata per la massima leggibilità.',
          metric: 'Core Web Vitals A+',
        },
        {
          id: 'f3',
          title: 'Deploy continuo automatizzato',
          description:
            'Flusso connesso a GitHub per pubblicare modifiche con tracciabilità completa e ripristino in pochi secondi.',
          metric: 'CI/CD integrato',
        },
      ],
      catalogHeading: 'Selezione in evidenza',
      catalogSubheading: 'Progetti e referenze recenti con specifiche complete e risultati documentati.',
      catalogItems: [
        {
          id: 'c1',
          title: 'Modulo Serie K-01',
          category: 'Hardware / Precisione',
          priceOrTag: '490 €',
          description:
            'Telaio fresato CNC in alluminio anodizzato con interfaccia tattile a risposta istantanea.',
          imageUrl: GENERATED_ASSETS.productHardware,
        },
        {
          id: 'c2',
          title: 'Padiglione Nord',
          category: 'Spazio / Architettura',
          priceOrTag: '2026',
          description:
            'Riqualificazione integrale di 680 m² con facciata vetrata a controllo termico e corte d’acqua.',
          imageUrl: GENERATED_ASSETS.studioArchitecture,
        },
        {
          id: 'c3',
          title: 'Sistema Ingegneria v3',
          category: 'Piattaforma / Digitale',
          priceOrTag: 'Su misura',
          description:
            'Ambiente unificato di pianificazione, gestione documentale e rilascio automatizzato per team.',
          imageUrl: GENERATED_ASSETS.workspaceSaas,
        },
      ],
      pricingHeading: 'Piani trasparenti senza costi nascosti',
      pricingSubheading: 'Scegli il livello di copertura più adatto alla fase attuale del tuo team.',
      pricingPlans: [
        {
          id: 'p1',
          name: 'Essenziale',
          audience: 'Per team in fase iniziale',
          price: '29 €',
          cadence: '/ mese',
          featured: false,
          features: [
            'Fino a 3 progetti attivi',
            'Deploy automatico su GitHub',
            'Certificato SSL e dominio proprio',
            'Supporto via email entro 24 h',
          ],
          ctaLabel: 'Scegli Essenziale',
        },
        {
          id: 'p2',
          name: 'Professionale',
          audience: 'Per realtà in crescita',
          price: '79 €',
          cadence: '/ mese',
          featured: true,
          features: [
            'Progetti illimitati e ambienti preview',
            'Integrazione API e database',
            'Analitica avanzata ed export CSV',
            'Supporto tecnico prioritario',
          ],
          ctaLabel: 'Scegli Professionale',
        },
        {
          id: 'p3',
          name: 'Aziendale',
          audience: 'Per organizzazioni con SLA dedicato',
          price: 'Su misura',
          cadence: 'annuale',
          featured: false,
          features: [
            'Architettura dedicata e audit',
            'Ruoli personalizzati e SSO',
            'Accordo di livello servizio 99,99%',
            'Affiancamento ingegneristico dedicato',
          ],
          ctaLabel: 'Contatta vendite',
        },
      ],
      testimonialsHeading: 'Cosa racconta chi lavora già con noi',
      testimonials: [
        {
          id: 't1',
          quote:
            'Siamo passati da tre settimane per pubblicare una nuova pagina a meno di un pomeriggio, con un codice pulito che il team comprende subito.',
          author: 'Chiara Bellini',
          role: 'Direttrice di Prodotto',
          organization: 'Nord Sistemi',
        },
        {
          id: 't2',
          quote:
            'La chiarezza visiva e la velocità di caricamento hanno aumentato le richieste di preventivo del 38% nel primo trimestre dal rilascio.',
          author: 'Marco Ferri',
          role: 'Socio Fondatore',
          organization: 'Ferri Ingegneria Industriale',
        },
      ],
      faqHeading: 'Domande frequenti',
      faqs: [
        {
          id: 'q1',
          question: 'Quanto tempo serve per andare online?',
          answer:
            'La prima versione funzionante è pronta e pubblicata in meno di 48 ore dopo la conferma dei contenuti e del dominio.',
        },
        {
          id: 'q2',
          question: 'Posso aggiornare testi e immagini in autonomia?',
          answer:
            'Sì. Tutti i testi e i riferimenti alle immagini sono raccolti in un unico file strutturato modificabile senza toccare la logica del sito.',
        },
        {
          id: 'q3',
          question: 'Il codice resta al 100% di nostra proprietà?',
          answer:
            'Assolutamente sì. L’intero progetto vive nel tuo repository GitHub senza vincoli o licenze proprietarie.',
        },
      ],
      contactHeading: 'Parliamo del tuo prossimo lancio',
      contactSubheading:
        'Raccontaci brevemente il tuo obiettivo e ti risponderemo con una proposta tecnica chiara entro un giorno lavorativo.',
      contactEmail: 'contatti@progetto-esempio.it',
      contactLocation: 'Milano · Lavoro remoto internazionale',
      footerNote: 'Tutti i diritti riservati.',
    };
  }

  const base: Record<ProjectType, Partial<SiteContent>> = {
    landing: {
      brandName: 'Vektor Audio',
      tagline: 'Ingeniería acústica de escritorio',
      heroEyebrow: 'Serie Profesional 2026',
      heroHeadline: 'Control acústico de precisión mecanizado en aluminio sólido',
      heroSubheadline:
        'Un controlador táctil modular diseñado para estudios de mezcla y creadores que exigen respuesta instantánea, calibración limpia y cero latencia.',
      heroCtaPrimary: 'Solicitar unidad',
      heroCtaSecondary: 'Ver especificaciones',
      heroImageUrl: GENERATED_ASSETS.productHardware,
      heroImageName: 'hardware-estudio.jpg',
    },
    saas: {
      brandName: 'Metrika Ops',
      tagline: 'Control operativo para equipos de ingeniería',
      heroEyebrow: 'Plataforma en la nube',
      heroHeadline: 'Coordina despliegues, incidencias y métricas desde un solo panel',
      heroSubheadline:
        'Centraliza los flujos de trabajo de tu equipo técnico con trazabilidad completa, alertas claras y reportes listos para dirección.',
      heroCtaPrimary: 'Probar gratis 14 días',
      heroCtaSecondary: 'Agendar demostración',
      heroImageUrl: GENERATED_ASSETS.workspaceSaas,
      heroImageName: 'espacio-ingenieria.jpg',
    },
    ecommerce: {
      brandName: 'Taller Nord',
      tagline: 'Instrumentos y mobiliario técnico',
      heroEyebrow: 'Colección Permanente',
      heroHeadline: 'Objetos funcionales fabricados para durar décadas',
      heroSubheadline:
        'Cada pieza se produce en series cortas con aluminio anodizado, acero cepillado y acabados reparables con garantía directa de taller.',
      heroCtaPrimary: 'Explorar catálogo',
      heroCtaSecondary: 'Consultar envío',
      heroImageUrl: GENERATED_ASSETS.productHardware,
      heroImageName: 'hardware-estudio.jpg',
    },
    portfolio: {
      brandName: 'Estudio Bini & Asociados',
      tagline: 'Arquitectura contemporánea y espacios culturales',
      heroEyebrow: 'Madrid · Milán',
      heroHeadline: 'Arquitectura de hormigón visto, luz natural y proporción serena',
      heroSubheadline:
        'Proyectamos pabellones culturales, estudios creativos y viviendas sostenibles con enfoque constructivo honesto y precisión estructural.',
      heroCtaPrimary: 'Iniciar proyecto',
      heroCtaSecondary: 'Ver obras seleccionadas',
      heroImageUrl: GENERATED_ASSETS.studioArchitecture,
      heroImageName: 'arquitectura-estudio.jpg',
    },
    corporate: {
      brandName: 'Iberia Precisión Industrial',
      tagline: 'Automatización y manufactura avanzada',
      heroEyebrow: 'Certificación ISO 9001',
      heroHeadline: 'Soluciones de ingeniería industrial para líneas de alta exigencia',
      heroSubheadline:
        'Acompañamos a fabricantes europeos en la digitalización de planta, control metrológico y mantenimiento predictivo con resultados medibles.',
      heroCtaPrimary: 'Solicitar diagnóstico',
      heroCtaSecondary: 'Conocer capacidades',
      heroImageUrl: GENERATED_ASSETS.studioArchitecture,
      heroImageName: 'arquitectura-estudio.jpg',
    },
    editorial: {
      brandName: 'Cuaderno Técnico',
      tagline: 'Ensayos sobre diseño de sistemas y software',
      heroEyebrow: 'Edición Trimestral',
      heroHeadline: 'Investigación clara sobre arquitectura web, interfaces y oficio digital',
      heroSubheadline:
        'Artículos profundos, guías prácticas y casos documentados sin ruido publicitario, escritos por ingenieros y diseñadores en activo.',
      heroCtaPrimary: 'Suscribirse a la edición',
      heroCtaSecondary: 'Leer últimos informes',
      heroImageUrl: GENERATED_ASSETS.workspaceSaas,
      heroImageName: 'espacio-ingenieria.jpg',
    },
  };

  const specific = base[projectType];

  return {
    brandName: specific.brandName ?? 'Vektor Studio',
    tagline: specific.tagline ?? 'Diseño e ingeniería digital',
    logoDataUrl: null,
    heroEyebrow: specific.heroEyebrow ?? 'Edición 2026',
    heroHeadline:
      specific.heroHeadline ?? 'Construye experiencias digitales claras, rápidas y duraderas',
    heroSubheadline:
      specific.heroSubheadline ??
      'Arquitectura moderna optimizada para rendimiento real, mantenimiento sencillo y despliegue continuo.',
    heroCtaPrimary: specific.heroCtaPrimary ?? 'Empezar ahora',
    heroCtaSecondary: specific.heroCtaSecondary ?? 'Ver detalles',
    heroImageUrl: specific.heroImageUrl ?? GENERATED_ASSETS.productHardware,
    heroImageName: specific.heroImageName ?? 'portada.jpg',
    metrics: [
      {
        id: 'm1',
        value: '99,98%',
        label: 'Disponibilidad verificada',
        context: 'Últimos 12 meses en producción',
      },
      {
        id: 'm2',
        value: '< 0,6 s',
        label: 'Tiempo de carga inicial',
        context: 'Medido en redes móviles 4G',
      },
      {
        id: 'm3',
        value: '+140',
        label: 'Proyectos desplegados',
        context: 'Equipos en Europa y Latinoamérica',
      },
      {
        id: 'm4',
        value: '5 años',
        label: 'Garantía y soporte directo',
        context: 'Mantenimiento evolutivo incluido',
      },
    ],
    featuresHeading: 'Diseñado con rigor técnico de principio a fin',
    featuresSubheading:
      'Cada decisión estructural busca reducir fricción, acelerar la entrega y garantizar una experiencia impecable en cualquier pantalla.',
    features: [
      {
        id: 'f1',
        title: 'Arquitectura modular sin deuda técnica',
        description:
          'Componentes limpios y tipados que permiten ampliar páginas o integrar servicios externos sin reescribir la base.',
        metric: '100% TypeScript',
      },
      {
        id: 'f2',
        title: 'Rendimiento optimizado para buscadores',
        description:
          'Estructura semántica HTML5, carga eficiente de recursos y jerarquía visual calibrada para máxima legibilidad.',
        metric: 'Core Web Vitals A+',
      },
      {
        id: 'f3',
        title: 'Despliegue continuo automatizado',
        description:
          'Flujo conectado a GitHub para publicar cambios con trazabilidad completa y reversión en segundos.',
        metric: 'CI/CD integrado',
      },
    ],
    catalogHeading: 'Selección destacada',
    catalogSubheading: 'Referencias recientes con especificaciones completas y resultados documentados.',
    catalogItems: [
      {
        id: 'c1',
        title: 'Módulo Serie K-01',
        category: 'Hardware / Precisión',
        priceOrTag: '490 €',
        description:
          'Chasis mecanizado CNC en aluminio anodizado con interfaz táctil de respuesta instantánea.',
        imageUrl: GENERATED_ASSETS.productHardware,
      },
      {
        id: 'c2',
        title: 'Pabellón Norte',
        category: 'Espacio / Arquitectura',
        priceOrTag: '2026',
        description:
          'Rehabilitación integral de 680 m² con fachada acristalada de control térmico y patio de agua.',
        imageUrl: GENERATED_ASSETS.studioArchitecture,
      },
      {
        id: 'c3',
        title: 'Sistema de Ingeniería v3',
        category: 'Plataforma / Digital',
        priceOrTag: 'A medida',
        description:
          'Entorno unificado de planificación, control documental y despliegue automatizado para equipos.',
        imageUrl: GENERATED_ASSETS.workspaceSaas,
      },
    ],
    pricingHeading: 'Planes claros sin costes ocultos',
    pricingSubheading: 'Escoge el nivel de alcance que mejor se adapta a la etapa actual de tu equipo.',
    pricingPlans: [
      {
        id: 'p1',
        name: 'Esencial',
        audience: 'Para equipos en fase inicial',
        price: '29 €',
        cadence: '/ mes',
        featured: false,
        features: [
          'Hasta 3 proyectos activos',
          'Despliegue automático en GitHub',
          'Certificado SSL y dominio propio',
          'Soporte por correo en 24 h',
        ],
        ctaLabel: 'Elegir Esencial',
      },
      {
        id: 'p2',
        name: 'Profesional',
        audience: 'Para operaciones en crecimiento',
        price: '79 €',
        cadence: '/ mes',
        featured: true,
        features: [
          'Proyectos ilimitados y entornos previos',
          'Integración de API y base de datos',
          'Analítica avanzada y exportación CSV',
          'Soporte técnico prioritario',
        ],
        ctaLabel: 'Elegir Profesional',
      },
      {
        id: 'p3',
        name: 'Corporativo',
        audience: 'Para organizaciones con SLA dedicado',
        price: 'A medida',
        cadence: 'anual',
        featured: false,
        features: [
          'Arquitectura dedicada y auditoría',
          'Roles personalizados y SSO',
          'Acuerdo de nivel de servicio 99,99%',
          'Acompañamiento de ingeniería dedicado',
        ],
        ctaLabel: 'Contactar ventas',
      },
    ],
    testimonialsHeading: 'Lo que dicen quienes ya trabajan con nosotros',
    testimonials: [
      {
        id: 't1',
        quote:
          'Pasamos de tardar tres semanas en publicar una nueva campaña a desplegarla en menos de una tarde con un código que nuestro equipo entiende al instante.',
        author: 'Clara Mendoza',
        role: 'Directora de Producto',
        organization: 'Norte Sistemas',
      },
      {
        id: 't2',
        quote:
          'La claridad visual y la velocidad de carga elevaron nuestras solicitudes de presupuesto en un 38% durante el primer trimestre tras el rediseño.',
        author: 'Javier Soler',
        role: 'Socio Fundador',
        organization: 'Soler Ingeniería Industrial',
      },
    ],
    faqHeading: 'Preguntas frecuentes',
    faqs: [
      {
        id: 'q1',
        question: '¿Cuánto tiempo lleva poner en marcha el proyecto?',
        answer:
          'La primera versión funcional queda lista y publicada en menos de 48 horas tras validar el contenido y el dominio.',
      },
      {
        id: 'q2',
        question: '¿Puedo actualizar textos e imágenes por mi cuenta?',
        answer:
          'Sí. Todos los textos y referencias multimedia están centralizados en un archivo estructurado fácil de editar sin tocar la lógica del sitio.',
      },
      {
        id: 'q3',
        question: '¿El código es 100% de nuestra propiedad?',
        answer:
          'Totalmente. Todo el proyecto se aloja en tu propio repositorio de GitHub sin ataduras ni licencias cerradas.',
      },
    ],
    contactHeading: 'Hablemos de tu próximo lanzamiento',
    contactSubheading:
      'Cuéntanos brevemente tu objetivo y te responderemos con una propuesta técnica clara en menos de un día laborable.',
    contactEmail: 'contacto@proyecto-ejemplo.es',
    contactLocation: 'Madrid · Trabajo remoto internacional',
    footerNote: 'Todos los derechos reservados.',
  };
}
