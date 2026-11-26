/** Titolo + sottotitolo comune a più sezioni. */
export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="max-w-2xl space-y-3 mb-12">
      <h2
        className="text-3xl font-bold [text-wrap:balance]"
        style={{ fontFamily: 'var(--font-display)', letterSpacing: 'var(--heading-tracking)' }}
      >
        {title}
      </h2>
      {subtitle ? <p style={{ color: 'var(--color-text-muted)' }}>{subtitle}</p> : null}
    </div>
  );
}

/** Stile di card condiviso: superficie, bordo e raggio dallo stile grafico. */
export const cardStyle = {
  backgroundColor: 'var(--color-surface)',
  border: 'var(--border-w) solid var(--color-border)',
  borderRadius: 'var(--radius-card)',
} as const;
