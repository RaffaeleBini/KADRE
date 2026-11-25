import { useEffect, useMemo, useState } from 'react';
import { ContentStep } from './components/ContentStep';
import { DiscoveryStep } from './components/DiscoveryStep';
import { ExportStep } from './components/ExportStep';
import { StyleStep } from './components/StyleStep';
import { TemplateStep } from './components/TemplateStep';
import { TopBar } from './components/TopBar';
import { WelcomeView } from './components/WelcomeView';
import {
  buildSectionsForTemplate,
  computeStackRecommendation,
  DEFAULT_DISCOVERY_ANSWERS,
  getAllStacks,
  getColorPatterns,
  getGraphicStyles,
  getStarterContentForProject,
  getTemplates,
  localizeSections,
} from './data/presets';
import { Locale, TRANSLATIONS } from './i18n/translations';
import {
  ColorPatternPreset,
  DiscoveryAnswers,
  GithubExportConfig,
  GraphicStylePreset,
  SectionConfig,
  SiteContent,
  StepId,
  TemplateDefinition,
} from './types/builder';

const DRAFT_STORAGE_KEY = 'kadre_web_builder_draft_v1';
const THEME_STORAGE_KEY = 'kadre_theme_v1';
const LOCALE_STORAGE_KEY = 'kadre_locale_v1';

const STEP_INDEX: Record<StepId, number> = {
  welcome: 0,
  discovery: 1,
  template: 2,
  style: 3,
  content: 4,
  export: 5,
};

interface SavedDraft {
  answers: DiscoveryAnswers;
  manualStackId: string | null;
  templateId: string;
  sections: SectionConfig[];
  graphicStyleId: string;
  colorPatternId: string;
  customAccent: string | null;
  content: SiteContent;
  contentTouched: boolean;
  githubConfig: GithubExportConfig;
  maxVisitedIndex: number;
}

function loadDraft(): SavedDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedDraft;
  } catch {
    return null;
  }
}

