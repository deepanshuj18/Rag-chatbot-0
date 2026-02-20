import { useState, useRef } from 'react'
import './ChatInput.css'

export default function ChatInput({ onSend, loading }) {
    const [value, setValue] = useState('')
    const textareaRef = useRef(null)

    const handleSend = () => {
        const trimmed = value.trim()
        if (!trimmed || loading) return
        onSend(trimmed)
        setValue('')
        textareaRef.current.style.height = 'auto'
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleInput = () => {
        const el = textareaRef.current
        el.style.height = 'auto'
        el.style.height = Math.min(el.scrollHeight, 140) + 'px'
    }

    return (
        <div className="input-area">
            <div className={`input-box ${loading ? 'input-box-loading' : ''}`}>
                <textarea
                    ref={textareaRef}
                    className="input-textarea"
                    placeholder="Type your message…"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onInput={handleInput}
                    rows={1}
                    disabled={loading}
                />
                <button
                    className={`send-btn ${value.trim() && !loading ? 'send-btn-active' : ''}`}
                    onClick={handleSend}
                    disabled={!value.trim() || loading}
                    aria-label="Send message"
                >
                    {loading ? (
                        <span className="spinner" />
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </button>
            </div>
            <p className="input-hint">Press Enter to send · Shift+Enter for new line</p>
        </div>
    )
}
