'use client';

import { useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { GlassCard } from '@/components/GlassCard';
import { useI18n } from '@/lib/i18n/context';
import { IconPin, IconGlobe, IconInstagram, IconFacebook, IconCheck } from '@/components/Icons';

export default function ContactPage() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="container-x pt-28 pb-24 sm:pt-32">
      <div className="grid gap-12 lg:grid-cols-2">
        <Reveal>
          <span className="chip mb-4">{t('nav.contact')}</span>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">{t('contact.title')}</h1>
          <p className="mt-4 text-white/60">{t('contact.subtitle')}</p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3 text-white/70">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-cyan/10 text-neon-cyan ring-1 ring-neon-cyan/30">
                <IconPin className="h-5 w-5" />
              </span>
              Bangkok, Thailand
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-purple/10 text-neon-purple ring-1 ring-neon-purple/30">
                <IconGlobe className="h-5 w-5" />
              </span>
              hello@matchupbkk.com
            </div>
            <div className="mt-4 flex gap-3">
              <a href="#" className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neon-purple transition hover:bg-white/10">
                <IconInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neon-cyan transition hover:bg-white/10">
                <IconFacebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <GlassCard>
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neon-lime/10 text-neon-lime ring-1 ring-neon-lime/30">
                  <IconCheck className="h-7 w-7" />
                </span>
                <p className="mt-5 text-lg font-semibold text-white">{t('contact.sent')}</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="label">{t('contact.name')}</label>
                  <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="label">{t('contact.email')}</label>
                  <input type="email" className="input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="label">{t('contact.subject')}</label>
                  <input className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div>
                  <label className="label">{t('contact.message')}</label>
                  <textarea className="input min-h-[140px] resize-y" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary w-full justify-center">
                  {t('contact.send')}
                </button>
              </form>
            )}
          </GlassCard>
        </Reveal>
      </div>
    </div>
  );
}
