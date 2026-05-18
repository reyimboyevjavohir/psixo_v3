'use client';

import { useEffect, useState } from 'react';
import { Booking } from '@/types';

const statusMap: Record<string, string> = { PENDING: 'Kutilmoqda', CONFIRMED: 'Tasdiqlandi', COMPLETED: 'Yakunlandi', CANCELLED: 'Bekor qilindi' };
const statusBadge: Record<string, string> = { PENDING: 'badge-yellow', CONFIRMED: 'badge-green', COMPLETED: 'badge-blue', CANCELLED: 'badge-red' };

export default function AdminBronlarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => { fetchBookings(); }, []);

  async function fetchBookings() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/bookings');
      const json = await res.json();
      if (json.success) setBookings(json.data);
      else setError(json.message);
    } catch { setError('Tarmoq xatoligi'); }
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      else alert(json.message);
    } catch { alert('Xatolik yuz berdi'); }
    setUpdating(null);
  }

  if (loading) return <div className="container-page py-16 text-center text-slate-400">Yuklanmoqda...</div>;
  if (error) return <div className="container-page py-16 text-center text-red-500">{error}</div>;

  return (
    <div className="container-page py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bronlar boshqaruvi</h1>
        <span className="badge badge-blue">{bookings.length} ta</span>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="pb-3 pr-4">Foydalanuvchi</th>
              <th className="pb-3 pr-4">Psixolog</th>
              <th className="pb-3 pr-4">Vaqt</th>
              <th className="pb-3 pr-4">Tur</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Amal</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="py-3 pr-4">
                  <p className="font-medium">{b.user?.fullName}</p>
                  <p className="text-xs text-slate-400">{b.user?.email}</p>
                </td>
                <td className="py-3 pr-4">{b.psychologist.fullName}</td>
                <td className="py-3 pr-4 whitespace-nowrap">{new Date(b.scheduledAt).toLocaleString('uz-UZ')}</td>
                <td className="py-3 pr-4">{b.mode}</td>
                <td className="py-3 pr-4"><span className={`badge ${statusBadge[b.status]}`}>{statusMap[b.status]}</span></td>
                <td className="py-3">
                  <select
                    value={b.status}
                    disabled={updating === b.id}
                    onChange={(e) => updateStatus(b.id, e.target.value)}
                    className="input text-xs py-1.5 w-auto"
                  >
                    <option value="PENDING">Kutilmoqda</option>
                    <option value="CONFIRMED">Tasdiqlash</option>
                    <option value="COMPLETED">Yakunlash</option>
                    <option value="CANCELLED">Bekor qilish</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && <p className="text-center text-slate-400 py-8">Bronlar topilmadi</p>}
      </div>
    </div>
  );
}
