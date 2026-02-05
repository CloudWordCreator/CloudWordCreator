import { useState, useEffect } from 'react'
import NavigationControls from './NavigationControls'
import { Link } from 'react-router-dom'

const ToeicAdmin = () => {
    const [words, setWords] = useState([])
    const [scores, setScores] = useState([]) // unique scores for filter
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterScore, setFilterScore] = useState('all')

    // Editing State
    const [editingWord, setEditingWord] = useState(null)
    const [showModal, setShowModal] = useState(false)

    // Pagination (Simple client-side for now or fetched all)
    // The current API fetches all or filtered. Let's fetch all initially or use the query API.
    // Given TOEIC list size (approx 1000-2000?), fetching all is okay for MVP but better to paginate.
    // For now we reuse the existing get_words API without filters to get everything? 
    // Wait, get_words requires filters or returns all? 
    // "queryset = ToeicWord.objects.all().order_by('no')" -> Returns all if no params.

    const fetchWords = async () => {
        setLoading(true)
        try {
            const res = await fetch('/toeic/api/words/')
            if (!res.ok) throw new Error('Failed to fetch')
            const data = await res.json()
            setWords(data.words)

            // Extract unique scores
            const uniqueScores = [...new Set(data.words.map(w => w.score))].sort((a, b) => a - b)
            setScores(uniqueScores)
        } catch (err) {
            console.error(err)
            alert('Load failed')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchWords()
    }, [])

    // Filter Logic
    const filteredWords = words.filter(w => {
        const matchesScore = filterScore === 'all' || String(w.score) === String(filterScore)
        const matchesSearch = searchQuery === '' ||
            w.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
            w.japanese.includes(searchQuery) ||
            w.phrase.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesScore && matchesSearch
    })

    // CRUD Handlers
    function getCookie(name) {
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

    const handleSave = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const payload = {
            id: editingWord?.id,
            no: formData.get('no'),
            score: formData.get('score'),
            english: formData.get('english'),
            japanese: formData.get('japanese'),
            phrase: formData.get('phrase'),
            phrase_jp: formData.get('phrase_jp')
        }

        try {
            const res = await fetch('/toeic/api/save_word/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            if (data.success) {
                setShowModal(false)
                setEditingWord(null)
                fetchWords()
            } else {
                alert('Error: ' + data.error)
            }
        } catch (err) {
            alert('Error: ' + err)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this word?')) return
        try {
            const res = await fetch('/toeic/api/delete_word/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
                body: JSON.stringify({ id: id })
            })
            if (res.ok) fetchWords()
        } catch (err) {
            alert('Error: ' + err)
        }
    }

    const openEdit = (word) => {
        setEditingWord(word)
        setShowModal(true)
    }

    const openCreate = () => {
        setEditingWord({})
        setShowModal(true)
    }

    return (
        <div className="container">
            <header className="dashboard-header" style={{ marginBottom: '20px' }}>
                <h1>TOEIC Admin</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to="/home/" className="button">Home</Link>
                    <a href="/admin/toeicManager/toeicword/import-csv/" target="_blank" className="button btn-primary">CSV Import (Legacy)</a>
                </div>
            </header>

            <div className="card toolbar">
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{ padding: '8px' }}
                    />
                    <select value={filterScore} onChange={e => setFilterScore(e.target.value)} style={{ padding: '8px' }}>
                        <option value="all">All Scores</option>
                        {scores.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button className="button btn-primary" onClick={openCreate}>+ Add Word</button>
                    <span style={{ marginLeft: 'auto' }}>Count: {filteredWords.length}</span>
                </div>
            </div>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>No</th>
                            <th style={{ padding: '10px' }}>Score</th>
                            <th style={{ padding: '10px' }}>English</th>
                            <th style={{ padding: '10px' }}>Japanese</th>
                            <th style={{ padding: '10px' }}>Phrase</th>
                            <th style={{ padding: '10px' }}>Phrase(JP)</th>
                            <th style={{ padding: '10px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan="7">Loading...</td></tr> :
                            filteredWords.map(w => (
                                <tr key={w.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '10px' }}>{w.no}</td>
                                    <td style={{ padding: '10px' }}>{w.score}</td>
                                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{w.english}</td>
                                    <td style={{ padding: '10px' }}>{w.japanese}</td>
                                    <td style={{ padding: '10px', fontSize: '0.9em' }}>{w.phrase}</td>
                                    <td style={{ padding: '10px', fontSize: '0.9em', color: '#666' }}>{w.phrase_jp}</td>
                                    <td style={{ padding: '10px' }}>
                                        <button onClick={() => openEdit(w)} className="btn-small" style={{ marginRight: '5px' }}>Edit</button>
                                        <button onClick={() => handleDelete(w.id)} className="btn-small" style={{ background: '#ff4444', color: 'white' }}>Del</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
                        <h3>{editingWord?.id ? 'Edit Word' : 'New Word'}</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group-row">
                                <label style={{ flex: 1 }}>
                                    No: <input name="no" type="number" defaultValue={editingWord.no} required style={{ width: '100%' }} />
                                </label>
                                <label style={{ flex: 1 }}>
                                    Score: <input name="score" type="number" defaultValue={editingWord.score} required style={{ width: '100%' }} />
                                </label>
                            </div>
                            <label style={{ display: 'block', marginTop: '10px' }}>
                                English: <input name="english" defaultValue={editingWord.english} required style={{ width: '100%' }} />
                            </label>
                            <label style={{ display: 'block', marginTop: '10px' }}>
                                Japanese: <input name="japanese" defaultValue={editingWord.japanese} required style={{ width: '100%' }} />
                            </label>
                            <label style={{ display: 'block', marginTop: '10px' }}>
                                Phrase: <input name="phrase" defaultValue={editingWord.phrase} style={{ width: '100%' }} />
                            </label>
                            <label style={{ display: 'block', marginTop: '10px' }}>
                                Phrase (JP): <input name="phrase_jp" defaultValue={editingWord.phrase_jp} style={{ width: '100%' }} />
                            </label>

                            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                                <button type="button" className="button" onClick={() => setShowModal(false)} style={{ marginRight: '10px' }}>Cancel</button>
                                <button type="submit" className="button btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ToeicAdmin
