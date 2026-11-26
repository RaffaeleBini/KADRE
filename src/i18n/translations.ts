export type Locale = 'es' | 'it';

export interface AppTranslations {
  metaTitle: string;
  topBar: {
    navProcess: string;
    navArchitectures: string;
    navGithub: string;
    steps: {
      discovery: string;
      template: string;
      style: string;
      content: string;
      export: string;
    };
    toLightMode: string;
    toDarkMode: string;
    lightLabel: string;
    darkLabel: string;
    createWeb: string;
    reset: string;
    resetTitle: string;
    languageLabel: string;
  };
  welcome: {
    kicker: string;
    headline: string;
    subtitle: string;
    startCta: string;
    resumePrefix: string;
    previousDraft: string;
    metaSteps: string;
    metaPreview: string;
    metaOwnership: string;
    heroImgAlt: string;
    heroOverlayKicker: string;
    heroOverlayTitle: string;
    processHeading: string;
    processSubheading: string;
    stages: {
      index: string;
      title: string;
      description: string;
    }[];
    stacksHeading: string;
    stacksSubheading: string;
    supportedArchitectures: {
      name: string;
      stack: string;
      detail: string;
    }[];
    githubCardTitle: string;
    githubCardBody: string;
    githubBullets: string[];
    githubCardCta: string;
  };
  discovery: {
    stepTag: string;
    title: string;
    questionCounter: (current: number, total: number) => string;
    questionTabs: { id: number; short: string; title: string }[];
    multiSelectHint: string;
    liveRecalcHint: string;
    prevBtn: string;
    nextQuestionBtn: string;
    confirmStackBtn: string;
    autoRecommended: string;
    manualSelected: string;
    complexityLabel: string;
    layerFrontend: string;
    layerBackend: string;
    layerDatabase: string;
    layerDeploy: string;
    rationaleHeading: string;
    hideAlternatives: string;
    showAlternatives: string;
    optimalTag: string;
    plannedBadge: string;
    incompatibleBadge: string;
    continueTemplatesBtn: string;
  };
  template: {
    stepTag: string;
    title: string;
    activeStackLabel: string;
    selectBaseHeading: string;
    availableCount: (count: number) => string;
    recommendedTag: string;
    blocksHeading: (name: string) => string;
    blocksSubheading: string;
    activeSectionsCount: (enabled: number, total: number) => string;
    requiredTag: string;
    moveUpAria: (label: string) => string;
    moveDownAria: (label: string) => string;
    activeStatus: string;
    hiddenStatus: string;
    backBtn: string;
    nextBtn: string;
  };
  style: {
    stepTag: string;
    title: string;
    graphicHeading: string;
    radiusLabel: string;
    colorsHeading: string;
    darkAndLightNote: string;
    modeDark: string;
    modeLight: string;
    customAccentLabel: string;
    restoreOriginal: string;
    accentAria: (hex: string) => string;
    backBtn: string;
    nextBtn: string;
  };
  content: {
    stepTag: string;
    title: string;
    syncNote: string;
    tabs: {
      identity: string;
      sections: string;
      media: string;
      import: string;
    };
    brandName: string;
    tagline: string;
    heroEyebrow: string;
    heroHeadline: string;
    heroSubheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    contactEmail: string;
    contactLocation: string;
    featuresTitle: (count: number) => string;
    addBtn: string;
    pillarLabel: (idx: number) => string;
    deletePillarAria: string;
    titlePlaceholder: string;
    descPlaceholder: string;
    newFeatureTitle: string;
    newFeatureDesc: string;
    newFeatureMetric: string;
    catalogTitle: (count: number) => string;
    addItemBtn: string;
    newItemTitle: string;
    newItemCategory: string;
    newItemTag: string;
    newItemDesc: string;
    namePlaceholder: string;
    pricePlaceholder: string;
    deleteItemAria: string;
    faqsTitle: (count: number) => string;
    addFaqBtn: string;
    newFaqQuestion: string;
    newFaqAnswer: string;
    deleteFaqAria: string;
    logoHeading: string;
    uploadLogoBtn: string;
    removeLogoBtn: string;
    logoHint: string;
    heroImageHeading: string;
    heroImageDesc: string;
    uploadHeroBtn: string;
    jsonHeading: string;
    jsonDesc: string;
    downloadJsonBtn: string;
    importJsonBtn: string;
    jsonLoadedOk: (filename: string) => string;
    jsonLoadedError: string;
    presetsUpdatedOk: string;
    sectorPresetsHeading: string;
    sectorLabels: {
      landing: string;
      saas: string;
      ecommerce: string;
      portfolio: string;
      corporate: string;
      editorial: string;
    };
    backBtn: string;
    nextBtn: string;
  };
  preview: {
    liveLabel: string;
    desktop: string;
    tablet: string;
    mobile: string;
  };
  exportStep: {
    stepTag: string;
    title: string;
    filesReady: (count: number, stackName: string) => string;
    repoParamsHeading: string;
    customizesCommands: string;
    ghUserLabel: string;
    ghUserPlaceholder: string;
    ghRepoLabel: string;
    ghRepoPlaceholder: string;
    visibilityLabel: string;
    visibilityPublic: string;
    visibilityPrivate: string;
    branchLabel: string;
    deployPlatformLabel: string;
    platforms: {
      'github-pages': { label: string; note: string };
      vercel: { label: string; note: string };
      netlify: { label: string; note: string };
      cloudflare: { label: string; note: string };
      'node-server': { label: string; note: string };
    };
    packagingBtn: string;
    downloadZipBtn: (repo: string) => string;
    downloadScriptBtn: (filename: string) => string;
    guideHeading: string;
    guideSubheading: string;
    gitStandard: string;
    githubCli: string;
    step1Title: string;
    openGithub: string;
    step1BodyPrefix: string;
    step1BodyMiddle: string;
    step1BodySuffix: string;
    step2Title: string;
    step2BodyPrefix: string;
    step2BodySuffix: string;
    step3Title: string;
    step3BodyGit: (scriptName: string) => string;
    step3BodyGh: string;
    step4Title: (platformLabel: string) => string;
    step4Pages1: string;
    step4Pages2: string;
    step4Pages3Prefix: string;
    step4Pages3Middle: string;
    step4Other1Prefix: string;
    step4Other1Suffix: string;
    step4Other2Prefix: string;
    step4Other2Branch: string;
    step4Other3Build: string;
    step4Other3Out: string;
    step4Other3Db: string;
    step4Node1: string;
    step4Node2Build: string;
    step4Node2Start: string;
    copy: string;
    copied: string;
    copyFile: string;
    fileCopied: string;
    explorerHeading: string;
    linesCount: (n: number) => string;
    backBtn: string;
  };
  footer: {
    left: string;
    rightWelcome: string;
    rightActive: (brand: string) => string;
  };
}

