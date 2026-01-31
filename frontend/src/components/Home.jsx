import { useState, useEffect } from 'react'

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [homeData, setHomeData] = useState({
        flat_test_texts: [],
        structured_test_texts: []
    })
    const [searchResults, setSearchResults] = useState([])
    const [showResults, setShowResults] = useState(false)
    const [announcements, setAnnouncements] = useState([])
    const [showNotifications, setShowNotifications] = useState(false)

    useEffect(() => {
        // Fetch random data for cards
        fetch('/api/get_home_data/')
            .then(res => res.json())
            .then(data => setHomeData(data))
            .catch(err => console.error(err))

        // Fetch announcements
        fetch('/api/get_announcements/')
            .then(res => res.json())
            .then(data => {
                if (data.announcements) setAnnouncements(data.announcements)
            })
            .catch(err => console.error(err))
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        if (!searchQuery.trim()) return

        fetch(`/api/global_search/?q=${encodeURIComponent(searchQuery)}`)
            .then(res => res.json())
            .then(data => {
                setSearchResults(data.results)
                setShowResults(true)
            })
            .catch(err => console.error(err))
    }

    const closeResults = () => {
        setShowResults(false)
        setSearchResults([])
    }

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>CloudWordCreator</h1>
                <p>Smart English Learning Platform</p>

                <div className="notification-wrapper">
                    <button className="notification-btn" onClick={() => setShowNotifications(true)}>
                        🔔
                        {announcements.length > 0 && <span className="notification-badge">{announcements.length}</span>}
                    </button>
                </div>
            </header>

            <section className="search-hero">
                <form onSubmit={handleSearch} className="global-search-form">
                    <input
                        type="text"
                        placeholder="Search for a word (Eng/Jp)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>
            </section>

            {/* Notification Modal */}
            {showNotifications && (
                <div className="modal-overlay" onClick={() => setShowNotifications(false)}>
                    <div className="modal notification-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>📢 What's New</h3>
                            <button onClick={() => setShowNotifications(false)} className="icon-btn">✕</button>
                        </div>
                        <div className="announcements-list">
                            {announcements.length === 0 ? (
                                <p className="no-data">No new announcements.</p>
                            ) : (
                                announcements.map(ann => (
                                    <div key={ann.id} className={`announcement-item ${ann.category.toLowerCase()}`}>
                                        <div className="ann-header">
                                            <span className="ann-date">{ann.created_at}</span>
                                            <span className={`ann-tag tag-${ann.category.toLowerCase()}`}>{ann.category_display}</span>
                                        </div>
                                        <div className="ann-content">
                                            <h4>{ann.title}</h4>
                                            {ann.content && <p>{ann.content}</p>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="cards-container">
                <div className="action-card card">
                    <div className="card-content">
                        <h2>Flat Test Maker</h2>
                        <p className="subtitle">Create tests from word lists (CSV)</p>
                        <ul>
                            {homeData.flat_test_texts.map((text, idx) => (
                                <li key={idx}> {text} </li>
                            ))}
                        </ul>
                        <div className="img-placeholder">
                            <span>📄 List Based</span>
                        </div>
                    </div>
                    <a href="/flatTestMaker/settings/" className="btn-outline">Create Test</a>
                </div>

                <div className="divider">OR</div>

                <div className="action-card card">
                    <div className="card-content">
                        <h2>Structured Test</h2>
                        <p className="subtitle">Create tests from Textbooks</p>
                        <ul>
                            {homeData.structured_test_texts.map((text, idx) => (
                                <li key={idx}> {text} </li>
                            ))}
                        </ul>
                        <div className="img-placeholder">
                            <span>📚 Textbook Based</span>
                        </div>
                    </div>
                    <a href="/structuredTest/settings" className="btn-outline">Select Units</a>
                </div>
            </div>

            <footer className="home-footer">
                <a href="/report/" className="footer-link">Report Bug / Request Feature</a>
                <a href="/login/" className="footer-link">Admin Dashboard</a>
                <a href="https://github.com/sabax/CloudWordCreator" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
            </footer>

            {
                showResults && (
                    <div className="modal-overlay" onClick={closeResults}>
                        <div className="modal results-modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Search Results: "{searchQuery}"</h3>
                                <button onClick={closeResults} className="icon-btn">✕</button>
                            </div>
                            <div className="results-list">
                                {searchResults.length === 0 ? (
                                    <p>No words found.</p>
                                ) : (
                                    searchResults.map((result, idx) => (
                                        <div key={idx} className="result-item">
                                            <div className="result-main">
                                                <span className="en"><strong>{result.english}</strong></span>
                                                <span className="jp">{result.japanese}</span>
                                            </div>
                                            <div className="result-meta">
                                                <span className="source-tag">{result.source}</span>
                                                {result.text} {result.unit ? `- ${result.unit}` : ''}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}

export default Home
