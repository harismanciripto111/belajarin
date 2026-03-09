import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Notes from './pages/Notes.jsx'
import Flashcards from './pages/Flashcards.jsx'
import Quiz from './pages/Quiz.jsx'
import Chat from './pages/Chat.jsx'

function App() {
  const location = useLocation()
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3500, style: { background: '#1A1830', color: '#fff', border: '1px solid rgba(108, 99, 255, 0.3)', borderRadius: '12px' } }} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App
