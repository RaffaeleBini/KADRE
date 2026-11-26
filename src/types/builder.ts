export type StepId = 'welcome' | 'discovery' | 'template' | 'style' | 'content' | 'export';

export type ProjectType =
  | 'landing'
  | 'saas'
  | 'ecommerce'
  | 'portfolio'
  | 'editorial'
  | 'corporate';

export type ArchitectureMode = 'frontend-only' | 'light-api' | 'full-backend';

export type DatabaseNeed = 'none' | 'markdown-cms' | 'sql-relational';

export type RenderingStrategy = 'static-ssg' | 'spa-dynamic' | 'hybrid-ssr';

export type IntegrationOption =
  | 'contact-form'
  | 'payments'
  | 'auth'
  | 'analytics'
  | 'i18n';

export interface DiscoveryAnswers {
  projectType: ProjectType;
  architectureMode: ArchitectureMode;
  databaseNeed: DatabaseNeed;
  renderingStrategy: RenderingStrategy;
  integrations: IntegrationOption[];
}

export interface StackRecommendation {
  id: string;
  name: string;
  category: string;
  summary: string;
  frontend: string;
  backend: string;
  database: string;
  styling: string;
  deployTargets: string[];
  includesBackend: boolean;
  includesDatabase: boolean;
  rationale: string[];
  estimatedBuildTime: string;
  complexity: string;
}

export type SectionType =
  | 'hero'
  | 'metrics'
  | 'features'
  | 'catalog'
  | 'pricing'
  | 'testimonials'
  | 'faq'
  | 'contact';

export interface SectionConfig {
  id: string;
  type: SectionType;
  label: string;
  description: string;
  enabled: boolean;
  required?: boolean;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  bestFor: ProjectType[];
  heroLayout: 'split' | 'centered' | 'editorial';
  previewImage: string;
  defaultSections: SectionType[];
  highlights: string[];
}

export interface GraphicStylePreset {
  id: string;
  name: string;
  description: string;
  fontDisplay: string;
  fontBody: string;
  googleFontsQuery: string;
  borderRadius: string;
  buttonRadius: string;
  borderWidth: string;
  surfaceElevation: 'flat' | 'hairline' | 'framed';
  spacingDensity: 'compact' | 'balanced' | 'airy';
  headingTracking: string;
}

export interface ColorPatternPreset {
  id: string;
  name: string;
  description: string;
  mode: 'dark' | 'light';
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  accent: string;
  accentText: string;
  border: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  metric: string;
}

export interface CatalogItem {
  id: string;
  title: string;
  category: string;
  priceOrTag: string;
  description: string;
  imageUrl: string;
}

export interface MetricItem {
  id: string;
  value: string;
  label: string;
  context: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  audience: string;
  price: string;
  cadence: string;
  featured: boolean;
  features: string[];
  ctaLabel: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  organization: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SiteContent {
  brandName: string;
  tagline: string;
  logoDataUrl: string | null;
  heroEyebrow: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroImageUrl: string;
  heroImageName: string;
  metrics: MetricItem[];
  featuresHeading: string;
  featuresSubheading: string;
  features: FeatureItem[];
  catalogHeading: string;
  catalogSubheading: string;
  catalogItems: CatalogItem[];
  pricingHeading: string;
  pricingSubheading: string;
  pricingPlans: PricingPlan[];
  testimonialsHeading: string;
  testimonials: TestimonialItem[];
  faqHeading: string;
  faqs: FaqItem[];
  contactHeading: string;
  contactSubheading: string;
  contactEmail: string;
  contactLocation: string;
  footerNote: string;
}

export type DeployPlatform = 'github-pages' | 'vercel' | 'netlify' | 'cloudflare' | 'node-server';

export interface GithubExportConfig {
  username: string;
  repoName: string;
  visibility: 'public' | 'private';
  branch: string;
  deployPlatform: DeployPlatform;
}

export interface GeneratedFile {
  path: string;
  language: 'html' | 'typescript' | 'json' | 'css' | 'sql' | 'yaml' | 'markdown' | 'bash' | 'text';
  content: string;
  description: string;
}
