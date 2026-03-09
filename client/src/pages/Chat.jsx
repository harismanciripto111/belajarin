import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import axios from 'axios'
import {
  FiSend, FiTrash2, FiCpu, FiUser,
  FiZap, FiMessageSquare, FiRefreshCw
} from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import Sidebar from '../components/Sidebar.jsx'

const WELCOME_MSG = {
  id:   'welcome',
  role: 'assistant',
  text: `Halo! Saya **BelajarIn AI Tutor** 👋\n\nSaya siap membantu kamu belajar. Kamu bisa:\n- Tanya konsep yang sulit dipahami\n- Minta penjelasan ulang dengan cara berbeda\n- Diskusi soal latihan\n- Minta contoh dan ilustrasi\n\nApa yang ingin kamu pelajari hari ini?`,
  ts:   Date.now(),
}

const SUGGESTIONS = [
  'Jelaskan konsep fotosintesis secara sederhana',
  'Apa perbedaan mitosis dan meiosis?',
  'Bantu saya memahami hukum Newton',
  'Contoh soal integral dan pembahasannya',
]

export default function Chat() {
  const [messages, setMessages]   = useState([WELCOME_MSG])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const bottomRef                 = useRef(null)
  const inputRef                  = useRef(null)
  const sessionId                 = useRef(`session_${Date.now()}`)

  /* ── Auto-scroll ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  /* ── Focus input on mount ── */
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  /* ── Send Message ── */
  const handleSend = async (text) => {
    const msg = (text || input).trim()
    if (!msg) return
    setInput('')

    const userMsg = { id: Date.now(), role: 'user', text: msg, ts: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.text }))

      const res = await axios.post('/api/ai/chat', {
        message:   msg,
        history,
        sessionId: sessionId.current,
      })

      const aiMsg = {
        id:   Date.now() + 1,
        role: 'assistant',
        text: res.data.reply || res.data.message || 'Maaf, saya tidak bisa menjawab saat ini.',
        ts:   Date.now(),
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      console.error(err)
      toast.error('Gagal terhubung ke AI. Coba lagi.')
      const errMsg = {
        id:   Date.now() + 1,
        role: 'assistant',
        text: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        ts:   Date.now(),
        isError: true,
      }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  /* ── Keyboard submit ── */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  /* ── Clear chat ── */
  const handleClear = () => {
    setMessages([WELCOME_MSG])
    sessionId.current = `session_${Date.now()}`
    toast.success('Percakapan dihapus.')
  }

  const formatTime = (ts) => {
    const d = new Date(ts)
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <main className="chat-main">
        {/* ── Page Header ── */}
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="chat-header-icon">
              <FiCpu size={24} />
            </div>
            <div>
              <h1 className="chat-title">AI Tutor</h1>
              <div className="chat-status">
                <span className="status-dot" />
                <span className="status-text">Online &amp; Siap Membantu</span>
              </div>
            </div>
          </div>
          <button className="clear-btn" onClick={handleClear} title="Hapus percakapan">
            <FiTrash2 size={16} />
            <span>Hapus Chat</span>
          </button>
        </div>

        {/* ── Messages ── */}
        <div className="chat-messages">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className={`msg-row ${msg.role === 'user' ? 'msg-user' : 'msg-ai'}`}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0,  scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {/* Avatar */}
                {msg.role === 'assistant' && (
                  <div className="avatar avatar-ai">
                    <FiZap size={16} />
                  </div>
                )}

                {/* Bubble */}
                <div className={`bubble ${
                  msg.role === 'user' ? 'bubble-user'
                  : msg.isError       ? 'bubble-error'
                  : 'bubble-ai'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div className="markdown-body">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="msg-text">{msg.text}</p>
                  )}
                  <span className="msg-time">{formatTime(msg.ts)}</span>
                </div>

                {msg.role === 'user' && (
                  <div className="avatar avatar-user">
                    <FiUser size={16} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div
                className="msg-row msg-ai"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="avatar avatar-ai">
                  <FiZap size={16} />
                </div>
                <div className="bubble bubble-ai typing-bubble">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* ── Suggestions (shown when only welcome message) ── */}
        <AnimatePresence>
          {messages.length === 1 && !loading && (
            <motion.div
              className="suggestions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3 }}
            >
              {SUGGESTIONS.map((s, i) => (
                <motion.button
                  key={i}
                  className="suggestion-btn"
                  onClick={() => handleSend(s)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiMessageSquare size={14} />
                  {s}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Input Bar ── */}
        <div className="input-bar">
          <div className="input-wrap">
            <textarea
              ref={inputRef}
              className="chat-input"
              rows={1}
              placeholder="Tanya apa saja... (Enter untuk kirim, Shift+Enter untuk baris baru)"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                // auto-resize
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
              }}
              onKeyDown={handleKeyDown}
            />
            <motion.button
              className={`send-btn ${input.trim() && !loading ? 'send-active' : ''}`}
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              whileHover={{ scale: input.trim() && !loading ? 1.08 : 1 }}
              whileTap={{ scale: input.trim() && !loading ? 0.92 : 1 }}
            >
              {loading
                ? <span className="spinner" />
                : <FiSend size={18} />}
            </motion.button>
          </div>
          <p className="input-hint">BelajarIn AI dapat membuat kesalahan. Verifikasi informasi penting.</p>
        </div>
      </main>

      <style>{`
        :root {
          --primary:   #6C63FF;
          --secondary: #FF6584;
          --accent:    #38F9D7;
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
        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
          padding: 0 24px;
          box-sizing: border-box;
        }

        /* Header */
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 0 16px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .chat-header-left { display: flex; align-items: center; gap: 14px; }
        .chat-header-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--primary), #857AFF);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(108,99,255,0.35);
        }
        .chat-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--text);
          margin: 0 0 3px;
        }
        .chat-status { display: flex; align-items: center; gap: 6px; }
        .status-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #43E97B;
          box-shadow: 0 0 6px rgba(67,233,123,0.6);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.15); }
        }
        .status-text { font-size: 12px; color: var(--text-muted); }
        .clear-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-muted);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .clear-btn:hover { color: var(--secondary); border-color: rgba(255,101,132,0.3); background: rgba(255,101,132,0.06); }

        /* Messages */
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 24px 0 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.08) transparent;
        }
        .chat-messages::-webkit-scrollbar { width: 5px; }
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }

        /* Message Row */
        .msg-row {
          display: flex;
          align-items: flex-end;
          gap: 10px;
        }
        .msg-user  { flex-direction: row-reverse; }
        .msg-ai    { flex-direction: row; }

        /* Avatar */
        .avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .avatar-ai {
          background: linear-gradient(135deg, var(--primary), #857AFF);
          color: #fff;
          box-shadow: 0 2px 10px rgba(108,99,255,0.35);
        }
        .avatar-user {
          background: linear-gradient(135deg, #FF6584, #FF8FA3);
          color: #fff;
          box-shadow: 0 2px 10px rgba(255,101,132,0.3);
        }

        /* Bubble */
        .bubble {
          max-width: min(520px, 72%);
          padding: 13px 16px;
          border-radius: 18px;
          position: relative;
        }
        .bubble-user {
          background: linear-gradient(135deg, var(--primary), #857AFF);
          color: #fff;
          border-bottom-right-radius: 5px;
        }
        .bubble-ai {
          background: var(--bg-card);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border);
          border-bottom-left-radius: 5px;
          color: var(--text);
        }
        .bubble-error {
          background: rgba(255,101,132,0.08);
          border: 1px solid rgba(255,101,132,0.2);
          border-bottom-left-radius: 5px;
          color: var(--text);
        }
        .msg-text {
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 6px;
          color: inherit;
        }
        .msg-time {
          display: block;
          font-size: 11px;
          opacity: 0.5;
          margin-top: 5px;
          text-align: right;
        }

        /* Markdown in AI bubbles */
        .markdown-body { font-size: 15px; line-height: 1.7; color: var(--text); }
        .markdown-body p { margin: 0 0 0.7em; }
        .markdown-body p:last-child { margin-bottom: 0; }
        .markdown-body ul, .markdown-body ol { padding-left: 1.4em; margin: 0.5em 0; }
        .markdown-body li { margin-bottom: 0.3em; }
        .markdown-body strong { color: #c4bfff; }
        .markdown-body code {
          background: rgba(108,99,255,0.2);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 13px;
          color: #a89fff;
        }
        .markdown-body pre {
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 14px 16px;
          overflow-x: auto;
          margin: 0.8em 0;
        }
        .markdown-body pre code {
          background: none;
          padding: 0;
          color: #e2e8f0;
          font-size: 13px;
        }
        .markdown-body h1, .markdown-body h2, .markdown-body h3 {
          color: var(--text);
          margin: 0.8em 0 0.4em;
        }
        .markdown-body h3 { font-size: 15px; color: #c4bfff; }
        .markdown-body blockquote {
          border-left: 3px solid var(--primary);
          padding-left: 12px;
          color: var(--text-muted);
          margin: 0.6em 0;
        }

        /* Typing indicator */
        .typing-bubble {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 14px 18px;
          min-width: 60px;
        }
        .dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.35);
          animation: bounce 1.2s ease-in-out infinite;
        }
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0);    opacity: 0.4; }
          30%            { transform: translateY(-6px); opacity: 1; }
        }

        /* Suggestions */
        .suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 0 0 16px;
        }
        .suggestion-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 16px;
          border-radius: 20px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--text-muted);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .suggestion-btn:hover {
          color: var(--text);
          background: rgba(108,99,255,0.08);
          border-color: rgba(108,99,255,0.3);
        }

        /* Input Bar */
        .input-bar {
          padding: 12px 0 20px;
          flex-shrink: 0;
          border-top: 1px solid var(--border);
        }
        .input-wrap {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 10px 10px 10px 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-wrap:focus-within {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px rgba(108,99,255,0.12);
        }
        .chat-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: var(--text);
          font-size: 15px;
          line-height: 1.6;
          resize: none;
          min-height: 26px;
          max-height: 160px;
          font-family: inherit;
          overflow-y: auto;
          scrollbar-width: thin;
        }
        .chat-input::placeholder { color: var(--text-dim); }
        .send-btn {
          width: 42px; height: 42px;
          border-radius: 12px;
          border: none;
          background: rgba(255,255,255,0.06);
          color: var(--text-dim);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .send-btn:disabled { cursor: not-allowed; }
        .send-active {
          background: linear-gradient(135deg, var(--primary), #857AFF) !important;
          color: #fff !important;
          box-shadow: 0 4px 16px rgba(108,99,255,0.4);
        }
        .input-hint {
          font-size: 11px;
          color: var(--text-dim);
          text-align: center;
          margin: 8px 0 0;
        }

        /* Spinner */
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 640px) {
          .chat-main { padding: 0 12px; }
          .bubble    { max-width: 85%; }
          .suggestions { display: none; }
        }
      `}</style>
    </div>
  )
}