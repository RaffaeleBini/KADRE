import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileCode2,
  GitBranch,
  Terminal,
} from 'lucide-react';
import { Locale, TRANSLATIONS } from '../i18n/translations';
import {
  ColorPatternPreset,
  DiscoveryAnswers,
  GithubExportConfig,
  GraphicStylePreset,
  SectionConfig,
  SiteContent,
  StackRecommendation,
  TemplateDefinition,
} from '../types/builder';
import {
  downloadRepositoryZip,
  generateRepositoryFiles,
  getExportScriptFilename,
  sanitizeRepoSlug,
} from '../generator';
import { ALL_PLATFORMS, platformAvailability, reasonText } from '../generator/matrix';

interface ExportStepProps {
  locale: Locale;
  answers: DiscoveryAnswers;
  stack: StackRecommendation;
  template: TemplateDefinition;
  sections: SectionConfig[];
  graphicStyle: GraphicStylePreset;
  colorPattern: ColorPatternPreset;
  content: SiteContent;
  githubConfig: GithubExportConfig;
  onUpdateGithubConfig: (next: GithubExportConfig) => void;
  onBack: () => void;
}


export function ExportStep({
  locale,
  answers,
  stack,
  template,
  sections,
  graphicStyle,
  colorPattern,
  content,
  githubConfig,
  onUpdateGithubConfig,
  onBack,
}: ExportStepProps) {
  const t = TRANSLATIONS[locale].exportStep;
  const scriptFilename = getExportScriptFilename(locale);

  const [selectedFilePath, setSelectedFilePath] = useState<string>('src/App.tsx');
  const [cliMode, setCliMode] = useState<'git' | 'gh'>('git');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const generatedFiles = useMemo(
    () =>
      generateRepositoryFiles({
        locale,
        answers,
        stack,
        template,
        sections,
        graphicStyle,
        colorPattern,
        content,
        github: githubConfig,
      }),
    [locale, answers, stack, template, sections, graphicStyle, colorPattern, content, githubConfig]
  );

  const activeFile =
    generatedFiles.find((f) => f.path === selectedFilePath) ?? generatedFiles[0];

  const cleanUser = (githubConfig.username || t.ghUserPlaceholder).trim();
  // stessa regola del generatore: lo slug mostrato qui è quello che finisce nel README e nello script
  const cleanRepo = sanitizeRepoSlug(githubConfig.repoName || content.brandName, locale);
  const branch = (githubConfig.branch || 'main').trim();

  const commitMessage =
    locale === 'it'
      ? `Versione iniziale di ${content.brandName}`
      : `Versión inicial de ${content.brandName}`;

  const gitPushCommands =
    cliMode === 'git'
      ? `git init
git add .
git commit -m "${commitMessage}"
git branch -M ${branch}
git remote add origin https://github.com/${cleanUser}/${cleanRepo}.git
git push -u origin ${branch}`
      : `gh auth login
gh repo create ${cleanRepo} --${githubConfig.visibility} --source=. --remote=origin --push`;

  const localVerifyCommands = `cd ${cleanRepo}
npm install
npm run dev`;

  async function copyText(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 2000);
    } catch {
      // Clipboard fallback ignored silently if restricted
    }
  }

  async function handleDownloadZip() {
    setDownloading(true);
    try {
      await downloadRepositoryZip(generatedFiles, content, cleanRepo, locale);
      setCompletedSteps((prev) => ({ ...prev, 2: true }));
    } finally {
      setDownloading(false);
    }
  }

  function handleDownloadScript() {
    const scriptFile = generatedFiles.find((f) => f.path === scriptFilename);
    if (!scriptFile) return;
    const blob = new Blob([scriptFile.content], { type: 'text/x-shellscript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = scriptFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function toggleStepDone(stepNum: number) {
    setCompletedSteps((prev) => ({ ...prev, [stepNum]: !prev[stepNum] }));
  }

  const inputClass =
    'w-full border border-[#D0D5DF] bg-[#F8F9FB] px-3 py-2 text-sm text-[#111318] font-mono focus:border-[#9A7400] focus:outline-none dark:border-[#262B36] dark:bg-[#0D0F13] dark:text-[#F4F6F9] dark:focus:border-[#F5C400]';

  const activePlatformLabel = t.platforms[githubConfig.deployPlatform].label;

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
        <div className="font-mono text-xs text-[#4B5565] dark:text-[#9BA4B5] tabular-nums">
          {t.filesReady(generatedFiles.length, stack.name)}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        <div className="lg:col-span-5 space-y-5">
          <div className="hud-frame border border-[#D0D5DF] bg-white p-6 dark:border-[#262B36] dark:bg-[#111318] space-y-5">
            <div className="flex items-center justify-between border-b border-[#D0D5DF] pb-3.5 dark:border-[#262B36]">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-[#9A7400] dark:text-[#F5C400]" />
                <h2 className="text-sm font-bold text-[#111318] dark:text-[#F4F6F9]">
                  {t.repoParamsHeading}
                </h2>
              </div>
              <span className="font-mono text-[11px] text-[#4B5565] dark:text-[#9BA4B5]">
                {t.customizesCommands}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="gh-user"
                  className="block text-xs font-medium text-[#4B5565] dark:text-[#9BA4B5] mb-1.5"
                >
                  {t.ghUserLabel}
                </label>
                <input
                  id="gh-user"
                  type="text"
                  value={githubConfig.username}
                  onChange={(e) =>
                    onUpdateGithubConfig({ ...githubConfig, username: e.target.value })
                  }
                  placeholder={t.ghUserPlaceholder}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="gh-repo"
                  className="block text-xs font-medium text-[#4B5565] dark:text-[#9BA4B5] mb-1.5"
                >
                  {t.ghRepoLabel}
                </label>
                <input
                  id="gh-repo"
                  type="text"
                  value={githubConfig.repoName}
                  onChange={(e) =>
                    onUpdateGithubConfig({ ...githubConfig, repoName: e.target.value })
                  }
                  placeholder={t.ghRepoPlaceholder}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="block text-xs font-medium text-[#4B5565] dark:text-[#9BA4B5] mb-1.5">
                  {t.visibilityLabel}
                </span>
                <div className="grid grid-cols-2 gap-1 border border-[#D0D5DF] bg-[#E9ECF1] p-1 dark:border-[#262B36] dark:bg-[#0D0F13]">
                  {(['public', 'private'] as const).map((vis) => (
                    <button
                      key={vis}
                      type="button"
                      onClick={() =>
                        onUpdateGithubConfig({ ...githubConfig, visibility: vis })
                      }
                      className={`py-1.5 text-xs font-medium cursor-pointer ${
                        githubConfig.visibility === vis
                          ? 'bg-[#F5C400] font-semibold text-[#0A0B0D]'
                          : 'text-[#4B5565] dark:text-[#9BA4B5]'
                      }`}
                    >
                      {vis === 'public' ? t.visibilityPublic : t.visibilityPrivate}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="gh-branch"
                  className="block text-xs font-medium text-[#4B5565] dark:text-[#9BA4B5] mb-1.5"
                >
                  {t.branchLabel}
                </label>
                <input
                  id="gh-branch"
                  type="text"
                  value={githubConfig.branch}
                  onChange={(e) =>
                    onUpdateGithubConfig({ ...githubConfig, branch: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-medium text-[#4B5565] dark:text-[#9BA4B5]">
                {t.deployPlatformLabel}
              </span>
              <div className="grid gap-2 sm:grid-cols-2">
                {ALL_PLATFORMS.map((platId) => {
                  const plat = t.platforms[platId];
                  const active = githubConfig.deployPlatform === platId;
                  const availability = platformAvailability(stack.id, platId);
                  const unavailable = availability.status !== 'available';
                  return (
                    <button
                      key={platId}
                      type="button"
                      disabled={unavailable}
                      aria-disabled={unavailable}
                      title={reasonText(availability, locale) ?? undefined}
                      onClick={() =>
                        onUpdateGithubConfig({ ...githubConfig, deployPlatform: platId })
                      }
                      className={`text-left p-2.5 border transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                        active
                          ? 'border-[#9A7400] bg-[#FEFCE8] dark:border-[#F5C400] dark:bg-[#F5C400]/10'
                          : 'border-[#D0D5DF] bg-[#F8F9FB] dark:border-[#262B36] dark:bg-[#151820]'
                      }`}
                    >
                      <div className="text-xs font-semibold text-[#111318] dark:text-[#F4F6F9]">
                        {plat.label}
                      </div>
                      <div className="text-[11px] text-[#4B5565] dark:text-[#9BA4B5]">
                        {unavailable ? reasonText(availability, locale) : plat.note}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[#D0D5DF] dark:border-[#262B36] space-y-2.5">
              <button
                type="button"
                disabled={downloading}
                onClick={handleDownloadZip}
                className="inline-flex h-12 w-full items-center justify-center gap-2.5 bg-[#F5C400] px-5 text-sm font-semibold text-[#0A0B0D] transition-colors hover:bg-[#FFD000] disabled:opacity-60 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>{downloading ? t.packagingBtn : t.downloadZipBtn(cleanRepo)}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadScript}
                className="inline-flex h-10 w-full items-center justify-center gap-2 border border-[#D0D5DF] bg-[#F8F9FB] px-4 text-xs font-medium text-[#111318] transition-colors hover:border-[#9A7400] dark:border-[#262B36] dark:bg-[#151820] dark:text-[#F4F6F9] dark:hover:border-[#F5C400] cursor-pointer"
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>{t.downloadScriptBtn(scriptFilename)}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="hud-frame border border-[#D0D5DF] bg-white p-6 dark:border-[#262B36] dark:bg-[#111318] space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D0D5DF] pb-4 dark:border-[#262B36]">
              <div>
                <h2 className="text-base font-bold text-[#111318] dark:text-[#F4F6F9]">
                  {t.guideHeading}
                </h2>
                <p className="text-xs text-[#4B5565] dark:text-[#9BA4B5]">{t.guideSubheading}</p>
              </div>
              <div className="flex items-center gap-1 border border-[#D0D5DF] bg-[#E9ECF1] p-0.5 dark:border-[#262B36] dark:bg-[#0D0F13]">
                <button
                  type="button"
                  onClick={() => setCliMode('git')}
                  className={`px-2.5 py-1 text-[11px] font-medium cursor-pointer ${
                    cliMode === 'git'
                      ? 'bg-[#F5C400] font-semibold text-[#0A0B0D]'
                      : 'text-[#4B5565] dark:text-[#9BA4B5]'
                  }`}
                >
                  {t.gitStandard}
                </button>
                <button
                  type="button"
                  onClick={() => setCliMode('gh')}
                  className={`px-2.5 py-1 text-[11px] font-medium cursor-pointer ${
                    cliMode === 'gh'
                      ? 'bg-[#F5C400] font-semibold text-[#0A0B0D]'
                      : 'text-[#4B5565] dark:text-[#9BA4B5]'
                  }`}
                >
                  {t.githubCli}
                </button>
              </div>
            </div>

            {/* Step 1 */}
            <div className="space-y-2.5 border-b border-[#D0D5DF] pb-5 dark:border-[#262B36]">
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => toggleStepDone(1)}
                  className="flex items-center gap-3 text-left cursor-pointer"
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center border font-mono text-xs ${
                      completedSteps[1]
                        ? 'border-[#9A7400] bg-[#F5C400] font-bold text-[#0A0B0D]'
                        : 'border-[#D0D5DF] text-[#9A7400] dark:border-[#262B36] dark:text-[#F5C400]'
                    }`}
                  >
                    {completedSteps[1] ? <Check className="h-3.5 w-3.5" /> : '1'}
                  </span>
                  <span className="text-sm font-bold text-[#111318] dark:text-[#F4F6F9]">
                    {t.step1Title}
                  </span>
                </button>

                <a
                  href={`https://github.com/new?name=${encodeURIComponent(cleanRepo)}&visibility=${githubConfig.visibility}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A7400] hover:underline dark:text-[#F5C400] whitespace-nowrap shrink-0"
                >
                  <span>{t.openGithub}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <p className="pl-9 text-xs leading-relaxed text-[#4B5565] dark:text-[#9BA4B5]">
                {t.step1BodyPrefix}{' '}
                <code className="font-mono text-[#111318] dark:text-[#F4F6F9]">{cleanRepo}</code>{' '}
                {t.step1BodyMiddle}{' '}
                <strong>
                  {githubConfig.visibility === 'public' ? t.visibilityPublic : t.visibilityPrivate}
                </strong>
                . {t.step1BodySuffix}
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-2.5 border-b border-[#D0D5DF] pb-5 dark:border-[#262B36]">
              <button
                type="button"
                onClick={() => toggleStepDone(2)}
                className="flex items-center gap-3 text-left cursor-pointer"
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center border font-mono text-xs ${
                    completedSteps[2]
                      ? 'border-[#9A7400] bg-[#F5C400] font-bold text-[#0A0B0D]'
                      : 'border-[#D0D5DF] text-[#9A7400] dark:border-[#262B36] dark:text-[#F5C400]'
                  }`}
                >
                  {completedSteps[2] ? <Check className="h-3.5 w-3.5" /> : '2'}
                </span>
                <span className="text-sm font-bold text-[#111318] dark:text-[#F4F6F9]">
                  {t.step2Title}
                </span>
              </button>
              <div className="pl-9 space-y-2">
                <p className="text-xs text-[#4B5565] dark:text-[#9BA4B5]">
                  {t.step2BodyPrefix}{' '}
                  <code className="font-mono text-[#111318] dark:text-[#F4F6F9]">{cleanRepo}</code>{' '}
                  {t.step2BodySuffix}
                </p>
                <div className="relative border border-[#D0D5DF] bg-[#F8F9FB] p-3 dark:border-[#262B36] dark:bg-[#0A0B0D]">
                  <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-[#111318] dark:text-[#F4F6F9]">
                    {localVerifyCommands}
                  </pre>
                  <button
                    type="button"
                    onClick={() => copyText('local', localVerifyCommands)}
                    className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 border border-[#D0D5DF] bg-white px-2 py-1 text-[11px] font-medium text-[#111318] dark:border-[#262B36] dark:bg-[#151820] dark:text-[#F4F6F9] cursor-pointer"
                  >
                    {copiedId === 'local' ? (
                      <>
                        <Check className="h-3 w-3 text-[#9A7400] dark:text-[#F5C400]" />
                        <span>{t.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>{t.copy}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-2.5 border-b border-[#D0D5DF] pb-5 dark:border-[#262B36]">
              <button
                type="button"
                onClick={() => toggleStepDone(3)}
                className="flex items-center gap-3 text-left cursor-pointer"
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center border font-mono text-xs ${
                    completedSteps[3]
                      ? 'border-[#9A7400] bg-[#F5C400] font-bold text-[#0A0B0D]'
                      : 'border-[#D0D5DF] text-[#9A7400] dark:border-[#262B36] dark:text-[#F5C400]'
                  }`}
                >
                  {completedSteps[3] ? <Check className="h-3.5 w-3.5" /> : '3'}
                </span>
                <span className="text-sm font-bold text-[#111318] dark:text-[#F4F6F9]">
                  {t.step3Title}
                </span>
              </button>
              <div className="pl-9 space-y-2">
                <p className="text-xs text-[#4B5565] dark:text-[#9BA4B5]">
                  {cliMode === 'git' ? t.step3BodyGit(scriptFilename) : t.step3BodyGh}
                </p>
                <div className="relative border border-[#D0D5DF] bg-[#F8F9FB] p-3 dark:border-[#262B36] dark:bg-[#0A0B0D]">
                  <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-[#111318] dark:text-[#F4F6F9] pr-20">
                    {gitPushCommands}
                  </pre>
                  <button
                    type="button"
                    onClick={() => copyText('push', gitPushCommands)}
                    className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 border border-[#D0D5DF] bg-white px-2 py-1 text-[11px] font-medium text-[#111318] dark:border-[#262B36] dark:bg-[#151820] dark:text-[#F4F6F9] cursor-pointer"
                  >
                    {copiedId === 'push' ? (
                      <>
                        <Check className="h-3 w-3 text-[#9A7400] dark:text-[#F5C400]" />
                        <span>{t.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>{t.copy}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => toggleStepDone(4)}
                className="flex items-center gap-3 text-left cursor-pointer"
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center border font-mono text-xs ${
                    completedSteps[4]
                      ? 'border-[#9A7400] bg-[#F5C400] font-bold text-[#0A0B0D]'
                      : 'border-[#D0D5DF] text-[#9A7400] dark:border-[#262B36] dark:text-[#F5C400]'
                  }`}
                >
                  {completedSteps[4] ? <Check className="h-3.5 w-3.5" /> : '4'}
                </span>
                <span className="text-sm font-bold text-[#111318] dark:text-[#F4F6F9]">
                  {t.step4Title(activePlatformLabel)}
                </span>
              </button>

              <div className="pl-9 text-xs leading-relaxed text-[#4B5565] dark:text-[#9BA4B5] space-y-2">
                {githubConfig.deployPlatform === 'node-server' ? (
                  <>
                    <p>
                      {t.step4Node1}{' '}
                      <code className="font-mono text-[#111318] dark:text-[#F4F6F9]">
                        {cleanUser}/{cleanRepo}
                      </code>{' '}
                      ({t.step4Other2Branch} <code className="font-mono">{branch}</code>).
                    </p>
                    <p>
                      {t.step4Node2Build} <code className="font-mono">npm install && npm run build</code>{' '}
                      {t.step4Node2Start} <code className="font-mono">npm start</code>.
                      {stack.includesDatabase ? t.step4Other3Db : ''}
                    </p>
                  </>
                ) : githubConfig.deployPlatform === 'github-pages' && !stack.includesBackend ? (
                  <>
                    <p>{t.step4Pages1}</p>
                    <p>{t.step4Pages2}</p>
                    <p>
                      {t.step4Pages3Prefix}{' '}
                      <code className="font-mono">.github/workflows/deploy.yml</code>{' '}
                      {t.step4Pages3Middle}{' '}
                      <code className="font-mono text-[#9A7400] dark:text-[#F5C400]">
                        https://{cleanUser}.github.io/{cleanRepo}/
                      </code>
                      .
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      {t.step4Other1Prefix}{' '}
                      <strong className="text-[#111318] dark:text-[#F4F6F9]">
                        {activePlatformLabel}
                      </strong>{' '}
                      {t.step4Other1Suffix}
                    </p>
                    <p>
                      {t.step4Other2Prefix}{' '}
                      <code className="font-mono text-[#111318] dark:text-[#F4F6F9]">
                        {cleanUser}/{cleanRepo}
                      </code>{' '}
                      ({t.step4Other2Branch} <code className="font-mono">{branch}</code>).
                    </p>
                    <p>
                      {t.step4Other3Build} <code className="font-mono">npm run build</code> ·{' '}
                      {t.step4Other3Out} <code className="font-mono">dist</code>.
                      {stack.includesDatabase ? t.step4Other3Db : ''}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="hud-frame border border-[#D0D5DF] bg-white dark:border-[#262B36] dark:bg-[#111318] overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D0D5DF] px-5 py-3.5 dark:border-[#262B36]">
          <div className="flex items-center gap-2">
            <FileCode2 className="h-4 w-4 text-[#9A7400] dark:text-[#F5C400]" />
            <h2 className="text-sm font-bold text-[#111318] dark:text-[#F4F6F9]">
              {t.explorerHeading}
            </h2>
          </div>
          <span className="font-mono text-xs text-[#4B5565] dark:text-[#9BA4B5] tabular-nums">
            {activeFile.path} · {t.linesCount(activeFile.content.split('\n').length)}
          </span>
        </div>

        <div className="grid lg:grid-cols-12">
          <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[#D0D5DF] dark:border-[#262B36] max-h-[460px] overflow-y-auto divide-y divide-[#D0D5DF]/60 dark:divide-[#262B36]/60">
            {generatedFiles.map((file) => {
              const active = file.path === activeFile.path;
              return (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left px-4 py-2.5 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#FEFCE8] text-[#111318] dark:bg-[#F5C400]/15 dark:text-[#F5C400]'
                      : 'text-[#4B5565] hover:bg-[#F8F9FB] hover:text-[#111318] dark:text-[#9BA4B5] dark:hover:bg-[#171A21] dark:hover:text-[#F4F6F9]'
                  }`}
                >
                  <div className="font-mono text-xs font-medium truncate">{file.path}</div>
                  <div className="text-[11px] opacity-75 truncate mt-0.5">{file.description}</div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-9 flex flex-col bg-[#F8F9FB] dark:bg-[#0A0B0D]">
            <div className="flex items-center justify-between gap-3 border-b border-[#D0D5DF] bg-white px-4 py-2 dark:border-[#262B36] dark:bg-[#151820]">
              <span className="text-xs text-[#4B5565] dark:text-[#9BA4B5] truncate">
                {activeFile.description}
              </span>
              <button
                type="button"
                onClick={() => copyText('file', activeFile.content)}
                className="inline-flex items-center gap-1.5 border border-[#D0D5DF] bg-[#F8F9FB] px-3 py-1 text-xs font-medium text-[#111318] hover:border-[#9A7400] dark:border-[#262B36] dark:bg-[#111318] dark:text-[#F4F6F9] dark:hover:border-[#F5C400] whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copiedId === 'file' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#9A7400] dark:text-[#F5C400]" />
                    <span>{t.fileCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>{t.copyFile}</span>
                  </>
                )}
              </button>
            </div>

            <div className="max-h-[420px] overflow-auto p-4 font-mono text-xs leading-6">
              {activeFile.content.split('\n').map((line, i) => (
                <div key={i} className="flex gap-4">
                  <span className="w-8 shrink-0 select-none text-right text-[#9BA4B5] dark:text-[#4B5565] tabular-nums">
                    {i + 1}
                  </span>
                  <span className="whitespace-pre text-[#111318] dark:text-[#E5E9F0]">
                    {line || ' '}
                  </span>
                </div>
              ))}
            </div>
          </div>
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
      </div>
    </div>
  );
}
