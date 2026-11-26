import { useState, type FormEvent } from 'react';
import type { ContactProvider, SiteContent, SiteUi } from '../types';
import { cardStyle } from './SectionHeading';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const fieldStyle = { borderColor: 'var(--color-border)', borderRadius: 'var(--radius-btn)' };

export function Contact({
  content,
  ui,
  hasBackendApi,
  provider,
}: {
  content: SiteContent;
  ui: SiteUi['form'];
  hasBackendApi: boolean;
  provider?: ContactProvider;
}) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  // trampa para bots: un campo invisible que una persona nunca rellena
  const [botcheck, setBotcheck] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    // un bot ha rellenado el campo oculto: se simula el éxito y no se envía nada
    if (botcheck) return setStatus('sent');
    setStatus('sending');
    try {
      if (provider) {
        // sitio estático: el servicio externo envía el mensaje al correo del propietario
        if (!provider.accessKey) throw new Error('access key');
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: provider.accessKey,
            subject: `${content.brandName}: ${form.name}`,
            from_name: content.brandName,
            ...form,
          }),
        });
        const result = (await res.json().catch(() => null)) as { success?: boolean } | null;
        if (!res.ok || !result?.success) throw new Error(String(res.status));
      } else if (hasBackendApi) {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, botcheck }),
        });
        if (!res.ok) throw new Error(String(res.status));
      }
      // sin servidor ni servicio, el formulario es demostrativo: confirma sin enviar nada
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
          <input
            type="text"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={botcheck}
            onChange={(e) => setBotcheck(e.target.value)}
            style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0 }}
          />
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
