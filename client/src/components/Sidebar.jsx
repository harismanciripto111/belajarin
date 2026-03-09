import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiDashboardLine, RiFileTextLine, RiStackLine,
  RiQuestionLine, RiRobot2Line, RiBrainLine,
  RiMenuFoldLine, RiMenuUnfoldLine
} from 'react-icons/ri'

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: RiDashboardLine },
  { path: '/notes', label: 'Catatan AI', icon: RiFileTextLine },
  { path: '/flashcards', label: 'Flashcard', icon: RiStackLine },
  { path: '/quiz', label: 'Quiz', icon: RiQuestionLine },
  { path: '/chat', label: 'Chat Tutor', icon: RiRobot2Line },
]

export default function Sidebar() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const sidebarWidth = collapsed ? 72 : 260

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 998,
              display: 'none'
            }}
            className="mobile-overlay"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          left: 0, top: 0, bottom: 0,
          width: sidebarWidth,
          background: 'rgba(20, 19, 31, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 999,
          overflow: 'hidden'
        }}
      >
        {/* Logo */}
        <div style={{
          height: 'var(--navbar-height)',
          display: 'flex',
          alignItems: 'center',
          padding: collapsed ? '0 16px' : '0 20px',
          borderBottom: '1px solid var(--border-light)',
          gap: '12px',
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}>
          <div style={{
            width: 36, height: 36,
            background: 'var(--gradient-primary)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(108,99,255,0.4)'
          }}>
            <RiBrainLine size={20} color="white" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.2rem',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                whiteSpace: 'nowrap'
              }}
            >
              BelajarIn
            </motion.span>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                style={{ textDecoration: 'none', position: 'relative' }}
              >
                <motion.div
                  whileHover={{ x: collapsed ? 0 : 4 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: collapsed ? '12px' : '11px 14px',
                    borderRadius: 'var(--radius-md)',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    background: active
                      ? 'rgba(108, 99, 255, 0.18)'
                      : 'transparent',
                    border: active
                      ? '1px solid rgba(108,99,255,0.3)'
                      : '1px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon
                    size={20}
                    style={{
                      color: active ? 'var(--primary-light)' : 'rgba(255,255,255,0.5)',
                      flexShrink: 0
                    }}
                  />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        fontSize: '14px',
                        fontWeight: active ? 600 : 400,
                        color: active ? 'white' : 'rgba(255,255,255,0.65)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {active && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 3,
                        height: 20,
                        background: 'var(--gradient-primary)',
                        borderRadius: '0 3px 3px 0'
                      }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* User profile */}
        <div style={{
          padding: collapsed ? '16px 12px' : '16px',
          borderTop: '1px solid var(--border-light)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255,255,255,0.04)',
            justifyContent: collapsed ? 'center' : 'flex-start'
          }}>
            <div style={{
              width: 34, height: 34,
              background: 'var(--gradient-primary)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 700,
              color: 'white',
              flexShrink: 0
            }}>
              R
            </div>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>Raiman</div>
                <div style={{ fontSize: '11px', color: 'var(--primary-light)' }}>Pro Learner</div>
              </motion.div>
            )}
          </div>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              marginTop: '8px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px',
              background: 'rgba(108,99,255,0.08)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.2s'
            }}
          >
            {collapsed ? <RiMenuUnfoldLine size={16} /> : <><RiMenuFoldLine size={16} /><span>Collapse</span></>}
          </button>
        </div>
      </motion.aside>

      <style>{`
        @media (max-width: 1024px) {
          aside { transform: translateX(-100%); transition: transform 0.3s ease !important; }
          aside.open { transform: translateX(0) !important; }
          .mobile-overlay { display: block !important; }
        }
      `}</style>
    </>
  )
}
