import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Cpu, Database, Globe, Server } from 'lucide-react';
import { getAllStacks, getDiscoveryOptions } from '../data/presets';
import { Availability, discoveryAvailability, PLANNED_STACKS, reasonText } from '../generator/matrix';
import { Locale, TRANSLATIONS } from '../i18n/translations';
import {
  DiscoveryAnswers,
  IntegrationOption,
  StackRecommendation,
} from '../types/builder';

interface DiscoveryStepProps {
  locale: Locale;
  answers: DiscoveryAnswers;
  recommendedStack: StackRecommendation;
  selectedStack: StackRecommendation;
  onUpdateAnswers: (next: DiscoveryAnswers) => void;
  onSelectManualStack: (stackId: string | null) => void;
  onNext: () => void;
}

/** Etichetta + motivo per le opzioni non disponibili (dalla matrice di compatibilità). */
function AvailabilityNote({ availability, locale }: { availability: Availability; locale: Locale }) {
  if (availability.status === 'available') return null;
  const t = TRANSLATIONS[locale].discovery;
  return (
    <div className="flex items-start gap-2 pt-1 text-[11px] leading-relaxed text-[#4B5565] dark:text-[#9BA4B5]">
      <span className="shrink-0 border border-[#9BA4B5] px-1.5 py-px font-mono text-[10px] uppercase tracking-wide dark:border-[#4B5565]">
        {availability.status === 'planned' ? t.plannedBadge : t.incompatibleBadge}
      </span>
      <span>{reasonText(availability, locale)}</span>
    </div>
  );
}

