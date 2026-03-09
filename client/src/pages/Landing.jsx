import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  RiBrainLine, RiFileTextLine, RiStackLine, RiQuestionLine,
  RiRobot2Line, RiArrowRightLine, RiStarFill,
  RiUploadCloud2Line, RiMagicLine, RiGraduationCapLine,
  RiCheckLine, RiFlashlightLine
} from 'react-icons/ri'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

// Fade-in section wrapper
function FadeInSection({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

const features = [
  {
    icon: RiFileTextLine,
    title: 'Catatan AI',
    desc: 'Upload materi atau paste teks, dapatkan ringkasan terstruktur otomatis dengan heading, poin kunci, dan konsep penting.',
    color: '#6C63FF',
    gradient: 'linear-gradient(135deg, #6C63FF22, #6C63FF11)'
  },
  {
    icon: RiStackLine,
    title: 'Flashcard Pintar',
    desc: 'Generate flashcard interaktif dengan animasi flip 3D. Belajar dengan metode spaced repetition yang terbukti efektif.',
    color: '#FF6584',
    gradient: 'linear-gradient(135deg, #FF658422, #FF658411)'
  },
  {
    icon: RiQuestionLine,
    title: 'Quiz Otomatis',
    desc: 'Buat soal pilihan ganda dari materi apapun dalam hitungan detik. Lengkap dengan penjelasan jawaban yang edukatif.',
    color: '#43E97B',
    gradient: 'linear-gradient(135deg, #43E97B22, #43E97B11)'
  },
  {
    icon: RiRobot2Line,
    title: 'Chat Tutor AI',
    desc: 'Tanya apa saja ke AI tutor pribadimu. Mendapat penjelasan mendalam dalam Bahasa Indonesia yang mudah dipahami.',
    color: '#38F9D7',
    gradient: 'linear-gradient(135deg, #38F9D722, #38F9D711)'
  },
]

const stats = [
  { value: '10K+', label: 'Pengguna Aktif' },
  { value: '50K+', label: 'Flashcard Dibuat' },
  { value: '99%', label: 'Akurasi AI' },
  { value: '4.9/5', label: 'Rating Pengguna' },
]

const steps = [
  { num: '01', icon: RiUploadCloud2Line, title: 'Upload Materi', desc: 'Paste teks atau upload file PDF dari materi pelajaranmu.' },
  { num: '02', icon: RiMagicLine, title: 'AI Memproses', desc: 'Gemini AI menganalisis dan mengekstrak informasi penting secara otomatis.' },
  { num: '03', icon: RiGraduationCapLine, title: 'Mulai Belajar', desc: 'Belajar dengan ringkasan, flashcard, quiz, atau chat dengan AI tutor.' },
]

const testimonials = [
  {
    name: 'Siti Rahma',
    role: 'Mahasiswa Kedokteran UI',
    avatar: 'SR',
    color: '#6C63FF',
    text: 'BelajarIn benar-benar mengubah cara aku belajar! Flashcard yang dihasilkan sangat relevan dan quiz-nya membantu aku mempersiapkan ujian dengan lebih baik.',
    stars: 5
  },
  {
    name: 'Budi Santoso',
    role: 'Pelajar SMA Negeri 1 Jakarta',
    avatar: 'BS',
    color: '#FF6584',
    text: 'Dulu belajar terasa membosankan, sekarang dengan AI ringkasan jadi lebih mudah dipahami. Nilai ujianku naik drastis setelah pakai BelajarIn!',
    stars: 5
  },
  {
    name: 'Anisa Putri',
    role: 'Guru SMP',
    avatar: 'AP',
    color: '#43E97B',
    text: 'Saya pakai BelajarIn untuk membuat materi ajar yang lebih interaktif. Fitur quiz otomatisnya sangat membantu saya membuat soal latihan untuk murid.',
    stars: 5
  },
]

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'var(--navbar-height)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* BG blobs */}
        <div style={{
          position: 'absolute', top: '15%', left: '10%',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '5%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(255,101,132,0.1) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '80px 24px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(108,99,255,0.12)',
              border: '1px solid rgba(108,99,255,0.3)',
              borderRadius: 'var(--radius-full)',
              padding: '8px 20px',
              fontSize: '13px',
              color: 'var(--primary-light)',
              marginBottom: '32px',
              fontWeight: 500
            }}>
              <RiFlashlightLine size={14} />
              Platform Belajar AI #1 Indonesia
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '24px',
              letterSpacing: '-0.02em'
            }}
          >
            Belajar Lebih{' '}
            <span className="gradient-text">Cerdas</span>
            <br />dengan Kekuatan{' '}
            <span className="gradient-text">AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              color: 'var(--text-muted)',
              maxWidth: '600px',
              margin: '0 auto 40px',
              lineHeight: 1.7
            }}
          >
            Ubah materi belajarmu menjadi ringkasan cerdas, flashcard interaktif, quiz otomatis, dan sesi tanya jawab dengan AI tutor — semua dalam satu platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/dashboard" className="btn-primary" style={{ fontSize: '16px', padding: '14px 32px' }}>
              Mulai Gratis <RiArrowRightLine />
            </Link>
            <Link to="/notes" className="btn-secondary" style={{ fontSize: '16px', padding: '14px 32px' }}>
              Lihat Demo
            </Link>
          </motion.div>

          {/* Hero floating cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            style={{ marginTop: '60px', position: 'relative', display: 'inline-block' }}
          >
            <div style={{
              background: 'rgba(26,24,48,0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '32px 40px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(108,99,255,0.15)',
              display: 'flex',
              gap: '32px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                    padding: '16px 20px',
                    background: f.gradient,
                    border: `1px solid ${f.color}33`,
                    borderRadius: 'var(--radius-lg)',
                    minWidth: '100px'
                  }}
                >
                  <f.icon size={28} style={{ color: f.color }} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>{f.title}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS BAR */}
      <FadeInSection>
        <section style={{
          background: 'rgba(108,99,255,0.06)',
          borderTop: '1px solid var(--border-light)',
          borderBottom: '1px solid var(--border-light)',
          padding: '40px 0'
        }}>
          <div className="container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
              textAlign: 'center'
            }} className="stats-grid">
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                    fontWeight: 800,
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>{s.value}</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* FEATURES */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <FadeInSection>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{
                display: 'inline-block',
                background: 'rgba(108,99,255,0.1)',
                border: '1px solid rgba(108,99,255,0.25)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 18px',
                fontSize: '13px',
                color: 'var(--primary-light)',
                fontWeight: 500,
                marginBottom: '16px'
              }}>Fitur Unggulan</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '16px' }}>
                Semua yang Kamu Butuhkan untuk{' '}
                <span className="gradient-text">Belajar Efektif</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto', fontSize: '16px' }}>
                Teknologi AI terdepan dikemas dalam antarmuka yang indah dan mudah digunakan.
              </p>
            </div>
          </FadeInSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {features.map((f, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8, boxShadow: `0 20px 40px ${f.color}22` }}
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '32px',
                    transition: 'all 0.3s',
                    cursor: 'default'
                  }}
                >
                  <div style={{
                    width: 56, height: 56,
                    background: f.gradient,
                    border: `1px solid ${f.color}44`,
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '20px'
                  }}>
                    <f.icon size={28} style={{ color: f.color }} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '12px' }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7 }}>{f.desc}</p>
                  <div style={{ marginTop: '20px' }}>
                    <Link
                      to={i === 0 ? '/notes' : i === 1 ? '/flashcards' : i === 2 ? '/quiz' : '/chat'}
                      style={{ fontSize: '13px', color: f.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                    >
                      Coba Sekarang <RiArrowRightLine size={14} />
                    </Link>
                  </div>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 0', background: 'rgba(108,99,255,0.03)' }}>
        <div className="container">
          <FadeInSection>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div style={{
                display: 'inline-block',
                background: 'rgba(255,101,132,0.1)',
                border: '1px solid rgba(255,101,132,0.25)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 18px',
                fontSize: '13px',
                color: 'var(--secondary)',
                fontWeight: 500,
                marginBottom: '16px'
              }}>Cara Kerja</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800 }}>
                Mulai Belajar dalam{' '}
                <span className="gradient-text">3 Langkah</span>
              </h2>
            </div>
          </FadeInSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '32px',
            position: 'relative'
          }}>
            {steps.map((step, i) => (
              <FadeInSection key={i} delay={i * 0.15}>
                <div style={{ textAlign: 'center', padding: '24px' }}>
                  <div style={{
                    fontSize: '4rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    opacity: 0.3,
                    lineHeight: 1,
                    marginBottom: '16px'
                  }}>{step.num}</div>
                  <div style={{
                    width: 64, height: 64,
                    background: 'rgba(108,99,255,0.1)',
                    border: '1px solid var(--border)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <step.icon size={28} style={{ color: 'var(--primary-light)' }} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem', marginBottom: '12px' }}>{step.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <FadeInSection>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '16px' }}>
                Apa Kata{' '}<span className="gradient-text">Pengguna Kami</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Bergabung dengan ribuan pelajar yang sudah merasakan manfaatnya.</p>
            </div>
          </FadeInSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {testimonials.map((t, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <div style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '28px',
                  display: 'flex', flexDirection: 'column', gap: '16px'
                }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {Array(t.stars).fill(0).map((_, si) => (
                      <RiStarFill key={si} size={16} style={{ color: '#FFB800' }} />
                    ))}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: 1.8, fontStyle: 'italic' }}>
                    "{t.text}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '14px', color: 'white', flexShrink: 0
                    }}>{t.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{t.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <FadeInSection>
        <section style={{ padding: '80px 0' }}>
          <div className="container">
            <motion.div
              whileInView={{ scale: [0.97, 1] }}
              viewport={{ once: true }}
              style={{
                background: 'var(--gradient-primary)',
                borderRadius: '32px',
                padding: 'clamp(40px, 6vw, 80px) clamp(24px, 5vw, 60px)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(108,99,255,0.4)'
              }}
            >
              <div style={{
                position: 'absolute', top: '-40px', right: '-40px',
                width: 250, height: 250,
                background: 'rgba(255,255,255,0.07)',
                borderRadius: '50%'
              }} />
              <div style={{
                position: 'absolute', bottom: '-60px', left: '-20px',
                width: 200, height: 200,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '50%'
              }} />
              <RiBrainLine size={48} color="rgba(255,255,255,0.3)" style={{ marginBottom: '16px' }} />
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                fontWeight: 800,
                color: 'white',
                marginBottom: '16px',
                position: 'relative'
              }}>
                Siap Belajar Lebih Efektif?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', marginBottom: '36px', position: 'relative' }}>
                Bergabung sekarang dan rasakan perbedaannya. Gratis untuk selalu.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
                <Link
                  to="/dashboard"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '14px 36px',
                    background: 'white',
                    color: 'var(--primary)',
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '16px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    transition: 'transform 0.2s'
                  }}
                >
                  Mulai Gratis Sekarang <RiArrowRightLine />
                </Link>
              </div>
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', position: 'relative' }}>
                {['Tidak perlu kartu kredit', 'Setup dalam 2 menit', 'Gratis selamanya'].map(item => (
                  <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                    <RiCheckLine size={16} />{item}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </FadeInSection>

      <Footer />

      <style>{`
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}