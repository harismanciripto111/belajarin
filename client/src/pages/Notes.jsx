import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'
import axios from 'axios'
import {
  FiUpload, FiFileText, FiCpu, FiBookOpen, FiZap,
  FiCopy, FiDownload, FiChevronRight, FiX
} from 'react-icons/fi'
import Sidebar from '../components/Sidebar.jsx'

const pageVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -24, transition: { duration: 0.3 } },
}

function countWords(str) {
  return str.trim() === '' ? 0 : str.trim().split(/\s+/).length
}

export default function Notes() {
  const navigate = useNavigate()
  const [mode, setMode]           = useState('text')
  const [inputText, setInputText] = useState('')
  const [title, setTitle]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [summary, setSummary]     = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [pdfFile, setPdfFile]     = useState(null)
  const [step, setStep]           = useState('input')

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) {
      setPdfFile(accepted[0])
      toast.success('PDF berhasil diunggah!')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  })

  const handleTextChange = (e) => {
    setInputText(e.target.value)
    setWordCount(countWords(e.target.value))
  }

  const handleProcess = async () => {
    if (!title.trim()) { toast.error('Masukkan judul catatan terlebih dahulu.'); return }
    if (mode === 'text' && !inputText.trim()) { toast.error('Tempel teks materi terlebih dahulu.'); return }
    if (mode === 'pdf'  && !pdfFile)          { toast.error('Upload file PDF terlebih dahulu.');    return }

    setLoading(true)
    try {
      let textToSummarize = inputText

      if (mode === 'pdf') {
        const formData = new FormData()
        formData.append('pdf', pdfFile)
        const uploadRes = await axios.post('/api/upload/pdf', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        textToSummarize = uploadRes.data.text
      }

      const res = await axios.post('/api/ai/summarize', {
        text: textToSummarize,
        title,
      })

      setSummary(res.data.summary)
      setStep('result')
      toast.success('Ringkasan berhasil dibuat!')
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.error || 'Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
    toast.success('Disalin ke clipboard!')
  }

  const handleDownload = () => {
    const blob = new Blob([`# ${title}\n\n${summary}`], { type: 'text/markdown' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `${title.replace(/\s+/g, '_') || 'catatan'}.md`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('File diunduh!')
  }

  const handleReset = () => {
    setStep('input')
    setSummary('')
    setInputText('')
    setTitle('')
    setPdfFile(null)
    setWordCount(0)
    setMode('text')
  }

  const goTo = (path) => {
    sessionStorage.setItem('belajarin_text', mode === 'pdf' ? summary : inputText)
    navigate(path)
  }

  const summaryWords = countWords(summary)
  const summaryChars = summary.length

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <main className="notes-main">
        <motion.div
          className="notes-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="notes-header-icon">
            <FiBookOpen size={28} />
          </div>
          <div>
            <h1 className="notes-title">Catatan AI</h1>
            <p className="notes-subtitle">Ringkas materi pelajaran secara otomatis dengan kecerdasan buatan</p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'input' ? (
            <motion.div
              key="input"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="notes-card"
            >
              <div className="form-group">
                <label className="form-label">Judul Catatan</label>
                <input
                  className="form-input"
                  placeholder="Contoh: Fotosintesis — Biologi Kelas X"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sumber Materi</label>
                <div className="mode-toggle">
                  <button
                    className={`mode-btn ${mode === 'text' ? 'active' : ''}`}
                    onClick={() => setMode('text')}
                  >
                    <FiFileText size={16} />
                    Tempel Teks
                  </button>
                  <button
                    className={`mode-btn ${mode === 'pdf' ? 'active' : ''}`}
                    onClick={() => setMode('pdf')}
                  >
                    <FiUpload size={16} />
                    Upload PDF
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {mode === 'text' ? (
                  <motion.div
                    key="text-mode"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.25 }}
                    className="form-group"
                  >
                    <div className="textarea-header">
                      <label className="form-label">Teks Materi</label>
                      <span className="word-count">{wordCount} kata</span>
                    </div>
                    <textarea
                      className="form-textarea"
                      rows={12}
                      placeholder="Tempelkan teks materi pelajaran di sini. Semakin lengkap teksnya, semakin baik ringkasannya..."
                      value={inputText}
                      onChange={handleTextChange}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="pdf-mode"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    className="form-group"
                  >
                    <label className="form-label">File PDF</label>
                    {!pdfFile ? (
                      <div
                        {...getRootProps()}
                        className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
                      >
                        <input {...getInputProps()} />
                        <FiUpload size={40} className="dropzone-icon" />
                        <p className="dropzone-text">
                          {isDragActive
                            ? 'Lepaskan file di sini...'
                            : 'Seret & lepas file PDF, atau klik untuk memilih'}
                        </p>
                        <p className="dropzone-hint">Mendukung PDF hingga 10 MB</p>
                      </div>
                    ) : (
                      <div className="pdf-preview">
                        <FiFileText size={32} className="pdf-icon" />
                        <div className="pdf-info">
                          <p className="pdf-name">{pdfFile.name}</p>
                          <p className="pdf-size">{(pdfFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button
                          className="pdf-remove"
                          onClick={() => setPdfFile(null)}
                          title="Hapus file"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                className="btn-primary"
                onClick={handleProcess}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <FiCpu size={18} />
                    Proses dengan AI
                  </>
                )}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="result-header">
                <div className="result-title-row">
                  <h2 className="result-title">{title}</h2>
                  <div className="result-actions">
                    <button className="icon-btn" onClick={handleCopy}    title="Salin"><FiCopy size={18} /></button>
                    <button className="icon-btn" onClick={handleDownload} title="Unduh"><FiDownload size={18} /></button>
                    <button className="icon-btn danger" onClick={handleReset} title="Buat Baru"><FiX size={18} /></button>
                  </div>
                </div>
                <div className="result-badges">
                  <span className="badge badge-purple">{summaryWords} kata</span>
                  <span className="badge badge-blue">{summaryChars} karakter</span>
                  <span className="badge badge-green">AI Ringkasan</span>
                </div>
              </div>

              <div className="notes-card result-card">
                <div className="result-card-header">
                  <FiZap size={18} className="result-card-icon" />
                  <span>Ringkasan Materi</span>
                </div>
                <div className="markdown-body">
                  <ReactMarkdown>{summary}</ReactMarkdown>
                </div>
              </div>

              <div className="next-actions">
                <p className="next-actions-label">Lanjutkan dengan</p>
                <div className="next-actions-row">
                  <motion.button
                    className="next-btn flashcard-btn"
                    onClick={() => goTo('/flashcards')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <FiZap size={20} />
                    <div>
                      <p className="next-btn-title">Buat Flashcard</p>
                      <p className="next-btn-sub">Generate kartu belajar dari materi ini</p>
                    </div>
                    <FiChevronRight size={18} className="next-btn-arrow" />
                  </motion.button>

                  <motion.button
                    className="next-btn quiz-btn"
                    onClick={() => goTo('/quiz')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <FiBookOpen size={20} />
                    <div>
                      <p className="next-btn-title">Buat Quiz</p>
                      <p className="next-btn-sub">Uji pemahaman dengan soal latihan</p>
                    </div>
                    <FiChevronRight size={18} className="next-btn-arrow" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        :root {
          --primary: #6C63FF;
          --secondary: #FF6584;
          --accent: #43E97B;
          --bg: #0F0F1A;
          --bg-card: rgba(255,255,255,0.04);
          --bg-card-hover: rgba(255,255,255,0.07);
          --border: rgba(255,255,255,0.08);
          --border-focus: rgba(108,99,255,0.5);
          --text: #F0F0FF;
          --text-muted: rgba(240,240,255,0.5);
          --text-dim: rgba(240,240,255,0.25);
          --radius: 16px;
          --radius-sm: 10px;
          --shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .notes-main {
          flex: 1;
          padding: 40px 48px;
          max-width: 860px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }
        .notes-header {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 36px;
        }
        .notes-header-icon {
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
        .notes-title {
          font-size: 28px;
          font-weight: 700;
          color: var(--text);
          margin: 0 0 4px;
          background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .notes-subtitle { font-size: 14px; color: var(--text-muted); margin: 0; }
        .notes-card {
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 32px;
          box-shadow: var(--shadow);
          margin-bottom: 24px;
        }
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
        .form-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text);
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .form-input:focus { border-color: var(--border-focus); box-shadow: 0 0 0 3px rgba(108,99,255,0.15); }
        .form-input::placeholder { color: var(--text-dim); }
        .textarea-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .textarea-header .form-label { margin-bottom: 0; }
        .word-count { font-size: 12px; color: var(--text-muted); background: rgba(108,99,255,0.12); padding: 3px 10px; border-radius: 20px; }
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
        .form-textarea:focus { border-color: var(--border-focus); box-shadow: 0 0 0 3px rgba(108,99,255,0.15); }
        .form-textarea::placeholder { color: var(--text-dim); }
        .mode-toggle {
          display: flex;
          gap: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 5px;
          width: fit-content;
        }
        .mode-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 18px;
          border-radius: 8px; border: none;
          background: transparent; color: var(--text-muted);
          font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s;
        }
        .mode-btn.active { background: linear-gradient(135deg, var(--primary), #857AFF); color: #fff; box-shadow: 0 4px 16px rgba(108,99,255,0.35); }
        .mode-btn:not(.active):hover { color: var(--text); background: rgba(255,255,255,0.06); }
        .dropzone {
          border: 2px dashed var(--border); border-radius: var(--radius); padding: 48px 24px;
          text-align: center; cursor: pointer; transition: border-color 0.2s, background 0.2s;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .dropzone:hover, .dropzone.drag-active { border-color: var(--primary); background: rgba(108,99,255,0.05); }
        .dropzone-icon { color: var(--primary); opacity: 0.7; }
        .dropzone-text { font-size: 15px; color: var(--text-muted); margin: 0; }
        .dropzone-hint { font-size: 12px; color: var(--text-dim); margin: 0; }
        .pdf-preview { display: flex; align-items: center; gap: 16px; padding: 16px 20px; background: rgba(108,99,255,0.08); border: 1px solid rgba(108,99,255,0.25); border-radius: var(--radius-sm); }
        .pdf-icon { color: var(--primary); flex-shrink: 0; }
        .pdf-info { flex: 1; min-width: 0; }
        .pdf-name { font-size: 14px; font-weight: 500; color: var(--text); margin: 0 0 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pdf-size { font-size: 12px; color: var(--text-muted); margin: 0; }
        .pdf-remove { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 6px; border-radius: 6px; display: flex; transition: color 0.2s, background 0.2s; }
        .pdf-remove:hover { color: var(--secondary); background: rgba(255,101,132,0.1); }
        .btn-primary {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, var(--primary) 0%, #857AFF 100%);
          border: none; border-radius: var(--radius-sm); color: #fff;
          font-size: 16px; font-weight: 600; cursor: pointer;
          transition: opacity 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(108,99,255,0.4);
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-primary:not(:disabled):hover { box-shadow: 0 6px 28px rgba(108,99,255,0.55); }
        .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .result-header { margin-bottom: 20px; }
        .result-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 12px; }
        .result-title { font-size: 22px; font-weight: 700; color: var(--text); margin: 0; }
        .result-actions { display: flex; gap: 8px; flex-shrink: 0; }
        .icon-btn { width: 38px; height: 38px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-card); color: var(--text-muted); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
        .icon-btn:hover { color: var(--text); background: var(--bg-card-hover); border-color: rgba(255,255,255,0.15); }
        .icon-btn.danger:hover { color: var(--secondary); border-color: rgba(255,101,132,0.3); background: rgba(255,101,132,0.08); }
        .result-badges { display: flex; gap: 8px; flex-wrap: wrap; }
        .badge { font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; }
        .badge-purple { background: rgba(108,99,255,0.15); color: #a89fff; border: 1px solid rgba(108,99,255,0.25); }
        .badge-blue   { background: rgba(56,189,248,0.12); color: #7dd3fc; border: 1px solid rgba(56,189,248,0.2); }
        .badge-green  { background: rgba(67,233,123,0.12); color: #86efac; border: 1px solid rgba(67,233,123,0.2); }
        .result-card { padding: 28px 32px; }
        .result-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; font-size: 14px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
        .result-card-icon { color: var(--primary); }
        .markdown-body { color: var(--text); font-size: 15px; line-height: 1.8; }
        .markdown-body h1, .markdown-body h2, .markdown-body h3 { color: var(--text); margin-top: 1.5em; margin-bottom: 0.6em; }
        .markdown-body h2 { font-size: 18px; color: #a89fff; }
        .markdown-body h3 { font-size: 16px; color: #c4bfff; }
        .markdown-body p { margin-bottom: 1em; }
        .markdown-body ul, .markdown-body ol { padding-left: 1.5em; margin-bottom: 1em; }
        .markdown-body li { margin-bottom: 0.4em; }
        .markdown-body strong { color: #c4bfff; }
        .markdown-body code { background: rgba(108,99,255,0.15); padding: 2px 6px; border-radius: 4px; font-size: 13px; color: #a89fff; }
        .markdown-body blockquote { border-left: 3px solid var(--primary); padding-left: 16px; color: var(--text-muted); margin: 1em 0; }
        .next-actions { margin-top: 8px; }
        .next-actions-label { font-size: 13px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 14px; }
        .next-actions-row { display: flex; gap: 14px; }
        .next-btn { flex: 1; display: flex; align-items: center; gap: 14px; padding: 18px 20px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--bg-card); cursor: pointer; text-align: left; transition: all 0.2s; }
        .next-btn:hover { background: var(--bg-card-hover); }
        .next-btn-title { font-size: 15px; font-weight: 600; color: var(--text); margin: 0 0 3px; }
        .next-btn-sub { font-size: 12px; color: var(--text-muted); margin: 0; }
        .next-btn-arrow { color: var(--text-dim); margin-left: auto; flex-shrink: 0; }
        .flashcard-btn { border-color: rgba(108,99,255,0.3); }
        .flashcard-btn svg:first-child { color: var(--primary); flex-shrink: 0; }
        .quiz-btn { border-color: rgba(67,233,123,0.25); }
        .quiz-btn svg:first-child { color: var(--accent); flex-shrink: 0; }
        @media (max-width: 640px) {
          .notes-main { padding: 24px 16px; }
          .notes-card { padding: 20px; }
          .next-actions-row { flex-direction: column; }
          .result-title { font-size: 18px; }
        }
      `}</style>
    </div>
  )
}