import { useState, useEffect } from 'react'
import './App.css'

function App() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)

    // 検索処理
    const handleSearch = async () => {
        setLoading(true)
        try {
            // APIエンドポイントを叩く
            const response = await fetch(`/eisai_admin/api/search_text/?text_query=${query}`)
            const data = await response.json()
            setResults(data.results)
        } catch (error) {
            console.error('Search failed:', error)
        } finally {
            setLoading(false)
        }
    }

    // 入力中のエンターキー対応
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    return (
        <div className="search-container">
            <h2>テキスト検索 (React)</h2>
            <div className="search-box">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="テキスト名を入力..."
                />
                <button onClick={handleSearch} disabled={loading}>
                    {loading ? '検索中...' : '検索'}
                </button>
            </div>

            <div className="results-list">
                {results.length > 0 ? (
                    <ul>
                        {results.map((text) => (
                            <li key={text.id}>
                                <a href={`/eisai_admin/edit_text/?text-id=${text.id}`}>
                                    {text.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>{query && !loading ? '見つかりませんでした。' : ''}</p>
                )}
            </div>
        </div>
    )
}

export default App
