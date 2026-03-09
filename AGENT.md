# AGENT.md — BelajarIn Project Context

> Baca file ini dulu sebelum ngapa-ngapain di repo ini.
> Dokumen ini berisi konteks lengkap project + instruksi untuk agent yang bakal ngerjain task di sini.

---

## 1. Project Overview

BelajarIn adalah web app belajar berbasis AI yang membantu pengguna belajar lebih efektif lewat fitur-fitur berbasis Gemini AI. User bisa paste teks atau upload PDF, lalu AI akan otomatis generate ringkasan, flashcard, quiz, dan bisa diajak chat.

- Bahasa UI: Indonesia
- Author: Raiman
- Status: Development

---

## 2. Tech Stack

### Frontend

| Tech | Versi | Kegunaan |
|------|-------|----------|
| React | 18 | UI framework |
| Vite | 5 | Build tool & dev server |
| React Router DOM | 6 | Client-side routing |
| Framer Motion | latest | Animasi page transitions |
| react-hot-toast | latest | Toast notifications |
| Axios | latest | HTTP client ke backend |

### Backend

| Tech | Versi | Kegunaan |
|------|-------|----------|
| Node.js + Express | latest | REST API server |
| @google/generative-ai | latest | Gemini AI SDK |
| multer | latest | File upload (PDF) |
| pdf-parse | latest | Extract teks dari PDF |
| dotenv | latest | Environment variables |
| cors | latest | Cross-origin requests |

---

## 3. Folder Structure

```
belajarin/
├── package.json          # Root scripts (install:all, dev, build)
├── AGENT.md              # File ini
├── README.md             # Dokumentasi user-facing
├── server/               # Express backend
│   ├── index.js          # Entry point, middleware, error handlers
│   ├── package.json      # Server dependencies
│   ├── env.example       # Template environment variables
│   └── routes/
│       ├── ai.js         # Semua endpoint AI (summarize, flashcards, quiz, chat)
│       └── upload.js     # Upload teks & PDF, ekstraksi konten
└── client/               # React frontend
    ├── index.html
    ├── package.json
    ├── vite.config.js    # Vite config (proxy /api ke server:3001)
    └── src/
        ├── main.jsx      # React entry, BrowserRouter wrapper
        ├── App.jsx       # Routes + AnimatePresence + Toaster
        ├── index.css     # Global styles, CSS variables, dark theme
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   └── Footer.jsx
        └── pages/
            ├── Landing.jsx
            ├── Dashboard.jsx
            ├── Notes.jsx
            ├── Flashcards.jsx
            ├── Quiz.jsx
            └── Chat.jsx
```

---

## 4. Features

### 4.1 Input Materi
User bisa input konten lewat 2 cara:
- Paste teks langsung di text area
- Upload PDF (maks 20 MB), teks diekstrak otomatis via pdf-parse

### 4.2 Notes (Ringkasan AI)
- AI generate ringkasan terstruktur dari materi
- Format output: Ringkasan Utama > Poin Kunci > Tabel Konsep > Kesimpulan
- Endpoint: POST /api/ai/summarize

### 4.3 Flashcards
- AI generate kartu flashcard (default 10, maks 30)
- Tiap kartu: front (pertanyaan/istilah), back (jawaban/definisi), difficulty (mudah/sedang/sulit)
- UI interaktif: flip card, navigasi prev/next
- Endpoint: POST /api/ai/flashcards

### 4.4 Quiz
- AI generate soal pilihan ganda (default 10, maks 20)
- Tiap soal: question, options (A/B/C/D), answer, explanation
- UI: jawab soal > lihat skor > review per soal dengan penjelasan
- Endpoint: POST /api/ai/quiz

### 4.5 Chat AI Tutor
- Chat interaktif dengan BelajarIn AI
- Support konteks materi + riwayat percakapan
- AI persona: tutor ramah, bahasa Indonesia, pakai emoji secukupnya
- Endpoint: POST /api/ai/chat

---

## 5. API Routes

Server Base URL: http://localhost:3001

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | /api/health | - | { status, message, timestamp, version } |
| POST | /api/upload/text | { text } | { success, text, wordCount, charCount, preview } |
| POST | /api/upload/pdf | FormData: file (PDF) | { success, text, pages, wordCount, charCount, filename, filesize, preview } |
| POST | /api/ai/summarize | { text, title? } | { success, summary, title, wordCount } |
| POST | /api/ai/flashcards | { text, count? } | { success, flashcards[], count } |
| POST | /api/ai/quiz | { text, count? } | { success, questions[], count } |
| POST | /api/ai/chat | { message, context?, history? } | { success, reply, timestamp } |

