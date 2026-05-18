'use client';

import { useEffect, useState } from 'react';
import { User } from '@/types';

const roleLabel: Record<string, string> = { USER: 'Foydalanuvchi', ADMIN: 'Administrator', SUPERADMIN: 'Bosh Admin' };
const roleBadge: Record<string, string> = { USER: 'badge-blue', ADMIN: 'badge-yellow', SUPERADMIN: 'badge-purple' };

export default function SuperAdminFoydalanuvchilarPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch('/api/superadmin/foydalanuvchilar');
      const json = await res.json();
      if (json.success) setUsers(json.data);
      else setError(json.message);
    } catch { setError('Tarmoq xatoligi'); }
    setLoading(false);
  }

  async function updateUser(id: string, body: Record<string, unknown>) {
    setBusy(id);
    try {
      const res = await fetch(`/api/superadmin/foydalanuvchilar/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        await fetchUsers();
      } else alert(json.message);
    } catch { alert('Xatolik yuz berdi'); }
    setBusy(null);
  }

  const filtered = users.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="container-page py-16 text-center text-slate-400">⏳ Yuklanmoqda...</div>;

  return (
    <div className="container-page py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Foydalanuvchilar boshqaruvi</h1>
          <p className="text-slate-500 text-sm mt-1">SuperAdmin — to'liq nazorat</p>
        </div>
        <span className="badge badge-purple">{users.length} ta foydalanuvchi</span>
      </div>

      {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div>
        <input className="input max-w-sm" placeholder="Ism, email yoki username qidirish..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left text-slate-500">
              <th className="px-5 py-3.5">Foydalanuvchi</th>
              <th className="px-5 py-3.5">Username</th>
              <th className="px-5 py-3.5">Email</th>
              <th className="px-5 py-3.5">Rol</th>
              <th className="px-5 py-3.5">Holat</th>
              <th className="px-5 py-3.5">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((u) => (
              <tr key={u.id} className={u.isActive ? '' : 'bg-red-50 opacity-60'}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center text-sm font-bold text-sky-700 shrink-0">
                      {u.fullName.charAt(0)}
                    </div>
                    <span className="font-medium">{u.fullName}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-500">@{u.username}</td>
                <td className="px-5 py-3.5 text-slate-500">{u.email}</td>
                <td className="px-5 py-3.5">
                  <span className={`badge ${roleBadge[u.role]}`}>{roleLabel[u.role]}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>
                    {u.isActive ? 'Faol' : 'Bloklangan'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Rol o'zgartirish */}
                    <select
                      value={u.role}
                      disabled={busy === u.id}
                      onChange={(e) => updateUser(u.id, { action: 'role', role: e.target.value })}
                      className="input text-xs py-1 px-2 w-auto"
                    >
                      <option value="USER">Foydalanuvchi</option>
                      <option value="ADMIN">Admin</option>
                      <option value="SUPERADMIN">SuperAdmin</option>
                    </select>
                    {/* Blok/Faollashtir */}
                    <button
                      disabled={busy === u.id}
                      onClick={() => updateUser(u.id, { action: 'toggle' })}
                      className={u.isActive ? 'btn-danger-sm' : 'btn-sm bg-emerald-600 hover:bg-emerald-700'}
                    >
                      {busy === u.id ? '...' : u.isActive ? 'Blokla' : 'Faollashtir'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-slate-400 py-8">Foydalanuvchilar topilmadi</p>}
      </div>
    </div>
  );
}
