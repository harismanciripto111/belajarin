import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RiFileTextLine, RiStackLine, RiQuestionLine, RiRobot2Line,
  RiFireLine, RiTrophyLine, RiArrowRightLine, RiStarFill,
  RiCalendarLine, RiTimeLine, RiBarChartLine
} from 'react-icons/ri'
import Sidebar from '../components/Sidebar.jsx'

const quotes = [
  { text: 'Belajar bukan tentang seberapa cepat, tapi seberapa dalam kamu memahami.', author: 'BelajarIn AI' },
  { text: 'Setiap hari adalah kesempatan untuk menjadi versi terbaik dirimu.', author: 'BelajarIn AI' },
  { text: 'Konsistensi kecil setiap hari menghasilkan perubahan besar.', author: 'BelajarIn AI' },
  { text: 'Ilmu adalah investasi terbaik yang tidak pernah rugi.', author: 'BelajarIn AI' },
]

const quickActions = [
  { to: '/notes', label: 'Buat Catatan', sub: 'Ringkas materi baru', icon: RiFileTextLine, color: '#6C63FF', bg: 'rgba(108,99,255,0.12)' },
  { to: '/flashcards', label: 'Buat Flashcard', sub: 'Generate kartu belajar', icon: RiStackLine, color: '#FF6584', bg: 'rgba(255,101,132,0.12)' },
  { to: '/quiz', label: 'Mulai Quiz', sub: 'Uji pemahamanmu', icon: RiQuestionLine, color: '#43E97B', bg: 'rgba(67,233,123,0.12)' },
  { to: '/chat', label: 'Chat Tutor', sub: 'Tanya AI tutormu', icon: RiRobot2Line, color: '#38F9D7', bg: 'rgba(56,249,215,0.12)' },
]