### Data Shapes

Flashcard object:
```json
{
  "front": "Apa itu fotosintesis?",
  "back": "Proses tumbuhan mengubah cahaya matahari menjadi energi kimia",
  "difficulty": "mudah"
}
```

Quiz question object:
```json
{
  "question": "Teks pertanyaan",
  "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
  "answer": "B",
  "explanation": "Karena..."
}
```

Chat history item:
```json
{ "role": "user", "content": "teks pesan" }
```

---

## 6. Environment Setup

### Prerequisites
- Node.js >= 18
- Gemini API Key dari https://makersuite.google.com/app/apikey

### Install & Run

```bash
# Clone repo
git clone https://github.com/harismanciripto111/belajarin.git
cd belajarin

# Install semua dependencies (root + server + client)
npm run install:all

# Setup env
cp server/env.example server/.env
# Edit server/.env, isi GEMINI_API_KEY

# Jalankan dev (frontend + backend bersamaan)
npm run dev
```

### Environment Variables (server/.env)

```
GEMINI_API_KEY=your_gemini_api_key_here   # REQUIRED
PORT=3001                                   # Default: 3001
NODE_ENV=development                        # development | production
```

### Dev Ports
- Frontend (Vite): http://localhost:5173
- Backend (Express): http://localhost:3001
- Vite proxy: semua request ke /api diteruskan ke localhost:3001

---

## 7. Coding Rules & Conventions

### Umum
- Bahasa komentar & string UI: Indonesia
- Bahasa variabel/fungsi/file: English (camelCase)
- Quote style: single quote untuk JS, double quote untuk JSX attributes
- Indentasi: 2 spasi

### Frontend (React)
- Semua komponen pakai functional component + hooks (no class components)
- File komponen: PascalCase.jsx
- State lokal: useState, side effects: useEffect
- HTTP calls: gunakan axios (sudah dikonfigurasi proxy via Vite)
- Animasi page transition: gunakan framer-motion (motion.div, AnimatePresence)
- Toast notifikasi: selalu pakai react-hot-toast (sudah di-setup di App.jsx)
- Jangan bikin komponen baru kalau bisa extend yang sudah ada

### Backend (Node/Express)
- Semua routes pakai async/await dengan try-catch
- Error response format: { error: string, details?: string }
- Success response selalu include success: true
- Validasi input di awal setiap handler sebelum memanggil Gemini
- Model Gemini yang dipakai: gemini-1.5-flash
- Jangan hardcode API key, selalu lewat process.env.GEMINI_API_KEY

### Styling
- Dark theme: background utama #0F0E1A, accent utama #6C63FF (purple)
- CSS variables didefinisikan di client/src/index.css
- Gunakan variabel CSS yang sudah ada sebelum bikin nilai warna baru
- Font: Inter (Google Fonts)

### Git
- Commit message format: feat:, fix:, style:, refactor:, docs:
- Satu commit = satu perubahan logis
- Jangan commit file .env (sudah di .gitignore)

---

## 8. Common Patterns

### Fetch ke API (Frontend)
```js
// Gunakan axios, bukan fetch
import axios from 'axios'

const res = await axios.post('/api/ai/summarize', { text, title })
const { summary } = res.data
```

### Tambah Route Baru (Backend)
```js
// Di server/routes/ai.js atau file route baru
router.post('/endpoint-baru', async (req, res) => {
  try {
    const { param } = req.body
    if (!param) return res.status(400).json({ error: 'param wajib diisi' })

    const model = getModel()
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    res.json({ success: true, data: text })
  } catch (err) {
    console.error('[/endpoint-baru error]', err.message)
    res.status(500).json({ error: 'Gagal memproses', details: err.message })
  }
})
```

### Tambah Halaman Baru (Frontend)
1. Buat client/src/pages/NamaHalaman.jsx
2. Import di App.jsx
3. Tambah Route path dan element di App.jsx
4. Tambah link di Sidebar.jsx dan/atau Navbar.jsx

---

## 9. Known Constraints

- PDF yang di-upload harus text-based (bukan scan/image-only PDF) karena pdf-parse tidak bisa OCR
- Gemini response untuk flashcard & quiz harus di-parse sebagai JSON, ada helper cleanJSON() di ai.js untuk strip markdown code blocks sebelum JSON.parse()
- CORS dikonfigurasi hanya untuk localhost:5173, update server/index.js kalau deploy ke domain berbeda
- File upload limit: 20 MB (konfigurasi di upload.js multer)
- Request body limit: 10 MB (konfigurasi di server/index.js)

---

*Last updated: auto-generated by Nebula agent*
