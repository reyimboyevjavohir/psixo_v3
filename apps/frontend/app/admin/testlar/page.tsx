'use client';

import { useEffect, useState } from 'react';
import { Test } from '@/types';

export default function AdminTestlarPage() {
  const [items, setItems] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const res = await fetch('/api/admin/testlar');
    const json = await res.json();
    if (json.success) setItems(json.data);
    setLoading(false);
  }

  async function toggle(id: string, current: boolean) {
    setBusy(id);
    await fetch(`/api/admin/testlar/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    });
    await fetchItems();
    setBusy(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu testni o'chirmoqchimisiz?")) return;
    setBusy(id);
    await fetch(`/api/admin/testlar/${id}`, { method: 'DELETE' });
    await fetchItems();
    setBusy(null);
  }

  if (loading) return <div className="container-page py-16 text-center text-slate-400">Yuklanmoqda...</div>;

  return (
    <div className="container-page py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Testlar boshqaruvi</h1>
          <p className="text-slate-500 text-sm mt-1">Barcha psixologik testlar</p>
        </div>
        <span className="badge badge-blue">{items.length} ta</span>
      </div>
      {items.length === 0 ? (
        <div className="card text-center py-12 text-slate-400">Hali test yo'q.</div>
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <div key={t.id} className={`card flex items-center justify-between gap-4 ${!t.isActive ? 'opacity-60' : ''}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold">{t.title}</p>
                  <span className={`badge ${t.isActive ? 'badge-green' : 'badge-red'}`}>
                    {t.isActive ? 'Faol' : 'Nofaol'}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{t.description}</p>
                <div className="flex gap-3 mt-1 text-xs text-slate-400">
                  <span>⏱ {t.durationMin} min</span>
                  <span>📝 {t.questionCount} savol</span>
                  {t.category && <span>🏷 {t.category.name}</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  disabled={busy === t.id}
                  onClick={() => toggle(t.id, t.isActive)}
                  className={t.isActive ? 'btn-danger-sm' : 'btn-sm bg-emerald-600 hover:bg-emerald-700'}
                >
                  {busy === t.id ? '...' : t.isActive ? "O'chirish" : 'Faollashtirish'}
                </button>
                <button
                  disabled={busy === t.id}
                  onClick={() => handleDelete(t.id)}
                  className="btn-sm bg-red-800 hover:bg-red-900"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