export function DiscoveryStep({
  locale,
  answers,
  recommendedStack,
  selectedStack,
  onUpdateAnswers,
  onSelectManualStack,
  onNext,
}: DiscoveryStepProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showAlternatives, setShowAlternatives] = useState(false);

  const t = TRANSLATIONS[locale].discovery;
  const options = getDiscoveryOptions(locale);
  const allStacks = getAllStacks(locale);
  const activeQuestion = t.questionTabs[questionIndex];

  function toggleIntegration(option: IntegrationOption) {
    const exists = answers.integrations.includes(option);
    const nextIntegrations = exists
      ? answers.integrations.filter((item) => item !== option)
      : [...answers.integrations, option];
    onSelectManualStack(null);
    onUpdateAnswers({ ...answers, integrations: nextIntegrations });
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8 lg:py-10 space-y-8">
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D0D5DF] pb-5 dark:border-[#262B36]">
        <div className="space-y-1.5">
          <p className="font-mono text-xs font-medium text-[#9A7400] dark:text-[#F5C400]">
            {t.stepTag}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111318] dark:text-[#F4F6F9]">
            {t.title}
          </h1>
        </div>
        <div className="text-xs font-mono text-[#4B5565] dark:text-[#9BA4B5] tabular-nums">
          {t.questionCounter(questionIndex + 1, t.questionTabs.length)}
        </div>
      </div>

      {/* Main 2-column HUD workspace */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left: Interactive Questionnaire */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap gap-1.5 border border-[#D0D5DF] bg-[#E9ECF1] p-1.5 dark:border-[#262B36] dark:bg-[#111318]">
            {t.questionTabs.map((tab) => {
              const isCurrent = tab.id === questionIndex;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setQuestionIndex(tab.id)}
                  className={`flex-1 min-w-[110px] px-3 py-2 text-xs font-medium tabular-nums transition-colors whitespace-nowrap cursor-pointer ${
                    isCurrent
                      ? 'bg-[#F5C400] font-semibold text-[#0A0B0D]'
                      : 'text-[#4B5565] hover:bg-white/70 hover:text-[#111318] dark:text-[#9BA4B5] dark:hover:bg-[#1A1F29] dark:hover:text-[#F4F6F9]'
                  }`}
                >
                  {tab.short}
                </button>
              );
            })}
          </div>

          <div className="hud-frame border border-[#D0D5DF] bg-white p-6 sm:p-8 dark:border-[#262B36] dark:bg-[#111318] space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-[#111318] dark:text-[#F4F6F9]">
                {activeQuestion.title}
              </h2>
              <p className="text-sm text-[#4B5565] dark:text-[#9BA4B5]">
                {questionIndex === 4 ? t.multiSelectHint : t.liveRecalcHint}
              </p>
            </div>

            {questionIndex === 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {options.projectType.map((opt) => {
                  const selected = answers.projectType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onSelectManualStack(null);
                        onUpdateAnswers({ ...answers, projectType: opt.value });
                      }}
                      className={`text-left p-4 border transition-colors cursor-pointer space-y-2 ${
                        selected
                          ? 'border-[#9A7400] bg-[#FEFCE8] dark:border-[#F5C400] dark:bg-[#F5C400]/10'
                          : 'border-[#D0D5DF] bg-[#F8F9FB] hover:border-[#9BA4B5] dark:border-[#262B36] dark:bg-[#151820] dark:hover:border-[#4B5565]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-sm text-[#111318] dark:text-[#F4F6F9]">
                          {opt.title}
                        </span>
                        {selected ? (
                          <Check className="h-4 w-4 shrink-0 text-[#9A7400] dark:text-[#F5C400]" />
                        ) : null}
                      </div>
                      <p className="text-xs leading-relaxed text-[#4B5565] dark:text-[#9BA4B5]">
                        {opt.description}
                      </p>
                      <p className="font-mono text-[11px] text-[#9A7400] dark:text-[#F5C400]">
                        {opt.technicalHint}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {questionIndex === 1 ? (
              <div className="space-y-3">
                {options.architectureMode.map((opt) => {
                  const selected = answers.architectureMode === opt.value;
                  const availability = discoveryAvailability.architectureMode(opt.value, answers);
                  const unavailable = availability.status !== 'available';
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={unavailable}
                      aria-disabled={unavailable}
                      onClick={() => {
                        onSelectManualStack(null);
                        onUpdateAnswers({ ...answers, architectureMode: opt.value });
                      }}
                      className={`w-full text-left p-4 border transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 space-y-1.5 ${
                        selected
                          ? 'border-[#9A7400] bg-[#FEFCE8] dark:border-[#F5C400] dark:bg-[#F5C400]/10'
                          : 'border-[#D0D5DF] bg-[#F8F9FB] hover:border-[#9BA4B5] dark:border-[#262B36] dark:bg-[#151820] dark:hover:border-[#4B5565]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-sm text-[#111318] dark:text-[#F4F6F9]">
                          {opt.title}
                        </span>
                        <span className="font-mono text-[11px] text-[#9A7400] dark:text-[#F5C400] whitespace-nowrap">
                          {opt.technicalHint}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-[#4B5565] dark:text-[#9BA4B5]">
                        {opt.description}
                      </p>
                      <AvailabilityNote availability={availability} locale={locale} />
                    </button>
                  );
                })}
              </div>
            ) : null}

            {questionIndex === 2 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {options.databaseNeed.map((opt) => {
                  const selected = answers.databaseNeed === opt.value;
                  const availability = discoveryAvailability.databaseNeed(opt.value, answers);
                  const unavailable = availability.status !== 'available';
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={unavailable}
                      aria-disabled={unavailable}
                      onClick={() => {
                        onSelectManualStack(null);
                        onUpdateAnswers({ ...answers, databaseNeed: opt.value });
                      }}
                      className={`text-left p-4 border transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 space-y-2 ${
                        selected
                          ? 'border-[#9A7400] bg-[#FEFCE8] dark:border-[#F5C400] dark:bg-[#F5C400]/10'
                          : 'border-[#D0D5DF] bg-[#F8F9FB] hover:border-[#9BA4B5] dark:border-[#262B36] dark:bg-[#151820] dark:hover:border-[#4B5565]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-sm text-[#111318] dark:text-[#F4F6F9]">
                          {opt.title}
                        </span>
                        {selected ? (
                          <Check className="h-4 w-4 shrink-0 text-[#9A7400] dark:text-[#F5C400]" />
                        ) : null}
                      </div>
                      <p className="text-xs leading-relaxed text-[#4B5565] dark:text-[#9BA4B5]">
                        {opt.description}
                      </p>
                      <p className="font-mono text-[11px] text-[#9A7400] dark:text-[#F5C400]">
                        {opt.technicalHint}
                      </p>
                      <AvailabilityNote availability={availability} locale={locale} />
                    </button>
                  );
                })}
              </div>
            ) : null}

            {questionIndex === 3 ? (
              <div className="space-y-3">
                {options.renderingStrategy.map((opt) => {
                  const selected = answers.renderingStrategy === opt.value;
                  const availability = discoveryAvailability.renderingStrategy(opt.value, answers);
                  const unavailable = availability.status !== 'available';
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={unavailable}
                      aria-disabled={unavailable}
                      onClick={() => {
                        onSelectManualStack(null);
                        onUpdateAnswers({ ...answers, renderingStrategy: opt.value });
                      }}
                      className={`w-full text-left p-4 border transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 space-y-1.5 ${
                        selected
                          ? 'border-[#9A7400] bg-[#FEFCE8] dark:border-[#F5C400] dark:bg-[#F5C400]/10'
                          : 'border-[#D0D5DF] bg-[#F8F9FB] hover:border-[#9BA4B5] dark:border-[#262B36] dark:bg-[#151820] dark:hover:border-[#4B5565]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-sm text-[#111318] dark:text-[#F4F6F9]">
                          {opt.title}
                        </span>
                        <span className="font-mono text-[11px] text-[#9A7400] dark:text-[#F5C400] whitespace-nowrap">
                          {opt.technicalHint}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-[#4B5565] dark:text-[#9BA4B5]">
                        {opt.description}
                      </p>
                      <AvailabilityNote availability={availability} locale={locale} />
                    </button>
                  );
                })}
              </div>
            ) : null}

            {questionIndex === 4 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {options.integrations.map((opt) => {
                  const selected = answers.integrations.includes(opt.value);
                  const availability = discoveryAvailability.integration(opt.value, answers);
                  const unavailable = availability.status !== 'available';
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={unavailable}
                      aria-disabled={unavailable}
                      onClick={() => toggleIntegration(opt.value)}
                      className={`text-left p-4 border transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 space-y-2 ${
                        selected
                          ? 'border-[#9A7400] bg-[#FEFCE8] dark:border-[#F5C400] dark:bg-[#F5C400]/10'
                          : 'border-[#D0D5DF] bg-[#F8F9FB] hover:border-[#9BA4B5] dark:border-[#262B36] dark:bg-[#151820] dark:hover:border-[#4B5565]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-sm text-[#111318] dark:text-[#F4F6F9]">
                          {opt.title}
                        </span>
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center border text-[10px] ${
                            selected
                              ? 'border-[#9A7400] bg-[#F5C400] text-[#0A0B0D]'
                              : 'border-[#9BA4B5] dark:border-[#4B5565]'
                          }`}
                        >
                          {selected ? <Check className="h-3 w-3" /> : null}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-[#4B5565] dark:text-[#9BA4B5]">
                        {opt.description}
                      </p>
                      <p className="font-mono text-[11px] text-[#9A7400] dark:text-[#F5C400]">
                        {opt.technicalHint}
                      </p>
                      <AvailabilityNote availability={availability} locale={locale} />
                    </button>
                  );
                })}
              </div>
            ) : null}

            <div className="flex items-center justify-between pt-4 border-t border-[#D0D5DF] dark:border-[#262B36]">
              <button
                type="button"
                disabled={questionIndex === 0}
                onClick={() => setQuestionIndex((prev) => Math.max(0, prev - 1))}
                className="inline-flex h-10 items-center gap-2 border border-[#D0D5DF] px-4 text-xs font-medium text-[#111318] transition-colors hover:border-[#111318] disabled:opacity-40 disabled:cursor-not-allowed dark:border-[#262B36] dark:text-[#F4F6F9] dark:hover:border-[#F4F6F9] cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>{t.prevBtn}</span>
              </button>

              {questionIndex < t.questionTabs.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setQuestionIndex((prev) => prev + 1)}
                  className="inline-flex h-10 items-center gap-2 bg-[#111318] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#262B36] dark:bg-[#F4F6F9] dark:text-[#0A0B0D] dark:hover:bg-white cursor-pointer"
                >
                  <span>{t.nextQuestionBtn}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onNext}
                  className="inline-flex h-10 items-center gap-2 bg-[#F5C400] px-5 text-xs font-semibold text-[#0A0B0D] transition-colors hover:bg-[#FFD000] cursor-pointer"
                >
                  <span>{t.confirmStackBtn}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Live Recommended Stack Blueprint */}
        <aside className="lg:col-span-5 space-y-4">
          <div className="hud-frame border border-[#D0D5DF] bg-white p-6 dark:border-[#262B36] dark:bg-[#111318] space-y-6">
            <div className="space-y-2 border-b border-[#D0D5DF] pb-4 dark:border-[#262B36]">
              <div className="flex items-center justify-between gap-2 text-xs font-mono">
                <span className="text-[#9A7400] dark:text-[#F5C400]">
                  {selectedStack.id === recommendedStack.id
                    ? t.autoRecommended
                    : t.manualSelected}
                </span>
                <span className="text-[#4B5565] dark:text-[#9BA4B5] tabular-nums">
                  {t.complexityLabel}: {selectedStack.complexity}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#111318] dark:text-[#F4F6F9]">
                {selectedStack.name}
              </h3>
              <p className="text-sm leading-relaxed text-[#4B5565] dark:text-[#9BA4B5]">
                {selectedStack.summary}
              </p>
            </div>

            <div className="divide-y divide-[#D0D5DF] border-y border-[#D0D5DF] text-xs dark:divide-[#262B36] dark:border-[#262B36]">
              <div className="flex items-center justify-between gap-4 py-3">
                <span className="inline-flex items-center gap-2 text-[#4B5565] dark:text-[#9BA4B5]">
                  <Cpu className="h-3.5 w-3.5 text-[#9A7400] dark:text-[#F5C400]" />
                  {t.layerFrontend}
                </span>
                <span className="font-mono font-medium text-right text-[#111318] dark:text-[#F4F6F9]">
                  {selectedStack.frontend}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <span className="inline-flex items-center gap-2 text-[#4B5565] dark:text-[#9BA4B5]">
                  <Server className="h-3.5 w-3.5 text-[#9A7400] dark:text-[#F5C400]" />
                  {t.layerBackend}
                </span>
                <span className="font-mono font-medium text-right text-[#111318] dark:text-[#F4F6F9]">
                  {selectedStack.backend}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <span className="inline-flex items-center gap-2 text-[#4B5565] dark:text-[#9BA4B5]">
                  <Database className="h-3.5 w-3.5 text-[#9A7400] dark:text-[#F5C400]" />
                  {t.layerDatabase}
                </span>
                <span className="font-mono font-medium text-right text-[#111318] dark:text-[#F4F6F9]">
                  {selectedStack.database}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <span className="inline-flex items-center gap-2 text-[#4B5565] dark:text-[#9BA4B5]">
                  <Globe className="h-3.5 w-3.5 text-[#9A7400] dark:text-[#F5C400]" />
                  {t.layerDeploy}
                </span>
                <span className="font-mono font-medium text-right text-[#111318] dark:text-[#F4F6F9]">
                  {selectedStack.deployTargets.slice(0, 2).join(' · ')}
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold text-[#111318] dark:text-[#F4F6F9]">
                {t.rationaleHeading}
              </h4>
              <ul className="space-y-2 text-xs leading-relaxed text-[#4B5565] dark:text-[#9BA4B5]">
                {selectedStack.rationale.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="font-mono text-[#9A7400] dark:text-[#F5C400] tabular-nums">
                      0{idx + 1}
                    </span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 space-y-3 border-t border-[#D0D5DF] dark:border-[#262B36]">
              <button
                type="button"
                onClick={() => setShowAlternatives((prev) => !prev)}
                className="text-xs font-medium text-[#4B5565] underline underline-offset-4 hover:text-[#111318] dark:text-[#9BA4B5] dark:hover:text-[#F5C400] cursor-pointer"
              >
                {showAlternatives ? t.hideAlternatives : t.showAlternatives}
              </button>

              {showAlternatives ? (
                <div className="space-y-2">
                  {allStacks.map((stack) => {
                    const isActive = stack.id === selectedStack.id;
                    return (
                      <button
                        key={stack.id}
                        type="button"
                        onClick={() =>
                          onSelectManualStack(
                            stack.id === recommendedStack.id ? null : stack.id
                          )
                        }
                        className={`w-full text-left px-3 py-2.5 border text-xs transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                          isActive
                            ? 'border-[#9A7400] bg-[#FEFCE8] text-[#111318] dark:border-[#F5C400] dark:bg-[#F5C400]/10 dark:text-[#F4F6F9]'
                            : 'border-[#D0D5DF] text-[#4B5565] hover:border-[#9BA4B5] dark:border-[#262B36] dark:text-[#9BA4B5]'
                        }`}
                      >
                        <span className="font-medium">{stack.name}</span>
                        <span className="font-mono text-[11px] shrink-0">
                          {stack.id === recommendedStack.id ? t.optimalTag : stack.complexity}
                        </span>
                      </button>
                    );
                  })}
                  {PLANNED_STACKS.map((planned) => (
                    <div
                      key={planned.id}
                      aria-disabled="true"
                      className="w-full px-3 py-2.5 border border-dashed border-[#D0D5DF] text-xs text-[#4B5565] opacity-70 space-y-1 dark:border-[#262B36] dark:text-[#9BA4B5]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{planned.name[locale]}</span>
                        <span className="font-mono text-[10px] uppercase tracking-wide shrink-0">
                          {t.plannedBadge}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed">{planned.reason[locale]}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              <button
                type="button"
                onClick={onNext}
                className="inline-flex h-11 w-full items-center justify-center gap-2 bg-[#F5C400] px-5 text-sm font-semibold text-[#0A0B0D] transition-colors hover:bg-[#FFD000] cursor-pointer"
              >
                <span>{t.continueTemplatesBtn}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
