'use client';
import { useState, useEffect } from 'react';

type Entry = { id: string; date: string; moodScore: number; energyLevel: number; anxietyLevel: number; sleepQuality: number; notes?: string; emotions?: string[] };
const EMOTIONS = ['Baxtli','Xotirjam','Tashvishli','Yolg\'iz','Charchagan','Umidli','Qo\'rqinchli','Asabiy','Sog\'inchli','Kuchli'];
const COLORS = { moodScore: '#2D6A4F', energyLevel: '#0EA5E9', anxietyLevel: '#F59E0B', sleepQuality: '#7C3AED' };

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ background: '#F1F5F9', borderRadius: 99, height: 8, flex: 1 }}>
      <div style={{ background: color, borderRadius: 99, height: '100%', width: `${value * 10}%`, transition: 'width .4s ease' }} />
    </div>
  );
}

export default function KayfiyatPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ moodScore: 5, energyLevel: 5, anxietyLevel: 3, sleepQuality: 7, notes: '', emotions: [] as string[] });
  const [tab, setTab] = useState<'add' | 'history'>('add');

  useEffect(() => { fetchEntries(); }, []);

  async function fetchEntries() {
    setLoading(true);
    try {
      const res = await fetch('/api/mood');
      const json = await res.json();
      if (json.success) setEntries(json.data || []);
    } catch { /* nologin */ }
    setLoading(false);
  }

  function toggleEmotion(e: string) {
    setForm(p => ({ ...p, emotions: p.emotions.includes(e) ? p.emotions.filter(x => x !== e) : [...p.emotions, e] }));
  }

  async function handleSave() {
    setSaving(true); setError(''); setSuccess(false);
    try {
      const res = await fetch('/api/mood', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok || !json.success) { setError(json.message || 'Xatolik'); setSaving(false); return; }
      setSuccess(true); fetchEntries(); setTab('history');
      setForm({ moodScore: 5, energyLevel: 5, anxietyLevel: 3, sleepQuality: 7, notes: '', emotions: [] });
    } catch { setError("Login kerak yoki tarmoq xatoligi"); }
    setSaving(false);
  }

  const moodEmoji = (s: number) => s >= 8 ? '😄' : s >= 6 ? '🙂' : s >= 4 ? '😐' : s >= 2 ? '😟' : '😢';
  const labelMap: Record<string, string> = { moodScore: 'Kayfiyat', energyLevel: 'Energiya', anxietyLevel: 'Tashvish', sleepQuality: 'Uyqu' };

  return (
    <div className="wrap" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="heading-serif" style={{ fontSize: '2rem', marginBottom: 6 }}>📊 Kayfiyat Kuzatish</h1>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.9rem' }}>Kunlik holatingizni kuzatib boring va dinamikani ko'ring</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 'var(--radius-md)', padding: 4, width: 'fit-content', marginBottom: '1.5rem' }}>
        {(['add', 'history'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '7px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: 500, transition: 'all .15s',
            background: tab === t ? 'var(--c-surface)' : 'transparent',
            color: tab === t ? 'var(--c-primary)' : 'var(--c-muted)',
            boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
          }}>
            {t === 'add' ? '✚ Bugun qo\'shish' : '📈 Tarix'}
          </button>
        ))}
      </div>

      {tab === 'add' && (
        <div style={{ maxWidth: 540 }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {success && <div className="alert-success">✓ Kayfiyat saqlandi!</div>}
            {error && <div className="alert-danger">⚠️ {error}</div>}

            {(['moodScore', 'energyLevel', 'anxietyLevel', 'sleepQuality'] as const).map(key => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <label className="label" style={{ marginBottom: 0 }}>{labelMap[key]}</label>
                  <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: (COLORS as Record<string,string>)[key] }}>
                    {key === 'moodScore' ? `${moodEmoji(form[key])} ${form[key]}` : form[key]}
                    <span style={{ fontSize: '0.75rem', color: 'var(--c-muted)', fontFamily: 'DM Sans' }}>/10</span>
                  </span>
                </div>
                <input type="range" className="mood-slider" min={1} max={10} value={form[key]}
                  onChange={e => setForm(p => ({ ...p, [key]: +e.target.value }))}
                  style={{ accentColor: (COLORS as Record<string,string>)[key] }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--c-muted)', marginTop: 4 }}>
                  <span>Juda past</span><span>O'rtacha</span><span>Juda yuqori</span>
                </div>
              </div>
            ))}

            <div>
              <label className="label">Bugun his qilganlaringiz</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {EMOTIONS.map(em => (
                  <button key={em} onClick={() => toggleEmotion(em)} style={{
                    padding: '5px 12px', borderRadius: 999, fontSize: '0.8rem', cursor: 'pointer',
                    border: '1.5px solid', transition: 'all .15s',
                    borderColor: form.emotions.includes(em) ? 'var(--c-primary)' : 'var(--c-border)',
                    background: form.emotions.includes(em) ? 'var(--c-primary-l)' : 'transparent',
                    color: form.emotions.includes(em) ? 'var(--c-primary)' : 'var(--c-muted)',
                    fontWeight: form.emotions.includes(em) ? 500 : 400,
                  }}>{em}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Eslatma (ixtiyoriy)</label>
              <textarea className="input" rows={3} placeholder="Bugun nima yuz berdi? Qanday his qildingiz?" style={{ resize: 'none' }}
                value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>

            <button className="btn" onClick={handleSave} disabled={saving} style={{ padding: '0.75rem' }}>
              {saving ? 'Saqlanmoqda...' : '💾 Saqlash'}
            </button>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--c-muted)' }}>Yuklanmoqda...</div>
          ) : entries.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <p style={{ color: 'var(--c-muted)' }}>Hali yozuv yo'q. Bugungi kayfiyatingizni qo'shing!</p>
              <button className="btn" style={{ marginTop: '1rem' }} onClick={() => setTab('add')}>Qo'shish</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {entries.map(e => (
                <div key={e.id} className="card" style={{ padding: '1.125rem 1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                        {new Date(e.date).toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      {e.emotions && e.emotions.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                          {e.emotions.map(em => <span key={em} className="badge badge-primary" style={{ fontSize: '0.72rem' }}>{em}</span>)}
                        </div>
                      )}
                    </div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem' }}>{moodEmoji(e.moodScore)}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(Object.keys(labelMap) as Array<keyof typeof labelMap>).map(k => (
                      <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ width: 80, fontSize: '0.78rem', color: 'var(--c-muted)', flexShrink: 0 }}>{labelMap[k]}</span>
                        <Bar value={(e as Record<string,number>)[k]} color={COLORS[k as keyof typeof COLORS]} />
                        <span style={{ width: 24, textAlign: 'right', fontSize: '0.8rem', fontWeight: 600, color: COLORS[k as keyof typeof COLORS], flexShrink: 0 }}>{(e as Record<string,number>)[k]}</span>
                      </div>
                    ))}
                  </div>
                  {e.notes && <p style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--c-muted)', fontStyle: 'italic', borderTop: '1px solid var(--c-border)', paddingTop: '0.75rem' }}>"{e.notes}"</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
