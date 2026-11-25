import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Cpu, Database, Globe, Server } from 'lucide-react';
import {
  ALL_STACKS,
  ARCHITECTURE_MODE_OPTIONS,
  DATABASE_NEED_OPTIONS,
  INTEGRATION_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  RENDERING_STRATEGY_OPTIONS,
} from '../data/presets';
import {
  DiscoveryAnswers,
  IntegrationOption,
  StackRecommendation,
} from '../types/builder';

interface DiscoveryStepProps {
  answers: DiscoveryAnswers;
  recommendedStack: StackRecommendation;
  selectedStack: StackRecommendation;
  onUpdateAnswers: (next: DiscoveryAnswers) => void;
  onSelectManualStack: (stackId: string | null) => void;
  onNext: () => void;
}

const QUESTION_TABS = [
  { id: 0, short: '01. Objetivo', title: '¿Qué tipo de página o solución deseas construir?' },
  { id: 1, short: '02. Servidor', title: '¿Necesitas lógica de servidor o solo frontend?' },
  { id: 2, short: '03. Datos', title: '¿Cómo quieres gestionar y almacenar los datos?' },
  { id: 3, short: '04. Renderizado', title: '¿Qué modelo de carga y rendimiento prefieres?' },
  { id: 4, short: '05. Integraciones', title: '¿Qué capacidades adicionales deseas incluir?' },
];

