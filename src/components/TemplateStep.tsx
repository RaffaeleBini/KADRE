import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, Layers } from 'lucide-react';
import { getTemplates } from '../data/presets';
import { Locale, TRANSLATIONS } from '../i18n/translations';
import {
  DiscoveryAnswers,
  SectionConfig,
  StackRecommendation,
  TemplateDefinition,
} from '../types/builder';

interface TemplateStepProps {
  locale: Locale;
  answers: DiscoveryAnswers;
  stack: StackRecommendation;
  selectedTemplate: TemplateDefinition;
  sections: SectionConfig[];
  onSelectTemplate: (template: TemplateDefinition) => void;
  onToggleSection: (sectionId: string) => void;
  onMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
  onBack: () => void;
  onNext: () => void;
}

export function TemplateStep({
  locale,
  answers,
  stack,
  selectedTemplate,
  sections,
  onSelectTemplate,
  onToggleSection,
  onMoveSection,
  onBack,
  onNext,
}: TemplateStepProps) {
  const t = TRANSLATIONS[locale].template;
  const templates = getTemplates(locale);

  const rankedTemplates = [...templates].sort((a, b) => {
    const aMatch = a.bestFor.includes(answers.projectType) ? 1 : 0;
    const bMatch = b.bestFor.includes(answers.projectType) ? 1 : 0;
    return bMatch - aMatch;
  });

  const enabledCount = sections.filter((s) => s.enabled).length;

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8 lg:py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D0D5DF] pb-5 dark:border-[#262B36]">
        <div className="space-y-1.5">
          <p className="font-mono text-xs font-medium text-[#9A7400] dark:text-[#F5C400]">
            {t.stepTag}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111318] dark:text-[#F4F6F9]">
            {t.title}
          </h1>
        </div>
        <div className="text-xs font-mono text-[#4B5565] dark:text-[#9BA4B5]">
          {t.activeStackLabel}:{' '}
          <span className="text-[#111318] dark:text-[#F4F6F9]">{stack.name}</span>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#111318] dark:text-[#F4F6F9]">
            {t.selectBaseHeading}
          </h2>
          <span className="text-xs text-[#4B5565] dark:text-[#9BA4B5] tabular-nums">
            {t.availableCount(rankedTemplates.length)}
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rankedTemplates.map((tpl) => {
            const isSelected = tpl.id === selectedTemplate.id;
            const isRecommended = tpl.bestFor.includes(answers.projectType);
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => onSelectTemplate(tpl)}
                className={`hud-frame group text-left border transition-colors flex flex-col overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'border-[#9A7400] bg-[#FEFCE8]/70 dark:border-[#F5C400] dark:bg-[#171A21]'
                    : 'border-[#D0D5DF] bg-white hover:border-[#9BA4B5] dark:border-[#262B36] dark:bg-[#111318] dark:hover:border-[#4B5565]'
                }`}
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-[#D0D5DF] dark:border-[#262B36] bg-[#171A21]">
                  <img
                    src={tpl.previewImage}
                    alt={tpl.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-[#F4F6F9]">
                    <span>{tpl.category}</span>
                    {isRecommended ? (
                      <span className="text-[#F5C400] font-semibold">{t.recommendedTag}</span>
                    ) : null}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-[#111318] dark:text-[#F4F6F9]">
                        {tpl.name}
                      </h3>
                      {isSelected ? (
                        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center bg-[#F5C400] text-[#0A0B0D]">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs leading-relaxed text-[#4B5565] dark:text-[#9BA4B5]">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#D0D5DF] dark:border-[#262B36] text-[11px] font-mono text-[#4B5565] dark:text-[#9BA4B5]">
                    {tpl.highlights.join(' · ')}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="hud-frame border border-[#D0D5DF] bg-white p-6 dark:border-[#262B36] dark:bg-[#111318] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D0D5DF] pb-4 dark:border-[#262B36]">
          <div className="flex items-center gap-2.5">
            <Layers className="h-4 w-4 text-[#9A7400] dark:text-[#F5C400]" />
            <div>
              <h2 className="text-base font-bold text-[#111318] dark:text-[#F4F6F9]">
                {t.blocksHeading(selectedTemplate.name)}
              </h2>
              <p className="text-xs text-[#4B5565] dark:text-[#9BA4B5]">{t.blocksSubheading}</p>
            </div>
          </div>
          <div className="font-mono text-xs text-[#9A7400] dark:text-[#F5C400] tabular-nums">
            {t.activeSectionsCount(enabledCount, sections.length)}
          </div>
        </div>

        <div className="divide-y divide-[#D0D5DF] dark:divide-[#262B36]">
          {sections.map((section, idx) => (
            <div
              key={section.id}
              className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 py-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="font-mono text-xs text-[#4B5565] dark:text-[#9BA4B5] tabular-nums pt-0.5 w-6 shrink-0">
                  0{idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#111318] dark:text-[#F4F6F9]">
                      {section.label}
                    </span>
                    {section.required ? (
                      <span className="font-mono text-[11px] text-[#9A7400] dark:text-[#F5C400]">
                        {t.requiredTag}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-[#4B5565] dark:text-[#9BA4B5]">
                    {section.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0 || section.required}
                  onClick={() => onMoveSection(section.id, 'up')}
                  aria-label={t.moveUpAria(section.label)}
                  className="inline-flex h-8 w-8 items-center justify-center border border-[#D0D5DF] text-[#4B5565] transition-colors hover:border-[#111318] hover:text-[#111318] disabled:opacity-30 disabled:cursor-not-allowed dark:border-[#262B36] dark:text-[#9BA4B5] dark:hover:border-[#F4F6F9] dark:hover:text-[#F4F6F9] cursor-pointer"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === sections.length - 1 || section.required}
                  onClick={() => onMoveSection(section.id, 'down')}
                  aria-label={t.moveDownAria(section.label)}
                  className="inline-flex h-8 w-8 items-center justify-center border border-[#D0D5DF] text-[#4B5565] transition-colors hover:border-[#111318] hover:text-[#111318] disabled:opacity-30 disabled:cursor-not-allowed dark:border-[#262B36] dark:text-[#9BA4B5] dark:hover:border-[#F4F6F9] dark:hover:text-[#F4F6F9] cursor-pointer"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  disabled={section.required}
                  onClick={() => onToggleSection(section.id)}
                  className={`h-8 px-3 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer disabled:cursor-not-allowed ${
                    section.enabled
                      ? 'bg-[#F5C400] text-[#0A0B0D]'
                      : 'border border-[#D0D5DF] text-[#4B5565] hover:border-[#111318] dark:border-[#262B36] dark:text-[#9BA4B5]'
                  }`}
                >
                  {section.enabled ? t.activeStatus : t.hiddenStatus}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-11 items-center gap-2 border border-[#D0D5DF] bg-white px-5 text-sm font-medium text-[#111318] transition-colors hover:border-[#111318] dark:border-[#262B36] dark:bg-[#111318] dark:text-[#F4F6F9] dark:hover:border-[#F4F6F9] cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.backBtn}</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex h-11 items-center gap-2 bg-[#F5C400] px-6 text-sm font-semibold text-[#0A0B0D] transition-colors hover:bg-[#FFD000] cursor-pointer"
        >
          <span>{t.nextBtn}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
