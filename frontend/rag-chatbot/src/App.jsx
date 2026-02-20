import { useState, useRef, useEffect } from 'react'
import ChatWindow from './components/ChatWindow'
import ChatInput from './components/ChatInput'
import './App.css'

const BACKEND_URL = 'http://localhost:8000'

export default function App() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'bot',
      text: 'Hello! I\'m the WattMonk RAG Chatbot. Upload your documents via the API and ask me anything — I\'ll find answers with source citations.',
      sources: [],
    }
  ])
  const [loading, setLoading] = useState(false)

  const sendMessage = async (query) => {
    if (!query.trim() || loading) return

    const userMsg = { id: Date.now(), role: 'user', text: query }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()

      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: data.response,
        sources: data.retrieved_docs || [],
      }
      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      const errMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: `⚠️ Could not reach the backend. Make sure the API is running at ${BACKEND_URL}.`,
        sources: [],
        isError: true,
      }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      {/* Ambient background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="chat-container">
        {/* Header */}
        <header className="header">
          <div className="header-inner">
            <div className="header-logo">
              <div className="logo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h1 className="header-title">Wattmonk RAG Chatbot</h1>
                <p className="header-subtitle">Powered by Advanced AI Technology</p>
              </div>
            </div>
            <div className="status-badge">
              <span className="status-dot" />
              Live
            </div>
          </div>
        </header>

        {/* Chat area */}
        <ChatWindow messages={messages} loading={loading} />

        {/* Input */}
        <ChatInput onSend={sendMessage} loading={loading} />
      </div>
    </div>
  )
}