export function DiscoveryStep({
  answers,
  recommendedStack,
  selectedStack,
  onUpdateAnswers,
  onSelectManualStack,
  onNext,
}: DiscoveryStepProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showAlternatives, setShowAlternatives] = useState(false);

  const activeQuestion = QUESTION_TABS[questionIndex];

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
            Paso 1 de 5 · Diagnóstico de arquitectura
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111318] dark:text-[#F4F6F9]">
            Definamos el mejor stack técnico para tu proyecto
          </h1>
        </div>
        <div className="text-xs font-mono text-[#4B5565] dark:text-[#9BA4B5] tabular-nums">
          Pregunta {questionIndex + 1} de {QUESTION_TABS.length}
        </div>
      </div>

      {/* Main 2-column HUD workspace */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left: Interactive Questionnaire */}
        <div className="lg:col-span-7 space-y-6">
          {/* Interactive Question Tabs */}
          <div className="flex flex-wrap gap-1.5 border border-[#D0D5DF] bg-[#E9ECF1] p-1.5 dark:border-[#262B36] dark:bg-[#111318]">
            {QUESTION_TABS.map((tab) => {
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

          {/* Current Question Card */}
          <div className="hud-frame border border-[#D0D5DF] bg-white p-6 sm:p-8 dark:border-[#262B36] dark:bg-[#111318] space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-[#111318] dark:text-[#F4F6F9]">
                {activeQuestion.title}
              </h2>
              <p className="text-sm text-[#4B5565] dark:text-[#9BA4B5]">
                {questionIndex === 4
                  ? 'Selecciona todas las integraciones que necesites (opcional).'
                  : 'El panel derecho recalcula tu arquitectura recomendada en tiempo real.'}
              </p>
            </div>

            {/* Question 0: Project Type */}
            {questionIndex === 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {PROJECT_TYPE_OPTIONS.map((opt) => {
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

            {/* Question 1: Architecture Mode */}
            {questionIndex === 1 ? (
              <div className="space-y-3">
                {ARCHITECTURE_MODE_OPTIONS.map((opt) => {
                  const selected = answers.architectureMode === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onSelectManualStack(null);
                        onUpdateAnswers({ ...answers, architectureMode: opt.value });
                      }}
                      className={`w-full text-left p-4 border transition-colors cursor-pointer space-y-1.5 ${
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
                    </button>
                  );
                })}
              </div>
            ) : null}

            {/* Question 2: Database Need */}
            {questionIndex === 2 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {DATABASE_NEED_OPTIONS.map((opt) => {
                  const selected = answers.databaseNeed === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onSelectManualStack(null);
                        onUpdateAnswers({ ...answers, databaseNeed: opt.value });
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

            {/* Question 3: Rendering Strategy */}
            {questionIndex === 3 ? (
              <div className="space-y-3">
                {RENDERING_STRATEGY_OPTIONS.map((opt) => {
                  const selected = answers.renderingStrategy === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onSelectManualStack(null);
                        onUpdateAnswers({ ...answers, renderingStrategy: opt.value });
                      }}
                      className={`w-full text-left p-4 border transition-colors cursor-pointer space-y-1.5 ${
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
                    </button>
                  );
                })}
              </div>
            ) : null}

            {/* Question 4: Integrations */}
            {questionIndex === 4 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {INTEGRATION_OPTIONS.map((opt) => {
                  const selected = answers.integrations.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleIntegration(opt.value)}
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
                    </button>
                  );
                })}
              </div>
            ) : null}

            {/* Navigation footer inside card */}
            <div className="flex items-center justify-between pt-4 border-t border-[#D0D5DF] dark:border-[#262B36]">
              <button
                type="button"
                disabled={questionIndex === 0}
                onClick={() => setQuestionIndex((prev) => Math.max(0, prev - 1))}
                className="inline-flex h-10 items-center gap-2 border border-[#D0D5DF] px-4 text-xs font-medium text-[#111318] transition-colors hover:border-[#111318] disabled:opacity-40 disabled:cursor-not-allowed dark:border-[#262B36] dark:text-[#F4F6F9] dark:hover:border-[#F4F6F9] cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Anterior</span>
              </button>

              {questionIndex < QUESTION_TABS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setQuestionIndex((prev) => prev + 1)}
                  className="inline-flex h-10 items-center gap-2 bg-[#111318] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#262B36] dark:bg-[#F4F6F9] dark:text-[#0A0B0D] dark:hover:bg-white cursor-pointer"
                >
                  <span>Siguiente pregunta</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onNext}
                  className="inline-flex h-10 items-center gap-2 bg-[#F5C400] px-5 text-xs font-semibold text-[#0A0B0D] transition-colors hover:bg-[#FFD000] cursor-pointer"
                >
                  <span>Confirmar stack y elegir plantilla</span>
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
                    ? 'Stack recomendado automáticamente'
                    : 'Stack seleccionado manualmente'}
                </span>
                <span className="text-[#4B5565] dark:text-[#9BA4B5] tabular-nums">
                  Complejidad: {selectedStack.complexity}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#111318] dark:text-[#F4F6F9]">
                {selectedStack.name}
              </h3>
              <p className="text-sm leading-relaxed text-[#4B5565] dark:text-[#9BA4B5]">
                {selectedStack.summary}
              </p>
            </div>

            {/* 4-Layer Architecture Spec Table */}
            <div className="divide-y divide-[#D0D5DF] border-y border-[#D0D5DF] text-xs dark:divide-[#262B36] dark:border-[#262B36]">
              <div className="flex items-center justify-between gap-4 py-3">
                <span className="inline-flex items-center gap-2 text-[#4B5565] dark:text-[#9BA4B5]">
                  <Cpu className="h-3.5 w-3.5 text-[#9A7400] dark:text-[#F5C400]" />
                  Frontend
                </span>
                <span className="font-mono font-medium text-right text-[#111318] dark:text-[#F4F6F9]">
                  {selectedStack.frontend}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <span className="inline-flex items-center gap-2 text-[#4B5565] dark:text-[#9BA4B5]">
                  <Server className="h-3.5 w-3.5 text-[#9A7400] dark:text-[#F5C400]" />
                  Backend / API
                </span>
                <span className="font-mono font-medium text-right text-[#111318] dark:text-[#F4F6F9]">
                  {selectedStack.backend}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <span className="inline-flex items-center gap-2 text-[#4B5565] dark:text-[#9BA4B5]">
                  <Database className="h-3.5 w-3.5 text-[#9A7400] dark:text-[#F5C400]" />
                  Persistencia
                </span>
                <span className="font-mono font-medium text-right text-[#111318] dark:text-[#F4F6F9]">
                  {selectedStack.database}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <span className="inline-flex items-center gap-2 text-[#4B5565] dark:text-[#9BA4B5]">
                  <Globe className="h-3.5 w-3.5 text-[#9A7400] dark:text-[#F5C400]" />
                  Despliegue ideal
                </span>
                <span className="font-mono font-medium text-right text-[#111318] dark:text-[#F4F6F9]">
                  {selectedStack.deployTargets.slice(0, 2).join(' · ')}
                </span>
              </div>
            </div>

            {/* Rationale list */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold text-[#111318] dark:text-[#F4F6F9]">
                Por qué encaja con tus respuestas
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

            {/* Optional manual override */}
            <div className="pt-2 space-y-3 border-t border-[#D0D5DF] dark:border-[#262B36]">
              <button
                type="button"
                onClick={() => setShowAlternatives((prev) => !prev)}
                className="text-xs font-medium text-[#4B5565] underline underline-offset-4 hover:text-[#111318] dark:text-[#9BA4B5] dark:hover:text-[#F5C400] cursor-pointer"
              >
                {showAlternatives
                  ? 'Ocultar otros stacks disponibles'
                  : '¿Prefieres elegir otro stack manualmente?'}
              </button>

              {showAlternatives ? (
                <div className="space-y-2">
                  {ALL_STACKS.map((stack) => {
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
                          {stack.id === recommendedStack.id ? 'Óptimo' : stack.complexity}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}

              <button
                type="button"
                onClick={onNext}
                className="inline-flex h-11 w-full items-center justify-center gap-2 bg-[#F5C400] px-5 text-sm font-semibold text-[#0A0B0D] transition-colors hover:bg-[#FFD000] cursor-pointer"
              >
                <span>Continuar a plantillas</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
