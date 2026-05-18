'use client';

import { useEffect, useState } from 'react';
import { Book } from '@/types';

export default function AdminKitoblarPage() {
  const [items, setItems] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const res = await fetch('/api/admin/kitoblar');
    const json = await res.json();
    if (json.success) setItems(json.data);
    setLoading(false);
  }

  async function toggle(id: string, current: boolean) {
    setBusy(id);
    await fetch(`/api/admin/kitoblar/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    });
    await fetchItems();
    setBusy(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu kitobni o'chirmoqchimisiz?")) return;
    setBusy(id);
    await fetch(`/api/admin/kitoblar/${id}`, { method: 'DELETE' });
    await fetchItems();
    setBusy(null);
  }

  if (loading) return <div className="container-page py-16 text-center text-slate-400">Yuklanmoqda...</div>;

  return (
    <div className="container-page py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kitoblar boshqaruvi</h1>
          <p className="text-slate-500 text-sm mt-1">Barcha psixologik adabiyotlar</p>
        </div>
        <span className="badge badge-amber">{items.length} ta</span>
      </div>
      {items.length === 0 ? (
        <div className="card text-center py-12 text-slate-400">Hali kitob yo'q.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((b) => (
            <div key={b.id} className={`card space-y-3 ${!b.isActive ? 'opacity-60' : ''}`}>
              {b.coverUrl && (
                <img src={b.coverUrl} alt={b.title} className="w-full h-32 object-cover rounded-xl bg-slate-100" />
              )}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-sm leading-tight">{b.title}</p>
                  <span className={`badge shrink-0 ${b.isActive ? 'badge-green' : 'badge-red'}`}>
                    {b.isActive ? 'Faol' : 'Nofaol'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{b.author}</p>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{b.description}</p>
              </div>
              <div className="flex gap-2">
                <button disabled={busy === b.id} onClick={() => toggle(b.id, b.isActive)}
                  className={`flex-1 ${b.isActive ? 'btn-danger-sm' : 'btn-sm bg-emerald-600 hover:bg-emerald-700'}`}>
                  {busy === b.id ? '...' : b.isActive ? "O'chirish" : 'Faollashtirish'}
                </button>
                <button disabled={busy === b.id} onClick={() => handleDelete(b.id)} className="btn-sm bg-red-800 hover:bg-red-900">🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