function isLightHex(hex: string): boolean {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return true;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.58;
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
      return saved === 'it' ? 'it' : 'es';
    } catch {
      return 'es';
    }
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [initialDraft] = useState<SavedDraft | null>(() => loadDraft());
  const [currentStep, setCurrentStep] = useState<StepId>('welcome');
  const [maxVisitedIndex, setMaxVisitedIndex] = useState<number>(
    initialDraft?.maxVisitedIndex ?? 1
  );

  const [answers, setAnswers] = useState<DiscoveryAnswers>(
    initialDraft?.answers ?? DEFAULT_DISCOVERY_ANSWERS
  );
  const [manualStackId, setManualStackId] = useState<string | null>(
    initialDraft?.manualStackId ?? null
  );

  const initialTemplates = getTemplates(locale);
  const initialStyles = getGraphicStyles(locale);
  const initialPatterns = getColorPatterns(locale);

  const [templateId, setTemplateId] = useState<string>(
    initialDraft?.templateId ?? initialTemplates[0].id
  );
  const [sections, setSections] = useState<SectionConfig[]>(
    initialDraft?.sections
      ? localizeSections(initialDraft.sections, locale)
      : buildSectionsForTemplate(initialTemplates[0], locale)
  );
  const [graphicStyleId, setGraphicStyleId] = useState<string>(
    initialDraft?.graphicStyleId ?? initialStyles[0].id
  );
  const [colorPatternId, setColorPatternId] = useState<string>(
    initialDraft?.colorPatternId ?? initialPatterns[0].id
  );
  const [customAccent, setCustomAccent] = useState<string | null>(
    initialDraft?.customAccent ?? null
  );
  const [content, setContent] = useState<SiteContent>(
    initialDraft?.content ??
      getStarterContentForProject(DEFAULT_DISCOVERY_ANSWERS.projectType, locale)
  );
  const [contentTouched, setContentTouched] = useState<boolean>(
    initialDraft?.contentTouched ?? false
  );
  const [githubConfig, setGithubConfig] = useState<GithubExportConfig>(
    initialDraft?.githubConfig ?? {
      username: locale === 'it' ? 'tuo-utente' : 'tu-usuario',
      repoName: 'vektor-audio-web',
      visibility: 'public',
      branch: 'main',
      deployPlatform: 'github-pages',
    }
  );

  // Sync dark/light class on root <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Sync HTML lang attribute & title when locale changes
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = TRANSLATIONS[locale].metaTitle;
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale]);

  // Persist draft when working in steps
  useEffect(() => {
    if (currentStep === 'welcome') return;
    try {
      const payload: SavedDraft = {
        answers,
        manualStackId,
        templateId,
        sections,
        graphicStyleId,
        colorPatternId,
        customAccent,
        content,
        contentTouched,
        githubConfig,
        maxVisitedIndex,
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore if user uploaded a large image exceeding localStorage quota
    }
  }, [
    currentStep,
    answers,
    manualStackId,
    templateId,
    sections,
    graphicStyleId,
    colorPatternId,
    customAccent,
    content,
    contentTouched,
    githubConfig,
    maxVisitedIndex,
  ]);

  const templates = useMemo(() => getTemplates(locale), [locale]);
  const graphicStyles = useMemo(() => getGraphicStyles(locale), [locale]);
  const colorPatterns = useMemo(() => getColorPatterns(locale), [locale]);
  const allStacks = useMemo(() => getAllStacks(locale), [locale]);

  const recommendedStack = useMemo(
    () => computeStackRecommendation(answers, locale),
    [answers, locale]
  );
  const selectedStack = useMemo(() => {
    if (!manualStackId) return recommendedStack;
    return allStacks.find((s) => s.id === manualStackId) ?? recommendedStack;
  }, [manualStackId, recommendedStack, allStacks]);

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === templateId) ?? templates[0],
    [templates, templateId]
  );

  const selectedGraphicStyle = useMemo(
    () => graphicStyles.find((g) => g.id === graphicStyleId) ?? graphicStyles[0],
    [graphicStyles, graphicStyleId]
  );

  const selectedColorPattern = useMemo(() => {
    const base = colorPatterns.find((c) => c.id === colorPatternId) ?? colorPatterns[0];
    if (!customAccent) return base;
    return {
      ...base,
      accent: customAccent,
      accentText: isLightHex(customAccent) ? '#0A0B0D' : '#FFFFFF',
    };
  }, [colorPatterns, colorPatternId, customAccent]);

  function handleChangeLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;
    setLocale(nextLocale);
    setSections((prev) => localizeSections(prev, nextLocale));

    if (!contentTouched) {
      setContent(getStarterContentForProject(answers.projectType, nextLocale));
    }
    setGithubConfig((prev) => ({
      ...prev,
      username:
        prev.username === 'tu-usuario' || prev.username === 'tuo-utente'
          ? nextLocale === 'it'
            ? 'tuo-utente'
            : 'tu-usuario'
          : prev.username,
    }));
  }

  function navigateTo(step: StepId) {
    setCurrentStep(step);
    setMaxVisitedIndex((prev) => Math.max(prev, STEP_INDEX[step]));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleUpdateAnswers(next: DiscoveryAnswers) {
    const projectTypeChanged = next.projectType !== answers.projectType;
    setAnswers(next);

    if (projectTypeChanged) {
      const matchingTemplate =
        templates.find((t) => t.bestFor.includes(next.projectType)) ?? templates[0];
      setTemplateId(matchingTemplate.id);
      setSections(buildSectionsForTemplate(matchingTemplate, locale));

      if (!contentTouched) {
        const starter = getStarterContentForProject(next.projectType, locale);
        setContent(starter);
        setGithubConfig((prev) => ({
          ...prev,
          repoName: starter.brandName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, ''),
        }));
      }
    }
  }

  function handleSelectTemplate(tpl: TemplateDefinition) {
    setTemplateId(tpl.id);
    setSections(buildSectionsForTemplate(tpl, locale));
  }

  function handleToggleSection(sectionId: string) {
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === sectionId && !sec.required ? { ...sec, enabled: !sec.enabled } : sec
      )
    );
  }

  function handleMoveSection(sectionId: string, direction: 'up' | 'down') {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === sectionId);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      if (prev[targetIdx].required) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(idx, 1);
      copy.splice(targetIdx, 0, moved);
      return copy;
    });
  }

  function handleUpdateContent(next: SiteContent) {
    setContentTouched(true);
    setContent(next);
  }

  function handleResetProject() {
    const freshContent = getStarterContentForProject(
      DEFAULT_DISCOVERY_ANSWERS.projectType,
      locale
    );
    setAnswers(DEFAULT_DISCOVERY_ANSWERS);
    setManualStackId(null);
    setTemplateId(templates[0].id);
    setSections(buildSectionsForTemplate(templates[0], locale));
    setGraphicStyleId(graphicStyles[0].id);
    setColorPatternId(colorPatterns[0].id);
    setCustomAccent(null);
    setContent(freshContent);
    setContentTouched(false);
    setGithubConfig({
      username: locale === 'it' ? 'tuo-utente' : 'tu-usuario',
      repoName: 'vektor-audio-web',
      visibility: 'public',
      branch: 'main',
      deployPlatform: 'github-pages',
    });
    setMaxVisitedIndex(1);
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore
    }
    navigateTo('discovery');
  }

  function handleStartFresh() {
    navigateTo('discovery');
  }

  function handleResumeDraft() {
    const stepByIndex: StepId[] = [
      'welcome',
      'discovery',
      'template',
      'style',
      'content',
      'export',
    ];
    const target = stepByIndex[Math.min(Math.max(maxVisitedIndex, 1), 5)] ?? 'discovery';
    navigateTo(target);
  }

  const footerT = TRANSLATIONS[locale].footer;

  return (
    <div className="min-h-screen hud-grid-bg bg-[#F3F4F6] text-[#111318] dark:bg-[#0A0B0D] dark:text-[#F4F6F9] flex flex-col">
      <TopBar
        locale={locale}
        currentStep={currentStep}
        maxVisitedIndex={maxVisitedIndex}
        theme={theme}
        onChangeLocale={handleChangeLocale}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        onNavigateStep={navigateTo}
        onResetProject={handleResetProject}
      />

      <main className="flex-1">
        {currentStep === 'welcome' ? (
          <WelcomeView
            locale={locale}
            hasSavedDraft={Boolean(initialDraft)}
            savedBrandName={initialDraft?.content?.brandName}
            onStartNew={handleStartFresh}
            onResumeDraft={handleResumeDraft}
          />
        ) : null}

        {currentStep === 'discovery' ? (
          <DiscoveryStep
            locale={locale}
            answers={answers}
            recommendedStack={recommendedStack}
            selectedStack={selectedStack}
            onUpdateAnswers={handleUpdateAnswers}
            onSelectManualStack={setManualStackId}
            onNext={() => navigateTo('template')}
          />
        ) : null}

        {currentStep === 'template' ? (
          <TemplateStep
            locale={locale}
            answers={answers}
            stack={selectedStack}
            selectedTemplate={selectedTemplate}
            sections={sections}
            onSelectTemplate={handleSelectTemplate}
            onToggleSection={handleToggleSection}
            onMoveSection={handleMoveSection}
            onBack={() => navigateTo('discovery')}
            onNext={() => navigateTo('style')}
          />
        ) : null}

        {currentStep === 'style' ? (
          <StyleStep
            locale={locale}
            template={selectedTemplate}
            sections={sections}
            graphicStyle={selectedGraphicStyle}
            colorPattern={
              colorPatterns.find((c) => c.id === colorPatternId) ?? colorPatterns[0]
            }
            customAccent={customAccent}
            content={content}
            onSelectGraphicStyle={(style: GraphicStylePreset) => setGraphicStyleId(style.id)}
            onSelectColorPattern={(pattern: ColorPatternPreset) => setColorPatternId(pattern.id)}
            onSetCustomAccent={setCustomAccent}
            onBack={() => navigateTo('template')}
            onNext={() => navigateTo('content')}
          />
        ) : null}

        {currentStep === 'content' ? (
          <ContentStep
            locale={locale}
            template={selectedTemplate}
            sections={sections}
            graphicStyle={selectedGraphicStyle}
            colorPattern={selectedColorPattern}
            content={content}
            onUpdateContent={handleUpdateContent}
            onBack={() => navigateTo('style')}
            onNext={() => navigateTo('export')}
          />
        ) : null}

        {currentStep === 'export' ? (
          <ExportStep
            locale={locale}
            answers={answers}
            stack={selectedStack}
            template={selectedTemplate}
            sections={sections}
            graphicStyle={selectedGraphicStyle}
            colorPattern={selectedColorPattern}
            content={content}
            githubConfig={githubConfig}
            onUpdateGithubConfig={setGithubConfig}
            onBack={() => navigateTo('content')}
          />
        ) : null}
      </main>

      <footer className="border-t border-[#D0D5DF] bg-[#F3F4F6]/90 py-5 dark:border-[#262B36] dark:bg-[#0A0B0D]/90">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6 text-xs text-[#4B5565] dark:text-[#9BA4B5]">
          <span>{footerT.left}</span>
          <span className="font-mono tabular-nums">
            {currentStep === 'welcome'
              ? footerT.rightWelcome
              : footerT.rightActive(content.brandName)}
          </span>
        </div>
      </footer>
    </div>
  );
}