const recentActivities = [
  { icon: RiFileTextLine, color: '#6C63FF', text: 'Meringkas materi Biologi Sel', time: '2 jam lalu' },
  { icon: RiStackLine, color: '#FF6584', text: 'Membuat 15 flashcard Kimia Organik', time: '5 jam lalu' },
  { icon: RiQuestionLine, color: '#43E97B', text: 'Quiz Sejarah Indonesia — Skor 85%', time: 'Kemarin' },
  { icon: RiRobot2Line, color: '#38F9D7', text: 'Sesi chat tentang Kalkulus Integral', time: 'Kemarin' },
  { icon: RiFileTextLine, color: '#6C63FF', text: 'Ringkasan Fisika Kuantum', time: '2 hari lalu' },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function Dashboard() {
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)])
  const [xp] = useState(2450)
  const [level] = useState(12)
  const xpProgress = ((xp % 500) / 500) * 100

  const stats = [
    { label: 'Total Catatan', value: 24, icon: RiFileTextLine, color: '#6C63FF', change: '+3 minggu ini' },
    { label: 'Flashcard Hari Ini', value: 47, icon: RiStackLine, color: '#FF6584', change: '+12 dari kemarin' },
    { label: 'Quiz Selesai', value: 18, icon: RiTrophyLine, color: '#43E97B', change: '85% rata-rata skor' },
    { label: 'Streak Hari', value: 7, icon: RiFireLine, color: '#FFB800', change: 'Rekor terbaik: 14 hari' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <main style={{
        flex: 1,
        marginLeft: '260px',
        padding: '32px',
        minHeight: '100vh',
        transition: 'margin-left 0.3s ease'
      }} className="main-content">
        <motion.div variants={container} initial="hidden" animate="show">

          {/* Header */}
          <motion.div variants={item} style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 800,
                  marginBottom: '6px'
                }}>
                  Selamat Datang, <span className="gradient-text">Raiman!</span> 👋
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                  {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(108,99,255,0.1)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)',
                padding: '8px 16px'
              }}>
                <RiFireLine size={18} style={{ color: '#FFB800' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>7 Hari Streak!</span>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={item}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4, boxShadow: `0 12px 30px ${s.color}22` }}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{
                    width: 40, height: 40,
                    background: `${s.color}18`,
                    border: `1px solid ${s.color}33`,
                    borderRadius: 'var(--radius-md)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <s.icon size={20} style={{ color: s.color }} />
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
                <div style={{ fontSize: '11px', color: s.color, marginTop: '6px', fontWeight: 500 }}>{s.change}</div>
              </motion.div>
            ))}
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', marginBottom: '24px' }} className="dashboard-grid">

            {/* Quick Actions */}
            <motion.div variants={item}>
              <div style={{
                background: 'var(--card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-xl)',
                padding: '24px'
              }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RiBarChartLine style={{ color: 'var(--primary-light)' }} />
                  Aksi Cepat
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {quickActions.map((a, i) => (
                    <Link key={i} to={a.to} style={{ textDecoration: 'none' }}>
                      <motion.div
                        whileHover={{ scale: 1.02, backgroundColor: a.bg }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '14px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-lg)',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{
                          width: 40, height: 40, flexShrink: 0,
                          background: a.bg,
                          borderRadius: 'var(--radius-md)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <a.icon size={20} style={{ color: a.color }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>{a.label}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{a.sub}</div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* XP & Level */}
            <motion.div variants={item}>
              <div style={{
                background: 'var(--card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-xl)',
                padding: '24px',
                height: '100%'
              }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RiTrophyLine style={{ color: '#FFB800' }} />
                  Level & XP
                </h2>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: 80, height: 80,
                    background: 'var(--gradient-primary)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px',
                    boxShadow: 'var(--shadow-glow)',
                    fontSize: '1.8rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    color: 'white'
                  }}>
                    {level}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>Level {level}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Scholar Muda</div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <span>{xp % 500} XP</span>
                    <span>500 XP ke Level {level + 1}</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress}%` }}
                      transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--primary-light)', textAlign: 'center', fontWeight: 500 }}>
                  Total XP: {xp.toLocaleString()}
                </div>
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {['🎯', '🔥', '⚡', '🧠', '📚'].map((badge, i) => (
                    <div key={i} style={{
                      width: 36, height: 36,
                      background: 'rgba(108,99,255,0.1)',
                      border: '1px solid var(--border)',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '16px'
                    }}>{badge}</div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Activity + Quote */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }} className="dashboard-grid">
            <motion.div variants={item}>
              <div style={{
                background: 'var(--card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-xl)',
                padding: '24px'
              }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RiTimeLine style={{ color: 'var(--primary-light)' }} />
                  Aktivitas Terbaru
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {recentActivities.map((act, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '12px 0',
                      borderBottom: i < recentActivities.length - 1 ? '1px solid var(--border-light)' : 'none'
                    }}>
                      <div style={{
                        width: 36, height: 36, flexShrink: 0,
                        background: `${act.color}18`,
                        borderRadius: 'var(--radius-md)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <act.icon size={18} style={{ color: act.color }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{act.text}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '2px' }}>{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Quote */}
              <motion.div variants={item}>
                <div style={{
                  background: 'var(--gradient-primary)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '24px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '80px', opacity: 0.1 }}>💡</div>
                  <RiStarFill size={20} color="rgba(255,255,255,0.6)" style={{ marginBottom: '12px' }} />
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.95)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '12px' }}>
                    "{quote.text}"
                  </p>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>— {quote.author}</span>
                </div>
              </motion.div>

              {/* Calendar streak */}
              <motion.div variants={item}>
                <div style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '20px'
                }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RiCalendarLine style={{ color: 'var(--primary-light)' }} />
                    Streak Minggu Ini
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                    {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, i) => (
                      <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginBottom: '6px' }}>{day}</div>
                        <div style={{
                          width: 30, height: 30,
                          borderRadius: 'var(--radius-sm)',
                          background: i < 6 ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.06)',
                          border: i < 6 ? 'none' : '1px solid var(--border-light)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '14px'
                        }}>
                          {i < 6 ? '✓' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>

      <style>{`
        @media (max-width: 1024px) {
          .main-content { margin-left: 0 !important; }
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}