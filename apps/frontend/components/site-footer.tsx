'use client';

import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--c-border)', background: 'var(--c-surface)', marginTop: 'auto' }}>
      <div className="wrap" style={{ padding: '2rem 1rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: '1.1rem', fontFamily: "'DM Serif Display', serif" }}>PsixoHelp</span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--c-muted)' }}>
            2025 PsixoHelp. Barcha huquqlar himoyalangan.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { href: '/ai-tavsiyalar', label: 'AI Tavsiyalar' },
            { href: '/maslahatlar', label: 'Psixologlar' },
            { href: '/testlar', label: 'Testlar' },
            { href: '/haqida', label: 'Biz haqimizda' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} style={{ fontSize: '0.8125rem', color: 'var(--c-muted)', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-muted)')}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}