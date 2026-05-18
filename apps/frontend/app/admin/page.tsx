import { apiGet, getTokenFromCookies } from '@/lib/api';
import { redirect } from 'next/navigation';
import Link from 'next/link';

type Dashboard = { totalUsers: number; totalPsychologists: number; totalBookings: number; pendingBookings: number; totalTests: number; totalBooks: number; totalResources: number };

export default async function AdminPage() {
  const token = await getTokenFromCookies();
  if (!token) redirect('/kirish');

  let stats: Dashboard | null = null;
  try { stats = await apiGet<Dashboard>('/admin/dashboard', token); } catch { redirect('/'); }

  const cards = [
    { label: 'Foydalanuvchilar', value: stats?.totalUsers ?? 0, icon: '👥', href: '/superadmin/users', color: '#0EA5E9' },
    { label: 'Psixologlar', value: stats?.totalPsychologists ?? 0, icon: '👨‍⚕️', href: '/admin/psixologlar', color: 'var(--c-primary)' },
    { label: 'Bronlar', value: stats?.totalBookings ?? 0, icon: '📅', href: '/admin/bronlar', color: 'var(--c-accent)' },
    { label: 'Kutilayotgan', value: stats?.pendingBookings ?? 0, icon: '⏳', href: '/admin/bronlar', color: '#F59E0B' },
    { label: 'Testlar', value: stats?.totalTests ?? 0, icon: '🧪', href: '/admin/testlar', color: '#7C3AED' },
    { label: 'Kitoblar', value: stats?.totalBooks ?? 0, icon: '📚', href: '/admin/kitoblar', color: '#EC4899' },
    { label: 'Resurslar', value: stats?.totalResources ?? 0, icon: '🎯', href: '/admin/resurslar', color: '#F97316' },
  ];

  return (
    <div className="wrap" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <h1 className="heading-serif" style={{ fontSize: '2rem', marginBottom: '1.75rem' }}>⚙️ Admin Panel</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {cards.map(({ label, value, icon, href, color }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none' }}>
            <div className="card-hover" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: 8 }}>{icon}</div>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color, lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--c-muted)', marginTop: 4 }}>{label}</p>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
        {[
          { href: '/admin/psixologlar', label: 'Psixologlarni boshqarish', icon: '👨‍⚕️' },
          { href: '/admin/bronlar', label: 'Bronlarni boshqarish', icon: '📅' },
          { href: '/admin/testlar', label: 'Testlarni boshqarish', icon: '🧪' },
          { href: '/admin/kitoblar', label: 'Kitoblarni boshqarish', icon: '📚' },
          { href: '/admin/resurslar', label: 'Resurslarni boshqarish', icon: '🎯' },
        ].map(({ href, label, icon }) => (
          <Link key={href} href={href} className="btn-outline" style={{ textDecoration: 'none', justifyContent: 'flex-start', gap: 8 }}>
            {icon} {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
