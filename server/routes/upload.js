const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer config — store in memory for PDF parsing
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['application/pdf'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file PDF yang diizinkan'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB
});

// POST /api/upload/text
// Body: { text: string }
router.post('/text', (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Teks tidak boleh kosong' });
    }

    const trimmed = text.trim();
    const words = trimmed.split(/\s+/).filter(Boolean);
    const chars = trimmed.length;

    res.json({
      success: true,
      text: trimmed,
      wordCount: words.length,
      charCount: chars,
      preview: trimmed.slice(0, 200) + (trimmed.length > 200 ? '...' : '')
    });
  } catch (err) {
    console.error('[/upload/text error]', err.message);
    res.status(500).json({ error: 'Gagal memproses teks', details: err.message });
  }
});

// POST /api/upload/pdf
// Form-data: file (PDF)
router.post('/pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Tidak ada file yang diupload' });
    }

    // Lazy require pdf-parse to avoid startup issues
    let pdfParse;
    try {
      pdfParse = require('pdf-parse');
    } catch (e) {
      return res.status(500).json({ error: 'Modul pdf-parse tidak tersedia. Jalankan npm install di folder server.' });
    }

    const data = await pdfParse(req.file.buffer);
    const text = data.text.trim();

    if (!text || text.length === 0) {
      return res.status(422).json({
        error: 'PDF tidak mengandung teks yang dapat dibaca',
        hint: 'Pastikan PDF bukan hasil scan gambar (image-only PDF)'
      });
    }

    const words = text.split(/\s+/).filter(Boolean);

    res.json({
      success: true,
      text,
      pages: data.numpages,
      wordCount: words.length,
      charCount: text.length,
      filename: req.file.originalname,
      filesize: req.file.size,
      preview: text.slice(0, 300) + (text.length > 300 ? '...' : '')
    });
  } catch (err) {
    console.error('[/upload/pdf error]', err.message);
    if (err.message && err.message.includes('PDF')) {
      return res.status(422).json({ error: 'File PDF tidak valid atau rusak', details: err.message });
    }
    res.status(500).json({ error: 'Gagal memproses PDF', details: err.message });
  }
});

// Error handler for multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Ukuran file terlalu besar (maksimal 20 MB)' });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

module.exports = router;
