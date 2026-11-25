import { ArrowRight, Layers, Cpu, Palette, GitBranch, FolderDown } from 'lucide-react';
import { GENERATED_ASSETS } from '../data/presets';

interface WelcomeViewProps {
  hasSavedDraft: boolean;
  savedBrandName?: string;
  onStartNew: () => void;
  onResumeDraft: () => void;
}

const PROCESS_STAGES = [
  {
    index: '01',
    title: 'Diagnóstico técnico',
    description:
      'Responde cinco preguntas clave sobre tu objetivo, servidor, datos y renderizado para identificar la arquitectura óptima.',
    icon: Cpu,
  },
  {
    index: '02',
    title: 'Plantillas adaptadas',
    description:
      'Explora estructuras propuestas según tu diagnóstico y activa, oculta o reordena cada bloque de la página.',
    icon: Layers,
  },
  {
    index: '03',
    title: 'Estilo y contenidos',
    description:
      'Selecciona el sistema tipográfico, patrón de colores y carga textos, imágenes o archivos JSON con vista previa en vivo.',
    icon: Palette,
  },
  {
    index: '04',
    title: 'Exportación a GitHub',
    description:
      'Genera el código completo listo para compilar, descarga el paquete del repositorio y sigue la guía paso a paso de despliegue.',
    icon: GitBranch,
  },
];

const SUPPORTED_ARCHITECTURES = [
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
];

