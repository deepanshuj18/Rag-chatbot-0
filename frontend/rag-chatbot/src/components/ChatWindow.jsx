import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import './ChatWindow.css'

export default function ChatWindow({ messages, loading }) {
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    return (
        <div className="chat-window">
            <div className="messages-list">
                {messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
                {loading && <TypingIndicator />}
                <div ref={bottomRef} />
            </div>
        </div>
    )
}
