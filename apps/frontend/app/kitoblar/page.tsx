import { apiGet } from '@/lib/api';
import Link from 'next/link';

type Book = { id: string; slug: string; title: string; author: string; description: string; coverUrl?: string; category: { name: string } };

export default async function KitoblarPage() {
  let books: Book[] = [];
  try { books = await apiGet<Book[]>('/books'); } catch {}
  return (
    <div className="wrap" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="heading-serif" style={{ fontSize: '2rem', marginBottom: 8 }}>📚 Kitoblar</h1>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.9rem' }}>Psixologik adabiyotlar va o'z-o'zini rivojlantirish kitoblari</p>
      </div>
      {books.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <p style={{ color: 'var(--c-muted)' }}>Hozircha kitoblar yo'q.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {books.map(b => (
            <Link key={b.id} href={`/kitoblar/${b.slug}`} style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 140, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--c-primary-l), #D1FAE5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.875rem', overflow: 'hidden', flexShrink: 0 }}>
                  {b.coverUrl ? <img src={b.coverUrl} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '3rem' }}>📖</span>}
                </div>
                <span className="badge badge-yellow" style={{ marginBottom: '0.5rem', width: 'fit-content' }}>{b.category?.name}</span>
                <h3 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4, color: 'var(--c-text)', flex: 1 }}>{b.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--c-muted)' }}>— {b.author}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
