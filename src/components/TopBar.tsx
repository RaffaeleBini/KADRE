import { Moon, Sun, ArrowRight, RotateCcw } from 'lucide-react';
import { StepId } from '../types/builder';

interface TopBarProps {
  currentStep: StepId;
  maxVisitedIndex: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onNavigateStep: (step: StepId) => void;
  onResetProject: () => void;
}

const WORKFLOW_STEPS: { id: StepId; index: number; label: string }[] = [
  { id: 'discovery', index: 1, label: '01. Arquitectura' },
  { id: 'template', index: 2, label: '02. Plantilla' },
  { id: 'style', index: 3, label: '03. Estilo' },
  { id: 'content', index: 4, label: '04. Contenido' },
  { id: 'export', index: 5, label: '05. GitHub' },
];

export function TopBar({
  currentStep,
  maxVisitedIndex,
  theme,
  onToggleTheme,
  onNavigateStep,
  onResetProject,
}: TopBarProps) {
  const isWelcome = currentStep === 'welcome';

  return (
    <header className="sticky top-0 z-40 border-b border-[#D0D5DF] bg-[#F3F4F6]/95 backdrop-blur-md dark:border-[#262B36] dark:bg-[#0A0B0D]/95">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => onNavigateStep('welcome')}
          className="text-lg font-bold tracking-[0.14em] text-[#111318] transition-colors hover:text-[#9A7400] dark:text-[#F4F6F9] dark:hover:text-[#F5C400] whitespace-nowrap shrink-0 cursor-pointer"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          KADRE
        </button>

        {/* Zone 2: Clean single-line navigation links */}
        {isWelcome ? (
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4B5565] dark:text-[#9BA4B5]"
          >
            <a
              href="#proceso"
              className="transition-colors hover:text-[#111318] dark:hover:text-[#F4F6F9] whitespace-nowrap shrink-0"
            >
              Proceso guiado
            </a>
            <a
              href="#capacidades"
              className="transition-colors hover:text-[#111318] dark:hover:text-[#F4F6F9] whitespace-nowrap shrink-0"
            >
              Arquitecturas
            </a>
            <a
              href="#despliegue"
              className="transition-colors hover:text-[#111318] dark:hover:text-[#F4F6F9] whitespace-nowrap shrink-0"
            >
              Exportación GitHub
            </a>
          </nav>
        ) : (
          <nav
            aria-label="Pasos del diseñador"
            className="hidden lg:flex items-center gap-6 text-sm font-medium"
          >
            {WORKFLOW_STEPS.map((step) => {
              const isActive = currentStep === step.id;
              const isAccessible = step.index <= maxVisitedIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  disabled={!isAccessible}
                  onClick={() => onNavigateStep(step.id)}
                  className={`relative py-1 text-sm tabular-nums transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'font-semibold text-[#9A7400] dark:text-[#F5C400]'
                      : isAccessible
                        ? 'text-[#4B5565] hover:text-[#111318] dark:text-[#9BA4B5] dark:hover:text-[#F4F6F9] cursor-pointer'
                        : 'text-[#9BA4B5] opacity-45 dark:text-[#4B5565] cursor-not-allowed'
                  }`}
                >
                  {step.label}
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-[15px] h-[2px] bg-[#9A7400] dark:bg-[#F5C400]"
                    />
                  ) : null}
                </button>
              );
            })}
          </nav>
        )}

        {/* Zone 3: Theme Switch + Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="inline-flex h-10 items-center gap-2 border border-[#D0D5DF] bg-white px-3.5 text-xs font-medium text-[#111318] transition-colors hover:border-[#9A7400] dark:border-[#262B36] dark:bg-[#111318] dark:text-[#F4F6F9] dark:hover:border-[#F5C400] whitespace-nowrap shrink-0 cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-3.5 w-3.5 text-[#F5C400]" />
                <span>Modo claro</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-[#9A7400]" />
                <span>Modo oscuro</span>
              </>
            )}
          </button>

          {isWelcome ? (
            <button
              type="button"
              onClick={() => onNavigateStep('discovery')}
              className="inline-flex h-10 items-center gap-2 bg-[#F5C400] px-4 text-xs font-semibold text-[#0A0B0D] transition-colors hover:bg-[#FFD000] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Crear web</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onResetProject}
              title="Reiniciar configuración del proyecto"
              className="inline-flex h-10 items-center gap-1.5 border border-[#D0D5DF] bg-white px-3 text-xs font-medium text-[#4B5565] transition-colors hover:border-[#111318] hover:text-[#111318] dark:border-[#262B36] dark:bg-[#111318] dark:text-[#9BA4B5] dark:hover:border-[#F4F6F9] dark:hover:text-[#F4F6F9] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile step bar when in workflow */}
      {!isWelcome ? (
        <div className="flex lg:hidden items-center gap-4 overflow-x-auto border-t border-[#D0D5DF] px-6 py-2.5 dark:border-[#262B36]">
          {WORKFLOW_STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isAccessible = step.index <= maxVisitedIndex;
            return (
              <button
                key={step.id}
                type="button"
                disabled={!isAccessible}
                onClick={() => onNavigateStep(step.id)}
                className={`text-xs tabular-nums whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'font-semibold text-[#9A7400] dark:text-[#F5C400]'
                    : isAccessible
                      ? 'text-[#4B5565] dark:text-[#9BA4B5]'
                      : 'text-[#9BA4B5] opacity-40 dark:text-[#4B5565]'
                }`}
              >
                {step.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </header>
  );
}
