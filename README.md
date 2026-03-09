# BelajarIn - Platform Belajar AI

> Platform belajar berbasis AI yang membantu kamu belajar lebih cerdas dan efisien.
> **Created by Raiman**

---

## Fitur Utama

- **Catatan AI** — Upload teks atau PDF, dapatkan ringkasan terstruktur otomatis
- **Flashcard Pintar** — Generate flashcard interaktif dari materi belajarmu
- **Quiz Otomatis** — Buat soal pilihan ganda seketika dari konten apapun
- **Chat Tutor AI** — Tanya jawab dengan AI tutor dalam Bahasa Indonesia

---

## Tech Stack

| Layer    | Teknologi                          |
|----------|------------------------------------|
| Frontend | React 18 + Vite + Framer Motion    |
| Backend  | Node.js + Express                  |
| AI       | Google Gemini API                  |
| Styling  | CSS Custom + Glassmorphism         |

---

## Prasyarat

Pastikan sudah terinstall:
- **Node.js** v18 atau lebih baru
- **npm** v9 atau lebih baru
- **Google Gemini API Key** — dapatkan di https://makersuite.google.com/app/apikey

---

## Cara Setup & Menjalankan

### 1. Clone / Download Project

```bash
git clone <repo-url>
cd belajarin
```

### 2. Install Semua Dependencies

```bash
npm run install:all
```

Perintah ini akan menginstall dependencies untuk root, client, dan server sekaligus.

### 3. Konfigurasi Environment Variable

Salin file contoh env di folder server:

```bash
cp server/.env.example server/.env
```

Kemudian buka `server/.env` dan isi dengan API key kamu:

```env
GEMINI_API_KEY=isi_api_key_gemini_kamu_disini
PORT=3001
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Ini akan menjalankan:
- **Backend** di `http://localhost:3001`
- **Frontend** di `http://localhost:5173`

Buka browser dan akses `http://localhost:5173`

---

## Struktur Folder

```
belajarin/
├── package.json              # Root package.json (concurrently)
├── README.md
├── server/
│   ├── package.json
│   ├── index.js              # Entry point Express server
│   ├── .env.example          # Template environment variables
│   └── routes/
│       ├── ai.js             # Routes: summarize, flashcards, quiz, chat
│       └── upload.js         # Routes: upload teks & PDF
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
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

## API Endpoints

### Health Check
```
GET /api/health
```

### AI Routes
```
POST /api/ai/summarize    — Ringkas teks
POST /api/ai/flashcards   — Generate flashcard
POST /api/ai/quiz         — Generate quiz
POST /api/ai/chat         — Chat dengan AI tutor
```

### Upload Routes
```
POST /api/upload/text     — Upload teks biasa
POST /api/upload/pdf      — Upload file PDF
```

---

## Build untuk Production

```bash
npm run build
```

File hasil build akan ada di `client/dist/`. Server Express akan otomatis serve static files dari folder tersebut.

Jalankan production server:
```bash
cd server && node index.js
```

Akses di `http://localhost:3001`

---

## Troubleshooting

**Q: Error "GEMINI_API_KEY is not set"**
A: Pastikan file `server/.env` sudah dibuat dan berisi API key yang valid.

**Q: Port sudah dipakai**
A: Ganti PORT di `server/.env` dan sesuaikan proxy di `client/vite.config.js`.

**Q: PDF tidak bisa diparse**
A: Pastikan file PDF tidak terenkripsi/password-protected.

---

## Lisensi

MIT License — Free to use and modify.

---

## Deploy ke VPS

### Persiapan VPS (Ubuntu/Debian)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

### Upload & Setup Project

```bash
# Upload project ke VPS (dari lokal)
scp -r ./belajarin user@IP_VPS:/var/www/belajarin

# SSH ke VPS
ssh user@IP_VPS

# Masuk ke folder project
cd /var/www/belajarin

# Install dependencies
npm run install:all

# Buat file .env
cp server/.env.example server/.env
nano server/.env
# Isi GEMINI_API_KEY=your_key_here

# Build frontend
npm run build
```

### Jalankan dengan PM2

```bash
# Jalankan server
cd /var/www/belajarin/server
NODE_ENV=production pm2 start index.js --name belajarin

# Auto-start saat reboot
pm2 startup
pm2 save

# Cek status
pm2 status
pm2 logs belajarin
```

### Konfigurasi Nginx

```bash
sudo nano /etc/nginx/sites-available/belajarin
```

Isi dengan:

```nginx
server {
    listen 80;
    server_name domain-kamu.com www.domain-kamu.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 10M;
}
```

```bash
# Aktifkan config
sudo ln -s /etc/nginx/sites-available/belajarin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL dengan Certbot (HTTPS)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d domain-kamu.com -d www.domain-kamu.com
```

---

*Created with love by **Raiman** — BelajarIn 2024*