export function WelcomeView({
  hasSavedDraft,
  savedBrandName,
  onStartNew,
  onResumeDraft,
}: WelcomeViewProps) {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12 lg:py-20 space-y-20">
      {/* Hero Split */}
      <section className="grid gap-10 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-between space-y-8 py-2">
          <div className="space-y-6">
            <p className="text-sm font-semibold tracking-wide text-[#9A7400] dark:text-[#F5C400]">
              Sistema guiado de arquitectura y generación web
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.35rem] font-bold leading-[1.08] tracking-tight text-[#111318] dark:text-[#F4F6F9] [text-wrap:balance]">
              Diseña tu página web paso a paso y expórtala lista para GitHub
            </h1>
            <p className="max-w-xl text-base lg:text-lg leading-relaxed text-[#4B5565] dark:text-[#9BA4B5]">
              KADRE analiza tus requisitos técnicos para recomendar el stack adecuado, propone
              plantillas y estilos personalizables, simplifica la carga de contenidos y genera el
              repositorio completo con instrucciones exactas de despliegue.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onStartNew}
                className="inline-flex h-12 items-center gap-2.5 bg-[#F5C400] px-7 text-sm font-semibold text-[#0A0B0D] transition-colors hover:bg-[#FFD000] whitespace-nowrap cursor-pointer"
              >
                <span>Comenzar diseño guiado</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {hasSavedDraft ? (
                <button
                  type="button"
                  onClick={onResumeDraft}
                  className="inline-flex h-12 items-center gap-2 border border-[#D0D5DF] bg-white px-5 text-sm font-medium text-[#111318] transition-colors hover:border-[#9A7400] dark:border-[#262B36] dark:bg-[#111318] dark:text-[#F4F6F9] dark:hover:border-[#F5C400] whitespace-nowrap cursor-pointer"
                >
                  <span>Reanudar: {savedBrandName || 'Borrador anterior'}</span>
                </button>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#4B5565] dark:text-[#9BA4B5] tabular-nums">
              <span>5 pasos guiados</span>
              <span aria-hidden="true">·</span>
              <span>Vista previa en tiempo real</span>
              <span aria-hidden="true">·</span>
              <span>Código fuente propio sin ataduras</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="hud-frame relative h-full min-h-[340px] border border-[#D0D5DF] bg-white dark:border-[#262B36] dark:bg-[#111318] overflow-hidden">
            <img
              src={GENERATED_ASSETS.welcomeHero}
              alt="Consola industrial de diseño web y planos arquitectónicos digitales"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A0B0D]/95 via-[#0A0B0D]/60 to-transparent p-6 pt-16">
              <div className="flex flex-wrap items-end justify-between gap-4 text-[#F4F6F9]">
                <div>
                  <p className="text-xs font-mono text-[#F5C400]">Arquitectura + Diseño + Repositorio</p>
                  <p className="mt-1 text-base font-semibold">
                    Del diagnóstico inicial al primer despliegue en producción
                  </p>
                </div>
                <span className="font-mono text-xs text-[#9BA4B5] tabular-nums">
                  ZIP · Git CLI · GitHub Actions
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Stage Workflow Strip */}
      <section id="proceso" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D0D5DF] pb-4 dark:border-[#262B36]">
          <h2 className="text-2xl font-bold text-[#111318] dark:text-[#F4F6F9]">
            Flujo estructurado en cuatro etapas
          </h2>
          <p className="text-sm text-[#4B5565] dark:text-[#9BA4B5]">
            Cada decisión se refleja inmediatamente en la vista previa y en el código final.
          </p>
        </div>

        <div className="grid gap-px bg-[#D0D5DF] dark:bg-[#262B36] sm:grid-cols-2 lg:grid-cols-4 border border-[#D0D5DF] dark:border-[#262B36]">
          {PROCESS_STAGES.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.index}
                className="flex flex-col justify-between bg-white p-6 dark:bg-[#111318] space-y-5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-[#9A7400] dark:text-[#F5C400] tabular-nums">
                    {stage.index}
                  </span>
                  <Icon className="h-4 w-4 text-[#4B5565] dark:text-[#9BA4B5]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-[#111318] dark:text-[#F4F6F9]">
                    {stage.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#4B5565] dark:text-[#9BA4B5]">
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Supported Technical Stacks + GitHub Export */}
      <section id="capacidades" className="grid gap-10 lg:grid-cols-12 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#111318] dark:text-[#F4F6F9]">
              Selección automática del stack técnico
            </h2>
            <p className="text-sm leading-relaxed text-[#4B5565] dark:text-[#9BA4B5]">
              No necesitas decidir a ciegas entre un sitio estático o un servidor completo. El
              cuestionario técnico evalúa si requieres lógica backend, base de datos o renderizado
              estático y genera la estructura exacta.
            </p>
          </div>

          <div className="divide-y divide-[#D0D5DF] border-y border-[#D0D5DF] dark:divide-[#262B36] dark:border-[#262B36]">
            {SUPPORTED_ARCHITECTURES.map((arch) => (
              <div
                key={arch.name}
                className="grid gap-2 py-4 sm:grid-cols-12 sm:items-baseline"
              >
                <div className="sm:col-span-5 font-semibold text-sm text-[#111318] dark:text-[#F4F6F9]">
                  {arch.name}
                </div>
                <div className="sm:col-span-3 font-mono text-xs text-[#9A7400] dark:text-[#F5C400]">
                  {arch.stack}
                </div>
                <div className="sm:col-span-4 text-xs leading-relaxed text-[#4B5565] dark:text-[#9BA4B5]">
                  {arch.detail}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          id="despliegue"
          className="hud-frame lg:col-span-5 border border-[#D0D5DF] bg-white p-7 dark:border-[#262B36] dark:bg-[#111318] space-y-6"
        >
          <div className="flex items-center justify-between border-b border-[#D0D5DF] pb-4 dark:border-[#262B36]">
            <h3 className="text-lg font-bold text-[#111318] dark:text-[#F4F6F9]">
              Entrega lista para GitHub
            </h3>
            <FolderDown className="h-5 w-5 text-[#9A7400] dark:text-[#F5C400]" />
          </div>

          <p className="text-sm leading-relaxed text-[#4B5565] dark:text-[#9BA4B5]">
            Al finalizar obtienes el código completo empaquetado con tus imágenes locales, flujo
            automático de GitHub Actions y un asistente interactivo que genera los comandos Git
            exactos para tu usuario y repositorio.
          </p>

          <ul className="space-y-2.5 text-sm text-[#111318] dark:text-[#F4F6F9]">
            <li className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-[#9A7400] dark:text-[#F5C400]">01</span>
              <span>Paquete ZIP con código fuente, estilos y recursos multimedia</span>
            </li>
            <li className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-[#9A7400] dark:text-[#F5C400]">02</span>
              <span>Script automatizado exportar-github.sh preconfigurado</span>
            </li>
            <li className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-[#9A7400] dark:text-[#F5C400]">03</span>
              <span>Guía paso a paso para GitHub Pages, Vercel, Netlify o Cloudflare</span>
            </li>
          </ul>

          <button
            type="button"
            onClick={onStartNew}
            className="inline-flex h-11 w-full items-center justify-center gap-2 bg-[#F5C400] px-5 text-sm font-semibold text-[#0A0B0D] transition-colors hover:bg-[#FFD000] cursor-pointer"
          >
            <span>Iniciar asistente ahora</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
