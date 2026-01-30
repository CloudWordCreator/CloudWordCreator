import { useState, useEffect } from 'react'

function Dashboard() {
    // Initial Data States
    const [unitTexts, setUnitTexts] = useState([])
    const [noUnitTexts, setNoUnitTexts] = useState([])
    const [loadingData, setLoadingData] = useState(true)

    // Search States
    const [query, setQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [searching, setSearching] = useState(false)

    // Fetch initial data on mount
    useEffect(() => {
        console.log('Fetching admin data...')
        fetch('/admin_screen/eisai_admin/api/init_data/')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                console.log('Admin data received:', data)
                setUnitTexts(data.unit_texts)
                setNoUnitTexts(data.no_unit_texts)
                setLoadingData(false)
            })
            .catch(err => {
                console.error("Failed to fetch admin data", err)
                setLoadingData(false)
            })
    }, [])

    // Search Logic
    const handleSearch = async () => {
        if (!query) return
        setSearching(true)
        try {
            const response = await fetch(`/admin_screen/eisai_admin/api/search_text/?text_query=${query}`)
            const data = await response.json()
            setSearchResults(data.results)
        } catch (error) {
            console.error('Search failed:', error)
        } finally {
            setSearching(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch()
    }

    const TextItem = ({ text }) => (
        <div className="text-item">
            <span className="text-name">{text.name}</span>
            <div className="actions">
                <a href={`/admin_screen/eisai_admin/edit_text/?text-id=${text.id}`} className="btn btn-edit">Edit</a>
                <a href={`/admin_screen/eisai_admin/delete_text/?text_id=${text.id}`} className="btn btn-delete" onClick={(e) => {
                    if (!confirm('本当に削除しますか？')) e.preventDefault()
                }}>Delete</a>
            </div>
        </div>
    )

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <a href="/csvManager/upload_csv/" className="btn btn-primary" target="_blank">教材の追加・取得</a>
            </header>

            <div className="search-section card">
                <h2>教材検索</h2>
                <div className="search-box">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search for text..."
                    />
                    <button onClick={handleSearch} disabled={searching} className="btn btn-search">
                        {searching ? 'Searching...' : 'Search'}
                    </button>
                </div>
                {searchResults.length > 0 && (
                    <div className="search-results">
                        <h3>検索結果</h3>
                        <div className="text-list">
                            {searchResults.map(text => <TextItem key={text.id} text={text} />)}
                        </div>
                    </div>
                )}
            </div>

            <div className="content-grid">
                <div className="card text-section">
                    <h2>Unit区切りの教材</h2>
                    {loadingData ? <p>Loading...</p> : (
                        <div className="text-list">
                            {unitTexts.map(text => <TextItem key={text.id} text={text} />)}
                            {unitTexts.length === 0 && <p className="empty-msg">No unit texts found.</p>}
                        </div>
                    )}
                </div>

                <div className="card text-section">
                    <h2>Unit区切りのない教材</h2>
                    {loadingData ? <p>Loading...</p> : (
                        <div className="text-list">
                            {noUnitTexts.map(text => <TextItem key={text.id} text={text} />)}
                            {noUnitTexts.length === 0 && <p className="empty-msg">No standalone texts found.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
