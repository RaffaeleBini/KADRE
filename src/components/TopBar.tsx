import { Moon, Sun, ArrowRight, RotateCcw, Globe } from 'lucide-react';
import { Locale, TRANSLATIONS } from '../i18n/translations';
import { StepId } from '../types/builder';

interface TopBarProps {
  locale: Locale;
  currentStep: StepId;
  maxVisitedIndex: number;
  theme: 'dark' | 'light';
  onChangeLocale: (next: Locale) => void;
  onToggleTheme: () => void;
  onNavigateStep: (step: StepId) => void;
  onResetProject: () => void;
}

export function TopBar({
  locale,
  currentStep,
  maxVisitedIndex,
  theme,
  onChangeLocale,
  onToggleTheme,
  onNavigateStep,
  onResetProject,
}: TopBarProps) {
  const t = TRANSLATIONS[locale].topBar;
  const isWelcome = currentStep === 'welcome';

  const workflowSteps: { id: StepId; index: number; label: string }[] = [
    { id: 'discovery', index: 1, label: t.steps.discovery },
    { id: 'template', index: 2, label: t.steps.template },
    { id: 'style', index: 3, label: t.steps.style },
    { id: 'content', index: 4, label: t.steps.content },
    { id: 'export', index: 5, label: t.steps.export },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#D0D5DF] bg-[#F3F4F6]/95 backdrop-blur-md dark:border-[#262B36] dark:bg-[#0A0B0D]/95">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 py-3.5">
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
              {t.navProcess}
            </a>
            <a
              href="#capacidades"
              className="transition-colors hover:text-[#111318] dark:hover:text-[#F4F6F9] whitespace-nowrap shrink-0"
            >
              {t.navArchitectures}
            </a>
            <a
              href="#despliegue"
              className="transition-colors hover:text-[#111318] dark:hover:text-[#F4F6F9] whitespace-nowrap shrink-0"
            >
              {t.navGithub}
            </a>
          </nav>
        ) : (
          <nav
            aria-label="Pasos del diseñador"
            className="hidden lg:flex items-center gap-6 text-sm font-medium"
          >
            {workflowSteps.map((step) => {
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

        {/* Zone 3: Language Switch + Theme Switch + Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* ES / IT Language Selector right next to Theme Toggle */}
          <div
            role="group"
            aria-label={t.languageLabel}
            className="inline-flex h-10 items-center border border-[#D0D5DF] bg-white p-0.5 dark:border-[#262B36] dark:bg-[#111318] shrink-0"
          >
            <Globe className="mx-1.5 h-3.5 w-3.5 text-[#9A7400] dark:text-[#F5C400] shrink-0" />
            <button
              type="button"
              onClick={() => onChangeLocale('es')}
              aria-pressed={locale === 'es'}
              className={`h-full px-2.5 font-mono text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                locale === 'es'
                  ? 'bg-[#F5C400] text-[#0A0B0D]'
                  : 'text-[#4B5565] hover:text-[#111318] dark:text-[#9BA4B5] dark:hover:text-[#F4F6F9]'
              }`}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => onChangeLocale('it')}
              aria-pressed={locale === 'it'}
              className={`h-full px-2.5 font-mono text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                locale === 'it'
                  ? 'bg-[#F5C400] text-[#0A0B0D]'
                  : 'text-[#4B5565] hover:text-[#111318] dark:text-[#9BA4B5] dark:hover:text-[#F4F6F9]'
              }`}
            >
              IT
            </button>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? t.toLightMode : t.toDarkMode}
            className="inline-flex h-10 items-center gap-2 border border-[#D0D5DF] bg-white px-3.5 text-xs font-medium text-[#111318] transition-colors hover:border-[#9A7400] dark:border-[#262B36] dark:bg-[#111318] dark:text-[#F4F6F9] dark:hover:border-[#F5C400] whitespace-nowrap shrink-0 cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-3.5 w-3.5 text-[#F5C400]" />
                <span className="hidden sm:inline">{t.lightLabel}</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-[#9A7400]" />
                <span className="hidden sm:inline">{t.darkLabel}</span>
              </>
            )}
          </button>

          {isWelcome ? (
            <button
              type="button"
              onClick={() => onNavigateStep('discovery')}
              className="inline-flex h-10 items-center gap-2 bg-[#F5C400] px-4 text-xs font-semibold text-[#0A0B0D] transition-colors hover:bg-[#FFD000] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{t.createWeb}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onResetProject}
              title={t.resetTitle}
              className="inline-flex h-10 items-center gap-1.5 border border-[#D0D5DF] bg-white px-3 text-xs font-medium text-[#4B5565] transition-colors hover:border-[#111318] hover:text-[#111318] dark:border-[#262B36] dark:bg-[#111318] dark:text-[#9BA4B5] dark:hover:border-[#F4F6F9] dark:hover:text-[#F4F6F9] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t.reset}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile step bar when in workflow */}
      {!isWelcome ? (
        <div className="flex lg:hidden items-center gap-4 overflow-x-auto border-t border-[#D0D5DF] px-6 py-2.5 dark:border-[#262B36]">
          {workflowSteps.map((step) => {
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
