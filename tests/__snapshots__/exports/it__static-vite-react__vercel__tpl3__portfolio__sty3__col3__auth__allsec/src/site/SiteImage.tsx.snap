import { useState } from 'react';

/** Immagine con segnaposto se manca o non si carica. */
export function SiteImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center p-6 text-center text-xs ${className ?? ''}`}
        style={{ backgroundColor: 'var(--color-surface-alt)', color: 'var(--color-text-muted)' }}
      >
        {alt}
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
