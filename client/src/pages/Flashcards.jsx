import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import axios from 'axios'
import {
  FiZap, FiRotateCw, FiChevronLeft, FiChevronRight,
  FiShuffle, FiRefreshCw, FiCpu
} from 'react-icons/fi'
import Sidebar from '../components/Sidebar.jsx'

const pageVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -24, transition: { duration: 0.3 } },
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const DIFFICULTY_COLORS = {
  mudah:  { bg: 'rgba(67,233,123,0.15)',  color: '#86efac', border: 'rgba(67,233,123,0.3)'  },
  sedang: { bg: 'rgba(251,191,36,0.15)',  color: '#fcd34d', border: 'rgba(251,191,36,0.3)'  },
  sulit:  { bg: 'rgba(255,101,132,0.15)', color: '#fca5a5', border: 'rgba(255,101,132,0.3)' },
}

export default function Flashcards() {
  const [inputText, setInputText]     = useState('')
  const [cardCount, setCardCount]     = useState(10)
  const [loading, setLoading]         = useState(false)
  const [cards, setCards]             = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped]     = useState(false)
  const [step, setStep]               = useState('input')   // 'input' | 'study'
  const [showAll, setShowAll]         = useState(false)
  const [done, setDone]               = useState(false)

  /* ── Pre-fill from sessionStorage ── */
  useEffect(() => {
    const saved = sessionStorage.getItem('belajarin_text')
    if (saved) {
      setInputText(saved)
      sessionStorage.removeItem('belajarin_text')
    }
  }, [])

  /* ── Keyboard navigation ── */
  useEffect(() => {
    if (step !== 'study' || showAll || done) return
    const handler = (e) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft')  goPrev()
      if (e.key === ' ')          { e.preventDefault(); setIsFlipped(f => !f) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [step, currentIndex, showAll, done, cards.length])

  /* ── Generate ── */
  const handleGenerate = async () => {
    if (!inputText.trim()) { toast.error('Masukkan materi terlebih dahulu.'); return }
    setLoading(true)
    try {
      const res = await axios.post('/api/ai/flashcards', {
        text:  inputText,
        count: cardCount,
      })
      const data = res.data.flashcards || []
      if (data.length === 0) { toast.error('Tidak ada flashcard yang dihasilkan. Coba lagi.'); return }
      setCards(data)
      setCurrentIndex(0)
      setIsFlipped(false)
      setDone(false)
      setStep('study')
      toast.success(`${data.length} flashcard berhasil dibuat!`)
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.error || 'Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Navigation ── */
  const goNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(i => i + 1)
      setIsFlipped(false)
    } else {
      setDone(true)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1)
      setIsFlipped(false)
    }
  }

  const handleShuffle = () => {
    setCards(shuffle(cards))
    setCurrentIndex(0)
    setIsFlipped(false)
    setDone(false)
    toast.success('Kartu diacak!')
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setDone(false)
    setShowAll(false)
  }

  const handleRestart = () => {
    setStep('input')
    setCards([])
    setCurrentIndex(0)
    setIsFlipped(false)
    setDone(false)
    setShowAll(false)
  }

  const card = cards[currentIndex] || {}
  const diff = DIFFICULTY_COLORS[card.difficulty] || DIFFICULTY_COLORS.sedang
  const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <main className="fc-main">
        {/* ── Page Header ── */}
        <motion.div
          className="fc-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="fc-header-icon">
            <FiZap size={28} />
          </div>
          <div>
            <h1 className="fc-title">Flashcard Pintar</h1>
            <p className="fc-subtitle">Generate kartu belajar interaktif dari materi apapun</p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ════════ INPUT STEP ════════ */}
          {step === 'input' && (
            <motion.div
              key="input"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fc-card"
            >
              {/* Textarea */}
              <div className="form-group">
                <label className="form-label">Materi Pelajaran</label>
                <textarea
                  className="form-textarea"
                  rows={10}
                  placeholder="Tempelkan atau ketik materi pelajaran di sini. AI akan membuat flashcard secara otomatis dari konten yang kamu berikan..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>

              {/* Slider */}
              <div className="form-group">
                <div className="slider-header">
                  <label className="form-label">Jumlah Kartu</label>
                  <span className="slider-value">{cardCount} kartu</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  value={cardCount}
                  onChange={(e) => setCardCount(Number(e.target.value))}
                  className="fc-slider"
                />
                <div className="slider-ticks">
                  <span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span>
                </div>
              </div>

              {/* Generate Button */}
              <motion.button
                className="btn-primary"
                onClick={handleGenerate}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <><span className="spinner" />Generating Flashcard...</>
                ) : (
                  <><FiCpu size={18} />Generate Flashcard</>
                )}
              </motion.button>
            </motion.div>
          )}

          {/* ════════ STUDY STEP ════════ */}
          {step === 'study' && (
            <motion.div
              key="study"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Top Bar */}
              <div className="study-topbar">
                <div className="study-counter">
                  <span className="counter-current">{Math.min(currentIndex + 1, cards.length)}</span>
                  <span className="counter-sep"> / </span>
                  <span className="counter-total">{cards.length}</span>
                </div>

                {/* Progress Bar */}
                <div className="progress-wrap">
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Toolbar */}
                <div className="toolbar">
                  <button className="tool-btn" onClick={handleShuffle} title="Acak kartu">
                    <FiShuffle size={16} /><span>Acak</span>
                  </button>
                  <button className="tool-btn" onClick={handleReset} title="Reset">
                    <FiRefreshCw size={16} /><span>Reset</span>
                  </button>
                  <button
                    className={`tool-btn ${showAll ? 'tool-btn-active' : ''}`}
                    onClick={() => setShowAll(v => !v)}
                    title="Lihat semua"
                  >
                    <FiRotateCw size={16} /><span>Lihat Semua</span>
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {/* ── Completion Screen ── */}
                {done ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    className="done-card fc-card"
                  >
                    <div className="done-icon">🎉</div>
                    <h2 className="done-title">Selesai!</h2>
                    <p className="done-sub">Kamu telah menyelesaikan semua {cards.length} flashcard.</p>
                    <div className="done-stats">
                      <div className="done-stat">
                        <span className="done-stat-val">{cards.length}</span>
                        <span className="done-stat-label">Kartu</span>
                      </div>
                      <div className="done-stat">
                        <span className="done-stat-val">
                          {cards.filter(c => c.difficulty === 'mudah').length}
                        </span>
                        <span className="done-stat-label">Mudah</span>
                      </div>
                      <div className="done-stat">
                        <span className="done-stat-val">
                          {cards.filter(c => c.difficulty === 'sedang').length}
                        </span>
                        <span className="done-stat-label">Sedang</span>
                      </div>
                      <div className="done-stat">
                        <span className="done-stat-val">
                          {cards.filter(c => c.difficulty === 'sulit').length}
                        </span>
                        <span className="done-stat-label">Sulit</span>
                      </div>
                    </div>
                    <div className="done-actions">
                      <motion.button
                        className="btn-primary"
                        onClick={handleReset}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        style={{ flex: 1 }}
                      >
                        <FiRefreshCw size={18} />Ulangi
                      </motion.button>
                      <motion.button
                        className="btn-secondary"
                        onClick={handleRestart}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        style={{ flex: 1 }}
                      >
                        Materi Baru
                      </motion.button>
                    </div>
                  </motion.div>
                ) : showAll ? (
                  /* ── Show All Grid ── */
                  <motion.div
                    key="all"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="all-grid"
                  >
                    {cards.map((c, idx) => {
                      const d = DIFFICULTY_COLORS[c.difficulty] || DIFFICULTY_COLORS.sedang
                      return (
                        <motion.div
                          key={idx}
                          className="mini-card"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.04 }}
                        >
                          <div className="mini-card-num">#{idx + 1}</div>
                          <p className="mini-card-front">{c.front}</p>
                          <div className="mini-card-divider" />
                          <p className="mini-card-back">{c.back}</p>
                          <span
                            className="mini-badge"
                            style={{ background: d.bg, color: d.color, border: `1px solid ${d.border}` }}
                          >
                            {c.difficulty}
                          </span>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                ) : (
                  /* ── Single Card View ── */
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="card-area"
                  >
                    {/* Difficulty Badge */}
                    <div className="card-meta">
                      <span
                        className="diff-badge"
                        style={{ background: diff.bg, color: diff.color, border: `1px solid ${diff.border}` }}
                      >
                        {card.difficulty || 'sedang'}
                      </span>
                      <span className="card-hint">Klik kartu untuk membalik • Spasi</span>
                    </div>

                    {/* 3D Flip Card */}
                    <div
                      className={`flip-card ${isFlipped ? 'flipped' : ''}`}
                      onClick={() => setIsFlipped(f => !f)}
                    >
                      <div className="flip-card-inner">
                        {/* Front */}
                        <div className="flip-face flip-front">
                          <div className="face-label">PERTANYAAN</div>
                          <p className="face-text front-text">{card.front}</p>
                          <div className="face-footer">
                            <FiRotateCw size={16} />
                            <span>Klik untuk jawaban</span>
                          </div>
                        </div>
                        {/* Back */}
                        <div className="flip-face flip-back">
                          <div className="face-label back-label">JAWABAN</div>
                          <p className="face-text back-text">{card.back}</p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="nav-row">
                      <motion.button
                        className="nav-btn"
                        onClick={goPrev}
                        disabled={currentIndex === 0}
                        whileHover={{ scale: currentIndex === 0 ? 1 : 1.05 }}
                        whileTap={{ scale: currentIndex === 0 ? 1 : 0.95 }}
                      >
                        <FiChevronLeft size={22} />
                      </motion.button>

                      <button className="flip-hint-btn" onClick={() => setIsFlipped(f => !f)}>
                        <FiRotateCw size={16} />
                        {isFlipped ? 'Lihat Pertanyaan' : 'Lihat Jawaban'}
                      </button>

                      <motion.button
                        className="nav-btn nav-btn-next"
                        onClick={goNext}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiChevronRight size={22} />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        :root {
          --primary:   #6C63FF;
          --secondary: #FF6584;
          --accent:    #43E97B;
          --bg:        #0F0F1A;
          --bg-card:   rgba(255,255,255,0.04);
          --bg-card-hover: rgba(255,255,255,0.07);
          --border:    rgba(255,255,255,0.08);
          --border-focus: rgba(108,99,255,0.5);
          --text:      #F0F0FF;
          --text-muted: rgba(240,240,255,0.5);
          --text-dim:  rgba(240,240,255,0.25);
          --radius:    16px;
          --radius-sm: 10px;
          --shadow:    0 8px 32px rgba(0,0,0,0.4);
        }

        /* Layout */
        .fc-main {
          flex: 1;
          padding: 40px 48px;
          max-width: 860px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        /* Header */
        .fc-header {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 36px;
        }
        .fc-header-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 4px 20px rgba(108,99,255,0.4);
        }
        .fc-title {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 4px;
          background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .fc-subtitle {
          font-size: 14px;
          color: var(--text-muted);
          margin: 0;
        }

        /* Glass Card */
        .fc-card {
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 32px;
          box-shadow: var(--shadow);
          margin-bottom: 24px;
        }

        /* Form */
        .form-group { margin-bottom: 24px; }
        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 10px;
        }
        .form-textarea {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text);
          font-size: 14px;
          line-height: 1.7;
          resize: vertical;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
          font-family: inherit;
        }
        .form-textarea:focus {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px rgba(108,99,255,0.15);
        }
        .form-textarea::placeholder { color: var(--text-dim); }

        /* Slider */
        .slider-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .slider-header .form-label { margin-bottom: 0; }
        .slider-value {
          font-size: 14px;
          font-weight: 700;
          color: var(--primary);
          background: rgba(108,99,255,0.12);
          padding: 4px 12px;
          border-radius: 20px;
        }
        .fc-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: rgba(255,255,255,0.08);
          outline: none;
          cursor: pointer;
          margin-bottom: 8px;
        }
        .fc-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), #857AFF);
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(108,99,255,0.5);
        }
        .fc-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), #857AFF);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 10px rgba(108,99,255,0.5);
        }
        .slider-ticks {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: var(--text-dim);
        }

        /* Primary Button */
        .btn-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, var(--primary) 0%, #857AFF 100%);
          border: none;
          border-radius: var(--radius-sm);
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(108,99,255,0.4);
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-primary:not(:disabled):hover { box-shadow: 0 6px 28px rgba(108,99,255,0.55); }

        .btn-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 15px;
          background: rgba(255,255,255,0.06);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text);
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); }

        /* Spinner */
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Study Top Bar */
        .study-topbar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .study-counter {
          font-size: 18px;
          font-weight: 700;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .counter-current { color: var(--primary); font-size: 22px; }
        .counter-sep     { color: var(--text-dim); }
        .counter-total   { color: var(--text-muted); }
        .progress-wrap   { flex: 1; min-width: 100px; }
        .progress-bar {
          height: 8px;
          background: rgba(255,255,255,0.06);
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), #857AFF);
          border-radius: 4px;
          min-width: 4px;
        }
        .toolbar { display: flex; gap: 8px; flex-shrink: 0; }
        .tool-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .tool-btn:hover { color: var(--text); background: var(--bg-card-hover); }
        .tool-btn-active {
          color: var(--primary) !important;
          border-color: rgba(108,99,255,0.4) !important;
          background: rgba(108,99,255,0.1) !important;
        }

        /* Card Area */
        .card-area { display: flex; flex-direction: column; align-items: center; gap: 24px; }
        .card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 600px;
        }
        .diff-badge {
          font-size: 12px;
          font-weight: 600;
          padding: 4px 14px;
          border-radius: 20px;
          text-transform: capitalize;
        }
        .card-hint { font-size: 12px; color: var(--text-dim); }

        /* 3D Flip Card */
        .flip-card {
          width: 100%;
          max-width: 600px;
          height: 320px;
          perspective: 1200px;
          cursor: pointer;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .flip-card.flipped .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: var(--radius);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 36px;
          box-sizing: border-box;
          text-align: center;
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
        }
        .flip-front {
          background: linear-gradient(145deg, rgba(108,99,255,0.12), rgba(255,255,255,0.04));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .flip-back {
          background: linear-gradient(145deg, rgba(67,233,123,0.10), rgba(255,255,255,0.04));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transform: rotateY(180deg);
        }
        .face-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: var(--text-dim);
          margin-bottom: 20px;
          text-transform: uppercase;
        }
        .back-label { color: rgba(67,233,123,0.5); }
        .face-text {
          font-size: 18px;
          font-weight: 500;
          line-height: 1.6;
          margin: 0;
        }
        .front-text { color: var(--text); }
        .back-text  { color: #d1fae5; }
        .face-footer {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 24px;
          font-size: 12px;
          color: var(--text-dim);
        }

        /* Navigation Row */
        .nav-row {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          max-width: 600px;
          justify-content: center;
        }
        .nav-btn {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .nav-btn:not(:disabled):hover {
          color: var(--text);
          background: var(--bg-card-hover);
          border-color: rgba(255,255,255,0.15);
        }
        .nav-btn-next {
          background: linear-gradient(135deg, var(--primary), #857AFF);
          border-color: transparent;
          color: #fff;
        }
        .nav-btn-next:hover { opacity: 0.9; }
        .flip-hint-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 30px;
          border: 1px solid rgba(108,99,255,0.35);
          background: rgba(108,99,255,0.08);
          color: #a89fff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          flex: 1;
          justify-content: center;
          max-width: 220px;
        }
        .flip-hint-btn:hover {
          background: rgba(108,99,255,0.15);
          border-color: rgba(108,99,255,0.5);
        }

        /* All Grid */
        .all-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .mini-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: background 0.2s;
        }
        .mini-card:hover { background: var(--bg-card-hover); }
        .mini-card-num { font-size: 11px; color: var(--text-dim); font-weight: 600; }
        .mini-card-front {
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          margin: 0;
          line-height: 1.5;
        }
        .mini-card-divider {
          height: 1px;
          background: var(--border);
        }
        .mini-card-back {
          font-size: 12px;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.5;
        }
        .mini-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 10px;
          border-radius: 20px;
          text-transform: capitalize;
          width: fit-content;
        }

        /* Done Card */
        .done-card {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .done-icon { font-size: 56px; line-height: 1; }
        .done-title { font-size: 28px; font-weight: 700; color: var(--text); margin: 0; }
        .done-sub   { font-size: 15px; color: var(--text-muted); margin: 0; }
        .done-stats {
          display: flex;
          gap: 24px;
          margin: 8px 0;
        }
        .done-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .done-stat-val   { font-size: 28px; font-weight: 700; color: var(--primary); }
        .done-stat-label { font-size: 12px; color: var(--text-muted); }
        .done-actions {
          display: flex;
          gap: 12px;
          width: 100%;
          max-width: 400px;
        }

        @media (max-width: 640px) {
          .fc-main { padding: 24px 16px; }
          .fc-card { padding: 20px; }
          .flip-card { height: 260px; }
          .face-text { font-size: 15px; }
          .toolbar span { display: none; }
          .all-grid { grid-template-columns: 1fr 1fr; }
          .done-stats { gap: 14px; }
        }
      `}</style>
    </div>
  )
}
