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

    // Notification Management States
    const [showAnnouncementsModal, setShowAnnouncementsModal] = useState(false)
    const [announcements, setAnnouncements] = useState([])
    const [editingAnnouncement, setEditingAnnouncement] = useState(null)

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
    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const fetchAnnouncements = () => {
        fetch('/admin_screen/eisai_admin/api/get_announcements/')
            .then(res => res.json())
            .then(data => {
                if (data.announcements) setAnnouncements(data.announcements)
            })
            .catch(err => console.error(err))
    }

    const openAnnouncementsModal = () => {
        fetchAnnouncements()
        setShowAnnouncementsModal(true)
        setEditingAnnouncement(null)
    }

    const handleSaveAnnouncement = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const annData = {
            id: editingAnnouncement?.id,
            title: formData.get('title'),
            content: formData.get('content'),
            category: formData.get('category'),
            is_active: formData.get('is_active') === 'on'
        }

        try {
            const res = await fetch('/admin_screen/eisai_admin/api/save_announcement/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
                body: JSON.stringify(annData)
            })
            if (res.ok) {
                fetchAnnouncements()
                setEditingAnnouncement(null)
            } else {
                alert('Save failed')
            }
        } catch (err) { alert('Error: ' + err) }
    }

    const handleDeleteAnnouncement = async (id) => {
        if (!confirm('Delete this announcement?')) return
        try {
            const res = await fetch('/admin_screen/eisai_admin/api/delete_announcement/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
                body: JSON.stringify({ id: id })
            })
            if (res.ok) fetchAnnouncements()
        } catch (err) { alert('Error: ' + err) }
    }

    const handleDeleteText = async (id) => {
        if (!confirm('本当に削除しますか？')) return
        try {
            const res = await fetch('/admin_screen/eisai_admin/api/delete_text/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
                body: JSON.stringify({ id: id })
            })
            const data = await res.json()
            if (data.success) {
                // Refresh data
                setLoadingData(true)
                // Re-fetch all data
                // Quick hack: just reload page or refetch logic
                // Better: extract fetchData logic to a function and call it
                window.location.reload()
            } else {
                alert('Error: ' + data.error)
            }
        } catch (err) { alert('Error: ' + err) }
    }

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
                <a href={`/admin_screen/eisai_admin/edit_text/?text-id=${text.id}`} className="btn btn-edit">編集</a>
                <button className="btn btn-delete" onClick={() => handleDeleteText(text.id)}>削除</button>
            </div>
        </div>
    )

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <div className="header-buttons">
                    <button className="btn" onClick={openAnnouncementsModal}>🔔 お知らせ管理</button>
                    <a href="/csv_set/upload_csv/" className="btn btn-primary" target="_blank">教材の追加・取得</a>
                </div>
            </header>

            {/* Notifications Modal */}
            {showAnnouncementsModal && (
                <div className="modal-overlay" onClick={() => setShowAnnouncementsModal(false)}>
                    <div className="modal card" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                        <div className="modal-header">
                            <h3>お知らせ管理</h3>
                            <button onClick={() => setShowAnnouncementsModal(false)} className="icon-btn">✕</button>
                        </div>

                        <div className="content-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                            {/* List Section */}
                            <div className="ann-list-section">
                                <div className="toolbar" style={{ marginBottom: '10px' }}>
                                    <button className="btn btn-primary btn-sm" onClick={() => setEditingAnnouncement({})}>+ 新規お知らせ</button>
                                </div>
                                <div className="text-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {announcements.map(ann => (
                                        <div key={ann.id} className="text-item" style={{ opacity: ann.is_active ? 1 : 0.6 }}>
                                            <div>
                                                <span className={`ann-tag tag-${ann.category.toLowerCase()}`}>{ann.category}</span>
                                                <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>{ann.title}</span>
                                            </div>
                                            <div className="actions">
                                                <button className="icon-btn" onClick={() => setEditingAnnouncement(ann)}>✎</button>
                                                <button className="icon-btn delete" onClick={() => handleDeleteAnnouncement(ann.id)}>×</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Edit/Create Section */}
                            {editingAnnouncement && (
                                <div className="ann-edit-section" style={{ borderLeft: '1px solid #eee', paddingLeft: '20px' }}>
                                    <h4>{editingAnnouncement.id ? 'お知らせの編集' : '新規お知らせ'}</h4>
                                    <form onSubmit={handleSaveAnnouncement}>
                                        <div className="form-group">
                                            <label>タイトル</label>
                                            <input name="title" defaultValue={editingAnnouncement.title || ''} required />
                                        </div>
                                        <div className="form-group">
                                            <label>内容</label>
                                            <textarea className="form-textarea" name="content" defaultValue={editingAnnouncement.content || ''} rows="4"></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label>カテゴリー</label>
                                            <select name="category" defaultValue={editingAnnouncement.category || 'INFO'}>
                                                <option value="INFO">お知らせ</option>
                                                <option value="UPDATE">更新</option>
                                                <option value="MATERIAL">教材</option>
                                                <option value="MAINTENANCE">メンテナンス</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="checkbox-label">
                                                <input type="checkbox" name="is_active" defaultChecked={editingAnnouncement.is_active !== false} />
                                                公開する
                                            </label>
                                        </div>
                                        <div className="form-actions">
                                            <button type="submit" className="btn btn-primary">保存</button>
                                            <button type="button" className="btn" onClick={() => setEditingAnnouncement(null)}>キャンセル</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="search-section card">
                <h2>教材検索</h2>
                <div className="search-box">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="検索..."
                    />
                    <button onClick={handleSearch} disabled={searching} className="btn btn-search">
                        {searching ? '検索中...' : '検索'}
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
