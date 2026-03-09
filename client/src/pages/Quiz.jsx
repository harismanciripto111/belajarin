import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import axios from 'axios'
import {
  FiCpu, FiCheckCircle, FiXCircle, FiAward,
  FiRefreshCw, FiChevronRight, FiBookOpen, FiList
} from 'react-icons/fi'
import Sidebar from '../components/Sidebar.jsx'

const pageVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -24, transition: { duration: 0.3 } },
}

const DIFFICULTY_OPTS = [
  { value: 'mudah',  label: 'Mudah',  color: '#86efac', bg: 'rgba(67,233,123,0.12)',  border: 'rgba(67,233,123,0.3)'  },
  { value: 'sedang', label: 'Sedang', color: '#fcd34d', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)'  },
  { value: 'sulit',  label: 'Sulit',  color: '#fca5a5', bg: 'rgba(255,101,132,0.12)', border: 'rgba(255,101,132,0.3)' },
]

export default function Quiz() {
  const [inputText, setInputText]       = useState('')
  const [questionCount, setQuestionCount] = useState(10)
  const [difficulty, setDifficulty]     = useState('sedang')
  const [loading, setLoading]           = useState(false)
  const [questions, setQuestions]       = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected]         = useState(null)   // index of chosen option
  const [answered, setAnswered]         = useState(false)
  const [score, setScore]               = useState(0)
  const [step, setStep]                 = useState('input') // 'input' | 'quiz' | 'result'
  const [answers, setAnswers]           = useState([])      // {correct: bool, selected, correctIndex}
  const [showReview, setShowReview]     = useState(false)

  /* ── Pre-fill from sessionStorage ── */
  useEffect(() => {
    const saved = sessionStorage.getItem('belajarin_text')
    if (saved) {
      setInputText(saved)
      sessionStorage.removeItem('belajarin_text')
    }
  }, [])

  /* ── Generate Quiz ── */
  const handleGenerate = async () => {
    if (!inputText.trim()) { toast.error('Masukkan materi terlebih dahulu.'); return }
    setLoading(true)
    try {
      const res = await axios.post('/api/ai/quiz', {
        text:       inputText,
        count:      questionCount,
        difficulty,
      })
      const qs = res.data.questions || []
      if (qs.length === 0) { toast.error('Tidak ada soal yang dihasilkan. Coba lagi.'); return }
      setQuestions(qs)
      setCurrentIndex(0)
      setSelected(null)
      setAnswered(false)
      setScore(0)
      setAnswers([])
      setShowReview(false)
      setStep('quiz')
      toast.success(`${qs.length} soal berhasil dibuat!`)
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.error || 'Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Select Answer ── */
  const handleSelect = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    const q = questions[currentIndex]
    const isCorrect = idx === q.correctIndex
    if (isCorrect) setScore(s => s + 1)
    setAnswers(prev => [...prev, {
      correct:      isCorrect,
      selected:     idx,
      correctIndex: q.correctIndex,
      question:     q.question,
      options:      q.options,
      explanation:  q.explanation || '',
    }])
  }

  /* ── Next Question ── */
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setStep('result')
    }
  }

  /* ── Restart ── */
  const handleRestart = () => {
    setStep('input')
    setQuestions([])
    setCurrentIndex(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setAnswers([])
    setShowReview(false)
  }

  /* ── Retry same questions ── */
  const handleRetry = () => {
    setCurrentIndex(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setAnswers([])
    setShowReview(false)
    setStep('quiz')
  }

  const q         = questions[currentIndex] || {}
  const progress  = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0
  const pct       = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0
  const diffStyle = DIFFICULTY_OPTS.find(d => d.value === difficulty) || DIFFICULTY_OPTS[1]

  const getGrade = (p) => {
    if (p >= 90) return { label: 'Sempurna!',    color: '#86efac', emoji: '🏆' }
    if (p >= 75) return { label: 'Bagus Sekali!', color: '#86efac', emoji: '🎉' }
    if (p >= 60) return { label: 'Cukup Baik',   color: '#fcd34d', emoji: '👍' }
    if (p >= 40) return { label: 'Perlu Belajar', color: '#fcd34d', emoji: '📚' }
    return               { label: 'Tetap Semangat!', color: '#fca5a5', emoji: '💪' }
  }
  const grade = getGrade(pct)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <main className="quiz-main">
        {/* ── Page Header ── */}
        <motion.div
          className="quiz-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="quiz-header-icon">
            <FiBookOpen size={28} />
          </div>
          <div>
            <h1 className="quiz-title">Quiz Interaktif</h1>
            <p className="quiz-subtitle">Uji pemahaman materi dengan soal pilihan ganda yang dibuat AI</p>
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
              className="quiz-card"
            >
              {/* Textarea */}
              <div className="form-group">
                <label className="form-label">Materi Pelajaran</label>
                <textarea
                  className="form-textarea"
                  rows={9}
                  placeholder="Tempelkan materi pelajaran di sini. AI akan membuat soal pilihan ganda secara otomatis..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>

              {/* Settings Row */}
              <div className="settings-row">
                {/* Question Count */}
                <div className="form-group" style={{ flex: 1 }}>
                  <div className="slider-header">
                    <label className="form-label">Jumlah Soal</label>
                    <span className="slider-value">{questionCount} soal</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={20}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="quiz-slider"
                  />
                  <div className="slider-ticks">
                    <span>5</span><span>10</span><span>15</span><span>20</span>
                  </div>
                </div>

                {/* Difficulty */}
                <div className="form-group diff-group">
                  <label className="form-label">Tingkat Kesulitan</label>
                  <div className="diff-toggle">
                    {DIFFICULTY_OPTS.map(opt => (
                      <button
                        key={opt.value}
                        className={`diff-btn ${difficulty === opt.value ? 'active' : ''}`}
                        style={difficulty === opt.value
                          ? { background: opt.bg, color: opt.color, borderColor: opt.border }
                          : {}}
                        onClick={() => setDifficulty(opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate */}
              <motion.button
                className="btn-primary"
                onClick={handleGenerate}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading
                  ? <><span className="spinner" />Membuat Soal...</>
                  : <><FiCpu size={18} />Buat Quiz dengan AI</>}
              </motion.button>
            </motion.div>
          )}

          {/* ════════ QUIZ STEP ════════ */}
          {step === 'quiz' && (
            <motion.div
              key="quiz"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Progress */}
              <div className="quiz-topbar">
                <span className="q-counter">
                  <span className="q-cur">{currentIndex + 1}</span>
                  <span className="q-sep"> / </span>
                  <span className="q-tot">{questions.length}</span>
                </span>
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
                <span
                  className="q-diff-badge"
                  style={{ background: diffStyle.bg, color: diffStyle.color, border: `1px solid ${diffStyle.border}` }}
                >
                  {diffStyle.label}
                </span>
              </div>

              {/* Question Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -32 }}
                  transition={{ duration: 0.3 }}
                  className="quiz-card"
                >
                  <p className="question-text">{q.question}</p>

                  <div className="options-list">
                    {(q.options || []).map((opt, idx) => {
                      let state = 'default'
                      if (answered) {
                        if (idx === q.correctIndex)              state = 'correct'
                        else if (idx === selected)               state = 'wrong'
                      }
                      return (
                        <motion.button
                          key={idx}
                          className={`option-btn option-${state}`}
                          onClick={() => handleSelect(idx)}
                          disabled={answered}
                          whileHover={{ scale: answered ? 1 : 1.015 }}
                          whileTap={{ scale: answered ? 1 : 0.985 }}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.07 }}
                        >
                          <span className="option-letter">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="option-text">{opt}</span>
                          {answered && idx === q.correctIndex && <FiCheckCircle size={18} className="opt-icon correct-icon" />}
                          {answered && idx === selected && idx !== q.correctIndex && <FiXCircle size={18} className="opt-icon wrong-icon" />}
                        </motion.button>
                      )
                    })}
                  </div>

                  {/* Explanation */}
                  <AnimatePresence>
                    {answered && q.explanation && (
                      <motion.div
                        className="explanation"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="explanation-label">Penjelasan:</span>
                        <span> {q.explanation}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Next Button */}
                  <AnimatePresence>
                    {answered && (
                      <motion.button
                        className="btn-primary"
                        onClick={handleNext}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ marginTop: 8 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {currentIndex < questions.length - 1
                          ? <><FiChevronRight size={18} />Soal Berikutnya</>
                          : <><FiAward size={18} />Lihat Hasil</>}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* ════════ RESULT STEP ════════ */}
          {step === 'result' && (
            <motion.div
              key="result"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Score Card */}
              <div className="quiz-card result-card">
                <div className="result-emoji">{grade.emoji}</div>
                <h2 className="result-grade" style={{ color: grade.color }}>{grade.label}</h2>
                <div className="score-ring-wrap">
                  <svg className="score-ring" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" className="ring-bg" />
                    <motion.circle
                      cx="60" cy="60" r="50"
                      className="ring-fill"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - pct / 100)}`}
                      initial={{ strokeDashoffset: `${2 * Math.PI * 50}` }}
                      animate={{ strokeDashoffset: `${2 * Math.PI * 50 * (1 - pct / 100)}` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="ring-label">
                    <span className="ring-pct">{pct}%</span>
                    <span className="ring-sub">{score}/{questions.length} benar</span>
                  </div>
                </div>

                <div className="result-stats">
                  <div className="r-stat">
                    <FiCheckCircle size={20} className="r-stat-icon correct-icon" />
                    <span className="r-stat-val">{score}</span>
                    <span className="r-stat-label">Benar</span>
                  </div>
                  <div className="r-stat">
                    <FiXCircle size={20} className="r-stat-icon wrong-icon" />
                    <span className="r-stat-val">{questions.length - score}</span>
                    <span className="r-stat-label">Salah</span>
                  </div>
                  <div className="r-stat">
                    <FiAward size={20} className="r-stat-icon" style={{ color: '#fcd34d' }} />
                    <span className="r-stat-val">{pct}%</span>
                    <span className="r-stat-label">Skor</span>
                  </div>
                </div>

                <div className="result-actions">
                  <motion.button className="btn-primary" style={{ flex: 1 }}
                    onClick={handleRetry}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    <FiRefreshCw size={17} />Ulangi Quiz
                  </motion.button>
                  <motion.button className="btn-secondary" style={{ flex: 1 }}
                    onClick={handleRestart}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    Materi Baru
                  </motion.button>
                </div>

                <button
                  className="review-toggle"
                  onClick={() => setShowReview(v => !v)}
                >
                  <FiList size={16} />
                  {showReview ? 'Sembunyikan Pembahasan' : 'Lihat Pembahasan'}
                </button>
              </div>

              {/* Review */}
              <AnimatePresence>
                {showReview && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.3 }}
                  >
                    {answers.map((a, idx) => (
                      <div key={idx} className={`review-item ${a.correct ? 'review-correct' : 'review-wrong'}`}>
                        <div className="review-q-row">
                          <span className="review-num">#{idx + 1}</span>
                          {a.correct
                            ? <FiCheckCircle size={16} className="correct-icon" />
                            : <FiXCircle     size={16} className="wrong-icon"   />}
                          <p className="review-q">{a.question}</p>
                        </div>
                        <div className="review-opts">
                          {a.options.map((opt, oi) => (
                            <span
                              key={oi}
                              className={
                                oi === a.correctIndex ? 'rev-opt correct-opt'
                                : oi === a.selected   ? 'rev-opt wrong-opt'
                                : 'rev-opt'
                              }
                            >
                              {String.fromCharCode(65 + oi)}. {opt}
                            </span>
                          ))}
                        </div>
                        {a.explanation && (
                          <p className="review-exp">{a.explanation}</p>
                        )}
                      </div>
                    ))}
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

        .quiz-main {
          flex: 1;
          padding: 40px 48px;
          max-width: 860px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        /* Header */
        .quiz-header {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 36px;
        }
        .quiz-header-icon {
          width: 56px; height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, #43E97B, #38F9D7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          flex-shrink: 0;
          box-shadow: 0 4px 20px rgba(67,233,123,0.35);
        }
        .quiz-title {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 4px;
          background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .quiz-subtitle { font-size: 14px; color: var(--text-muted); margin: 0; }

        /* Glass Card */
        .quiz-card {
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 32px;
          box-shadow: var(--shadow);
          margin-bottom: 20px;
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

        /* Settings Row */
        .settings-row { display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 0; }
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
        .quiz-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: rgba(255,255,255,0.08);
          outline: none;
          cursor: pointer;
          margin-bottom: 8px;
        }
        .quiz-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #43E97B, #38F9D7);
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(67,233,123,0.4);
        }
        .quiz-slider::-moz-range-thumb {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #43E97B, #38F9D7);
          border: none;
          cursor: pointer;
        }
        .slider-ticks {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: var(--text-dim);
        }

        /* Difficulty Toggle */
        .diff-group { min-width: 200px; }
        .diff-toggle { display: flex; gap: 8px; flex-wrap: wrap; }
        .diff-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .diff-btn:hover:not(.active) { color: var(--text); background: rgba(255,255,255,0.06); }

        /* Primary / Secondary Buttons */
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
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Quiz Top Bar */
        .quiz-topbar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }
        .q-counter { font-size: 18px; font-weight: 700; white-space: nowrap; flex-shrink: 0; }
        .q-cur { color: var(--primary); font-size: 22px; }
        .q-sep { color: var(--text-dim); }
        .q-tot { color: var(--text-muted); }
        .progress-bar {
          flex: 1;
          height: 8px;
          background: rgba(255,255,255,0.06);
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #43E97B, #38F9D7);
          border-radius: 4px;
          min-width: 4px;
        }
        .q-diff-badge {
          font-size: 12px;
          font-weight: 600;
          padding: 4px 14px;
          border-radius: 20px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* Question */
        .question-text {
          font-size: 18px;
          font-weight: 600;
          color: var(--text);
          line-height: 1.6;
          margin: 0 0 24px;
        }

        /* Options */
        .options-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        .option-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.03);
          color: var(--text);
          font-size: 15px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }
        .option-btn:not(:disabled):hover {
          background: rgba(108,99,255,0.08);
          border-color: rgba(108,99,255,0.3);
        }
        .option-btn:disabled { cursor: default; }
        .option-letter {
          width: 30px; height: 30px;
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .option-text { flex: 1; line-height: 1.4; }
        .option-correct {
          background: rgba(67,233,123,0.10) !important;
          border-color: rgba(67,233,123,0.4) !important;
        }
        .option-correct .option-letter { background: rgba(67,233,123,0.2); color: #86efac; }
        .option-wrong {
          background: rgba(255,101,132,0.10) !important;
          border-color: rgba(255,101,132,0.4) !important;
        }
        .option-wrong .option-letter { background: rgba(255,101,132,0.2); color: #fca5a5; }
        .opt-icon { flex-shrink: 0; }
        .correct-icon { color: #86efac; }
        .wrong-icon   { color: #fca5a5; }

        /* Explanation */
        .explanation {
          background: rgba(251,191,36,0.08);
          border: 1px solid rgba(251,191,36,0.2);
          border-radius: var(--radius-sm);
          padding: 14px 16px;
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 16px;
          overflow: hidden;
        }
        .explanation-label { font-weight: 700; color: #fcd34d; }

        /* Result Card */
        .result-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 20px;
          padding: 40px 32px;
        }
        .result-emoji { font-size: 56px; line-height: 1; }
        .result-grade { font-size: 26px; font-weight: 700; margin: 0; }

        /* Score Ring */
        .score-ring-wrap { position: relative; width: 140px; height: 140px; }
        .score-ring { width: 140px; height: 140px; transform: rotate(-90deg); }
        .ring-bg {
          fill: none;
          stroke: rgba(255,255,255,0.06);
          stroke-width: 10;
        }
        .ring-fill {
          fill: none;
          stroke: url(#scoreGrad);
          stroke-width: 10;
          stroke-linecap: round;
          stroke: #43E97B;
        }
        .ring-label {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .ring-pct { font-size: 28px; font-weight: 800; color: var(--text); }
        .ring-sub  { font-size: 12px; color: var(--text-muted); }

        /* Result Stats */
        .result-stats { display: flex; gap: 32px; }
        .r-stat { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .r-stat-icon { margin-bottom: 2px; }
        .r-stat-val   { font-size: 24px; font-weight: 700; color: var(--text); }
        .r-stat-label { font-size: 12px; color: var(--text-muted); }

        /* Result Actions */
        .result-actions { display: flex; gap: 12px; width: 100%; max-width: 400px; }
        .review-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-muted);
          font-size: 13px;
          padding: 8px 18px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .review-toggle:hover { color: var(--text); background: rgba(255,255,255,0.05); }

        /* Review Items */
        .review-item {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 18px 20px;
          margin-bottom: 12px;
        }
        .review-correct { border-color: rgba(67,233,123,0.2); }
        .review-wrong   { border-color: rgba(255,101,132,0.2); }
        .review-q-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
        .review-num   { font-size: 12px; font-weight: 700; color: var(--text-dim); flex-shrink: 0; padding-top: 2px; }
        .review-q     { font-size: 14px; font-weight: 600; color: var(--text); margin: 0; line-height: 1.5; flex: 1; }
        .review-opts  { display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px; }
        .rev-opt      { font-size: 13px; color: var(--text-muted); padding: 2px 0; }
        .correct-opt  { color: #86efac; font-weight: 600; }
        .wrong-opt    { color: #fca5a5; text-decoration: line-through; }
        .review-exp   {
          font-size: 13px;
          color: var(--text-muted);
          background: rgba(251,191,36,0.06);
          border-left: 3px solid rgba(251,191,36,0.4);
          padding: 8px 12px;
          border-radius: 0 6px 6px 0;
          margin: 0;
          line-height: 1.5;
        }

        @media (max-width: 640px) {
          .quiz-main    { padding: 24px 16px; }
          .quiz-card    { padding: 20px; }
          .settings-row { flex-direction: column; }
          .result-stats { gap: 18px; }
          .result-actions { flex-direction: column; }
        }
      `}</style>
    </div>
  )
}