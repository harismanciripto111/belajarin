import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RiBrainLine, RiGithubLine, RiTwitterLine, RiInstagramLine, RiHeartFill } from 'react-icons/ri'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      background: 'rgba(14, 13, 22, 0.95)',
      borderTop: '1px solid var(--border-light)',
      padding: '60px 0 32px'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '40px',
          marginBottom: '48px'
        }} className="footer-grid">
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '16px' }}>
              <div style={{
                width: 38, height: 38,
                background: 'var(--gradient-primary)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <RiBrainLine size={22} color="white" />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.3rem',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>BelajarIn</span>
            </Link>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '280px' }}>
              Platform belajar AI terdepan di Indonesia. Belajar lebih cerdas, lebih cepat, dan lebih menyenangkan bersama kecerdasan buatan.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              {[RiGithubLine, RiTwitterLine, RiInstagramLine].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3, color: 'var(--primary-light)' }}
                  style={{
                    width: 36, height: 36,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-muted)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Fitur */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '14px', color: 'white', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fitur</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { to: '/notes', label: 'Catatan AI' },
                { to: '/flashcards', label: 'Flashcard Pintar' },
                { to: '/quiz', label: 'Quiz Otomatis' },
                { to: '/chat', label: 'Chat Tutor' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--primary-light)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '14px', color: 'white', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Tentang Kami', 'Blog', 'Karir', 'Kontak'].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--primary-light)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '14px', color: 'white', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Kebijakan Privasi', 'Syarat & Ketentuan', 'Cookie Policy'].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--primary-light)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <p style={{ fontSize: '13px', color: 'var(--text-faint)' }}>
            &copy; {year} BelajarIn. All rights reserved.
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Created with
            <RiHeartFill size={14} color="#FF6584" />
            by <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Raiman</span>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}
