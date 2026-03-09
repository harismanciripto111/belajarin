import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RiBrainLine, RiMenuLine, RiCloseLine } from 'react-icons/ri'

const navLinks = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/notes', label: 'Catatan' },
  { path: '/flashcards', label: 'Flashcard' },
  { path: '/quiz', label: 'Quiz' },
  { path: '/chat', label: 'Chat Tutor' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const isActive = (path) => location.pathname === path

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: 'var(--navbar-height)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        background: scrolled
          ? 'rgba(15, 14, 23, 0.92)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(108,99,255,0.15)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flex: '0 0 auto' }}>
        <div style={{
          width: 38, height: 38,
          background: 'var(--gradient-primary)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(108,99,255,0.4)',
          flexShrink: 0
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
        }}>
          BelajarIn
        </span>
      </Link>

      {/* Desktop nav links */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginLeft: 'auto',
        marginRight: '24px'
      }} className="desktop-nav">
        {navLinks.map((link) => (
          <Link key={link.path} to={link.path} style={{ position: 'relative', padding: '8px 16px', borderRadius: 'var(--radius-full)', textDecoration: 'none' }}>
            <motion.span
              whileHover={{ y: -1 }}
              style={{
                fontSize: '14px',
                fontWeight: isActive(link.path) ? 600 : 400,
                color: isActive(link.path) ? 'white' : 'rgba(255,255,255,0.65)',
                transition: 'color 0.2s'
              }}
            >
              {link.label}
            </motion.span>
            {isActive(link.path) && (
              <motion.div
                layoutId="nav-indicator"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(108, 99, 255, 0.15)',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(108,99,255,0.3)',
                  zIndex: -1
                }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
          </Link>
        ))}
      </div>

      {/* CTA Button */}
      <Link to="/dashboard" className="btn-primary" style={{ fontSize: '14px', padding: '10px 22px' }} aria-label="Mulai Belajar">
        Mulai Belajar
      </Link>

      {/* Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'none',
          marginLeft: '16px',
          background: 'rgba(108,99,255,0.1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          color: 'white',
          padding: '8px',
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        className="hamburger-btn"
        aria-label="Toggle menu"
      >
        {menuOpen ? <RiCloseLine size={22} /> : <RiMenuLine size={22} />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'rgba(15, 14, 23, 0.97)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--border)',
              padding: '16px 24px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={link.path}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '15px',
                    fontWeight: isActive(link.path) ? 600 : 400,
                    color: isActive(link.path) ? 'white' : 'rgba(255,255,255,0.7)',
                    background: isActive(link.path) ? 'rgba(108,99,255,0.15)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </motion.nav>
  )
}
