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
    // Filter State
    const [textOptions, setTextOptions] = useState([])
    const [selectedTextId, setSelectedTextId] = useState('')

    useEffect(() => {
        // Fetch random data for cards and all texts
        fetch('/api/get_home_data/')
            .then(res => res.json())
            .then(data => {
                setHomeData(data)
                if (data.all_texts) setTextOptions(data.all_texts)
            })
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

        let url = `/api/global_search/?q=${encodeURIComponent(searchQuery)}`
        if (selectedTextId) url += `&text_id=${selectedTextId}`

        fetch(url)
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

                <div className="notification-wrapper">
                    <button className="notification-btn" onClick={() => setShowNotifications(true)}>
                        🔔
                        {announcements.length > 0 && <span className="notification-badge">{announcements.length}</span>}
                    </button>
                </div>
            </header>

            <section className="search-hero">
                <form onSubmit={handleSearch} className="global-search-form">
                    <div className="search-inputs">
                        <select
                            className="text-filter-select"
                            value={selectedTextId}
                            onChange={(e) => setSelectedTextId(e.target.value)}
                        >
                            <option value="">すべての教材</option>
                            {textOptions.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="検索 (英/日)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">検索</button>
                </form>
            </section>

            {/* Notification Modal */}
            {showNotifications && (
                <div className="modal-overlay" onClick={() => setShowNotifications(false)}>
                    <div className="modal notification-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>📢 お知らせ</h3>
                            <button onClick={() => setShowNotifications(false)} className="icon-btn">✕</button>
                        </div>
                        <div className="announcements-list">
                            {announcements.length === 0 ? (
                                <p className="no-data">お知らせはありません。</p>
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
                        <h2>From 単語帳</h2>
                        <p className="subtitle">単語帳からテストを作成</p>
                        <ul>
                            {homeData.flat_test_texts.map((text, idx) => (
                                <li key={idx}> {text} </li>
                            ))}
                        </ul>
                        <div className="img-placeholder">
                            <img src="static/images/flattestsample.png" alt="flattest sample" />
                        </div>
                    </div>
                    <a href="/flatTestMaker/settings/" className="btn-outline">作成</a>
                </div>

                <div className="divider">OR</div>

                <div className="action-card card">
                    <div className="card-content">
                        <h2>From 教科書</h2>
                        <p className="subtitle">教科書からテストを作成</p>
                        <ul>
                            {homeData.structured_test_texts.map((text, idx) => (
                                <li key={idx}> {text} </li>
                            ))}
                        </ul>
                        <div className="img-placeholder">
                            <img src="static/images/constructedtestsample.png" alt="constructedtest sample" />
                        </div>
                    </div>
                    <a href="/structuredTest/settings" className="btn-outline">作成</a>
                </div>
            </div>

            <footer className="home-footer">
                <a href="/report/" className="footer-link">不具合報告・機能要望</a>
                <a href="/docs/" className="footer-link" target="_blank">ヘルプ</a>
                <a href="/login/" className="footer-link" target="_blank">管理者ダッシュボード</a>
                <a href="https://github.com/CloudWordCreator" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
            </footer>

            {
                showResults && (
                    <div className="modal-overlay" onClick={closeResults}>
                        <div className="modal results-modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>検索結果: "{searchQuery}"</h3>
                                <button onClick={closeResults} className="icon-btn">✕</button>
                            </div>
                            <div className="results-list">
                                {searchResults.length === 0 ? (
                                    <p>見つかりませんでした。</p>
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
