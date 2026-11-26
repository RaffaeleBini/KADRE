import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { slugify } from '../generator/context';
import { buildSiteConfig, siteCssVars } from '../generator/skeletons/vite-react/siteConfig';
import { Locale, TRANSLATIONS } from '../i18n/translations';
import { Site } from '../site-template/vite-react/site/Site';
import {
  ColorPatternPreset,
  GraphicStylePreset,
  SectionConfig,
  SiteContent,
  TemplateDefinition,
} from '../types/builder';

interface LiveSitePreviewProps {
  locale: Locale;
  template: TemplateDefinition;
  sections: SectionConfig[];
  graphicStyle: GraphicStylePreset;
  colorPattern: ColorPatternPreset;
  content: SiteContent;
  previewSlug?: string;
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

/** Larghezza reale simulata: il sito viene disegnato a questa larghezza e poi scalato. */
const VIEWPORT_WIDTH: Record<ViewportMode, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 390,
};

/** Osserva la dimensione di un elemento. */
function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, size] as const;
}

/**
 * Anteprima del sito: renderizza gli STESSI componenti che vengono esportati
 * (src/site-template/vite-react/site), con le stesse variabili CSS e la stessa
 * configurazione. Ciò che si vede qui è ciò che si scarica.
 */
export function LiveSitePreview({
  locale,
  template,
  sections,
  graphicStyle,
  colorPattern,
  content,
  previewSlug,
}: LiveSitePreviewProps) {
  const t = TRANSLATIONS[locale].preview;
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [paneRef, pane] = useElementSize<HTMLDivElement>();
  const siteRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const siteWidth = VIEWPORT_WIDTH[viewport];
  const scale = pane.width > 0 ? Math.min(1, pane.width / siteWidth) : 1;

  const config = useMemo(
    () => buildSiteConfig({ locale, template, sections, hasBackendApi: false }),
    [locale, template, sections]
  );
  const cssVars = useMemo(
    () => siteCssVars(graphicStyle, colorPattern) as React.CSSProperties,
    [graphicStyle, colorPattern]
  );

  const displaySlug = slugify(previewSlug || content.brandName);

  /** I link interni (#features…) scorrono dentro l'anteprima invece di cambiare la pagina di KADRE. */
  function handleClickCapture(e: React.MouseEvent<HTMLDivElement>) {
    const anchor = (e.target as HTMLElement).closest('a');
    if (!anchor) return;
    e.preventDefault();
    const hash = anchor.getAttribute('href') ?? '';
    if (!hash.startsWith('#')) return;
    const scroller = scrollRef.current;
    const target = hash === '#top' ? null : siteRef.current?.querySelector<HTMLElement>(hash);
    if (!scroller) return;
    // posizione visiva (già scalata dallo zoom) del target rispetto al riquadro che scorre
    const top = target
      ? target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop
      : 0;
    scroller.scrollTo({ top, behavior: 'smooth' });
  }

  return (
    <div className="border border-[#D0D5DF] bg-[#E9ECF1] dark:border-[#262B36] dark:bg-[#0D0F13] flex flex-col">
      {/* Browser HUD toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D0D5DF] bg-white px-4 py-2.5 dark:border-[#262B36] dark:bg-[#111318]">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-[11px] font-medium text-[#9A7400] dark:text-[#F5C400] whitespace-nowrap shrink-0">
            {t.liveLabel}
          </span>
          <span className="truncate font-mono text-[11px] text-[#4B5565] dark:text-[#9BA4B5]">
            https://{displaySlug || (locale === 'it' ? 'mio-sito' : 'mi-web')}.github.io
          </span>
        </div>

        <div className="flex items-center gap-1 border border-[#D0D5DF] bg-[#F3F4F6] p-0.5 dark:border-[#262B36] dark:bg-[#0A0B0D]">
          {(
            [
              { id: 'desktop', label: t.desktop, icon: Monitor },
              { id: 'tablet', label: t.tablet, icon: Tablet },
              { id: 'mobile', label: t.mobile, icon: Smartphone },
            ] as const
          ).map((mode) => {
            const Icon = mode.icon;
            const active = viewport === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setViewport(mode.id)}
                title={`${mode.label} · ${VIEWPORT_WIDTH[mode.id]} px`}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#F5C400] text-[#0A0B0D]'
                    : 'text-[#4B5565] hover:text-[#111318] dark:text-[#9BA4B5] dark:hover:text-[#F4F6F9]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Viewport: il sito è disegnato alla larghezza reale e rimpicciolito (zoom) per entrare nel pannello */}
      <div ref={scrollRef} className="overflow-y-auto max-h-[760px] p-3 sm:p-5">
        <div ref={paneRef} className="w-full">
          <div
            // overflow-clip (non hidden): ritaglia senza diventare contenitore di scroll,
            // così l'header sticky del sito si aggancia al riquadro che scorre, come nel sito reale
            className="mx-auto overflow-clip shadow-sm"
            style={{ width: siteWidth * scale, outline: `1px solid ${colorPattern.border}` }}
          >
            <div
              ref={siteRef}
              onClickCapture={handleClickCapture}
              style={{
                ...cssVars,
                width: siteWidth,
                // zoom (non transform: scale) entra nel layout: lo sticky e le misure
                // restano coerenti e l'altezza del contenitore si adatta da sola
                zoom: scale,
              }}
            >
              <Site content={content} config={config} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
