const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set');
  return new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: 'gemini-1.5-flash' });
};

const cleanJSON = (text) => text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();

router.post('/summarize', async (req, res) => {
  try {
    const { text, title } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: 'Teks tidak boleh kosong' });
    const model = getModel();
    const prompt = `Kamu adalah asisten belajar AI. Buatkan ringkasan terstruktur dalam Bahasa Indonesia dari materi berikut:\n${title ? `Judul: ${title}\n` : ''}\nMateri:\n${text}\n\nFormat:\n## Ringkasan Utama\n[paragraf singkat]\n\n## Poin-Poin Kunci\n- [poin]\n\n## Konsep Penting\n| Konsep | Penjelasan |\n|--------|------------|\n\n## Kesimpulan\n[kesimpulan]`;
    const result = await model.generateContent(prompt);
    res.json({ success: true, summary: result.response.text(), title: title || 'Ringkasan Materi', wordCount: text.split(/\s+/).length });
  } catch (err) {
    res.status(500).json({ error: 'Gagal membuat ringkasan', details: err.message });
  }
});

router.post('/flashcards', async (req, res) => {
  try {
    const { text, count = 10 } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: 'Teks tidak boleh kosong' });
    const cardCount = Math.min(Math.max(parseInt(count) || 10, 3), 30);
    const model = getModel();
    const prompt = `Buatkan ${cardCount} flashcard dari materi berikut dalam Bahasa Indonesia.\nMateri:\n${text}\n\nOutput JSON array:\n[{"front":"pertanyaan","back":"jawaban","difficulty":"mudah|sedang|sulit"}]`;
    const result = await model.generateContent(prompt);
    const flashcards = JSON.parse(cleanJSON(result.response.text()));
    res.json({ success: true, flashcards, count: flashcards.length });
  } catch (err) {
    res.status(500).json({ error: 'Gagal membuat flashcard', details: err.message });
  }
});

router.post('/quiz', async (req, res) => {
  try {
    const { text, count = 10 } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: 'Teks tidak boleh kosong' });
    const questionCount = Math.min(Math.max(parseInt(count) || 10, 3), 20);
    const model = getModel();
    const prompt = `Buatkan ${questionCount} soal pilihan ganda dari materi berikut dalam Bahasa Indonesia.\nMateri:\n${text}\n\nOutput JSON array:\n[{"question":"pertanyaan","options":{"A":"...","B":"...","C":"...","D":"..."},"answer":"A","explanation":"penjelasan"}]`;
    const result = await model.generateContent(prompt);
    const questions = JSON.parse(cleanJSON(result.response.text()));
    res.json({ success: true, questions, count: questions.length });
  } catch (err) {
    res.status(500).json({ error: 'Gagal membuat quiz', details: err.message });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { message, context, history = [] } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
    const model = getModel();
    const systemPrompt = `Kamu adalah BelajarIn AI, asisten tutor belajar yang cerdas dan ramah. Selalu gunakan Bahasa Indonesia. Gunakan emoji secukupnya.`;
    const contextSection = context?.trim() ? `\nKonteks Materi:\n${context}\n` : '';
    const historySection = history.length > 0 ? `\nRiwayat:\n${history.map(h => `${h.role === 'user' ? 'User' : 'AI'}: ${h.content}`).join('\n')}\n` : '';
    const fullPrompt = `${systemPrompt}${contextSection}${historySection}\nUser: ${message}\nAI:`;
    const result = await model.generateContent(fullPrompt);
    res.json({ success: true, reply: result.response.text(), timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mendapatkan respons AI', details: err.message });
  }
});

module.exports = router;
