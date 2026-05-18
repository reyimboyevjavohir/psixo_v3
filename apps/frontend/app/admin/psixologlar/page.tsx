'use client';

import { useEffect, useState } from 'react';
import { Psychologist } from '@/types';

export default function AdminPsixologlarPage() {
  const [items, setItems] = useState<Psychologist[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const res = await fetch('/api/admin/psixologlar');
    const json = await res.json();
    if (json.success) setItems(json.data);
    setLoading(false);
  }

  async function toggle(id: string) {
    setBusy(id);
    const item = items.find(i => i.id === id);
    await fetch(`/api/admin/psixologlar/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !item?.isActive }),
    });
    await fetchItems();
    setBusy(null);
  }

  if (loading) return <div className="container-page py-16 text-center text-slate-400">Yuklanmoqda...</div>;

  return (
    <div className="container-page py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Psixologlar boshqaruvi</h1>
        <span className="badge badge-emerald">{items.length} ta</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <div key={p.id} className={`card space-y-3 ${!p.isActive ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{p.fullName}</p>
                <p className="text-sm text-slate-500">{p.specialty}</p>
                <p className="text-sm text-slate-400">{p.experienceYears} yil tajriba</p>
              </div>
              <span className={`badge ${p.isActive ? 'badge-green' : 'badge-red'}`}>{p.isActive ? 'Faol' : 'Nofaol'}</span>
            </div>
            <div className="flex gap-2">
              <button disabled={busy === p.id} onClick={() => toggle(p.id)}
                className={p.isActive ? 'btn-danger-sm flex-1' : 'btn-sm bg-emerald-600 hover:bg-emerald-700 flex-1'}>
                {busy === p.id ? '...' : p.isActive ? "O'chirish" : 'Faollashtirish'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
