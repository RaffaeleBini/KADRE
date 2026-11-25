import JSZip from 'jszip';
import { Locale } from '../i18n/translations';
import { GeneratedFile, SiteContent } from '../types/builder';
import { sanitizeRepoSlug } from './context';

async function fetchImageAsBlob(url: string): Promise<Blob | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.blob();
  } catch {
    return null;
  }
}

export async function downloadRepositoryZip(
  files: GeneratedFile[],
  content: SiteContent,
  repoName: string,
  locale: Locale = 'es'
): Promise<void> {
  const zip = new JSZip();
  const slug = sanitizeRepoSlug(repoName || content.brandName, locale);

  for (const file of files) {
    zip.file(file.path, file.content);
  }

  const heroBlob = await fetchImageAsBlob(content.heroImageUrl);
  if (heroBlob) {
    zip.file(
      `public/assets/${content.heroImageName || (locale === 'it' ? 'copertina.jpg' : 'portada.jpg')}`,
      heroBlob
    );
  }

  if (content.logoDataUrl) {
    const logoBlob = await fetchImageAsBlob(content.logoDataUrl);
    if (logoBlob) {
      zip.file('public/assets/logo-marca.png', logoBlob);
    }
  }

  for (let i = 0; i < content.catalogItems.length; i++) {
    const item = content.catalogItems[i];
    if (item.imageUrl) {
      const itemBlob = await fetchImageAsBlob(item.imageUrl);
      if (itemBlob) {
        zip.file(`public/assets/catalogo-${i + 1}.jpg`, itemBlob);
      }
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `${slug}-github-repo.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}
