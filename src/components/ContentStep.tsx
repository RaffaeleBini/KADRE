import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  FileJson,
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { CURATED_GALLERY, getStarterContentForProject } from '../data/presets';
import {
  ColorPatternPreset,
  GraphicStylePreset,
  ProjectType,
  SectionConfig,
  SiteContent,
  TemplateDefinition,
} from '../types/builder';
import { LiveSitePreview } from './LiveSitePreview';

interface ContentStepProps {
  template: TemplateDefinition;
  sections: SectionConfig[];
  graphicStyle: GraphicStylePreset;
  colorPattern: ColorPatternPreset;
  content: SiteContent;
  onUpdateContent: (next: SiteContent) => void;
  onBack: () => void;
  onNext: () => void;
}

type EditorTab = 'identity' | 'sections' | 'media' | 'import';

export function ContentStep({
  template,
  sections,
  graphicStyle,
  colorPattern,
  content,
  onUpdateContent,
  onBack,
  onNext,
}: ContentStepProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('identity');
  const [importFeedback, setImportFeedback] = useState<{
    type: 'ok' | 'error';
    message: string;
  } | null>(null);

  const heroFileRef = useRef<HTMLInputElement | null>(null);
  const logoFileRef = useRef<HTMLInputElement | null>(null);
  const jsonFileRef = useRef<HTMLInputElement | null>(null);

  function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'hero' | 'logo'
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) return;
      if (target === 'hero') {
        onUpdateContent({
          ...content,
          heroImageUrl: result,
          heroImageName: file.name.replace(/[^a-zA-Z0-9._-]/g, '-'),
        });
      } else {
        onUpdateContent({
          ...content,
          logoDataUrl: result,
        });
      }
    };
    reader.readAsDataURL(file);
  }

  function handleJsonImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        if (!parsed || typeof parsed !== 'object' || !parsed.brandName) {
          throw new Error('Estructura inválida');
        }
        onUpdateContent({
          ...content,
          ...parsed,
        });
        setImportFeedback({
          type: 'ok',
          message: `Contenidos cargados correctamente desde ${file.name}.`,
        });
      } catch {
        setImportFeedback({
          type: 'error',
          message:
            'El archivo JSON no tiene la estructura esperada. Descarga primero la plantilla de ejemplo.',
        });
      }
    };
    reader.readAsText(file);
  }

  function handleDownloadContentJson() {
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'siteContent.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function loadSectorPreset(type: ProjectType) {
    onUpdateContent(getStarterContentForProject(type));
    setImportFeedback({
      type: 'ok',
      message: 'Textos e imágenes de ejemplo actualizados al sector elegido.',
    });
  }

  const inputClass =
    'w-full border border-[#D0D5DF] bg-[#F8F9FB] px-3 py-2 text-sm text-[#111318] focus:border-[#9A7400] focus:outline-none dark:border-[#262B36] dark:bg-[#0D0F13] dark:text-[#F4F6F9] dark:focus:border-[#F5C400]';
  const labelClass = 'block text-xs font-medium text-[#4B5565] dark:text-[#9BA4B5] mb-1.5';

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8 lg:py-10 space-y-8">
      {/* Step Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D0D5DF] pb-5 dark:border-[#262B36]">
        <div className="space-y-1.5">
          <p className="font-mono text-xs font-medium text-[#9A7400] dark:text-[#F5C400]">
            Paso 4 de 5 · Gestor de contenidos
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111318] dark:text-[#F4F6F9]">
            Carga textos, imágenes y datos de tu sitio
          </h1>
        </div>
        <div className="text-xs text-[#4B5565] dark:text-[#9BA4B5]">
          Todos los cambios se sincronizan al instante con la vista previa y el archivo JSON exportado.
        </div>
      </div>

      {/* Main Split Editor */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left: Structured Content Loader */}
        <div className="lg:col-span-5 space-y-5">
          {/* Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 border border-[#D0D5DF] bg-[#E9ECF1] p-1 dark:border-[#262B36] dark:bg-[#111318]">
            {(
              [
                { id: 'identity', label: 'Portada' },
                { id: 'sections', label: 'Bloques' },
                { id: 'media', label: 'Imágenes' },
                { id: 'import', label: 'JSON / Presets' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-2 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#F5C400] font-semibold text-[#0A0B0D]'
                    : 'text-[#4B5565] hover:text-[#111318] dark:text-[#9BA4B5] dark:hover:text-[#F4F6F9]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="hud-frame border border-[#D0D5DF] bg-white p-5 dark:border-[#262B36] dark:bg-[#111318] space-y-5 max-h-[700px] overflow-y-auto">
            {/* Tab 1: Identity & Hero */}
            {activeTab === 'identity' ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="brand-name" className={labelClass}>
                      Nombre de la marca o proyecto
                    </label>
                    <input
                      id="brand-name"
                      type="text"
                      value={content.brandName}
                      onChange={(e) =>
                        onUpdateContent({ ...content, brandName: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="brand-tagline" className={labelClass}>
                      Lema o descriptor breve
                    </label>
                    <input
                      id="brand-tagline"
                      type="text"
                      value={content.tagline}
                      onChange={(e) =>
                        onUpdateContent({ ...content, tagline: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="hero-eyebrow" className={labelClass}>
                    Antetítulo de portada
                  </label>
                  <input
                    id="hero-eyebrow"
                    type="text"
                    value={content.heroEyebrow}
                    onChange={(e) =>
                      onUpdateContent({ ...content, heroEyebrow: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="hero-headline" className={labelClass}>
                    Titular principal (H1)
                  </label>
                  <textarea
                    id="hero-headline"
                    rows={2}
                    value={content.heroHeadline}
                    onChange={(e) =>
                      onUpdateContent({ ...content, heroHeadline: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="hero-sub" className={labelClass}>
                    Descripción de portada
                  </label>
                  <textarea
                    id="hero-sub"
                    rows={3}
                    value={content.heroSubheadline}
                    onChange={(e) =>
                      onUpdateContent({ ...content, heroSubheadline: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cta-primary" className={labelClass}>
                      Botón principal
                    </label>
                    <input
                      id="cta-primary"
                      type="text"
                      value={content.heroCtaPrimary}
                      onChange={(e) =>
                        onUpdateContent({ ...content, heroCtaPrimary: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="cta-secondary" className={labelClass}>
                      Botón secundario
                    </label>
                    <input
                      id="cta-secondary"
                      type="text"
                      value={content.heroCtaSecondary}
                      onChange={(e) =>
                        onUpdateContent({ ...content, heroCtaSecondary: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-[#D0D5DF] dark:border-[#262B36]">
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>
                      Correo de contacto
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={content.contactEmail}
                      onChange={(e) =>
                        onUpdateContent({ ...content, contactEmail: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-loc" className={labelClass}>
                      Ubicación / Zona horaria
                    </label>
                    <input
                      id="contact-loc"
                      type="text"
                      value={content.contactLocation}
                      onChange={(e) =>
                        onUpdateContent({ ...content, contactLocation: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {/* Tab 2: Editable Section Blocks */}
            {activeTab === 'sections' ? (
              <div className="space-y-6">
                {/* Features list */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#111318] dark:text-[#F4F6F9]">
                      Capacidades / Pilares ({content.features.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateContent({
                          ...content,
                          features: [
                            ...content.features,
                            {
                              id: `f-${Date.now()}`,
                              title: 'Nueva capacidad',
                              description: 'Describe el beneficio concreto para el usuario.',
                              metric: 'Estándar',
                            },
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#9A7400] hover:underline dark:text-[#F5C400] cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Añadir</span>
                    </button>
                  </div>

                  {content.features.map((feat, idx) => (
                    <div
                      key={feat.id}
                      className="border border-[#D0D5DF] p-3 space-y-2 dark:border-[#262B36]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] text-[#4B5565] dark:text-[#9BA4B5]">
                          Pilar 0{idx + 1}
                        </span>
                        {content.features.length > 1 ? (
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateContent({
                                ...content,
                                features: content.features.filter((f) => f.id !== feat.id),
                              })
                            }
                            aria-label="Eliminar pilar"
                            className="text-[#4B5565] hover:text-red-500 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        ) : null}
                      </div>
                      <input
                        type="text"
                        value={feat.title}
                        onChange={(e) => {
                          const next = content.features.map((f) =>
                            f.id === feat.id ? { ...f, title: e.target.value } : f
                          );
                          onUpdateContent({ ...content, features: next });
                        }}
                        className={inputClass}
                        placeholder="Título"
                      />
                      <textarea
                        rows={2}
                        value={feat.description}
                        onChange={(e) => {
                          const next = content.features.map((f) =>
                            f.id === feat.id ? { ...f, description: e.target.value } : f
                          );
                          onUpdateContent({ ...content, features: next });
                        }}
                        className={inputClass}
                        placeholder="Descripción"
                      />
                    </div>
                  ))}
                </div>

                {/* Catalog items */}
                <div className="space-y-3 pt-4 border-t border-[#D0D5DF] dark:border-[#262B36]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#111318] dark:text-[#F4F6F9]">
                      Catálogo / Casos destacados ({content.catalogItems.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateContent({
                          ...content,
                          catalogItems: [
                            ...content.catalogItems,
                            {
                              id: `c-${Date.now()}`,
                              title: 'Nueva referencia',
                              category: 'Categoría',
                              priceOrTag: 'Nuevo',
                              description: 'Resumen técnico o comercial del elemento.',
                              imageUrl: CURATED_GALLERY[0].url,
                            },
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#9A7400] hover:underline dark:text-[#F5C400] cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Añadir elemento</span>
                    </button>
                  </div>

                  {content.catalogItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-[#D0D5DF] p-3 space-y-2 dark:border-[#262B36]"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) =>
                            onUpdateContent({
                              ...content,
                              catalogItems: content.catalogItems.map((c) =>
                                c.id === item.id ? { ...c, title: e.target.value } : c
                              ),
                            })
                          }
                          className={inputClass}
                          placeholder="Nombre"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={item.priceOrTag}
                            onChange={(e) =>
                              onUpdateContent({
                                ...content,
                                catalogItems: content.catalogItems.map((c) =>
                                  c.id === item.id ? { ...c, priceOrTag: e.target.value } : c
                                ),
                              })
                            }
                            className={inputClass}
                            placeholder="Precio o año"
                          />
                          {content.catalogItems.length > 1 ? (
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateContent({
                                  ...content,
                                  catalogItems: content.catalogItems.filter(
                                    (c) => c.id !== item.id
                                  ),
                                })
                              }
                              aria-label="Eliminar elemento"
                              className="px-2 border border-[#D0D5DF] text-[#4B5565] hover:text-red-500 dark:border-[#262B36] cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          ) : null}
                        </div>
                      </div>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) =>
                          onUpdateContent({
                            ...content,
                            catalogItems: content.catalogItems.map((c) =>
                              c.id === item.id ? { ...c, description: e.target.value } : c
                            ),
                          })
                        }
                        className={inputClass}
                        placeholder="Descripción"
                      />
                    </div>
                  ))}
                </div>

                {/* FAQs */}
                <div className="space-y-3 pt-4 border-t border-[#D0D5DF] dark:border-[#262B36]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#111318] dark:text-[#F4F6F9]">
                      Preguntas frecuentes ({content.faqs.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateContent({
                          ...content,
                          faqs: [
                            ...content.faqs,
                            {
                              id: `q-${Date.now()}`,
                              question: '¿Nueva pregunta frecuente?',
                              answer: 'Respuesta clara y directa para tus visitantes.',
                            },
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#9A7400] hover:underline dark:text-[#F5C400] cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Añadir pregunta</span>
                    </button>
                  </div>

                  {content.faqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="border border-[#D0D5DF] p-3 space-y-2 dark:border-[#262B36]"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) =>
                            onUpdateContent({
                              ...content,
                              faqs: content.faqs.map((q) =>
                                q.id === faq.id ? { ...q, question: e.target.value } : q
                              ),
                            })
                          }
                          className={inputClass}
                        />
                        {content.faqs.length > 1 ? (
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateContent({
                                ...content,
                                faqs: content.faqs.filter((q) => q.id !== faq.id),
                              })
                            }
                            aria-label="Eliminar pregunta"
                            className="p-2 border border-[#D0D5DF] text-[#4B5565] hover:text-red-500 dark:border-[#262B36] cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        ) : null}
                      </div>
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) =>
                          onUpdateContent({
                            ...content,
                            faqs: content.faqs.map((q) =>
                              q.id === faq.id ? { ...q, answer: e.target.value } : q
                            ),
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Tab 3: Media & Images */}
            {activeTab === 'media' ? (
              <div className="space-y-6">
                {/* Logo upload */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-[#111318] dark:text-[#F4F6F9]">
                    Logotipo de la marca (opcional)
                  </h3>
                  <div className="flex items-center gap-3">
                    <input
                      ref={logoFileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      onChange={(e) => handleImageUpload(e, 'logo')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => logoFileRef.current?.click()}
                      className="inline-flex h-10 items-center gap-2 border border-[#D0D5DF] bg-[#F8F9FB] px-4 text-xs font-medium text-[#111318] hover:border-[#9A7400] dark:border-[#262B36] dark:bg-[#151820] dark:text-[#F4F6F9] dark:hover:border-[#F5C400] cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Subir logotipo</span>
                    </button>
                    {content.logoDataUrl ? (
                      <button
                        type="button"
                        onClick={() => onUpdateContent({ ...content, logoDataUrl: null })}
                        className="text-xs text-red-500 hover:underline cursor-pointer"
                      >
                        Quitar logotipo
                      </button>
                    ) : (
                      <span className="text-xs text-[#4B5565] dark:text-[#9BA4B5]">
                        PNG, SVG o WebP
                      </span>
                    )}
                  </div>
                </div>

                {/* Hero Image Upload */}
                <div className="space-y-3 pt-4 border-t border-[#D0D5DF] dark:border-[#262B36]">
                  <h3 className="text-xs font-bold text-[#111318] dark:text-[#F4F6F9]">
                    Imagen principal de portada
                  </h3>
                  <p className="text-xs text-[#4B5565] dark:text-[#9BA4B5]">
                    Sube tu propia fotografía (se incluirá automáticamente en public/assets/ al exportar) o elige una imagen del estudio.
                  </p>
                  <input
                    ref={heroFileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => handleImageUpload(e, 'hero')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => heroFileRef.current?.click()}
                    className="inline-flex h-10 w-full items-center justify-center gap-2 border border-dashed border-[#9A7400] bg-[#FEFCE8]/60 px-4 text-xs font-semibold text-[#111318] hover:bg-[#FEFCE8] dark:border-[#F5C400] dark:bg-[#F5C400]/10 dark:text-[#F4F6F9] cursor-pointer"
                  >
                    <ImageIcon className="h-4 w-4 text-[#9A7400] dark:text-[#F5C400]" />
                    <span>Cargar imagen desde tu equipo</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    {CURATED_GALLERY.map((asset) => {
                      const active = content.heroImageUrl === asset.url;
                      return (
                        <button
                          key={asset.id}
                          type="button"
                          onClick={() =>
                            onUpdateContent({
                              ...content,
                              heroImageUrl: asset.url,
                              heroImageName: asset.filename,
                            })
                          }
                          className={`group overflow-hidden border text-left cursor-pointer ${
                            active
                              ? 'border-[#9A7400] dark:border-[#F5C400]'
                              : 'border-[#D0D5DF] dark:border-[#262B36]'
                          }`}
                        >
                          <div className="aspect-[16/9] overflow-hidden bg-[#171A21]">
                            <img
                              src={asset.url}
                              alt={asset.label}
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="px-2.5 py-1.5 text-[11px] font-medium text-[#111318] dark:text-[#F4F6F9] truncate">
                            {asset.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Tab 4: Bulk JSON Import & Sector Presets */}
            {activeTab === 'import' ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileJson className="h-4 w-4 text-[#9A7400] dark:text-[#F5C400]" />
                    <h3 className="text-xs font-bold text-[#111318] dark:text-[#F4F6F9]">
                      Carga masiva mediante JSON
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-[#4B5565] dark:text-[#9BA4B5]">
                    Descarga la estructura actual de contenidos, edítala en cualquier editor o
                    pásala a tu equipo de redacción, y vuelve a subir el archivo JSON aquí.
                  </p>

                  <div className="flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={handleDownloadContentJson}
                      className="inline-flex h-10 items-center gap-2 border border-[#D0D5DF] bg-[#F8F9FB] px-4 text-xs font-medium text-[#111318] hover:border-[#111318] dark:border-[#262B36] dark:bg-[#151820] dark:text-[#F4F6F9] cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Descargar siteContent.json</span>
                    </button>

                    <input
                      ref={jsonFileRef}
                      type="file"
                      accept="application/json,.json"
                      onChange={handleJsonImport}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => jsonFileRef.current?.click()}
                      className="inline-flex h-10 items-center gap-2 bg-[#F5C400] px-4 text-xs font-semibold text-[#0A0B0D] hover:bg-[#FFD000] cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Importar JSON</span>
                    </button>
                  </div>

                  {importFeedback ? (
                    <p
                      className={`text-xs font-medium ${
                        importFeedback.type === 'ok'
                          ? 'text-[#9A7400] dark:text-[#F5C400]'
                          : 'text-red-500'
                      }`}
                    >
                      {importFeedback.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-3 pt-4 border-t border-[#D0D5DF] dark:border-[#262B36]">
                  <h3 className="text-xs font-bold text-[#111318] dark:text-[#F4F6F9]">
                    Cargar textos de ejemplo por sector
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        { id: 'landing', label: 'Hardware / Producto' },
                        { id: 'saas', label: 'Plataforma SaaS' },
                        { id: 'ecommerce', label: 'Catálogo / Taller' },
                        { id: 'portfolio', label: 'Estudio Arquitectura' },
                        { id: 'corporate', label: 'Industrial B2B' },
                        { id: 'editorial', label: 'Editorial Técnico' },
                      ] as const
                    ).map((sector) => (
                      <button
                        key={sector.id}
                        type="button"
                        onClick={() => loadSectorPreset(sector.id)}
                        className="border border-[#D0D5DF] bg-[#F8F9FB] px-3 py-2 text-left text-xs font-medium text-[#111318] transition-colors hover:border-[#9A7400] dark:border-[#262B36] dark:bg-[#151820] dark:text-[#F4F6F9] dark:hover:border-[#F5C400] cursor-pointer"
                      >
                        {sector.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Right: Live Interactive Preview */}
        <div className="lg:col-span-7 lg:sticky lg:top-20">
          <LiveSitePreview
            template={template}
            sections={sections}
            graphicStyle={graphicStyle}
            colorPattern={colorPattern}
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
          <span>Volver a estilo</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex h-11 items-center gap-2 bg-[#F5C400] px-6 text-sm font-semibold text-[#0A0B0D] transition-colors hover:bg-[#FFD000] cursor-pointer"
        >
          <span>Generar código y exportar a GitHub</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
