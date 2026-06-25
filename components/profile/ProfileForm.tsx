'use client';

import { useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/context';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/RoleBadge';
import { IconUpload, IconCheck } from '@/components/Icons';

const SKILLS = ['beginner', 'intermediate', 'advanced', 'mixed'] as const;

type Initial = {
  fullName: string;
  location: string;
  skillLevel: string;
  avatarUrl: string | null;
  role: string;
  verificationStatus: string;
};

export function ProfileForm({
  configured,
  userId,
  email,
  initial,
}: {
  configured: boolean;
  userId: string | null;
  email: string | null;
  initial: Initial;
}) {
  const { t } = useI18n();
  const { refreshProfile } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(initial.fullName);
  const [location, setLocation] = useState(initial.location);
  const [skillLevel, setSkillLevel] = useState(initial.skillLevel || 'intermediate');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initial.avatarUrl);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initial.avatarUrl);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setSaved(false);
    if (f) setPreview(URL.createObjectURL(f));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    if (!configured || !userId) {
      setError(t('auth.demoNote'));
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      let nextAvatar = avatarUrl;

      if (file) {
        const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
        const path = `${userId}/avatar-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
        if (upErr) {
          setError(upErr.message);
          return;
        }
        nextAvatar = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl;
      }

      const { error: updErr } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          location,
          skill_level: skillLevel,
          avatar_url: nextAvatar,
        })
        .eq('id', userId);

      if (updErr) {
        setError(updErr.message);
        return;
      }

      setAvatarUrl(nextAvatar);
      setFile(null);
      setSaved(true);
      await refreshProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="glass p-8">
      <h1 className="text-2xl font-extrabold text-white">{t('profile.title')}</h1>
      <p className="mt-1 text-sm text-white/55">{t('profile.subtitle')}</p>

      {!configured && (
        <p className="mt-4 rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 px-3 py-2 text-xs text-neon-cyan">
          {t('auth.demoNote')}
        </p>
      )}

      {/* Read-only identity row */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Badge
          label={initial.role.charAt(0).toUpperCase() + initial.role.slice(1)}
          variant={initial.role === 'organizer' ? 'tournament' : initial.role === 'admin' ? 'featured' : 'session'}
        />
        <span className="text-xs text-white/45">
          {t('profile.verification')}: <span className="text-white/70">{t(`verify.${initial.verificationStatus}`)}</span>
        </span>
      </div>

      <form onSubmit={save} className="mt-6 space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-neon-cyan/40 to-neon-purple/40 text-lg font-bold text-white">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              (fullName || email || '?').charAt(0).toUpperCase()
            )}
          </span>
          <div>
            <p className="label !mb-1">{t('profile.avatar')}</p>
            <button type="button" onClick={() => fileRef.current?.click()} className="btn btn-ghost !py-2 text-sm">
              <IconUpload className="h-4 w-4" /> {t('profile.upload')}
            </button>
            <p className="mt-1 text-xs text-white/40">{t('profile.avatarHint')}</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickFile} />
          </div>
        </div>

        <div>
          <label className="label">{t('auth.name')}</label>
          <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>

        <div>
          <label className="label">{t('auth.email')}</label>
          <input className="input opacity-60" value={email ?? ''} disabled readOnly />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label">{t('profile.location')}</label>
            <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div>
            <label className="label">{t('profile.skill')}</label>
            <select className="input" value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)}>
              {SKILLS.map((s) => (
                <option key={s} value={s} className="bg-ink-700">
                  {t(`profile.skill.${s}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {saved && (
          <p className="flex items-center gap-2 text-sm text-neon-lime">
            <IconCheck className="h-4 w-4" /> {t('profile.saved')}
          </p>
        )}

        <button type="submit" className="btn btn-primary justify-center disabled:opacity-60" disabled={saving}>
          {saving ? '…' : t('profile.save')}
        </button>
      </form>
    </div>
  );
}
