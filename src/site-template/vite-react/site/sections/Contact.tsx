import { FormEvent, useState } from 'react';
import { SiteContent, SiteUi } from '../types';
import { cardStyle } from './SectionHeading';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const fieldStyle = { borderColor: 'var(--color-border)', borderRadius: 'var(--radius-btn)' };

export function Contact({
  content,
  ui,
  hasBackendApi,
}: {
  content: SiteContent;
  ui: SiteUi['form'];
  hasBackendApi: boolean;
}) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setStatus('sending');
    try {
      // senza backend il form è dimostrativo: conferma senza inviare nulla
      if (hasBackendApi) {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error(String(res.status));
      }
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-(--space-section)">
      <div className="grid gap-10 p-8 @5xl:grid-cols-12 @5xl:p-12" style={cardStyle}>
        <div className="@5xl:col-span-5 space-y-4">
          <h2
            className="text-3xl font-bold [text-wrap:balance]"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: 'var(--heading-tracking)' }}
          >
            {content.contactHeading}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            {content.contactSubheading}
          </p>
          <div className="pt-4 space-y-2 text-sm">
            <div>{content.contactEmail}</div>
            <div style={{ color: 'var(--color-text-muted)' }}>{content.contactLocation}</div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="@5xl:col-span-7 space-y-4">
          <div className="grid gap-4 @2xl:grid-cols-2">
            <input
              type="text"
              required
              aria-label={ui.name}
              placeholder={ui.name}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 text-sm bg-transparent border"
              style={fieldStyle}
            />
            <input
              type="email"
              required
              aria-label={ui.email}
              placeholder={ui.email}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 text-sm bg-transparent border"
              style={fieldStyle}
            />
          </div>
          <textarea
            rows={4}
            aria-label={ui.message}
            placeholder={ui.message}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full px-4 py-3 text-sm bg-transparent border"
            style={fieldStyle}
          />
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="px-6 py-3 text-sm font-semibold cursor-pointer"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-accent-text)',
                borderRadius: 'var(--radius-btn)',
              }}
            >
              {status === 'sending' ? ui.sending : ui.send}
            </button>
            {status === 'sent' ? (
              <span className="text-sm" style={{ color: 'var(--color-accent)' }}>
                {ui.sent}
              </span>
            ) : null}
            {status === 'error' ? <span className="text-sm text-red-500">{ui.error}</span> : null}
          </div>
        </form>
      </div>
    </section>
  );
}