export const TRANSLATIONS: Record<Locale, AppTranslations> = {
  es: {
    metaTitle: 'KADRE — Diseño y Exportación Web Automatizada',
    topBar: {
      navProcess: 'Proceso guiado',
      navArchitectures: 'Arquitecturas',
      navGithub: 'Exportación GitHub',
      steps: {
        discovery: '01. Arquitectura',
        template: '02. Plantilla',
        style: '03. Estilo',
        content: '04. Contenido',
        export: '05. GitHub',
      },
      toLightMode: 'Cambiar a modo claro',
      toDarkMode: 'Cambiar a modo oscuro',
      lightLabel: 'Modo claro',
      darkLabel: 'Modo oscuro',
      createWeb: 'Crear web',
      reset: 'Reiniciar',
      resetTitle: 'Reiniciar configuración del proyecto',
      languageLabel: 'Seleccionar idioma',
    },
    welcome: {
      kicker: 'Sistema guiado de arquitectura y generación web',
      headline: 'Diseña tu página web paso a paso y expórtala lista para GitHub',
      subtitle:
        'KADRE analiza tus requisitos técnicos para recomendar el stack adecuado, propone plantillas y estilos personalizables, simplifica la carga de contenidos y genera el repositorio completo con instrucciones exactas de despliegue.',
      startCta: 'Comenzar diseño guiado',
      resumePrefix: 'Reanudar',
      previousDraft: 'Borrador anterior',
      metaSteps: '5 pasos guiados',
      metaPreview: 'Vista previa en tiempo real',
      metaOwnership: 'Código fuente propio sin ataduras',
      heroImgAlt: 'Consola industrial de diseño web y planos arquitectónicos digitales',
      heroOverlayKicker: 'Arquitectura + Diseño + Repositorio',
      heroOverlayTitle: 'Del diagnóstico inicial al primer despliegue en producción',
      processHeading: 'Flujo estructurado en cuatro etapas',
      processSubheading:
        'Cada decisión se refleja inmediatamente en la vista previa y en el código final.',
      stages: [
        {
          index: '01',
          title: 'Diagnóstico técnico',
          description:
            'Responde cinco preguntas clave sobre tu objetivo, servidor, datos y renderizado para identificar la arquitectura óptima.',
        },
        {
          index: '02',
          title: 'Plantillas adaptadas',
          description:
            'Explora estructuras propuestas según tu diagnóstico y activa, oculta o reordena cada bloque de la página.',
        },
        {
          index: '03',
          title: 'Estilo y contenidos',
          description:
            'Selecciona el sistema tipográfico, patrón de colores y carga textos, imágenes o archivos JSON con vista previa en vivo.',
        },
        {
          index: '04',
          title: 'Exportación a GitHub',
          description:
            'Genera el código completo listo para compilar, descarga el paquete del repositorio y sigue la guía paso a paso de despliegue.',
        },
      ],
      stacksHeading: 'Selección automática del stack técnico',
      stacksSubheading:
        'No necesitas decidir a ciegas entre un sitio estático o un servidor completo. El cuestionario técnico evalúa si requieres lógica backend, base de datos o renderizado estático y genera la estructura exacta.',
      supportedArchitectures: [
        {
          name: 'Estática Ultrarrápida (SSG)',
          stack: 'React + Vite + Tailwind',
          detail: 'Cero mantenimiento de servidor y publicación gratuita directa en GitHub Pages.',
        },
        {
          name: 'Aplicación Dinámica (SPA)',
          stack: 'React + TypeScript + JSON',
          detail: 'Navegación instantánea y catálogos interactivos preparados para CMS externo.',
        },
        {
          name: 'Frontend + API Ligera',
          stack: 'React + Express + Rutas API',
          detail: 'Incluye servidor Node.js para procesar formularios, envíos y webhooks seguros.',
        },
        {
          name: 'Full-Stack con Base de Datos',
          stack: 'React + Express + Esquema SQL',
          detail: 'Estructura completa con tablas relacionales listas para PostgreSQL y autenticación.',
        },
      ],
      githubCardTitle: 'Entrega lista para GitHub',
      githubCardBody:
        'Al finalizar obtienes el código completo empaquetado con tus imágenes locales, flujo automático de GitHub Actions y un asistente interactivo que genera los comandos Git exactos para tu usuario y repositorio.',
      githubBullets: [
        'Paquete ZIP con código fuente, estilos y recursos multimedia',
        'Script automatizado exportar-github.sh preconfigurado',
        'Guía paso a paso para GitHub Pages, Vercel, Netlify o Cloudflare',
      ],
      githubCardCta: 'Iniciar asistente ahora',
    },
    discovery: {
      stepTag: 'Paso 1 de 5 · Diagnóstico de arquitectura',
      title: 'Definamos el mejor stack técnico para tu proyecto',
      questionCounter: (c, t) => `Pregunta ${c} de ${t}`,
      questionTabs: [
        { id: 0, short: '01. Objetivo', title: '¿Qué tipo de página o solución deseas construir?' },
        { id: 1, short: '02. Servidor', title: '¿Necesitas lógica de servidor o solo frontend?' },
        { id: 2, short: '03. Datos', title: '¿Cómo quieres gestionar y almacenar los datos?' },
        { id: 3, short: '04. Renderizado', title: '¿Qué modelo de carga y rendimiento prefieres?' },
        { id: 4, short: '05. Integraciones', title: '¿Qué capacidades adicionales deseas incluir?' },
      ],
      multiSelectHint: 'Selecciona todas las integraciones que necesites (opcional).',
      liveRecalcHint: 'El panel derecho recalcula tu arquitectura recomendada en tiempo real.',
      prevBtn: 'Anterior',
      nextQuestionBtn: 'Siguiente pregunta',
      confirmStackBtn: 'Confirmar stack y elegir plantilla',
      autoRecommended: 'Stack recomendado automáticamente',
      manualSelected: 'Stack seleccionado manualmente',
      complexityLabel: 'Complejidad',
      layerFrontend: 'Frontend',
      layerBackend: 'Backend / API',
      layerDatabase: 'Persistencia',
      layerDeploy: 'Despliegue ideal',
      rationaleHeading: 'Por qué encaja con tus respuestas',
      hideAlternatives: 'Ocultar otros stacks disponibles',
      showAlternatives: '¿Prefieres elegir otro stack manualmente?',
      optimalTag: 'Óptimo',
      plannedBadge: 'Próximamente',
      incompatibleBadge: 'No disponible',
      continueTemplatesBtn: 'Continuar a plantillas',
    },
    template: {
      stepTag: 'Paso 2 de 5 · Plantillas personalizables',
      title: 'Propuestas de estructura basadas en tu diagnóstico',
      activeStackLabel: 'Stack activo',
      selectBaseHeading: 'Selecciona una plantilla base',
      availableCount: (c) => `${c} plantillas disponibles · Ordenadas por compatibilidad`,
      recommendedTag: 'Recomendada',
      blocksHeading: (name) => `Estructura de bloques de «${name}»`,
      blocksSubheading:
        'Activa, desactiva o reordena las secciones que aparecerán en la página generada.',
      activeSectionsCount: (e, t) => `${e} de ${t} secciones activas`,
      requiredTag: 'Obligatoria',
      moveUpAria: (label) => `Subir ${label}`,
      moveDownAria: (label) => `Bajar ${label}`,
      activeStatus: 'Activa',
      hiddenStatus: 'Oculta',
      backBtn: 'Volver a arquitectura',
      nextBtn: 'Personalizar estilo y colores',
    },
    style: {
      stepTag: 'Paso 3 de 5 · Dirección visual y paleta',
      title: 'Elige el estilo gráfico y patrón de colores',
      graphicHeading: 'Estilo gráfico y tipografía',
      radiusLabel: 'Radio',
      colorsHeading: 'Patrones de colores',
      darkAndLightNote: 'Oscuros y claros',
      modeDark: 'Oscuro',
      modeLight: 'Claro',
      customAccentLabel: 'Ajuste fino de color de acento',
      restoreOriginal: 'Restaurar original',
      accentAria: (hex) => `Color de acento ${hex}`,
      backBtn: 'Volver a plantillas',
      nextBtn: 'Cargar contenidos de la página',
    },
    content: {
      stepTag: 'Paso 4 de 5 · Gestor de contenidos',
      title: 'Carga textos, imágenes y datos de tu sitio',
      syncNote:
        'Todos los cambios se sincronizan al instante con la vista previa y el archivo JSON exportado.',
      tabs: {
        identity: 'Portada',
        sections: 'Bloques',
        media: 'Imágenes',
        import: 'JSON / Presets',
      },
      brandName: 'Nombre de la marca o proyecto',
      tagline: 'Lema o descriptor breve',
      heroEyebrow: 'Antetítulo de portada',
      heroHeadline: 'Titular principal (H1)',
      heroSubheadline: 'Descripción de portada',
      ctaPrimary: 'Botón principal',
      ctaSecondary: 'Botón secundario',
      contactEmail: 'Correo de contacto',
      contactLocation: 'Ubicación / Zona horaria',
      featuresTitle: (c) => `Capacidades / Pilares (${c})`,
      addBtn: 'Añadir',
      pillarLabel: (i) => `Pilar 0${i}`,
      deletePillarAria: 'Eliminar pilar',
      titlePlaceholder: 'Título',
      descPlaceholder: 'Descripción',
      newFeatureTitle: 'Nueva capacidad',
      newFeatureDesc: 'Describe el beneficio concreto para el usuario.',
      newFeatureMetric: 'Estándar',
      catalogTitle: (c) => `Catálogo / Casos destacados (${c})`,
      addItemBtn: 'Añadir elemento',
      newItemTitle: 'Nueva referencia',
      newItemCategory: 'Categoría',
      newItemTag: 'Nuevo',
      newItemDesc: 'Resumen técnico o comercial del elemento.',
      namePlaceholder: 'Nombre',
      pricePlaceholder: 'Precio o año',
      deleteItemAria: 'Eliminar elemento',
      faqsTitle: (c) => `Preguntas frecuentes (${c})`,
      addFaqBtn: 'Añadir pregunta',
      newFaqQuestion: '¿Nueva pregunta frecuente?',
      newFaqAnswer: 'Respuesta clara y directa para tus visitantes.',
      deleteFaqAria: 'Eliminar pregunta',
      logoHeading: 'Logotipo de la marca (opcional)',
      uploadLogoBtn: 'Subir logotipo',
      removeLogoBtn: 'Quitar logotipo',
      logoHint: 'PNG, SVG o WebP',
      heroImageHeading: 'Imagen principal de portada',
      heroImageDesc:
        'Sube tu propia fotografía (se incluirá automáticamente en public/assets/ al exportar) o elige una imagen del estudio.',
      uploadHeroBtn: 'Cargar imagen desde tu equipo',
      jsonHeading: 'Carga masiva mediante JSON',
      jsonDesc:
        'Descarga la estructura actual de contenidos, edítala en cualquier editor o pásala a tu equipo de redacción, y vuelve a subir el archivo JSON aquí.',
      downloadJsonBtn: 'Descargar siteContent.json',
      importJsonBtn: 'Importar JSON',
      jsonLoadedOk: (f) => `Contenidos cargados correctamente desde ${f}.`,
      jsonLoadedError:
        'El archivo JSON no tiene la estructura esperada. Descarga primero la plantilla de ejemplo.',
      presetsUpdatedOk: 'Textos e imágenes de ejemplo actualizados al sector elegido.',
      sectorPresetsHeading: 'Cargar textos de ejemplo por sector',
      sectorLabels: {
        landing: 'Hardware / Producto',
        saas: 'Plataforma SaaS',
        ecommerce: 'Catálogo / Taller',
        portfolio: 'Estudio Arquitectura',
        corporate: 'Industrial B2B',
        editorial: 'Editorial Técnico',
      },
      backBtn: 'Volver a estilo',
      nextBtn: 'Generar código y exportar a GitHub',
    },
    preview: {
      liveLabel: 'Vista previa en vivo',
      desktop: 'Escritorio',
      tablet: 'Tablet',
      mobile: 'Móvil',
    },
    exportStep: {
      stepTag: 'Paso 5 de 5 · Exportación y despliegue en GitHub',
      title: 'Código generado y guía paso a paso de publicación',
      filesReady: (c, s) => `${c} archivos listos · ${s}`,
      repoParamsHeading: 'Parámetros del repositorio GitHub',
      customizesCommands: 'Personaliza comandos',
      ghUserLabel: 'Usuario u organización GitHub',
      ghUserPlaceholder: 'tu-usuario',
      ghRepoLabel: 'Nombre del repositorio',
      ghRepoPlaceholder: 'mi-web',
      visibilityLabel: 'Visibilidad',
      visibilityPublic: 'Público',
      visibilityPrivate: 'Privado',
      branchLabel: 'Rama principal',
      deployPlatformLabel: 'Plataforma de despliegue destino',
      platforms: {
        'github-pages': { label: 'GitHub Pages', note: 'Gratuito vía GitHub Actions' },
        vercel: { label: 'Vercel', note: 'Despliegue instantáneo con vista previa' },
        netlify: { label: 'Netlify', note: 'CDN global y formularios integrados' },
        cloudflare: { label: 'Cloudflare Pages', note: 'Red Edge sin límite de ancho de banda' },
        'node-server': { label: 'Servidor Node', note: 'Render, Railway u otro hosting Node' },
      },
      packagingBtn: 'Empaquetando proyecto...',
      downloadZipBtn: (repo) => `Descargar paquete ZIP (${repo})`,
      downloadScriptBtn: (filename) => `Descargar script ${filename}`,
      guideHeading: 'Instrucciones paso a paso para GitHub y despliegue',
      guideSubheading:
        'Marca cada paso conforme lo completes. Los comandos ya incluyen tus datos.',
      gitStandard: 'Git estándar',
      githubCli: 'GitHub CLI (gh)',
      step1Title: 'Crear el repositorio vacío en GitHub',
      openGithub: 'Abrir GitHub',
      step1BodyPrefix: 'Crea un nuevo repositorio llamado',
      step1BodyMiddle: 'con visibilidad',
      step1BodySuffix:
        'No marques las casillas de README ni .gitignore (ya vienen incluidos en el paquete).',
      step2Title: 'Descomprimir el paquete y probar en local (opcional)',
      step2BodyPrefix: 'Extrae el ZIP en una carpeta llamada',
      step2BodySuffix: 'y abre una terminal dentro de ella:',
      step3Title: 'Exportar y subir el código a GitHub',
      step3BodyGit: (script) =>
        `Ejecuta estos comandos (o simplemente ejecuta ./${script} en macOS/Linux):`,
      step3BodyGh:
        'Crea el repositorio y sube todos los archivos en un solo paso usando GitHub CLI:',
      step4Title: (plat) => `Activar el despliegue automático en ${plat}`,
      step4Pages1: '1. En tu repositorio de GitHub entra a Settings → Pages.',
      step4Pages2: '2. En el apartado Source, selecciona GitHub Actions.',
      step4Pages3Prefix: '3. El flujo',
      step4Pages3Middle: 'publicará tu web automáticamente en',
      step4Other1Prefix: '1. Inicia sesión en',
      step4Other1Suffix: 'y selecciona Import Git Repository.',
      step4Other2Prefix: '2. Selecciona',
      step4Other2Branch: 'rama',
      step4Other3Build: '3. Comando de compilación:',
      step4Other3Out: 'Carpeta de salida:',
      step4Other3Db: ' Añade también la variable DATABASE_URL en la configuración de entorno.',
      step4Node1: '1. En tu hosting Node (Render, Railway…) crea un servicio web conectado al repositorio',
      step4Node2Build: '2. Comando de compilación:',
      step4Node2Start: '· Comando de arranque:',
      copy: 'Copiar',
      copied: 'Copiado',
      copyFile: 'Copiar archivo',
      fileCopied: 'Archivo copiado',
      explorerHeading: 'Explorador de código generado',
      linesCount: (n) => `${n} líneas`,
      backBtn: 'Volver a contenidos',
    },
    footer: {
      left: 'KADRE · Generador guiado de arquitectura web y exportación a GitHub',
      rightWelcome: '@2026 Raffaele Bini',
      rightActive: () => '@2026 Raffaele Bini',
    },
  },

  it: {
    metaTitle: 'KADRE — Progettazione ed Esportazione Web Automatizzata',
    topBar: {
      navProcess: 'Processo guidato',
      navArchitectures: 'Architetture',
      navGithub: 'Esportazione GitHub',
      steps: {
        discovery: '01. Architettura',
        template: '02. Modello',
        style: '03. Stile',
        content: '04. Contenuti',
        export: '05. GitHub',
      },
      toLightMode: 'Passa alla modalità chiara',
      toDarkMode: 'Passa alla modalità scura',
      lightLabel: 'Modalità chiara',
      darkLabel: 'Modalità scura',
      createWeb: 'Crea sito',
      reset: 'Reimposta',
      resetTitle: 'Reimposta la configurazione del progetto',
      languageLabel: 'Seleziona lingua',
    },
    welcome: {
      kicker: 'Sistema guidato di architettura e generazione web',
      headline: 'Progetta il tuo sito web passo dopo passo ed esportalo pronto per GitHub',
      subtitle:
        'KADRE analizza i tuoi requisiti tecnici per consigliare lo stack ideale, propone modelli e stili personalizzabili, semplifica il caricamento dei contenuti e genera il repository completo con istruzioni precise di pubblicazione.',
      startCta: 'Inizia progettazione guidata',
      resumePrefix: 'Riprendi',
      previousDraft: 'Bozza precedente',
      metaSteps: '5 passaggi guidati',
      metaPreview: 'Anteprima in tempo reale',
      metaOwnership: 'Codice sorgente tuo senza vincoli',
      heroImgAlt: 'Console industriale di progettazione web e disegni architettonici digitali',
      heroOverlayKicker: 'Architettura + Design + Repository',
      heroOverlayTitle: 'Dalla diagnosi iniziale al primo deploy in produzione',
      processHeading: 'Flusso strutturato in quattro fasi',
      processSubheading:
        'Ogni scelta si riflette istantaneamente nell’anteprima dal vivo e nel codice finale.',
      stages: [
        {
          index: '01',
          title: 'Diagnosi tecnica',
          description:
            'Rispondi a cinque domande chiave su obiettivo, server, dati e rendering per individuare l’architettura ottimale.',
        },
        {
          index: '02',
          title: 'Modelli adattati',
          description:
            'Esplora le strutture proposte in base alla tua diagnosi e attiva, nascondi o riordina ogni sezione della pagina.',
        },
        {
          index: '03',
          title: 'Stile e contenuti',
          description:
            'Scegli tipografia e palette cromatica, quindi carica testi, immagini o file JSON con anteprima in tempo reale.',
        },
        {
          index: '04',
          title: 'Esportazione su GitHub',
          description:
            'Genera il codice pronto alla compilazione, scarica il pacchetto del repository e segui la guida passo dopo passo.',
        },
      ],
      stacksHeading: 'Selezione automatica dello stack tecnico',
      stacksSubheading:
        'Non serve scegliere alla cieca tra un sito statico e un server completo. Il questionario tecnico valuta backend, database e rendering statico per generare la struttura esatta.',
      supportedArchitectures: [
        {
          name: 'Statica Ultraveloce (SSG)',
          stack: 'React + Vite + Tailwind',
          detail: 'Zero manutenzione server e pubblicazione gratuita diretta su GitHub Pages.',
        },
        {
          name: 'Applicazione Dinamica (SPA)',
          stack: 'React + TypeScript + JSON',
          detail: 'Navigazione istantanea e cataloghi interattivi pronti per CMS esterno.',
        },
        {
          name: 'Frontend + API Leggera',
          stack: 'React + Express + Rotte API',
          detail: 'Include server Node.js per gestire moduli, invii e webhook in sicurezza.',
        },
        {
          name: 'Full-Stack con Database',
          stack: 'React + Express + Schema SQL',
          detail: 'Struttura completa con tabelle relazionali pronte per PostgreSQL e autenticazione.',
        },
      ],
      githubCardTitle: 'Consegna pronta per GitHub',
      githubCardBody:
        'Al termine ottieni il codice completo impacchettato con le tue immagini locali, il flusso automatico GitHub Actions e una guida interattiva che prepara i comandi Git esatti per il tuo account.',
      githubBullets: [
        'Pacchetto ZIP con codice sorgente, stili e risorse multimediali',
        'Script automatizzato esporta-github.sh già preconfigurato',
        'Guida passo dopo passo per GitHub Pages, Vercel, Netlify o Cloudflare',
      ],
      githubCardCta: 'Avvia l’assistente ora',
    },
    discovery: {
      stepTag: 'Passo 1 di 5 · Diagnosi di architettura',
      title: 'Definiamo lo stack tecnico migliore per il tuo progetto',
      questionCounter: (c, t) => `Domanda ${c} di ${t}`,
      questionTabs: [
        { id: 0, short: '01. Obiettivo', title: 'Che tipo di pagina o soluzione vuoi realizzare?' },
        { id: 1, short: '02. Server', title: 'Ti serve logica lato server o solo frontend?' },
        { id: 2, short: '03. Dati', title: 'Come preferisci gestire e archiviare i dati?' },
        { id: 3, short: '04. Rendering', title: 'Quale modello di caricamento e prestazioni preferisci?' },
        { id: 4, short: '05. Integrazioni', title: 'Quali funzionalità aggiuntive vuoi includere?' },
      ],
      multiSelectHint: 'Seleziona tutte le integrazioni di cui hai bisogno (opzionale).',
      liveRecalcHint: 'Il pannello a destra ricalcola l’architettura consigliata in tempo reale.',
      prevBtn: 'Indietro',
      nextQuestionBtn: 'Domanda successiva',
      confirmStackBtn: 'Conferma stack e scegli modello',
      autoRecommended: 'Stack consigliato automaticamente',
      manualSelected: 'Stack selezionato manualmente',
      complexityLabel: 'Complessità',
      layerFrontend: 'Frontend',
      layerBackend: 'Backend / API',
      layerDatabase: 'Persistenza',
      layerDeploy: 'Deploy ideale',
      rationaleHeading: 'Perché si adatta alle tue risposte',
      hideAlternatives: 'Nascondi altri stack disponibili',
      showAlternatives: 'Preferisci scegliere un altro stack manualmente?',
      optimalTag: 'Ottimale',
      plannedBadge: 'In arrivo',
      incompatibleBadge: 'Non disponibile',
      continueTemplatesBtn: 'Continua ai modelli',
    },
    template: {
      stepTag: 'Passo 2 di 5 · Modelli personalizzabili',
      title: 'Proposte di struttura basate sulla tua diagnosi',
      activeStackLabel: 'Stack attivo',
      selectBaseHeading: 'Seleziona un modello di partenza',
      availableCount: (c) => `${c} modelli disponibili · Ordinati per compatibilità`,
      recommendedTag: 'Consigliato',
      blocksHeading: (name) => `Struttura delle sezioni di «${name}»`,
      blocksSubheading:
        'Attiva, nascondi o riordina le sezioni che appariranno nella pagina generata.',
      activeSectionsCount: (e, t) => `${e} di ${t} sezioni attive`,
      requiredTag: 'Obbligatoria',
      moveUpAria: (label) => `Sposta su ${label}`,
      moveDownAria: (label) => `Sposta giù ${label}`,
      activeStatus: 'Attiva',
      hiddenStatus: 'Nascosta',
      backBtn: 'Torna all’architettura',
      nextBtn: 'Personalizza stile e colori',
    },
    style: {
      stepTag: 'Passo 3 di 5 · Direzione visiva e palette',
      title: 'Scegli stile grafico e schema colori',
      graphicHeading: 'Stile grafico e tipografia',
      radiusLabel: 'Raggio',
      colorsHeading: 'Schemi di colore',
      darkAndLightNote: 'Scuri e chiari',
      modeDark: 'Scuro',
      modeLight: 'Chiaro',
      customAccentLabel: 'Regolazione fine del colore di accento',
      restoreOriginal: 'Ripristina originale',
      accentAria: (hex) => `Colore di accento ${hex}`,
      backBtn: 'Torna ai modelli',
      nextBtn: 'Carica i contenuti della pagina',
    },
    content: {
      stepTag: 'Passo 4 di 5 · Gestione contenuti',
      title: 'Carica testi, immagini e dati del tuo sito',
      syncNote:
        'Tutte le modifiche si aggiornano all’istante nell’anteprima e nel file JSON esportato.',
      tabs: {
        identity: 'Copertina',
        sections: 'Sezioni',
        media: 'Immagini',
        import: 'JSON / Preset',
      },
      brandName: 'Nome del brand o progetto',
      tagline: 'Slogan o breve descrizione',
      heroEyebrow: 'Occhiello di copertina',
      heroHeadline: 'Titolo principale (H1)',
      heroSubheadline: 'Descrizione di copertina',
      ctaPrimary: 'Pulsante principale',
      ctaSecondary: 'Pulsante secondario',
      contactEmail: 'Email di contatto',
      contactLocation: 'Sede / Fuso orario',
      featuresTitle: (c) => `Capacità / Pilastri (${c})`,
      addBtn: 'Aggiungi',
      pillarLabel: (i) => `Pilastro 0${i}`,
      deletePillarAria: 'Elimina pilastro',
      titlePlaceholder: 'Titolo',
      descPlaceholder: 'Descrizione',
      newFeatureTitle: 'Nuova funzionalità',
      newFeatureDesc: 'Descrivi il beneficio concreto per l’utente.',
      newFeatureMetric: 'Standard',
      catalogTitle: (c) => `Catalogo / Casi in evidenza (${c})`,
      addItemBtn: 'Aggiungi elemento',
      newItemTitle: 'Nuovo riferimento',
      newItemCategory: 'Categoria',
      newItemTag: 'Nuovo',
      newItemDesc: 'Sintesi tecnica o commerciale dell’elemento.',
      namePlaceholder: 'Nome',
      pricePlaceholder: 'Prezzo o anno',
      deleteItemAria: 'Elimina elemento',
      faqsTitle: (c) => `Domande frequenti (${c})`,
      addFaqBtn: 'Aggiungi domanda',
      newFaqQuestion: 'Nuova domanda frequente?',
      newFaqAnswer: 'Risposta chiara e diretta per i tuoi visitatori.',
      deleteFaqAria: 'Elimina domanda',
      logoHeading: 'Logo del brand (opzionale)',
      uploadLogoBtn: 'Carica logo',
      removeLogoBtn: 'Rimuovi logo',
      logoHint: 'PNG, SVG o WebP',
      heroImageHeading: 'Immagine principale di copertina',
      heroImageDesc:
        'Carica una tua fotografia (verrà inclusa automaticamente in public/assets/ all’esportazione) oppure scegli una foto dello studio.',
      uploadHeroBtn: 'Carica immagine dal dispositivo',
      jsonHeading: 'Caricamento rapido tramite JSON',
      jsonDesc:
        'Scarica la struttura attuale dei contenuti, modificala con il tuo editor o condividila con il team redazionale e ricarica il file JSON qui.',
      downloadJsonBtn: 'Scarica siteContent.json',
      importJsonBtn: 'Importa JSON',
      jsonLoadedOk: (f) => `Contenuti caricati correttamente da ${f}.`,
      jsonLoadedError:
        'Il file JSON non rispetta la struttura attesa. Scarica prima il file di esempio.',
      presetsUpdatedOk: 'Testi e immagini di esempio aggiornati al settore selezionato.',
      sectorPresetsHeading: 'Carica testi di esempio per settore',
      sectorLabels: {
        landing: 'Hardware / Prodotto',
        saas: 'Piattaforma SaaS',
        ecommerce: 'Catalogo / Atelier',
        portfolio: 'Studio Architettura',
        corporate: 'Industriale B2B',
        editorial: 'Editoriale Tecnico',
      },
      backBtn: 'Torna allo stile',
      nextBtn: 'Genera codice ed esporta su GitHub',
    },
    preview: {
      liveLabel: 'Anteprima dal vivo',
      desktop: 'Desktop',
      tablet: 'Tablet',
      mobile: 'Mobile',
    },
    exportStep: {
      stepTag: 'Passo 5 di 5 · Esportazione e deploy su GitHub',
      title: 'Codice generato e guida passo dopo passo alla pubblicazione',
      filesReady: (c, s) => `${c} file pronti · ${s}`,
      repoParamsHeading: 'Parametri del repository GitHub',
      customizesCommands: 'Personalizza comandi',
      ghUserLabel: 'Utente o organizzazione GitHub',
      ghUserPlaceholder: 'tuo-utente',
      ghRepoLabel: 'Nome del repository',
      ghRepoPlaceholder: 'mio-sito',
      visibilityLabel: 'Visibilità',
      visibilityPublic: 'Pubblico',
      visibilityPrivate: 'Privato',
      branchLabel: 'Branch principale',
      deployPlatformLabel: 'Piattaforma di pubblicazione',
      platforms: {
        'github-pages': { label: 'GitHub Pages', note: 'Gratuito tramite GitHub Actions' },
        vercel: { label: 'Vercel', note: 'Deploy istantaneo con anteprima' },
        netlify: { label: 'Netlify', note: 'CDN globale e moduli integrati' },
        cloudflare: { label: 'Cloudflare Pages', note: 'Rete Edge senza limiti di banda' },
        'node-server': { label: 'Server Node', note: 'Render, Railway o altro hosting Node' },
      },
      packagingBtn: 'Creazione pacchetto in corso...',
      downloadZipBtn: (repo) => `Scarica pacchetto ZIP (${repo})`,
      downloadScriptBtn: (filename) => `Scarica script ${filename}`,
      guideHeading: 'Istruzioni passo dopo passo per GitHub e deploy',
      guideSubheading:
        'Spunta ogni passaggio man mano che procedi. I comandi includono già i tuoi dati.',
      gitStandard: 'Git standard',
      githubCli: 'GitHub CLI (gh)',
      step1Title: 'Crea il repository vuoto su GitHub',
      openGithub: 'Apri GitHub',
      step1BodyPrefix: 'Crea un nuovo repository chiamato',
      step1BodyMiddle: 'con visibilità',
      step1BodySuffix:
        'Non selezionare README né .gitignore (sono già inclusi nel pacchetto scaricato).',
      step2Title: 'Estrai il pacchetto e verifica in locale (opzionale)',
      step2BodyPrefix: 'Estrai il file ZIP in una cartella chiamata',
      step2BodySuffix: 'e apri un terminale al suo interno:',
      step3Title: 'Esporta e carica il codice su GitHub',
      step3BodyGit: (script) =>
        `Esegui questi comandi (oppure avvia direttamente ./${script} su macOS/Linux):`,
      step3BodyGh:
        'Crea il repository e carica tutti i file in un solo comando con GitHub CLI:',
      step4Title: (plat) => `Attiva la pubblicazione automatica su ${plat}`,
      step4Pages1: '1. Nel tuo repository GitHub apri Settings → Pages.',
      step4Pages2: '2. Nella sezione Source, seleziona GitHub Actions.',
      step4Pages3Prefix: '3. Il workflow',
      step4Pages3Middle: 'pubblicherà automaticamente il sito su',
      step4Other1Prefix: '1. Accedi a',
      step4Other1Suffix: 'e seleziona Import Git Repository.',
      step4Other2Prefix: '2. Seleziona',
      step4Other2Branch: 'branch',
      step4Other3Build: '3. Comando di build:',
      step4Other3Out: 'Cartella di output:',
      step4Other3Db: ' Aggiungi anche la variabile DATABASE_URL nelle impostazioni di ambiente.',
      step4Node1: '1. Sul tuo hosting Node (Render, Railway…) crea un servizio web collegato al repository',
      step4Node2Build: '2. Comando di build:',
      step4Node2Start: '· Comando di avvio:',
      copy: 'Copia',
      copied: 'Copiato',
      copyFile: 'Copia file',
      fileCopied: 'File copiato',
      explorerHeading: 'Esploratore del codice generato',
      linesCount: (n) => `${n} righe`,
      backBtn: 'Torna ai contenuti',
    },
    footer: {
      left: 'KADRE · Generatore guidato di architetture web ed esportazione GitHub',
      rightWelcome: '@2026 Raffaele Bini',
      rightActive: () => '@2026 Raffaele Bini',
    },
  },
};
