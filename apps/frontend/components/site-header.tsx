'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const r = document.cookie.split('; ').find(c => c.startsWith('userRole='))?.split('=')[1];
    setRole(r || null);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
    document.cookie = 'userRole=; Max-Age=0; path=/';
    setRole(null); setMenuOpen(false);
    router.push('/'); router.refresh();
  }

  const navLinks = [
    { href: '/testlar', label: 'Testlar' },
    { href: '/maslahatlar', label: 'Psixologlar' },
    { href: '/ai-tavsiyalar', label: 'AI Tavsiya' },
    { href: '/kayfiyat', label: 'Kayfiyat' },
    { href: '/kitoblar', label: 'Kitoblar' },
    { href: '/resurslar', label: 'Resurslar' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled ? 'rgba(247,246,243,0.92)' : 'var(--c-bg)',
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${scrolled ? 'var(--c-border)' : 'transparent'}`,
      transition: 'all .2s',
    }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          textDecoration: 'none', color: 'var(--c-primary)',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'var(--c-primary)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>🧠</div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.15rem', color: 'var(--c-text)', letterSpacing: '-.01em' }}>
            PsixoHelp
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'none' }} className="md:flex hidden">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              padding: '6px 12px', fontSize: '0.875rem', fontWeight: 500,
              borderRadius: 'var(--radius-sm)', textDecoration: 'none', transition: 'all .15s',
              background: isActive(href) ? 'var(--c-primary-l)' : 'transparent',
              color: isActive(href) ? 'var(--c-primary)' : 'var(--c-muted)',
            }}>
              {label}
            </Link>
          ))}
          {(role === 'ADMIN' || role === 'SUPERADMIN') && (
            <Link href="/admin" style={{
              padding: '6px 12px', fontSize: '0.875rem', fontWeight: 500,
              borderRadius: 'var(--radius-sm)', textDecoration: 'none',
              background: isActive('/admin') ? '#FEF3C7' : 'transparent',
              color: isActive('/admin') ? '#92400E' : '#B45309',
            }}>Admin</Link>
          )}
          {role === 'SUPERADMIN' && (
            <Link href="/superadmin" style={{
              padding: '6px 12px', fontSize: '0.875rem', fontWeight: 500,
              borderRadius: 'var(--radius-sm)', textDecoration: 'none',
              background: isActive('/superadmin') ? '#EDE9FE' : 'transparent',
              color: '#7C3AED',
            }}>SuperAdmin</Link>
          )}
        </nav>

        {/* Right area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {role ? (
            <>
              <Link href="/profil" className="btn-ghost btn-sm hidden sm:inline-flex">👤 Profil</Link>
              <button onClick={handleLogout} className="btn-sm" style={{ background: '#64748B' }}>Chiqish</button>
            </>
          ) : (
            <>
              <Link href="/kirish" className="btn-ghost btn-sm">Kirish</Link>
              <Link href="/royxatdan-otish" className="btn btn-sm">Ro'yxat</Link>
            </>
          )}
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
            style={{ padding: 6, borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--c-border)', background: 'transparent', cursor: 'pointer', color: 'var(--c-muted)', lineHeight: 1 }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden" style={{
          background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)',
          padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
              padding: '10px 12px', borderRadius: 'var(--radius-sm)', fontWeight: 500,
              fontSize: '0.9rem', textDecoration: 'none', transition: 'background .15s',
              background: isActive(href) ? 'var(--c-primary-l)' : 'transparent',
              color: isActive(href) ? 'var(--c-primary)' : 'var(--c-text)',
            }}>{label}</Link>
          ))}
          {(role === 'ADMIN' || role === 'SUPERADMIN') && (
            <Link href="/admin" onClick={() => setMenuOpen(false)} style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', textDecoration: 'none', color: '#B45309' }}>Admin Panel</Link>
          )}
          {role && <Link href="/profil" onClick={() => setMenuOpen(false)} style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', textDecoration: 'none', color: 'var(--c-text)' }}>Profil</Link>}
        </div>
      )}
    </header>
  );
}
