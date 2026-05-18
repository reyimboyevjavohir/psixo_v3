'use client'

import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ padding: '5rem 1rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(45,106,79,.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--c-primary-l)', color: 'var(--c-primary)', padding: '5px 14px', borderRadius: 999, fontSize: '0.8125rem', fontWeight: 500, marginBottom: '1.5rem' }}>
            <span>✦</span> O'zbekistondagi #1 psixologik platforma
          </div>
          <h1 className="heading-serif" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', marginBottom: '1.25rem', maxWidth: 700, margin: '0 auto 1.25rem' }}>
            Ruhiy salomatligi<span style={{ color: 'var(--c-primary)', fontStyle: 'italic' }}>ngiz</span><br />
            bizning ustuvorligimiz
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--c-muted)', maxWidth: 560, margin: '0 auto 2rem', lineHeight: 1.7 }}>
            AI yordamida 24/7 psixologik tavsiyalar, professional psixologlar bilan video seanslar, testlar va resurslar — barchasi ona tilida.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/ai-tavsiyalar" className="btn" style={{ padding: '0.75rem 1.75rem', fontSize: '0.9375rem' }}>
              🤖 AI bilan gaplashish
            </Link>
            <Link href="/maslahatlar" className="btn-outline" style={{ padding: '0.75rem 1.75rem', fontSize: '0.9375rem' }}>
              Psixolog tanlash →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="wrap" style={{ paddingBottom: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          {[
            { n: '24/7', label: 'AI yordam' },
            { n: '15+', label: 'Psixolog' },
            { n: '100%', label: 'Maxfiylik' },
            { n: '3 til', label: "O'zbek, Rus, Ingliz" },
          ].map(({ n, label }) => (
            <div key={label} className="card" style={{ textAlign: 'center', padding: '1.25rem 1rem' }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: 'var(--c-primary)', marginBottom: 4 }}>{n}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--c-muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services grid */}
      <section className="wrap" style={{ paddingBottom: '4rem' }}>
        <h2 className="heading-serif" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Xizmatlarimiz</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {[
            { icon: '🤖', title: 'AI Psixologik Tavsiyalar', desc: "Google Gemini va CBT tamoyillari asosida 24/7 yordam. Krizis aniqlash filtri bilan.", href: '/ai-tavsiyalar', accent: 'var(--c-primary)' },
            { icon: '👨‍⚕️', title: 'Psixolog Seanslar', desc: 'Malakali, sertifikatlangan psixologlar bilan video va audio seanslar.', href: '/maslahatlar', accent: 'var(--c-accent)' },
            { icon: '📊', title: 'Kayfiyat Kuzatish', desc: "Kunlik kayfiyat, energiya va tashvish darajangizni kuzatib boring.", href: '/kayfiyat', accent: '#7C3AED' },
            { icon: '🧪', title: 'Mental Testlar', desc: 'PHQ-9, GAD-7, PSS standart testlari — holatingizni baholang.', href: '/testlar', accent: '#0EA5E9' },
            { icon: '📚', title: 'Kitoblar', desc: "Psixologik adabiyotlar va qo'llanmalar to'plami.", href: '/kitoblar', accent: '#F59E0B' },
            { icon: '🎯', title: 'Resurslar', desc: 'Video darslar, maqolalar va amaliy mashqlar.', href: '/resurslar', accent: '#EC4899' },
          ].map(({ icon, title, desc, href, accent }) => (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{ height: '100%' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.375rem', marginBottom: '0.875rem' }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--c-text)' }}>{title}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--c-muted)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AI Feature highlight */}
      <section className="wrap" style={{ paddingBottom: '4rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--c-primary) 0%, #1B4332 100%)',
          borderRadius: 'var(--radius-xl)', padding: 'clamp(2rem, 5vw, 3rem)',
          color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤖</div>
            <h2 className="heading-serif" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', marginBottom: '1rem', color: '#fff' }}>
              AI Psixologik Yordamchi
            </h2>
            <p style={{ fontSize: '0.9375rem', opacity: .85, maxWidth: 540, lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Google Gemini 2.0 va kognitiv-xulq-atvor terapiyasi (CBT) tamoyillari asosida ishlaydigan AI yordamchimiz sizga 24/7 sezgir tavsiyalar beradi. Krizis holatlarida darhol professional yordamga yo'naltiradi.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {['🛡️ Krizis aniqlash', '💬 Suhbat tarixi', '🧠 CBT tamoyillari', '⚡ 24/7 mavjud'].map(f => (
                <span key={f} style={{ fontSize: '0.875rem', opacity: .9 }}>{f}</span>
              ))}
            </div>
            <Link href="/ai-tavsiyalar" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#fff', color: 'var(--c-primary)', padding: '0.625rem 1.25rem',
              borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none',
            }}>
              Hozir boshlash →
            </Link>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="wrap" style={{ paddingBottom: '5rem' }}>
        <div className="card" style={{ background: 'var(--c-bg)' }}>
          <h2 className="heading-serif" style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '2rem' }}>
            Nega aynan biz?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: '🔒', title: 'To\'liq maxfiylik', desc: "Barcha ma'lumotlar shifrlangan. Hech kim o'qiy olmaydi." },
              { icon: '🇺🇿', title: "Ona tilida", desc: "O'zbek tilida qurilgan, mahalliy to'lov tizimlari." },
              { icon: '✅', title: 'Tekshirilgan', desc: 'Barcha psixologlar sertifikat va admin orqali tasdiqlanadi.' },
              { icon: '💰', title: "Arzon narx", desc: "Dastlabki AI tavsiyalar bepul. Seans narxi shaffof." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{icon}</div>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: 4, fontSize: '0.9375rem' }}>{title}</p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--c-muted)', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

