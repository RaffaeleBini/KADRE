import React, { useState } from 'react';
import { Monitor, Smartphone, Tablet, Image as ImageIcon } from 'lucide-react';
import {
  ColorPatternPreset,
  GraphicStylePreset,
  SectionConfig,
  SiteContent,
  TemplateDefinition,
} from '../types/builder';

interface LiveSitePreviewProps {
  template: TemplateDefinition;
  sections: SectionConfig[];
  graphicStyle: GraphicStylePreset;
  colorPattern: ColorPatternPreset;
  content: SiteContent;
  previewSlug?: string;
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

function ResilientImage({
  src,
  alt,
  className,
  fallbackBg,
  fallbackText,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackBg: string;
  fallbackText: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 p-6 text-center ${className ?? ''}`}
        style={{ backgroundColor: fallbackBg, color: fallbackText }}
      >
        <ImageIcon className="h-6 w-6 opacity-60" />
        <span className="text-xs opacity-75">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export function LiveSitePreview({
  template,
  sections,
  graphicStyle,
  colorPattern,
  content,
  previewSlug,
}: LiveSitePreviewProps) {
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [openFaqId, setOpenFaqId] = useState<string | null>(content.faqs[0]?.id ?? null);
  const [contactSent, setContactSent] = useState(false);

  const enabledSections = sections.filter((s) => s.enabled);
  const isCompact = viewport === 'mobile';
  const isTablet = viewport === 'tablet';

  const padY =
    graphicStyle.spacingDensity === 'compact'
      ? 'py-10'
      : graphicStyle.spacingDensity === 'airy'
        ? 'py-16'
        : 'py-12';

  const navItems = [
    enabledSections.some((s) => s.type === 'features') ? 'Capacidades' : null,
    enabledSections.some((s) => s.type === 'catalog') ? 'Selección' : null,
    enabledSections.some((s) => s.type === 'pricing') ? 'Planes' : null,
    enabledSections.some((s) => s.type === 'faq') ? 'Preguntas' : null,
    enabledSections.some((s) => s.type === 'contact') ? 'Contacto' : null,
  ].filter(Boolean) as string[];

  const displaySlug = (previewSlug || content.brandName)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  function handlePreviewForm(e: React.FormEvent) {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => setContactSent(false), 3000);
  }

  return (
    <div className="border border-[#D0D5DF] bg-[#E9ECF1] dark:border-[#262B36] dark:bg-[#0D0F13] flex flex-col">
      {/* Browser HUD toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D0D5DF] bg-white px-4 py-2.5 dark:border-[#262B36] dark:bg-[#111318]">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-[11px] font-medium text-[#9A7400] dark:text-[#F5C400] whitespace-nowrap shrink-0">
            Vista previa en vivo
          </span>
          <span className="truncate font-mono text-[11px] text-[#4B5565] dark:text-[#9BA4B5]">
            https://{displaySlug || 'mi-web'}.github.io
          </span>
        </div>

        <div className="flex items-center gap-1 border border-[#D0D5DF] bg-[#F3F4F6] p-0.5 dark:border-[#262B36] dark:bg-[#0A0B0D]">
          {(
            [
              { id: 'desktop', label: 'Escritorio', icon: Monitor },
              { id: 'tablet', label: 'Tablet', icon: Tablet },
              { id: 'mobile', label: 'Móvil', icon: Smartphone },
            ] as const
          ).map((mode) => {
            const Icon = mode.icon;
            const active = viewport === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setViewport(mode.id)}
                title={mode.label}
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

      {/* Rendered Viewport Canvas */}
      <div className="overflow-y-auto max-h-[760px] p-3 sm:p-5 flex justify-center">
        <div
          className="w-full transition-all duration-200 overflow-hidden shadow-sm"
          style={{
            maxWidth:
              viewport === 'mobile' ? '390px' : viewport === 'tablet' ? '768px' : '100%',
            backgroundColor: colorPattern.background,
            color: colorPattern.text,
            fontFamily: graphicStyle.fontBody,
            border: `1px solid ${colorPattern.border}`,
          }}
        >
          {/* Preview Site Header */}
          <div
            className="flex items-center justify-between gap-4 px-5 py-3.5 border-b"
            style={{ borderColor: colorPattern.border, backgroundColor: colorPattern.background }}
          >
            <div
              className="flex items-center gap-2.5 font-bold text-sm whitespace-nowrap shrink-0"
              style={{ fontFamily: graphicStyle.fontDisplay }}
            >
              {content.logoDataUrl ? (
                <img
                  src={content.logoDataUrl}
                  alt={content.brandName}
                  className="h-6 w-6 object-contain"
                />
              ) : null}
              <span>{content.brandName}</span>
            </div>

            {!isCompact ? (
              <div className="flex items-center gap-4 text-xs" style={{ color: colorPattern.textMuted }}>
                {navItems.slice(0, 4).map((label) => (
                  <span key={label} className="whitespace-nowrap">
                    {label}
                  </span>
                ))}
              </div>
            ) : null}

            <span
              className="px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0"
              style={{
                backgroundColor: colorPattern.accent,
                color: colorPattern.accentText,
                borderRadius: graphicStyle.buttonRadius,
              }}
            >
              {content.heroCtaPrimary}
            </span>
          </div>

          {/* Preview Sections */}
          <div>
            {enabledSections.map((section) => {
              if (section.type === 'hero') {
                const centered = template.heroLayout === 'centered';
                return (
                  <section key={section.id} className={`px-6 ${padY}`}>
                    <div
                      className={
                        centered || isCompact
                          ? 'space-y-6 ' + (centered ? 'text-center mx-auto max-w-xl' : '')
                          : 'grid grid-cols-12 gap-6 items-stretch'
                      }
                    >
                      <div
                        className={
                          centered || isCompact
                            ? 'space-y-4'
                            : 'col-span-6 flex flex-col justify-center space-y-4'
                        }
                      >
                        <p
                          className="text-xs font-semibold"
                          style={{ color: colorPattern.accent }}
                        >
                          {content.heroEyebrow}
                        </p>
                        <h2
                          className={`${isCompact ? 'text-2xl' : 'text-3xl'} font-bold leading-tight [text-wrap:balance]`}
                          style={{
                            fontFamily: graphicStyle.fontDisplay,
                            letterSpacing: graphicStyle.headingTracking,
                          }}
                        >
                          {content.heroHeadline}
                        </h2>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: colorPattern.textMuted }}
                        >
                          {content.heroSubheadline}
                        </p>
                        <div
                          className={`flex flex-wrap gap-3 pt-1 ${centered ? 'justify-center' : ''}`}
                        >
                          <span
                            className="px-4 py-2 text-xs font-semibold"
                            style={{
                              backgroundColor: colorPattern.accent,
                              color: colorPattern.accentText,
                              borderRadius: graphicStyle.buttonRadius,
                            }}
                          >
                            {content.heroCtaPrimary}
                          </span>
                          <span
                            className="px-4 py-2 text-xs font-semibold"
                            style={{
                              border: `${graphicStyle.borderWidth} solid ${colorPattern.border}`,
                              borderRadius: graphicStyle.buttonRadius,
                            }}
                          >
                            {content.heroCtaSecondary}
                          </span>
                        </div>
                      </div>

                      <div className={centered || isCompact ? '' : 'col-span-6'}>
                        <div
                          className="h-full min-h-[210px] overflow-hidden"
                          style={{
                            border: `${graphicStyle.borderWidth} solid ${colorPattern.border}`,
                            borderRadius: graphicStyle.borderRadius,
                            backgroundColor: colorPattern.surface,
                          }}
                        >
                          <ResilientImage
                            src={content.heroImageUrl}
                            alt={content.brandName}
                            className="h-full w-full object-cover"
                            fallbackBg={colorPattern.surfaceAlt}
                            fallbackText={colorPattern.textMuted}
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                );
              }

              if (section.type === 'metrics') {
                return (
                  <section
                    key={section.id}
                    className="border-y"
                    style={{
                      borderColor: colorPattern.border,
                      backgroundColor: colorPattern.surface,
                    }}
                  >
                    <div
                      className={`grid ${isCompact ? 'grid-cols-2' : 'grid-cols-4'} divide-x`}
                      style={{ borderColor: colorPattern.border }}
                    >
                      {content.metrics.map((m) => (
                        <div
                          key={m.id}
                          className="p-4 space-y-1 border-b sm:border-b-0"
                          style={{ borderColor: colorPattern.border }}
                        >
                          <div
                            className="text-xl font-bold tabular-nums"
                            style={{
                              fontFamily: graphicStyle.fontDisplay,
                              color: colorPattern.accent,
                            }}
                          >
                            {m.value}
                          </div>
                          <div className="text-xs font-semibold">{m.label}</div>
                          <div className="text-[11px]" style={{ color: colorPattern.textMuted }}>
                            {m.context}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              }

              if (section.type === 'features') {
                return (
                  <section key={section.id} className={`px-6 ${padY} space-y-6`}>
                    <div className="max-w-lg space-y-1.5">
                      <h3
                        className="text-xl font-bold"
                        style={{ fontFamily: graphicStyle.fontDisplay }}
                      >
                        {content.featuresHeading}
                      </h3>
                      <p className="text-xs leading-relaxed" style={{ color: colorPattern.textMuted }}>
                        {content.featuresSubheading}
                      </p>
                    </div>
                    <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-3'}`}>
                      {content.features.map((f, i) => (
                        <div
                          key={f.id}
                          className="p-4 space-y-2"
                          style={{
                            backgroundColor: colorPattern.surface,
                            border: `${graphicStyle.borderWidth} solid ${colorPattern.border}`,
                            borderRadius: graphicStyle.borderRadius,
                          }}
                        >
                          <div
                            className="flex items-center justify-between text-[11px] tabular-nums"
                            style={{ color: colorPattern.textMuted }}
                          >
                            <span>0{i + 1}</span>
                            <span>{f.metric}</span>
                          </div>
                          <h4
                            className="text-sm font-semibold"
                            style={{ fontFamily: graphicStyle.fontDisplay }}
                          >
                            {f.title}
                          </h4>
                          <p
                            className="text-xs leading-relaxed"
                            style={{ color: colorPattern.textMuted }}
                          >
                            {f.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              }

              if (section.type === 'catalog') {
                return (
                  <section key={section.id} className={`px-6 ${padY} space-y-6`}>
                    <div className="max-w-lg space-y-1.5">
                      <h3
                        className="text-xl font-bold"
                        style={{ fontFamily: graphicStyle.fontDisplay }}
                      >
                        {content.catalogHeading}
                      </h3>
                      <p className="text-xs leading-relaxed" style={{ color: colorPattern.textMuted }}>
                        {content.catalogSubheading}
                      </p>
                    </div>
                    <div
                      className={`grid gap-4 ${
                        isCompact ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3'
                      }`}
                    >
                      {content.catalogItems.map((item) => (
                        <div
                          key={item.id}
                          className="overflow-hidden"
                          style={{
                            backgroundColor: colorPattern.surface,
                            border: `${graphicStyle.borderWidth} solid ${colorPattern.border}`,
                            borderRadius: graphicStyle.borderRadius,
                          }}
                        >
                          <div className="aspect-[16/10] overflow-hidden">
                            <ResilientImage
                              src={item.imageUrl}
                              alt={item.title}
                              className="h-full w-full object-cover"
                              fallbackBg={colorPattern.surfaceAlt}
                              fallbackText={colorPattern.textMuted}
                            />
                          </div>
                          <div className="p-4 space-y-1.5">
                            <div
                              className="flex items-center justify-between text-[11px]"
                              style={{ color: colorPattern.textMuted }}
                            >
                              <span>{item.category}</span>
                              <span
                                className="font-semibold tabular-nums"
                                style={{ color: colorPattern.accent }}
                              >
                                {item.priceOrTag}
                              </span>
                            </div>
                            <h4
                              className="text-sm font-semibold"
                              style={{ fontFamily: graphicStyle.fontDisplay }}
                            >
                              {item.title}
                            </h4>
                            <p
                              className="text-xs leading-relaxed"
                              style={{ color: colorPattern.textMuted }}
                            >
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              }

              if (section.type === 'pricing') {
                return (
                  <section key={section.id} className={`px-6 ${padY} space-y-6`}>
                    <div className="max-w-lg space-y-1.5">
                      <h3
                        className="text-xl font-bold"
                        style={{ fontFamily: graphicStyle.fontDisplay }}
                      >
                        {content.pricingHeading}
                      </h3>
                      <p className="text-xs" style={{ color: colorPattern.textMuted }}>
                        {content.pricingSubheading}
                      </p>
                    </div>
                    <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-3'}`}>
                      {content.pricingPlans.map((plan) => (
                        <div
                          key={plan.id}
                          className="p-4 flex flex-col justify-between space-y-4"
                          style={{
                            backgroundColor: colorPattern.surface,
                            border: plan.featured
                              ? `2px solid ${colorPattern.accent}`
                              : `${graphicStyle.borderWidth} solid ${colorPattern.border}`,
                            borderRadius: graphicStyle.borderRadius,
                          }}
                        >
                          <div className="space-y-3">
                            <div>
                              <h4
                                className="text-sm font-bold"
                                style={{ fontFamily: graphicStyle.fontDisplay }}
                              >
                                {plan.name}
                              </h4>
                              <p className="text-[11px]" style={{ color: colorPattern.textMuted }}>
                                {plan.audience}
                              </p>
                            </div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-bold tabular-nums">{plan.price}</span>
                              <span className="text-[11px]" style={{ color: colorPattern.textMuted }}>
                                {plan.cadence}
                              </span>
                            </div>
                            <ul className="space-y-1.5 text-xs" style={{ color: colorPattern.textMuted }}>
                              {plan.features.map((feat, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span style={{ color: colorPattern.accent }}>—</span>
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div
                            className="py-2 text-center text-xs font-semibold"
                            style={{
                              backgroundColor: plan.featured ? colorPattern.accent : 'transparent',
                              color: plan.featured ? colorPattern.accentText : colorPattern.text,
                              border: plan.featured ? 'none' : `1px solid ${colorPattern.border}`,
                              borderRadius: graphicStyle.buttonRadius,
                            }}
                          >
                            {plan.ctaLabel}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              }

              if (section.type === 'testimonials') {
                return (
                  <section key={section.id} className={`px-6 ${padY} space-y-6`}>
                    <h3
                      className="text-xl font-bold"
                      style={{ fontFamily: graphicStyle.fontDisplay }}
                    >
                      {content.testimonialsHeading}
                    </h3>
                    <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {content.testimonials.map((t) => (
                        <blockquote
                          key={t.id}
                          className="p-5 space-y-3"
                          style={{
                            backgroundColor: colorPattern.surface,
                            border: `${graphicStyle.borderWidth} solid ${colorPattern.border}`,
                            borderRadius: graphicStyle.borderRadius,
                          }}
                        >
                          <p className="text-xs leading-relaxed">“{t.quote}”</p>
                          <footer className="text-[11px]">
                            <strong className="font-semibold">{t.author}</strong>
                            <span style={{ color: colorPattern.textMuted }}>
                              {' '}· {t.role}, {t.organization}
                            </span>
                          </footer>
                        </blockquote>
                      ))}
                    </div>
                  </section>
                );
              }

              if (section.type === 'faq') {
                return (
                  <section key={section.id} className={`px-6 ${padY} space-y-5`}>
                    <h3
                      className="text-xl font-bold"
                      style={{ fontFamily: graphicStyle.fontDisplay }}
                    >
                      {content.faqHeading}
                    </h3>
                    <div
                      className="divide-y border-y"
                      style={{ borderColor: colorPattern.border }}
                    >
                      {content.faqs.map((faq) => {
                        const open = openFaqId === faq.id;
                        return (
                          <div
                            key={faq.id}
                            className="py-3.5"
                            style={{ borderColor: colorPattern.border }}
                          >
                            <button
                              type="button"
                              onClick={() => setOpenFaqId(open ? null : faq.id)}
                              className="flex w-full items-center justify-between text-left text-xs font-semibold cursor-pointer"
                            >
                              <span>{faq.question}</span>
                              <span
                                className="ml-3 text-base"
                                style={{ color: colorPattern.accent }}
                              >
                                {open ? '−' : '+'}
                              </span>
                            </button>
                            {open ? (
                              <p
                                className="mt-2 text-xs leading-relaxed"
                                style={{ color: colorPattern.textMuted }}
                              >
                                {faq.answer}
                              </p>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              }

              if (section.type === 'contact') {
                return (
                  <section key={section.id} className={`px-6 ${padY}`}>
                    <div
                      className={`grid gap-6 p-6 ${isCompact ? 'grid-cols-1' : 'grid-cols-12'}`}
                      style={{
                        backgroundColor: colorPattern.surface,
                        border: `${graphicStyle.borderWidth} solid ${colorPattern.border}`,
                        borderRadius: graphicStyle.borderRadius,
                      }}
                    >
                      <div className={isCompact ? 'space-y-2' : 'col-span-5 space-y-2'}>
                        <h3
                          className="text-lg font-bold"
                          style={{ fontFamily: graphicStyle.fontDisplay }}
                        >
                          {content.contactHeading}
                        </h3>
                        <p className="text-xs leading-relaxed" style={{ color: colorPattern.textMuted }}>
                          {content.contactSubheading}
                        </p>
                        <div className="pt-2 text-xs space-y-0.5">
                          <div>{content.contactEmail}</div>
                          <div style={{ color: colorPattern.textMuted }}>{content.contactLocation}</div>
                        </div>
                      </div>
                      <form
                        onSubmit={handlePreviewForm}
                        className={isCompact ? 'space-y-2.5' : 'col-span-7 space-y-2.5'}
                      >
                        <div className="grid grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            placeholder="Tu nombre"
                            className="w-full bg-transparent px-3 py-2 text-xs"
                            style={{
                              border: `1px solid ${colorPattern.border}`,
                              borderRadius: graphicStyle.buttonRadius,
                            }}
                          />
                          <input
                            type="email"
                            placeholder="Correo"
                            className="w-full bg-transparent px-3 py-2 text-xs"
                            style={{
                              border: `1px solid ${colorPattern.border}`,
                              borderRadius: graphicStyle.buttonRadius,
                            }}
                          />
                        </div>
                        <textarea
                          rows={2}
                          placeholder="Mensaje breve..."
                          className="w-full bg-transparent px-3 py-2 text-xs"
                          style={{
                            border: `1px solid ${colorPattern.border}`,
                            borderRadius: graphicStyle.buttonRadius,
                          }}
                        />
                        <div className="flex items-center gap-3">
                          <button
                            type="submit"
                            className="px-4 py-2 text-xs font-semibold cursor-pointer"
                            style={{
                              backgroundColor: colorPattern.accent,
                              color: colorPattern.accentText,
                              borderRadius: graphicStyle.buttonRadius,
                            }}
                          >
                            Enviar consulta
                          </button>
                          {contactSent ? (
                            <span className="text-xs" style={{ color: colorPattern.accent }}>
                              Simulación enviada correctamente
                            </span>
                          ) : null}
                        </div>
                      </form>
                    </div>
                  </section>
                );
              }

              return null;
            })}
          </div>

          {/* Preview Footer */}
          <div
            className="border-t px-6 py-5 flex flex-wrap items-center justify-between gap-2 text-[11px]"
            style={{ borderColor: colorPattern.border, color: colorPattern.textMuted }}
          >
            <span>
              © {new Date().getFullYear()} {content.brandName} · {content.tagline}
            </span>
            <span>{content.footerNote}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
