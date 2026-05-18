'use client';

import { useEffect, useState } from 'react';
import { Resource } from '@/types';

const typeLabel: Record<string, string> = { BOOK: 'Kitob', ARTICLE: 'Maqola', VIDEO: 'Video', GUIDE: "Qo'llanma" };

export default function AdminResurslarPage() {
  const [items, setItems] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const res = await fetch('/api/admin/resurslar');
    const json = await res.json();
    if (json.success) setItems(json.data);
    setLoading(false);
  }

  async function toggle(id: string, current: boolean) {
    setBusy(id);
    await fetch(`/api/admin/resurslar/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    });
    await fetchItems();
    setBusy(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu resursni o'chirmoqchimisiz?")) return;
    setBusy(id);
    await fetch(`/api/admin/resurslar/${id}`, { method: 'DELETE' });
    await fetchItems();
    setBusy(null);
  }

  if (loading) return <div className="container-page py-16 text-center text-slate-400">Yuklanmoqda...</div>;

  return (
    <div className="container-page py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Resurslar boshqaruvi</h1>
          <p className="text-slate-500 text-sm mt-1">Video, maqola va qo'llanmalar</p>
        </div>
        <span className="badge badge-purple">{items.length} ta</span>
      </div>
      {items.length === 0 ? (
        <div className="card text-center py-12 text-slate-400">Hali resurs yo'q.</div>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <div key={r.id} className={`card flex items-center justify-between gap-4 ${!r.isActive ? 'opacity-60' : ''}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold">{r.title}</p>
                  <span className="badge badge-purple text-xs">{typeLabel[r.type] || r.type}</span>
                  <span className={`badge ${r.isActive ? 'badge-green' : 'badge-red'}`}>
                    {r.isActive ? 'Faol' : 'Nofaol'}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{r.description}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button disabled={busy === r.id} onClick={() => toggle(r.id, r.isActive)}
                  className={r.isActive ? 'btn-danger-sm' : 'btn-sm bg-emerald-600 hover:bg-emerald-700'}>
                  {busy === r.id ? '...' : r.isActive ? "O'chirish" : 'Faollashtirish'}
                </button>
                <button disabled={busy === r.id} onClick={() => handleDelete(r.id)} className="btn-sm bg-red-800 hover:bg-red-900">🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
