import './MessageBubble.css'

export default function MessageBubble({ message }) {
    const { role, text, sources, isError } = message
    const isUser = role === 'user'

    // Get unique sources from retrieved docs
    const uniqueSources = sources
        ? [...new Set(sources.map(s => s.metadata?.source_file).filter(Boolean))]
        : []

    return (
        <div className={`message-row ${isUser ? 'row-user' : 'row-bot'}`}>
            {!isUser && (
                <div className="avatar avatar-bot">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            )}

            <div className={`bubble ${isUser ? 'bubble-user' : 'bubble-bot'} ${isError ? 'bubble-error' : ''}`}>
                <p className="bubble-text">{text}</p>

                {!isUser && uniqueSources.length > 0 && (
                    <div className="source-section">
                        <span className="source-label">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Source{uniqueSources.length > 1 ? 's' : ''}:
                        </span>
                        {uniqueSources.map((src, i) => (
                            <span key={i} className="source-tag">{src}</span>
                        ))}
                    </div>
                )}
            </div>

            {isUser && (
                <div className="avatar avatar-user">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2.5" />
                    </svg>
                </div>
            )}
        </div>
    )
}
