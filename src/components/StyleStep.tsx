import { ArrowLeft, ArrowRight, Check, Palette, Type } from 'lucide-react';
import { COLOR_PATTERNS, GRAPHIC_STYLES } from '../data/presets';
import {
  ColorPatternPreset,
  GraphicStylePreset,
  SectionConfig,
  SiteContent,
  TemplateDefinition,
} from '../types/builder';
import { LiveSitePreview } from './LiveSitePreview';

interface StyleStepProps {
  template: TemplateDefinition;
  sections: SectionConfig[];
  graphicStyle: GraphicStylePreset;
  colorPattern: ColorPatternPreset;
  customAccent: string | null;
  content: SiteContent;
  onSelectGraphicStyle: (style: GraphicStylePreset) => void;
  onSelectColorPattern: (pattern: ColorPatternPreset) => void;
  onSetCustomAccent: (hex: string | null) => void;
  onBack: () => void;
  onNext: () => void;
}

const ACCENT_SWATCHES = ['#F5C400', '#E07A38', '#38BDF8', '#22C55E', '#EF4444', '#A855F7'];

export function StyleStep({
  template,
  sections,
  graphicStyle,
  colorPattern,
  customAccent,
  content,
  onSelectGraphicStyle,
  onSelectColorPattern,
  onSetCustomAccent,
  onBack,
  onNext,
}: StyleStepProps) {
  const effectiveColorPattern: ColorPatternPreset = customAccent
    ? {
        ...colorPattern,
        accent: customAccent,
        accentText: isLightHex(customAccent) ? '#0A0B0D' : '#FFFFFF',
      }
    : colorPattern;

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8 lg:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D0D5DF] pb-5 dark:border-[#262B36]">
        <div className="space-y-1.5">
          <p className="font-mono text-xs font-medium text-[#9A7400] dark:text-[#F5C400]">
            Paso 3 de 5 · Dirección visual y paleta
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111318] dark:text-[#F4F6F9]">
            Elige el estilo gráfico y patrón de colores
          </h1>
        </div>
        <div className="text-xs font-mono text-[#4B5565] dark:text-[#9BA4B5]">
          {graphicStyle.name} · {colorPattern.name}
        </div>
      </div>

      {/* Split Studio */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Graphic Styles */}
          <div className="hud-frame border border-[#D0D5DF] bg-white p-5 dark:border-[#262B36] dark:bg-[#111318] space-y-4">
            <div className="flex items-center gap-2 border-b border-[#D0D5DF] pb-3 dark:border-[#262B36]">
              <Type className="h-4 w-4 text-[#9A7400] dark:text-[#F5C400]" />
              <h2 className="text-sm font-bold text-[#111318] dark:text-[#F4F6F9]">
                Estilo gráfico y tipografía
              </h2>
            </div>

            <div className="grid gap-2.5">
              {GRAPHIC_STYLES.map((style) => {
                const selected = style.id === graphicStyle.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => onSelectGraphicStyle(style)}
                    className={`w-full text-left p-3.5 border transition-colors cursor-pointer space-y-1 ${
                      selected
                        ? 'border-[#9A7400] bg-[#FEFCE8] dark:border-[#F5C400] dark:bg-[#F5C400]/10'
                        : 'border-[#D0D5DF] bg-[#F8F9FB] hover:border-[#9BA4B5] dark:border-[#262B36] dark:bg-[#151820]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="text-sm font-bold text-[#111318] dark:text-[#F4F6F9]"
                        style={{ fontFamily: style.fontDisplay }}
                      >
                        {style.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-[#4B5565] dark:text-[#9BA4B5]">
                          Radio {style.borderRadius}
                        </span>
                        {selected ? (
                          <Check className="h-4 w-4 text-[#9A7400] dark:text-[#F5C400]" />
                        ) : null}
                      </div>
                    </div>
                    <p className="text-xs text-[#4B5565] dark:text-[#9BA4B5]">
                      {style.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Patterns */}
          <div className="hud-frame border border-[#D0D5DF] bg-white p-5 dark:border-[#262B36] dark:bg-[#111318] space-y-4">
            <div className="flex items-center justify-between border-b border-[#D0D5DF] pb-3 dark:border-[#262B36]">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-[#9A7400] dark:text-[#F5C400]" />
                <h2 className="text-sm font-bold text-[#111318] dark:text-[#F4F6F9]">
                  Patrones de colores
                </h2>
              </div>
              <span className="font-mono text-[11px] text-[#4B5565] dark:text-[#9BA4B5]">
                Oscuros y claros
              </span>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {COLOR_PATTERNS.map((pattern) => {
                const selected = pattern.id === colorPattern.id;
                return (
                  <button
                    key={pattern.id}
                    type="button"
                    onClick={() => {
                      onSetCustomAccent(null);
                      onSelectColorPattern(pattern);
                    }}
                    className={`text-left p-3 border transition-colors cursor-pointer space-y-2.5 ${
                      selected
                        ? 'border-[#9A7400] bg-[#FEFCE8] dark:border-[#F5C400] dark:bg-[#F5C400]/10'
                        : 'border-[#D0D5DF] bg-[#F8F9FB] hover:border-[#9BA4B5] dark:border-[#262B36] dark:bg-[#151820]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <span
                          className="h-4 w-4 border border-black/15"
                          style={{ backgroundColor: pattern.background }}
                          title="Fondo"
                        />
                        <span
                          className="h-4 w-4 border border-black/15"
                          style={{ backgroundColor: pattern.surface }}
                          title="Superficie"
                        />
                        <span
                          className="h-4 w-4 border border-black/15"
                          style={{ backgroundColor: pattern.text }}
                          title="Texto"
                        />
                        <span
                          className="h-4 w-4 border border-black/15"
                          style={{ backgroundColor: pattern.accent }}
                          title="Acento"
                        />
                      </div>
                      <span className="font-mono text-[10px] text-[#4B5565] dark:text-[#9BA4B5]">
                        {pattern.mode === 'dark' ? 'Oscuro' : 'Claro'}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#111318] dark:text-[#F4F6F9]">
                        {pattern.name}
                      </div>
                      <p className="text-[11px] leading-snug text-[#4B5565] dark:text-[#9BA4B5] mt-0.5">
                        {pattern.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Accent Fine-Tuning */}
            <div className="pt-3 border-t border-[#D0D5DF] dark:border-[#262B36] space-y-2.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="accent-color-picker"
                  className="text-xs font-medium text-[#111318] dark:text-[#F4F6F9]"
                >
                  Ajuste fino de color de acento
                </label>
                {customAccent ? (
                  <button
                    type="button"
                    onClick={() => onSetCustomAccent(null)}
                    className="text-[11px] text-[#9A7400] underline dark:text-[#F5C400] cursor-pointer"
                  >
                    Restaurar original
                  </button>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {ACCENT_SWATCHES.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => onSetCustomAccent(hex)}
                    aria-label={`Color de acento ${hex}`}
                    className={`h-7 w-7 border cursor-pointer transition-transform hover:scale-105 ${
                      effectiveColorPattern.accent.toLowerCase() === hex.toLowerCase()
                        ? 'ring-2 ring-[#9A7400] dark:ring-[#F5C400] border-white'
                        : 'border-black/20'
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
                <input
                  id="accent-color-picker"
                  type="color"
                  value={effectiveColorPattern.accent}
                  onChange={(e) => onSetCustomAccent(e.target.value)}
                  className="h-7 w-10 cursor-pointer border border-[#D0D5DF] bg-transparent p-0.5 dark:border-[#262B36]"
                />
                <span className="font-mono text-xs text-[#4B5565] dark:text-[#9BA4B5] uppercase">
                  {effectiveColorPattern.accent}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Preview */}
        <div className="lg:col-span-7 lg:sticky lg:top-20">
          <LiveSitePreview
            template={template}
            sections={sections}
            graphicStyle={graphicStyle}
            colorPattern={effectiveColorPattern}
            content={content}
          />
        </div>
      </div>

      {/* Bottom Step Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-11 items-center gap-2 border border-[#D0D5DF] bg-white px-5 text-sm font-medium text-[#111318] transition-colors hover:border-[#111318] dark:border-[#262B36] dark:bg-[#111318] dark:text-[#F4F6F9] dark:hover:border-[#F4F6F9] cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a plantillas</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex h-11 items-center gap-2 bg-[#F5C400] px-6 text-sm font-semibold text-[#0A0B0D] transition-colors hover:bg-[#FFD000] cursor-pointer"
        >
          <span>Cargar contenidos de la página</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function isLightHex(hex: string): boolean {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return true;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.58;
}
