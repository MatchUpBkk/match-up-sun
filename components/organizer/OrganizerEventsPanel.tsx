'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { mapEventRow, EVENT_SELECT } from '@/lib/data/eventMap';
import { sampleEvents, BANGKOK_AREAS } from '@/lib/data/sampleEvents';
import { DataPanel } from '@/components/dashboard/DashLayout';
import { Badge } from '@/components/RoleBadge';
import { formatDate } from '@/lib/utils';
import type { FootballEvent } from '@/lib/types';
import { IconTrophy, IconBall, IconCheck } from '@/components/Icons';

type FormState = {
  type: 'session' | 'tournament';
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  area: string;
  location: string;
  skill_level: string;
  price: string;
  spots_total: string;
  entry_fee: string;
  max_teams: string;
  prize: string;
  published: boolean;
};

const EMPTY_FORM: FormState = {
  type: 'session',
  title: '',
  description: '',
  event_date: '',
  event_time: '',
  area: BANGKOK_AREAS[0],
  location: '',
  skill_level: 'mixed',
  price: '',
  spots_total: '',
  entry_fee: '',
  max_teams: '',
  prize: '',
  published: true,
};

function slugify(s: string): string {
  const base = s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
    .replace(/^-|-$/g, '');
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base || 'event'}-${suffix}`;
}

function toInt(v: string): number | null {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

export function OrganizerEventsPanel() {
  const { t, locale } = useI18n();
  const configured = isSupabaseConfigured();

  const [events, setEvents] = useState<FootballEvent[]>([]);
  const [publishedMap, setPublishedMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function fetchMine() {
    setLoading(true);
    setError(null);
    if (!configured) {
      const demo = sampleEvents.slice(0, 4);
      setEvents(demo);
      setPublishedMap(Object.fromEntries(demo.map((d) => [d.id, true])));
      setLoading(false);
      return;
    }
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setEvents([]);
        setLoading(false);
        return;
      }
      const { data, error: qErr } = await supabase
        .from('events')
        .select(EVENT_SELECT)
        .eq('organizer_id', user.id)
        .order('created_at', { ascending: false });
      if (qErr) setError(qErr.message);
      const rows = data ?? [];
      setEvents(rows.map(mapEventRow));
      setPublishedMap(Object.fromEntries(rows.map((r: any) => [r.id, !!r.published])));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSaved(false);
    setError(null);
    setFormOpen(true);
  }

  function openEdit(e: FootballEvent) {
    setEditingId(e.id);
    setForm({
      type: e.type,
      title: e.title,
      description: e.description ?? '',
      event_date: e.date ? e.date.slice(0, 10) : '',
      event_time: e.time ?? '',
      area: e.area || BANGKOK_AREAS[0],
      location: e.location ?? '',
      skill_level: e.skillLevel ?? 'mixed',
      price: e.price != null ? String(e.price) : '',
      spots_total: e.spotsTotal != null ? String(e.spotsTotal) : '',
      entry_fee: e.entryFee != null ? String(e.entryFee) : '',
      max_teams: e.maxTeams != null ? String(e.maxTeams) : '',
      prize: e.prize ?? '',
      published: publishedMap[e.id] ?? true,
    });
    setSaved(false);
    setError(null);
    setFormOpen(true);
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(ev: React.FormEvent) {
    ev.preventDefault();
    setError(null);
    setSaved(false);

    if (!configured) {
      setError(t('auth.demoNote'));
      return;
    }
    if (!form.title.trim() || !form.event_date) {
      setError(t('org.ev.required'));
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError(t('auth.demoNote'));
        return;
      }

      const isTournament = form.type === 'tournament';
      const payload: Record<string, unknown> = {
        type: form.type,
        title: form.title.trim(),
        description: form.description.trim() || null,
        event_date: form.event_date,
        event_time: form.event_time || null,
        area: form.area || null,
        location: form.location.trim() || null,
        skill_level: form.skill_level || null,
        published: form.published,
        // type-specific (null out the other side)
        price: isTournament ? null : toInt(form.price),
        spots_total: isTournament ? null : toInt(form.spots_total),
        entry_fee: isTournament ? toInt(form.entry_fee) : null,
        max_teams: isTournament ? toInt(form.max_teams) : null,
        prize: isTournament ? form.prize.trim() || null : null,
      };

      let dbErr = null;
      if (editingId) {
        const { error: e } = await supabase.from('events').update(payload).eq('id', editingId);
        dbErr = e;
      } else {
        payload.organizer_id = user.id;
        payload.slug = slugify(form.title);
        payload.tier = 'free';
        const { error: e } = await supabase.from('events').insert(payload);
        dbErr = e;
      }

      if (dbErr) {
        setError(dbErr.message);
        return;
      }

      setSaved(true);
      setFormOpen(false);
      await fetchMine();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(e: FootballEvent, makePublished: boolean) {
    if (!configured) return;
    setBusyId(e.id);
    try {
      const supabase = createClient();
      await supabase.from('events').update({ published: makePublished }).eq('id', e.id);
      await fetchMine();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(e: FootballEvent) {
    if (!configured) return;
    if (typeof window !== 'undefined' && !window.confirm(t('org.ev.confirmDelete'))) return;
    setBusyId(e.id);
    try {
      const supabase = createClient();
      await supabase.from('events').delete().eq('id', e.id);
      await fetchMine();
    } finally {
      setBusyId(null);
    }
  }

  const isTournament = form.type === 'tournament';

  return (
    <DataPanel
      title={t('dash.organizer.myEvents')}
      action={
        <button className="btn btn-primary px-3 py-1.5 text-xs" onClick={openCreate}>
          ＋ {t('org.ev.new')}
        </button>
      }
    >
      {!configured && (
        <p className="mb-4 rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 px-3 py-2 text-xs text-neon-cyan">
          {t('auth.demoNote')}
        </p>
      )}
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {saved && (
        <p className="mb-4 flex items-center gap-2 text-sm text-neon-lime">
          <IconCheck className="h-4 w-4" /> {t('org.ev.saved')}
        </p>
      )}

      {/* Form */}
      {formOpen && (
        <form onSubmit={save} className="mb-6 grid gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">{t('org.ev.title')}</label>
            <input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('discover.type')}</label>
            <select className="input" value={form.type} onChange={(e) => set('type', e.target.value as FormState['type'])}>
              <option value="session" className="bg-ink-700">{t('discover.type.session')}</option>
              <option value="tournament" className="bg-ink-700">{t('discover.type.tournament')}</option>
            </select>
          </div>
          <div>
            <label className="label">{t('profile.skill')}</label>
            <select className="input" value={form.skill_level} onChange={(e) => set('skill_level', e.target.value)}>
              {['beginner', 'intermediate', 'advanced', 'mixed'].map((s) => (
                <option key={s} value={s} className="bg-ink-700">
                  {t(`profile.skill.${s}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t('discover.date')}</label>
            <input type="date" className="input" value={form.event_date} onChange={(e) => set('event_date', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('org.ev.time')}</label>
            <input type="time" className="input" value={form.event_time} onChange={(e) => set('event_time', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('org.ev.area')}</label>
            <select className="input" value={form.area} onChange={(e) => set('area', e.target.value)}>
              {BANGKOK_AREAS.map((a) => (
                <option key={a} value={a} className="bg-ink-700">
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t('discover.location')}</label>
            <input className="input" value={form.location} onChange={(e) => set('location', e.target.value)} />
          </div>

          {!isTournament ? (
            <>
              <div>
                <label className="label">{t('event.price')}</label>
                <input type="number" min="0" className="input" value={form.price} onChange={(e) => set('price', e.target.value)} />
              </div>
              <div>
                <label className="label">{t('org.ev.spots')}</label>
                <input type="number" min="0" className="input" value={form.spots_total} onChange={(e) => set('spots_total', e.target.value)} />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="label">{t('event.entryFee')}</label>
                <input type="number" min="0" className="input" value={form.entry_fee} onChange={(e) => set('entry_fee', e.target.value)} />
              </div>
              <div>
                <label className="label">{t('org.ev.maxTeams')}</label>
                <input type="number" min="0" className="input" value={form.max_teams} onChange={(e) => set('max_teams', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">{t('org.ev.prize')}</label>
                <input className="input" value={form.prize} onChange={(e) => set('prize', e.target.value)} />
              </div>
            </>
          )}

          <div className="sm:col-span-2">
            <label className="label">{t('org.ev.desc')}</label>
            <textarea className="input min-h-[100px] resize-y" value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>

          <label className="flex items-center gap-2 text-sm text-white/70 sm:col-span-2">
            <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} className="h-4 w-4 accent-neon-cyan" />
            {t('org.ev.publishNow')}
          </label>

          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" className="btn btn-primary disabled:opacity-60" disabled={saving}>
              {saving ? '…' : t('org.ev.save')}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setFormOpen(false)}>
              {t('org.ev.cancel')}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {loading ? (
        <p className="py-8 text-center text-sm text-white/40">…</p>
      ) : events.length === 0 ? (
        <p className="py-10 text-center text-sm text-white/45">{t('org.ev.empty')}</p>
      ) : (
        <ul className="divide-y divide-white/5">
          {events.map((e) => (
            <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${e.type === 'tournament' ? 'bg-neon-purple/10 text-neon-purple' : 'bg-neon-cyan/10 text-neon-cyan'}`}>
                  {e.type === 'tournament' ? <IconTrophy className="h-5 w-5" /> : <IconBall className="h-5 w-5" />}
                </span>
                <div>
                  <p className="font-semibold text-white">{e.title}</p>
                  <p className="text-xs text-white/50">
                    {formatDate(e.date, locale)} · {e.location || e.area}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {e.featured && <Badge label={t('discover.featured')} variant="featured" />}
                {!publishedMap[e.id] && <Badge label={t('org.ev.draft')} variant="pending" />}
                <button
                  className="btn btn-ghost px-3 py-1.5 text-xs disabled:opacity-50"
                  onClick={() => openEdit(e)}
                  disabled={busyId === e.id}
                >
                  {t('org.ev.edit')}
                </button>
                {publishedMap[e.id] ? (
                  <button
                    className="btn btn-ghost px-3 py-1.5 text-xs disabled:opacity-50"
                    onClick={() => togglePublish(e, false)}
                    disabled={busyId === e.id}
                  >
                    {t('org.ev.unpublish')}
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary px-3 py-1.5 text-xs disabled:opacity-50"
                    onClick={() => togglePublish(e, true)}
                    disabled={busyId === e.id}
                  >
                    {t('org.ev.publish')}
                  </button>
                )}
                <button
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-300/80 transition hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
                  onClick={() => remove(e)}
                  disabled={busyId === e.id}
                >
                  {t('org.ev.delete')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DataPanel>
  );
}
